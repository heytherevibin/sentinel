'use client';

import React, { useState, useEffect } from 'react';
import { CircuitBoard, Server, RefreshCw, Terminal, Command, Shield, Zap, Activity, Brain } from 'lucide-react';
import { TechCard } from '@/components/TechCard';
import { Navigation } from '@/components/Navigation';
import Link from 'next/link';
import { PolicyStructureDiagram } from '@/components/PolicyStructureDiagram';

export default function PolicyForge() {
    const [policies, setPolicies] = useState<any[]>([]);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeVersion, setActiveVersion] = useState('v1.0.0');

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        const res = await fetch('/api/telemetry/heartbeat');
        const data = await res.json();
        setPolicies(data.policies || []);
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setTimeout(() => {
            const newPolicies = [...policies]; // Demo logic preserved
            const timestamp = Date.now().toString();

            if (prompt.toLowerCase().includes('aws')) {
                newPolicies.push({
                    id: timestamp,
                    name: 'AWS_KEY_BLOCK_V2',
                    pattern: '(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])',
                    action: 'BLOCK',
                    description: 'AUTO-GEN: AWS IAM ACCESS KEY PATTERN'
                });
            } else if (prompt.toLowerCase().includes('python')) {
                newPolicies.push({
                    id: timestamp,
                    name: 'PYTHON_SRC_FILTER',
                    pattern: 'def\\s+[a-zA-Z_][a-zA-Z0-9_]*\\s*\\(',
                    action: 'BLOCK',
                    description: 'AUTO-GEN: PYTHON FUNCTION DEF SIGNATURE'
                });
            } else {
                newPolicies.push({
                    id: timestamp,
                    name: 'CUSTOM_PATTERN_' + Math.floor(Math.random() * 999),
                    pattern: prompt.toUpperCase(),
                    action: 'LOG_ONLY',
                    description: 'MANUAL_OVERRIDE: CUSTOM STRING MATCH'
                });
            }
            setPolicies(newPolicies);
            setIsGenerating(false);
            setPrompt('');
        }, 1500);
    };

    const handleSave = async () => {
        alert('PROTOCOL: DEPLOYMENT_NOT_LINKED [DEMO_MODE]');
    };

    return (
        <div className="h-full bg-transparent text-zinc-300 font-mono flex flex-col relative overflow-hidden">
            {/* Mesh Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('/grid.svg')] bg-[length:30px_30px]" />

            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left: Tactical Input */}
                    <div className="lg:col-span-4">
                        <TechCard title="Direct Neural Interface" status="normal" className="h-[500px]">
                            <div className="flex flex-col h-full p-4 gap-4">
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest border-l-2 border-emerald-900 pl-2">
                                    Enter policy intent data. Core will translate to Regex signatures.
                                </div>

                                <div className="flex-1 relative group">
                                    <textarea
                                        className="w-full h-full bg-black border border-zinc-800 p-4 text-xs focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-950/5 transition resize-none placeholder:text-zinc-800 text-emerald-400 font-mono leading-relaxed"
                                        placeholder="// INPUT PROTOCOL...&#10;> BLOCK AWS KEYS&#10;> FILTER PYTHON SOURCE"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                    {/* Corner Accents for Input */}
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700 pointer-events-none group-hover:border-emerald-500/50 transition-colors" />
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700 pointer-events-none group-hover:border-emerald-500/50 transition-colors" />
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt}
                                    className={`w-full py-3 border border-zinc-800 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all
                            ${isGenerating
                                            ? 'bg-zinc-900 text-zinc-500 cursor-wait border-zinc-800'
                                            : 'bg-zinc-950 hover:bg-emerald-950/30 text-emerald-500 hover:border-emerald-500/50'
                                        }`}
                                >
                                    {isGenerating ? (
                                        <span className="animate-pulse">PROCESSING...</span>
                                    ) : (
                                        <>
                                            <Terminal className="w-3 h-3" />
                                            EXECUTE_GENERATION
                                        </>
                                    )}
                                </button>
                            </div>
                        </TechCard>
                    </div>

                    {/* Right: Active Policy Grid */}
                    <div className="lg:col-span-8">
                        <TechCard
                            title="Active Signatures"
                            status="normal"
                            toolbar={
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-3 py-1 bg-emerald-950/20 border border-emerald-900 hover:border-emerald-500/50 text-emerald-500 text-[9px] font-bold uppercase tracking-wider transition-all"
                                >
                                    <Server className="w-3 h-3" />
                                    SYNC_FLEET
                                </button>
                            }
                            className="h-[500px]"
                        >
                            <div className="p-0 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                                {/* Grid Header */}
                                <div className="grid grid-cols-12 gap-2 text-[9px] uppercase tracking-widest text-zinc-600 border-b border-zinc-800 bg-zinc-950/50 px-4 py-2 sticky top-0 backdrop-blur-sm z-10">
                                    <div className="col-span-1">Stat</div>
                                    <div className="col-span-3">Signature_ID</div>
                                    <div className="col-span-6">Pattern_Match</div>
                                    <div className="col-span-2 text-right">Action</div>
                                </div>

                                {policies.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-2">
                                        <Brain size={18} className="text-white group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] tracking-widest uppercase">No Active Protocols</span>
                                    </div>
                                ) : (
                                    policies.map((policy, idx) => (
                                        <div key={policy.id || idx} className="grid grid-cols-12 gap-2 p-3 border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors group items-center text-[10px]">
                                            <div className="col-span-1 flex justify-center">
                                                <div className={`w-1.5 h-1.5 ${policy.action === 'BLOCK' ? 'bg-rose-500' : 'bg-amber-500'} shadow-[0_0_8px_-1px_currentColor]`} />
                                            </div>
                                            <div className="col-span-3 text-emerald-400 font-bold truncate">
                                                {policy.name}
                                            </div>
                                            <div className="col-span-6 font-mono text-zinc-500 truncate group-hover:text-zinc-300 transition-colors">
                                                {policy.pattern}
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <span className={`px-1.5 py-0.5 border ${policy.action === 'BLOCK'
                                                    ? 'border-rose-900/50 text-rose-500 bg-rose-950/20'
                                                    : 'border-amber-900/50 text-amber-500 bg-amber-950/20'
                                                    }`}>
                                                    {policy.action}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </TechCard>
                    </div>

                </div>
            </div>
        </div>
    );
}
