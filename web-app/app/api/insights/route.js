import { NextResponse } from 'next/server';
import { AnalyticsEngine } from '@/lib/analytics';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const engine = AnalyticsEngine.getInstance();
    const insight = engine.generateInsights(sessionId);

    return NextResponse.json(insight);
}
