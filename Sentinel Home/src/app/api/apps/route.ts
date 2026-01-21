
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
    try {
        const apps = await db.getApplications();
        return NextResponse.json(apps);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch application inventory' }, { status: 500 });
    }
}
