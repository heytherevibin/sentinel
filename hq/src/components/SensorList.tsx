
'use client';
import { useEffect, useState } from 'react';
import { SensorStatus } from '@/types';
import { TechCard } from './TechCard';
import { Laptop, Wifi, WifiOff } from 'lucide-react';

export function SensorList() {
    const [sensors, setSensors] = useState<SensorStatus[]>([]);

    useEffect(() => {
        const fetchSensors = async () => {
            const res = await fetch('/api/telemetry/heartbeat');
            const data = await res.json();
            if (Array.isArray(data)) setSensors(data);
        };
        fetchSensors();
        const interval = setInterval(fetchSensors, 5000);
        return () => clearInterval(interval);
    }, []);

    // Count Online
    const onlineCount = sensors.filter(s => (Date.now() - s.lastSeen) < 60000).length;

    const issueCommand = async (sensorId: string, type: string, payload: string) => {
        await fetch('/api/command', {
            method: 'POST',
            body: JSON.stringify({ sensorId, type, payload }),
            headers: { 'Content-Type': 'application/json' }
        });
    };

    return (
        <TechCard title={`Sensor Grid [${onlineCount} ONLINE]`} className="h-full flex flex-col">
            <div className="grid grid-cols-1 gap-1 overflow-y-auto flex-1 min-h-0 pr-1 scrollbar-thin scrollbar-thumb-c2-border">
                {sensors.length === 0 ? (
                    <div className="text-center p-4 text-c2-muted text-xs">SCANNING FOR AGENTS...</div>
                ) : (
                    sensors.map(sensor => {
                        const isOnline = (Date.now() - sensor.lastSeen) < 60000;
                        return (
                            <div key={sensor.id} className={`
                                group flex items-center justify-between px-2 py-1.5 border-l-2 text-[10px] font-mono
                                ${isOnline ? 'border-c2-success bg-c2-success/5' : 'border-c2-muted bg-c2-paper'}
                            `}>
                                <div className="flex items-center gap-2">
                                    <Laptop size={12} className={isOnline ? 'text-c2-success' : 'text-c2-muted'} />
                                    <span className={isOnline ? 'text-c2-text font-bold' : 'text-c2-muted'}>{sensor.hostname}</span>
                                    <span className="text-c2-muted opacity-50">::{sensor.id.substring(0, 6)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1 mr-2">
                                        <button onClick={(e) => { e.stopPropagation(); issueCommand(sensor.id, 'PURGE', ''); }} title="Purge Clipboard" className="p-1 bg-c2-bg border border-c2-danger/50 text-c2-danger hover:bg-c2-danger hover:text-white rounded transition-colors">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); issueCommand(sensor.id, 'MSG', 'SECURITY ALERT: Please contact IT.'); }} title="Send Warning" className="p-1 bg-c2-bg border border-c2-warning/50 text-c2-warning hover:bg-c2-warning hover:text-black rounded transition-colors">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                        </button>
                                    </div>
                                    <span className="text-c2-muted">{new Date(sensor.lastSeen).toLocaleTimeString()}</span>
                                    {isOnline ? <Wifi size={10} className="text-c2-success" /> : <WifiOff size={10} className="text-c2-danger" />}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </TechCard>
    );
}
