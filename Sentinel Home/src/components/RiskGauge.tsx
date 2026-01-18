import React from 'react';
import { TechCard } from './TechCard';
import { Skeleton } from './Skeleton';

interface RiskGaugeProps {
    score: number;
    label?: string;
    isLoading?: boolean;
}

export function RiskGauge({ score, label = "GLOBAL THREAT CON", isLoading = false }: RiskGaugeProps) {
    if (isLoading) {
        return (
            <TechCard title={label} status="normal">
                <div className="flex items-center gap-4 p-2">
                    <Skeleton circle width={80} height={80} className="shrink-0" />
                    <div className="flex flex-col gap-3 flex-1">
                        <Skeleton height={12} width="80%" />
                        <Skeleton height={12} width="60%" />
                        <Skeleton height={4} width="100%" className="mt-2" />
                    </div>
                </div>
            </TechCard>
        );
    }

    // Color logic
    const getColor = (s: number) => {
        if (s >= 80) return '#f43f5e'; // Rose-500
        if (s >= 50) return '#f59e0b'; // Amber-500
        return '#10b981'; // Emerald-500
    };

    const color = getColor(score);
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const status = score >= 80 ? 'critical' : score >= 50 ? 'warning' : 'normal';

    return (
        <TechCard title={label} status={status}>
            <div className="flex items-center gap-4 p-2">
                {/* Minimal Gauge */}
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                        {/* Background */}
                        <circle cx="40" cy="40" r={radius} stroke="#27272a" strokeWidth="4" fill="none" />
                        {/* Progress */}
                        <circle
                            cx="40" cy="40" r={radius}
                            stroke={color}
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="butt"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-2xl font-bold tracking-tighter leading-none ${status === 'critical' ? 'text-rose-500' : status === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {score}
                        </span>
                    </div>
                </div>

                {/* Tactical Stats */}
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
                        <span className="text-[9px] uppercase tracking-widest text-zinc-600">Exfiltration</span>
                        <span className="text-[10px] font-bold text-rose-500">HIGH</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
                        <span className="text-[9px] uppercase tracking-widest text-zinc-600">Violations</span>
                        <span className={`text-[10px] font-bold ${score > 50 ? 'text-amber-500' : 'text-zinc-500'}`}>
                            {score > 50 ? 'MED' : 'LOW'}
                        </span>
                    </div>

                    {/* Activity Bar */}
                    <div className="flex gap-0.5 mt-1 h-1">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className={`flex-1 rounded-sm ${i < (score / 10) ? (status === 'critical' ? 'bg-rose-500' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-zinc-800'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </TechCard>
    );
}
