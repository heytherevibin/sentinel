
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
    try {
        await db.addSystemLog('DEBUG', 'API', 'GET /api/stats - 200 OK');

        // Seed initial apps if empty
        await db.seedInitialApps();

        const stats = await db.getStats();
        const chart = await db.getChartData();
        const apps = await db.getApplications();

        // Calculate App Discovery Metrics
        const sanctionedCount = apps.filter((a: any) => a.type === 'Sanctioned').length;
        const unsanctionedCount = apps.filter((a: any) => a.type === 'Unsanctioned').length;
        const avgCCI = apps.length > 0 ? Math.round(apps.reduce((acc: number, a: any) => acc + a.cci, 0) / apps.length) : 0;

        return NextResponse.json({
            stats,
            chart,
            discovery: {
                sanctionedCount,
                unsanctionedCount,
                avgCCI
            }
        });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
