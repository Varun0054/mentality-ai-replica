import { NextResponse } from 'next/server';
import { AnalyticsEngine } from '@/lib/analytics';

export async function POST(req) {
    const { sessionId } = await req.json();
    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const engine = AnalyticsEngine.getInstance();
    const result = engine.startSession(sessionId);

    return NextResponse.json(result);
}
