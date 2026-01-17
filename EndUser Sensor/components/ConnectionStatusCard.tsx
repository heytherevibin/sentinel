import React from 'react';
import Icon from './Icon';
import Waveform from './Waveform';
import TopologyDiagram from './TopologyDiagram';


interface ConnectionStatusCardProps {
    status?: 'ONLINE' | 'OFFLINE' | 'WARNING' | string;
}


const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({ status = 'OFFLINE' }) => {
    const isOnline = status === 'ONLINE';
    const isWarning = status === 'WARNING';

    return (
        <div className={`h-full p-4 flex items-center justify-between relative overflow-hidden transition-all duration-500 premium-shadow glass-card group`}>
            {/* Background Waveform */}


            <div className="relative z-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-1.5 h-1.5 rounded-none ${isOnline ? 'bg-success animate-pulse' :
                        isWarning ? 'bg-warning' :
                            'bg-danger'
                        } glow-blue`} />
                    <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 dark:text-white/30 uppercase">System Status</span>
                </div>

                <div className="flex items-baseline gap-4">
                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
                        {isOnline ? 'SYNCED' : isWarning ? 'STABILIZING' : 'OFFLINE'}
                    </h2>
                    <TopologyDiagram status={status} className="mb-0.5" />
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                    {isOnline
                        ? 'Encrypted Telemetry Active'
                        : isWarning ? 'Signal Reconstruction'
                            : 'Link Aborted'}
                </p>
            </div>

            <div className="relative z-10 flex items-center justify-center w-14 h-14 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 group-hover:border-primary/20 transition-all">
                <div className={`transition-colors duration-500 ${isOnline ? 'text-success glow-emerald' : isWarning ? 'text-warning' : 'text-danger'}`}>
                    <Icon name={isOnline ? 'wifi_tethering' : isWarning ? 'signal_wifi_status_dark' : 'wifi_tethering_off'} size={28} />
                </div>
            </div>
        </div>
    );
};



export default ConnectionStatusCard;

