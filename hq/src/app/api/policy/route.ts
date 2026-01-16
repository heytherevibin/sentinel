
import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
    try {
        const policies = db.getPolicies();
        return NextResponse.json(policies);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const policies = await req.json();
        db.updatePolicies(policies);
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update policies' }, { status: 500 });
    }
}
