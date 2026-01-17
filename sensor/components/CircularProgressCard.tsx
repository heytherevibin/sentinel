
import React from 'react';

interface CircularProgressCardProps {
    percentage: number;
    label: string;
    title: string;
    subtitle: string;
    color?: string;
}



const CircularProgressCard: React.FC<CircularProgressCardProps> = ({
    percentage,
    label,
    title,
    subtitle,
    color = 'success'
}) => {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const semiCircumference = circumference / 2;
    const offset = semiCircumference - (percentage / 100) * semiCircumference;

    const colorMap: Record<string, string> = {
        success: 'text-success',
        warning: 'text-warning',
        danger: 'text-danger',
    };

    const textColor = colorMap[color] || 'text-primary';

    return (
        <div className="glass-card p-3 flex flex-col justify-between premium-shadow group hover:bg-white/[0.05] transition-all duration-300 h-full">
            <div className="w-full flex justify-between items-start mb-2">
                <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">{title}</p>
                    <p className="text-[8px] text-slate-500 dark:text-slate-600 font-bold uppercase tracking-tighter">{subtitle}</p>
                </div>
                <div className={`w-14 h-6 border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[9px] font-black uppercase tracking-tighter ${textColor}`}>
                    {label}
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-col h-full justify-end mt-4">

                {/* Numeric Value */}
                <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-widest leading-none">
                        {Math.round(percentage)}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                        % SYNC
                    </span>
                </div>

                {/* Segmented Progress Bar */}
                <div className="flex w-full gap-[2px] h-2">
                    {Array.from({ length: 20 }).map((_, i) => {
                        const isActive = i < (percentage / 5);
                        return (
                            <div
                                key={i}
                                className={`flex-1 rounded-[1px] transition-all duration-500 ${isActive
                                        ? `opacity-100 ${textColor.replace('text-', 'bg-')}`
                                        : 'bg-slate-200 dark:bg-white/5 opacity-50'
                                    }`}
                            />
                        );
                    })}
                </div>

            </div>

        </div>
    );
};




export default CircularProgressCard;

