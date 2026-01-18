import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/store';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { passkey } = body;

        // Hardcoded Passkey for Demo
        if (passkey === 'SENTINEL-ACCESS') {
            await db.addSystemLog('INFO', 'AUTH', `Session authenticated for user: ANALYST_01`);

            // Set Cookie
            cookies().set('sentinel_session', 'active', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid Access Code' }, { status: 401 });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
