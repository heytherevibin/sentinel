'use client';

import { Activity, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSentinel } from './SentinelProvider';

export function TechFooter() {
    const { uptime } = useSentinel();
    const [sessionId, setSessionId] = useState("INITIALIZING...");

    useEffect(() => {
        setSessionId(Math.random().toString(36).substring(7).toUpperCase());
    }, []);

    return (
        <footer className="shrink-0 border-t border-c2-border bg-c2-paper py-2 px-4 md:px-6 text-[10px] text-c2-muted font-mono flex justify-between items-center select-none cursor-default z-50">
            {/* Left: Status Ticker */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-c2-primary">
                    <Activity size={10} />
                    <span className="font-bold tracking-wider">SENTINEL_DAEMON</span>
                </div>
                <div className="text-c2-success hidden md:block">● SYSTEM ONLINE</div>
                <div className="hidden md:flex items-center gap-1">
                    <Lock size={10} />
                    <span>ENCRYPTED</span>
                </div>
            </div>

            {/* Right: Technical Metadata */}
            <div className="flex items-center gap-4 opacity-70">
                <span className="hover:text-c2-text transition-colors">LATENCY: 12ms</span>
                <span className="border-l border-c2-border pl-4">BUILD: v2.0.4</span>
                <span className="hidden md:inline">:: {sessionId}</span>
            </div>
        </footer>
    );
}
