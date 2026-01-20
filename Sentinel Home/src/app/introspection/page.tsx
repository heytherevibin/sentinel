'use client';

import React, { useState } from 'react';
import { Search, Filter, Shield, AlertTriangle, CheckCircle, FileText, Globe, User, Clock, ChevronRight, Activity, Database, Key } from 'lucide-react';
import { TechCard } from '@/components/TechCard';

// Dummy data for Netskope-style Introspection
const introspectionEvents = [
    { id: 'EVT-001', time: '12:45:01', app: 'Google Drive', user: 'j.smith@sentinel.io', object: 'Q4_Financials.xlsx', type: 'DLP Hit', severity: 'CRITICAL', status: 'Blocked' },
    { id: 'EVT-002', time: '12:44:12', app: 'Slack', user: 'a.jones@sentinel.io', object: 'internal_api_keys.json', type: 'Malware', severity: 'HIGH', status: 'Quarantined' },
    { id: 'EVT-003', time: '12:42:55', app: 'Salesforce', user: 'm.chen@sentinel.io', object: 'Customer_Export_2026.csv', type: 'Data Leak', severity: 'HIGH', status: 'Alerted' },
    { id: 'EVT-004', time: '12:40:10', app: 'Microsoft 365', user: 'p.brown@sentinel.io', object: 'Strategy_Deck.pptx', type: 'Policy Pass', severity: 'INFO', status: 'Allowed' },
    { id: 'EVT-005', time: '12:38:44', app: 'Box', user: 'k.white@sentinel.io', object: 'employee_data.db', type: 'PII Leak', severity: 'CRITICAL', status: 'Blocked' },
    { id: 'EVT-006', time: '12:35:12', app: 'GitHub', user: 'd.tech@sentinel.io', object: 'config.yaml', type: 'Secrets Hit', severity: 'HIGH', status: 'Blocked' },
    { id: 'EVT-007', time: '12:30:05', app: 'Dropbox', user: 'l.green@sentinel.io', object: 'vulnerability_report.pdf', type: 'Data Transfer', severity: 'LOW', status: 'Allowed' },
];

export default function IntrospectionPage() {
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    return (
        <main className="h-full bg-transparent text-zinc-300 flex flex-col font-mono overflow-hidden selection:bg-emerald-900/30 relative">

            {/* Main Operational Grid (12-col) */}
            <div className="flex-1 p-6 grid grid-cols-12 gap-6 min-h-0 overflow-hidden relative z-10">

                {/* Right Area (9 cols if detail open, 12 if closed - let's keep 9/3 split for premium feel) */}
                <div className="col-span-12 xl:col-span-9 flex flex-col gap-6 min-h-0">

                    {/* Header Controls */}
                    <div className="flex justify-between items-center bg-zinc-950/40 border border-zinc-900 p-4 rounded-sm backdrop-blur-md">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded">
                                    <Activity size={18} className="text-emerald-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Introspection Engine</span>
                                    <span className="text-xs font-bold text-zinc-100 uppercase tracking-widest">Real-time Forensic Stream</span>
                                </div>
                            </div>

                            <div className="h-8 w-[1px] bg-zinc-800 mx-2" />

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Total Events</span>
                                    <span className="text-xs font-bold text-emerald-500">1,242,091</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">DLP Violations</span>
                                    <span className="text-xs font-bold text-rose-500">42</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                                <input
                                    className="bg-black border border-zinc-800 pl-9 pr-4 py-1.5 text-[10px] uppercase font-bold tracking-widest focus:outline-none focus:border-zinc-700 w-64 rounded-sm"
                                    placeholder="SEARCH_BY_OBJECT_OR_USER..."
                                />
                            </div>
                            <button className="px-4 py-1.5 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2">
                                <Filter size={12} />
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Forensic Ledger Table */}
                    <TechCard title="FORENSIC_INB_STREAM // DPI_LEDGER" className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-zinc-950 z-20">
                                    <tr className="border-b border-zinc-900">
                                        <th className="px-5 py-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Timestamp</th>
                                        <th className="px-5 py-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Application</th>
                                        <th className="px-5 py-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest">User Identity</th>
                                        <th className="px-5 py-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Object / File</th>
                                        <th className="px-5 py-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Detection Type</th>
                                        <th className="px-5 py-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {introspectionEvents.map((event) => (
                                        <tr
                                            key={event.id}
                                            onClick={() => setSelectedEvent(event)}
                                            className={`border-b border-zinc-900/50 hover:bg-emerald-500/[0.02] cursor-pointer group transition-colors ${selectedEvent?.id === event.id ? 'bg-emerald-500/[0.05] border-l-2 border-l-emerald-500' : 'border-l-2 border-l-transparent'}`}
                                        >
                                            <td className="px-5 py-4 text-[10px] font-bold text-zinc-500 font-mono">{event.time}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Globe size={12} className="text-zinc-600" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">{event.app}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User size={12} className="text-zinc-600" />
                                                    <span className="text-[10px] font-bold text-zinc-400">{event.user}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={12} className="text-blue-500/50" />
                                                    <span className="text-[10px] font-bold text-zinc-200 truncate max-w-[150px]">{event.object}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-sm inline-block border ${event.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                    event.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                    }`}>
                                                    {event.type}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${event.status === 'Blocked' ? 'text-rose-600' :
                                                    event.status === 'Quarantined' ? 'text-amber-600' :
                                                        'text-emerald-600'
                                                    }`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TechCard>
                </div>

                <div className="col-span-12 xl:col-span-3 flex flex-col gap-6 min-h-0">
                    <TechCard title="EVENT_METADATA // DPI_ANALYSIS" className="flex-1 flex flex-col min-h-0">
                        {selectedEvent ? (
                            <div className="flex-1 flex flex-col p-5 gap-6">
                                <div className="flex flex-col gap-1 items-center justify-center p-8 bg-zinc-950/50 border border-zinc-900 rounded-sm relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent animate-[scan_4s_linear_infinite]" />
                                    <Shield size={32} className={`${selectedEvent.severity === 'CRITICAL' ? 'text-rose-500' : 'text-emerald-500'} mb-2`} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Security Index</span>
                                    <span className={`text-2xl font-black ${selectedEvent.severity === 'CRITICAL' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {selectedEvent.severity === 'CRITICAL' ? 'THREAT' : 'SECURE'}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <DetailRow label="Event ID" value={selectedEvent.id} icon={<Key size={12} />} />
                                    <DetailRow label="Site / Domain" value={`${selectedEvent.app.toLowerCase().replace(' ', '')}.com`} icon={<Globe size={12} />} />
                                    <DetailRow label="Access Method" value="Client V3" icon={<Database size={12} />} />
                                    <DetailRow label="User Agent" value="Sentinel/1.0 (X11; Linux)" icon={<Network size={12} />} />
                                </div>

                                <div className="mt-4 pt-4 border-t border-zinc-900 border-dashed">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-4">Forensic Depth Context</span>
                                    <div className="bg-black/60 border border-zinc-800 p-4 rounded-sm">
                                        <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                                            Object <span className="text-emerald-500">{selectedEvent.object}</span> was audited during a <span className="text-zinc-300">SaaS_SYNC</span> event. Forensic analysis confirmed pattern compliance with <span className="text-emerald-500">API_V2</span> security protocols.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto grid grid-cols-1 gap-2">
                                    <button className="py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all rounded-sm flex items-center justify-center gap-2">
                                        <Shield size={12} />
                                        Update Compliance
                                    </button>
                                    <button className="py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:border-zinc-600 transition-all rounded-sm">Dismiss Ledger</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-10 opacity-20">
                                <Activity size={48} className="text-zinc-600 mb-4" />
                                <span className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase text-center">Select Telemetry<br />to Analyze</span>
                            </div>
                        )}
                    </TechCard>
                </div>

            </div>

            {/* Matrix Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('/grid.svg')] bg-[length:30px_30px]" />
        </main>
    );
}

const DetailRow = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="flex items-center justify-between border-b border-zinc-900/50 pb-2">
        <div className="flex items-center gap-2">
            <span className="text-zinc-700">{icon}</span>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-zinc-400">{value}</span>
    </div>
);

const Network = ({ size, className = '' }: { size: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" /><path d="M12 12V8" /></svg>
);
