
import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
    try {
        const policies = await db.getPolicies();
        return NextResponse.json(policies);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await db.updatePolicies(body);
        await db.addSystemLog('INFO', 'POLICY_ENGINE', `Policy configuration updated. Total active rules: ${body.length}`);
        return NextResponse.json({ success: true });
    } catch (e) {
        await db.addSystemLog('ERROR', 'POLICY_ENGINE', 'Failed to update policy configuration');
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
