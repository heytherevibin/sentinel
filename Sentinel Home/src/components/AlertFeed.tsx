
'use client';
import { useEffect, useState, useRef } from 'react';
import { TelemetryEvent } from '@/types';
import { TechCard } from './TechCard';
import { AlertTriangle, ShieldAlert, Terminal } from 'lucide-react';

export function AlertFeed() {
    const [alerts, setAlerts] = useState<TelemetryEvent[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch('/api/telemetry/alert');
                const data = await res.json();
                if (Array.isArray(data)) setAlerts(data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <TechCard title="Live Event Stream" className="h-full flex flex-col" status={alerts.length > 0 ? 'warning' : 'normal'}
            toolbar={<span className="text-[10px] text-c2-muted">AUTO-SCROLL: ON</span>}>

            <div className="overflow-auto flex-1 min-h-0 font-mono text-xs pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-c2-border">
                <table className="w-full text-left border-collapse relative">
                    <thead className="bg-c2-paper sticky top-0 text-c2-muted uppercase tracking-wider z-10 shadow-sm">
                        <tr>
                            <th className="p-2 border-b border-c2-border">Time</th>
                            <th className="p-2 border-b border-c2-border">Type</th>
                            <th className="p-2 border-b border-c2-border">Host</th>
                            <th className="p-2 border-b border-c2-border">Details</th>
                            <th className="p-2 border-b border-c2-border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-c2-muted opacity-50">
                                    -- NO SIGNALS INTERCEPTED --
                                </td>
                            </tr>
                        ) : (
                            alerts.map((alert) => (
                                <tr key={alert.id} className="border-b border-c2-border/50 hover:bg-white/5 transition-colors">
                                    <td className="p-2 text-c2-muted">
                                        {new Date(alert.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="p-2 text-c2-primary font-bold">
                                        {alert.type}
                                    </td>
                                    <td className="p-2">{alert.metadata.host}</td>
                                    <td className="p-2 max-w-[200px] truncate opacity-80" title={JSON.stringify(alert.metadata)}>
                                        APP: {alert.metadata.windowTitle || 'N/A'}
                                        {alert.metadata.contentOverride && <span className="text-c2-danger ml-2">BLOCK: {alert.metadata.contentOverride}</span>}
                                    </td>
                                    <td className="p-2">
                                        <span className="bg-c2-danger/10 text-c2-danger px-1 rounded border border-c2-danger/30">
                                            DENY
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div ref={bottomRef} />
            </div>
        </TechCard>
    );
}
