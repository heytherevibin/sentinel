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
