import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { TelemetryEvent, SensorStatus } from '@/types';
export type { TelemetryEvent };

const DATA_DIR = path.join(process.cwd(), 'data');
const ALERTS_FILE = path.join(DATA_DIR, 'alerts.json');
const SENSORS_FILE = path.join(DATA_DIR, 'sensors.json');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(filePath: string, defaultValue: T): T {
    try {
        if (!fs.existsSync(filePath)) return defaultValue;
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error(`Error reading ${filePath}`, e);
        return defaultValue;
    }
}

function writeJson(filePath: string, data: any) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export const db = {
    getAlerts: (): TelemetryEvent[] => readJson(ALERTS_FILE, []),
    addAlert: (alert: TelemetryEvent) => {
        const alerts = readJson<TelemetryEvent[]>(ALERTS_FILE, []);
        alerts.unshift(alert); // Newest first
        // Keep only last 1000
        if (alerts.length > 1000) alerts.length = 1000;
        writeJson(ALERTS_FILE, alerts);
    },

    getSensors: (): SensorStatus[] => readJson(SENSORS_FILE, []),
    updateSensor: (status: SensorStatus) => {
        const sensors = readJson<SensorStatus[]>(SENSORS_FILE, []);

        // 1. Try to find by ID
        let index = sensors.findIndex(s => s.id === status.id);

        // 2. If not found by ID, try to find by Hostname (prevent duplicates for same machine)
        if (index === -1) {
            index = sensors.findIndex(s => s.hostname === status.hostname);
        }

        if (index >= 0) {
            // Update existing
            sensors[index] = { ...sensors[index], ...status };
        } else {
            // New Entry
            sensors.push(status);
        }
        writeJson(SENSORS_FILE, sensors);
    },

    getPolicies: (): any[] => {
        // Return stored policies or seed defaults if empty
        const policies = readJson(path.join(DATA_DIR, 'policies.json'), []);
        if (policies.length === 0) {
            const defaults = [
                { id: '1', name: 'AWS_ACCESS_KEY', pattern: 'AKIA[0-9A-Z]{16}', action: 'BLOCK', description: 'Blocks AWS IAM Access Keys' },
                { id: '2', name: 'JWT_TOKEN', pattern: 'eyJ[a-zA-Z0-9_\\-\\.]+\\.[a-zA-Z0-9_\\-\\.]+\\.[a-zA-Z0-9_\\-\\.]+', action: 'BLOCK', description: 'Blocks JSON Web Tokens' },
                { id: '3', name: 'EMAIL_ADDRESS', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', action: 'LOG_ONLY', description: 'Logs PII (Email)' },
                { id: '4', name: 'INTERNAL_KEYWORD', pattern: '(CONFIDENTIAL|SECRET|PROPRIETARY)', action: 'BLOCK', description: 'Blocks Corporate Classifications' }
            ];
            writeJson(path.join(DATA_DIR, 'policies.json'), defaults);
            return defaults;
        }
        return policies;
    },

    getPolicyVersion: (): string => {
        const policies = readJson(path.join(DATA_DIR, 'policies.json'), []);
        if (!policies || policies.length === 0) return 'v0';
        return crypto.createHash('sha256').update(JSON.stringify(policies)).digest('hex').substring(0, 8);
    },

    updatePolicies: (policies: any[]) => {
        writeJson(path.join(DATA_DIR, 'policies.json'), policies);
    },

    // Command Queue
    queueCommand: (sensorId: string, type: string, payload: string) => {
        const commands = readJson<any[]>(path.join(DATA_DIR, 'commands.json'), []);
        commands.push({ id: Date.now().toString(), sensorId, type, payload, queuedAt: Date.now() });
        writeJson(path.join(DATA_DIR, 'commands.json'), commands);
    },

    popCommands: (sensorId: string) => {
        const commands = readJson<any[]>(path.join(DATA_DIR, 'commands.json'), []);
        const forSensor = commands.filter(c => c.sensorId === sensorId);
        const remaining = commands.filter(c => c.sensorId !== sensorId);

        if (forSensor.length > 0) {
            writeJson(path.join(DATA_DIR, 'commands.json'), remaining);
        }
        return forSensor;
    },

    getStats: () => {
        const sensors = readJson<SensorStatus[]>(SENSORS_FILE, []);
        const alerts = readJson<TelemetryEvent[]>(ALERTS_FILE, []);
        const policies = readJson(path.join(DATA_DIR, 'policies.json'), []);

        const threats = alerts.filter(a => a.type === 'CLIPBOARD_BLOCK').length;
        // Mock data processed: 1MB per alert? or just total count
        const totalEvents = alerts.length;

        return {
            totalAgents: sensors.length,
            onlineAgents: sensors.filter(s => (Date.now() - s.lastSeen) < 60000).length,
            threatsBlocked: threats,
            totalEvents: totalEvents,
            activePolicies: policies.length
        };
    },

    getChartData: () => {
        const alerts = readJson<TelemetryEvent[]>(ALERTS_FILE, []);
        // Bucket by hour for last 24h
        const buckets: Record<string, number> = {};
        for (let i = 0; i < 24; i++) {
            const d = new Date();
            d.setHours(d.getHours() - i);
            const key = d.getHours().toString().padStart(2, '0') + ':00';
            buckets[key] = 0;
        }

        alerts.forEach(a => {
            const date = new Date(a.timestamp);
            const key = date.getHours().toString().padStart(2, '0') + ':00';
            if (buckets[key] !== undefined) buckets[key]++;
        });

        // Convert to array and reverse to show oldest to newest
        return Object.entries(buckets)
            .map(([name, uv]) => ({ name, uv }))
            .reverse();
    }
};
