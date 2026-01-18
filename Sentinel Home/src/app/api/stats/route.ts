
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
    try {
        await db.addSystemLog('DEBUG', 'API', 'GET /api/stats - 200 OK');
        const stats = await db.getStats();
        const chart = await db.getChartData();
        return NextResponse.json({ stats, chart });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
