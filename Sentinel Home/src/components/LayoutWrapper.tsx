'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { TechFooter } from "@/components/TechFooter";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Robust check for login page to avoid hydration flickering or trailing slash issues
    const isAuthPage = pathname === '/login' || pathname?.startsWith('/login/');

    // Before hydration, we render the full layout to ensure the header is visible ASAP on home/protected pages
    // The conditional hide is refined on-mount to avoid the "missing header" bug on certain mobile viewports
    if (isMounted && isAuthPage) {
        return (
            <div className="fixed inset-0 flex flex-col z-10 overflow-hidden">
                <div className="flex-1 min-h-0 relative">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex flex-col z-20 overflow-hidden">
            <Header />
            <div className="flex-1 min-h-0 relative">
                {children}
            </div>
            <TechFooter />
        </div>
    );
}
