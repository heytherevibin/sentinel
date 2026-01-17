
'use client';
import { useEffect, useState } from 'react';
import { SensorStatus } from '@/types';
import { TechCard } from './TechCard';
import { SquareTerminal, Unlink, RefreshCw } from 'lucide-react';

export function SensorList() {
    const [sensors, setSensors] = useState<SensorStatus[]>([]);

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                const res = await fetch('/api/telemetry/heartbeat');
                const data = await res.json();
                if (Array.isArray(data)) {
                    const sorted = [...data].sort((a: SensorStatus, b: SensorStatus) =>
                        (a.hostname || '').localeCompare(b.hostname || '')
                    );
                    setSensors(sorted);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchSensors();
        const interval = setInterval(fetchSensors, 5000);
        return () => clearInterval(interval);
    }, []);

    const onlineCount = sensors.filter(s => (Date.now() - s.lastSeen) < 60000).length;

    const issueCommand = async (sensorId: string, type: string, payload: string) => {
        await fetch('/api/command', {
            method: 'POST',
            body: JSON.stringify({ sensorId, type, payload }),
            headers: { 'Content-Type': 'application/json' }
        });
    };

    return (
        <TechCard
            title={`Sensor Grid [${onlineCount}/${sensors.length}]`}
            status={onlineCount === sensors.length && sensors.length > 0 ? 'normal' : 'warning'}
            className="h-full flex flex-col"
        >
            <div className="flex flex-col overflow-y-auto flex-1 min-h-0 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950 hover:scrollbar-thumb-zinc-700">
                {sensors.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-2">
                        <Unlink className="w-8 h-8 opacity-20" />
                        <div className="text-[10px] tracking-widest uppercase">No Uplink</div>
                    </div>
                ) : (
                    sensors.map(sensor => {
                        const isOnline = (Date.now() - sensor.lastSeen) < 60000;
                        return (
                            <div key={sensor.id} className="group flex items-center justify-between p-3 border-b border-zinc-900 hover:bg-zinc-900/30 transition-all">
                                {/* Host Info */}
                                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-sm shrink-0 ${isOnline ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' : 'bg-zinc-700'}`} />
                                        <span className={`text-[10px] font-bold tracking-wider truncate ${isOnline ? 'text-zinc-200' : 'text-zinc-600'}`} title={sensor.hostname}>
                                            {sensor.hostname.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="pl-3.5 flex items-center gap-2 text-[9px] font-mono text-zinc-600">
                                        <span>10.0.4.{sensor.id.charCodeAt(0) % 255}</span>
                                        <span className="opacity-20">|</span>
                                        <span className={isOnline ? 'text-emerald-500/80' : 'text-zinc-700'}>{isOnline ? 'LINK_ESTABLISHED' : 'NO_CARRIER'}</span>
                                    </div>
                                </div>

                                {/* Actions Toolbar */}
                                <div className="shrink-0 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => issueCommand(sensor.id, 'SYNC', 'full')}
                                        className="p-1.5 border border-zinc-800 bg-black hover:border-emerald-500/50 hover:text-emerald-500 text-zinc-600 transition-all"
                                        title="Sync Policies"
                                    >
                                        <RefreshCw size={12} />
                                    </button>
                                    <button
                                        onClick={() => issueCommand(sensor.id, 'SHELL', 'whoami')}
                                        className="p-1.5 border border-zinc-800 bg-black hover:border-amber-500/50 hover:text-amber-500 text-zinc-600 transition-all"
                                        title="Terminal Access"
                                    >
                                        <SquareTerminal size={12} />
                                    </button>
                                    <button
                                        onClick={() => issueCommand(sensor.id, 'ISOLATE', 'enable')}
                                        className="p-1.5 border border-zinc-800 bg-black hover:border-rose-500/50 hover:text-rose-500 text-zinc-600 transition-all"
                                        title="Isolate Host"
                                    >
                                        <Unlink size={12} />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </TechCard>
    );
}
