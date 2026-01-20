'use client';

import React, { useState, useEffect } from 'react';
import { Settings, User, Shield, Lock, Database, LogOut, Download, Cpu, Globe, Key, Cloud, Server, Activity, ChevronRight, Zap, RefreshCcw, Power } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TechCard } from '@/components/TechCard';
import { NeuralAlignmentGauge } from '@/components/NeuralAlignmentGauge';

// Dummy data for Cloud Connectors
const cloudConnectors = [
    { id: 'CONN-01', name: 'Okta Enterprise', status: 'connected', type: 'OIDC/IDP' },
    { id: 'CONN-02', name: 'Slack Grid', status: 'connected', type: 'SaaS/CASB' },
    { id: 'CONN-03', name: 'Google Workspace', status: 'warning', type: 'DLP/Mail' },
    { id: 'CONN-04', name: 'AWS Production', status: 'connected', type: 'Cloud/SSPM' },
];

// Dummy data for Sensors
const sensorFleet = [
    { id: 'ARC-MAC-01', user: 'a.analyst', version: '2.4.0', status: 'active', load: '12%' },
    { id: 'ARC-MAC-02', user: 'j.engineer', version: '2.4.0', status: 'active', load: '8%' },
    { id: 'ARC-LNX-01', user: 'root_prod', version: '2.3.1', status: 'update_req', load: '45%' },
    { id: 'ARC-MAC-03', user: 'm.intern', version: '2.4.0', status: 'active', load: '14%' },
];

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch('/api/system/logs');
                const data = await res.json();
                if (Array.isArray(data)) setLogs(data);
            } catch (e) {
                console.error('Log fetch failed', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <main className="h-full bg-transparent text-zinc-300 flex flex-col font-mono overflow-hidden selection:bg-amber-950/30 relative">

            {/* System Command Center Grid (12-col) */}
            <div className="flex-1 p-6 grid grid-cols-12 gap-8 min-h-0 overflow-hidden relative z-10">

                {/* Left Sidebar: Operator & Hardening (3 cols) */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-8 min-h-0">

                    {/* Operator Identity */}
                    <TechCard title="OPERATOR_PROFILE // IDENTITY" className="shrink-0 flex flex-col gap-4">
                        <div className="flex flex-col gap-4 p-1">
                            <div className="flex items-center gap-4 p-3 bg-zinc-950/50 border border-zinc-900 rounded-sm">
                                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center relative overflow-hidden">
                                    <User className="text-zinc-500" size={20} />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-zinc-100 uppercase tracking-widest">Analyst_01</span>
                                    <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">Clearance: Level 4</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full py-2 bg-zinc-900 border border-zinc-800 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut size={12} />
                                Disconnect Session
                            </button>
                        </div>
                    </TechCard>

                    {/* Global Hardening Gauge */}
                    <div className="shrink-0 flex flex-col gap-2">
                        <div className="flex items-center gap-2 px-1 mb-1">
                            <Shield className="text-amber-500" size={14} />
                            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">System Hardening</span>
                        </div>
                        <NeuralAlignmentGauge score={94} status="active" />
                    </div>

                    {/* Quick Config Toggles */}
                    <TechCard title="GLOBAL_CONTROLS" className="flex-1 flex flex-col min-h-0">
                        <div className="flex flex-col gap-3 p-1 pt-2">
                            <ConfigToggle label="Auto-Remediate Criticals" active={true} />
                            <ConfigToggle label="Deep Packet Inspection" active={true} />
                            <ConfigToggle label="OIDC Session Sync" active={false} />
                            <ConfigToggle label="Neural Metadata Retention" active={true} />
                            <ConfigToggle label="Cross-SaaS Quarantine" active={true} />
                        </div>
                    </TechCard>
                </div>

                {/* Right Area: Cloud Connectors & Sensor Fleet (9 cols) */}
                <div className="col-span-12 md:col-span-9 flex flex-col min-h-0 gap-8">

                    {/* Top Row: Cloud Connector Deck */}
                    <div className="shrink-0 flex flex-col min-h-0 gap-4">
                        <div className="flex items-center gap-2 px-1 mb-1">
                            <Cloud size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Cloud & SaaS Connectors</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {cloudConnectors.map((conn) => (
                                <div key={conn.id} className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-sm hover:border-zinc-700 group transition-all cursor-default">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded group-hover:bg-zinc-800 transition-colors">
                                            <Globe size={16} className={conn.status === 'connected' ? 'text-blue-500' : 'text-amber-500'} />
                                        </div>
                                        <div className={`w-1.5 h-1.5 rounded-full ${conn.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-black text-zinc-200 uppercase tracking-widest">{conn.name}</span>
                                        <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">{conn.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Middle: Sensor Lifecycle Ledger */}
                    <TechCard title="SENSOR_FLEET_MANAGEMENT // ARC_LIFECYCLE" className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-zinc-950 z-20 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                                    <tr className="border-b border-zinc-900 text-[9px] font-black tracking-[0.2em] text-zinc-600 uppercase">
                                        <th className="px-5 py-3">Sensor_ID</th>
                                        <th className="px-5 py-3">Assigned User</th>
                                        <th className="px-5 py-3">Ver / OS</th>
                                        <th className="px-5 py-3">Metic Load</th>
                                        <th className="px-5 py-3 text-right">Lifecycle</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sensorFleet.map((sensor) => (
                                        <tr key={sensor.id} className="border-b border-zinc-900 group hover:bg-zinc-900/40 cursor-default transition-colors">
                                            <td className="px-5 py-4 text-[10px] font-black text-zinc-200 tracking-widest">{sensor.id}</td>
                                            <td className="px-5 py-4 text-[10px] font-bold text-zinc-500">{sensor.user}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-mono text-zinc-500 underline decoration-zinc-800">v{sensor.version}</span>
                                                    <span className="text-[8px] font-black bg-zinc-900 px-1.5 py-0.5 border border-zinc-800 text-zinc-600 uppercase">ARC_M1</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="w-24 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500/50" style={{ width: sensor.load }} />
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 border transition-all ${sensor.status === 'active'
                                                    ? 'text-zinc-600 border-zinc-800 hover:text-rose-500 hover:border-rose-500/30'
                                                    : 'text-amber-500 border-amber-500/30 hover:bg-amber-500/10'
                                                    }`}>
                                                    {sensor.status === 'active' ? 'Revoke ARC' : 'Update Node'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TechCard>

                    {/* Bottom: Real-time Diagnostic Stream */}
                    <TechCard
                        title="SYSTEM_DIAGNOSTICS // PULSE_STREAM"
                        className="h-48 shrink-0 flex flex-col"
                        toolbar={
                            <div className="flex gap-4">
                                <button className="text-[9px] font-black text-zinc-600 uppercase hover:text-zinc-300 transition-colors flex items-center gap-2">
                                    <Download size={10} /> Export_Log
                                </button>
                                <button className="text-[9px] font-black text-zinc-600 uppercase hover:text-zinc-300 transition-colors flex items-center gap-2">
                                    <RefreshCcw size={10} /> Clear_Pipes
                                </button>
                            </div>
                        }
                    >
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                            {logs.slice(-100).reverse().map((log, idx) => (
                                <div key={idx} className="flex gap-3 text-[10px] font-mono border-b border-zinc-900/30 pb-0.5 last:border-0 group">
                                    <span className="text-zinc-700 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                    <span className={`shrink-0 font-black ${log.type === 'ERROR' ? 'text-rose-500' : 'text-blue-500'}`}>{log.type}</span>
                                    <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">{log.message}</span>
                                </div>
                            ))}
                            {logs.length === 0 && <div className="text-zinc-800 italic text-[10px]">Awaiting system heartbeat...</div>}
                        </div>
                    </TechCard>
                </div>
            </div>

            {/* Tactical Overlays */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-scan opacity-20" />
                <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-amber-500/10" style={{ left: '25%' }} />
                <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-amber-500/10" style={{ left: '50%' }} />
                <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-amber-500/10" style={{ left: '75%' }} />
            </div>

            {/* Config Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('/grid.svg')] bg-[length:30px_30px]" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/[0.015] blur-[150px] pointer-events-none z-[-1]" />
        </main>
    );
}

const ConfigToggle = ({ label, active }: { label: string, active: boolean }) => (
    <div className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-sm flex items-center justify-between group hover:border-zinc-700 transition-all cursor-pointer">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{label}</span>
        <div className={`w-10 h-5 rounded-full relative transition-all border ${active ? 'bg-amber-500/20 border-amber-500/30 shadow-[0_0_10px_-2px_rgba(245,158,11,0.2)]' : 'bg-zinc-900 border-zinc-800'}`}>
            <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${active ? 'right-0.5 bg-amber-500' : 'left-0.5 bg-zinc-700'}`} />
        </div>
    </div>
);
