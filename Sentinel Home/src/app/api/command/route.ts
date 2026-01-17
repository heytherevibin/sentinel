
import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(req: Request) {
    try {
        const { sensorId, type, payload } = await req.json();
        db.queueCommand(sensorId, type, payload);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to queue command' }, { status: 500 });
    }
}
