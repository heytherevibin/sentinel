'use client';
import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useSentinel } from './SentinelProvider';

const ConnectivityIndicator = () => {
    const [status, setStatus] = useState<'IDLE' | 'CONNECTED' | 'RETRYING' | 'OFFLINE'>('IDLE');

    useEffect(() => {
        let isMounted = true;
        const checkHealth = async () => {
            try {
                const res = await fetch('/api/system/health?t=' + Date.now(), { cache: 'no-store' });
                if (res.ok) {
                    if (isMounted) setStatus('CONNECTED');
                } else {
                    if (isMounted) setStatus('OFFLINE');
                }
            } catch (e) {
                if (isMounted) setStatus('OFFLINE');
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 10000); // Check every 10s
        return () => { isMounted = false; clearInterval(interval); };
    }, []);

    const colors = {
        IDLE: 'bg-zinc-700',
        CONNECTED: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
        RETRYING: 'bg-amber-500 animate-pulse',
        OFFLINE: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
    };

    return (
        <div className="flex items-center gap-2 px-3 py-1 border border-zinc-900 bg-zinc-950/50 rounded-sm">
            <div className={`w-1.5 h-1.5 rounded-full ${colors[status]}`} />
            <span className="text-[9px] font-bold tracking-widest text-zinc-500 uppercase">
                Link: <span className={status === 'CONNECTED' ? 'text-emerald-500' : status === 'OFFLINE' ? 'text-rose-500' : 'text-zinc-400'}>{status}</span>
            </span>
        </div>
    );
};

export const Header = React.memo(function Header() {
    const { stats } = useSentinel();
    return (
        <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-black z-20 shrink-0">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-emerald-500">
                    <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center rounded-sm">
                        <Activity size={18} />
                    </div>
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tighter text-white leading-none flex flex-col">
                        <span className="leading-none">SENTINEL</span>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[9px] tracking-[0.2em] text-zinc-500 font-bold uppercase">COMMAND</span>
                            <div className="w-2 h-[6px] bg-emerald-500 mt-0.5" />
                            <span className="text-[9px] tracking-[0.2em] text-zinc-500 font-bold uppercase">CORE</span>
                        </div>
                    </h1>
                </div>
                <ConnectivityIndicator />
            </div>

            {/* Tactical Navigation */}
            <Navigation />

            <div className="flex gap-12 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] mb-1">Threat_Con</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`w-1 h-4 skew-x-[-10deg] ${stats.threatsBlocked > 0 && i <= 3 ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] mb-1">Protocol</span>
                    <span className="text-emerald-500">AES-256-GCM</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] mb-1">Operator</span>
                    <span className="text-white">ANALYST_01</span>
                </div>
            </div>
        </header>
    );
});
