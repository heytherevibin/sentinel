
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { SensorStatus } from '@/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, hostname, version, policyVersion } = body;

        if (!id || !hostname) {
            return NextResponse.json({ error: 'Missing ID or Hostname' }, { status: 400 });
        }

        // Update Status
        await db.updateSensor({
            id,
            hostname,
            lastSeen: Date.now(),
            status: 'ONLINE',
            version: version || '1.0.0'
        });
        console.log(`[HEARTBEAT] ${hostname} (${id}) is ONLINE`);

        // Check for pending commands
        const commands = await db.popCommands(id);

        // Policy Sync (Delta)
        const currentPolicyVersion = await db.getPolicyVersion();
        const policies = (policyVersion === currentPolicyVersion) ? null : await db.getPolicies();

        return NextResponse.json({
            policies,
            policyVersion: currentPolicyVersion,
            commands
        });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid Heartbeat' }, { status: 400 });
    }
}

export async function GET() {
    await db.addSystemLog('DEBUG', 'API', 'GET /api/telemetry/heartbeat - 200 OK');
    const sensors = await db.getSensors();
    return NextResponse.json(sensors);
}
