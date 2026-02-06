import { NextResponse } from 'next/server';
import { AnalyticsEngine } from '@/lib/analytics';

export async function POST(req) {
    const { sessionId, eventType, meta } = await req.json();
    if (!sessionId || !eventType) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const engine = AnalyticsEngine.getInstance();
    engine.logEvent(sessionId, { type: eventType, meta });

    return NextResponse.json({ status: 'ok' });
}
