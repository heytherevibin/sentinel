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
        if (type === 'CLIPBOARD_BLOCK') return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
        if (type === 'TERMINAL_COMMAND') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        if (type === 'BROWSER_USAGE') return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
        if (type.includes('WARN')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    };

    const filteredAlerts = alerts.filter(alert => {
        // 1. Text Filter
        const payloadText = typeof alert.payload === 'string' ? alert.payload : JSON.stringify(alert.payload || {});
        // Also search metadata
        const metadataText = JSON.stringify(alert.metadata || {});
        const searchContent = `${alert.hostname} ${payloadText} ${metadataText} ${alert.type}`.toLowerCase();
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
        <div className="flex flex-col h-full relative overflow-hidden font-mono text-sm">
            {/* Filters */}
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('ALL')}
                            className={`px-2 py-1 text-[9px] border transition-colors uppercase font-bold tracking-wider ${activeTab === 'ALL' ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
                        >
                            Global Feed
                        </button>
                        <button
                            onClick={() => setActiveTab('DLP')}
                            className={`px-2 py-1 text-[9px] border transition-colors uppercase font-bold tracking-wider ${activeTab === 'DLP' ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
                        >
                            DLP Violations
                        </button>
                        <button
                            onClick={() => setActiveTab('ANOMALIES')}
                            className={`px-2 py-1 text-[9px] border transition-colors uppercase font-bold tracking-wider ${activeTab === 'ANOMALIES' ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
                        >
                            Anomalies
                        </button>
                    </div>
                </div>
                <div className="relative group">
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="SEARCH BUFFER..."
                        className="bg-black/40 border border-zinc-800 text-[10px] px-2 py-1 w-48 text-zinc-400 focus:border-emerald-500/50 outline-none placeholder:text-zinc-700 uppercase"
                    />
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-12 gap-4 px-3 py-2 border-b border-zinc-800 bg-zinc-900/30 text-[9px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">
                <div className="col-span-2">Severity</div>
                <div className="col-span-2">Time (UTC)</div>
                <div className="col-span-2">Source</div>
                <div className="col-span-4">Event Details</div>
                <div className="col-span-2 text-right">Risk Score</div>
            </div>

            {/* Grid Body */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <div className="divide-y divide-zinc-800/30">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="grid grid-cols-12 gap-4 px-3 py-3 items-center">
                                <div className="col-span-2"><Skeleton width={40} height={16} /></div>
                                <div className="col-span-2"><Skeleton width={60} height={10} /></div>
                                <div className="col-span-2"><Skeleton width={80} height={10} /></div>
                                <div className="col-span-4"><Skeleton width="90%" height={10} /></div>
                                <div className="col-span-2"><Skeleton width={30} height={10} className="ml-auto" /></div>
                            </div>
                        ))
                    ) : filteredAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-700 gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-900/50 animate-pulse" />
                            <span className="text-[10px] uppercase tracking-widest">No Active Incidents</span>
                        </div>
                    ) : (
                        filteredAlerts.map((alert, idx) => {
                            let severity = 'INFO';
                            let score = 10;

                            if (alert.type === 'CLIPBOARD_BLOCK') { severity = 'CRITICAL'; score = 98; }
                            else if (alert.type === 'TERMINAL_COMMAND') { severity = 'HIGH'; score = 75; }
                            else if (alert.type === 'BROWSER_USAGE') { severity = 'AUDIT'; score = 45; }

                            // Smart Payload Extraction
                            let details = 'System Event';
                            if (alert.type === 'BROWSER_USAGE' && alert.metadata?.url) {
                                details = `Visited: ${alert.metadata.url}`;
                            } else if (alert.type === 'TERMINAL_COMMAND' && alert.metadata?.command) {
                                details = `Exec: ${alert.metadata.command}`;
                            } else if (alert.type === 'CLIPBOARD_BLOCK' && alert.metadata?.contentSnippet) {
                                details = `Blocked Snippet: ${alert.metadata.contentSnippet}`;
                            } else if (typeof alert.payload === 'string') {
                                details = alert.payload;
                            } else if (alert.metadata?.message) {
                                details = alert.metadata.message;
                            }

                            return (
                                <div key={idx} className="grid grid-cols-12 gap-4 px-3 py-2.5 items-center hover:bg-zinc-900/20 transition-colors group text-[10px]">
                                    <div className="col-span-2">
                                        <span className={`px-1.5 py-0.5 rounded-[1px] font-bold tracking-wider border ${getSeverityStyle(alert.type)}`}>
                                            {severity}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-zinc-500 font-mono">
                                        {new Date(alert.timestamp).toLocaleTimeString()}
                                    </div>
                                    <div className="col-span-2 text-zinc-300 font-bold truncate">
                                        {alert.hostname}
                                    </div>
                                    <div className="col-span-4 text-zinc-400 truncate opacity-80 group-hover:opacity-100 transition-opacity font-mono" title={details}>
                                        {details}
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${score > 80 ? 'bg-rose-500' : score > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${score}%` }}
                                                />
                                            </div>
                                            <span className={`font-bold tabular-nums ${score > 80 ? 'text-rose-500' : score > 50 ? 'text-amber-500' : 'text-zinc-600'}`}>{score}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
