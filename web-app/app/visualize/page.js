"use client";
import { useState } from "react";
import Link from "next/link";

export default function Visualize() {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setImageUrl(null);

        try {
            const res = await fetch("/api/visualize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();

            if (data.error) {
                // Simplified error handling as requested
                const detail = data.details || data.error;
                alert(`Generation failed: ${detail}`);
            } else if (data.imageUrl) {
                setImageUrl(data.imageUrl);
            }
        } catch (error) {
            console.error("Generation error:", error);
            alert("Failed to generate image.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container" style={{ padding: "2rem 1rem" }}>
            <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#2D3748", margin: 0 }}>Visual Serenity</h3>
            </div>

            <div className="viz-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>

                {/* Column 1: Input */}
                <div className="viz-input-area" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "5px", color: "#374151", fontSize: "0.875rem" }}>Describe a peaceful scene...</label>
                        <div style={{ position: "relative" }}>
                            <textarea
                                className="input-field"
                                rows="2"
                                placeholder="A calm blue ocean at sunset"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    borderRadius: "8px",
                                    border: "1px solid #E2E8F0",
                                    resize: "none",
                                    minHeight: "42px"
                                }}
                            />
                        </div>
                    </div>

                    <button
                        className="btn"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        style={{
                            background: "#319795",
                            color: "white",
                            border: "none",
                            justifyContent: "center",
                            padding: "0.5rem 1rem",
                            fontSize: "1rem"
                        }}
                    >
                        {isGenerating ? "Generating..." : "Generate Visualization"}
                    </button>
                </div>

                {/* Column 2: Image Output */}
                <div className="viz-output">
                    <label style={{ display: "block", marginBottom: "5px", color: "#374151", fontSize: "0.875rem" }}>Generated Image</label>
                    <div style={{
                        minHeight: "300px",
                        background: "#FFFFFF",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #E2E8F0",
                        overflow: "hidden"
                    }}>
                        {isGenerating ? (
                            <div style={{ color: "#718096" }}>Generating...</div>
                        ) : imageUrl ? (
                            <img src={imageUrl} alt="Generated visualization" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <div style={{ color: "#CBD5E0", fontSize: "2rem" }}>🖼️</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="footer">
                Use via API · Built with Next.js · <Link href="/settings">Settings</Link>
            </div>
        </div>
    );
}
