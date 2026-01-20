import React from 'react';

interface NeuralAlignmentGaugeProps {
    score: number;
    status: 'idle' | 'processing' | 'active';
}

export function NeuralAlignmentGauge({ score, status }: NeuralAlignmentGaugeProps) {
    const isProcessing = status === 'processing';
    const isActive = status === 'active';

    // Color logic
    const getColor = (s: number) => {
        if (!isActive && !isProcessing) return '#3f3f46'; // zinc-700
        if (s >= 80) return '#10b981'; // Emerald-500
        if (s >= 50) return '#f59e0b'; // Amber-500
        return '#f43f5e'; // Rose-500
    };

    const color = getColor(score);
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-zinc-950/20 border border-zinc-800/50 rounded-lg relative overflow-hidden group">
            {/* Background Radar Scan */}
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${isActive ? 'via-emerald-500/5' : 'via-zinc-500/5'} to-transparent h-[40%] w-full animate-[scan_4s_linear_infinite] opacity-30 pointer-events-none`} />

            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className={`w-full h-full -rotate-90 ${isProcessing ? 'animate-pulse' : ''}`} viewBox="0 0 80 80">
                    {/* Background Track */}
                    <circle cx="40" cy="40" r={radius} stroke="#18181b" strokeWidth="6" fill="none" />
                    {/* Progress Track */}
                    <circle
                        cx="40" cy="40" r={radius}
                        stroke={color}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={isProcessing ? circumference * 0.7 : offset}
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ease-out ${isProcessing ? 'animate-[spin_3s_linear_infinite]' : ''}`}
                        style={{ transformOrigin: 'center' }}
                    />
                    {/* Inner Decoration */}
                    <circle cx="40" cy="40" r={radius - 8} stroke={color} strokeWidth="1" strokeDasharray="2 4" fill="none" className="opacity-20" />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-black tracking-tighter leading-none transition-colors duration-500 ${isActive ? (score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500') : 'text-zinc-700'}`}>
                        {isProcessing ? '...' : isActive ? score : '00'}
                    </span>
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-1">
                        {isProcessing ? 'SYNCING' : 'ALIGNMENT'}
                    </span>
                </div>
            </div>

            {/* Tactical Load Markers */}
            <div className="w-full mt-4 space-y-2">
                <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-zinc-500">
                    <span>Model Confidence</span>
                    <span className={isActive ? 'text-emerald-500' : ''}>{isActive ? `${score}%` : '---'}</span>
                </div>
                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-1000"
                        style={{ width: isActive ? `${score}%` : '0%' }}
                    />
                </div>
            </div>
        </div>
    );
}

// Custom animation for scanning effect if not in globals.css
// Note: Usually should be in globals.css, adding here as a reminder/failsafe
