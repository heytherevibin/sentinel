
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
    try {
        const gateways = await db.getGateways();
        return NextResponse.json(gateways);
    } catch (e: any) {
        return NextResponse.json({ error: 'Failed to fetch gateways' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { id, ...data } = await req.json();
        await db.updateGateway(id, data);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update gateway' }, { status: 500 });
    }
}
