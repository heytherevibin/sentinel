import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/store';

export async function POST(request: Request) {
    await db.addSystemLog('INFO', 'AUTH', 'Session terminated by user: ANALYST_01');
    // Delete the session cookie
    cookies().delete('sentinel_session');

    return NextResponse.json({ success: true });
}
