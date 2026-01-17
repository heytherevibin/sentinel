
import React from 'react';

interface FooterProps {
    sensor: {
        status: any;
        sensorId?: string;
    };
}

const Footer: React.FC<FooterProps> = ({ sensor }) => {
    const status = sensor?.status || {};
    const connectionStatus = status.connectionStatus || 'OFFLINE';
    const version = status.version || '1.0.0';
    const sensorId = sensor?.sensorId || status.sensorId || 'SN-772-X';

    const statusColor = connectionStatus === 'ONLINE'
        ? 'bg-success'
        : connectionStatus === 'WARNING'
            ? 'bg-warning'
            : 'bg-danger';

    const statusLabel = connectionStatus === 'ONLINE'
        ? 'SYNCED'
        : connectionStatus === 'WARNING'
            ? 'STABILIZING'
            : 'DISCONNECTED';

    // Format sensor ID (show first 11 characters)
    const shortId = sensorId.length > 11 ? sensorId.substring(0, 11) : sensorId;

    return (
        <footer className="h-7 flex-shrink-0 px-4 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-bold border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-bg-midnight/80 backdrop-blur-md z-50">

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-none ${statusColor} glow-blue`}></div>
                    <span className="tracking-[0.2em] font-black text-slate-900 dark:text-white/80">{statusLabel}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="text-black/20 dark:text-white/10 uppercase">ID</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">{shortId}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-slate-600">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <span className="text-black/20 dark:text-white/10 uppercase">CPU</span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono">22%</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="text-black/20 dark:text-white/10 uppercase">MEM</span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono">0.8G</span>
                    </div>
                </div>
                <div className="text-black/20 dark:text-white/10 font-mono">V{version}</div>
            </div>
        </footer>

    );
};


export default Footer;

