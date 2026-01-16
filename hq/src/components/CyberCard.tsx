
import React from 'react';

interface CyberCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    alertLevel?: 'none' | 'low' | 'high';
}

export function CyberCard({ title, children, className = '', alertLevel = 'none' }: CyberCardProps) {
    const borderClass = alertLevel === 'high' ? 'border-cyber-alert' : 'border-cyber-border';
    const shadowClass = alertLevel === 'high'
        ? 'shadow-[0_0_15px_-3px_rgba(255,42,109,0.3)]'
        : 'shadow-[0_0_15px_-3px_rgba(5,217,232,0.1)]';

    return (
        <div className={`glass-panel p-6 ${borderClass} ${shadowClass} ${className} transition-all duration-300`}>
            {title && (
                <div className="flex items-center justify-between mb-4 border-b border-cyber-border/50 pb-2">
                    <h3 className="text-xl font-display font-bold uppercase tracking-widest text-cyber-primary">
                        {title}
                    </h3>
                    <div className="h-2 w-2 bg-cyber-primary rounded-full animate-pulse"></div>
                </div>
            )}
            <div className="relative">
                {children}
            </div>
        </div>
    );
}
