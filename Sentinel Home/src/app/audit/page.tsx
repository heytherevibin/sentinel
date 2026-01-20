'use client';

import React, { useState } from 'react';
import { FileSearch, Clock, Database, Activity, Search, Filter, Calendar, Download, ShieldCheck, ChevronRight, Hash, HardDrive, Share2, Eye, Info } from 'lucide-react';
import { TechCard } from '@/components/TechCard';

// Dummy forensic data
const forensicHits = [
    { id: 'FRN-8821', time: '2026-01-20 10:45:02', event: 'SENSITIVE_FILE_READ', user: 'a.chen@sentinel.io', app: 'Google Drive', hash: '5f92a...e9b2', status: 'VERIFIED' },
    { id: 'FRN-8822', time: '2026-01-20 10:42:15', event: 'OUTBOUND_CONNECTION', user: 'j.doe@sentinel.io', app: 'Unknown (Terminal)', hash: 'a1b2c...d4e5', status: 'VERIFIED' },
    { id: 'FRN-8823', time: '2026-01-20 10:38:40', event: 'OIDC_TOKEN_REFRESH', user: 'system_svc', app: 'Okta', hash: '99e8d...f1a2', status: 'VERIFIED' },
    { id: 'FRN-8824', time: '2026-01-20 10:30:12', event: 'DLP_POLICY_TRIGGER', user: 'm.keller@sentinel.io', app: 'Slack', hash: 'e2c3d...4a5b', status: 'VERIFIED' },
];

const retentionStats = [
    { label: 'Hot Storage (90d)', value: '14.2 TB', health: 98 },
    { label: 'Cold Archive (7y)', value: '1.2 PB', health: 100 },
    { label: 'Index Coverage', value: '100%', health: 100 },
];

export default function ForensicsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <main className="h-full bg-transparent text-zinc-300 flex flex-col font-mono overflow-hidden selection:bg-purple-950/30 relative">

            {/* Forensics Workspace (12-col) */}
            <div className="flex-1 p-6 grid grid-cols-12 gap-8 min-h-0 overflow-hidden relative z-10">

                {/* Left Sidebar: Retention & Chain of Custody (3 cols) */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-8 min-h-0">

                    {/* Retention Health */}
                    <TechCard title="RETENTION_INTEGRITY // STORAGE" className="shrink-0 flex flex-col gap-4">
                        <div className="space-y-4 p-1">
                            {retentionStats.map((stat, idx) => (
                                <div key={idx} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                                        <span className="text-zinc-500">{stat.label}</span>
                                        <span className="text-purple-500">{stat.value}</span>
                                    </div>
                                    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500/40" style={{ width: `${stat.health}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TechCard>

                    {/* Chain of Custody Verified Nodes */}
                    <TechCard title="CHAIN_OF_CUSTODY // VERIFIED" className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                            <div className="space-y-3 pt-2">
                                <ChainNode id="NODE_SIG_01" status="VALID" time="2m ago" />
                                <ChainNode id="NODE_SIG_02" status="VALID" time="15m ago" />
                                <ChainNode id="NODE_SIG_03" status="VALID" time="1h ago" />
                                <ChainNode id="NODE_SIG_04" status="VALID" time="4h ago" />
                                <ChainNode id="NODE_SIG_05" status="VALID" time="1d ago" />
                            </div>
                        </div>
                    </TechCard>
                </div>

                {/* Right Area: Deep Pulse Search & Results (9 cols) */}
                <div className="col-span-12 md:col-span-9 flex flex-col min-h-0 gap-8">

                    {/* Top: Deep Pulse Search Bar */}
                    <div className="shrink-0 flex flex-col gap-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search size={18} className="text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="DEEP_PULSE_QUERY: [user:a.chen AND site:drive.google.com AND action:READ]"
                                className="w-full bg-zinc-950/50 border border-zinc-900 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 rounded-sm py-4 pl-12 pr-4 text-xs font-mono tracking-wider outline-none transition-all placeholder:text-zinc-700 text-zinc-200"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                                <button className="p-2 hover:bg-zinc-900 rounded-sm text-zinc-600 hover:text-zinc-300 transition-colors">
                                    <Filter size={14} />
                                </button>
                                <button className="p-2 hover:bg-zinc-900 rounded-sm text-zinc-600 hover:text-zinc-300 transition-colors">
                                    <Calendar size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center px-1">
                            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Quick Filters:</span>
                            <div className="flex gap-2">
                                <FilterTag label="MALWARE_FLIGHT" />
                                <FilterTag label="SENSITIVE_IO" />
                                <FilterTag label="AUTH_ANOMALY" />
                            </div>
                        </div>
                    </div>

                    {/* Middle: Forensic Timeline Ledger */}
                    <TechCard title="DEEP_PULSE_TIMELINE // FORENSIC_LEDGER" className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-zinc-950 z-20 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                                    <tr className="border-b border-zinc-900 text-[9px] font-black tracking-[0.2em] text-zinc-600 uppercase">
                                        <th className="px-5 py-3">Audit_ID</th>
                                        <th className="px-5 py-3">Timestamp (UTC)</th>
                                        <th className="px-5 py-3">Event Descriptor</th>
                                        <th className="px-5 py-3">Principal Identity</th>
                                        <th className="px-5 py-3 text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {forensicHits.map((hit) => (
                                        <tr key={hit.id} className="border-b border-zinc-900 group hover:bg-purple-500/[0.02] cursor-default transition-colors">
                                            <td className="px-5 py-4">
                                                <span className="text-[10px] font-black text-purple-500/70 tracking-tighter">{hit.id}</span>
                                            </td>
                                            <td className="px-5 py-4 text-[10px] font-bold text-zinc-600 italic">{hit.time}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] font-black tracking-widest text-zinc-300 uppercase">{hit.event}</span>
                                                    <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{hit.app}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-[10px] font-bold text-zinc-400">{hit.user}</span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <ShieldCheck size={10} className="text-emerald-500" />
                                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{hit.status}</span>
                                                    </div>
                                                    <span className="text-[7px] font-mono text-zinc-700 tracking-tighter uppercase font-black">{hit.hash}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TechCard>

                    {/* Bottom: Tactical Metadata Footer */}
                    <div className="shrink-0 grid grid-cols-4 gap-4 h-24">
                        <MetadataStat icon={<HardDrive size={14} />} label="Available Metadata" value="1.4 PB" />
                        <MetadataStat icon={<Activity size={14} />} label="Indexing Velocity" value="2.4 GB/s" />
                        <MetadataStat icon={<Hash size={14} />} label="Signed Block Height" value="84,102" />
                        <MetadataStat icon={<Share2 size={14} />} label="Federated Uplinks" value="12 Nodes" />
                    </div>

                </div>

            </div>

            {/* Forensic Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('/grid.svg')] bg-[length:30px_30px]" />
            <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-purple-500/[0.02] blur-[150px] pointer-events-none z-[-1]" />
        </main>
    );
}

const ChainNode = ({ id, status, time }: { id: string, status: string, time: string }) => (
    <div className="p-3 bg-zinc-950/50 border border-zinc-900 rounded-sm flex items-center justify-between group hover:border-purple-500/30 transition-all">
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:animate-pulse" />
            <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase">{id}</span>
                <span className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">{time}</span>
            </div>
        </div>
        <span className="text-[8px] font-black text-emerald-500/70 border border-emerald-500/20 px-1.5 py-0.5 rounded-sm">{status}</span>
    </div>
);

const FilterTag = ({ label }: { label: string }) => (
    <button className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-sm text-[8px] font-black text-zinc-600 uppercase tracking-widest hover:border-purple-500/30 hover:text-purple-400 transition-all">
        {label}
    </button>
);

const MetadataStat = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-sm flex flex-col justify-between group hover:border-zinc-700 transition-colors">
        <div className="flex justify-between items-start">
            <div className="text-zinc-700 group-hover:text-purple-500 transition-colors">{icon}</div>
            <span className="text-[9px] font-mono font-bold text-purple-500/70">{value}</span>
        </div>
        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
    </div>
);
