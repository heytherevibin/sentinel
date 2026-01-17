
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TechCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    status?: 'normal' | 'warning' | 'critical' | 'offline';
    toolbar?: React.ReactNode;
}

export function TechCard({ title, children, className, status = 'normal', toolbar }: TechCardProps) {
    const statusColor = {
        'normal': 'bg-emerald-500',
        'warning': 'bg-amber-500',
        'critical': 'bg-rose-500',
        'offline': 'bg-zinc-600'
    }[status];

    return (
        <div className={twMerge("flex flex-col bg-black border border-zinc-700 relative group overflow-hidden", className)}>
            {/* Mission Control Header */}
            {title && (
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/30 border-b border-zinc-700 select-none">
                    <div className="flex items-center gap-3">
                        {/* Status Indicator - Rectangular, Functional */}
                        <div className="flex gap-0.5">
                            <div className={clsx("w-1 h-3 rounded-sm shadow-[0_0_8px_-1px_currentColor]", statusColor,
                                status !== 'offline' && "text-opacity-80")} />
                            {status === 'normal' && <div className="w-1 h-3 bg-emerald-500/20 rounded-sm" />}
                        </div>

                        <h3 className="text-[11px] font-bold tracking-[0.2em] text-zinc-300 uppercase font-mono">
                            {title}
                        </h3>
                    </div>

                    <div className="flex items-center gap-4">
                        {toolbar}
                    </div>
                </div>
            )}

            {/* Content Container */}
            <div className="p-4 relative flex-1 min-h-0 flex flex-col bg-[url('/grid.svg')] bg-[length:20px_20px] bg-opacity-5">
                {children}
            </div>

            {/* Strategic Corner Markers (C2 Style) */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-zinc-600/50"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-zinc-600/50"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-zinc-600/50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-zinc-600/50"></div>
        </div>
    );
}
