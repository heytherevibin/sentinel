import React from 'react';
import Waveform from './Waveform';


interface LastHeartbeatCardProps {
    lastHeartbeat?: string | null;
    lastLatency?: number | null;
}


const LastHeartbeatCard: React.FC<LastHeartbeatCardProps> = ({ lastHeartbeat, lastLatency }) => {
    const formatTime = (isoString: string | null | undefined) => {
        if (!isoString) return '--:--:--';
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        } catch {
            return '--:--:--';
        }
    };

    const formatRelativeTime = (isoString: string | null | undefined) => {
        if (!isoString) return '---';
        try {
            const date = new Date(isoString);
            const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
            if (seconds < 60) return `${seconds}s`;
            if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
            return `${Math.floor(seconds / 3600)}h`;
        } catch {
            return '---';
        }
    };

    return (
        <div className="glass-card p-3 flex flex-col justify-between premium-shadow group hover:bg-black/[0.02] dark:hover:bg-white/[0.05] transition-all duration-300 h-full relative overflow-hidden">
            <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Synchronization</span>
                    <span className="text-[8px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-tighter">Heartbeat Monitor</span>
                </div>
                <div className={`w-7 h-7 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-none ${lastLatency && lastLatency < 100 ? 'bg-success' : 'bg-warning'} glow-blue`} />
                </div>
            </div>

            {/* Central Wave Visualization */}
            <div className="flex-1 flex items-center justify-center pointer-events-none">
                <div className="w-full max-w-[80%] aspect-[3/1] mx-auto flex items-center justify-center relative overflow-hidden text-primary dark:text-cyan-400 opacity-80">
                    <Waveform width={300} height={100} color="currentColor" speed={3} className="" />
                </div>
            </div>

            <div className="flex flex-col mt-auto relative z-10">

                <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-black/20 dark:text-white/10 uppercase tracking-widest mb-0.5">Telemetry Clk</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-widest font-mono leading-none">{formatTime(lastHeartbeat)}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-primary/60 dark:text-primary/40 uppercase tracking-widest">{formatRelativeTime(lastHeartbeat)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[8px] font-bold text-slate-500 uppercase">Latency Check</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[8px] font-bold text-slate-500 uppercase">PING</span>
                        <span className="text-[11px] font-black text-primary font-mono">{lastLatency || '00'}</span>
                        <span className="text-[7px] font-bold text-slate-600">MS</span>
                    </div>
                </div>

            </div>
        </div>
    );
};



export default LastHeartbeatCard;

