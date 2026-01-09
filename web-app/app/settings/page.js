"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
    const router = useRouter();
    const [baseUrl, setBaseUrl] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // Load config from localStorage
        const savedUrl = localStorage.getItem("langflow_base_url");
        const savedKey = localStorage.getItem("langflow_api_key");
        if (savedUrl) setBaseUrl(savedUrl);
        if (savedKey) setApiKey(savedKey);
    }, []);

    const handleSave = () => {
        localStorage.setItem("langflow_base_url", baseUrl);
        localStorage.setItem("langflow_api_key", apiKey);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "0 1rem" }}>
            <div className="card">
                <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "var(--text-primary)" }}>Settings</h1>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                        Langflow Base URL
                    </label>
                    <input
                        type="text"
                        placeholder="http://localhost:7860/api/v1/run/..."
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                    />
                    <p style={{ fontSize: "0.875rem", color: "#718096", marginTop: "0.25rem" }}>
                        The full URL to your Langflow flow endpoint.
                    </p>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-secondary)" }}>
                        API Key (Optional)
                    </label>
                    <input
                        type="password"
                        placeholder="sk-..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <button className="btn-primary" onClick={handleSave}>
                        Save Configuration
                    </button>

                    {isSaved && (
                        <span style={{ color: "#48bb78", fontWeight: "600", animation: "fadeIn 0.3s" }}>
                            Saved successfully!
                        </span>
                    )}
                </div>

                <hr style={{ margin: "2rem 0", border: "0", borderTop: "1px solid #e2e8f0" }} />

                <div style={{ marginBottom: "1rem" }}>
                    <h2 style={{ fontSize: "1.25rem", color: "#e53e3e", marginBottom: "1rem" }}>Danger Zone</h2>
                    <button
                        onClick={() => {
                            if (confirm("Are you sure you want to clear the entire chat history?")) {
                                localStorage.removeItem("chat_history");
                                alert("Chat history cleared.");
                            }
                        }}
                        style={{
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            border: "1px solid #e53e3e",
                            background: "white",
                            color: "#e53e3e",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Clear Chat History
                    </button>
                </div>
            </div>
        </div>
    );
}
