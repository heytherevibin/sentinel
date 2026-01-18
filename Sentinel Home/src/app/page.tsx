'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ShieldCheck } from 'lucide-react';

import { SensorList } from '@/components/SensorList';
import { PolicySummary } from '@/components/PolicySummary';
import { RiskGauge } from '@/components/RiskGauge';
import { IncidentLedger } from '@/components/IncidentLedger';
import { TechCard } from '@/components/TechCard';
import { Skeleton } from '@/components/Skeleton';
import { TelemetryEvent } from '@/types';

// Initial Chart Placeholder
const initialChart = [
  { name: '21:00', value: 45 },
  { name: '23:00', value: 52 },
  { name: '01:00', value: 38 },
  { name: '03:00', value: 65 },
  { name: '05:00', value: 48 },
  { name: '07:00', value: 55 },
  { name: '09:00', value: 72 },
  { name: '11:00', value: 68 },
  { name: '13:00', value: 58 },
  { name: '15:00', value: 62 },
  { name: '17:00', value: 70 },
  { name: '19:00', value: 65 }
];

export default function Home() {
  const [stats, setStats] = useState({ totalAgents: 0, onlineAgents: 0, threatsBlocked: 0, totalEvents: 0, activePolicies: 0 });
  const [chartData, setChartData] = useState(initialChart);
  const [alerts, setAlerts] = useState<TelemetryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uptime, setUptime] = useState("00:00:00");

  useEffect(() => {
    // 1. Fetch Data
    const fetchData = async () => {
      try {
        // Stats & Chart
        const statsRes = await fetch('/api/stats');
        const statsData = await statsRes.json();
        if (statsData.stats) setStats(statsData.stats);
        if (statsData.chart) setChartData(statsData.chart);

        // Alerts
        const alertsRes = await fetch('/api/telemetry/alert');
        const alertsData = await alertsRes.json();
        if (Array.isArray(alertsData)) setAlerts(alertsData);

      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    // 2. Real Uptime Counter
    const start = Date.now();
    const upInterval = setInterval(() => {
      const diff = Date.now() - start;
      setUptime(new Date(diff).toISOString().substr(11, 8));
    }, 1000);

    return () => { clearInterval(interval); clearInterval(upInterval); };
  }, []);

  // Calculate Risk Score (Mock Logic based on threats)
  const riskScore = Math.min(100, 12 + (stats.threatsBlocked * 15) + (stats.onlineAgents * 2));

  return (
    <main className="h-full bg-transparent text-zinc-300 flex flex-col font-mono overflow-hidden selection:bg-emerald-900/30 relative">

      {/* Main Workspace */}
      <div className="flex-1 p-6 grid grid-cols-12 gap-8 min-h-0 overflow-hidden relative z-10">

        {/* Left Sidebar (25% -> 3 cols) */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-8 min-h-0">

          {/* Risk Score */}
          <div className="shrink-0">
            <RiskGauge score={riskScore} isLoading={isLoading} />
          </div>

          {/* Sensor Grid - Expanded Height */}
          <div className="flex-1 min-h-0 flex flex-col">
            <SensorList />
          </div>

        </div>

        {/* Right Main Area (75% -> 9 cols) */}
        <div className="col-span-12 md:col-span-9 flex flex-col min-h-0 gap-8">

          {/* Top Row: Policy Summary & Traffic */}
          <div className="grid grid-cols-12 gap-8 shrink-0">
            <div className="col-span-5">
              <PolicySummary />
            </div>
            <div className="col-span-7">
              <TechCard title="Traffic Analysis" className="flex flex-col h-72" toolbar={<div className="flex gap-2 text-[8px] uppercase tracking-wider"><span className="text-emerald-500">■ Egress</span><span className="text-zinc-600">■ Ingress</span></div>}>
                <div className="flex-1 min-h-0">
                  {isLoading ? (
                    <div className="h-full w-full flex flex-col gap-4 p-4">
                      <div className="flex-1 flex items-end gap-1">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <Skeleton key={i} height={`${Math.random() * 60 + 20}%`} width="4%" />
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <Skeleton width={30} height={8} />
                        <Skeleton width={30} height={8} />
                        <Skeleton width={30} height={8} />
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                          dataKey="name"
                          stroke="#52525b"
                          fontSize={9}
                          tickLine={false}
                          axisLine={false}
                          fontFamily="monospace"
                        />
                        <YAxis
                          stroke="#52525b"
                          fontSize={9}
                          tickLine={false}
                          axisLine={false}
                          fontFamily="monospace"
                          tickFormatter={(v) => `${v}MB`}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#10b981"
                          strokeWidth={2}
                          fill="url(#colorValue)"
                          dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </TechCard>
            </div>
          </div>

          {/* Bottom Row: Incident Ledger */}
          <div className="flex-1 min-h-0">
            <TechCard title="Incident Ledger" status="normal" className="flex flex-col h-full">
              <IncidentLedger alerts={alerts} isLoading={isLoading} />
            </TechCard>
          </div>

        </div>

      </div>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('/grid.svg')] bg-[length:30px_30px]" />
    </main>
  );
}
