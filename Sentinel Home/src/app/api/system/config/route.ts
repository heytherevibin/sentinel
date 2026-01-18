
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
    try {
        const config = await db.getSystemConfig();
        return NextResponse.json(config);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { key, value } = await req.json();
        await db.updateSystemConfig(key, value);
        await db.addSystemLog('INFO', 'SYSTEM', `Configuration updated: ${key} = ${value}`);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
    }
}
