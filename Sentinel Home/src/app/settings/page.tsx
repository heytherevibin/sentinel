'use client';

import React, { useState, useEffect, useMemo } from 'react';
import * as Phosphor from '@phosphor-icons/react';
import {
    UserFocus,
    ShieldCheckered,
    SignOut,
    IdentificationCard,
    Lightning,
    Circuitry,
    ArrowsClockwise,
    Database,
    Shield,
    Gear,
    ListDashes,
    Waveform,
    X,
    Pulse,
    Lock,
    Globe,
    CheckCircle,
    Warning,
    TrayArrowDown
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { TechCard } from '@/components/TechCard';
import { NeuralAlignmentGauge } from '@/components/NeuralAlignmentGauge';
import { ConfigSkeleton } from '@/components/Skeleton';

// Dynamic Icon Resolver
const getIcon = (name: string) => {
    return (Phosphor as any)[name] || Globe;
};

export default function SettingsPage() {
    const router = useRouter();
    const [logs, setLogs] = useState<any[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [connectors, setConnectors] = useState<any[]>([]);
    const [systemConfig, setSystemConfig] = useState<Record<string, string>>({});
    const [selectedConnector, setSelectedConnector] = useState<any>(null);
    const [syncingId, setSyncingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Live Stats Jitter
    const [liveThroughput, setLiveThroughput] = useState(24.8);
    const [liveLatency, setLiveLatency] = useState(24);

    useEffect(() => {
        setIsMounted(true);

        const fetchData = async () => {
            try {
                const [logRes, configRes, gatewayRes] = await Promise.all([
                    fetch('/api/system/logs'),
                    fetch('/api/system/config'),
                    fetch('/api/system/gateways')
                ]);

                const [logData, configData, gatewayData] = await Promise.all([
                    logRes.json(),
                    configRes.json(),
                    gatewayRes.json()
                ]);

                if (Array.isArray(logData)) setLogs(logData.slice(0, 50));
                if (configData) setSystemConfig(configData);
                if (Array.isArray(gatewayData)) setConnectors(gatewayData);
            } catch (e) {
                console.error('Data fetch failed', e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Jitter Animation for Modal
    useEffect(() => {
        if (!selectedConnector) return;
        const interval = setInterval(() => {
            setLiveThroughput(prev => parseFloat((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
            setLiveLatency(prev => Math.max(12, Math.min(60, prev + Math.floor(Math.random() * 3 - 1))));
        }, 2000);
        return () => clearInterval(interval);
    }, [selectedConnector]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const handleConfigToggle = async (key: string) => {
        const newValue = systemConfig[key] === 'true' ? 'false' : 'true';
        setSystemConfig(prev => ({ ...prev, [key]: newValue }));

        try {
            await fetch('/api/system/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value: newValue })
            });
        } catch (e) {
            console.error('Failed to save config');
        }
    };

    const handleSync = async (connectorId: string, name: string) => {
        setSyncingId(connectorId);

        try {
            // Trigger a real sync log
            await fetch('/api/system/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: `last_sync_${connectorId}`, value: new Date().toISOString() })
            });

            // Add a temporary local log for immediate feedback
            const newLog = {
                timestamp: new Date().toISOString(),
                type: 'INFO',
                component: 'GATEWAY_SYNC',
                message: `Synchronization success: ${name}. Policy set v4.2.1 deployed.`,
                id: Math.floor(Math.random() * 9999)
            };
            setLogs(prev => [newLog, ...prev]);
        } finally {
            setTimeout(() => setSyncingId(null), 2000);
        }
    };

    const handleLogsClick = (name: string) => {
        const newLog = {
            timestamp: new Date().toISOString(),
            type: 'DEBUG',
            component: 'SYS_UI',
            message: `Focused diagnostic stream on subsystem: ${name.split(' ')[0].toUpperCase()}_FLEET`,
            id: Math.floor(Math.random() * 9999)
        };
        setLogs(prev => [newLog, ...prev]);
    };

    if (!isMounted) return null;

    if (isLoading) {
        return (
            <div className="absolute inset-0 flex flex-col bg-transparent text-zinc-300 font-mono overflow-hidden">
                <div className="flex-1 p-6 relative z-10">
                    <ConfigSkeleton />
                </div>
                <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('/grid.svg')] bg-[length:30px_30px]" />
                <div className="scanline" />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 flex flex-col bg-transparent text-zinc-300 font-mono selection:bg-amber-950/30 overflow-hidden">
            {/* Command Grid - No full page scroll */}
            <div className="flex-1 grid grid-cols-12 gap-6 p-6 min-h-0 relative z-10">

                {/* Left Column: Contextual State (25%) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 min-h-0">
                    <TechCard title="OPERATOR_PROFILE" className="shrink-0 h-fit">
                        <div className="p-1 space-y-4">
                            <div className="relative p-4 bg-zinc-950/60 border border-zinc-900 rounded-sm overflow-hidden group">
                                <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <IdentificationCard size={48} weight="thin" />
                                </div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center relative shadow-inner">
                                        <UserFocus weight="duotone" className="text-zinc-500" size={24} />
                                        <div className="absolute -top-3 -right-3 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-black text-zinc-100 uppercase tracking-widest leading-none mb-1">Analyst_01</span>
                                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">Level 4 Clearance</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 bg-zinc-900/50 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 transition-all flex items-center justify-center gap-3 rounded-sm group"
                            >
                                <SignOut weight="bold" size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                Terminate Session
                            </button>
                        </div>
                    </TechCard>

                    <TechCard
                        title="NEURAL_ALIGNMENT"
                        status="warning"
                        className="shrink-0 h-fit"
                        icon={<ShieldCheckered weight="duotone" className="text-amber-500" size={14} />}
                        contentClassName="p-0 flex flex-col"
                    >
                        <NeuralAlignmentGauge score={94} status="active" />
                        <div className="bg-black/20 p-5 space-y-3 shadow-inner border-t border-zinc-900/50">
                            <ConfigToggle
                                label="Auto-Remediate Criticals"
                                active={systemConfig['auto_remediate'] === 'true'}
                                icon={<Lightning weight="duotone" size={14} />}
                                onClick={() => handleConfigToggle('auto_remediate')}
                            />
                            <ConfigToggle
                                label="Deep Packet Inspection"
                                active={systemConfig['dpi_enabled'] === 'true'}
                                icon={<Circuitry weight="duotone" size={14} />}
                                onClick={() => handleConfigToggle('dpi_enabled')}
                            />
                            <ConfigToggle
                                label="OIDC Session Sync"
                                active={systemConfig['oidc_sync'] === 'true'}
                                icon={<ArrowsClockwise weight="duotone" size={14} />}
                                onClick={() => handleConfigToggle('oidc_sync')}
                            />
                            <ConfigToggle
                                label="Neural Data Retention"
                                active={systemConfig['retention_enabled'] === 'true'}
                                icon={<Database weight="duotone" size={14} />}
                                onClick={() => handleConfigToggle('retention_enabled')}
                            />
                            <ConfigToggle
                                label="Cross-SaaS Isolation"
                                active={systemConfig['saas_isolation'] === 'true'}
                                icon={<Shield weight="duotone" size={14} />}
                                onClick={() => handleConfigToggle('saas_isolation')}
                            />
                        </div>
                    </TechCard>
                </div>

                {/* Right Column: Dynamic Infrastructure (75%) */}
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-4 min-h-0">

                    {/* Gateway Fleet - Shrink-0 for stability */}
                    <div className="flex flex-col gap-3 shrink-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {connectors.map((conn) => {
                                const ConnectorIcon = getIcon(conn.icon);
                                const isSyncing = syncingId === conn.id;
                                return (
                                    <div key={conn.id} className="bg-black border border-zinc-800 rounded-sm hover:border-zinc-700 group transition-all relative overflow-hidden flex flex-col shadow-lg">
                                        <div className="flex items-center gap-4 p-5 pb-4 flex-1">
                                            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded group-hover:bg-zinc-800 transition-colors shrink-0 shadow-lg">
                                                <ConnectorIcon weight="duotone" size={24} className={conn.color} />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[10px] font-black text-zinc-100 uppercase tracking-widest truncate mb-1">{conn.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${conn.status === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{conn.type}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex border-t border-zinc-900 divide-x divide-zinc-900 bg-black/40">
                                            <button
                                                onClick={() => setSelectedConnector(conn)}
                                                className="flex-1 py-2 flex items-center justify-center gap-2 text-[9px] font-black text-zinc-600 hover:text-zinc-300 transition-colors uppercase tracking-[0.1em]"
                                            >
                                                <Gear size={12} weight="bold" />
                                                Manage
                                            </button>
                                            <button
                                                onClick={() => handleLogsClick(conn.name)}
                                                className="flex-1 py-2 flex items-center justify-center gap-2 text-[9px] font-black text-zinc-600 hover:text-blue-500 transition-colors uppercase tracking-[0.1em]"
                                            >
                                                <ListDashes size={12} weight="bold" />
                                                Logs
                                            </button>
                                            <button
                                                onClick={() => handleSync(conn.id, conn.name)}
                                                className="px-4 py-2 flex items-center justify-center text-zinc-700 hover:text-emerald-500 transition-colors border-l border-zinc-900 min-w-[44px]"
                                            >
                                                <ArrowsClockwise size={12} weight="bold" className={isSyncing ? 'animate-spin text-emerald-500' : ''} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Diagnostics Pulse - Flex-1 to fill remaining space */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <TechCard
                            title="SYSTEM_DIAGNOSTICS // PULSE"
                            status="active"
                            className="flex-1 min-h-0"
                            contentClassName="p-0 bg-black flex flex-col h-full"
                            toolbar={
                                <div className="flex items-center gap-6">
                                    <button className="flex items-center gap-1.5"><TrayArrowDown size={14} className="text-zinc-600 hover:text-zinc-300 transition-colors" /></button>
                                    <button className="flex items-center gap-1.5"><ArrowsClockwise size={14} className="text-zinc-600 hover:text-blue-500 transition-colors" /></button>
                                </div>
                            }
                        >
                            <div className="flex-1 flex flex-col min-h-0 p-4">
                                {/* Inner Terminal Screen */}
                                <div className="flex-1 flex flex-col overflow-hidden rounded-sm border border-zinc-900/80 bg-black/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                                    {/* Terminal Header Metadata */}
                                    <div className="grid grid-cols-[100px_80px_140px_1fr_80px] gap-4 px-6 py-2 border-b border-zinc-900 bg-zinc-950/50 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                                        <span>Timestamp</span>
                                        <span>Level</span>
                                        <span>Subsystem</span>
                                        <span>Diagnostic Message</span>
                                        <span className="text-right">Trace_ID</span>
                                    </div>

                                    {/* Scrollable Logs Grid */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar font-mono">
                                        <div className="min-w-fit">
                                            {logs.length === 0 ? (
                                                <div className="p-6 text-[9px] text-zinc-700 animate-pulse uppercase tracking-widest">SCANNING_PROTOCOLS...</div>
                                            ) : logs.map((log, i) => (
                                                <div key={`${log.id}-${i}`} className="grid grid-cols-[100px_80px_140px_1fr_80px] gap-4 px-6 py-1.5 group/log items-center hover:bg-white/[0.02] border-b border-zinc-900/30 last:border-0 transition-colors animate-in slide-in-from-left-2 duration-300">
                                                    <span className="text-zinc-700 text-[10px] shrink-0 tabular-nums">
                                                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </span>
                                                    <span className={`text-[9px] font-black tracking-widest shrink-0 ${log.type === 'ERROR' ? 'text-rose-500/80' :
                                                        log.type === 'WARN' ? 'text-amber-500/80' :
                                                            log.type === 'DEBUG' ? 'text-zinc-600' : 'text-blue-500/80'
                                                        }`}>
                                                        {log.type}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[9px] font-black tracking-tighter text-zinc-500 truncate">
                                                        <Waveform size={10} className="text-zinc-800" />
                                                        {log.component || 'SYS_CORE'}
                                                    </span>
                                                    <span className="text-zinc-400 text-[10px] leading-relaxed group-hover/log:text-zinc-200 transition-colors truncate">
                                                        {log.message}
                                                    </span>
                                                    <span className="text-[9px] font-mono text-zinc-800 group-hover/log:text-zinc-700 text-right tabular-nums">
                                                        {log.id?.toString().padStart(4, '0') || '0000'}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="h-6" /> {/* End of buffer spacing */}
                                        </div>
                                    </div>
                                </div>

                                {/* Terminal Footer Status */}
                                <div className="mt-2 flex items-center justify-between px-2 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1"><div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Stream: Active</span>
                                        <span>Buffer: {logs.length}/500</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span>Encryption: AES-256</span>
                                        <span>Identity: Verified</span>
                                    </div>
                                </div>
                            </div>
                        </TechCard>
                    </div>
                </div>
            </div>

            {/* Management Modal */}
            {selectedConnector && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-sm shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-900/20">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded">
                                    {(() => {
                                        const ConnectorIcon = getIcon(selectedConnector.icon);
                                        return <ConnectorIcon size={20} className={selectedConnector.color} weight="duotone" />;
                                    })()}
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-[12px] font-black text-zinc-100 uppercase tracking-[0.2em]">{selectedConnector.name}</h2>
                                    <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Gateway Module Control // {selectedConnector.id}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedConnector(null)}
                                className="p-2 text-zinc-600 hover:text-zinc-300 transition-colors"
                            >
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 grid grid-cols-2 gap-8">
                            {/* Stats Side */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Pulse size={14} className="text-zinc-600" />
                                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Throughput</span>
                                        </div>
                                        <div className="text-[16px] font-black text-zinc-200 tabular-nums">{liveThroughput} GB<span className="text-[10px] text-zinc-600 ml-1">/HR</span></div>
                                    </div>
                                    <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Lock size={14} className="text-zinc-600" />
                                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">TLS Proxy</span>
                                        </div>
                                        <div className="text-[16px] font-black text-emerald-500 uppercase">Active</div>
                                    </div>
                                </div>

                                <div className="p-4 bg-black border border-zinc-900 rounded-sm space-y-3">
                                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-900 pb-2">Network Metadata</div>
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-zinc-600 uppercase">Provider IP</span>
                                        <span className="text-zinc-400 tabular-nums">{selectedConnector.ipAddress || '104.28.16.22'}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-zinc-600 uppercase">Region</span>
                                        <span className="text-zinc-400 uppercase">{selectedConnector.region || 'US-EAST-1'}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-zinc-600 uppercase">Latency</span>
                                        <span className="text-zinc-400 tabular-nums">{liveLatency}ms</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-sm">
                                    <Warning size={20} className="text-amber-500/60" weight="duotone" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-amber-500/80 uppercase">Warning</span>
                                        <span className="text-[9px] text-zinc-500 tracking-tight">SSL Decryption key rotation is pending. Scheduled for 04:00 UTC.</span>
                                    </div>
                                </div>
                            </div>

                            {/* Controls Side */}
                            <div className="space-y-4">
                                <ModalToggle
                                    label="SSL Deep Inspection"
                                    active={systemConfig[`ssl_inspect_${selectedConnector.id}`] === 'true'}
                                    onClick={() => handleConfigToggle(`ssl_inspect_${selectedConnector.id}`)}
                                />
                                <ModalToggle
                                    label="CASB Inline Control"
                                    active={systemConfig[`casb_inline_${selectedConnector.id}`] === 'true'}
                                    onClick={() => handleConfigToggle(`casb_inline_${selectedConnector.id}`)}
                                />
                                <ModalToggle
                                    label="DLP Pattern Matching"
                                    active={systemConfig[`dlp_pattern_${selectedConnector.id}`] === 'true'}
                                    onClick={() => handleConfigToggle(`dlp_pattern_${selectedConnector.id}`)}
                                />
                                <ModalToggle
                                    label="Threat Intelligence"
                                    active={systemConfig[`threat_intel_${selectedConnector.id}`] === 'true'}
                                    onClick={() => handleConfigToggle(`threat_intel_${selectedConnector.id}`)}
                                />
                                <ModalToggle
                                    label="OIDC Session Tracking"
                                    active={systemConfig[`oidc_track_${selectedConnector.id}`] === 'true'}
                                    onClick={() => handleConfigToggle(`oidc_track_${selectedConnector.id}`)}
                                />

                                <div className="pt-4 space-y-2">
                                    <button className="w-full py-3 bg-zinc-900 border border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:bg-zinc-800 transition-all rounded-sm">
                                        Download Root Certificate
                                    </button>
                                    <button
                                        onClick={() => handleSync(selectedConnector.id, selectedConnector.name)}
                                        className="w-full py-3 bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/20 transition-all rounded-sm"
                                    >
                                        Immediate Token Rotation
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-900 flex justify-between items-center text-[9px]">
                            <div className="flex items-center gap-2 text-zinc-600">
                                <CheckCircle size={14} className="text-emerald-500" />
                                <span className="uppercase tracking-widest">Configuration Synchronized</span>
                            </div>
                            <button
                                onClick={() => setSelectedConnector(null)}
                                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors font-black uppercase tracking-widest"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('/grid.svg')] bg-[length:30px_30px]" />
        </div>
    );
}

/* Internal Components */

const ConfigToggle = ({ label, active, icon, onClick }: { label: string, active: boolean, icon?: React.ReactNode, onClick: () => void }) => (
    <div
        onClick={onClick}
        className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-sm flex items-center justify-between group/toggle hover:border-zinc-700 transition-all cursor-pointer shadow-inner"
    >
        <div className="flex items-center gap-3">
            <span className="text-zinc-600 group-hover/toggle:text-amber-500/50 transition-colors">{icon}</span>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover/toggle:text-zinc-300">{label}</span>
        </div>
        <div className={`w-8 h-4 rounded-full relative transition-all border ${active ? 'bg-amber-500/20 border-amber-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
            <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${active ? 'right-0.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'left-0.5 bg-zinc-700'}`} />
        </div>
    </div>
);

const ModalToggle = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <div
        onClick={onClick}
        className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-sm flex items-center justify-between group/toggle hover:border-zinc-800 transition-colors cursor-pointer shadow-inner"
    >
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover/toggle:text-zinc-300">{label}</span>
        <div className={`w-8 h-4 rounded-full relative transition-all border ${active ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
            <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${active ? 'right-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'left-0.5 bg-zinc-700'}`} />
        </div>
    </div>
);
