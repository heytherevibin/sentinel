import React, { useState, useEffect } from 'react';
import { Shield, Brain, Activity, Lock, AlertTriangle, CheckCircle, Zap, Terminal, Globe, Key, Command, History, Cpu } from 'lucide-react';
import { TechCard } from './TechCard';

interface NeuralCoreProps {
    status: 'idle' | 'processing' | 'active';
    analysis: any;
    testInput: string;
    setTestInput: (val: string) => void;
    testResult: boolean | null;
}

export const NeuralCore: React.FC<NeuralCoreProps> = ({ status, analysis, testInput, setTestInput, testResult }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (status === 'active' && analysis?.explanation) {
            setDisplayedText('');
            let i = 0;
            const timer = setInterval(() => {
                setDisplayedText(analysis.explanation.substring(0, i));
                i++;
                if (i > analysis.explanation.length) clearInterval(timer);
            }, 8);
            return () => clearInterval(timer);
        } else {
            setDisplayedText('');
        }
    }, [status, analysis]);

    if (status === 'idle') {
        return (
            <TechCard title="STRATEGIC_REFLEX_LEDGER // STANDBY" status="normal" className="h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
                <div className="h-full flex flex-col items-center justify-center gap-6 text-zinc-800">
                    <div className="relative">
                        <div className="absolute inset-0 bg-zinc-800/10 blur-2xl rounded-full" />
                        <Activity size={40} className="text-zinc-900" />
                    </div>
                    <div className="text-center space-y-1">
                        <div className="text-[10px] font-bold tracking-[0.4em] uppercase">Reflex Ledger Standby</div>
                        <div className="text-[9px] italic opacity-50 tracking-widest uppercase">Awaiting Vector Synthesis...</div>
                    </div>
                </div>
            </TechCard>
        );
    }

    if (status === 'processing') {
        return (
            <TechCard title="STRATEGIC_REFLEX_LEDGER // PROCESSING" status="warning" className="h-full relative">
                <div className="h-full flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                        <div className="absolute inset-2 border-2 border-emerald-950 border-b-emerald-700/50 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                    </div>
                    <div className="text-center space-y-1 animate-pulse">
                        <div className="text-[10px] font-bold text-emerald-500 tracking-[0.2em] uppercase">Generating Defense Matrix</div>
                        <div className="text-[8px] text-emerald-900 uppercase font-bold tracking-widest">Bridging Gemini_2.0_Flash</div>
                    </div>
                </div>
            </TechCard>
        );
    }

    // Active State - High Density Ledger
    const isSafe = analysis?.safetyScore > 80;

    return (
        <TechCard
            title={`ANALYSIS_REPORT :: ${analysis?.name || 'UNKNOWN'}`}
            status={isSafe ? 'normal' : 'warning'}
            className="h-full flex flex-col"
            toolbar={
                <div className="flex items-center gap-2">
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">ID: {analysis?.id?.slice(-8)}</span>
                </div>
            }
        >
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">

                {/* 1. Executive Metadata (HUD Style) */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-zinc-950/50 border border-zinc-900 rounded-sm p-2 flex flex-col gap-1">
                        <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">Risk Factor</span>
                        <span className={`text-sm font-bold ${analysis.safetyScore < 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {100 - analysis.safetyScore}%
                        </span>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-900 rounded-sm p-2 flex flex-col gap-1">
                        <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">Blast_Rad</span>
                        <span className="text-sm font-bold text-amber-500">
                            {analysis.impactAnalysis?.impactPercent || '0.00%'}
                        </span>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-900 rounded-sm p-2 flex flex-col gap-1">
                        <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">Latency</span>
                        <span className="text-sm font-bold text-zinc-300">
                            {analysis.latency || '---'}
                        </span>
                    </div>
                </div>

                {/* 2. Optimized Regex Payload */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">
                        <div className="flex items-center gap-2">
                            <Terminal size={10} className="text-emerald-500/50" />
                            <span>Synthesized_Regex</span>
                        </div>
                        <span className="text-emerald-500/50">SECURE_PAYLOAD</span>
                    </div>
                    <div className="bg-black/80 border border-zinc-900 rounded p-4 relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-[8px] bg-zinc-900 px-2 py-1 rounded text-zinc-400 hover:text-white border border-zinc-800 uppercase font-bold">Copy</button>
                        </div>
                        <code className="text-xs font-mono text-emerald-400/90 break-all leading-relaxed">
                            {analysis.pattern}
                        </code>
                    </div>
                </div>

                {/* 3. Deep Analysis Stream */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">
                        <Brain size={10} className="text-emerald-500/50" />
                        <span>Intelligence_Reflex</span>
                    </div>
                    <div className="bg-zinc-950/40 border-l-[1px] border-emerald-500/30 p-4 min-h-[100px] backdrop-blur-sm">
                        <div className="flex gap-2 mb-3">
                            {analysis.compliance?.map((c: string, i: number) => (
                                <span key={i} className="text-[8px] font-black px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-sm uppercase tracking-widest">
                                    {c}
                                </span>
                            ))}
                        </div>
                        <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                            {displayedText}
                            <span className="w-1.5 h-3 bg-emerald-500 inline-block align-middle ml-1 animate-pulse" />
                        </p>
                    </div>
                </div>

                {/* 4. Live Validation Deck */}
                <div className="mt-auto space-y-3 pt-4 border-t border-zinc-900">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
                            <Key size={10} className="text-emerald-500/50" />
                            <span>Validation_Vector</span>
                        </div>
                        <div className={`text-[8px] font-black px-2 py-0.5 rounded-sm ${testResult ? 'bg-emerald-500/10 text-emerald-500' : testResult === false ? 'bg-rose-500/10 text-rose-500' : 'bg-zinc-900 text-zinc-600'}`}>
                            {testResult === true ? 'MATCH_CONFIRMED' : testResult === false ? 'NEGATIVE_SYNC' : 'READY_FOR_VECTOR'}
                        </div>
                    </div>

                    <div className="relative group">
                        <input
                            className={`w-full bg-black/60 border ${testResult === true ? 'border-emerald-500/40 text-emerald-200' : testResult === false ? 'border-rose-500/40 text-rose-200' : 'border-zinc-800 text-zinc-400'} p-3 text-[10px] font-mono focus:outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-800 placeholder:italic`}
                            placeholder="INPUT_TEST_STRING_TO_VALIDATE_PATTERN..."
                            value={testInput}
                            onChange={(e) => setTestInput(e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-800 pointer-events-none transition-opacity group-focus-within:opacity-0 font-black">ASCII</div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {analysis.testCases?.match?.map((ex: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => setTestInput(ex)}
                                className="whitespace-nowrap px-3 py-1.5 bg-zinc-950/50 border border-zinc-900 hover:border-emerald-500/40 text-[9px] text-zinc-500 hover:text-emerald-400 transition-all font-black uppercase tracking-widest rounded-sm"
                            >
                                Sample_{i + 1}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </TechCard>
    );
};
