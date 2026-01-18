
'use client';
export default function Loading() {
    return (
        <div className="h-screen w-full bg-black flex items-center justify-center font-mono relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Scanner Animation */}
                <div className="w-64 h-1 bg-zinc-900 overflow-hidden relative border border-zinc-800">
                    <div className="absolute inset-0 bg-emerald-500/50 animate-[scan_1.5s_infinite]" />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="text-white text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
                        Synchronizing Neural Link
                    </div>
                    <div className="flex gap-1 text-[8px] text-zinc-500 font-mono">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
                                _
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
