import React from 'react';
import { TelemetryEvent } from '@/lib/store';

interface IncidentLedgerProps {
    alerts: TelemetryEvent[];
}

export function IncidentLedger({ alerts }: IncidentLedgerProps) {

    // Helper to format severity style
    const getSeverityStyle = (type: string) => {
        if (type === 'CLIPBOARD_BLOCK') return 'bg-c2-danger text-black font-black';
        if (type.includes('WARN')) return 'bg-c2-secondary text-black font-bold';
        return 'bg-c2-muted text-white font-medium';
    };

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Filters */}
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                        <span className="px-2 py-0.5 text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400">ALL EVENTS</span>
                        <span className="px-2 py-0.5 text-[9px] text-zinc-600 hover:text-zinc-400 cursor-pointer">DLP_BLOCK</span>
                        <span className="px-2 py-0.5 text-[9px] text-zinc-600 hover:text-zinc-400 cursor-pointer">ANOMALIES</span>
                    </div>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Filter by IP, User, Rule..."
                        className="bg-black/40 border border-zinc-800 text-[10px] px-2 py-1 w-48 text-zinc-400 focus:border-emerald-500 outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950 hover:scrollbar-thumb-zinc-700">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-black z-10">
                        <tr className="text-[9px] text-zinc-600 uppercase tracking-widest border-b border-zinc-800">
                            <th className="py-2 pl-2">Severity</th>
                            <th className="py-2">Time</th>
                            <th className="py-2">Source</th>
                            <th className="py-2">Destination / Details</th>
                            <th className="py-2">Protocol</th>
                            <th className="py-2 pr-2 text-right">Risk Score</th>
                        </tr>
                    </thead>
                    <tbody className="font-mono text-[10px]">
                        {alerts.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8 text-zinc-600">NO INCIDENTS RECORDED</td></tr>
                        ) : (
                            alerts.map((alert, idx) => {
                                const severity = alert.type === 'CLIPBOARD_BLOCK' ? 'CRITICAL' : 'INFO';
                                const score = alert.type === 'CLIPBOARD_BLOCK' ? 98 : 12;
                                return (
                                    <tr key={idx} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors group">
                                        <td className="py-2 pl-2">
                                            <span className={`px-1.5 py-0.5 rounded-[1px] text-[8px] ${getSeverityStyle(alert.type)}`}>
                                                {severity}
                                            </span>
                                        </td>
                                        <td className="py-2 text-zinc-400 opacity-80">{new Date(alert.timestamp).toLocaleTimeString()}</td>
                                        <td className="py-2 text-zinc-300 font-bold">{alert.hostname}</td>
                                        <td className="py-2 text-zinc-400 opacity-70">
                                            {/* Simulate detail based on alert content */}
                                            {alert.payload || 'System Event'}
                                        </td>
                                        <td className="py-2 text-amber-500">HTTPS/443</td>
                                        <td className="py-2 pr-2 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${score > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${score}%` }}
                                                    />
                                                </div>
                                                <span className={`font-bold ${score > 80 ? 'text-white' : 'text-zinc-600'}`}>{score}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
