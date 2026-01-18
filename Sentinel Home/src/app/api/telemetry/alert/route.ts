
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { TelemetryEvent } from '@/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Basic Validation
        if (!body.sensorId || !body.type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const alert: TelemetryEvent = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            ...body
        };

        await db.addAlert(alert);
        console.log(`[ALERT] Received from ${alert.sensorId}: ${alert.type}`);

        return NextResponse.json({ success: true, id: alert.id });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
}

export async function GET() {
    await db.addSystemLog('DEBUG', 'API', 'GET /api/telemetry/alert - 200 OK');
    const alerts = await db.getAlerts();
    return NextResponse.json(alerts);
}
