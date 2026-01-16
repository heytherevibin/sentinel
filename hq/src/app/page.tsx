
'use client';
import { AlertFeed } from '@/components/AlertFeed';
import { SensorList } from '@/components/SensorList';
import { PolicyManager } from '@/components/PolicyManager';
import { StatWidget } from '@/components/StatWidget';
import { TechCard } from '@/components/TechCard';
import { Activity, ShieldCheck, Database, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { TechFooter } from '@/components/TechFooter';
import { useState, useEffect } from 'react';

// Initial Chart Placeholder
const initialChart = [
  { name: '00:00', uv: 0 }, { name: '04:00', uv: 0 }, { name: '08:00', uv: 0 },
  { name: '12:00', uv: 0 }, { name: '16:00', uv: 0 }, { name: '20:00', uv: 0 }
];

export default function Home() {
  const [stats, setStats] = useState({ totalAgents: 0, onlineAgents: 0, threatsBlocked: 0, totalEvents: 0, activePolicies: 0 });
  const [chartData, setChartData] = useState(initialChart);
  const [uptime, setUptime] = useState("00:00:00");

  useEffect(() => {
    // 1. Fetch Analytics
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.stats) setStats(data.stats);
        if (data.chart) setChartData(data.chart);
      } catch (e) { console.error(e); }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);

    // 2. Real Uptime Counter
    const start = Date.now();
    const upInterval = setInterval(() => {
      const diff = Date.now() - start;
      setUptime(new Date(diff).toISOString().substr(11, 8));
    }, 1000);

    return () => { clearInterval(interval); clearInterval(upInterval); };
  }, []);

  return (
    <main className="h-screen bg-tech-grid text-c2-text flex flex-col font-mono overflow-hidden selection:bg-c2-primary/20">

      {/* Header (Fixed at Top) */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 border-b border-c2-border bg-c2-bg/80 backdrop-blur z-10 shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <ShieldCheck size={28} className="text-c2-primary shrink-0" />
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-white">SENTINEL <span className="text-c2-primary">// OVERSIGHT</span></h1>
            <p className="text-[10px] text-c2-muted tracking-[0.2em] uppercase">Enterprise Data Defense Grid</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 md:gap-8 text-[10px] text-c2-muted w-full md:w-auto justify-between md:justify-end font-mono">
          <div className="flex items-center gap-2"><div className="w-1 h-1 bg-c2-success rounded-full"></div> SYSTEM_INTEGRITY: <span className="text-c2-success">100%</span></div>
          <div className="flex items-center gap-2"><div className="w-1 h-1 bg-c2-primary rounded-full"></div> ENCRYPTION: <span className="text-c2-primary">AES-256</span></div>
          <div>UPTIME: <span className="text-c2-text">{uptime}</span></div>
        </div>
      </header>

      {/* Main Workspace (Fixed Height, No Page Scroll) */}
      <div className="flex-1 p-4 md:p-6 flex flex-col min-h-0 overflow-hidden">

        {/* Top KPIs (Fixed Height) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 shrink-0">
          <StatWidget label="Total Agents" value={stats.totalAgents} trend={`${stats.onlineAgents} ONLINE`} trendUp={true} color="success" />
          <StatWidget label="Threats Blocked" value={stats.threatsBlocked} color="danger" />
          <StatWidget label="Total Events" value={stats.totalEvents} color="primary" />
          <StatWidget label="Active Policies" value={stats.activePolicies} color="warning" />
        </div>

        {/* Dashboard Grid (Fills remaining space) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

          {/* Left Col: Sensors (Flex-1) & Protocols (Fixed) */}
          {/* Left Col: Sensors (Flex-1) & Policies (Flex-1) */}
          {/* Left Col: Sensors (Fixed) & Policies (Flex-1) */}
          <div className="flex flex-col gap-6 h-full min-h-0">
            <div className="h-[25%] shrink-0 min-h-[120px]">
              <SensorList />
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              <PolicyManager />
            </div>
          </div>

          {/* Right Col: Chart (Fixed/Flex) & Logs (Flex-1) */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full min-h-0">
            <TechCard title="Traffic Volume (24h)" className="h-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #262626' }}
                    itemStyle={{ color: '#00E5FF' }}
                    cursor={{ stroke: '#262626', strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="uv" stackId="1" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </TechCard>

            {/* Bottom: Logs (Fills remaining) */}
            <div className="flex-1 min-h-0">
              <AlertFeed />
            </div>
          </div>
        </div>
      </div>

      {/* Footer (Fixed at Bottom) */}
      <TechFooter />
    </main>
  );
}
