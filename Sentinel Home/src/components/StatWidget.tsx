
import { clsx } from 'clsx';

interface StatWidgetProps {
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    color?: 'primary' | 'danger' | 'warning' | 'success';
}

export function StatWidget({ label, value, trend, trendUp, color = 'primary' }: StatWidgetProps) {
    const colorClass = {
        primary: 'text-c2-primary',
        danger: 'text-c2-danger',
        warning: 'text-c2-warning',
        success: 'text-c2-success',
    }[color];

    return (
        <div className="bg-c2-surface border border-c2-border p-3 flex flex-col justify-between h-24 hover:border-c2-muted/50 transition-colors">
            <span className="text-xs text-c2-muted uppercase tracking-widest">{label}</span>
            <div className="flex items-end justify-between">
                <span className={clsx("text-3xl font-bold font-mono leading-none", colorClass)}>{value}</span>
                {trend && (
                    <span className={clsx("text-xs font-mono mb-1", trendUp ? "text-c2-success" : "text-c2-danger")}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </span>
                )}
            </div>
            {/* Tiny Graph Decoration */}
            <div className="w-full h-1 bg-c2-paper mt-2 overflow-hidden flex gap-[1px]">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={clsx("w-full h-full opacity-50", colorClass)} style={{ opacity: Math.random() }}></div>
                ))}
            </div>
        </div>
    );
}
