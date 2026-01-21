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

export function Navigation({ mobile, onAction }: { mobile?: boolean, onAction?: () => void }) {
    const pathname = usePathname();

    return (
        <div className={`flex ${mobile ? 'flex-col' : 'items-center'} gap-1 xl:gap-3`}>
            {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onAction}
                        className={`
                            group relative h-8 md:h-9 px-1.5 md:px-2 xl:px-4 flex items-center border transition-all
                            ${isActive ? 'justify-start gap-1 md:gap-2' : 'justify-center'}
                            ${mobile ? 'w-full !px-4' : ''}
                            ${isActive
                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                                : 'bg-zinc-900/30 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 hover:bg-zinc-900/50 active:bg-zinc-800 active:scale-[0.98]'
                            }
                        `}
                    >
                        {/* Hazard Stripes /// - Only show when active */}
                        {isActive && (
                            <div className="flex gap-0.5 shrink-0">
                                <div className="w-1 h-3.5 bg-amber-500 skew-x-[-10deg]" />
                                <div className="hidden md:block w-1 h-4 bg-amber-500 skew-x-[-10deg]" />
                                <div className="hidden xl:block w-1 h-4 bg-amber-500 skew-x-[-10deg]" />
                            </div>
                        )}

                        {/* Text Label - Full name but smaller on tablets */}
                        <span className="text-[8px] md:text-[8.5px] xl:text-[10px] font-bold tracking-tighter xl:tracking-[0.15em] font-mono uppercase leading-none truncate">
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
