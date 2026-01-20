'use client';

import React, { useState } from 'react';
import { Zap, Activity, Power, ShieldX, Network, UserX, Key, Globe, Database, Shield } from 'lucide-react';
import { TechCard } from '@/components/TechCard';

// Dummy data for sensors
const enforcementNodes = [
    { id: 'SNSR-HQ-01', type: 'macOS', status: 'connected', latency: '4ms' },
    { id: 'SNSR-HQ-02', type: 'macOS', status: 'connected', latency: '6ms' },
    { id: 'SNSR-DC-01', type: 'Linux', status: 'connected', latency: '2ms' },
    { id: 'SNSR-DC-02', type: 'Linux', status: 'offline', latency: '--' },
];

// Dummy active responses
const activeResponses = [
    { id: 'RES-901', time: '12:45:10', target: 'j.smith@sentinel.io', action: 'TOKEN_REVOCATION', status: 'COMPLETED', node: 'SNSR-HQ-01' },
    { id: 'RES-902', time: '12:44:05', target: '192.168.1.42', action: 'NETWORK_QUARANTINE', status: 'ACTIVE', node: 'SNSR-DC-01' },
    { id: 'RES-903', time: '12:40:22', target: 'Customer_Data.db', action: 'IO_BLOCK', status: 'COMPLETED', node: 'SNSR-HQ-02' },
];

export default function RemediationPage() {
    const [lockdownActive, setLockdownActive] = useState(false);
    const [purgeActive, setPurgeActive] = useState(false);

    return (
        <main className="h-full bg-transparent text-zinc-300 flex flex-col font-mono overflow-hidden selection:bg-rose-950/30 relative">

            {/* Tactical Grid (12-col) */}
            <div className="flex-1 p-6 grid grid-cols-12 gap-8 min-h-0 overflow-hidden relative z-10">

                {/* Left Sidebar: Global Enforcement (3 cols) */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-8 min-h-0">

                    {/* Global Kill-Switches */}
                    <TechCard title="GLOBAL_ENFORCEMENT // KILL_SWITCH" status={lockdownActive ? 'warning' : 'normal'} className="shrink-0 flex flex-col gap-4">
                        <div className="flex flex-col gap-3 p-1">
                            <button
                                onClick={() => setLockdownActive(!lockdownActive)}
                                className={`w-full py-4 px-4 flex items-center justify-between group transition-all border rounded-sm ${lockdownActive
                                        ? 'bg-rose-500/10 border-rose-500/50 text-rose-500'
                                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 hover:border-rose-500/30 hover:text-rose-400'
                                    }`}
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Full Lockdown</span>
                                    <span className="text-[8px] opacity-40 uppercase tracking-widest font-bold">Terminate All Sessions</span>
                                </div>
                                <Power size={20} className={lockdownActive ? 'animate-pulse' : ''} />
                            </button>

                            <button
                                onClick={() => setPurgeActive(!purgeActive)}
                                className={`w-full py-4 px-4 flex items-center justify-between group transition-all border rounded-sm ${purgeActive
                                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-500'
                                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 hover:border-amber-500/30 hover:text-amber-400'
                                    }`}
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Session Purge</span>
                                    <span className="text-[8px] opacity-40 uppercase tracking-widest font-bold">Invalidate OIDC Tokens</span>
                                </div>
                                <ShieldX size={20} className={purgeActive ? 'animate-pulse' : ''} />
                            </button>
                        </div>
                    </TechCard>

                    {/* Enforcement Health (Sensor Status) */}
                    <TechCard title="ENFORCEMENT_HEALTH // SENSORS" className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                            <div className="space-y-3">
                                {enforcementNodes.map((node) => (
                                    <div key={node.id} className="p-3 bg-zinc-950/50 border border-zinc-900 rounded-sm flex items-center justify-between group hover:border-zinc-700 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${node.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-zinc-200">{node.id}</span>
                                                <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">{node.type} ARC</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-mono text-zinc-700 font-bold">{node.latency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TechCard>

                </div>

                {/* Right Area: Remediation Deck & Ledger (9 cols) */}
                <div className="col-span-12 md:col-span-9 flex flex-col min-h-0 gap-8">

                    {/* Top: Tactical Action Deck */}
                    <div className="shrink-0 flex flex-col min-h-0">
                        <div className="flex items-center gap-2 px-1 mb-3">
                            <Zap size={14} className="text-amber-500" />
                            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Tactical Action Deck</span>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <ActionCard
                                icon={<UserX className="text-rose-500" />}
                                title="Quarantine Identity"
                                desc="Isolate user across all SaaS vectors."
                                status="CRITICAL"
                            />
                            <ActionCard
                                icon={<Network className="text-amber-500" />}
                                title="Block Node Traffic"
                                desc="Inject firewall rules into sensor mesh."
                                status="HIGH"
                            />
                            <ActionCard
                                icon={<Key className="text-blue-500" />}
                                title="Rotate Auth Keys"
                                desc="Force secret renewal for service account."
                                status="MEDIUM"
                            />
                        </div>
                    </div>

                    {/* Bottom: Active Response Ledger */}
                    <TechCard title="ACTIVE_RESPONSE_LEDGER // ENFORCEMENT_LOG" className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-zinc-950 z-20 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                                    <tr className="border-b border-zinc-900 text-[9px] font-black tracking-[0.2em] text-zinc-600 uppercase">
                                        <th className="px-5 py-3">Timestamp</th>
                                        <th className="px-5 py-3">Remediation Action</th>
                                        <th className="px-5 py-3">Target Asset</th>
                                        <th className="px-5 py-3">Exec Node</th>
                                        <th className="px-5 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeResponses.map((res) => (
                                        <tr key={res.id} className="border-b border-zinc-900 group hover:bg-rose-500/[0.02] cursor-default transition-colors border-l-2 border-l-transparent hover:border-l-rose-500">
                                            <td className="px-5 py-4 text-[10px] font-bold text-zinc-600 font-mono italic">{res.time}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-rose-500/50 rounded-full" />
                                                    <span className="text-[10px] font-black tracking-widest text-zinc-300 uppercase">{res.action}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-[10px] font-bold text-zinc-400">{res.target}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-[9px] font-black text-emerald-500/70 uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-sm border border-emerald-500/20">{res.node}</span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <span className={`text-[10px] font-black tracking-widest uppercase ${res.status === 'ACTIVE' ? 'text-amber-500 animate-pulse' : 'text-zinc-600'}`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TechCard>

                </div>

            </div>

            {/* Tactical Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('/grid.svg')] bg-[length:30px_30px]" />
            <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-rose-500/[0.02] blur-[150px] pointer-events-none z-[-1]" />
        </main>
    );
}

const ActionCard = ({ icon, title, desc, status }: { icon: React.ReactNode, title: string, desc: string, status: string }) => (
    <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-sm relative group hover:border-zinc-700 transition-all flex flex-col gap-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform" />
        <div className="flex justify-between items-start">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded group-hover:bg-zinc-800 transition-colors">
                {icon}
            </div>
            <span className={`text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-sm border ${status === 'CRITICAL' ? 'text-rose-500 border-rose-500/20' : 'text-amber-500 border-amber-500/20'
                }`}>
                {status}
            </span>
        </div>
        <div className="flex flex-col gap-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-100">{title}</h3>
            <p className="text-[10px] text-zinc-600 font-bold leading-relaxed">{desc}</p>
        </div>
        <button className="mt-2 w-full py-2 bg-zinc-900 border border-zinc-800 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700 transition-all">
            Initiate Protocol
        </button>
    </div>
);
