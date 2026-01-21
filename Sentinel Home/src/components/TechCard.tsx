
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TechCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    status?: 'normal' | 'warning' | 'critical' | 'offline' | 'active';
    toolbar?: React.ReactNode;
    icon?: React.ReactNode;
}

export const TechCard = React.memo(function TechCard({ title, children, className, contentClassName, status = 'normal', toolbar, icon }: TechCardProps) {
    const statusColor = {
        'normal': 'bg-emerald-500',
        'warning': 'bg-amber-500',
        'critical': 'bg-rose-500',
        'offline': 'bg-zinc-600',
        'active': 'bg-cyan-500'
    }[status];

    return (
        <div className={twMerge("flex flex-col bg-black border border-zinc-700 relative group overflow-hidden animate-in fade-in duration-700", className)}>
            {/* Mission Control Header */}
            {title && (
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/30 border-b border-zinc-700 select-none">
                    <div className="flex items-center gap-3">
                        {/* Status Indicator - Precision Pill */}
                        <div className={clsx("w-1.5 h-4 rounded-[1px] shadow-[0_0_8px_-1px_currentColor]", statusColor,
                            status !== 'offline' && "text-opacity-80")} />

                        <h3 className="text-[11px] font-black tracking-[0.2em] text-zinc-300 uppercase font-mono flex items-center gap-2">
                            {icon && <span className="text-zinc-500">{icon}</span>}
                            {title}
                        </h3>
                    </div>

                    <div className="flex items-center gap-4">
                        {toolbar}
                    </div>
                </div>
            )}

            {/* Content Container */}
            <div className={twMerge("p-4 relative flex-1 min-h-0 flex flex-col bg-[url('/grid.svg')] bg-[length:20px_20px] bg-opacity-5", contentClassName)}>
                {children}
            </div>

            {/* Strategic Corner Markers (C2 Style) */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-zinc-600/50"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-zinc-600/50"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-zinc-600/50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-zinc-600/50"></div>
        </div>
    );
});
