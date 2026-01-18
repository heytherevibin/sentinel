export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
    const logs = await db.getSystemLogs();
    console.log(`[API_SYNC] Found ${logs.length} logs. Request Time: ${new Date().toLocaleTimeString()}`);
    // Auto-log the access to prove it's not cached
    await db.addSystemLog('DEBUG', 'POLL_SYNC', `Log buffer accessed. Record count: ${logs.length}`);
    return NextResponse.json(logs);
}
