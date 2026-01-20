export type EventType = "CLIPBOARD_BLOCK" | "WINDOW_RISK" | "HEARTBEAT" | "SYSTEM_ALERT";

export interface TelemetryEvent {
    id: string;
    sensorId: string;
    type: EventType | string;
    timestamp: number;
    hostname?: string;
    payload?: any;
    metadata?: {
        contentOverride?: string;
        windowTitle?: string;
        appName?: string;
        riskScore?: number;
        user?: string;
        host?: string;
        message?: string;
        // Introspection Specifics
        url?: string;
        command?: string;
        contentSnippet?: string;
        policyName?: string;
    };
}

export interface SensorStatus {
    id: string;
    hostname: string;
    ipAddress?: string;
    lastSeen: number;
    status: "ONLINE" | "OFFLINE" | "WARNING";
    version: string;
}

export interface PolicyRule {
    id: string;
    name: string;
    pattern: string; // Regex
    category: string;
    action: "BLOCK" | "LOG_ONLY";
    description: string;
}
