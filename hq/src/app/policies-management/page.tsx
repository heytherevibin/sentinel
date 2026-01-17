import { PolicyManager } from '@/components/PolicyManager';
import { Navigation } from '@/components/Navigation';

export default function PoliciesManagementPage() {
    return (
        <main className="h-screen bg-black text-zinc-300 flex flex-col font-mono overflow-hidden">
            {/* Header */}
            <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-black z-20 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-emerald-500">
                        <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center rounded-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-white leading-none flex flex-col">
                            <span>SENTINEL</span>
                            <span className="text-[10px] tracking-[0.4em] text-zinc-500 font-bold uppercase">Policy_Engine</span>
                        </h1>
                    </div>
                </div>

                {/* Tactical Navigation */}
                <Navigation />

                <div className="flex gap-12 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] mb-1">Mode</span>
                        <span className="text-emerald-500">ENFORCEMENT</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] mb-1">Operator</span>
                        <span className="text-white">ANALYST_01</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-hidden">
                <div className="h-full max-w-7xl mx-auto">
                    <PolicyManager />
                </div>
            </div>
        </main>
    );
}
