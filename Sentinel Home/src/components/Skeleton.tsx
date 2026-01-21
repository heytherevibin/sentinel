'use client';

import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    circle?: boolean;
}

export function Skeleton({ className = '', width, height, circle }: SkeletonProps) {
    return (
        <div
            className={`skeleton-box relative overflow-hidden ${className}`}
            style={{
                width: width || '100%',
                height: height || '1rem',
                borderRadius: circle ? '50%' : '2px'
            }}
        >
            <div className="absolute inset-0 animate-shimmer" />
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-3 space-y-8">
                    <Skeleton height={200} /> {/* Risk Gauge */}
                    <Skeleton height={400} /> {/* Sensor List */}
                </div>
                <div className="col-span-9 space-y-8">
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-5">
                            <Skeleton height={300} /> {/* Policy Summary */}
                        </div>
                        <div className="col-span-7">
                            <Skeleton height={300} /> {/* Traffic Analysis */}
                        </div>
                    </div>
                    <Skeleton height={400} /> {/* Incident Ledger */}
                </div>
            </div>
        </div>
    );
}

export function ConfigSkeleton() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            {/* Header Placeholder */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-4">
                    <Skeleton width={30} height={30} />
                    <div className="space-y-2">
                        <Skeleton width={200} height={12} />
                        <Skeleton width={350} height={8} className="opacity-40" />
                    </div>
                </div>
                <div className="flex gap-4">
                    <Skeleton width={100} height={32} />
                    <Skeleton width={100} height={32} />
                </div>
            </div>

            <div className="flex gap-8 h-[calc(100vh-200px)]">
                {/* Left Column */}
                <div className="w-[340px] flex flex-col gap-8 flex-shrink-0">
                    {/* Neural Alignment Card Placeholder */}
                    <div className="bg-zinc-950/40 border border-zinc-900 rounded-sm p-8 space-y-10 flex-shrink-0 relative overflow-hidden">
                        {/* Scanning Line Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-1/2 w-full animate-scan pointer-events-none" />

                        <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
                            <div className="flex items-center gap-3">
                                <Skeleton width={16} height={16} className="bg-amber-500/20" />
                                <Skeleton width={180} height={10} />
                            </div>
                        </div>

                        <div className="space-y-8 py-4">
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-spin-slow" />
                                    <Skeleton width={140} height={140} circle className="bg-zinc-900/30 border border-zinc-800" />
                                </div>
                                <div className="space-y-2 text-center">
                                    <Skeleton width={120} height={24} />
                                    <Skeleton width={80} height={8} className="opacity-50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-10 gap-1 px-4">
                                {[...Array(10)].map((_, i) => (
                                    <Skeleton key={i} height={8} className="bg-emerald-500/10" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 pt-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-zinc-950/60 border border-zinc-900/50 rounded-sm">
                                    <Skeleton width={16} height={16} circle className="opacity-40" />
                                    <Skeleton width="100%" height={10} />
                                    <Skeleton width={32} height={16} className="rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex-1 flex flex-col gap-8 min-w-0">
                    {/* Gateways Grid Placeholder */}
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="p-4 bg-black border border-zinc-800 rounded-sm flex flex-col gap-4 relative overflow-hidden">
                                <div className="flex items-center gap-4">
                                    <Skeleton width={40} height={40} className="rounded" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton width="60%" height={10} />
                                        <Skeleton width="40%" height={8} className="opacity-40" />
                                    </div>
                                </div>
                                <div className="flex border-t border-zinc-900/50 pt-3 gap-2">
                                    <Skeleton width="100%" height={24} className="bg-zinc-900/30" />
                                    <Skeleton width="100%" height={24} className="bg-zinc-900/30" />
                                    <Skeleton width={40} height={24} className="bg-zinc-900/30" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Diagnostics Terminal Placeholder */}
                    <div className="flex-1 bg-black/40 border border-zinc-900 rounded-sm flex flex-col overflow-hidden relative">
                        <div className="bg-zinc-900/40 px-6 py-2.5 flex items-center justify-between border-b border-zinc-800">
                            <div className="flex gap-8">
                                <Skeleton width={100} height={8} className="opacity-50" />
                                <Skeleton width={80} height={8} className="opacity-50" />
                                <Skeleton width={140} height={8} className="opacity-50" />
                            </div>
                            <Skeleton width={60} height={8} className="opacity-50" />
                        </div>
                        <div className="p-6 space-y-2 overflow-hidden">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => (
                                <div key={i} className="flex gap-6 items-center opacity-[0.4] hover:opacity-100 transition-opacity">
                                    <Skeleton width={80} height={6} />
                                    <Skeleton width={60} height={10} className="bg-blue-500/10" />
                                    <Skeleton width={120} height={6} />
                                    <Skeleton width="100%" height={6} />
                                    <Skeleton width={80} height={6} />
                                </div>
                            ))}
                        </div>
                        {/* Bottom Status bar for terminal */}
                        <div className="mt-auto p-3 bg-zinc-950 border-t border-zinc-900 flex justify-between">
                            <div className="flex gap-4">
                                <Skeleton width={120} height={6} />
                                <Skeleton width={80} height={6} />
                            </div>
                            <Skeleton width={150} height={6} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
