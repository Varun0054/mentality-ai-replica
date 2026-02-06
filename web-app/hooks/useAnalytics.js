"use client";
import { createContext, useContext, useEffect, useState, useRef } from 'react';

const AnalyticsContext = createContext(null);

export function AnalyticsProvider({ children }) {
    const [sessionId, setSessionId] = useState(null);
    const lastEventTime = useRef(Date.now());

    // Initialize Session
    useEffect(() => {
        let sid = localStorage.getItem('analytics_session_id');
        if (!sid) {
            sid = 'sess_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('analytics_session_id', sid);
        }
        setSessionId(sid);

        // Start session on backend
        fetch('/api/session/start', {
            method: 'POST',
            body: JSON.stringify({ sessionId: sid })
        }).catch(err => console.error("Session start failed", err));
    }, []);

    // Log Global Interaction Events
    useEffect(() => {
        if (!sessionId) return;

        const log = (type, meta = {}) => {
            const now = Date.now();
            fetch('/api/event/log', {
                method: 'POST',
                body: JSON.stringify({
                    sessionId,
                    eventType: type,
                    timestamp: now,
                    meta
                })
            }).catch(() => { }); // Silent fail
            lastEventTime.current = now;
        };

        const handleClick = () => log('click');
        const handleKey = () => log('interaction');

        window.addEventListener('click', handleClick);
        window.addEventListener('keydown', handleKey);

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('keydown', handleKey);
        };
    }, [sessionId]);

    return (
        <AnalyticsContext.Provider value={{ sessionId }}>
            {children}
        </AnalyticsContext.Provider>
    );
}

export function useAnalytics() {
    return useContext(AnalyticsContext);
}
