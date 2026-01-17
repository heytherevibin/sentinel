
import React from 'react';
import ConnectionStatusCard from './ConnectionStatusCard';
import HqServerCard from './HqServerCard';
import CircularProgressCard from './CircularProgressCard';
import StatCard from './StatCard';
import LastHeartbeatCard from './LastHeartbeatCard';
import RecentActivityCard from './RecentActivityCard';

interface DashboardProps {
    sensor: {
        status: any;
        hqServerUrl: string;
        updateHqServerUrl: (url: string) => Promise<boolean>;
    };
}

const Dashboard: React.FC<DashboardProps> = ({ sensor }) => {
    const status = sensor?.status || {};
    const connectionStatus = status.connectionStatus || 'OFFLINE';
    const systemHealth = status.systemHealth || 0;
    const heartbeatCount = status.heartbeatCount || 0;
    const successCount = status.successCount || 0;

    // Calculate success rate
    const successRate = heartbeatCount > 0
        ? (successCount / heartbeatCount) * 100
        : 0;

    // Calculate uptime (estimated based on heartbeat count, 30 seconds each)
    const estimatedSeconds = heartbeatCount * 30;
    const uptimeText = estimatedSeconds < 60
        ? `${estimatedSeconds}s`
        : estimatedSeconds < 3600
            ? `${Math.floor(estimatedSeconds / 60)}m`
            : `${Math.floor(estimatedSeconds / 3600)}h`;

    // Determine status colors and labels
    const systemHealthColor = systemHealth < 40 ? 'danger' : systemHealth < 70 ? 'warning' : 'success';
    const systemHealthLabel = systemHealth < 40 ? 'CRITICAL' : systemHealth < 70 ? 'WARNING' : 'HEALTHY';

    const successRateColor = successRate < 40 ? 'danger' : successRate < 70 ? 'warning' : 'success';
    const successRateLabel = successRate < 40 ? 'FAIL' : successRate < 70 ? 'STBL' : 'SYNC';


    const globalStats = status.globalStats;
    const recentAlerts = status.recentAlerts;

    return (
        <div className="flex-1 p-3 overflow-hidden flex flex-col transition-all duration-500">
            <div className="flex-1 grid grid-cols-12 grid-rows-[auto_auto_1fr] gap-3 h-full">


                {/* Row 1: Status & HQ */}
                <div className="col-span-8">
                    <ConnectionStatusCard status={connectionStatus} />
                </div>
                <div className="col-span-4">
                    <HqServerCard hqServerUrl={sensor?.hqServerUrl || 'http://localhost:3000'} />
                </div>

                {/* Row 2: Metrics */}
                <div className="col-span-3">
                    <CircularProgressCard
                        percentage={systemHealth}
                        label={systemHealthLabel}
                        title="Node"
                        subtitle="Kernel"
                        color={systemHealthColor}
                    />
                </div>
                <div className="col-span-3">
                    <CircularProgressCard
                        percentage={successRate}
                        label={successRateLabel}
                        title="Path"
                        subtitle="Sync"
                        color={successRateColor}
                    />
                </div>
                <div className="col-span-3">
                    <StatCard
                        icon="policy"
                        iconBg="bg-primary/10"
                        iconColor={status.policies?.length > 0 ? "text-primary" : "text-slate-400"}
                        label="ACTIVE POLICIES"
                        value={status.policies ? String(status.policies.length) : '0'}
                        title="Enforcing"
                    />
                </div>
                <div className="col-span-3">
                    <StatCard
                        icon="uptime"
                        iconBg="bg-accent/10"
                        iconColor="text-accent"
                        label="UPTIME"
                        value={uptimeText}
                        title="Duration"
                    />
                </div>


                {/* Row 3: History & Analysis - Stretches to fill space */}
                <div className="col-span-4 min-h-0">
                    <LastHeartbeatCard lastHeartbeat={status.lastHeartbeat} lastLatency={status.lastLatency} />
                </div>
                <div className="col-span-8 min-h-0">
                    <RecentActivityCard
                        connectionStatus={connectionStatus}
                        lastHeartbeat={status.lastHeartbeat}
                        recentAlerts={recentAlerts}
                    />
                </div>
            </div>
        </div>
    );

};



export default Dashboard;


