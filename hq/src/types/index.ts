export type EventType = "CLIPBOARD_BLOCK" | "WINDOW_RISK" | "HEARTBEAT" | "SYSTEM_ALERT";

export interface TelemetryEvent {
    id: string;
    sensorId: string;
    type: EventType;
    timestamp: number;
    metadata: {
        contentOverride?: string; // If we blocked content
        windowTitle?: string;
        appName?: string;
        riskScore?: number;
        user?: string;
        host?: string;
    };
}

export interface SensorStatus {
    id: string;
    hostname: string;
    lastSeen: number;
    status: "ONLINE" | "OFFLINE" | "WARNING";
    version: string;
}

export interface PolicyRule {
    id: string;
    name: string;
    pattern: string; // Regex
    action: "BLOCK" | "LOG_ONLY";
    description: string;
}
