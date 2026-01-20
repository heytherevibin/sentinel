'use client';

import React from 'react';
import { Activity, Shield, Zap, Eye, Lock, Server, Cpu, Network } from 'lucide-react';
import { TechCard } from './TechCard';

const PROTOCOLS = [
    { name: 'ENTROPY_ANALYSIS', load: '12%', status: 'active' },
    { name: 'SYNTAX_MESH_V4', load: '85%', status: 'active' },
    { name: 'HEURISTIC_RESONANCE', load: '04%', status: 'standby' },
    { name: 'TOKEN_BLAST_RADIUS', load: '22%', status: 'active' },
    { name: 'VECTOR_ALIGNMENT', load: '09%', status: 'active' },
    { name: 'QUBIT_CONSENSUS', load: '00%', status: 'locked' }
];

export function IntrospectionStatus() {
    return (
        <TechCard title="Neural Mesh Status" status="normal" className="h-full">
            <div className="flex flex-col h-full gap-4 text-[10px] font-mono">

                {/* Active Protocol List */}
                <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="flex items-center justify-between text-zinc-500 uppercase tracking-widest pb-1 border-b border-zinc-800/50">
                        <span>Neural Protocol</span>
                        <span>Load</span>
                    </div>

                    <div className="space-y-1 pr-1 custom-scrollbar overflow-y-auto max-h-[180px]">
                        {PROTOCOLS.map((p, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5 group cursor-default">
                                <div className="flex items-center gap-2">
                                    <div className={`w-1 h-1 rounded-full ${p.status === 'active' ? 'bg-emerald-500 animate-pulse' : p.status === 'locked' ? 'bg-zinc-800' : 'bg-amber-500/50'}`} />
                                    <span className={`tracking-tight ${p.status === 'locked' ? 'text-zinc-700' : 'text-zinc-400 group-hover:text-zinc-200'} transition-colors`}>{p.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ${p.status === 'active' ? 'bg-emerald-500/40' : 'bg-zinc-800'}`}
                                            style={{ width: p.load }}
                                        />
                                    </div>
                                    <span className={p.status === 'locked' ? 'text-zinc-800' : 'text-zinc-600'}>{p.load}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Stats Footer */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/50">
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded flex flex-col gap-1 group hover:border-emerald-500/30 transition-colors">
                        <div className="flex justify-between items-center text-zinc-600 uppercase tracking-widest text-[8px]">
                            <span>Mesh Load</span>
                            <Cpu size={10} className="group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-emerald-400 font-bold text-lg">24.8%</span>
                            <span className="text-zinc-700">avg</span>
                        </div>
                    </div>
                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded flex flex-col gap-1 group hover:border-blue-500/30 transition-colors">
                        <div className="flex justify-between items-center text-zinc-600 uppercase tracking-widest text-[8px]">
                            <span>Discovery</span>
                            <Network size={10} className="group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-blue-400 font-bold text-lg">112</span>
                            <span className="text-zinc-700">nds</span>
                        </div>
                    </div>
                </div>

            </div>
        </TechCard>
    );
}
