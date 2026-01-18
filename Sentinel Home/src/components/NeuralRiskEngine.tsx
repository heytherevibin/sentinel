'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Zap, Activity, Cpu } from 'lucide-react';

export function NeuralRiskEngine() {
    const [config, setConfig] = useState<any>(null);
    const [risk, setRisk] = useState(42);
    const [scanning, setScanning] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            const res = await fetch('/api/system/config');
            const data = await res.json();
            setConfig(data);
        };
        fetchConfig();

        const interval = setInterval(() => {
            setRisk(prev => {
                const shift = Math.random() * 4 - 2;
                return Math.max(0, Math.min(100, prev + shift));
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const sensitivity = parseInt(config?.risk_sensitivity || '75');

    return (
        <div className="flex flex-col gap-6 p-2 h-full">
            {/* Engine Status Header */}
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Cpu className="text-emerald-500 animate-pulse" size={20} />
                        <div className="absolute inset-0 bg-emerald-500/20 blur-sm rounded-full" />
                    </div>
                    <div>
                        <div className="text-[10px] text-zinc-500 leading-none mb-1">ENGINE_STATUS</div>
                        <div className="text-white font-bold text-xs">V3.14-SENTINEL ACTIVE</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-zinc-500 leading-none mb-1">NEURAL_LOAD</div>
                    <div className="text-emerald-400 font-mono text-xs">12.4ms LATENCY</div>
                </div>
            </div>

            {/* Risk Visualization Grid */}
            <div className="flex-1 grid grid-cols-4 gap-2 relative">
                {/* Scanning Overlay */}
                <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none overflow-hidden">
                    <div className="w-full h-[1px] bg-emerald-500/50 absolute animate-[scan_3s_infinite]" />
                </div>

                {[...Array(16)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-full border border-zinc-900 bg-zinc-950/50 flex flex-col justify-end p-1 relative group cursor-crosshair`}
                    >
                        <div
                            className={`w-full transition-all duration-1000 ${(i * 6) + risk > sensitivity ? 'bg-rose-500/40' : 'bg-emerald-500/20'
                                }`}
                            style={{ height: `${Math.random() * 60 + 20}%` }}
                        />
                        <div className="text-[6px] text-zinc-700 mt-1 uppercase">Node_{i.toString().padStart(2, '0')}</div>
                    </div>
                ))}
            </div>

            {/* Bottom Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield size={12} className="text-emerald-500" />
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Stability Index</span>
                    </div>
                    <div className="text-xl font-bold text-white font-mono">
                        {(100 - (risk / 4)).toFixed(1)}%
                    </div>
                    <div className="w-full h-1 bg-zinc-800 mt-2 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${100 - (risk / 4)}%` }}
                        />
                    </div>
                </div>
                <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={12} className="text-amber-500" />
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Risk Sensitivity</span>
                    </div>
                    <div className="text-xl font-bold text-white font-mono">{sensitivity}%</div>
                    <div className="text-[8px] text-zinc-500 italic mt-1 font-mono uppercase">Managed by Global config</div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }
            `}</style>
        </div>
    );
}
