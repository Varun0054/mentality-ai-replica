<div align="center">

# 🧠 Mentality-AI
### The Cognitive Interface for Real-Time Mental State Analytics

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-OPERATIONAL-success.svg?style=for-the-badge)
![Tech](https://img.shields.io/badge/tech-Next.js_16_|_React_19-black.svg?style=for-the-badge)

<p align="center">
  <img src="https://via.placeholder.com/1200x600/0f1115/6366f1?text=Mentality-AI+Dashboard+Preview" alt="Mentality-AI Dashboard" width="100%" />
</p>

[Live Demo](#) · [Report Bug](https://github.com/Varun0054/mentality-ai-replica/issues) · [Request Feature](https://github.com/Varun0054/mentality-ai-replica/issues)

</div>

---

## 📖 Introduction

**Mentality-AI** is not just a chatbot. It is a **Cognitive Bio-marker Analysis Platform** that uses deterministic behavioral telemetry to measure your mental state in real-time. 

By analyzing your interaction patterns—typing rhythm, decision latency, and task-switching frequency—it builds a live profile of your **Cognitive Load**, **Stress Levels**, and **Focus Stability**, all without needing wearable sensors.

---

## 🎮 Usability Guide: How to Use the System

### 1. The Cognitive Interface (Chat)
*Located at `/chat`*

This is your primary command center. Unlike standard chats, this interface treats every input as a data point.

-   **System Analysis Logs**: The left panel displays the raw "thought process" of the AI. Watch it to see how your inputs are being classified.
-   **Inline Metrics**: Every response from the AI comes with three real-time tags:
    -   `Cognitive Load`: Your estimated mental burden (0-100%).
    -   `Focus`: Your current attention stability.
    -   `Confidence`: The AI's certainty in its assessment.
-   **Voice Command**: Click the `Microphone` icon to speak. The system uses browser-native speech recognition for low-latency input.

### 2. Visual Intelligence Dashboard
*Located at `/visualize`*

The heart of the analytics engine. This page updates **every second** based on your session behavior.

| Metric | What It Means | How to Influence It |
| :--- | :--- | :--- |
| **Cognitive Load** | Efficiency of your mental processing. | **Rise:** Click rapidly/multitask. **Drop:** Pause or idle. |
| **Stress Trends** | 24-hour rolling window (simulated) of your load. | Sustained high activity causes spikes (red dots). |
| **Decision Velocity** | Heatmap of how fast you make choices. | Darker blocks = faster decisions. |
| **AI Insight** | Objective textual analysis of your patterns. | Change your behavior to see new insights generate. |

> **Pro Tip**: Click the **"ⓘ Explain"** button on any card to see the exact logic used to calculate that metric.

### 3. Focus Shield
*Located on the Dashboard*

When your **Cognitive Load exceeds 75%**, the **Focus Shield** automatically activates.
-   **Visual Indicator**: A pulsing indigo ring appears.
-   **Effect**: The interface reduces visual noise to help you regain composure.

---

## ⚡ Technical Quick Start

### Prerequisites
-   **Node.js 18+** is required.
-   **npm** or **yarn**.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Varun0054/mentality-ai-replica.git
    cd mentality-ai-replica/web-app
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the `web-app` directory:
    ```env
    NEXT_PUBLIC_OPENROUTER_API_KEY=your_key_here
    NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
    ```

4.  **Launch System**
    ```bash
    npm run dev
    ```
    Access the interface at `http://localhost:3000`.

---

## 🏗️ Architecture

The system operates on a **Session-Based In-Memory Architecture**.

-   **Frontend**: Next.js 16 (App Router) with React 19.
-   **Styling**: Custom CSS Variables + Glassmorphism (No Tailwind dependency).
-   **Backend Logic**: `lib/analytics.js` (Singleton Pattern).
-   **Telemetry**: `useAnalytics` Hook intercepts all user events globally.

### Data Privacy & Ethics
This system uses **Behavioral Telemetry** only.
-   ❌ No biological data is collected.
-   ❌ No camera/microphone data is stored.
-   ❌ No database persistence (Session resets on reload).

---

<div align="center">

**Built with 💙 for the Future of Mental Health Tech**

</div>
