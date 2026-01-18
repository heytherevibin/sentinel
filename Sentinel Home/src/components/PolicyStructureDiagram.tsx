import React, { useMemo, useState, useRef, useEffect } from 'react';
import { PolicyRule } from '@/types';
import { BrainCircuit, Shield, Database, Lock, Code, CreditCard, FileText, ChevronRight, Activity, Zap, Plus, Minus, RotateCcw } from 'lucide-react';

interface Props {
    policies: PolicyRule[];
}

export function PolicyStructureDiagram({ policies }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Canvas State
    const [scale, setScale] = useState(0.8);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Group policies by explicit category
    const categorized = useMemo(() => {
        const groups: Record<string, PolicyRule[]> = {};

        policies.forEach(p => {
            const cat = p.category || 'Other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(p);
        });

        // Sort categories to keep order stable
        return Object.entries(groups)
            .filter(([_, list]) => list.length > 0)
            .sort((a, b) => a[0].localeCompare(b[0]));
    }, [policies]);

    // Select first category by default if none selected
    useEffect(() => {
        if (!selectedCategory && categorized.length > 0) {
            setSelectedCategory(categorized[0][0]);
        }
    }, [categorized, selectedCategory]);

    // --- Interaction Handlers ---

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            // Zoom
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.min(Math.max(0.5, scale * delta), 3);
            setScale(newScale);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only start drag if clicking background (not buttons)
        if ((e.target as HTMLElement).closest('button')) return;

        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const resetView = () => {
        setScale(0.8);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div
            ref={containerRef}
            className={`h-full w-full bg-transparent relative overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Controls */}
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-black/50 backdrop-blur-md p-2 rounded-lg border border-zinc-800 shadow-xl">
                <button onClick={() => setScale(s => Math.min(s + 0.1, 3))} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors" title="Zoom In"><Plus size={16} /></button>
                <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors" title="Zoom Out"><Minus size={16} /></button>
                <button onClick={resetView} className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors" title="Reset View"><RotateCcw size={16} /></button>
            </div>

            {/* Transformable Canvas Layer */}
            <div
                className="w-full h-full flex items-center justify-start pl-4 py-20 origin-center transition-transform duration-75 ease-out"
                style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
            >
                {/* SVG Connections (Background of the transformed layer) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible opacity-50">
                    <defs>
                        <linearGradient id="link-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                            <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="flex items-center gap-16 min-w-max">
                    {/* Level 2: CATEGORY ORBIT */}
                    <div className="flex flex-col gap-4 z-10">
                        {categorized.map(([category, items]) => {
                            const isSelected = selectedCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={(e) => { e.stopPropagation(); setSelectedCategory(category); }}
                                    className={`relative flex items-center gap-4 p-3 pr-6 rounded-r-full border-l-2 transition-all w-72 group
                                        ${isSelected
                                            ? 'bg-emerald-950/40 border-emerald-500 pl-8 translate-x-4 shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]'
                                            : 'bg-black/40 border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900/60 pl-4 opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg border transition-colors ${isSelected ? 'border-emerald-500 text-emerald-400 bg-emerald-950/50' : 'border-zinc-700 text-zinc-500 bg-black/50'}`}>
                                        {getCategoryIcon(category)}
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                                            {category}
                                        </div>
                                        <div className="text-[9px] text-zinc-600 font-mono flex items-center gap-1">
                                            <Activity size={8} />
                                            {items.length} Rules
                                        </div>
                                    </div>
                                    {isSelected && <ChevronRight size={14} className="text-emerald-500 animate-pulse" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Level 3: LEAF NODES (Policies) */}
                    <div className="z-10 min-w-[300px]">
                        {selectedCategory && (
                            <div className="flex flex-col gap-3">
                                {categorized.find(c => c[0] === selectedCategory)?.[1].map((policy, idx) => (
                                    <div
                                        key={policy.id}
                                        className="relative flex items-center animate-in fade-in slide-in-from-left-8 duration-300 fill-mode-both"
                                        style={{ animationDelay: `${idx * 30}ms` }}
                                    >
                                        {/* Horizontal Branch */}
                                        <div className="w-12 h-px bg-gradient-to-r from-emerald-900/50 to-emerald-900/20 shrink-0"></div>
                                        <div className="w-1 h-1 rounded-full bg-emerald-500/50 shrink-0 -ml-0.5"></div>

                                        <div className="ml-2 flex-1 min-w-0 p-3 rounded-sm border border-zinc-800 bg-zinc-950/80 hover:bg-zinc-900 hover:border-emerald-500/30 transition-all group backdrop-blur-md shadow-lg w-80">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-1.5 h-1.5 rounded-sm ${policy.action === 'BLOCK' ? 'bg-rose-500 shadow-[0_0_5px_currentColor]' : 'bg-amber-500 shadow-[0_0_5px_currentColor]'}`}></span>
                                                        <span className="text-xs font-bold text-zinc-200 truncate">{policy.name}</span>
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 font-mono truncate mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        {policy.pattern}
                                                    </div>
                                                </div>
                                                <div className="shrink-0 flex flex-col items-end">
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${policy.action === 'BLOCK' ? 'border-rose-900 text-rose-500 bg-rose-950/10' : 'border-amber-900 text-amber-500 bg-amber-950/10'}`}>
                                                        {policy.action}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function getCategoryIcon(cat: string) {
    const className = "w-4 h-4";
    if (cat.includes('Financial')) return <CreditCard className={className} />;
    if (cat.includes('Technical Secrets')) return <Lock className={className} />;
    if (cat.includes('PII')) return <Shield className={className} />;
    if (cat.includes('Intellectual Property')) return <FileText className={className} />;
    if (cat.includes('Insider Threat')) return <Activity className={className} />;
    if (cat.includes('Network')) return <Database className={className} />;
    if (cat.includes('File Types')) return <Code className={className} />;
    return <Zap className={className} />;
}
