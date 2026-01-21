'use client';

import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints: { [key in Breakpoint]: number } = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export function useBreakpoint() {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let current: Breakpoint = 'xs';

            if (width >= breakpoints['2xl']) {
                current = '2xl';
            } else if (width >= breakpoints.xl) {
                current = 'xl';
            } else if (width >= breakpoints.lg) {
                current = 'lg';
            } else if (width >= breakpoints.md) {
                current = 'md';
            } else if (width >= breakpoints.sm) {
                current = 'sm';
            }

            setBreakpoint(current);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isAtLeast = (target: Breakpoint) => {
        const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
        return order.indexOf(breakpoint) >= order.indexOf(target);
    };

    return { breakpoint, isAtLeast };
}
