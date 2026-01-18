import { createClient } from '@supabase/supabase-js';
import { TelemetryEvent, SensorStatus, PolicyRule } from '@/types';

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
            const { data, error } = await supabase
                .from('Alert')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(1000);

            if (error) throw error;
            return (data || []).map((a: any) => ({
                id: a.id,
                sensorId: a.sensorId || a.sensorid,
                type: a.type,
                timestamp: new Date(a.timestamp).getTime(),
                hostname: a.hostname,
                payload: a.payload,
                metadata: a.metadata
            }));
        } catch (e) { return []; }
    },

    addAlert: async (alert: TelemetryEvent) => {
        try {
            const { error } = await supabase.from('Alert').insert({
                id: alert.id,
                sensorId: alert.sensorId,
                type: alert.type,
                timestamp: new Date(alert.timestamp),
                hostname: alert.hostname || 'unknown',
                payload: alert.payload || {},
                metadata: alert.metadata || {}
            });
            if (error) console.error(`[DB_ALERT_ERROR] ${error.message}`);
        } catch (e) {
            console.error(`[DB_ALERT_EXCEPTION]`, e);
        }
    },

    getSensors: async (): Promise<SensorStatus[]> => {
        try {
            const { data, error } = await supabase.from('Sensor').select('*');
            if (error) throw error;
            return (data || []).map((s: any) => ({
                id: s.id,
                hostname: s.hostname,
                lastSeen: new Date(s.lastSeen || s.lastseen).getTime(),
                status: s.status,
                version: s.version
            }));
        } catch (e) { return []; }
    },

    updateSensor: async (status: SensorStatus) => {
        try {
            await supabase.from('Sensor').upsert({
                id: status.id,
                hostname: status.hostname,
                lastSeen: new Date(status.lastSeen),
                status: status.status,
                version: status.version
            }, { onConflict: 'hostname' });
        } catch (e) { /* Silent Fail */ }
    },

    getPolicies: async (): Promise<PolicyRule[]> => {
        try {
            const { count } = await supabase.from('Policy').select('*', { count: 'exact', head: true });
            if (count === 0) {
                await supabase.from('Policy').insert(DEFAULT_POLICIES.map(p => ({
                    ...p,
                    updatedAt: new Date()
                })));
            }
            const { data, error } = await supabase.from('Policy').select('*');
            if (error) throw error;
            return (data || []).map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                pattern: p.pattern,
                description: p.description,
                action: p.action as "BLOCK" | "LOG_ONLY",
                updatedAt: p.updatedAt || p.updatedat
            }));
        } catch (e) {
            console.error("Supabase Policy Fetch Error:", e);
            return DEFAULT_POLICIES.map(p => ({
                ...p,
                action: p.action as "BLOCK" | "LOG_ONLY"
            }));
        }
    },

    getPolicyVersion: async (): Promise<string> => {
        try {
            const { data } = await supabase.from('Policy').select('*').order('id', { ascending: true });
            if (!data || data.length === 0) return 'v0';
            // Sort keys to ensure stable hash even if DB column order varies
            const content = JSON.stringify(data.map((p: any) => ({
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
            // Delete all and re-create policies
            await supabase.from('Policy').delete().neq('id', '0'); // Delete all (NEQ 0 is a hack for delete all without predicate)
            await supabase.from('Policy').insert(policies.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                pattern: p.pattern,
                action: p.action,
                description: p.description,
                updatedAt: new Date()
            })));
        } catch (e) { /* Silent Fail */ }
    },

    queueCommand: async (sensorId: string, type: string, payload: string) => {
        try {
            await supabase.from('Command').insert({
                id: crypto.randomUUID(),
                sensorId,
                type,
                payload
            });
        } catch (e) { /* Silent Fail */ }
    },

    popCommands: async (sensorId: string) => {
        try {
            // Get commands
            const { data: commands } = await supabase
                .from('Command')
                .select('*')
                .eq('sensorId', sensorId);

            if (commands && commands.length > 0) {
                // Delete them
                await supabase.from('Command').delete().eq('sensorId', sensorId);
                return commands;
            }
            return [];
        } catch (e) { return []; }
    },

    getSystemLogs: async (): Promise<any[]> => {
        try {
            const { data } = await supabase
                .from('SystemLog')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(500);
            return data || [];
        } catch (e) { return []; }
    },

    addSystemLog: async (type: string, component: string, message: string) => {
        try {
            const { error } = await supabase.from('SystemLog').insert({
                type,
                component,
                message
            });
            if (error) console.error(`[DB_LOG_ERROR] ${error.message}`);
        } catch (e) {
            console.error(`[DB_LOG_EXCEPTION]`, e);
        }
    },

    getStats: async () => {
        try {
            // Parallel fetches
            const [agents, online, threats, events, policies] = await Promise.all([
                supabase.from('Sensor').select('*', { count: 'exact', head: true }),
                supabase.from('Sensor').select('*', { count: 'exact', head: true }).gt('lastSeen', new Date(Date.now() - 60000).toISOString()),
                supabase.from('Alert').select('*', { count: 'exact', head: true }).eq('type', 'CLIPBOARD_BLOCK'),
                supabase.from('Alert').select('*', { count: 'exact', head: true }),
                supabase.from('Policy').select('*', { count: 'exact', head: true })
            ]);

            return {
                totalAgents: agents.count || 0,
                onlineAgents: online.count || 0,
                threatsBlocked: threats.count || 0,
                totalEvents: events.count || 0,
                activePolicies: policies.count || 0
            };
        } catch (e) {
            return { totalAgents: 0, onlineAgents: 0, threatsBlocked: 0, totalEvents: 0, activePolicies: 0 };
        }
    },

    getChartData: async () => {
        try {
            const { data: alerts } = await supabase
                .from('Alert')
                .select('timestamp')
                .gt('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

            const data = [];
            const now = new Date();

            for (let i = 23; i >= 0; i--) {
                const d = new Date(now);
                d.setHours(d.getHours() - i);
                const hour = d.getHours();
                const timeLabel = hour.toString().padStart(2, '0') + ':00';

                const baseTraffic = 20 + Math.max(0, Math.sin((hour - 6) / 18 * Math.PI)) * 50;
                const noise = ((hour * 9301 + 49297) % 233280) % 15;

                const alertCount = (alerts || []).filter((a: any) => {
                    const ad = new Date(a.timestamp);
                    return ad.getHours() === hour;
                }).length;

                const value = Math.floor(baseTraffic + noise + (alertCount * 5));
                data.push({ name: timeLabel, value });
            }
            return data;
        } catch (e) { return []; }
    },

    getSystemConfig: async (): Promise<Record<string, any>> => {
        try {
            const { data } = await supabase.from('SystemConfig').select('*');
            const config: Record<string, any> = {
                risk_sensitivity: '75',
                engine_enabled: 'true',
                anomaly_threshold: '0.85',
                model_version: '3.14.0-sentinel'
            };
            if (data) {
                data.forEach((item: any) => {
                    config[item.key] = item.value;
                });
            }
            return config;
        } catch (e) { return {}; }
    },

    updateSystemConfig: async (key: string, value: string) => {
        try {
            await supabase.from('SystemConfig').upsert({ key, value });
        } catch (e) { /* Silent Fail */ }
    },

    checkConnection: async (): Promise<boolean> => {
        try {
            const { error } = await supabase.from('SystemConfig').select('key').limit(1);
            return !error;
        } catch (e) {
            return false;
        }
    }
};
