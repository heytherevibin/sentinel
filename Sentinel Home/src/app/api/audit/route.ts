
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
    try {
        const logs = await db.getAuditLogs();
        return NextResponse.json(logs);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }
}
