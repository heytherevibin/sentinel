
import React from 'react';
import Icon from './Icon';

interface RecentActivityCardProps {
    connectionStatus?: 'ONLINE' | 'OFFLINE' | 'WARNING' | string;
    lastHeartbeat?: string | null;
    recentAlerts?: any[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ connectionStatus = 'OFFLINE', lastHeartbeat, recentAlerts = [] }) => {
    const activities: Array<{ time: string; message: string; status: 'error' | 'info' | 'warning' }> = [];

    if (recentAlerts && recentAlerts.length > 0) {
        recentAlerts.forEach(alert => {
            const date = new Date(alert.timestamp);
            let status: 'error' | 'info' | 'warning' = 'info';
            let message = alert.type;

            if (alert.type === 'CLIPBOARD_BLOCK') {
                status = 'warning';
                message = `Blocked: ${alert.metadata?.contentType || 'Clipboard'}`;
            } else if (alert.type === 'SYSTEM_ALERT') {
                status = 'error';
                message = `System: ${alert.metadata?.message || 'Alert'}`;
            } else if (alert.type === 'HEARTBEAT') {
                status = 'info';
                message = 'Heartbeat Sync';
            }

            activities.push({
                time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
                message: message,
                status: status
            });
        });
    } else {
        // Fallback fake data if no real alerts provided
        if (connectionStatus === 'OFFLINE') {
            activities.push({
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
                message: 'HQ Connection Lost. Proto: FAIL',
                status: 'error'
            });
        } else if (connectionStatus === 'ONLINE' && lastHeartbeat) {
            // ... existing fallback ...
            try {
                const date = new Date(lastHeartbeat);
                activities.push({
                    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
                    message: 'Encrypted Burst: ACK',
                    status: 'info'
                });
            } catch { }
        }
    }


    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'error': return 'bg-danger text-danger';
            case 'warning': return 'bg-warning text-warning';
            default: return 'bg-success text-success';
        }
    }

    return (
        <div className="glass-card p-3 flex flex-col premium-shadow h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">Transmission Log</span>
                    <span className="text-[8px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-tighter">Encrypted Bursts</span>
                </div>
                <div className="w-7 h-7 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-white/20">
                    <Icon name="segment" size={14} />
                </div>
            </div>


            <div className="flex-1 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 dark:scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-slate-600 dark:hover:scrollbar-thumb-white/30">
                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-2 bg-black/[0.02] dark:bg-white/[0.02] border-l border-black/5 dark:border-white/5 transition-colors">
                            <span className={`w-1 h-2 rounded-none flex-shrink-0 ${getStatusStyles(activity.status).split(' ')[0]}`}></span>
                            <span className="text-[9px] font-mono text-slate-400 dark:text-white/20 flex-shrink-0 tracking-tighter">{activity.time}</span>
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold truncate flex-1 uppercase tracking-tighter">{activity.message}</span>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${getStatusStyles(activity.status).split(' ')[1]}`}>
                                {activity.status}
                            </span>
                        </div>
                    ))

                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-10">
                        <Icon name="hourglass_empty" size={18} />
                    </div>
                )}
            </div>
        </div>
    );
};



export default RecentActivityCard;

