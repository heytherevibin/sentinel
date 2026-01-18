'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldAlert, BadgeCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [passkey, setPasskey] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'ERROR' | 'SUCCESS'>('IDLE');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passkey }),
            });

            if (res.ok) {
                setStatus('SUCCESS');
                setTimeout(() => router.push('/'), 800); // Small delay for effect
            } else {
                setStatus('ERROR');
                setTimeout(() => setStatus('IDLE'), 2000);
            }
        } catch (err) {
            setStatus('ERROR');
        }
    };

    return (
        <main className="h-screen w-full bg-black text-zinc-300 font-mono flex items-center justify-center relative overflow-hidden selection:bg-emerald-900/30">
            {/* Global Mesh Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('/grid.svg')] bg-[length:30px_30px]" />

            <div className="relative z-10 w-full max-w-md p-8 flex flex-col items-center">

                {/* Logo / Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-emerald-500/10 border border-emerald-500/50 rounded-sm">
                        <Lock size={32} className="text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-white mb-2">SENTINEL ACCESS</h1>
                    <p className="text-xs text-zinc-500 uppercase tracking-[0.2em]">Secure Terminal • Authorized Personnel Only</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                    <div className="relative group">
                        <div className={`absolute inset-0 bg-gradient-to-r ${status === 'ERROR' ? 'from-red-500/20 to-transparent' : 'from-emerald-500/20 to-transparent'} opacity-0 group-focus-within:opacity-100 transition-opacity rounded blur-md`} />
                        <input
                            type="password"
                            value={passkey}
                            onChange={(e) => setPasskey(e.target.value)}
                            placeholder="ENTER ACCESS CODE"
                            className={`
                                w-full bg-black/60 border-2 px-6 py-4 text-center text-lg tracking-[0.5em] outline-none transition-all placeholder:text-zinc-800
                                ${status === 'ERROR'
                                    ? 'border-red-500 text-red-500 animate-shake'
                                    : status === 'SUCCESS'
                                        ? 'border-emerald-500 text-emerald-500'
                                        : 'border-zinc-800 focus:border-emerald-500/50 text-white'
                                }
                            `}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'LOADING' || status === 'SUCCESS'}
                        className={`
                            w-full py-4 font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2
                            ${status === 'SUCCESS'
                                ? 'bg-emerald-500 text-black'
                                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                            }
                        `}
                    >
                        {status === 'LOADING' && 'VERIFYING...'}
                        {status === 'SUCCESS' && <><BadgeCheck size={18} /> ACCESS GRANTED</>}
                        {status === 'ERROR' && <><ShieldAlert size={18} /> ACCESS DENIED</>}
                        {status === 'IDLE' && <><ArrowRight size={18} /> AUTHENTICATE</>}
                    </button>
                </form>

                {/* Footer Info */}
                <div className="mt-12 text-[10px] text-zinc-700 uppercase tracking-widest text-center">
                    <div>System ID: SNTL-CORE-01</div>
                    <div>Encryption: AES-256-GCM</div>
                </div>
            </div>
        </main>
    );
}
