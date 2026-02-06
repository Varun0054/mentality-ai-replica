"use client";
export default function Insights() {
    return (
        <div className="container" style={{ paddingTop: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Behavioral Insights</h1>
            <p className="text-secondary" style={{ marginBottom: '3rem', maxWidth: '600px' }}>
                Deep learning analysis of your interaction patterns, decision velocity, and cognitive load trends over time.
            </p>

            <div className="insights-grid">
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div className="insight-header">
                        <span className="insight-icon">🧠</span>
                        <h3>Cognitive Peak</h3>
                    </div>
                    <p className="text-secondary">Your optimal focus window is between <strong className="text-white">09:00 AM</strong> and <strong className="text-white">11:30 AM</strong>.</p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div className="insight-header">
                        <span className="insight-icon">📉</span>
                        <h3>Decision Fatigue</h3>
                    </div>
                    <p className="text-secondary">Decision quality tends to decrease by <strong className="text-white">15%</strong> after 4 hours of continuous activity.</p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div className="insight-header">
                        <span className="insight-icon">🌊</span>
                        <h3>Stress Resilience</h3>
                    </div>
                    <p className="text-secondary">Your recovery rate post-stress events has improved by <strong className="text-white">12%</strong> this week.</p>
                </div>
            </div>

            <div className="glass-panel" style={{ marginTop: '2rem', padding: '3rem', textAlign: 'center' }}>
                <h3>Advanced Report Generation</h3>
                <p className="text-secondary" style={{ margin: '1rem 0 2rem' }}>
                    Generate a detailed PDF report of your mental biomarkers for your healthcare provider.
                </p>
                <button className="btn-secondary">Download PDF Report</button>
            </div>

            <style jsx>{`
                .insights-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                .insight-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .insight-icon {
                    font-size: 1.5rem;
                }
                .text-secondary {
                    color: var(--text-secondary);
                    line-height: 1.6;
                }
                .text-white {
                    color: white;
                }
            `}</style>
        </div>
    );
}
