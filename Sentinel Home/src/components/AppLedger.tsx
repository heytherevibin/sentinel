'use client';

import React from 'react';
import { Database, Globe, Users, Shield, AlertCircle } from 'lucide-react';

// Mock Data (Consistent with previous catalog)
const apps = [
    {
        id: 'APP-001',
        name: 'Google Workspace',
        vendor: 'Google LLC',
        instance: 'sentinel-corp.google.com',
        type: 'Sanctioned',
        users: 142,
        cci: 98,
        certs: ['SOC2', 'ISO27001'],
        lastScan: '2m ago'
    },
    {
        id: 'APP-002',
        name: 'Slack (Corporate)',
        vendor: 'Salesforce',
        instance: 'sentinel-team.slack.com',
        type: 'Sanctioned',
        users: 138,
        cci: 92,
        certs: ['SOC2'],
        lastScan: '5m ago'
    },
    {
        id: 'APP-003',
        name: 'Dropbox (Personal)',
        vendor: 'Dropbox Inc',
        instance: 'personal-box',
        type: 'Unsanctioned',
        users: 3,
        cci: 45,
        risk: 'Exfiltration Risk'
    },
    {
        id: 'APP-004',
        name: 'ChatGPT Enterprise',
        vendor: 'OpenAI',
        instance: 'sentinel.openai.com',
        type: 'Sanctioned',
        users: 56,
        cci: 85,
        certs: ['SOC2']
    },
    {
        id: 'APP-005',
        name: 'WeTransfer',
        vendor: 'WeTransfer BV',
        instance: 'public-web',
        type: 'Unsanctioned',
        users: 1,
        cci: 30,
        risk: 'No Encryption'
    }
];

interface AppLedgerProps {
    apps?: any[];
    isLoading?: boolean;
}

export function AppLedger({ apps: initialApps = [], isLoading = false }: AppLedgerProps) {
    const [filter, setFilter] = React.useState('');
    const [activeTab, setActiveTab] = React.useState<'ALL' | 'SANCTIONED' | 'UNSANCTIONED'>('ALL');
    const [apps, setApps] = React.useState<any[]>(initialApps);

    React.useEffect(() => {
        if (initialApps.length > 0) {
            setApps(initialApps);
        } else if (!isLoading) {
            // Fetch if not provided and not loading
            fetch('/api/apps')
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP_${res.status}`);
                    const contentType = res.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) throw new Error('Invalid content type');
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data)) setApps(data);
                })
                .catch(err => console.error('AppLedger fetch error:', err));
        }
    }, [initialApps, isLoading]);

    const filteredApps = apps.filter(app => {
        const matchesText = `${app.name} ${app.vendor} ${app.instance}`.toLowerCase().includes(filter.toLowerCase());
        let matchesType = true;
        if (activeTab === 'SANCTIONED') matchesType = app.type === 'Sanctioned';
        if (activeTab === 'UNSANCTIONED') matchesType = app.type === 'Unsanctioned';
        return matchesText && matchesType;
    });

    return (
        <div className="flex flex-col h-full relative overflow-hidden font-mono text-sm">
            {/* Nav & Filters - Mirroring IncidentLedger */}
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                        {(['ALL', 'SANCTIONED', 'UNSANCTIONED'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-2 py-1 text-[9px] border transition-colors uppercase font-bold tracking-wider ${activeTab === tab ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
                            >
                                {tab.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative group">
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="SEARCH ASSETS..."
                        className="bg-black/40 border border-zinc-800 text-[10px] px-2 py-1 w-48 text-zinc-400 focus:border-emerald-500/50 outline-none placeholder:text-zinc-700 uppercase"
                    />
                </div>
            </div>

            {/* Grid Header - Identical to IncidentLedger */}
            <div className="grid grid-cols-12 gap-4 px-3 py-2 border-b border-zinc-800 bg-zinc-900/30 text-[9px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Last Scan</div>
                <div className="col-span-2">Asset Identity</div>
                <div className="col-span-4">Target Instance</div>
                <div className="col-span-2 text-right">Confidence (CCI)</div>
            </div>

            {/* Grid Body */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <div className="divide-y divide-zinc-800/30">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="grid grid-cols-12 gap-4 px-3 py-3 items-center">
                                <div className="col-span-2 text-zinc-800 animate-pulse">■■■■</div>
                                <div className="col-span-2"><div className="h-2 w-16 bg-zinc-900 rounded animate-pulse" /></div>
                                <div className="col-span-2"><div className="h-2 w-24 bg-zinc-900 rounded animate-pulse" /></div>
                                <div className="col-span-4"><div className="h-2 w-full bg-zinc-900 rounded animate-pulse" /></div>
                                <div className="col-span-2"><div className="h-2 w-12 bg-zinc-900 rounded animate-pulse ml-auto" /></div>
                            </div>
                        ))
                    ) : filteredApps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-700 gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-900/50 animate-pulse" />
                            <span className="text-[10px] uppercase tracking-widest">No matching assets</span>
                        </div>
                    ) : (
                        filteredApps.map((app, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-4 px-3 py-2.5 items-center hover:bg-zinc-900/20 transition-colors group text-[10px]">
                                {/* Type Label - Same style as severity */}
                                <div className="col-span-2">
                                    <span className={`px-1.5 py-0.5 rounded-[1px] font-bold tracking-wider border ${app.type === 'Sanctioned' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                        {app.type.toUpperCase()}
                                    </span>
                                </div>

                                {/* Last Scan (Time Equivalent) */}
                                <div className="col-span-2 text-zinc-500 font-mono">
                                    {app.lastScan || 'N/A'}
                                </div>

                                {/* Identity (Source Equivalent) */}
                                <div className="col-span-2 text-zinc-300 font-bold truncate">
                                    {app.name}
                                </div>

                                {/* Instance (Details Equivalent) */}
                                <div className="col-span-4 text-zinc-400 truncate opacity-80 group-hover:opacity-100 transition-opacity font-mono">
                                    {app.instance}
                                </div>

                                {/* Risk Bar (Risk Score Equivalent) */}
                                <div className="col-span-2 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${app.cci < 50 ? 'bg-rose-500' : app.cci < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${app.cci}%` }}
                                            />
                                        </div>
                                        <span className={`font-bold tabular-nums ${app.cci < 50 ? 'text-rose-500' : app.cci < 75 ? 'text-amber-500' : 'text-zinc-600'}`}>
                                            {app.cci}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function Server(props: any) {
    return <Database {...props} />
}
