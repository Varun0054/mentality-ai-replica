"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulsing-dot"></span>
              System Operational
            </div>
            <h1 className="hero-title">
              Understand Your Mentality
              <br />
              <span className="text-gradient">Through AI Intelligence</span>
            </h1>
            <p className="hero-subtitle">
              Advanced analysis of cognitive load, stress patterns, and decision behavior.
              <br />
              Real-time insights for peak mental performance.
            </p>
            <div className="hero-actions">
              <Link href="/chat">
                <button className="btn-primary">Start Analysis</button>
              </Link>
              <Link href="/visualize">
                <button className="btn-secondary">View Demo</button>
              </Link>
            </div>
          </div>

          {/* Dashboard Preview / Visual Element */}
          <div className="hero-visual">
            <div className="glass-panel status-card">
              <div className="card-header">
                <h3>Live Cognitive Load</h3>
                <span className="mono text-accent">98.2%</span>
              </div>
              <div className="wave-graph">
                {/* CSS Generated Wave */}
                <div className="wave-bar" style={{ height: '40%' }}></div>
                <div className="wave-bar" style={{ height: '70%' }}></div>
                <div className="wave-bar" style={{ height: '50%' }}></div>
                <div className="wave-bar" style={{ height: '80%' }}></div>
                <div className="wave-bar" style={{ height: '60%' }}></div>
                <div className="wave-bar" style={{ height: '90%' }}></div>
                <div className="wave-bar" style={{ height: '45%' }}></div>
              </div>
              <div className="card-footer mono">
                Status: <span style={{ color: '#4ade80' }}>OPTIMAL</span>
              </div>
            </div>

            <div className="glass-panel insight-card">
              <div className="ai-icon">✦</div>
              <div>
                <h4 className="insight-title">AI Insight</h4>
                <p className="insight-text">
                  Focus patterns indicate a high flow state window between 10:00 AM and 11:30 AM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section container">
        <div className="features-grid">
          <Link href="/chat" className="glass-panel feature-card">
            <div className="feature-icon">💬</div>
            <h3>Intelligent Chat</h3>
            <p>Conversational analysis of your current mental state using neural language models.</p>
          </Link>

          <Link href="/visualize" className="glass-panel feature-card">
            <div className="feature-icon">📊</div>
            <h3>Visual Intelligence</h3>
            <p>Data-driven visualizations of your stress trends and cognitive capacity.</p>
          </Link>

          <Link href="/insights" className="glass-panel feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Behavioral Patterning</h3>
            <p>Track decision fatigue and optimize your workflow based on AI suggestions.</p>
          </Link>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
          padding-top: 4rem;
          background: radial-gradient(circle at 50% 0%, #1a202c 0%, var(--bg-dark) 60%);
        }

        .hero-section {
          padding-bottom: 6rem;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: var(--accent-indigo);
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 2rem;
          font-family: 'JetBrains Mono', monospace;
        }

        .pulsing-dot {
          width: 8px;
          height: 8px;
          background-color: var(--accent-indigo);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }

        .hero-title {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .hero-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
        }

        .hero-visual {
          position: relative;
        }

        .status-card {
          padding: 2rem;
          position: relative;
          z-index: 2;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .card-header h3 {
          font-size: 1rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .text-accent {
          color: var(--accent-cyan);
        }

        .wave-graph {
          display: flex;
          gap: 6px;
          align-items: flex-end;
          height: 60px;
          margin-bottom: 2rem;
        }

        .wave-bar {
          flex: 1;
          background: linear-gradient(to top, var(--accent-indigo), var(--accent-cyan));
          border-radius: 4px;
          opacity: 0.8;
          transition: height 0.3s ease;
        }

        .card-footer {
          font-size: 0.85rem;
          color: var(--text-secondary);
          border-top: 1px solid var(--glass-border);
          padding-top: 1rem;
        }

        .insight-card {
          position: absolute;
          bottom: -2rem;
          right: -2rem;
          width: 300px;
          padding: 1.25rem;
          display: flex;
          gap: 1rem;
          z-index: 3;
          background: rgba(22, 25, 30, 0.9);
        }

        .ai-icon {
          color: var(--accent-violet);
          font-size: 1.2rem;
        }

        .insight-title {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          color: white;
        }

        .insight-text {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          padding: 2rem;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, border-color 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-indigo);
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          color: white;
        }

        .feature-card p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.95rem;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-actions {
            justify-content: center;
          }

          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-visual {
            margin-top: 3rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </div>
  );
}
