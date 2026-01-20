'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Activity, History, Sparkles, Zap, Command, ShieldCheck, ShieldAlert, Fingerprint, Database, Network, Terminal, Cpu, Flame, Target, Binary, LineChart, ChevronRight, AlertTriangle } from 'lucide-react';
import { TechCard } from '@/components/TechCard';
import { IntrospectionStatus } from '@/components/IntrospectionStatus';
import { NeuralCore } from '@/components/NeuralCore';
import { NeuralAlignmentGauge } from '@/components/NeuralAlignmentGauge';

export default function NeuralLabPage() {
    const [prompt, setPrompt] = useState('');
    const [status, setStatus] = useState<'idle' | 'processing' | 'active'>('idle');
    const [analysis, setAnalysis] = useState<any>(null);
    const [testInput, setTestInput] = useState('');
    const [testResult, setTestResult] = useState<boolean | null>(null);
    const [neuralHeat, setNeuralHeat] = useState<number[]>([]);

    // Simulated Neural Heat (Token Probabilities)
    useEffect(() => {
        const interval = setInterval(() => {
            setNeuralHeat(prev => {
                const next = [...prev, Math.random() * 100].slice(-24);
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Test input regex matching
    useEffect(() => {
        if (analysis?.pattern && testInput) {
            try {
                const regex = new RegExp(analysis.pattern, 'i');
                setTestResult(regex.test(testInput));
            } catch (e) {
                setTestResult(false);
            }
        } else {
            setTestResult(null);
        }
    }, [testInput, analysis]);

    const runAnalysis = async (customPrompt?: string) => {
        const activePrompt = customPrompt || prompt;
        if (!activePrompt.trim() || status === 'processing') return;

        setStatus('processing');
        try {
            const res = await fetch('/api/ai/policy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: activePrompt })
            });
            const data = await res.json();
            setAnalysis(data);
            setStatus('active');
        } catch (error) {
            console.error('Analysis Failed', error);
            setStatus('idle');
        }
    };

    const triggerScenario = (scenario: string) => {
        setPrompt(scenario);
        runAnalysis(scenario);
    };

    return (
        <main className="h-full bg-transparent text-zinc-300 flex flex-col font-mono overflow-hidden selection:bg-emerald-950/30 relative">

            {/* Neural Lab Workspace (12-Column Grid) */}
            <div className="flex-1 p-6 grid grid-cols-12 gap-8 min-h-0 overflow-hidden relative z-10">

                {/* Left Sidebar (3 cols) */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-8 min-h-0">

                    {/* Neural Alignment & Confidence */}
                    <TechCard title="NEURAL_METRICS // CONFIDENCE" className="shrink-0 flex flex-col gap-4">
                        <div className="flex flex-col gap-6 p-1">
                            {/* Alignment Gauge */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 px-1">
                                    <Brain size={12} className="text-emerald-500" />
                                    <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase">Neural Alignment</span>
                                </div>
                                <NeuralAlignmentGauge score={analysis?.safetyScore || 0} status={status} />
                            </div>

                            {/* Token Heat Micro-Chart */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center px-1">
                                    <div className="flex items-center gap-2">
                                        <LineChart size={12} className="text-blue-500" />
                                        <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase">Neural Heat (T/Prob)</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-blue-500 font-bold">STABLE</span>
                                </div>
                                <div className="h-10 flex items-end gap-[2px] bg-zinc-950/50 border border-zinc-900 rounded-sm p-1">
                                    {neuralHeat.map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-blue-500/20 group-hover:bg-blue-500/40 transition-all rounded-t-[1px]"
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TechCard>

                    {/* Mesh Protocol Deck */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        <IntrospectionStatus />
                    </div>

                </div>

                {/* Right Main Area (9 cols) */}
                <div className="col-span-12 md:col-span-9 flex flex-col min-h-0 gap-8">

                    {/* Top: Adversarial Sandbox (Expansion) */}
                    <div className="shrink-0 flex flex-col min-h-0 gap-4">
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2">
                                <Flame size={14} className="text-rose-500" />
                                <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Adversarial Simulation Deck</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">Simulation Context: Isolated_Lab</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <SimulationButton
                                icon={<Target className="text-rose-500" size={14} />}
                                label="Exfiltration_Flight"
                                color="rose"
                                onClick={() => triggerScenario("Simulate a massive data exfiltration event over HTTPS via Discord Webhooks.")}
                            />
                            <SimulationButton
                                icon={<ShieldAlert className="text-amber-500" size={14} />}
                                label="PII_Leak_Vectors"
                                color="amber"
                                onClick={() => triggerScenario("Trigger 10+ mock SSN and Credit Card numbers in a Slack message attachment.")}
                            />
                            <SimulationButton
                                icon={<Network className="text-blue-500" size={14} />}
                                label="C2_Call_Pattern"
                                color="blue"
                                onClick={() => triggerScenario("Mirror typical C2 beaconing behavior for a Cobalt Strike teamserver.")}
                            />
                            <SimulationButton
                                icon={<Binary className="text-emerald-500" size={14} />}
                                label="Ransomware_Scan"
                                color="emerald"
                                onClick={() => triggerScenario("Scan for rapid, bulk file-renaming operations typical of LockBit exfiltration.")}
                            />
                        </div>
                    </div>

                    {/* Middle: NEURAL_SANDBOX (IDE Style) */}
                    <TechCard
                        title="NEURAL_SANDBOX // EXPERIMENTAL_IDE"
                        status={status === 'processing' ? 'active' : 'normal'}
                        className="h-[320px] shrink-0 flex flex-col relative group"
                        toolbar={
                            <div className="flex items-center gap-4">
                                <div className="flex bg-zinc-950/50 p-0.5 rounded border border-zinc-800">
                                    <button onClick={() => setPrompt('')} className="px-2 py-0.5 text-[7px] font-bold tracking-widest rounded-[1px] text-zinc-500 hover:text-zinc-200 transition-all uppercase">Reset</button>
                                </div>
                                <div className="flex items-center gap-2 px-2 border-l border-zinc-800 ml-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Vector Stable</span>
                                </div>
                            </div>
                        }
                    >
                        <div className="flex-1 flex flex-col relative bg-black/60 overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-zinc-950/40 border-r border-zinc-900 flex flex-col items-center pt-4 select-none pointer-events-none">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <span key={i} className="text-[9px] text-zinc-800 font-mono mb-1">{(i + 1).toString().padStart(2, '0')}</span>
                                ))}
                            </div>

                            <div className="flex-1 ml-8 relative pt-2">
                                <textarea
                                    className="w-full h-full bg-transparent border-none text-emerald-100/90 font-mono text-sm resize-none focus:outline-none placeholder:text-zinc-800 leading-relaxed custom-scrollbar p-2 mt-1"
                                    placeholder="INITIATE_VIRTUAL_NEURAL_VECTOR_SYNTHESIS..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>

                            <div className="bg-zinc-950/80 border-t border-zinc-900 p-3 flex justify-between items-center backdrop-blur-md">
                                <div className="flex gap-2">
                                    <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded-sm border border-zinc-800">Prompt_v2.1</span>
                                    <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded-sm border border-zinc-800">Gemini_Flash</span>
                                </div>

                                <button
                                    onClick={() => runAnalysis()}
                                    disabled={!prompt.trim() || status === 'processing'}
                                    className={`flex items-center gap-3 px-8 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] transition-all ${prompt.trim() && status !== 'processing'
                                        ? 'bg-emerald-500 text-black shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)] active:scale-95'
                                        : 'bg-zinc-900 text-zinc-700 border border-zinc-800 cursor-not-allowed shadow-none font-bold'
                                        }`}
                                >
                                    {status === 'processing' ? <Activity size={14} className="animate-spin" /> : <Command size={14} />}
                                    {status === 'processing' ? 'PROCESSING' : 'SYNTHESIZE'}
                                </button>
                            </div>
                        </div>
                    </TechCard>

                    {/* Bottom: Strategic Reflex Ledger */}
                    <div className="flex-1 min-h-0">
                        <NeuralCore
                            status={status}
                            analysis={analysis}
                            testInput={testInput}
                            setTestInput={setTestInput}
                            testResult={testResult}
                        />
                    </div>

                </div>

            </div>

            {/* Matrix Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('/grid.svg')] bg-[length:30px_30px]" />
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/[0.015] blur-[150px] pointer-events-none z-[-1]" />
        </main>
    );
}

const SimulationButton = ({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex flex-col gap-3 p-4 bg-zinc-950/40 border border-zinc-900 rounded-sm hover:border-${color}-500/30 group transition-all text-left relative overflow-hidden`}
    >
        <div className={`absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-10 transition-opacity`}>
            {icon}
        </div>
        <div className={`w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded group-hover:bg-${color}-500/10 group-hover:border-${color}-500/20 transition-all`}>
            {icon}
        </div>
        <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-zinc-200 uppercase tracking-widest">{label}</span>
            <span className="text-[8px] text-zinc-700 font-bold uppercase tracking-tighter">Initiate_Mock_Target</span>
        </div>
    </button>
);
