# Mentality-AI

**Real-time Cognitive Bio-marker Analysis & Visualization Platform**

Mentality-AI is an advanced behavioral analytics interface designed to measure, analyze, and visualize cognitive load, stress trends, and decision-making patterns in real-time. Unlike static dashboards, this system is powered by a live, in-memory telemetry engine that derives insights directly from user interactions.

![Mentality-AI Dashboard](https://via.placeholder.com/800x450?text=Mentality-AI+Dashboard+Preview)

## 🚀 Key Features

### 1. Real-time Analytics Engine
A deterministic, session-based backend (`lib/analytics.js`) that computes biometrics without external sensors.
- **Cognitive Load Meter**: dynamically calculated based on interaction frequency, typing speed, and idle latency.
- **Stress Trends**: Rolling 24h window simulation detecting anomalies and variances.
- **Decision Velocity Heatmap**: Tracks response times to identify fatigue or flow states.

### 2. Cognitive Interface (Chat)
A reimagined chat experience focused on professional analysis.
- **Console Style**: "System Operational" status, glass-morphic message cards.
- **Inline Metrics**: Every AI response includes real-time confidence, load, and focus scores.
- **Voice-Enabled**: Full speech-to-text and text-to-speech integration.

### 3. Visual Intelligence Dashboard
- **Anomaly Detection**: Automatically flags irregular data points in trend graphs.
- **Explainable AI (XAI)**: "Explain" buttons expose the logic behind every calculated metric.
- **Focus Shield**: Automated distraction blocking triggered by high cognitive load states.

### 4. Generative Visualization
- Integrated AI image generation to visualize mental states (e.g., "Calm blue ocean").

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (React 19), styling with custom CSS variables & Glassmorphism.
- **Backend Service**: Node.js API Routes (Serverless-ready).
- **State Management**: React Hooks (`useAnalytics`) for global telemetry.
- **AI Integration**: OpenRouter SDK, Google Gemini (Generative models), Langflow (Agent orchestration).
- **Language**: JavaScript (ES6+).

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Varun0054/mentality-ai-replica.git
    cd mentality-ai-replica/web-app
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Set up environment variables (`.env.local`):
    ```env
    NEXT_PUBLIC_OPENROUTER_API_KEY=your_key_here
    NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 Usage Guide

- **Dashboard**: Watch metrics update live as you interact with the page.
- **Chat**: Speak or type to the AI; observe the "System Analysis" logs.
- **Visualization**: Switch to the "Generative" tab to create calm imagery.

## 🛡️ Privacy & Ethics

This system relies entirely on *behavioral telemetry* (mouse movements, keypresses, timing) and does not record personal biological data. All processing is done in-memory per session and is reset upon reload.

---
*Built for the Future of Mental Health Tech.*
