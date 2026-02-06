"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    // New States for Switches
    const [isLangflow, setIsLangflow] = useState(false);
    const [useVoiceOutput, setUseVoiceOutput] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const baseUrl = localStorage.getItem("langflow_base_url");
        const apiKey = localStorage.getItem("langflow_api_key");
        const savedMode = localStorage.getItem("app_mode");

        if (savedMode === "langflow") setIsLangflow(true);
        else setIsLangflow(false);

        setConfig({ baseUrl, apiKey });

        const savedMessages = localStorage.getItem("chat_history");
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                setMessages([{ role: "assistant", content: "System initialized. Ready for analysis." }]);
            }
        } else {
            setMessages([{ role: "assistant", content: "System initialized. Ready for analysis." }]);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("chat_history", JSON.stringify(messages));
        }
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const newMessages = [...messages, { role: "user", content: text }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            let data;
            if (isLangflow) {
                const res = await fetch("/api/langflow", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: text,
                        flowId: localStorage.getItem("langflow_flow_id"),
                        apiKey: localStorage.getItem("langflow_api_key"),
                    }),
                });
                data = await res.json();
            } else {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: text,
                        baseUrl: config?.baseUrl,
                        apiKey: config?.apiKey,
                    }),
                });
                data = await res.json();
            }

            if (data.error) {
                const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
                setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${errorMsg}` }]);
            } else {
                const botResponse = data.message;
                setMessages((prev) => [...prev, { role: "assistant", content: botResponse }]);
                if (useVoiceOutput) speak(botResponse);
            }
        } catch (err) {
            console.error("Chat Error:", err);
            setMessages((prev) => [...prev, { role: "assistant", content: "Connection interrupted. Retrying..." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const speak = (text) => {
        if ("speechSynthesis" in window) {
            const cleanText = text.replace(/[*#_`]/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition not supported in this browser environment.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = () => setIsRecording(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            handleSend(transcript);
        };

        recognition.start();
    };

    const clearChat = () => {
        if (confirm("Purge local analysis history?")) {
            localStorage.removeItem("chat_history");
            setMessages([{ role: "assistant", content: "History purged. System ready." }]);
        }
    };

    return (
        <div className="chat-layout container">
            {/* Sidebar Panel */}
            <aside className="chat-sidebar glass-panel">
                <div className="sidebar-header">
                    <h3>Analysis Log</h3>
                    <button onClick={clearChat} className="icon-btn" title="Clear History">↺</button>
                </div>
                <div className="history-list">
                    <div className="history-item active">
                        <span className="status-dot"></span>
                        <div className="history-text">Current Session</div>
                        <div className="history-time">Now</div>
                    </div>
                    {/* Placeholder for future sessions */}
                </div>

                <div className="sidebar-settings">
                    <label className="setting-toggle">
                        <input
                            type="checkbox"
                            checked={useVoiceOutput}
                            onChange={(e) => setUseVoiceOutput(e.target.checked)}
                        />
                        <span>Voice Synthesis</span>
                    </label>
                    <div className="system-status">
                        Mode: <span className="mono">{isLangflow ? 'LANGFLOW' : 'EXTERNAL API'}</span>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="chat-main glass-panel">
                {/* 1. Top Bar Inside Chat Panel */}
                <div className="chat-header">
                    <div className="header-left">
                        <span className="header-title">Cognitive Interface</span>
                        <span className="header-meta">Session: Active • Real-time Analysis Enabled</span>
                    </div>
                    <div className="header-right">
                        <span className="pulse-dot"></span>
                        <button className="icon-btn" title="System Status">ⓘ System Status</button>
                    </div>
                </div>

                <div className="messages-container">
                    {messages.map((msg, i) => (
                        <div key={i} className={`message-row ${msg.role}`}>
                            <div className="message-content glass-card">
                                {/* 2. Replace Labels */}
                                <div className="message-role mono">
                                    {msg.role === 'assistant' ? 'SYSTEM ANALYSIS' : 'INPUT STREAM'}
                                </div>
                                <div className="markdown-body">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                                {/* 4. Inline Metric Chips (AI Only) */}
                                {msg.role === 'assistant' && (
                                    <div className="metric-chips">
                                        <span className="chip">Cognitive Load <span className="val">42%</span></span>
                                        <span className="chip">Focus <span className="val good">Stable</span></span>
                                        <span className="chip">Confidence <span className="val high">High</span></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message-row assistant">
                            <div className="message-content glass-card">
                                <div className="message-role mono">SYSTEM ANALYSIS</div>
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="input-area">
                    <div className="input-wrapper">
                        <button
                            className={`mic-btn ${isRecording ? 'recording' : ''}`}
                            onClick={toggleRecording}
                            title="Toggle Voice Input"
                        >
                            {isRecording ? 'stop' : 'mic'}
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Input command or query..."
                            className="chat-input"
                        />
                        <button className="send-btn" onClick={() => handleSend()}>
                            ➞
                        </button>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .chat-layout {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 1.5rem;
                    height: calc(100vh - 100px);
                    padding-bottom: 1.5rem;
                    padding-top: 2rem;
                }

                .chat-sidebar {
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                }

                .sidebar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--glass-border);
                }

                .history-item {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    background: rgba(255,255,255,0.03);
                    border-radius: 8px;
                    border: 1px solid var(--glass-border);
                    cursor: pointer;
                }

                .history-item.active {
                    background: rgba(99, 102, 241, 0.1);
                    border-color: var(--accent-indigo);
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--accent-cyan);
                    border-radius: 50%;
                    margin-right: 12px;
                }

                .history-text {
                    flex: 1;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .history-time {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }

                .sidebar-settings {
                    margin-top: auto;
                    padding-top: 1.5rem;
                    border-top: 1px solid var(--glass-border);
                }

                .setting-toggle {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    cursor: pointer;
                    margin-bottom: 1rem;
                }

                .system-status {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }

                .chat-main {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: relative;
                }

                /* Header Styles */
                .chat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 2rem;
                    border-bottom: 1px solid var(--glass-border);
                    background: rgba(0,0,0,0.2);
                }
                .header-title {
                    font-weight: 600;
                    margin-right: 1rem;
                    color: white;
                }
                .header-meta {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    font-family: 'JetBrains Mono', monospace;
                }
                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    background: #4ade80;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #4ade80;
                    animation: pulse-green 2s infinite;
                }

                .messages-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .message-row {
                    display: flex;
                    width: 100%;
                }
                
                .message-row.user {
                    justify-content: flex-end;
                }

                /* 3. Message Containers */
                .message-content {
                    max-width: 75%;
                    padding: 1.25rem;
                    border-radius: 12px;
                    position: relative;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    backdrop-filter: blur(10px);
                }

                .message-row.assistant .message-content {
                    border-left: 3px solid var(--accent-cyan);
                    background: linear-gradient(90deg, rgba(6, 182, 212, 0.05) 0%, rgba(0,0,0,0) 100%);
                }

                .message-row.user .message-content {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: right;
                }

                .message-role {
                    font-size: 0.65rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.75rem;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    display: block;
                }

                .message-row.user .message-role {
                    text-align: right;
                    color: var(--accent-indigo);
                }

                .markdown-body {
                    line-height: 1.6;
                    font-size: 0.95rem;
                    color: rgba(255, 255, 255, 0.9);
                }

                /* 4. Inline Metric Chips */
                .metric-chips {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: 1rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                .chip {
                    font-size: 0.7rem;
                    color: var(--text-secondary);
                    font-family: 'JetBrains Mono', monospace;
                    background: rgba(0,0,0,0.2);
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                .val { color: white; margin-left: 4px; }
                .val.good { color: #4ade80; }
                .val.high { color: var(--accent-cyan); }

                .input-area {
                    padding: 1.5rem;
                    background: rgba(0,0,0,0.2);
                    border-top: 1px solid var(--glass-border);
                }

                .input-wrapper {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    background: var(--bg-dark);
                    padding: 0.5rem;
                    border-radius: 12px;
                    border: 1px solid var(--glass-border);
                    transition: border-color 0.2s;
                }

                .input-wrapper:focus-within {
                    border-color: var(--accent-indigo);
                }

                .chat-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: white;
                    padding: 0.5rem;
                    font-size: 1rem;
                    outline: none;
                    font-family: inherit;
                }

                .mic-btn, .send-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0.5rem;
                    font-family: 'JetBrains Mono', monospace;
                    transition: color 0.2s;
                }

                .mic-btn:hover, .send-btn:hover {
                    color: white;
                }

                .mic-btn.recording {
                    color: #ef4444;
                    animation: pulse-red 2s infinite;
                }

                .typing-indicator span {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    background: var(--accent-cyan);
                    border-radius: 50%;
                    margin-right: 4px;
                    animation: typing 1.4s infinite;
                }

                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typing {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }

                @keyframes pulse-red {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                @keyframes pulse-green {
                    0% { opacity: 1; box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
                    70% { opacity: 1; box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); }
                    100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
                }

                .icon-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    font-size: 0.85rem;
                }
            `}</style>
        </div>
    );
}
