import React from 'react';
import Icon from './Icon';
import Waveform from './Waveform';


interface StatCardProps {
    icon: string;
    iconBg: string;
    iconColor: string;
    label: string;
    value: string;
    title: string;
    subtitle?: string;
    showWaveform?: boolean;
}


const StatCard: React.FC<StatCardProps> = ({ icon, iconColor, label, value, title, showWaveform = false }) => {
    return (
        <div className="glass-card p-3 flex flex-col justify-between premium-shadow group hover:bg-black/[0.02] dark:hover:bg-white/[0.05] transition-all duration-300 h-full relative overflow-hidden">
            {showWaveform && (
                <div className="absolute inset-x-0 bottom-0 h-12 opacity-10 pointer-events-none">
                    <Waveform width={200} height={48} color="var(--primary)" speed={3} amplitude={12} />
                </div>
            )}
            <div className="relative z-10 flex items-start justify-between mb-2">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">{label}</span>
                    <span className="text-[8px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-tighter">{title}</span>
                </div>
                <div className={`w-7 h-7 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center ${iconColor}`}>
                    <Icon name={icon} size={14} />
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                <span className="text-xl font-black text-slate-900 dark:text-white leading-none truncate">{value}</span>
            </div>
        </div>
    );
};




export default StatCard;

