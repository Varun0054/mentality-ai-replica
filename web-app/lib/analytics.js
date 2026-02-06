export class AnalyticsEngine {
    constructor() {
        // In-memory session store: Map<sessionId, sessionData>
        this.sessions = new Map();
    }

    // Singleton instance
    static getInstance() {
        if (!AnalyticsEngine.instance) {
            AnalyticsEngine.instance = new AnalyticsEngine();
        }
        return AnalyticsEngine.instance;
    }

    startSession(sessionId) {
        this.sessions.set(sessionId, {
            startTime: Date.now(),
            events: [],
            metrics: {
                cognitiveLoad: 0,
                stressHistory: [], // Array of { timestamp, value }
                decisionTimes: [], // Array of durationMs
                lastActivity: Date.now()
            },
            insights: []
        });
        return { status: 'started', sessionId };
    }

    logEvent(sessionId, event) {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        const now = Date.now();
        session.lastActivity = now;
        session.events.push({ ...event, timestamp: now });

        // Keep only last 100 events for memory safety
        if (session.events.length > 100) {
            session.events.shift();
        }

        this.updateMetrics(session);
        return { status: 'logged' };
    }

    updateMetrics(session) {
        const now = Date.now();
        const recentEvents = session.events.filter(e => now - e.timestamp < 60000); // Last 60s

        // 1. Calculate Interaction Frequency (events per min)
        const frequency = recentEvents.length;

        // 2. Calculate Response Latency (avg time between prompt/interaction)
        // Simplified: higher frequency = lower latency usually, but we can simulate readiness via frequency
        const latencyScore = Math.max(0, 100 - (frequency * 2));

        // 3. Cognitive Load Formula: (Frequency * 0.5) + (Latency * 0.3) + (InteractionDepth * 0.2)
        // Normalized roughly 0-100
        let load = Math.min(100, (frequency * 1.5) + (latencyScore * 0.1));

        // Idle penalty: If inactive for > 10s, load drops
        const idleTime = (now - session.lastActivity) / 1000;
        if (idleTime > 5) {
            load = Math.max(0, load - (idleTime * 0.5));
        }

        session.metrics.cognitiveLoad = Math.round(load);

        // Update History (every 5 seconds roughly, but here we push on significant change or just keep last 24 pts)
        const lastHistory = session.metrics.stressHistory[session.metrics.stressHistory.length - 1];
        if (!lastHistory || now - lastHistory.timestamp > 5000) {
            session.metrics.stressHistory.push({ timestamp: now, value: Math.round(load) });
            if (session.metrics.stressHistory.length > 50) session.metrics.stressHistory.shift();
        }
    }

    getMetrics(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        // Anomaly Detection
        const history = session.metrics.stressHistory.map(h => h.value);
        const avg = history.reduce((a, b) => a + b, 0) / (history.length || 1);
        const current = session.metrics.cognitiveLoad;
        const isAnomaly = Math.abs(current - avg) > 25 && history.length > 5;

        // Focus Shield Logic
        const focusShieldActive = current > 75;

        return {
            cognitiveLoad: current,
            status: current < 30 ? 'OPTIMAL' : current < 70 ? 'MODERATE' : 'HIGH',
            stressTrends: session.metrics.stressHistory,
            decisionVelocity: this.computeDecisionVelocity(session),
            anomaly: isAnomaly ? 'Detecting irregular interaction variance.' : null,
            focusShield: focusShieldActive,
            focusReason: focusShieldActive ? 'Sustained high cognitive load detected.' : 'System monitoring active.'
        };
    }

    computeDecisionVelocity(session) {
        // Mocking a heatmap distribution based on current load for demo
        // In a real scenario, this would aggregate actual decision latencies
        const load = session.metrics.cognitiveLoad;
        const peakHour = 10 + Math.floor(load / 20); // Shifts peak based on load
        return {
            peakTime: `${peakHour}:00 AM`,
            intensity: load / 100
        };
    }

    generateInsights(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) return "Insufficient data for analysis.";

        const load = session.metrics.cognitiveLoad;
        const events = session.events.length;

        if (events < 5) return { text: "Awaiting further interaction signals...", confidence: "Pending" };

        if (load > 80) {
            return {
                text: "Sustained cognitive overload detected. Decision quality may degrade.",
                confidence: "High",
                factors: ["High interaction frequency", "Rapid task switching"]
            };
        } else if (load > 40) {
            return {
                text: "Optimal engagement zone. User is processing information efficiently.",
                confidence: "Very High",
                factors: ["Stable rhythm", "Consistent response times"]
            };
        } else {
            return {
                text: "Low cognitive demand. Potential for boredom or distraction.",
                confidence: "Moderate",
                factors: ["Low interaction rate", "Extended idle periods"]
            };
        }
    }
}
