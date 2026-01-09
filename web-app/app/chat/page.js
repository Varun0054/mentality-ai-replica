"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
        // Load config
        const baseUrl = localStorage.getItem("langflow_base_url");
        const apiKey = localStorage.getItem("langflow_api_key");

        // Load Mode Preference
        const savedMode = localStorage.getItem("app_mode");
        if (savedMode === "langflow") {
            setIsLangflow(true);
        } else {
            setIsLangflow(false);
        }

        setConfig({ baseUrl, apiKey });

        // Load persisted messages
        const savedMessages = localStorage.getItem("chat_history");
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error("Failed to parse chat history", e);
                // Fallback to initial greeting
                setMessages([
                    { role: "assistant", content: "Hello! I am Mentality AI. How are you feeling today?" }
                ]);
            }
        } else {
            // Initial greeting
            setMessages([
                { role: "assistant", content: "Hello! I am Mentality AI. How are you feeling today?" }
            ]);
        }
    }, []);

    // Save messages whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("chat_history", JSON.stringify(messages));
        }
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        // Add User Message
        const newMessages = [...messages, { role: "user", content: text }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            let data;

            if (isLangflow) {
                // Langflow API Call
                const res = await fetch("/api/langflow", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: text,
                        // Pass stored keys if available, else API route uses env/defaults
                        flowId: localStorage.getItem("langflow_flow_id"),
                        apiKey: localStorage.getItem("langflow_api_key"),
                    }),
                });
                data = await res.json();
            } else {
                // Standard Online API Call (OpenRouter)
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

                // Voice Output Logic
                if (useVoiceOutput) {
                    speak(botResponse);
                }
            }
        } catch (err) {
            console.error("Chat Error:", err);
            setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please check your connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const speak = (text) => {
        if ("speechSynthesis" in window) {
            // Simple sanitization to remove markdown symbols for clearer speech
            const cleanText = text.replace(/[*#_`]/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            // Stop handled by logic below, or ideally by the API itself if we had access to the instance
            // Since we re-instantiate, we rely on 'onend' or just state reset.
            // For simplicity in this functional component without efficient ref management for 'recognition':
            setIsRecording(false);
            // Note: Actual 'stop' of the browser mic requires calling .stop() on the instance.
            // In this simplified version, we just reset UI state. 
            // In a robust app, we'd use a ref for the recognition instance.
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Browser does not support Speech Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = (event) => {
            console.error("Speech error", event.error);
            setIsRecording(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            handleSend(transcript); // Auto-send on voice end
        };

        recognition.start();
    };

    const clearChat = () => {
        if (confirm("Are you sure you want to clear the chat history?")) {
            localStorage.removeItem("chat_history");
            setMessages([{ role: "assistant", content: "Hello! I am Mentality AI. How are you feeling today?" }]);
        }
    };

    return (
        <div className="container" style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column", paddingBottom: "1rem" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem", minHeight: 0 }}>

                {/* Header Controls (Switches) */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem", color: "#4a5568" }}>
                            <input
                                type="checkbox"
                                checked={useVoiceOutput}
                                onChange={(e) => setUseVoiceOutput(e.target.checked)}
                                style={{ accentColor: "#319795" }}
                            />
                            Enable Voice Output
                        </label>
                    </div>
                    <button
                        onClick={clearChat}
                        title="Clear Conversation"
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", opacity: 0.6 }}
                    >
                        🗑️
                    </button>
                </div>

                {/* Chatbot Window */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                    <div id="chat-window" className="chat-window" style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "1rem",
                        background: "#ffffff",
                        borderRadius: "15px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                        marginBottom: "1rem"
                    }}>
                        <div className="message-list">
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                                    maxWidth: "80%",
                                    marginBottom: "0.5rem",
                                    display: "flex",
                                    gap: "0.5rem",
                                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                                    alignItems: "flex-end"
                                }}>
                                    <div className={`message-bubble ${msg.role === "user" ? "msg-user" : "msg-bot"}`} style={{
                                        background: msg.role === "user" ? "#E6FFFA" : "#F7FAFC",
                                        color: msg.role === "user" ? "#2C7A7B" : "#2D3748",
                                        border: msg.role === "user" ? "1px solid #B2F5EA" : "1px solid #EDF2F7",
                                        padding: "0.75rem 1rem",
                                        borderRadius: "15px",
                                    }}>
                                        <div style={{ whiteSpace: "normal" }}>
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => speak(msg.content)}
                                        title="Read Aloud"
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "1rem",
                                            padding: "2px",
                                            opacity: 0.5,
                                            marginBottom: "5px"
                                        }}
                                    >
                                        🔊
                                    </button>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                            {isLoading && <div style={{ color: "#718096", marginLeft: "1rem", fontStyle: "italic" }}>Mentality AI is thinking...</div>}
                        </div>
                    </div>
                </div>

                {/* Input Row */}
                <div style={{ display: "flex", gap: "10px", alignItems: "stretch", height: "60px" }}>
                    {/* Textbox - Scale 4 */}
                    <div style={{ flex: 4 }}>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                            placeholder={isLangflow ? "Ask Langflow..." : "Type your thoughts here..."}
                            style={{
                                width: "100%",
                                height: "100%",
                                padding: "1rem",
                                borderRadius: "8px",
                                border: "1px solid #E2E8F0",
                                resize: "none",
                                fontSize: "1rem",
                                display: "flex",
                                alignItems: "center",
                                outline: "none",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                            }}
                        />
                    </div>

                    {/* Voice Button - Scale 1 */}
                    <div style={{ flex: 1 }}>
                        <button
                            onClick={toggleRecording}
                            className="btn"
                            style={{
                                width: "100%",
                                height: "100%",
                                background: isRecording ? "#FED7D7" : "#FFFFFF",
                                color: isRecording ? "#C53030" : "#2D3748",
                                border: "1px solid #E2E8F0",
                                justifyContent: "center",
                                fontSize: "1rem",
                                fontWeight: "600",
                                cursor: "pointer",
                                borderRadius: "8px"
                            }}
                        >
                            {isRecording ? "⏹️ Stop" : "🎤 Speak"}
                        </button>
                    </div>

                    {/* Send Button - Scale 1 */}
                    <div style={{ flex: 1 }}>
                        <button
                            onClick={() => handleSend()}
                            className="btn"
                            style={{
                                width: "100%",
                                height: "100%",
                                background: "#319795", // Teal-500
                                color: "white",
                                border: "none",
                                justifyContent: "center",
                                fontSize: "1rem",
                                fontWeight: "600",
                                cursor: "pointer",
                                borderRadius: "8px"
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
