import React from 'react';
import Icon from './Icon';

const AboutView: React.FC = () => {
    return (
        <div className="flex-1 flex items-center justify-center p-6 select-none relative overflow-hidden">
            <div className="glass-card w-[520px] p-8 border border-white/5 flex items-center gap-8 relative overflow-hidden premium-shadow z-10">

                {/* App Icon */}
                <div className="w-24 h-24 flex-shrink-0 bg-black/40 rounded-[22%] overflow-hidden shadow-2xl border border-white/10">
                    <img
                        src="./assets/app_icon.png"
                        alt="Sentinel App Icon"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>

                {/* App Identity */}
                <div className="flex-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">Sentinel</h1>
                    <p className="text-[12px] text-slate-500 font-bold tracking-tight mb-3">Version 1.2.0 (STABLE)</p>

                    <div className="flex items-center gap-1.5 px-2 py-1 bg-success/10 border border-success/20 w-max">
                        <Icon name="verified" size={12} className="text-success" />
                        <span className="text-[9px] font-black text-success uppercase tracking-widest">Authorized Node</span>
                    </div>

                    <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                        <p className="text-[8px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest mb-1">Chief Architect</p>
                        <p className="text-[10px] text-primary/80 font-black uppercase tracking-wider">HeyThereVibin</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 w-36">
                    <button className="w-full py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 text-[10px] font-bold text-slate-900 dark:text-white transition-all shadow-sm rounded-md uppercase tracking-tighter">
                        What's new
                    </button>
                    <button className="w-full py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 text-[10px] font-bold text-slate-900 dark:text-white transition-all shadow-sm rounded-md uppercase tracking-tighter">
                        Introduction
                    </button>
                    <button className="w-full py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 text-[10px] font-bold text-slate-900 dark:text-white transition-all shadow-sm rounded-md uppercase tracking-tighter">
                        Support
                    </button>
                </div>
            </div>

            {/* Return Dashboard Link */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
                <button
                    onClick={() => window.location.hash = '#/'}
                    className="text-[9px] font-black text-slate-500 hover:text-primary transition-all underline decoration-black/10 dark:decoration-white/10 underline-offset-4 uppercase tracking-[0.3em]"
                >
                    Return to Dashboard
                </button>
            </div>


            {/* Background Decoration */}
            <div className="absolute bottom-10 right-10 opacity-5 pointer-events-none rotate-12">
                <Icon name="radar" size={300} className="text-primary" />
            </div>
        </div>
    );
};


export default AboutView;

