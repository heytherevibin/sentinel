'use client';
import { useState, useEffect } from 'react';
import { TechCard } from './TechCard';
import { Shield, ChevronRight } from 'lucide-react';
import { PolicyRule } from '@/types';
import Link from 'next/link';

export function PolicySummary() {
    const [policies, setPolicies] = useState<PolicyRule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const res = await fetch('/api/policy');
            const data = await res.json();
            setPolicies(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Category counts
    const categoryCounts = {
        credentials: policies.filter(p =>
            p.name.toLowerCase().includes('aws') ||
            p.name.toLowerCase().includes('api') ||
            p.name.toLowerCase().includes('key') ||
            p.name.toLowerCase().includes('token') ||
            p.name.toLowerCase().includes('jwt') ||
            p.name.toLowerCase().includes('secret')
        ).length,
        pii: policies.filter(p =>
            p.name.toLowerCase().includes('email') ||
            p.name.toLowerCase().includes('ssn') ||
            p.name.toLowerCase().includes('phone')
        ).length,
        sourceCode: policies.filter(p =>
            p.name.toLowerCase().includes('python') ||
            p.name.toLowerCase().includes('javascript') ||
            p.name.toLowerCase().includes('code')
        ).length,
    };

    const blockCount = policies.filter(p => p.action === 'BLOCK').length;
    const logCount = policies.filter(p => p.action === 'LOG_ONLY').length;

    return (
        <TechCard title="Active Policy Enforcement" status="normal" className="h-full flex flex-col">
            <div className="flex flex-col gap-4 flex-1">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-900/30 border border-zinc-800 p-3 rounded-sm">
                        <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Total Rules</div>
                        <div className="text-2xl font-bold text-emerald-500 font-mono">{policies.length}</div>
                    </div>
                    <div className="bg-zinc-900/30 border border-zinc-800 p-3 rounded-sm">
                        <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Enforcement</div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm font-bold text-rose-500 font-mono">{blockCount}</div>
                            <div className="text-[8px] text-zinc-700">/</div>
                            <div className="text-sm font-bold text-amber-500 font-mono">{logCount}</div>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="space-y-2">
                    <div className="text-[9px] text-zinc-600 uppercase tracking-widest mb-2">Category Coverage</div>

                    <div className="flex items-center justify-between py-2 border-b border-zinc-900">
                        <span className="text-[10px] text-zinc-400 font-mono">Credentials</span>
                        <span className="text-[10px] text-emerald-500 font-bold">{categoryCounts.credentials}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-zinc-900">
                        <span className="text-[10px] text-zinc-400 font-mono">PII</span>
                        <span className="text-[10px] text-emerald-500 font-bold">{categoryCounts.pii}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-zinc-900">
                        <span className="text-[10px] text-zinc-400 font-mono">Source Code</span>
                        <span className="text-[10px] text-emerald-500 font-bold">{categoryCounts.sourceCode}</span>
                    </div>
                </div>
            </div>
        </TechCard>
    );
}
