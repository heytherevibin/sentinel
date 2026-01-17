
import React, { useState } from 'react';
import Icon from './Icon';

interface HqServerCardProps {
    hqServerUrl: string;
}


const HqServerCard: React.FC<HqServerCardProps> = ({ hqServerUrl = 'http://localhost:3000' }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(hqServerUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <div className="glass-card p-4 flex flex-col justify-between premium-shadow group hover:bg-white/[0.05] transition-all duration-300 h-full relative overflow-hidden">

            <div>
                <p className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-2">Protocol Endpoint</p>
                <div className="bg-black/5 dark:bg-black/40 p-2 border border-black/5 dark:border-white/5 font-mono text-[10px] text-primary/80 truncate">
                    {hqServerUrl}
                </div>
            </div>

            <div className="flex justify-between items-center mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-[9px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">Secure Uplink</span>
                <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-[9px] font-black uppercase tracking-tighter transition-all duration-300 border border-black/5 dark:border-white/5 ${copied ? 'bg-success/20 text-success' : 'bg-black/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:bg-white/10'
                        }`}
                >
                    <Icon name={copied ? "check" : "content_copy"} size={12} />
                    {copied ? 'ACK' : 'COPY'}
                </button>
            </div>


        </div>
    );
};


export default HqServerCard;

