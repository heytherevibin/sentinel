'use client';

import React, { useState, useMemo, Suspense, useEffect, useRef, useCallback } from 'react';
import {
    Shield, Globe, User, FileText, MagnifyingGlass, Funnel,
    CaretRight, Circle, ArrowSquareOut, FirstAid, Warning,
    Key, SelectionAll, Lightning, FileCode, TrendDown, TrendUp,
    Hash, BracketsCurly, Database, LockKey, WifiHigh, X,
    MapPin, ShareNetwork, Clock, Buildings, Bug, Cloud,
    FilePdf, FileImage, FileDoc, FileXls, FileCloud, Check,
    Lock, LockOpen, Users, UserPlus, Eye, Prohibit, Trash,
    ChartPie, ShieldCheck, ShieldWarning, SlackLogo, GoogleLogo,
    ListBullets, SquaresFour, Copy, MagnifyingGlassPlus, Code,
    SidebarSimple, Table, ChartBar, Rows, CaretUp, CaretDown, CaretLeft, Play, Pause,
    TerminalWindow, GitBranch, ArrowRight, DotsSixVertical,
    Columns, FunnelSimple, Plus, Minus, List, DownloadSimple
} from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';

// --- TYPES & MOCK DATA GENERATORS ---

type ExposureLevel = 'PUBLIC' | 'EXTERNAL' | 'INTERNAL' | 'PRIVATE';
type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface CloudFile {
    id: string;
    name: string;
    type: 'PDF' | 'DOC' | 'XLS' | 'IMG' | 'CODE';
    size: string;
    owner: string;
    app: 'Google Drive' | 'Slack' | 'SharePoint' | 'Box';
    exposure: ExposureLevel;
    risk: RiskLevel;
    hash: string; // SHA-256
    dlpTriggers: string[];
    malware?: { name: string; hash: string };
    lastModified: string; // ISO String for sorting
    timestamp: number; // Unix for faster mapping
    collaborators: number;
    rawMessage: string; // For "Message Inspector"
    sourceIp: string;
    destIp: string;
    protocol: string;
    tenant: string;
}

// Column Configuration Type
type ColumnId = 'timestamp' | 'tenant' | 'name' | 'hash' | 'app' | 'owner' | 'exposure' | 'risk' | 'actions';
interface ColumnConfig {
    id: ColumnId;
    label: string;
    width: number;
    minWidth: number;
    visible: boolean;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
    { id: 'timestamp', label: 'Timestamp', width: 90, minWidth: 80, visible: true },
    { id: 'tenant', label: 'Tenant', width: 100, minWidth: 80, visible: true },
    { id: 'name', label: 'Asset Name', width: 180, minWidth: 120, visible: true },
    { id: 'hash', label: 'Message / Hash', width: 250, minWidth: 100, visible: true },
    { id: 'app', label: 'App', width: 90, minWidth: 70, visible: true },
    { id: 'owner', label: 'Owner', width: 120, minWidth: 80, visible: true },
    { id: 'exposure', label: 'Exposure', width: 90, minWidth: 70, visible: true },
    { id: 'risk', label: 'Risk', width: 90, minWidth: 70, visible: true },
    { id: 'actions', label: 'Actions', width: 80, minWidth: 60, visible: true },
];

// --- ADVANCED QUERY PARSER TYPES ---
type FilterOperator = '=' | '!=' | 'matches' | 'contains';

interface FilterCondition {
    key: string;
    operator: FilterOperator;
    value: string;
}

// --- PIPELINE TYPES ---
type PipelineStage =
    | { type: 'SEARCH', filters: FilterCondition[], textSearch: string[] }
    | { type: 'WHERE', expression: string }
    | { type: 'PARSE', method: 'regex' | 'anchor', pattern: string, as: string }
    | { type: 'TIMESLICE', interval: string }
    | { type: 'AGGREGATE', function: 'count' | 'sum' | 'avg' | 'min' | 'max', field?: string, by?: string }
    | { type: 'SORT', field: string, order: 'asc' | 'desc' }
    | { type: 'LIMIT', count: number }
    | { type: 'FIELDS', fields: string[] };

interface FilterCondition {
    key: string;
    operator: '=' | '!=' | 'matches' | 'contains';
    value: string;
}


// Helper to generate a random log
const generateLog = (idOverride?: string, timeOffset = 0): CloudFile => {
    const apps = ['Google Drive', 'Slack', 'SharePoint', 'Box'] as const;
    const risks = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
    const exposures = ['PUBLIC', 'EXTERNAL', 'INTERNAL', 'PRIVATE'] as const;
    const owners = ['sarah.k', 'hr_admin', 'dev_lead', 'unknown_usr', 'design', 'jason.dev', 'security_bot'];
    const extensions = ['PDF', 'DOC', 'XLS', 'IMG', 'CODE'] as const;
    const filenames = ['Q4_Financials', 'Employee_List', 'Project_Titan', 'Malware_Installer', 'Marketing_Assets', 'AWS_Keys', 'Secret_Project', 'Invoice_2024'];
    const protocols = ['HTTPS', 'SSH', 'FTP', 'SMB'];
    const tenants = ['Acme Corp', 'Globex Inc', 'Soylent Corp', 'Initech', 'Umbrella Corp'];

    const app = apps[Math.floor(Math.random() * apps.length)];
    const risk = risks[Math.floor(Math.random() * risks.length)];
    const exposure = exposures[Math.floor(Math.random() * exposures.length)];
    const type = extensions[Math.floor(Math.random() * extensions.length)];
    const owner = owners[Math.floor(Math.random() * owners.length)] + '@acme.corp';
    const tenant = tenants[Math.floor(Math.random() * tenants.length)];
    const name = `${filenames[Math.floor(Math.random() * filenames.length)]}_${Math.floor(Math.random() * 1000)}.${type.toLowerCase()}`;
    const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];

    const randomIp = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    const date = new Date(Date.now() - timeOffset);

    return {
        id: idOverride || `evt-${Math.random().toString(36).substr(2, 9)}`,
        name,
        type,
        size: `${(Math.random() * 10).toFixed(1)} MB`,
        owner,
        app,
        exposure,
        risk,
        hash,
        dlpTriggers: risk === 'CRITICAL' ? ['Credit Card', 'SSN'] : [],
        malware: risk === 'CRITICAL' && Math.random() > 0.5 ? { name: 'Trojan.Win32', hash } : undefined,
        lastModified: date.toISOString(),
        timestamp: date.getTime(),
        collaborators: Math.floor(Math.random() * 20),
        rawMessage: `timestamp=${date.toISOString()} src=${app} user=${owner} file=${name} action=UPLOAD risk=${risk} hash=${hash} tenant="${tenant}"`,
        sourceIp: randomIp(),
        destIp: randomIp(),
        protocol,
        tenant
    };
};

// Initial Dataset (Spread over last 15 mins)
const INITIAL_LOGS = Array.from({ length: 200 }).map((_, i) => generateLog(`init-${i}`, Math.random() * 15 * 60 * 1000)).sort((a, b) => b.timestamp - a.timestamp);


// --- COMPONENTS ---

export default function IntrospectionPage() {
    return (
        <Suspense fallback={<div className="h-full bg-black" />}>
            <DataProtectionHub />
        </Suspense>
    );
}

function DataProtectionHub() {
    // --- STATE ---
    const [isMounted, setIsMounted] = useState(false);
    const [logs, setLogs] = useState<CloudFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<CloudFile | null>(null);
    const [viewMode, setViewMode] = useState<'MESSAGES' | 'AGGREGATES'>('MESSAGES');
    const [showFieldBrowser, setShowFieldBrowser] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pipeline, setPipeline] = useState<PipelineStage[]>([]);

    // Stats
    const [eps, setEps] = useState(0);
    const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
    const [resizingColId, setResizingColId] = useState<ColumnId | null>(null);
    const startXRef = useRef<number>(0);
    const startWidthRef = useRef<number>(0);

    // Column Menu State
    const [showColMenu, setShowColMenu] = useState(false);

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean, field: string, value: string } | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [isAutoPageSize, setIsAutoPageSize] = useState(true);
    const gridRef = useRef<HTMLDivElement>(null);

    const [selectedBucketIndex, setSelectedBucketIndex] = useState<number | null>(null);
    const [clientTime, setClientTime] = useState<number | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setLogs(INITIAL_LOGS);
        setClientTime(Date.now());
        const interval = setInterval(() => setClientTime(Date.now()), 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    // --- LIVE TAIL ENGINE (REAL EPS) ---
    useEffect(() => {
        let interval: NodeJS.Timeout;
        let epsInterval: NodeJS.Timeout;
        let logsAdded = 0;

        if (isLive) {
            interval = setInterval(() => {
                const count = Math.floor(Math.random() * 3) + 1;
                const newLogs = Array.from({ length: count }).map(() => generateLog());
                setLogs(prev => [...newLogs, ...prev].slice(0, 1000));
                logsAdded += count;
            }, 500);

            epsInterval = setInterval(() => {
                setEps(logsAdded);
                logsAdded = 0;
            }, 1000);
        } else {
            setEps(0);
        }

        return () => {
            clearInterval(interval);
            clearInterval(epsInterval);
        };
    }, [isLive]);

    // --- DYNAMIC PAGE SIZE CALCULATION ---
    useEffect(() => {
        if (!isAutoPageSize || !gridRef.current) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;

            const height = entry.contentRect.height;
            // Header is ~32px, footer is ~40px. Grid padding is ~8px.
            // Row height is ~32px.
            const availableHeight = height - 72;
            const newPageSize = Math.max(1, Math.floor(availableHeight / 32));
            setPageSize(newPageSize);
        });

        observer.observe(gridRef.current);
        return () => observer.disconnect();
    }, [isAutoPageSize]);

    // --- ADVANCED QUERY PARSER (PIPELINE) ---
    useEffect(() => {
        if (!searchQuery.trim()) {
            setPipeline([]);
            if (viewMode === 'AGGREGATES') setViewMode('MESSAGES');
            return;
        }

        const segments = searchQuery.split('|').map(s => s.trim());
        const newPipeline: PipelineStage[] = [];

        const resolveField = (f: string) => {
            const map: Record<string, string> = {
                'source_app': 'app', 'src_app': 'app', 'application': 'app',
                'user': 'owner', 'src_user': 'owner', 'usr': 'owner',
                'file': 'name', 'filename': 'name', 'asset': 'name',
                'src_ip': 'sourceIp', 'dest_ip': 'destIp',
            };
            return map[f.toLowerCase()] || f;
        };

        segments.forEach((segment, index) => {
            if (index === 0) {
                const filters: FilterCondition[] = [];
                const textSearch: string[] = [];
                const filterRegex = /([a-zA-Z0-9_.-]+)\s*(=|!=|matches|contains)\s*(".*?"|'.*?'|[^\s]+)/g;
                let match;
                const foundFilters = new Set<string>();

                while ((match = filterRegex.exec(segment)) !== null) {
                    const [fullMatch, key, operator, value] = match;
                    const cleanValue = value.replace(/^['"]|['"]$/g, '');
                    filters.push({ key: resolveField(key), operator: operator as any, value: cleanValue });
                    foundFilters.add(fullMatch.trim());
                }

                let remainingText = segment;
                foundFilters.forEach(f => {
                    const escaped = f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    remainingText = remainingText.replace(new RegExp(escaped, 'g'), '');
                });

                const terms = remainingText.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
                terms.forEach(t => {
                    const clean = t.replace(/^['"]|['"]$/g, '').trim();
                    if (clean) textSearch.push(clean);
                });

                newPipeline.push({ type: 'SEARCH', filters, textSearch });
            } else {
                const s = segment.toLowerCase();
                if (s.startsWith('where')) {
                    newPipeline.push({ type: 'WHERE', expression: segment.slice(5).trim() });
                } else if (s.startsWith('parse')) {
                    const parseMatch = segment.match(/parse\s+(regex\s+)?(".*?"|'.*?')\s+as\s+([a-zA-Z0-9_]+)/i);
                    if (parseMatch) {
                        const isRegex = !!parseMatch[1];
                        const pattern = parseMatch[2].replace(/^['"]|['"]$/g, '');
                        const asField = parseMatch[3];
                        newPipeline.push({ type: 'PARSE', method: isRegex ? 'regex' : 'anchor', pattern, as: asField });
                    }
                } else if (s.startsWith('count') || s.startsWith('sum') || s.startsWith('avg') || s.startsWith('min') || s.startsWith('max')) {
                    const parts = segment.split(/ by /i);
                    const func = parts[0].trim().split(' ')[0] as any;
                    const rawBy = parts[1]?.trim() || 'risk';
                    newPipeline.push({ type: 'AGGREGATE', function: func, by: resolveField(rawBy) });
                } else if (s.startsWith('top')) {
                    const parts = segment.slice(4).trim().split(' ');
                    const count = parseInt(parts[0]) || 10;
                    const field = resolveField(parts[1] || 'risk');
                    newPipeline.push({ type: 'AGGREGATE', function: 'count', by: field });
                    newPipeline.push({ type: 'SORT', field: 'count', order: 'desc' });
                    newPipeline.push({ type: 'LIMIT', count });
                } else if (s.startsWith('timeslice')) {
                    const interval = segment.slice(9).trim() || '1m';
                    newPipeline.push({ type: 'TIMESLICE', interval });
                } else if (s.startsWith('sort by')) {
                    const parts = segment.slice(7).trim().split(' ');
                    newPipeline.push({ type: 'SORT', field: resolveField(parts[0]), order: (parts[1] as any) || 'asc' });
                } else if (s.startsWith('limit')) {
                    newPipeline.push({ type: 'LIMIT', count: parseInt(segment.slice(5).trim()) || 100 });
                } else if (s.startsWith('fields')) {
                    newPipeline.push({ type: 'FIELDS', fields: segment.slice(6).trim().split(',').map(f => resolveField(f.trim())) });
                }
            }
        });

        const hasAgg = newPipeline.some(p => p.type === 'AGGREGATE');
        setViewMode(hasAgg ? 'AGGREGATES' : 'MESSAGES');
        setPipeline(newPipeline);
    }, [searchQuery]);


    // --- FILTER & PIPELINE ENGINE ---
    const processPipeline = useCallback((sourceLogs: CloudFile[], pipeline: PipelineStage[], applyTimeFilter: boolean = true) => {
        // Calculate Timeline Range
        const now = clientTime || Date.now();
        const start = now - (15 * 60 * 1000); // 15 mins ago
        const bucketSize = (now - start) / 60;

        let currentLogs = [...sourceLogs];

        // 0. Time Slice Filter (Implicit)
        if (applyTimeFilter && selectedBucketIndex !== null) {
            const bucketStart = start + (selectedBucketIndex * bucketSize);
            const bucketEnd = bucketStart + bucketSize;
            currentLogs = currentLogs.filter(log => log.timestamp >= bucketStart && log.timestamp <= bucketEnd);
        }

        // EXECUTE PIPELINE STAGES
        for (const stage of pipeline) {
            switch (stage.type) {
                case 'SEARCH':
                    currentLogs = currentLogs.filter(log => {
                        // Structured Filters
                        for (const filter of stage.filters) {
                            // @ts-ignore
                            const logVal = String(log[filter.key] || '').toLowerCase();
                            const filterVal = filter.value.toLowerCase();
                            const isWildcard = filter.value.includes('*');

                            if (filter.operator === '=') {
                                if (isWildcard) {
                                    // Convert glob to regex: a*b -> ^a.*b$
                                    const pattern = '^' + filter.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*') + '$';
                                    if (!new RegExp(pattern, 'i').test(logVal)) return false;
                                } else {
                                    if (logVal !== filterVal) return false;
                                }
                            }
                            else if (filter.operator === '!=') {
                                if (isWildcard) {
                                    const pattern = '^' + filter.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*') + '$';
                                    if (new RegExp(pattern, 'i').test(logVal)) return false;
                                } else {
                                    if (logVal === filterVal) return false;
                                }
                            }
                            else if (filter.operator === 'contains') { if (!logVal.includes(filterVal)) return false; }
                            else if (filter.operator === 'matches') {
                                try {
                                    const regex = new RegExp(filter.value, 'i');
                                    // @ts-ignore
                                    if (!regex.test(String(log[filter.key] || ''))) return false;
                                } catch (e) { return false; }
                            }
                        }
                        // Text Search (Implicit wildcard support if user types glob?)
                        // For now we assume strict substring unless we want to do regex there too.
                        // Let's keep text search simple: contains
                        for (const term of stage.textSearch) {
                            const searchStr = term.toLowerCase();
                            // Naive stringify of entire object for search
                            const blob = JSON.stringify(log).toLowerCase();
                            if (!blob.includes(searchStr)) return false;
                        }
                        return true;
                    });
                    break;

                case 'WHERE':
                    // Transpile 'where' expression to JS
                    try {
                        // Safe(ish) eval by replacing operators with JS equivalents
                        // risk="Critical" -> log.risk=="Critical"
                        // Replace 'matches' with .match(), 'contains' with .includes() - simplified for now
                        // Just supporting simple logic for Alpha
                        const predicate = (log: any) => {
                            // This is a placeholder for a real expression parser. 
                            // For this demo, we'll try to support basic boolean logic by checking if the log satisfies the condition textually
                            // In a real app, use jexl or similar.
                            return true;
                        };
                        // TODO: Implement robust WHERE parser. 
                        // For now, if "where" is present, we filter nothing to prevent crash, as we need a parser library.
                        // But we can support simple WHERE risk="Critical" manually
                        if (stage.expression.includes('=')) {
                            const parts = stage.expression.split('=');
                            const key = parts[0].trim();
                            const val = parts[1].replace(/['"]/g, '').trim();
                            currentLogs = currentLogs.filter(l => (l as any)[key] == val);
                        }
                    } catch (e) {
                        console.error("Invalid where clause", e);
                    }
                    break;

                case 'PARSE':
                    if (stage.method === 'regex') {
                        try {
                            const regex = new RegExp(stage.pattern);
                            currentLogs = currentLogs.map(log => {
                                const match = (log.rawMessage || '').match(regex);
                                if (match && match[1]) {
                                    return { ...log, [stage.as]: match[1] };
                                }
                                return log;
                            });
                        } catch (e) { /* ignore invalid regex */ }
                    } else if (stage.method === 'anchor') {
                        // Anchor Parse: "user=* " -> Escape everything except *, replace * with (.*?)
                        try {
                            // 1. Escape special chars: . becomes \.
                            // 2. Replace * with (.*?)
                            // Note: We need to be careful not to escape the * we want to be a wildcard
                            const escaped = stage.pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&'); // Don't escape * yet
                            const regexStr = escaped.replace(/\*/g, '(.*?)');
                            const regex = new RegExp(regexStr);

                            currentLogs = currentLogs.map(log => {
                                const match = (log.rawMessage || '').match(regex);
                                if (match && match[1]) {
                                    return { ...log, [stage.as]: match[1] };
                                }
                                return log;
                            });
                        } catch (e) { /* ignore */ }
                    }
                    break;

                case 'TIMESLICE':
                    // Group logs by time buckets
                    try {
                        const intervalMs = parseInterval(stage.interval);
                        const grouped = new Map<number, CloudFile[]>();

                        currentLogs.forEach(log => {
                            const bucket = Math.floor(log.timestamp / intervalMs) * intervalMs;
                            if (!grouped.has(bucket)) grouped.set(bucket, []);
                            grouped.get(bucket)!.push(log);
                        });

                        // Create aggregated records per bucket
                        currentLogs = Array.from(grouped.entries()).map(([bucket, logs]) => ({
                            ...logs[0],
                            timestamp: bucket,
                            _timeslice: new Date(bucket).toISOString(),
                            _count: logs.length,
                        } as any));
                    } catch (e) { /* ignore */ }
                    break;

                case 'SORT':
                    currentLogs.sort((a, b) => {
                        // @ts-ignore
                        const valA = a[stage.field];
                        // @ts-ignore
                        const valB = b[stage.field];
                        if (valA < valB) return stage.order === 'asc' ? -1 : 1;
                        if (valA > valB) return stage.order === 'asc' ? 1 : -1;
                        return 0;
                    });
                    break;

                case 'LIMIT':
                    currentLogs = currentLogs.slice(0, stage.count);
                    break;
                case 'FIELDS':
                    // If fields specified, we "project" them
                    // Since we preserve full objects for UI, we might just filter visibility if we had a dynamic UI
                    // For now, let's strictly return objects with only those keys to behave like an API
                    currentLogs = currentLogs.map(log => {
                        const newLog: any = { id: log.id }; // Always keep ID
                        stage.fields.forEach(f => {
                            // @ts-ignore
                            if (log[f] !== undefined) newLog[f] = log[f];
                        });
                        return newLog as CloudFile;
                    });
                    break;
            }
        }

        return currentLogs;

    }, [clientTime, selectedBucketIndex]);

    // Helper to parse time intervals
    const parseInterval = (interval: string): number => {
        const match = interval.match(/^(\d+)([smhd])$/);
        if (!match) return 60000; // default 1m
        const [_, num, unit] = match;
        const multipliers: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
        return parseInt(num) * (multipliers[unit] || 60000);
    };


    const filteredLogs = useMemo(() => {
        return processPipeline(logs, pipeline, true);
    }, [logs, pipeline, processPipeline]);


    // --- TIMELINE HISTOGRAM ENGINE (REAL DATA) ---
    // 1. Query Filtered Only (Ignore Time Slice for Histogram Base)
    const queryFilteredLogs = useMemo(() => {
        return processPipeline(logs, pipeline, false);
    }, [logs, pipeline, processPipeline]);

    // 2. Histogram Data
    const timelineBuckets = useMemo(() => {
        if (queryFilteredLogs.length === 0) return Array(60).fill(0);

        const now = Date.now();
        const start = now - (15 * 60 * 1000);
        const end = now;
        const bucketSize = (end - start) / 60;

        const buckets = new Array(60).fill(0);

        queryFilteredLogs.forEach(log => {
            if (log.timestamp >= start && log.timestamp <= end) {
                const bucketIndex = Math.floor((log.timestamp - start) / bucketSize);
                if (bucketIndex >= 0 && bucketIndex < 60) {
                    buckets[bucketIndex]++;
                }
            }
        });

        return buckets;
    }, [queryFilteredLogs]);


    // --- AGGREGATION ENGINE ---
    const aggregatedData = useMemo(() => {
        const aggrStage = pipeline.find(s => s.type === 'AGGREGATE') as { type: 'AGGREGATE', function: string, field?: string, by?: string } | undefined;
        // Default to risk if not specified, only if in AGGREGATES mode for some reason
        const field = aggrStage?.by || 'risk';

        const counts: Record<string, number> = {};

        // We use queryFilteredLogs for aggregation base to ensure it matches the histogram logic (no time slice double apply if we wanted that)
        // actually standard behavior is to aggregate on what's visible in table usually.
        // Let's use filteredLogs (which includes time slice)
        filteredLogs.forEach(log => {
            // @ts-ignore
            const val = String(log[field] || 'Unknown');
            counts[val] = (counts[val] || 0) + 1;
        });

        return Object.entries(counts)
            .map(([value, count]) => ({ value, count, pct: (count / filteredLogs.length) * 100 }))
            .sort((a, b) => b.count - a.count);
    }, [filteredLogs, pipeline]);


    // --- FIELD BROWSER ENGINE ---
    const fieldCounts = useMemo(() => {
        const counts: Record<string, Record<string, number>> = {
            risk: {}, exposure: {}, app: {}, owner: {}, sourceIp: {}, destIp: {}, protocol: {}, tenant: {}
        };
        filteredLogs.forEach(log => {
            counts.risk[log.risk] = (counts.risk[log.risk] || 0) + 1;
            counts.exposure[log.exposure] = (counts.exposure[log.exposure] || 0) + 1;
            counts.app[log.app] = (counts.app[log.app] || 0) + 1;
            counts.owner[log.owner] = (counts.owner[log.owner] || 0) + 1;
            counts.sourceIp[log.sourceIp] = (counts.sourceIp[log.sourceIp] || 0) + 1;
            counts.destIp[log.destIp] = (counts.destIp[log.destIp] || 0) + 1;
            counts.protocol[log.protocol] = (counts.protocol[log.protocol] || 0) + 1;
            counts.tenant[log.tenant] = (counts.tenant[log.tenant] || 0) + 1;
        });
        return counts;
    }, [filteredLogs]);

    // ACTIONS
    const addFilter = (key: string, value: string) => {
        // We append to the FIRST segment (search segment)
        const parts = searchQuery.split('|');
        let searchPart = parts[0] || '';

        const safeValue = value.includes(' ') ? `"${value}"` : value;
        const newTerm = `${key}=${safeValue}`;

        if (!searchPart.includes(key + '=')) {
            searchPart = searchPart.trim() ? `${searchPart.trim()} ${newTerm}` : newTerm;
            parts[0] = searchPart;
            setSearchQuery(parts.join(' | '));
        }
        setViewMode('MESSAGES');
    };

    const excludeFilter = (key: string, value: string) => {
        const parts = searchQuery.split('|');
        let searchPart = parts[0] || '';

        const safeValue = value.includes(' ') ? `"${value}"` : value;
        const newTerm = `${key}!=${safeValue}`; // Use != operator

        if (!searchPart.includes(key + '!=')) {
            searchPart = searchPart.trim() ? `${searchPart.trim()} ${newTerm}` : newTerm;
            parts[0] = searchPart;
            setSearchQuery(parts.join(' | '));
        }
    };

    const toggleColumn = (id: ColumnId) => {
        setColumns(prev => prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
    };

    // --- SORT ENGINE ---
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        setSortConfig(current => {
            if (current?.key === key) {
                if (current.direction === 'asc') return { key, direction: 'desc' };
                return null; // Toggle off
            }
            return { key, direction: 'asc' };
        });
    };

    const sortedLogs = useMemo(() => {
        if (!sortConfig) return filteredLogs;

        return [...filteredLogs].sort((a, b) => {
            // @ts-ignore
            const aVal = a[sortConfig.key];
            // @ts-ignore
            const bVal = b[sortConfig.key];

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredLogs, sortConfig]);

    // Paginated Logs
    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedLogs.slice(startIndex, endIndex);
    }, [sortedLogs, currentPage, pageSize]);

    const totalPages = Math.ceil(sortedLogs.length / pageSize);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortConfig]);


    // --- COLUMNS RESIZE ENGINE (FIXED) ---
    const resizingColIdRef = useRef<string | null>(null); // Use Ref to avoid stale closure in event listeners

    const handleResizeStart = (e: React.MouseEvent, colId: ColumnId) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent sort trigger

        const col = columns.find(c => c.id === colId);
        if (col) {
            resizingColIdRef.current = colId; // Set Ref
            startXRef.current = e.pageX;
            startWidthRef.current = col.width;

            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', handleResizeEnd);
        }
    };

    const handleResizeMove = useCallback((e: MouseEvent) => {
        if (resizingColIdRef.current) {
            const diff = e.pageX - startXRef.current;
            setColumns(prev => prev.map(col => {
                if (col.id === resizingColIdRef.current) {
                    return { ...col, width: Math.max(col.minWidth, startWidthRef.current + diff) };
                }
                return col;
            }));
        }
    }, []);

    const handleResizeEnd = useCallback(() => {
        resizingColIdRef.current = null;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
    }, [handleResizeMove]);

    const handleRun = () => {
        if (!searchQuery.trim()) return;
        setIsRunning(true);
        // Simulate a small delay for "Running..." feedback
        setTimeout(() => {
            setIsRunning(false);
        }, 600);
    };

    const isFocusMode = !!selectedFile;

    // Context Menu Handler
    const handleContextMenu = (e: React.MouseEvent, field: string, value: string) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, visible: true, field, value });
    };

    // Close context menu on click elsewhere
    useEffect(() => {
        const closeMenu = () => setContextMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    // --- HYDRATION GUARD ---
    if (!isMounted) return <div className="h-full bg-black flex items-center justify-center font-mono text-[9px] text-zinc-800 uppercase tracking-widest animate-pulse">Initializing Neural Array...</div>;

    return (
        <main className="h-full bg-black text-zinc-300 flex flex-col font-mono overflow-hidden relative selection:bg-emerald-500/20">

            {/* ZONE 1: COMMAND HEADER */}
            <header className="h-auto md:h-12 bg-[#050505] border-b border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 z-30 px-4 py-2 md:py-0 gap-2 md:gap-0">
                <div className="flex items-center gap-3 md:gap-4 h-full w-full md:w-auto">
                    <button
                        onClick={() => setShowFieldBrowser(!showFieldBrowser)}
                        className={`p-1.5 rounded-[2px] transition-colors ${showFieldBrowser ? 'text-zinc-100 bg-zinc-900' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
                        title="Toggle Field Browser"
                    >
                        <SidebarSimple size={16} weight="duotone" />
                    </button>

                    <div className="w-[1px] h-4 bg-zinc-800" />

                    <div className="flex bg-zinc-900/50 rounded-[2px] p-0.5 border border-zinc-800/50">
                        <button
                            onClick={() => setViewMode('MESSAGES')}
                            className={`px-3 py-1 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider rounded-[1px] transition-all ${viewMode === 'MESSAGES' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                        >
                            <ListBullets size={12} weight={viewMode === 'MESSAGES' ? 'fill' : 'regular'} /> Messages
                        </button>
                        <button
                            onClick={() => setViewMode('AGGREGATES')}
                            className={`px-3 py-1 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider rounded-[1px] transition-all ${viewMode === 'AGGREGATES' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                        >
                            <ChartBar size={12} weight={viewMode === 'AGGREGATES' ? 'fill' : 'regular'} /> Aggregates
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-[2px] border text-[9px] font-black uppercase tracking-wider transition-all ${isLive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-transparent border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'}`}
                    >
                        {isLive ? <Pause size={10} weight="fill" /> : <Play size={10} weight="fill" />}
                        {isLive ? 'Live' : 'Paused'}
                    </button>

                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/30 rounded-[2px] border border-zinc-800/50">
                        <span className="text-[9px] text-zinc-600 font-bold tracking-wider">EPS</span>
                        <span className={`text-[9px] font-mono transition-colors ${eps > 10 ? 'text-emerald-400' : 'text-zinc-300'}`}>{eps}</span>
                    </div>
                </div>
            </header>

            {/* ADVANCED SEARCH BAR */}
            <div className="h-auto md:h-14 border-b border-zinc-800 flex items-center bg-[#0a0a0a] shrink-0 z-40 px-2 py-2 md:py-0">
                <div className="w-full h-auto md:h-10 bg-black border border-zinc-800 rounded-[2px] flex flex-col md:flex-row items-stretch md:items-center px-1 relative group gap-2 md:gap-0 py-1 md:py-0">
                    <div className="px-3 flex items-center justify-center border-r border-zinc-800/50 h-6">
                        <span className="text-emerald-500 font-bold text-xs select-none">{'>'}</span>
                    </div>


                    {/* Actual Input */}
                    <input
                        className="bg-transparent border-none px-3 py-1.5 text-[11px] w-full focus:outline-none text-emerald-400 caret-emerald-500 font-mono tracking-wide placeholder:text-zinc-700 relative z-10"
                        placeholder="risk='CRITICAL' | where exposure='PUBLIC' | count by owner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRun();
                        }}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                    />

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="p-1.5 text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900 rounded transition-colors"
                                title="Clear query"
                            >
                                <X size={12} />
                            </button>
                        )}

                        {/* Query Builder Helper */}
                        <div className="relative group/helper">
                            <button
                                className="p-3 -m-1.5 text-zinc-600 hover:text-emerald-500 hover:bg-zinc-900 active:bg-zinc-800 rounded transition-colors"
                                title="Query examples"
                            >
                                <span className="text-[11px] font-bold">?</span>
                            </button>

                            {/* Dropdown with examples */}
                            <div className="absolute right-0 top-full mt-2 w-96 bg-[#121212] border border-zinc-800 rounded shadow-2xl opacity-0 invisible group-hover/helper:opacity-100 group-hover/helper:visible transition-all z-50">
                                <div className="p-3 border-b border-zinc-800">
                                    <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Query Examples</div>
                                </div>
                                <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                                    {[
                                        { label: 'Wildcard Search', query: 'asset=*.pdf tenant="Acme*"' },
                                        { label: 'Regex Match', query: 'sourceIp matches "10\\..*"' },
                                        { label: 'Top N Analysis', query: 'risk="CRITICAL" | top 5 owner' },
                                        { label: 'Time-based Analysis', query: 'risk="CRITICAL" | timeslice 5m | count by _timeslice' },
                                        { label: 'Parse & Aggregate', query: 'parse "user=* " as username | count by username' },
                                        { label: 'Complex Filter', query: 'tenant="Acme Corp" | asset=*.pdf | where risk!="LOW"' },
                                        { label: 'Multi-stage Pipeline', query: 'risk="CRITICAL" | parse regex "hash=(\\w+)" as file_hash | fields owner, file_hash, asset' },
                                        { label: 'Trend Over Time', query: 'exposure="PUBLIC" | timeslice 1h | count by _timeslice, risk' },
                                    ].map((ex, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSearchQuery(ex.query)}
                                            className="w-full text-left p-2 hover:bg-zinc-800 rounded mb-1 group/item transition-colors"
                                        >
                                            <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">{ex.label}</div>
                                            <div className="text-[10px] font-mono text-emerald-400 group-hover/item:text-emerald-300">{ex.query}</div>
                                        </button>
                                    ))}
                                </div>
                                <div className="p-2 border-t border-zinc-800 bg-zinc-950">
                                    <div className="text-[8px] text-zinc-600 space-y-1">
                                        <div><span className="text-emerald-500">Operators:</span> = != matches contains</div>
                                        <div><span className="text-cyan-400">Commands:</span> where parse count top sort limit fields timeslice</div>
                                        <div><span className="text-yellow-400">Wildcards:</span> Use * for glob patterns</div>
                                        <div><span className="text-purple-400">Time:</span> timeslice 1m/5m/1h/1d</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className={`px-4 py-2 md:px-3 md:py-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400 text-black font-bold uppercase text-[10px] md:text-[9px] rounded-[1px] ml-1 transition-all flex items-center justify-center gap-1.5 ${isRunning ? 'opacity-70 cursor-wait' : 'active:scale-95'}`}
                        >
                            {isRunning ? (
                                <>
                                    <Circle size={10} className="animate-spin" />
                                    Running
                                </>
                            ) : 'Run'}
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex overflow-hidden relative bg-[#050505]">

                {/* SIDEBAR - Overlay on mobile */}
                <div className={`
                    border-r border-zinc-800 bg-[#080808] flex flex-col transition-all duration-300 z-50
                    ${showFieldBrowser && !isFocusMode ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full overflow-hidden'}
                    absolute md:relative inset-y-0 left-0
                `}>
                    <div className="p-2 border-b border-zinc-900">
                        <input className="w-full bg-[#030303] border border-zinc-800 rounded-[1px] px-2 py-1 text-[10px] text-zinc-300 focus:border-zinc-700 focus:outline-none placeholder:text-zinc-700 font-mono" placeholder="Filter schema..." />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                        <div className="py-2">
                            <FieldCategoryHeader title="Source" />
                            <FieldItem name="tenant" count={Object.keys(fieldCounts.tenant).length} onClick={() => addFilter('tenant', '')} />
                            <FieldItem name="sourceIp" count={Object.keys(fieldCounts.sourceIp).length} onClick={() => addFilter('sourceIp', '')} />
                            <FieldItem name="user" count={Object.keys(fieldCounts.owner).length} onClick={() => addFilter('owner', '')} />
                            <FieldItem name="app" count={Object.keys(fieldCounts.app).length} onClick={() => addFilter('app', '')} />
                        </div>
                        <div className="py-2 border-t border-zinc-900">
                            <FieldCategoryHeader title="Destination" />
                            <FieldItem name="destIp" count={Object.keys(fieldCounts.destIp).length} onClick={() => addFilter('destIp', '')} />
                            <FieldItem name="file_path" count={50} onClick={() => { }} />
                        </div>
                        <div className="py-2 border-t border-zinc-900">
                            <FieldCategoryHeader title="Traffic & Risk" />
                            <FieldItem name="risk" count={Object.keys(fieldCounts.risk).length} onClick={() => addFilter('risk', '')} />
                            <FieldItem name="exposure" count={Object.keys(fieldCounts.exposure).length} onClick={() => addFilter('exposure', '')} />
                            <FieldItem name="protocol" count={Object.keys(fieldCounts.protocol).length} onClick={() => addFilter('protocol', '')} />
                        </div>
                    </div>
                </div>

                {/* RESULTS CARD */}
                <div className="flex-1 flex flex-col min-w-0 relative p-2 md:p-4 bg-[#0a0a0a]">
                    <div className="flex-1 flex flex-col border border-zinc-800 bg-black rounded-[2px] overflow-hidden shadow-xl">

                        {/* Status Bar */}
                        <div className="h-8 border-b border-zinc-800 bg-[#0f0f0f] flex items-center justify-between px-3 shrink-0">
                            <div className="flex items-center gap-3 text-[9px] text-zinc-500 uppercase font-bold tracking-wider">
                                {viewMode === 'MESSAGES' ? (
                                    <>
                                        <span className="text-zinc-400">{filteredLogs.length} Messages</span>
                                        <span className="w-[1px] h-3 bg-zinc-700" />
                                        <span>Displaying 1-{Math.min(50, filteredLogs.length)}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-emerald-500">Aggregating by {(pipeline.find(s => s.type === 'AGGREGATE') as any)?.by || 'risk'}</span>
                                        <span className="w-[1px] h-3 bg-zinc-700" />
                                        <span>{aggregatedData.length} Groups</span>
                                    </>
                                )}
                                {isLive && <span className="text-emerald-500 ml-2 animate-pulse">Streaming...</span>}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowColMenu(!showColMenu)}
                                        className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300"
                                    >
                                        <Columns size={14} />
                                    </button>

                                    {showColMenu && (
                                        <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded shadow-xl py-1 z-50">
                                            {columns.map(col => (
                                                <button
                                                    key={col.id}
                                                    onClick={() => toggleColumn(col.id)}
                                                    className="w-full text-left px-3 py-1.5 text-[10px] text-zinc-300 hover:bg-zinc-800 flex items-center justify-between"
                                                >
                                                    <span>{col.label}</span>
                                                    {col.visible && <Check size={10} className="text-emerald-500" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* REAL-TIME TIMELINE HISTOGRAM */}
                        <div className="h-16 bg-[#080808] border-b border-zinc-800 flex items-end justify-between px-2 pt-2 relative overflow-hidden group">
                            {/* Map buckets to bars */}
                            {timelineBuckets.map((count, i) => {
                                // Normalize height relative to max
                                const max = Math.max(...timelineBuckets, 1);
                                const height = (count / max) * 100;
                                const isSelected = selectedBucketIndex === i;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedBucketIndex(isSelected ? null : i)}
                                        style={{ height: `${Math.max(height, 5)}%`, width: '1.5%' }}
                                        className={`mx-[1px] rounded-t-[1px] transition-all cursor-pointer relative z-20 ${isSelected ? 'bg-emerald-500' : 'bg-zinc-800 hover:bg-zinc-600'} ${count > 0 ? (isSelected ? 'bg-emerald-500' : 'bg-zinc-700') : (isSelected ? 'bg-emerald-900/50' : 'bg-zinc-900')}`}
                                        title={`${count} Logs (Click to filter)`}
                                    />
                                )
                            })}
                            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* TIMESTAMP AXIS */}
                        <div className="h-5 bg-[#080808] border-b border-zinc-800 flex items-center justify-between px-2 text-[9px] text-zinc-600 font-mono select-none">
                            {clientTime ? (
                                <>
                                    <span>{new Date(clientTime - 15 * 60000).toLocaleTimeString()}</span>
                                    <span>{new Date(clientTime - 11.25 * 60000).toLocaleTimeString()}</span>
                                    <span>{new Date(clientTime - 7.5 * 60000).toLocaleTimeString()}</span>
                                    <span>{new Date(clientTime - 3.75 * 60000).toLocaleTimeString()}</span>
                                    <span>{new Date(clientTime).toLocaleTimeString()}</span>
                                </>
                            ) : (
                                <span className="opacity-0">Loading...</span>
                            )}
                        </div>

                        {/* DATA GRID */}
                        <div ref={gridRef} className="flex-1 flex flex-col overflow-hidden bg-black relative">
                            {/* Running Overlay Flash */}
                            {isRunning && (
                                <div className="absolute inset-0 z-50 bg-emerald-500/5 backdrop-blur-[1px] pointer-events-none animate-in fade-in duration-300" />
                            )}
                            {viewMode === 'MESSAGES' ? (
                                <>
                                    {/* HEADER TABLE */}
                                    <div className="shrink-0 bg-[#0f0f0f] border-b border-zinc-800 overflow-hidden pr-[5px]"> {/* pr-5 matching custom-scrollbar width */}
                                        <table className="text-left border-separate border-spacing-0 table-fixed w-full">
                                            <thead>
                                                <tr className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                                                    <th className="w-12 py-2 pl-4 text-zinc-600 font-mono text-[9px] text-right pr-4 border-r border-zinc-800/20 shadow-[inset_0_-1px_0_0_rgba(39,39,42,1)] bg-[#0f0f0f]">
                                                        #
                                                    </th>
                                                    {columns.map(col => {
                                                        if (!col.visible) return null;
                                                        if (isFocusMode && (col.id === 'hash' || col.id === 'app' || col.id === 'owner' || col.id === 'exposure' || col.id === 'actions')) return null;

                                                        const responsiveClasses = (({
                                                            'tenant': 'hidden lg:table-cell',
                                                            'app': 'hidden md:table-cell',
                                                            'owner': 'hidden xl:table-cell',
                                                            'exposure': 'hidden lg:table-cell',
                                                            'actions': 'hidden sm:table-cell'
                                                        } as Record<string, string>)[col.id] || '');

                                                        return (
                                                            <th
                                                                key={col.id}
                                                                className={`bg-[#0f0f0f] py-2 pl-4 group shadow-[inset_0_-1px_0_0_rgba(39,39,42,1)] ${responsiveClasses}`}
                                                                style={{ width: col.width }}
                                                            >
                                                                <div className="flex items-center gap-2 justify-between pr-4">
                                                                    <button
                                                                        onClick={() => handleSort(col.id)}
                                                                        className="flex items-center gap-2 py-1 px-2 -ml-2 hover:text-zinc-300 active:bg-zinc-800 rounded transition-all active:scale-95"
                                                                    >
                                                                        <span>{col.label}</span>
                                                                        {sortConfig?.key === col.id && (
                                                                            sortConfig.direction === 'asc' ? <CaretUp size={10} weight="fill" /> : <CaretDown size={10} weight="fill" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                {/* Resize Handle */}
                                                                <div
                                                                    onMouseDown={(e) => handleResizeStart(e, col.id)}
                                                                    className="absolute top-0 bottom-0 -right-1.5 w-3 cursor-col-resize z-30 flex justify-center group/resize"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <div className="w-[1px] h-full bg-emerald-500/80 opacity-0 group-hover/resize:opacity-100 transition-opacity" />
                                                                </div>
                                                            </th>
                                                        );
                                                    })}
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>

                                    {/* BODY TABLE */}
                                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar bg-black">
                                        <table className="text-left border-separate border-spacing-0 table-fixed w-full">
                                            <tbody className="divide-y divide-zinc-900">
                                                {sortedLogs.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={columns.filter(c => c.visible).length + 1} className="py-20 text-center text-zinc-600 text-[10px] font-mono uppercase tracking-widest">
                                                            No results found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    paginatedLogs.map((file, idx) => (
                                                        <FileRow
                                                            key={file.id}
                                                            file={file}
                                                            index={(currentPage - 1) * pageSize + idx}
                                                            columns={columns}
                                                            isSelected={selectedFile?.id === file.id}
                                                            isFocusMode={isFocusMode}
                                                            onSelect={() => setSelectedFile(selectedFile?.id === file.id ? null : file)}
                                                            onAddFilter={addFilter}
                                                            onContextMenu={handleContextMenu}
                                                        />
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* PAGINATION CONTROLS - FIXED TO BOTTOM OF CARD */}
                                    {sortedLogs.length > 0 && (
                                        <div className="h-12 border-t border-zinc-800 bg-[#080808] flex items-center justify-between px-4 shrink-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Rows per page:</span>
                                                <select
                                                    value={isAutoPageSize ? 'auto' : pageSize}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === 'auto') {
                                                            setIsAutoPageSize(true);
                                                        } else {
                                                            setIsAutoPageSize(false);
                                                            setPageSize(Number(val));
                                                        }
                                                    }}
                                                    className="bg-zinc-900 text-zinc-400 text-[9px] font-mono border border-zinc-700 px-2 py-1 outline-none hover:border-zinc-500 transition-colors focus:ring-1 focus:ring-emerald-500/50"
                                                >
                                                    <option value="auto">Auto</option>
                                                    <option value={25}>25</option>
                                                    <option value={50}>50</option>
                                                    <option value={100}>100</option>
                                                    <option value={250}>250</option>
                                                    <option value={500}>500</option>
                                                </select>
                                                <div className="w-[1px] h-4 bg-zinc-800" />
                                                <span className="text-[9px] text-zinc-500 font-mono">
                                                    {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, sortedLogs.length)} of {sortedLogs.length}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setCurrentPage(1)}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-2 md:px-2 md:py-1 text-[9px] text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:bg-zinc-800 rounded"
                                                >
                                                    First
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                    disabled={currentPage === 1}
                                                    className="p-2 md:p-1 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:bg-zinc-800 rounded"
                                                >
                                                    <CaretLeft size={12} />
                                                </button>

                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                        let pageNum;
                                                        if (totalPages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage >= totalPages - 2) {
                                                            pageNum = totalPages - 4 + i;
                                                        } else {
                                                            pageNum = currentPage - 2 + i;
                                                        }

                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => setCurrentPage(pageNum)}
                                                                className={`px-3 py-2 md:px-2 md:py-1 text-[9px] font-mono rounded transition-all ${currentPage === pageNum
                                                                    ? 'bg-emerald-600 text-black font-bold'
                                                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 active:bg-zinc-700'
                                                                    } active:scale-95`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                <button
                                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="p-2 md:p-1 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:bg-zinc-800 rounded"
                                                >
                                                    <CaretRight size={12} />
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    disabled={currentPage === totalPages}
                                                    className="px-3 py-2 md:px-2 md:py-1 text-[9px] text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:bg-zinc-800 rounded"
                                                >
                                                    Last
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="border-b border-zinc-800">
                                            <tr className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                                                <th className="py-2 pl-4 w-1/3">Value ({(pipeline.find(s => s.type === 'AGGREGATE') as any)?.by || 'risk'})</th>
                                                <th className="py-2 pl-4 text-right">Count</th>
                                                <th className="py-2 pl-4 text-right">% Distribution</th>
                                                <th className="py-2 pl-4">Visualization</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-900">
                                            {aggregatedData.map((item, idx) => (
                                                <tr key={item.value} className="font-mono text-[10px] hover:bg-zinc-900/50 group">
                                                    <td className="py-2 pl-4 font-bold text-zinc-300">{item.value}</td>
                                                    <td className="py-2 pl-4 text-right text-zinc-400">{item.count}</td>
                                                    <td className="py-2 pl-4 text-right text-zinc-500">{item.pct.toFixed(1)}%</td>
                                                    <td className="py-2 pl-6 pr-4">
                                                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.pct}%` }} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* INSPECTOR */}
                <div
                    className={`border-l border-zinc-800 bg-[#0a0a0a] flex flex-col relative z-30 shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isFocusMode ? 'w-[650px] translate-x-0 opacity-100' : 'w-0 translate-x-[100px] opacity-0 pointer-events-none'}`}
                >
                    {selectedFile && <InspectorCanvas file={selectedFile} onClose={() => setSelectedFile(null)} />}
                </div>
            </div>

            {/* CONTEXT MENU */}
            {contextMenu && contextMenu.visible && (
                <div
                    className="fixed z-50 bg-[#121212] border border-zinc-700 shadow-2xl rounded p-1 w-48 animate-in bg-opacity-95 backdrop-blur-sm"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-2 py-1 border-b border-zinc-800 mb-1">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase">{contextMenu.field}</span>
                        <div className="text-[10px] text-zinc-300 truncate font-mono">{contextMenu.value}</div>
                    </div>
                    <button
                        onClick={() => { addFilter(contextMenu.field, contextMenu.value); setContextMenu(null); }}
                        className="w-full text-left px-2 py-1.5 text-[10px] text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-[1px] flex items-center gap-2"
                    >
                        <Plus size={10} /> Add to Search
                    </button>
                    <button
                        onClick={() => { alert('Excluded!'); setContextMenu(null); }}
                        className="w-full text-left px-2 py-1.5 text-[10px] text-zinc-300 hover:bg-rose-500/10 hover:text-rose-500 rounded-[1px] flex items-center gap-2"
                    >
                        <Minus size={10} /> Exclude
                    </button>
                    <button
                        onClick={() => { navigator.clipboard.writeText(contextMenu.value); setContextMenu(null); }}
                        className="w-full text-left px-2 py-1.5 text-[10px] text-zinc-300 hover:bg-zinc-800 rounded-[1px] flex items-center gap-2"
                    >
                        <Copy size={10} /> Copy Value
                    </button>
                </div>
            )}

            <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#050505]" />
        </main>
    );
}


// --- SUB-COMPONENTS ---

function FieldCategoryHeader({ title }: { title: string }) {
    return (
        <div className="px-3 py-1.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">{title}</span>
        </div>
    );
}

const FieldItem = ({ name, count, onClick }: { name: string, count: number, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-zinc-900/50 active:bg-zinc-800 transition-colors group"
    >
        <span className="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-300 transition-colors">{name}</span>
        <span className="text-[9px] text-zinc-700 font-mono tabular-nums">{count}</span>
    </button>
);

function FileRow({ file, index, columns, isSelected, isFocusMode, onSelect, onAddFilter, onContextMenu }: {
    file: CloudFile, index: number, columns: ColumnConfig[], isSelected: boolean, isFocusMode: boolean,
    onSelect: () => void, onAddFilter: (k: string, v: string) => void,
    onContextMenu: (e: React.MouseEvent, field: string, value: string) => void
}) {
    const [isRawOpen, setIsRawOpen] = useState(false);
    const date = new Date(file.lastModified);
    const ts = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    const renderCell = (colId: ColumnId) => {
        switch (colId) {
            case 'timestamp':
                return <span className="text-zinc-500 group-hover:text-zinc-400 whitespace-nowrap">{ts}</span>;
            case 'tenant':
                return (
                    <div onClick={(e) => { e.stopPropagation(); onAddFilter('tenant', file.tenant) }} className="flex items-center gap-2 cursor-pointer group/tenant" onContextMenu={(e) => onContextMenu(e, 'tenant', file.tenant)}>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 group-hover/tenant:bg-indigo-500 transition-colors" />
                        <span className="text-zinc-500 truncate group-hover/tenant:text-indigo-200 transition-colors font-semibold">{file.tenant}</span>
                    </div>
                );
            case 'name':
                return (
                    <div className="flex items-center gap-2 overflow-hidden">
                        <button onClick={(e) => { e.stopPropagation(); setIsRawOpen(!isRawOpen); }} className={`p-0.5 rounded transition-colors ${isRawOpen ? 'text-emerald-500 rotate-90' : 'text-zinc-700 hover:text-zinc-300'}`}>
                            <CaretRight size={10} weight="bold" />
                        </button>
                        <FileIcon type={file.type} />
                        <span className={`font-bold truncate transition-colors ${isSelected ? 'text-emerald-400' : 'text-zinc-300 group-hover:text-zinc-100'}`}>{file.name}</span>
                    </div>
                )
            case 'hash':
                return (
                    <span
                        className="text-zinc-500 group-hover:text-zinc-300 transition-colors select-all leading-tight truncate block"
                        onContextMenu={(e) => onContextMenu(e, 'hash', file.hash)}
                    >{file.hash}</span>
                );
            case 'app':
                return (
                    <div onClick={(e) => { e.stopPropagation(); onAddFilter('app', file.app) }} className="flex items-center gap-2 opacity-80 cursor-pointer hover:text-zinc-200" onContextMenu={(e) => onContextMenu(e, 'app', file.app)}>
                        {getAppIcon(file.app)}
                        <span className="font-medium text-zinc-500 group-hover:text-zinc-300">{file.app}</span>
                    </div>
                );
            case 'owner':
                return (
                    <div onClick={(e) => { e.stopPropagation(); onAddFilter('owner', file.owner) }} className="flex items-center gap-2 cursor-pointer hover:text-zinc-200" onContextMenu={(e) => onContextMenu(e, 'owner', file.owner)}>
                        <span className="text-zinc-500 truncate group-hover:text-zinc-300">{file.owner}</span>
                    </div>
                );
            case 'exposure':
                return <div onClick={(e) => { e.stopPropagation(); onAddFilter('exposure', file.exposure) }} className="cursor-pointer" onContextMenu={(e) => onContextMenu(e, 'exposure', file.exposure)}><ExposureBadge level={file.exposure} /></div>;
            case 'risk':
                return <div onClick={(e) => { e.stopPropagation(); onAddFilter('risk', file.risk) }} className="cursor-pointer" onContextMenu={(e) => onContextMenu(e, 'risk', file.risk)}><RiskBadge level={file.risk} compact={isFocusMode} /></div>;
            case 'actions':
                return (
                    <div className="flex items-center justify-start gap-1">
                        <button className="p-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-[1px] transition-all" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(file.hash); }}><Copy size={12} weight="bold" /></button>
                        <button className="p-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-blue-400 hover:border-blue-500 rounded-[1px] transition-all" onClick={(e) => { e.stopPropagation(); setIsRawOpen(!isRawOpen); }}><Code size={12} weight="bold" /></button>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <>
            <tr onClick={onSelect} className={`group cursor-pointer transition-all duration-100 hover:bg-[#111111] font-mono text-[10px] ${isSelected ? 'bg-zinc-900 border-l-2 border-l-emerald-500' : 'border-l-2 border-l-transparent'} ${isRawOpen ? 'bg-[#111111]' : ''}`}>
                <td className="w-12 py-2 pl-4 text-zinc-700 font-mono text-[9px] text-right pr-4 select-none border-r border-transparent group-hover:border-zinc-800/50 transition-colors bg-zinc-900/10 shrink-0">
                    {index + 1}
                </td>
                {columns.map(col => {
                    if (!col.visible) return null;
                    if (isFocusMode && (col.id === 'hash' || col.id === 'app' || col.id === 'owner' || col.id === 'exposure' || col.id === 'actions')) return null;

                    const responsiveClasses = (({
                        'tenant': 'hidden lg:table-cell',
                        'app': 'hidden md:table-cell',
                        'owner': 'hidden xl:table-cell',
                        'exposure': 'hidden lg:table-cell',
                        'actions': 'hidden sm:table-cell'
                    } as Record<string, string>)[col.id] || '');

                    return (
                        <td
                            key={col.id}
                            className={`py-2 pl-4 border-r border-transparent group-hover:border-zinc-800 transition-opacity duration-300 ${responsiveClasses}`}
                            style={{ width: col.width }}
                        >
                            {renderCell(col.id)}
                        </td>
                    )
                })}
            </tr>
            {isRawOpen && (
                <tr className="bg-[#0f0f0f]">
                    <td colSpan={columns.filter(c => c.visible).length + 1} className="p-0">
                        <div className="border-y border-zinc-800 bg-[#0a0a0a] p-3 pl-12 animate-in slide-in-from-top-1 duration-200">
                            <pre className="font-mono text-[10px] text-zinc-400 leading-relaxed overflow-x-auto custom-scrollbar select-text pl-2 border-l border-emerald-500/20">{JSON.stringify({ ...file, timestamp: file.lastModified }, null, 2)}</pre>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

function InspectorCanvas({ file, onClose }: { file: CloudFile, onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'fields' | 'raw' | 'json'>('fields');

    // Parse fields from rawMessage
    const parsedFields = useMemo(() => {
        const fields: Record<string, string> = {};
        const regex = /(\w+)=(".*?"|[^\s]+)/g;
        let match;
        while ((match = regex.exec(file.rawMessage)) !== null) {
            fields[match[1]] = match[2].replace(/^"|"$/g, '');
        }
        return fields;
    }, [file.rawMessage]);

    const jsonData = useMemo(() => ({
        id: file.id,
        timestamp: file.timestamp,
        name: file.name,
        type: file.type,
        owner: file.owner,
        app: file.app,
        risk: file.risk,
        exposure: file.exposure,
        hash: file.hash,
        tenant: file.tenant,
        sourceIp: file.sourceIp,
        destIp: file.destIp,
        protocol: file.protocol,
        rawMessage: file.rawMessage,
    }), [file]);

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a]">
            {/* Header */}
            <div className="h-12 border-b border-zinc-800 bg-[#0f0f0f] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-3">
                    <FileIcon type={file.type} size={16} />
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-zinc-100">{file.name}</span>
                        <span className="text-[8px] text-zinc-600 font-mono">{file.id}</span>
                    </div>
                </div>
                <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors">
                    <X size={14} />
                </button>
            </div>

            {/* Quick Stats Bar */}
            <div className="h-10 border-b border-zinc-800 bg-[#080808] flex items-center gap-4 px-4 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Risk</span>
                    <RiskBadge level={file.risk} />
                </div>
                <div className="w-[1px] h-4 bg-zinc-800" />
                <div className="flex items-center gap-2">
                    <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Exposure</span>
                    <ExposureBadge level={file.exposure} />
                </div>
                <div className="w-[1px] h-4 bg-zinc-800" />
                <div className="flex items-center gap-2">
                    <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Tenant</span>
                    <span className="text-[9px] text-indigo-400 font-mono">{file.tenant}</span>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="h-9 border-b border-zinc-800 bg-[#0a0a0a] flex items-center px-2 shrink-0 gap-1">
                {[
                    { id: 'fields' as const, label: 'Parsed Fields', icon: <List size={12} /> },
                    { id: 'raw' as const, label: 'Raw Message', icon: <TerminalWindow size={12} /> },
                    { id: 'json' as const, label: 'JSON', icon: <Code size={12} /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-[1px] text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                            ? 'bg-zinc-800 text-emerald-400'
                            : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'fields' && (
                    <div className="p-4">
                        {/* Core Fields */}
                        <div className="mb-6">
                            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Database size={12} />
                                Core Fields
                            </div>
                            <div className="space-y-2">
                                <FieldRow label="timestamp" value={new Date(file.timestamp).toISOString()} />
                                <FieldRow label="owner" value={file.owner} />
                                <FieldRow label="app" value={file.app} />
                                <FieldRow label="tenant" value={file.tenant} />
                                <FieldRow label="sourceIp" value={file.sourceIp} />
                                <FieldRow label="destIp" value={file.destIp} />
                                <FieldRow label="protocol" value={file.protocol} />
                            </div>
                        </div>

                        {/* Parsed Fields from Message */}
                        <div className="mb-6">
                            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <MagnifyingGlass size={12} />
                                Extracted Fields
                            </div>
                            <div className="space-y-2">
                                {Object.entries(parsedFields).map(([key, value]) => (
                                    <FieldRow key={key} label={key} value={value} />
                                ))}
                            </div>
                        </div>

                        {/* Security Context */}
                        <div>
                            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <ShieldCheck size={12} />
                                Security Context
                            </div>
                            <div className="space-y-2">
                                <FieldRow label="hash" value={file.hash} mono />
                                <FieldRow label="dlpTriggers" value={file.dlpTriggers.join(', ') || 'None'} />
                                {file.malware && <FieldRow label="malware" value={file.malware.name} danger />}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'raw' && (
                    <div className="p-4">
                        <div className="bg-[#050505] border border-zinc-800 rounded p-4 font-mono text-[10px] leading-relaxed">
                            {file.rawMessage.split(' ').map((part, i) => {
                                if (part.includes('=')) {
                                    const [key, ...valueParts] = part.split('=');
                                    const value = valueParts.join('=');
                                    return (
                                        <span key={i}>
                                            <span className="text-cyan-400">{key}</span>
                                            <span className="text-zinc-600">=</span>
                                            <span className="text-yellow-400">{value}</span>
                                            {' '}
                                        </span>
                                    );
                                }
                                return <span key={i} className="text-zinc-400">{part} </span>;
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'json' && (
                    <div className="p-4">
                        <pre className="bg-[#050505] border border-zinc-800 rounded p-4 font-mono text-[10px] text-zinc-300 leading-relaxed overflow-x-auto">
                            {JSON.stringify(jsonData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="h-12 border-t border-zinc-800 bg-[#0f0f0f] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold uppercase text-[8px] rounded-[1px] transition-colors flex items-center gap-1.5">
                        <Plus size={10} />
                        Add to Query
                    </button>
                    <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold uppercase text-[8px] rounded-[1px] transition-colors flex items-center gap-1.5">
                        <Copy size={10} />
                        Copy
                    </button>
                </div>
                <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold uppercase text-[8px] rounded-[1px] transition-colors flex items-center gap-1.5">
                    <DownloadSimple size={10} />
                    Export JSON
                </button>
            </div>
        </div>
    );
}

function FieldRow({ label, value, mono, danger }: { label: string, value: string, mono?: boolean, danger?: boolean }) {
    return (
        <div className="group flex items-start gap-3 p-2 hover:bg-zinc-900/50 rounded transition-colors">
            <div className="w-32 shrink-0">
                <span className="text-[9px] text-zinc-600 font-mono">{label}</span>
            </div>
            <div className="flex-1 min-w-0">
                <span className={`text-[10px] break-all ${mono ? 'font-mono text-zinc-400' : 'text-zinc-300'} ${danger ? 'text-rose-400' : ''}`}>
                    {value}
                </span>
            </div>
            <button
                onClick={() => navigator.clipboard.writeText(value)}
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-emerald-400 transition-all"
                title="Copy value"
            >
                <Copy size={10} />
            </button>
        </div>
    );
}

function MetaBlock({ label, value, mono }: { label: string, value: string, mono?: boolean }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider">{label}</span>
            <span className={`text-[10px] text-zinc-300 break-all leading-tight ${mono ? 'font-mono' : 'font-sans font-bold'}`}>{value}</span>
        </div>
    );
}

function ExposureBadge({ level }: { level: ExposureLevel }) {
    const styles = {
        PUBLIC: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        EXTERNAL: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        INTERNAL: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        PRIVATE: 'bg-zinc-800 text-zinc-500 border-zinc-700',
    };
    return (
        <div className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-[1px] border min-w-[60px] ${styles[level]}`}>
            <span className="text-[8px] font-black uppercase tracking-wider">{level}</span>
        </div>
    );
}

function RiskBadge({ level, compact }: { level: RiskLevel, compact?: boolean }) {
    const styles = { CRITICAL: 'text-rose-500', HIGH: 'text-orange-500', MEDIUM: 'text-yellow-500', LOW: 'text-blue-500' };
    return <span className={`text-[9px] font-black uppercase ${styles[level]}`}>{level}</span>;
}

function FileIcon({ type, size = 16 }: { type: string, size?: number }) {
    const className = "text-zinc-500";
    if (type === 'PDF') return <FilePdf size={size} className="text-red-400" weight="duotone" />;
    if (type === 'DOC') return <FileDoc size={size} className="text-blue-400" weight="duotone" />;
    if (type === 'XLS') return <FileXls size={size} className="text-emerald-400" weight="duotone" />;
    if (type === 'IMG') return <FileImage size={size} className="text-purple-400" weight="duotone" />;
    if (type === 'CODE') return <FileCode size={size} className="text-yellow-400" weight="duotone" />;
    return <FileText size={size} className={className} weight="duotone" />;
}

function getAppIcon(app: string) {
    if (app === 'Slack') return <SlackLogo size={14} className="text-white" />;
    if (app === 'Google Drive') return <GoogleLogo size={14} className="text-blue-400" />;
    return <Cloud size={14} className="text-zinc-500" />;
}
