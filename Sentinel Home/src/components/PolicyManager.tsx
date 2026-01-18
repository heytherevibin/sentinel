'use client';
import { useState } from 'react';
import Link from 'next/link';
import { TechCard } from './TechCard';
import { Plus, Trash2, ChevronDown, ChevronRight, BrainCircuit } from 'lucide-react';
import { PolicyRule } from '@/types';
import { Skeleton } from './Skeleton';

interface PolicyManagerProps {
    policies: PolicyRule[];
    isLoading?: boolean;
    onUpdate: () => void;
}

// DLP Category Classification
// DEPRECATED: Now using explicit policy.category

export function PolicyManager({ policies, isLoading = false, onUpdate }: PolicyManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newPolicy, setNewPolicy] = useState<Partial<PolicyRule>>({ name: '', pattern: '', action: 'BLOCK', category: 'General' });
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const handleSave = async () => {
        if (!newPolicy.name || !newPolicy.pattern) return;

        const updated = [
            ...policies,
            {
                id: Date.now().toString(),
                name: newPolicy.name,
                pattern: newPolicy.pattern,
                category: newPolicy.category || 'General',
                action: newPolicy.action as 'BLOCK' | 'LOG_ONLY',
                description: 'User Defined'
            }
        ];

        try {
            await fetch('/api/policy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            onUpdate();
            setNewPolicy({ name: '', pattern: '', action: 'BLOCK', category: 'General' });
            setIsAdding(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: string) => {
        const updated = policies.filter(p => p.id !== id);
        try {
            await fetch('/api/policy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            onUpdate();
        } catch (e) {
            console.error(e);
        }
    };

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    // Group policies by category
    const groupedPolicies = policies.reduce((acc, policy) => {
        const category = policy.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(policy);
        return acc;
    }, {} as Record<string, PolicyRule[]>);

    const sortedCategories = Object.keys(groupedPolicies).sort();

    return (
        <TechCard title="Policy Management Engine" className="flex-1 min-h-0 flex flex-col"
            toolbar={
                <div className="flex gap-2">
                    <Link href="/policies" className="p-1.5 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/50 rounded-sm text-emerald-500 transition-all" title="Open Neural Policy Core">
                        <BrainCircuit size={14} />
                    </Link>
                    <button onClick={() => setIsAdding(!isAdding)} className="p-1.5 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 rounded-sm text-zinc-400 hover:text-white transition-all" title="Manual Add">
                        <Plus size={14} />
                    </button>
                </div>
            }>

            <div className="overflow-y-auto flex-1 min-h-0 p-3 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {isAdding && (
                    <div className="mb-4 p-3 bg-zinc-900/50 border border-emerald-500/30 rounded-sm">
                        <div className="space-y-2">
                            <input
                                placeholder="POLICY_NAME"
                                className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-zinc-300 focus:border-emerald-500 outline-none rounded-sm"
                                value={newPolicy.name} onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value.toUpperCase() })}
                            />
                            <input
                                placeholder="REGEX_PATTERN (e.g. \bSECRET\b)"
                                className="w-full bg-black border border-zinc-800 px-3 py-2 text-xs text-zinc-300 focus:border-emerald-500 outline-none font-mono rounded-sm"
                                value={newPolicy.pattern} onChange={e => setNewPolicy({ ...newPolicy, pattern: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <select
                                    className="bg-black border border-zinc-800 px-3 py-2 text-xs text-zinc-300 outline-none rounded-sm"
                                    value={newPolicy.action} onChange={e => setNewPolicy({ ...newPolicy, action: e.target.value as any })}
                                >
                                    <option value="BLOCK">BLOCK</option>
                                    <option value="LOG_ONLY">LOG ONLY</option>
                                </select>
                                <button onClick={handleSave} className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-bold border border-emerald-500/50 rounded-sm py-2">
                                    SAVE RULE
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="border border-zinc-900 rounded-sm overflow-hidden">
                                <div className="px-3 py-2 bg-zinc-900/20 flex justify-between items-center">
                                    <div className="flex gap-2 items-center"><Skeleton width={15} height={15} /><Skeleton width={80} height={10} /></div>
                                    <Skeleton width={20} height={10} />
                                </div>
                                <div className="p-3 space-y-2">
                                    <div className="flex justify-between">
                                        <Skeleton width={100} height={10} />
                                        <Skeleton width={40} height={10} />
                                    </div>
                                    <Skeleton width="80%" height={8} />
                                </div>
                            </div>
                        ))
                    ) : (
                        sortedCategories.map(category => {
                            const isExpanded = expandedCategories.has(category);
                            const categoryPolicies = groupedPolicies[category];

                            return (
                                <div key={category} className="border border-zinc-800 rounded-sm overflow-hidden">
                                    {/* Category Header */}
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className="w-full flex items-center justify-between px-3 py-2 bg-zinc-900/50 hover:bg-zinc-900/70 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {isExpanded ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">{category}</span>
                                        </div>
                                        <span className="text-[9px] px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded-sm font-mono">
                                            {categoryPolicies.length}
                                        </span>
                                    </button>

                                    {/* Category Policies */}
                                    {isExpanded && (
                                        <div className="bg-black/30">
                                            {categoryPolicies.map((policy, idx) => (
                                                <div
                                                    key={policy.id}
                                                    className={`group flex justify-between items-center px-3 py-2 hover:bg-zinc-900/30 transition-colors ${idx !== categoryPolicies.length - 1 ? 'border-b border-zinc-900' : ''}`}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-[10px] text-zinc-300 tracking-wide">{policy.name}</span>
                                                            <span className={`text-[8px] px-1.5 py-0.5 rounded-sm font-mono ${policy.action === 'BLOCK' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                                                {policy.action}
                                                            </span>
                                                        </div>
                                                        <div className="text-[9px] text-zinc-600 truncate font-mono">{policy.pattern}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(policy.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-rose-500 text-zinc-600 transition-all ml-2"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {policies.length === 0 && !isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-2">
                        <BrainCircuit className="w-8 h-8 opacity-20" />
                        <div className="text-[10px] tracking-widest uppercase">No Active Policies</div>
                    </div>
                )}
            </div>
        </TechCard>
    );
}
