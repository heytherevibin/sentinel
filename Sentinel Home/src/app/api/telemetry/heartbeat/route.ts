
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
        db.updateSensor({
            id,
            hostname,
            lastSeen: Date.now(),
            status: 'ONLINE',
            version: version || '1.0.0'
        });
        console.log(`[HEARTBEAT] ${hostname} (${id}) is ONLINE`);

        // Check for pending commands
        const commands = db.popCommands(id);

        // Policy Sync (Delta)
        const currentPolicyVersion = db.getPolicyVersion();
        const policies = (policyVersion === currentPolicyVersion) ? null : db.getPolicies();

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
    const sensors = db.getSensors();
    return NextResponse.json(sensors);
}
