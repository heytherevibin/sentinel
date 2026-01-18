
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
    const isConnected = await db.checkConnection();

    if (isConnected) {
        return NextResponse.json({
            status: 'HEALTHY',
            timestamp: new Date().toISOString(),
            db: 'CONNECTED'
        });
    }

    return NextResponse.json({
        status: 'DEGRADED',
        timestamp: new Date().toISOString(),
        db: 'DISCONNECTED'
    }, { status: 503 });
}
