import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        // 2. Gemini 1.5 Flash Core (Google AI Layer)
        if (process.env.GEMINI_API_KEY) {
            try {
                const startTime = Date.now();

                // Gemini 2.0 Flash (Next-Gen High Speed Model)
                // Confirmed available via model list check.
                const MODEL_ID = 'gemini-2.0-flash';

                const systemInstruction = `You are an Enterprise Security Architect. Output ONLY valid JSON.
Fields:
- name (uppercase string)
- pattern (valid regex)
- action ('BLOCK' or 'LOG_ONLY')
- description (brief)
- explanation (professional technical summary)
- compliance (Array of strings, e.g. ['PCI-DSS 4.0', 'GDPR'] - only if relevant)
- safetyScore (0-100 confidence)
- testCases ({match: string[], noMatch: string[]})

CRITICAL: Be extremely precise. If user specifies a vendor (e.g. 'Visa'), DO NOT match others (e.g. 'Mastercard').`;

                const res = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${process.env.GEMINI_API_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: `${systemInstruction}\n\nUser Request: ${prompt}` }]
                            }],
                            generationConfig: {
                                temperature: 0.1 // Low temperature for deterministic code generation
                            }
                        })
                    }
                );

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Gemini API Error', errorText);
                    throw new Error(`Gemini API ${res.status}: ${errorText}`);
                }

                const data = await res.json();
                const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

                // Robust JSON Extraction
                // Handles Markdown wrapping, whitespace, and stray characters
                let result;
                try {
                    const jsonStart = rawText.indexOf('{');
                    const jsonEnd = rawText.lastIndexOf('}');
                    if (jsonStart !== -1 && jsonEnd !== -1) {
                        const jsonStr = rawText.substring(jsonStart, jsonEnd + 1);
                        result = JSON.parse(jsonStr);
                    } else {
                        throw new Error('No JSON payload found in response');
                    }
                } catch (parseError) {
                    console.error('JSON Parse Failure', rawText);
                    throw new Error('AI generated invalid structure');
                }

                // 3. Real Impact Analysis
                let impactAnalysis = { matches: 0, total: 0, impactPercent: '0.00%', samples: [] as any[] };
                try {
                    const { db } = await import('@/lib/store');
                    const scan = await db.scanHistoricalLogs(result.pattern);
                    impactAnalysis = {
                        matches: scan.matches,
                        total: scan.total,
                        impactPercent: scan.total > 0 ? ((scan.matches / scan.total) * 100).toFixed(2) + '%' : '0.00%',
                        samples: scan.impactStats
                    };
                } catch (err) { console.error('Impact Scan Error', err); }

                return NextResponse.json({
                    source: `GEMINI_2.0_FLASH`,
                    latency: `${Date.now() - startTime}ms`,
                    ...result,
                    impactAnalysis,
                    id: Date.now().toString()
                });

            } catch (error: any) {
                console.error('Gemini Execution Failed', error);

                // Return Error to UI instead of Offline Mode
                return NextResponse.json({
                    source: 'SYSTEM_ERROR',
                    name: 'NEURAL_FAILURE',
                    pattern: 'ERROR',
                    action: 'LOG_ONLY',
                    explanation: error.message || 'Unknown Neural Error',
                    safetyScore: 0,
                    testCases: { match: [], noMatch: [] }
                });
            }
        }

        // 4. Fallback Heuristic
        return NextResponse.json({
            source: 'OFFLINE_FALLBACK',
            name: 'OFFLINE_MODE',
            pattern: prompt,
            action: 'LOG_ONLY',
            explanation: 'System is running in offline mode. Please configure GEMINI_API_KEY.',
            safetyScore: 0,
            testCases: { match: [], noMatch: [] }
        });

    } catch (e) {
        return NextResponse.json({ error: 'Internal Neural Failure' }, { status: 500 });
    }
}
