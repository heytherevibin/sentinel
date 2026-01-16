
import { NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { SensorStatus } from '@/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, hostname, version } = body;

        if (!id || !hostname) {
            return NextResponse.json({ error: 'Missing ID or Hostname' }, { status: 400 });
        }

        // Update Status
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

        // Return active policies + commands
        const policies = db.getPolicies();

        return NextResponse.json({ policies, commands });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid Heartbeat' }, { status: 400 });
    }
}

export async function GET() {
    const sensors = db.getSensors();
    return NextResponse.json(sensors);
}
