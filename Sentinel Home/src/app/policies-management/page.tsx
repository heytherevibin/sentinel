'use client';
import { useState, useEffect } from 'react';
import { PolicyManager } from '@/components/PolicyManager';
import { PolicyStructureDiagram } from '@/components/PolicyStructureDiagram';
import { Navigation } from '@/components/Navigation';
import { PolicyRule } from '@/types';

export default function PoliciesManagementPage() {
    const [policies, setPolicies] = useState<PolicyRule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const res = await fetch('/api/policy');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPolicies(data);
            } else {
                setPolicies([]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full bg-transparent text-zinc-300 font-mono flex flex-col relative overflow-hidden">
            {/* Mesh Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('/grid.svg')] bg-[length:30px_30px]" />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex relative">
                {/* Left Column - Policy Engine */}
                <div className="w-1/2 p-8 flex flex-col min-w-0">
                    <div className="h-full flex flex-col">
                        <PolicyManager policies={policies} isLoading={loading} onUpdate={fetchPolicies} />
                    </div>
                </div>

                {/* Separator - Thin Fade Line */}
                <div className="w-px bg-gradient-to-b from-transparent via-zinc-800 to-transparent shrink-0"></div>

                {/* Right Column - Realtime Structure */}
                <div className="w-1/2 h-full min-w-0 bg-transparent">
                    <PolicyStructureDiagram policies={policies} />
                </div>
            </div>
        </div>
    );
}
