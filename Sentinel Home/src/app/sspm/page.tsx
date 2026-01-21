'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Globe, Database, Activity, Lock, Users, Eye, AlertTriangle, CheckCircle, ChevronRight, Filter, Search, MoreVertical, ExternalLink } from 'lucide-react';
import { TechCard } from '@/components/TechCard';
import { NeuralAlignmentGauge } from '@/components/NeuralAlignmentGauge';
import { useSentinelApi } from '@/hooks/useSentinelApi';

// Dummy data for posture drift
const configurationDrifts = [
    { id: 'DRF-001', app: 'Slack', category: 'Security', issue: 'MFA Disabled for Guest Accounts', severity: 'CRITICAL', status: 'Drift Detected' },
    { id: 'DRF-002', app: 'GitHub', category: 'Access', issue: 'Public Repository Creation Enabled', severity: 'HIGH', status: 'Policy Mismatch' },
    { id: 'DRF-003', app: 'Salesforce', category: 'Data', issue: 'API Access from Unsigned IPs', severity: 'CRITICAL', status: 'Anomalous Config' },
    { id: 'DRF-004', app: 'Google Workspace', category: 'Identity', issue: 'Super Admin lacks FIDO2 requirement', severity: 'HIGH', status: 'Warning' },
    { id: 'DRF-005', app: 'AWS', category: 'Storage', issue: 'S3 Buckets with Public ACLs', severity: 'CRITICAL', status: 'Violation' },
];

// Dummy hardening checklist
const hardeningBaseline = [
    { task: 'Enforce SSO for all Federated Apps', status: 'completed', score: '+15' },
    { task: 'Restrict OAuth App permissions to Least-Privilege', status: 'pending', score: '+12' },
    { task: 'Enable audit log streaming to Sentinel Forensics', status: 'completed', score: '+8' },
    { task: 'Rotate Root API keys (Age > 90 days)', status: 'action_required', score: '+20' },
];

export default function SSPMPage() {
    const [apps, setApps] = useState<any[]>([]);
    const [selectedDrift, setSelectedDrift] = useState<any>(null);
    const { callApi, loading } = useSentinelApi();

    const fetchApps = async () => {
        try {
            const data = await callApi('/api/apps');
            if (Array.isArray(data)) setApps(data);
        } catch (e) { console.error('Failed to fetch apps', e); }
    };

    useEffect(() => {
        fetchApps();
        const interval = setInterval(fetchApps, 15000);
        return () => clearInterval(interval);
    }, [callApi]);

    return (
        <main className="h-full bg-transparent text-zinc-300 flex flex-col font-mono overflow-hidden selection:bg-blue-950/30 relative">

            {/* Posture Command Center Grid (12-col) */}
            <div className="flex-1 p-6 grid grid-cols-12 gap-8 min-h-0 overflow-hidden relative z-10">

                {/* Left Sidebar: Posture Metrics (3 cols) */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-8 min-h-0">

                    {/* Posture Health Gauge */}
                    <div className="shrink-0 flex flex-col gap-2">
                        <div className="flex items-center gap-2 px-1 mb-1">
                            <ShieldCheck size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Posture Integrity</span>
                        </div>
                        <NeuralAlignmentGauge score={84} status="active" />
                    </div>

                    <TechCard title="APP_GOVERNANCE // HEALTH" className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                            <div className="space-y-4 pt-2">
                                {apps.map((app) => (
                                    <AppHealthRow
                                        key={app.id}
                                        name={app.name}
                                        score={app.cci || 0}
                                        status={app.cci > 90 ? 'healthy' : app.cci > 70 ? 'warning' : 'critical'}
                                    />
                                ))}
                                {apps.length === 0 && !loading && (
                                    <div className="text-[10px] text-zinc-600 text-center py-4 uppercase tracking-widest">No Apps In Inventory</div>
                                )}
                            </div>
                        </div>
                    </TechCard>

                </div>

                {/* Right Area: Drift Analysis & Hardening (9 cols) */}
                <div className="col-span-12 md:col-span-9 flex flex-col min-h-0 gap-8">

                    {/* Top: Configuration Drift Deck */}
                    <div className="shrink-0 flex flex-col min-h-0">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={14} className="text-amber-500" />
                                <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Configuration Drift Analysis</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Active Violations: <span className="text-rose-500">12</span></span>
                                <div className="h-4 w-[1px] bg-zinc-800" />
                                <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">Run Full Audit</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {configurationDrifts.map((drift) => (
                                <div
                                    key={drift.id}
                                    onClick={() => setSelectedDrift(drift)}
                                    className={`p-4 bg-zinc-950/40 border border-zinc-900 rounded-sm flex items-center justify-between group cursor-pointer transition-all border-l-2 ${selectedDrift?.id === drift.id ? 'bg-blue-500/[0.05] border-l-blue-500 border-zinc-700' : 'border-l-transparent hover:border-zinc-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`p-2 rounded border ${drift.severity === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                            }`}>
                                            <ShieldAlert size={16} />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[10px] font-black text-zinc-100 uppercase tracking-widest">{drift.app}</span>
                                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-900 px-1.5 py-0.5 rounded-sm">{drift.category}</span>
                                            </div>
                                            <span className="text-[11px] font-bold text-zinc-400">{drift.issue}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${drift.severity === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}`}>
                                                {drift.status}
                                            </span>
                                        </div>
                                        <ChevronRight size={16} className="text-zinc-800 group-hover:text-zinc-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Row: Hardening Baseline & Identity Map */}
                    <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
                        {/* Task Ledger */}
                        <div className="col-span-7 flex flex-col min-h-0">
                            <TechCard title="HARDENING_BASELINE // RECOMMENDED_OPS" className="flex-1 flex flex-col min-h-0">
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 bg-zinc-950 z-10">
                                            <tr className="border-b border-zinc-900 text-[9px] font-black tracking-widest text-zinc-600 uppercase">
                                                <th className="px-5 py-3">Hardening Requirement</th>
                                                <th className="px-5 py-3">Point Value</th>
                                                <th className="px-5 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {hardeningBaseline.map((item, idx) => (
                                                <tr key={idx} className="border-b border-zinc-900 group hover:bg-zinc-900/40 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                            <span className="text-[10px] font-bold text-zinc-300">{item.task}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 font-mono text-[10px] font-bold text-emerald-500/70">{item.score}</td>
                                                    <td className="px-5 py-4 text-right">
                                                        <button className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'completed' ? 'text-zinc-700' : 'text-blue-500 hover:text-blue-400'}`}>
                                                            {item.status === 'completed' ? 'VERIFIED' : 'REMEDIATE'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </TechCard>
                        </div>

                        {/* Identity Exposure Heatmap (Simplified Grid) */}
                        <div className="col-span-5 flex flex-col min-h-0">
                            <TechCard title="IDENTITY_RISK_HEATMAP" className="flex-1 flex flex-col p-4 gap-4">
                                <div className="flex-1 grid grid-cols-4 grid-rows-4 gap-2">
                                    {Array.from({ length: 16 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`rounded-sm border border-zinc-900 flex items-center justify-center transition-all cursor-crosshair group relative ${i === 5 || i === 10 ? 'bg-rose-500/20 border-rose-500/30' :
                                                i % 3 === 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-zinc-900/30'
                                                }`}
                                        >
                                            <Users size={12} className={`opacity-20 group-hover:opacity-100 transition-opacity ${i === 5 || i === 10 ? 'text-rose-500' : 'text-zinc-600'}`} />
                                            {/* Tooltip on Hover */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none z-30 whitespace-nowrap">
                                                <span className="text-[8px] font-black uppercase text-zinc-400 tracking-tighter">Node_IDX: {i + 1} {"//"} Exposure: {i === 5 || i === 10 ? 'CRITICAL' : 'LOW'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <div className="flex gap-4">
                                        <LegendItem color="bg-rose-500/40" label="Exploitable" />
                                        <LegendItem color="bg-amber-500/20" label="Exposed" />
                                    </div>
                                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest font-mono">Total Identity Mass: 1,402</span>
                                </div>
                            </TechCard>
                        </div>
                    </div>

                </div>

            </div>

            {/* Posture Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('/grid.svg')] bg-[length:30px_30px]" />
            <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-blue-500/[0.02] blur-[150px] pointer-events-none z-[-1]" />
        </main>
    );
}

const AppHealthRow = ({ name, score, status }: { name: string, score: number, status: 'healthy' | 'warning' | 'critical' }) => (
    <div className="flex flex-col gap-2 group cursor-default">
        <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{name}</span>
            <span className={`text-[10px] font-mono font-bold ${status === 'healthy' ? 'text-emerald-500' :
                status === 'warning' ? 'text-amber-500' : 'text-rose-500'
                }`}>{score}%</span>
        </div>
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div
                className={`h-full transition-all duration-1000 ease-out ${status === 'healthy' ? 'bg-emerald-500/50' :
                    status === 'warning' ? 'bg-amber-500/50' : 'bg-rose-500/50'
                    }`}
                style={{ width: `${score}%` }}
            />
        </div>
    </div>
);

const LegendItem = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">{label}</span>
    </div>
);
