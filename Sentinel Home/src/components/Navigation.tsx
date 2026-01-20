'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/', label: 'COMMAND' },
    { href: '/introspection', label: 'INTROSPECT' },
    { href: '/remediation', label: 'REMEDIATE' },
    { href: '/sspm', label: 'SSPM' },
    { href: '/audit', label: 'FORENSICS' },
    { href: '/neural-ai', label: 'NEURAL_LAB' },
    { href: '/settings', label: 'CONFIG' },
];

export function Navigation() {
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-3">
            {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
                            group relative h-9 px-4 flex items-center border transition-all
                            ${isActive ? 'justify-start gap-2' : 'justify-center'}
                            ${isActive
                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                                : 'bg-zinc-900/30 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 hover:bg-zinc-900/50'
                            }
                        `}
                    >
                        {/* Hazard Stripes /// - Only show when active */}
                        {isActive && (
                            <div className="flex gap-0.5">
                                <div className="w-1 h-4 bg-amber-500 skew-x-[-10deg]" />
                                <div className="w-1 h-4 bg-amber-500 skew-x-[-10deg]" />
                                <div className="w-1 h-4 bg-amber-500 skew-x-[-10deg]" />
                            </div>
                        )}

                        {/* Text Label */}
                        <span className="text-[10px] font-bold tracking-[0.15em] font-mono uppercase leading-none">
                            {item.label}
                        </span>

                        {/* Active Bottom Border */}
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500/50" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
