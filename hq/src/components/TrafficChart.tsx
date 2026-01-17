'use client';

interface DataPoint {
    name: string;
    value: number;
}

interface TrafficChartProps {
    data: DataPoint[];
}

export function TrafficChart({ data }: TrafficChartProps) {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    // Calculate points for the line
    const width = 100;
    const height = 100;
    const points = data.map((point, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((point.value - minValue) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    // Create area path
    const areaPath = `M 0,${height} L ${points} L ${width},${height} Z`;

    return (
        <div className="w-full h-full flex flex-col gap-2">
            {/* Chart Area with Y-axis */}
            <div className="flex-1 flex gap-2 min-h-0">
                {/* Y-axis labels */}
                <div className="flex flex-col justify-between text-[8px] text-zinc-600 font-mono w-10 shrink-0">
                    <span>{maxValue}MB</span>
                    <span>{Math.round((maxValue + minValue) / 2)}MB</span>
                    <span>{minValue}MB</span>
                </div>

                {/* Chart */}
                <div className="flex-1 relative">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                        {/* Grid Lines */}
                        {[0, 25, 50, 75, 100].map((y) => (
                            <line
                                key={y}
                                x1="0"
                                y1={y}
                                x2="100"
                                y2={y}
                                stroke="#27272a"
                                strokeWidth="0.3"
                                strokeDasharray="2,2"
                            />
                        ))}

                        {/* Area Fill */}
                        <path
                            d={areaPath}
                            fill="url(#trafficGradient)"
                        />

                        {/* Line */}
                        <polyline
                            points={points}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="0.8"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* Data Points */}
                        {data.map((point, i) => {
                            const x = (i / (data.length - 1)) * width;
                            const y = height - ((point.value - minValue) / range) * height;
                            return (
                                <circle
                                    key={i}
                                    cx={x}
                                    cy={y}
                                    r="1.2"
                                    fill="#10b981"
                                    className="opacity-90"
                                />
                            );
                        })}

                        {/* Gradient Definition */}
                        <defs>
                            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* X-axis timestamps */}
            <div className="flex justify-between text-[8px] text-zinc-600 font-mono pl-12">
                {data.map((point, i) => {
                    // Show every other timestamp to avoid crowding
                    if (i % 2 === 0 || i === data.length - 1) {
                        return <span key={i}>{point.name}</span>;
                    }
                    return null;
                })}
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-4 text-[9px] font-mono pl-12 pt-1">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500" />
                    <span className="text-zinc-600">PEAK:</span>
                    <span className="text-emerald-500 font-bold">{maxValue}MB</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-zinc-600" />
                    <span className="text-zinc-600">AVG:</span>
                    <span className="text-zinc-400 font-bold">
                        {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)}MB
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-amber-500" />
                    <span className="text-zinc-600">TREND:</span>
                    <span className="text-amber-500 font-bold">
                        {data[data.length - 1].value > data[0].value ? '↑ UP' : '↓ DOWN'}
                    </span>
                </div>
            </div>
        </div>
    );
}
