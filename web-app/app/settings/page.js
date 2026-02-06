"use client";
import { useState, useEffect } from "react";

export default function Settings() {
    const [baseUrl, setBaseUrl] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [appMode, setAppMode] = useState("external"); // 'external' or 'langflow'
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedUrl = localStorage.getItem("langflow_base_url");
        const savedKey = localStorage.getItem("langflow_api_key");
        const savedMode = localStorage.getItem("app_mode");

        if (savedUrl) setBaseUrl(savedUrl);
        if (savedKey) setApiKey(savedKey);
        if (savedMode) setAppMode(savedMode);
    }, []);

    const handleSave = () => {
        localStorage.setItem("langflow_base_url", baseUrl);
        localStorage.setItem("langflow_api_key", apiKey);
        localStorage.setItem("app_mode", appMode);

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="container settings-page">
            <h1 className="page-title">System Configuration</h1>

            <div className="glass-panel settings-card">
                <h3 className="section-title">Analysis Engine</h3>
                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${appMode === 'external' ? 'active' : ''}`}
                        onClick={() => setAppMode('external')}
                    >
                        External AI (Cloud)
                    </button>
                    <button
                        className={`mode-btn ${appMode === 'langflow' ? 'active' : ''}`}
                        onClick={() => setAppMode('langflow')}
                    >
                        Langflow (Local)
                    </button>
                </div>
                <p className="help-text" style={{ marginBottom: '2rem' }}>
                    {appMode === 'external'
                        ? "Uses secure cloud processing for mental analysis."
                        : "Connects to your local Langflow instance for custom pipelines."}
                </p>

                {appMode === 'langflow' && (
                    <div className="langflow-config">
                        <div className="form-group">
                            <label>Langflow Endpoint</label>
                            <input
                                type="text"
                                placeholder="http://localhost:7860/api/v1/run/..."
                                value={baseUrl}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label>API Key (Encrypted)</label>
                            <input
                                type="password"
                                placeholder="sk-..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>
                )}

                <div className="actions">
                    <button className="btn-primary" onClick={handleSave}>
                        Update Configuration
                    </button>

                    {isSaved && (
                        <span className="success-msg">
                            ✓ System Updated
                        </span>
                    )}
                </div>
            </div>

            <div className="glass-panel danger-zone">
                <h3>Resets & Overrides</h3>
                <div className="danger-action">
                    <p>Purge all local session data permanently.</p>
                    <button
                        onClick={() => {
                            if (confirm("Confirm system purge? This cannot be undone.")) {
                                localStorage.removeItem("chat_history");
                                localStorage.removeItem("viz_history");
                                alert("System purged.");
                            }
                        }}
                        className="btn-danger"
                    >
                        Purge History
                    </button>
                </div>
            </div>

            <style jsx>{`
                .settings-page {
                    padding-top: 3rem;
                    max-width: 800px;
                }
                .page-title {
                    font-size: 2rem;
                    margin-bottom: 2rem;
                }
                .settings-card {
                    padding: 2rem;
                    margin-bottom: 2rem;
                }
                .section-title {
                    font-size: 1.1rem;
                    color: white;
                    margin-bottom: 1rem;
                }
                .mode-toggle {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .mode-btn {
                    flex: 1;
                    padding: 1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    color: var(--text-secondary);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 500;
                }
                .mode-btn.active {
                    background: rgba(99, 102, 241, 0.2); /* Indigo tint */
                    border-color: var(--accent-indigo);
                    color: white;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .input-field {
                    width: 100%;
                    padding: 0.8rem;
                    background: var(--bg-dark);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    color: white;
                    outline: none;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }
                .input-field:focus {
                    border-color: var(--accent-indigo);
                }
                .help-text {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    margin-top: 0.5rem;
                }
                .actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .success-msg {
                    color: #4ade80;
                    font-size: 0.9rem;
                    font-weight: 500;
                    animation: fade-in 0.3s;
                }
                .danger-zone {
                    padding: 2rem;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
                .danger-zone h3 {
                    color: #ef4444;
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                }
                .danger-action {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .danger-action p {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                .btn-danger {
                    background: transparent;
                    border: 1px solid #ef4444;
                    color: #ef4444;
                    padding: 0.6rem 1.2rem;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-danger:hover {
                    background: rgba(239, 68, 68, 0.1);
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
