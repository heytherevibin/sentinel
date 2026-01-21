import React from 'react';

interface NeuralAlignmentGaugeProps {
    score: number;
    status: 'idle' | 'processing' | 'active';
}

export function NeuralAlignmentGauge({ score, status }: NeuralAlignmentGaugeProps) {
    const isProcessing = status === 'processing';
    const isActive = status === 'active';

    // Color logic
    const getColorClass = (s: number) => {
        if (!isActive && !isProcessing) return 'bg-zinc-800';
        if (s >= 80) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
        if (s >= 50) return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]';
        return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]';
    };

    const segments = 20;
    const activeSegments = Math.round((score / 100) * segments);

    return (
        <div className="flex flex-col gap-5 p-5 bg-zinc-950/40 border-y border-zinc-900/50 relative overflow-hidden group select-none">
            {/* Background Tech Detail */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:10px_10px] opacity-[0.03] pointer-events-none" />

            <div className="flex items-end justify-between relative z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-300 tracking-[0.25em] uppercase leading-none">Alignment_Stability_Index</span>
                    <span className="text-[7.5px] text-zinc-600 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.8)]" />
                        Neural_Bridge: <span className="text-emerald-500/80">Secured</span>
                    </span>
                </div>
                <div className="text-4xl font-black text-zinc-100 tracking-tighter tabular-nums flex items-baseline gap-1 leading-none">
                    {score}<span className="text-[12px] text-zinc-600 font-bold uppercase">%</span>
                </div>
            </div>

            {/* Linear Array */}
            <div className="flex gap-1.5 h-3 relative z-10">
                {Array.from({ length: segments }).map((_, i) => {
                    const isActiveSegment = i < activeSegments;
                    return (
                        <div
                            key={i}
                            className={`flex-1 rounded-[1px] transition-all duration-700 ease-out ${isActiveSegment
                                ? getColorClass(score)
                                : 'bg-zinc-900/80 border border-zinc-800/20'
                                } ${isProcessing ? 'animate-pulse' : ''}`}
                            style={{
                                transitionDelay: `${i * 20}ms`,
                                transform: isActiveSegment ? 'scaleY(1)' : 'scaleY(0.7)'
                            }}
                        />
                    );
                })}
            </div>

            {/* Status Footer Detail */}
            <div className="flex justify-between items-center relative z-10 px-0.5 mt-1 border-t pt-2 border-zinc-900/50">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Phase: <span className="text-zinc-300">Sync_Lock</span></span>
                    </div>
                </div>
                <span className="text-[7px] font-bold text-zinc-700 uppercase tracking-[0.3em]">Module_ID: ARC_24_NORTH</span>
            </div>
        </div>
    );
}
