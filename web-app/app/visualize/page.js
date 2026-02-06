"use client";
import { useState, useEffect, useCallback } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Visualization() {
    const { sessionId } = useAnalytics();
    const [activeTab, setActiveTab] = useState("analytics");
    const [metrics, setMetrics] = useState(null);
    const [insight, setInsight] = useState(null);

    // Generative State
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    const fetchMetrics = useCallback(async () => {
        if (!sessionId) return;
        try {
            const [mRes, iRes] = await Promise.all([
                fetch(`/api/metrics?sessionId=${sessionId}`),
                fetch(`/api/insights?sessionId=${sessionId}`)
            ]);

            if (mRes.ok) setMetrics(await mRes.json());
            if (iRes.ok) setInsight(await iRes.json());
        } catch (e) {
            console.error("Metrics fetch failed", e);
        }
    }, [sessionId]);

    useEffect(() => {
        const interval = setInterval(fetchMetrics, 1000);
        return () => clearInterval(interval);
    }, [fetchMetrics]);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setImageUrl(null);

        // Simulate API call for now or use real one
        setTimeout(() => {
            setIsGenerating(false);
            setImageUrl("https://example.com/placeholder-generated-image.jpg"); // Placeholder for now
        }, 2000);
    };

    // Helper to render trend line
    const renderTrendLine = (history) => {
        if (!history || history.length < 2) return "";
        const points = history.map((h, i) => {
            const x = (i / (history.length - 1)) * 100;
            const y = 30 - (h.value / 100) * 30; // Scale to fit SVG height 30
            return `${x},${y}`;
        });
        return `M${points[0]} L${points.slice(1).join(" ")}`;
    };

    return (
        <div className="container viz-page">
            <header className="page-header">
                <div>
                    <h1 className="title-gradient">Visual Intelligence</h1>
                    <p className="subtitle">Real-time analysis of cognitive bio-markers and decision patterns.</p>
                </div>
                <div className="tab-control">
                    <button
                        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        Analytics
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'generative' ? 'active' : ''}`}
                        onClick={() => setActiveTab('generative')}
                    >
                        Generative
                    </button>
                </div>
            </header>

            {activeTab === 'analytics' ? (
                <div className="dashboard-grid">
                    {/* Cognitive Load Meter */}
                    <div className="glass-panel metric-card huge">
                        <div className="card-header">
                            <h3>Cognitive Load</h3>
                            <div className="header-actions">
                                <button className="icon-btn" title="Explainable AI" onClick={() => alert("Cognitive Load is calculated via interaction frequency (clicks/typing), response latency, and idle time.")}>ⓘ Explain</button>
                                <span className={`mono status-val ${metrics?.status === 'OPTIMAL' ? 'status-ok' : metrics?.status === 'HIGH' ? 'status-warn' : ''}`}>
                                    {metrics?.status || 'CALIBRATING'}
                                </span>
                            </div>
                        </div>
                        <div className="circle-chart-container">
                            <svg viewBox="0 0 100 100" className="circle-chart">
                                <circle className="circle-bg" cx="50" cy="50" r="45"></circle>
                                <circle
                                    className="circle-progress"
                                    cx="50" cy="50" r="45"
                                    style={{
                                        strokeDasharray: `${(metrics?.cognitiveLoad || 0) * 2.83} 283`,
                                        stroke: metrics?.cognitiveLoad > 70 ? '#ef4444' : 'var(--accent-cyan)'
                                    }}
                                ></circle>
                            </svg>
                            <div className="circle-value">
                                <span className="value">{metrics?.cognitiveLoad || 0}</span>
                                <span className="unit">%</span>
                            </div>
                        </div>
                        <div className="metric-footer">
                            <details className="data-source">
                                <summary>Data Sources</summary>
                                <p>Interaction rate · Response delay · Session duration</p>
                            </details>
                        </div>
                    </div>

                    {/* Stress Trends Graph */}
                    <div className="glass-panel metric-card wide">
                        <div className="card-header">
                            <h3>Stress Trends (Live)</h3>
                            <div className="graph-controls">
                                <div className="legend">
                                    <span className="dot" style={{ background: 'var(--accent-indigo)' }}></span> Load History
                                </div>
                            </div>
                        </div>
                        <div className="graph-container">
                            <div className="graph-lines">
                                <svg preserveAspectRatio="none" viewBox="0 0 100 30" className="line-chart">
                                    {metrics?.stressTrends && (
                                        <path
                                            d={renderTrendLine(metrics.stressTrends)}
                                            fill="none"
                                            stroke="var(--accent-indigo)"
                                            strokeWidth="1"
                                        />
                                    )}
                                    {/* Anomaly Marker */}
                                    {metrics?.anomaly && (
                                        <circle cx="98" cy="15" r="2" fill="#ef4444" className="anomaly-dot">
                                            <title>⚠ {metrics.anomaly}</title>
                                        </circle>
                                    )}
                                </svg>
                            </div>
                            <div className="graph-grid">
                                <div></div><div></div><div></div><div></div>
                            </div>
                        </div>
                    </div>

                    {/* AI Insight Card */}
                    <div className="glass-panel metric-card highlight-card">
                        <div className="card-header">
                            <h3 style={{ color: 'var(--accent-cyan)' }}>✦ AI Insight</h3>
                        </div>
                        <div className="insight-content">
                            <p className="insight-text">
                                "{insight?.text || "Analyzing behavioral patterns..."}"
                            </p>
                            {insight?.factors && (
                                <ul className="text-xs" style={{ marginTop: '0.5rem', listStyle: 'disc', paddingLeft: '1rem', opacity: 0.8 }}>
                                    {insight.factors.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            )}
                        </div>
                        <div className="metric-footer">
                            <span className="mono text-xs">CONFIDENCE: {insight?.confidence || '...'}</span>
                        </div>
                    </div>

                    {/* Decision Fatigue Heatmap */}
                    <div className="glass-panel metric-card">
                        <div className="card-header">
                            <h3>Decision Velocity</h3>
                        </div>
                        <div className="heatmap-grid" style={{
                            display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', height: '100px'
                        }}>
                            {/* Simulated heatmap based on load intensity */}
                            {[...Array(24)].map((_, i) => (
                                <div
                                    key={i}
                                    className="heatmap-cell"
                                    style={{
                                        opacity: Math.random() * (metrics?.cognitiveLoad / 100 || 0.5) + 0.1,
                                        background: 'var(--accent-indigo)',
                                        borderRadius: '2px'
                                    }}
                                ></div>
                            ))}
                        </div>
                        <div className="metric-footer">
                            <span className="mono text-sm">PEAK: {metrics?.decisionVelocity?.peakTime || 'Calculating...'}</span>
                        </div>
                    </div>

                    {/* Focus Shield */}
                    <div className="glass-panel metric-card">
                        <div className="card-header">
                            <h3>Focus Shield</h3>
                            <button className={`toggle-btn ${metrics?.focusShield ? 'active' : ''}`}></button>
                        </div>
                        <div className="shield-visual">
                            <div
                                className="shield-ring"
                                style={{ boxShadow: metrics?.focusShield ? '0 0 20px var(--accent-indigo)' : 'none' }}
                            ></div>
                            <div className="shield-core"></div>
                        </div>
                        <div className="metric-footer text-center">
                            {metrics?.focusReason || "Monitoring distractions..."}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="generative-view glass-panel">
                    <div className="viz-input-area" style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "5px", color: "#94a3b8", fontSize: "0.875rem" }}>Describe a peaceful scene...</label>
                            <textarea
                                className="input-field"
                                rows="2"
                                placeholder="A calm blue ocean at sunset"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    borderRadius: "8px",
                                    background: "rgba(0,0,0,0.2)",
                                    border: "1px solid var(--glass-border)",
                                    color: "white",
                                    resize: "none",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            style={{ width: '100%' }}
                        >
                            {isGenerating ? "Generating..." : "Generate Visualization"}
                        </button>
                    </div>

                    <div className="viz-output" style={{ marginTop: '2rem', width: '100%', maxWidth: '600px' }}>
                        <div style={{
                            minHeight: "300px",
                            background: "rgba(0,0,0,0.2)",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid var(--glass-border)",
                            overflow: "hidden",
                            position: 'relative'
                        }}>
                            {isGenerating ? (
                                <div style={{ color: "#94a3b8" }}>Creating Serenity...</div>
                            ) : imageUrl ? (
                                <img src={imageUrl} alt="Generated visualization" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <div style={{ color: "#475569", fontSize: "2rem" }}>🖼️</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .viz-page {
                    padding-top: 2rem;
                    padding-bottom: 4rem;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 3rem;
                }

                .page-title {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }

                .page-subtitle {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                }

                .tab-switcher {
                    display: flex;
                    padding: 4px;
                    gap: 4px;
                }

                .tab-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .tab-btn.active {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: auto auto;
                    gap: 1.5rem;
                }

                .metric-card {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                }

                .metric-card.wide {
                    grid-column: span 2;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .card-header h3 {
                    font-size: 1rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }

                .legend {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                }

                .dot {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-right: 6px;
                }

                .toggle-btn {
                    width: 48px;
                    height: 24px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    border: none;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .toggle-btn.active {
                    background: var(--accent-indigo);
                }

                .toggle-btn::after {
                    content: '';
                    position: absolute;
                    left: 2px;
                    top: 2px;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    transition: all 0.3s;
                }

                .toggle-btn.active::after {
                    left: 26px;
                }

                .status-ok {
                    color: #4ade80;
                    font-size: 0.8rem;
                }

                .circle-chart-container {
                    position: relative;
                    width: 160px;
                    height: 160px;
                    margin: 0 auto 1.5rem;
                }

                .circle-chart {
                    transform: rotate(-90deg);
                    width: 100%;
                    height: 100%;
                }

                .circle-bg {
                    fill: none;
                    stroke: rgba(255,255,255,0.05);
                    stroke-width: 8;
                }

                .circle-progress {
                    fill: none;
                    stroke: var(--accent-cyan);
                    stroke-width: 8;
                    stroke-dasharray: 283;
                    stroke-dashoffset: 160; /* 42% approx */
                    transition: stroke-dashoffset 1s ease;
                }

                .circle-value {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }

                .circle-value .value {
                    font-size: 2.5rem;
                    font-weight: 700;
                    display: block;
                    line-height: 1;
                }

                .circle-value .unit {
                    font-size: 1rem;
                    color: var(--text-secondary);
                }

                .metric-footer {
                    margin-top: auto;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    line-height: 1.5;
                }

                .graph-container {
                    flex: 1;
                    position: relative;
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    overflow: hidden;
                    min-height: 200px;
                }

                .line-chart {
                    width: 100%;
                    height: 100%;
                }

                .heatmap-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 4px;
                    margin-bottom: 1rem;
                }

                .heatmap-cell {
                    aspect-ratio: 1;
                    border-radius: 4px;
                }

                .shield-visual {
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                .shield-ring {
                    width: 80px;
                    height: 80px;
                    border: 2px solid var(--accent-indigo);
                    border-radius: 50%;
                    animation: pulse-shield 3s infinite;
                }

                .shield-core {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    background: var(--accent-indigo);
                    border-radius: 50%;
                    box-shadow: 0 0 20px var(--accent-indigo);
                }

                @keyframes pulse-shield {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0; }
                    100% { transform: scale(1); opacity: 0; }
                }

                .generative-view {
                    padding: 4rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .header-actions { display: flex; align-items: center; gap: 0.5rem; }
                .icon-btn { background: none; border: none; color: var(--accent-cyan); font-size: 0.8rem; cursor: pointer; opacity: 0.8; }
                .icon-btn:hover { opacity: 1; text-decoration: underline; }
                .data-source { font-size: 0.75rem; color: var(--text-secondary); cursor: pointer; }
                .data-source summary { list-style: none; margin-bottom: 0.25rem; font-weight: 500; }
                .data-source p { margin: 0; padding-left: 0.5rem; border-left: 2px solid var(--accent-indigo); }
                .graph-controls { display: flex; gap: 1rem; align-items: center; }
                .toggle-group { display: flex; gap: 2px; background: rgba(0,0,0,0.3); padding: 2px; border-radius: 4px; }
                .sm-toggle { background: transparent; border: none; color: var(--text-secondary); font-size: 0.7rem; padding: 2px 8px; border-radius: 2px; cursor: pointer; }
                .sm-toggle.active { background: rgba(255,255,255,0.1); color: white; }
                .anomaly-dot { animation: pulse-red 2s infinite; cursor: help; }
                @keyframes pulse-red { 0% { fill: #ef4444; opacity: 1; r: 1.5; } 50% { fill: #fca5a5; opacity: 0.5; r: 3; } 100% { fill: #ef4444; opacity: 1; r: 1.5; } }
                .highlight-card { border: 1px solid rgba(6, 182, 212, 0.3); background: linear-gradient(145deg, rgba(6, 182, 212, 0.05) 0%, rgba(0,0,0,0) 100%); }
                .insight-text { font-size: 1.1rem; line-height: 1.5; color: white; font-style: italic; }
                .text-xs { font-size: 0.7rem; opacity: 0.7; }

                @media (max-width: 1024px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                    .metric-card.wide {
                        grid-column: span 1;
                    }
                }
            `}</style>
        </div>
    );
}
