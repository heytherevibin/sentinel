import { NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { logAuditAction } from '@/lib/audit';

export async function POST(req: Request) {
    try {
        const { sensorId, type, payload } = await req.json();
        await db.queueCommand(sensorId, type, payload);

        // Log to Audit Ledger
        await logAuditAction(
            'SYS_ADMIN', // Placeholder for session user
            'System Admin',
            `CMD_${type}`,
            sensorId,
            { type, payload },
            type === 'ISOLATE' ? 'CRITICAL' : 'WARN'
        );

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to queue command' }, { status: 500 });
    }
}
