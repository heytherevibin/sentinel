
import React from 'react';
import Icon from './Icon';

interface TopologyDiagramProps {
    status?: 'ONLINE' | 'OFFLINE' | 'WARNING' | string;
    className?: string;
}

const TopologyDiagram: React.FC<TopologyDiagramProps> = ({ status = 'OFFLINE', className = '' }) => {
    const isOnline = status === 'ONLINE';
    const isWarning = status === 'WARNING';

    const activeColor = isOnline ? 'text-success' : isWarning ? 'text-warning' : 'text-danger';
    const activeBg = isOnline ? 'bg-success' : isWarning ? 'bg-warning' : 'bg-danger';

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {/* Node */}
            <div className="flex flex-col items-center">
                <div className={`w-2 h-2 ${activeBg} glow-blue transition-colors duration-500`}></div>
                <span className="text-[6px] font-black text-slate-500 dark:text-slate-600 mt-1 uppercase tracking-tighter">Node</span>
            </div>

            {/* Line 1 */}
            <div className="w-8 h-[1px] bg-slate-800/40 relative overflow-hidden">
                <div className={`absolute inset-0 ${activeBg} opacity-20 duration-500 transition-colors`}></div>
                {isOnline && (
                    <div className="absolute inset-0 bg-success animate-slide-right opacity-60"></div>
                )}
            </div>

            {/* Gateway */}
            <div className="flex flex-col items-center">
                <div className={`w-2 h-2 ${isOnline || isWarning ? activeBg : 'bg-slate-800'} transition-colors duration-500`}></div>
                <span className="text-[6px] font-black text-slate-500 dark:text-slate-600 mt-1 uppercase tracking-tighter">GTW</span>
            </div>

            {/* Line 2 */}
            <div className="w-8 h-[1px] bg-slate-800/40 relative overflow-hidden">
                <div className={`absolute inset-0 ${isOnline ? 'bg-success/20' : 'bg-slate-800'} duration-500 transition-colors`}></div>
                {isOnline && (
                    <div className="absolute inset-0 bg-success animate-slide-right opacity-40" style={{ animationDelay: '0.2s' }}></div>
                )}
            </div>

            {/* HQ */}
            <div className="flex flex-col items-center">
                <div className={`w-2 h-2 ${isOnline ? 'bg-primary' : 'bg-slate-800'} transition-colors duration-500`}></div>
                <span className="text-[6px] font-black text-slate-500 dark:text-slate-600 mt-1 uppercase tracking-tighter">HQ</span>
            </div>
        </div>
    );
};

export default TopologyDiagram;
