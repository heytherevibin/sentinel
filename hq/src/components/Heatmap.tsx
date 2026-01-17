import React from 'react';

export function Heatmap() {
    // Generate a 4x12 grid (48 cells)
    // We'll randomize intensities to simulate the reference image look
    // In a real app, this would map to hour/sector
    const [cells, setCells] = React.useState<any[]>([]);

    const generateCells = () => {
        return Array.from({ length: 48 }).map((_, i) => {
            const val = Math.random();
            let colorClass = 'bg-c2-surface'; // Empty/Default
            let opacity = 'opacity-20';

            if (val > 0.90) { colorClass = 'bg-c2-danger'; opacity = 'opacity-80'; } // Critical Interaction
            else if (val > 0.80) { colorClass = 'bg-c2-danger'; opacity = 'opacity-40'; } // High
            else if (val > 0.60) { colorClass = 'bg-c2-secondary'; opacity = 'opacity-30'; } // Medium
            else if (val > 0.40) { colorClass = 'bg-c2-surface'; opacity = 'opacity-50'; } // Low

            return { id: i, colorClass, opacity };
        });
    };

    React.useEffect(() => {
        setCells(generateCells());
        const interval = setInterval(() => {
            setCells(generateCells());
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-2 p-4 bg-c2-paper border border-c2-border h-full relative overflow-hidden">
            <div className="flex justify-between items-center z-10 mb-2">
                <div className="flex items-center gap-2">
                    <span className="w-1 h-3 bg-c2-primary"></span>
                    <span className="text-[10px] font-bold text-c2-text tracking-[0.2em] uppercase">Data Exfiltration Heatmap</span>
                </div>
                <span className="text-[9px] text-c2-muted font-mono">LAST 24H</span>
            </div>

            <div className="grid grid-cols-12 gap-1 flex-1 min-h-0 z-10">
                {cells.map(c => (
                    <div
                        key={c.id}
                        className={`w-full h-full rounded-[1px] ${c.colorClass} ${c.opacity} transition-all duration-500 hover:opacity-100 hover:scale-105`}
                    />
                ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 h-16">
                <div className="bg-black/20 p-2 border-l border-c2-muted/20">
                    <div className="text-[9px] text-c2-muted uppercase tracking-wider mb-1">Top Vector</div>
                    <div className="font-mono text-xs text-c2-text font-bold">HTTPS POST</div>
                </div>
                <div className="flex items-end gap-1 h-full pb-1">
                    {/* Mini Histogram */}
                    <div className="w-1/5 h-[30%] bg-c2-muted/20"></div>
                    <div className="w-1/5 h-[50%] bg-c2-muted/20"></div>
                    <div className="w-1/5 h-[100%] bg-c2-primary/60"></div>
                    <div className="w-1/5 h-[40%] bg-c2-muted/20"></div>
                    <div className="w-1/5 h-[70%] bg-c2-secondary/40"></div>
                </div>
            </div>
        </div>
    );
}
