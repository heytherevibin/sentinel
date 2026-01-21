'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Stats {
    totalAgents: number;
    onlineAgents: number;
    threatsBlocked: number;
    totalEvents: number;
    activePolicies: number;
}

interface SentinelContextType {
    stats: Stats;
    uptime: string;
}

const SentinelContext = createContext<SentinelContextType | undefined>(undefined);

export function SentinelProvider({ children }: { children: ReactNode }) {
    const [stats, setStats] = useState<Stats>({
        totalAgents: 0,
        onlineAgents: 0,
        threatsBlocked: 0,
        totalEvents: 0,
        activePolicies: 0
    });
    const [uptime, setUptime] = useState("00:00:00");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/stats');
                if (!res.ok) throw new Error(`HTTP_${res.status}`);

                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Invalid content type');
                }

                const data = await res.json();
                if (data.stats) setStats(data.stats);
            } catch (e) {
                console.error('Stats fetch failed', e);
            }
        };

        fetchData();
        const statsInterval = setInterval(fetchData, 5000);

        const start = Date.now();
        const uptimeInterval = setInterval(() => {
            const diff = Date.now() - start;
            setUptime(new Date(diff).toISOString().substr(11, 8));
        }, 1000);

        return () => {
            clearInterval(statsInterval);
            clearInterval(uptimeInterval);
        };
    }, []);

    return (
        <SentinelContext.Provider value={{ stats, uptime }}>
            {children}
        </SentinelContext.Provider>
    );
}

export function useSentinel() {
    const context = useContext(SentinelContext);
    if (context === undefined) {
        throw new Error('useSentinel must be used within a SentinelProvider');
    }
    return context;
}
