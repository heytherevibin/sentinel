import { prisma } from './prisma';
import { TelemetryEvent, SensorStatus, PolicyRule } from '@/types';

// Default Policies
const DEFAULT_POLICIES = [
    { id: 'edm-1', category: 'EDM & IDM', name: 'Customer Database EDM', pattern: '[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', action: 'BLOCK', description: 'Detects email addresses in sensitive contexts' },
    { id: 'edm-2', category: 'EDM & IDM', name: 'Employee Masterfile EDM', pattern: '\\b\\d{3}-\\d{2}-\\d{4}\\b', action: 'BLOCK', description: 'Prevents SSN leakage' },
    { id: 'dev-1', category: 'Developer Secrets', name: 'AWS Access Key', pattern: '\\b(AKIA|ASIA)[0-9A-Z]{16}\\b', action: 'BLOCK', description: 'Standard AWS Access Key' },
    { id: 'reg-1', category: 'Regional & Industry', name: 'ABA Routing', pattern: '\\b\\d{9}\\b', action: 'BLOCK', description: 'US ABA Routing Number' }
];

export const db = {
    getAlerts: async (): Promise<TelemetryEvent[]> => {
        try {
            const alerts = await prisma.alert.findMany({
                orderBy: { timestamp: 'desc' },
                take: 1000
            });
            return alerts.map(a => ({
                id: a.id,
                sensorId: a.sensorId,
                type: a.type,
                timestamp: a.timestamp.getTime(),
                hostname: a.hostname,
                payload: a.payload as any,
                metadata: a.metadata as any
            }));
        } catch (e) { return []; }
    },

    addAlert: async (alert: TelemetryEvent) => {
        try {
            await prisma.alert.create({
                data: {
                    id: alert.id,
                    sensorId: alert.sensorId,
                    type: alert.type,
                    timestamp: new Date(alert.timestamp),
                    hostname: alert.hostname || 'unknown',
                    payload: alert.payload || {},
                    metadata: alert.metadata || {}
                }
            });
        } catch (e) {
            console.error(`[DB_ALERT_EXCEPTION]`, e);
        }
    },

    getSensors: async (): Promise<SensorStatus[]> => {
        try {
            const sensors = await prisma.sensor.findMany();
            return sensors.map((s: any) => ({
                id: s.id,
                hostname: s.hostname,
                ipAddress: s.ipAddress || undefined,
                lastSeen: s.lastSeen.getTime(),
                status: s.status as any,
                version: s.version
            }));
        } catch (e) { return []; }
    },

    updateSensor: async (status: SensorStatus) => {
        try {
            await prisma.sensor.upsert({
                where: { id: status.id },
                update: {
                    hostname: status.hostname,
                    lastSeen: new Date(status.lastSeen),
                    status: status.status,
                    version: status.version,
                    ipAddress: status.ipAddress || null
                },
                create: {
                    id: status.id,
                    hostname: status.hostname,
                    lastSeen: new Date(status.lastSeen),
                    status: status.status,
                    version: status.version,
                    ipAddress: status.ipAddress || null
                }
            });
        } catch (e) {
            console.error('[DB_SENSOR_UPSERT_FAIL]', e);
        }
    },

    getPolicies: async (): Promise<PolicyRule[]> => {
        try {
            const count = await prisma.policy.count();
            if (count === 0) {
                await prisma.policy.createMany({
                    data: DEFAULT_POLICIES.map(p => ({
                        ...p,
                        updatedAt: new Date()
                    }))
                });
            }
            const policies = await prisma.policy.findMany();
            return policies.map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                pattern: p.pattern,
                description: p.description,
                action: p.action as "BLOCK" | "LOG_ONLY",
                updatedAt: p.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString()
            }));
        } catch (e) {
            console.error("Prisma Policy Fetch Error:", e);
            return DEFAULT_POLICIES.map(p => ({
                ...p,
                action: p.action as "BLOCK" | "LOG_ONLY",
                updatedAt: new Date().toISOString()
            }));
        }
    },

    getPolicyVersion: async (): Promise<string> => {
        try {
            const data = await prisma.policy.findMany({
                orderBy: { id: 'asc' }
            });
            if (!data || data.length === 0) return 'v0';
            const content = JSON.stringify(data.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                pattern: p.pattern,
                action: p.action
            })));
            let hash = 0;
            for (let i = 0; i < content.length; i++) {
                hash = ((hash << 5) - hash) + content.charCodeAt(i);
                hash |= 0;
            }
            return hash.toString(16);
        } catch (e) { return 'v0'; }
    },

    updatePolicies: async (policies: PolicyRule[]) => {
        try {
            await prisma.$transaction(async (tx) => {
                await tx.policy.deleteMany();
                await tx.policy.createMany({
                    data: policies.map(p => ({
                        id: p.id,
                        name: p.name,
                        category: p.category,
                        pattern: p.pattern,
                        action: p.action,
                        description: p.description,
                        updatedAt: new Date()
                    }))
                });
            });
        } catch (e) {
            console.error('[DB_POLICY_SYNC_FAIL]', e);
        }
    },

    queueCommand: async (sensorId: string, type: string, payload: string) => {
        try {
            await prisma.command.create({
                data: {
                    sensorId,
                    type,
                    payload
                }
            });
        } catch (e) { /* Silent Fail */ }
    },

    popCommands: async (sensorId: string) => {
        try {
            const commands = await prisma.command.findMany({
                where: { sensorId }
            });

            if (commands && commands.length > 0) {
                // Atomic delete of ONLY the fetched commands
                await prisma.command.deleteMany({
                    where: {
                        id: { in: commands.map(c => c.id) }
                    }
                });
            }
            return commands;
        } catch (e) {
            console.error('[DB_CMD_POP_FAIL]', e);
            return [];
        }
    },

    getSystemLogs: async (): Promise<any[]> => {
        try {
            const logs = await prisma.systemLog.findMany({
                orderBy: { timestamp: 'desc' },
                take: 500
            });
            return logs;
        } catch (e) { return []; }
    },

    addSystemLog: async (type: string, component: string, message: string) => {
        try {
            await prisma.systemLog.create({
                data: { type, component, message }
            });
        } catch (e) {
            console.error(`[DB_LOG_EXCEPTION]`, e);
        }
    },

    getStats: async () => {
        try {
            const [totalAgents, onlineAgents, threatsBlocked, totalEvents, activePolicies] = await Promise.all([
                prisma.sensor.count(),
                prisma.sensor.count({
                    where: { lastSeen: { gt: new Date(Date.now() - 60000) } }
                }),
                prisma.alert.count({
                    where: { type: 'CLIPBOARD_BLOCK' }
                }),
                prisma.alert.count(),
                prisma.policy.count()
            ]);

            return { totalAgents, onlineAgents, threatsBlocked, totalEvents, activePolicies };
        } catch (e) {
            return { totalAgents: 0, onlineAgents: 0, threatsBlocked: 0, totalEvents: 0, activePolicies: 0 };
        }
    },

    getChartData: async () => {
        try {
            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

            const [alerts, logs] = await Promise.all([
                prisma.alert.findMany({
                    where: { timestamp: { gt: twentyFourHoursAgo } },
                    select: { timestamp: true }
                }),
                prisma.auditLog.findMany({
                    where: { timestamp: { gt: twentyFourHoursAgo } },
                    select: { timestamp: true }
                })
            ]);

            const hourCounts = new Map<string, number>();
            const timeline = [];

            for (let i = 23; i >= 0; i--) {
                const d = new Date(now);
                d.setHours(d.getHours() - i);
                const key = `${d.getDate()}-${d.getHours()}`;
                const label = `${d.getHours().toString().padStart(2, '0')}:00`;
                hourCounts.set(key, 0);
                timeline.push({ key, name: label, value: 0 });
            }

            const processTimestamp = (date: Date) => {
                const key = `${date.getDate()}-${date.getHours()}`;
                if (hourCounts.has(key)) {
                    hourCounts.set(key, (hourCounts.get(key) || 0) + 1);
                }
            };

            alerts.forEach(a => processTimestamp(a.timestamp));
            logs.forEach(l => processTimestamp(l.timestamp));

            return timeline.map(t => ({
                name: t.name,
                value: hourCounts.get(t.key) || 0
            }));

        } catch (e) { return []; }
    },

    getSystemConfig: async (): Promise<Record<string, any>> => {
        try {
            const config = await (prisma as any).systemConfig.findMany();
            if (!config || config.length === 0) {
                return {
                    risk_sensitivity: '75',
                    engine_enabled: 'true',
                    anomaly_threshold: '0.85',
                    model_version: '3.14.0-sentinel'
                };
            }
            return config.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
        } catch (e) {
            return { risk_sensitivity: '75', engine_enabled: 'true' };
        }
    },

    updateSystemConfig: async (key: string, value: string) => {
        try {
            await (prisma as any).systemConfig.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            });
        } catch (e) {
            console.error('Config Update Failed', e);
        }
    },

    checkConnection: async (): Promise<boolean> => {
        try {
            await prisma.$queryRaw`SELECT 1`;
            return true;
        } catch (e) {
            return false;
        }
    },

    // Real Impact Analysis (Blast Radius)
    scanHistoricalLogs: async (pattern: string): Promise<{ matches: number; total: number; impactStats: any[] }> => {
        try {
            const [logs, alerts] = await Promise.all([
                prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' }, take: 500 }),
                prisma.alert.findMany({ orderBy: { timestamp: 'desc' }, take: 500 })
            ]);

            const allEvents = [
                ...logs.map(l => ({ id: l.id, text: JSON.stringify(l), time: l.timestamp })),
                ...alerts.map(a => ({ id: a.id, text: JSON.stringify(a), time: a.timestamp }))
            ];

            if (allEvents.length === 0) return { matches: 0, total: 0, impactStats: [] };

            const regex = new RegExp(pattern, 'i');
            const matches = allEvents.filter(e => regex.test(e.text));

            return {
                matches: matches.length,
                total: allEvents.length,
                impactStats: matches.slice(0, 5)
            };
        } catch (e) {
            console.error("Impact Scan Failed", e);
            return { matches: 0, total: 0, impactStats: [] };
        }
    },

    // Audit Log Methods
    getAuditLogs: async (): Promise<any[]> => {
        try {
            return await prisma.auditLog.findMany({
                orderBy: { timestamp: 'desc' },
                take: 1000
            });
        } catch (e) { return []; }
    },

    addAuditLog: async (actorId: string, actorName: string, action: string, targetResource: string, details?: any, severity: string = 'INFO') => {
        try {
            await prisma.auditLog.create({
                data: {
                    actorId,
                    actorName,
                    action,
                    targetResource,
                    details: details || {},
                    severity,
                    hash: Math.random().toString(36).substring(2, 15) // Mock hash for UI aesthetics
                }
            });
        } catch (e) {
            console.error('[DB_AUDIT_LOG_FAIL]', e);
        }
    },

    // Application Inventory Methods
    getApplications: async () => {
        try {
            return await (prisma as any).application.findMany({
                orderBy: { name: 'asc' }
            });
        } catch (e) { return []; }
    },

    seedInitialApps: async () => {
        const apps = [
            { id: 'APP-001', name: 'Google Workspace', vendor: 'Google LLC', instance: 'sentinel-corp.google.com', type: 'Sanctioned', users: 142, cci: 98, certs: ['SOC2', 'ISO27001'] },
            { id: 'APP-002', name: 'Slack (Corporate)', vendor: 'Salesforce', instance: 'sentinel-team.slack.com', type: 'Sanctioned', users: 138, cci: 92, certs: ['SOC2'] },
            { id: 'APP-003', name: 'Dropbox (Personal)', vendor: 'Dropbox Inc', instance: 'personal-box', type: 'Unsanctioned', users: 3, cci: 45, risk: 'Exfiltration Risk' },
            { id: 'APP-004', name: 'ChatGPT Enterprise', vendor: 'OpenAI', instance: 'sentinel.openai.com', type: 'Sanctioned', users: 56, cci: 85, certs: ['SOC2'] },
            { id: 'APP-005', name: 'WeTransfer', vendor: 'WeTransfer BV', instance: 'public-web', type: 'Unsanctioned', users: 1, cci: 30, risk: 'No Encryption' }
        ];

        try {
            const count = await (prisma as any).application.count();
            if (count === 0) {
                await (prisma as any).application.createMany({ data: apps });
            }
        } catch (e) { console.error("App Seeding Failed", e); }
    },

    // Gateway Connector Methods
    getGateways: async () => {
        try {
            const count = await (prisma as any).gatewayConnector.count();
            if (count === 0) {
                await db.seedInitialGateways();
            }
            return await (prisma as any).gatewayConnector.findMany({
                orderBy: { id: 'asc' }
            });
        } catch (e: any) {
            return [];
        }
    },

    updateGateway: async (id: string, data: any) => {
        try {
            await (prisma as any).gatewayConnector.update({
                where: { id },
                data
            });
            await db.addSystemLog('INFO', 'GATEWAY', `Gateway ${id} state updated.`);
        } catch (e) { console.error('Gateway Update Failed', e); }
    },

    seedInitialGateways: async () => {
        const connectors = [
            { id: 'CONN-01', name: 'Okta Enterprise', status: 'connected', type: 'OIDC/IDP', icon: 'Fingerprint', color: 'text-zinc-400', ipAddress: '104.28.16.22', region: 'US-EAST-1' },
            { id: 'CONN-02', name: 'Slack Grid', status: 'connected', type: 'SaaS/CASB', icon: 'SlackLogo', color: 'text-zinc-400', ipAddress: '172.64.12.5', region: 'US-WEST-2' },
            { id: 'CONN-03', name: 'Google Workspace', status: 'warning', type: 'DLP/Mail', icon: 'GoogleLogo', color: 'text-zinc-400', ipAddress: '142.250.190.46', region: 'EU-CENTRAL-1' },
            { id: 'CONN-04', name: 'AWS Production', status: 'connected', type: 'Cloud/SSPM', icon: 'AmazonLogo', color: 'text-zinc-400', ipAddress: '52.94.233.129', region: 'US-EAST-1' },
            { id: 'CONN-05', name: 'Microsoft Teams', status: 'connected', type: 'SAAS/COMM', icon: 'MicrosoftTeamsLogo', color: 'text-zinc-400', ipAddress: '52.113.194.132', region: 'EU-WEST-1' },
            { id: 'CONN-06', name: 'MS Outlook', status: 'connected', type: 'SAAS/MAIL', icon: 'MicrosoftOutlookLogo', color: 'text-zinc-400', ipAddress: '40.97.148.210', region: 'US-EAST-2' },
        ];
        try {
            for (const conn of connectors) {
                await (prisma as any).gatewayConnector.upsert({
                    where: { id: conn.id },
                    update: conn,
                    create: conn
                });
            }
        } catch (e: any) {
            console.error("Gateway Seeding Failed:", e.message);
        }
    }
};
