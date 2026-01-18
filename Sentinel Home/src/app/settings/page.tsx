'use client';

import { useState, useEffect } from 'react';
import { TechCard } from '@/components/TechCard';
import { Settings, User, Shield, Lock, Database, LogOut, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    // Mock stats for header consistency
    const stats = { threatsBlocked: 0 };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;
        const fetchLogs = async () => {
            try {
                const res = await fetch(`/api/system/logs?t=${Date.now()}`, {
                    cache: 'no-store',
                    headers: {
                        'Pragma': 'no-cache',
                        'Cache-Control': 'no-cache'
                    }
                });
                const data = await res.json();
                if (isMounted && Array.isArray(data)) setLogs(data);
            } catch (e) {
                console.error('Log fetch failed', e);
            }
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 5000); // Optimized: 5s polling
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sentinel-logs-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <main className="h-full bg-transparent text-zinc-300 flex flex-col font-mono overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-100">

            {/* Main Content Area */}
            <div className="flex-1 p-8 min-h-0 overflow-hidden relative z-10">
                <div className="max-w-5xl mx-auto flex flex-col gap-8 h-full">

                    <div className="flex items-center gap-4 shrink-0">
                        <div className="p-3 bg-zinc-900 border border-zinc-800">
                            <Settings className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">SYSTEM CONFIGURATION</h2>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Manage global parameters and user access controls</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 shrink-0">
                        {/* Profile Settings */}
                        <TechCard title="Operator Profile">
                            <div className="flex flex-col gap-4 p-2">
                                <div className="flex items-center justify-between p-4 border border-zinc-900 bg-zinc-950/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center rounded-full">
                                            <User className="text-zinc-400" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">ANALYST_01</div>
                                            <div className="text-[10px] text-zinc-500 uppercase">Security Clearance: Level 4</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-[10px] flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all font-bold uppercase tracking-wider"
                                    >
                                        <LogOut size={12} />
                                        Disconnect
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border border-zinc-900 hover:border-emerald-500/30 transition-colors cursor-pointer group">
                                        <div className="text-[10px] text-zinc-500 uppercase mb-1">Session ID</div>
                                        <div className="text-emerald-500 font-mono text-xs group-hover:text-emerald-400">XYZ-7749-ALPHA</div>
                                    </div>
                                    <div className="p-4 border border-zinc-900 hover:border-emerald-500/30 transition-colors cursor-pointer group">
                                        <div className="text-[10px] text-zinc-500 uppercase mb-1">Last Login</div>
                                        <div className="text-emerald-500 font-mono text-xs group-hover:text-emerald-400">14:02:22 UTC</div>
                                    </div>
                                </div>
                            </div>
                        </TechCard>

                        {/* Security Parameters */}
                        <TechCard title="Security Parameters" className="h-full">
                            <div className="flex flex-col gap-2 p-2">
                                {[
                                    { label: 'Two-Factor Auth', icon: Lock, status: 'Active', color: 'text-emerald-500' },
                                    { label: 'Database Encryption', icon: Database, status: 'AES-256', color: 'text-amber-500' },
                                    { label: 'Firewall Rules', icon: Shield, status: 'Strict', color: 'text-emerald-500' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 border-b border-zinc-900 last:border-0 hover:bg-zinc-900/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <item.icon size={14} className="text-zinc-500" />
                                            <span className="text-xs text-zinc-300 font-bold uppercase">{item.label}</span>
                                        </div>
                                        <span className={`text-[10px] uppercase font-bold ${item.color}`}>{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </TechCard>
                    </div>

                    {/* System Logs */}
                    <TechCard
                        title="System Diagnostics"
                        className="flex-1 min-h-0"
                        toolbar={
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[9px] uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                            >
                                <Download size={12} />
                                Export Logs
                            </button>
                        }
                    >
                        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-zinc-700 scrollbar-track-transparent transition-colors p-4 font-mono text-[10px] flex flex-col gap-1">
                            {logs.length === 0 ? (
                                <div className="text-zinc-600 italic">No system logs available...</div>
                            ) : (
                                logs.map((log, idx) => (
                                    <div key={idx} className="flex gap-3 border-b border-zinc-900/30 pb-1 last:border-0 hover:bg-zinc-900/40 px-1 transition-colors group">
                                        <span className="text-zinc-500 shrink-0 tabular-nums">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                        <span className={`shrink-0 font-bold ${log.type === 'ERROR' ? 'text-red-400' : 'text-emerald-400'}`}>{log.type}</span>
                                        <span className="text-zinc-400 shrink-0">{log.component}:</span>
                                        <span className="text-zinc-200 truncate group-hover:text-white">{log.message}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </TechCard>
                </div>
            </div>

        </main>
    );
}
