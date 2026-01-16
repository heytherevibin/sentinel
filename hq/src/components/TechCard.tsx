
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TechCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    status?: 'normal' | 'warning' | 'critical';
    toolbar?: React.ReactNode;
}

export function TechCard({ title, children, className, status = 'normal', toolbar }: TechCardProps) {
    const borderColor = status === 'critical' ? 'border-c2-danger' :
        status === 'warning' ? 'border-c2-warning' : 'border-c2-border';

    return (
        <div className={twMerge("bg-c2-surface border relative flex flex-col shadow-sm", borderColor, className)}>
            {/* Header Strip */}
            {title && (
                <div className="flex items-center justify-between px-4 py-2 bg-c2-paper border-b border-c2-border">
                    <div className="flex items-center gap-2">
                        <div className={clsx("w-1 h-3", {
                            "bg-c2-primary": status === 'normal',
                            "bg-c2-warning": status === 'warning',
                            "bg-c2-danger": status === 'critical',
                        })}></div>
                        <h3 className="text-sm font-bold tracking-wider text-c2-text uppercase">{title}</h3>
                    </div>
                    <div>{toolbar}</div>
                </div>
            )}

            {/* Content */}
            <div className="p-4 relative flex-1 min-h-0 flex flex-col">
                {children}
            </div>

            {/* Corner Decorators */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-c2-text opacity-20"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-c2-text opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-c2-text opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-c2-text opacity-20"></div>
        </div>
    );
}
