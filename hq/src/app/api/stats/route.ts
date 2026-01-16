
import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
    try {
        const stats = db.getStats();
        const chart = db.getChartData();
        return NextResponse.json({ stats, chart });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
