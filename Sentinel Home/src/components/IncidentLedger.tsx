'use client';

import React from 'react';
import { TelemetryEvent } from '@/types';
import { Skeleton } from './Skeleton';

interface IncidentLedgerProps {
    alerts: TelemetryEvent[];
    isLoading?: boolean;
}

export function IncidentLedger({ alerts, isLoading = false }: IncidentLedgerProps) {
    const [filter, setFilter] = React.useState('');
    const [activeTab, setActiveTab] = React.useState<'ALL' | 'DLP' | 'ANOMALIES'>('ALL');

    // Helper to format severity style
    const getSeverityStyle = (type: string) => {
        if (type === 'CLIPBOARD_BLOCK') return 'bg-c2-danger text-white font-black';
        if (type.includes('WARN')) return 'bg-c2-secondary text-black font-bold';
        return 'bg-c2-muted text-white font-medium';
    };

    const filteredAlerts = alerts.filter(alert => {
        // 1. Text Filter
        const payloadText = typeof alert.payload === 'string' ? alert.payload : JSON.stringify(alert.payload || {});
        const searchContent = `${alert.hostname} ${payloadText} ${alert.type}`.toLowerCase();
        const matchesText = searchContent.includes(filter.toLowerCase());

        // 2. Category Filter
        let matchesCategory = true;
        if (activeTab === 'DLP') {
            matchesCategory = alert.type === 'CLIPBOARD_BLOCK';
        } else if (activeTab === 'ANOMALIES') {
            matchesCategory = alert.type !== 'CLIPBOARD_BLOCK';
        }

        return matchesText && matchesCategory;
    });

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Filters */}
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('ALL')}
                            className={`px-2 py-0.5 text-[9px] border transition-colors ${activeTab === 'ALL' ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
                        >
                            ALL EVENTS
                        </button>
                        <button
                            onClick={() => setActiveTab('DLP')}
                            className={`px-2 py-0.5 text-[9px] border transition-colors ${activeTab === 'DLP' ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
                        >
                            DLP_BLOCK
                        </button>
                        <button
                            onClick={() => setActiveTab('ANOMALIES')}
                            className={`px-2 py-0.5 text-[9px] border transition-colors ${activeTab === 'ANOMALIES' ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
                        >
                            ANOMALIES
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Filter by IP, User, Rule..."
                        className="bg-black/40 border border-zinc-800 text-[10px] px-2 py-1 w-48 text-zinc-400 focus:border-emerald-500 outline-none placeholder:text-zinc-700"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700 transition-colors">
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
                        {isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <tr key={i} className="border-b border-zinc-900 transition-colors group">
                                    <td className="py-3 pl-2"><Skeleton width={40} height={12} /></td>
                                    <td className="py-3"><Skeleton width={60} height={10} /></td>
                                    <td className="py-3"><Skeleton width={80} height={10} /></td>
                                    <td className="py-3"><Skeleton width="80%" height={10} /></td>
                                    <td className="py-3"><Skeleton width={50} height={10} /></td>
                                    <td className="py-3 pr-2"><div className="flex justify-end"><Skeleton width={60} height={12} /></div></td>
                                </tr>
                            ))
                        ) : filteredAlerts.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8 text-zinc-600">NO INCIDENTS FOUND</td></tr>
                        ) : (
                            filteredAlerts.map((alert, idx) => {
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
                                            {/* Safely render payload or metadata content */}
                                            {typeof alert.payload === 'string' ? alert.payload :
                                                alert.payload?.message || alert.payload?.contentSnippet ||
                                                alert.metadata?.message || 'System Event'}
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
