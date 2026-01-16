
'use client';
import { useState, useEffect } from 'react';
import { TechCard } from './TechCard';
import { Plus, Trash2, Save } from 'lucide-react';
import { PolicyRule } from '@/types';

export function PolicyManager() {
    const [policies, setPolicies] = useState<PolicyRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newPolicy, setNewPolicy] = useState<Partial<PolicyRule>>({ name: '', pattern: '', action: 'BLOCK' });

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

    const handleSave = async () => {
        if (!newPolicy.name || !newPolicy.pattern) return;

        const updated = [
            ...policies,
            {
                id: Date.now().toString(),
                name: newPolicy.name,
                pattern: newPolicy.pattern,
                action: newPolicy.action as 'BLOCK' | 'LOG_ONLY',
                description: 'User Defined'
            }
        ];

        await savePolicies(updated);
        setNewPolicy({ name: '', pattern: '', action: 'BLOCK' });
        setIsAdding(false);
    };

    const handleDelete = async (id: string) => {
        const updated = policies.filter(p => p.id !== id);
        await savePolicies(updated);
    };

    const savePolicies = async (updated: PolicyRule[]) => {
        try {
            await fetch('/api/policy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            setPolicies(updated);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <TechCard title="Policy Management Engine" className="flex-1 min-h-0 flex flex-col"
            toolbar={
                <button onClick={() => setIsAdding(!isAdding)} className="p-1 hover:bg-c2-primary/20 rounded text-c2-primary transition-colors">
                    <Plus size={16} />
                </button>
            }>

            <div className="overflow-y-auto flex-1 min-h-0 pr-2 scrollbar-thin scrollbar-thumb-c2-border">
                {isAdding && (
                    <div className="mb-4 p-3 bg-c2-bg border border-c2-primary/50 group animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <input
                                placeholder="POLICY_NAME"
                                className="w-full bg-black border border-c2-border px-2 py-1 text-xs text-c2-text focus:border-c2-primary outline-none"
                                value={newPolicy.name} onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value.toUpperCase() })}
                            />
                            <input
                                placeholder="REGEX_PATTERN (e.g. \bSECRET\b)"
                                className="w-full bg-black border border-c2-border px-2 py-1 text-xs text-c2-text focus:border-c2-primary outline-none font-mono"
                                value={newPolicy.pattern} onChange={e => setNewPolicy({ ...newPolicy, pattern: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <select
                                    className="bg-black border border-c2-border px-2 py-1 text-xs text-c2-text outline-none"
                                    value={newPolicy.action} onChange={e => setNewPolicy({ ...newPolicy, action: e.target.value as any })}
                                >
                                    <option value="BLOCK">BLOCK</option>
                                    <option value="LOG_ONLY">LOG ONLY</option>
                                </select>
                                <button onClick={handleSave} className="flex-1 bg-c2-primary/20 hover:bg-c2-primary/40 text-c2-primary text-xs font-bold border border-c2-primary/50">
                                    SAVE RULE
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {policies.map(policy => (
                        <div key={policy.id} className="group flex justify-between items-center p-2 border border-c2-border bg-c2-bg/50 hover:border-c2-primary/50 transition-colors">
                            <div className="overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-c2-text">{policy.name}</span>
                                    <span className={`text-[10px] px-1 rounded ${policy.action === 'BLOCK' ? 'bg-c2-danger/20 text-c2-danger' : 'bg-c2-warning/20 text-c2-warning'}`}>
                                        {policy.action}
                                    </span>
                                </div>
                                <div className="text-[10px] text-c2-muted truncate font-mono mt-0.5">{policy.pattern}</div>
                            </div>
                            <button onClick={() => handleDelete(policy.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-c2-danger transition-all">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </TechCard>
    );
}
