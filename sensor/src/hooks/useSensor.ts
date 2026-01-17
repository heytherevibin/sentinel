import { useState, useEffect } from 'react';

interface SensorStatus {
  sensorId: string;
  hostname: string;
  version: string;
  connectionStatus: 'ONLINE' | 'OFFLINE' | 'WARNING';
  lastHeartbeat: string | null;
  heartbeatCount: number;
  successCount: number;
  lastLatency: number | null;
  systemHealth: number;
  policies: any[];
  globalStats?: {
    totalAgents: number;
    onlineAgents: number;
    threatsBlocked: number;
    totalEvents: number;
    activePolicies: number;
  };
  recentAlerts?: any[];
}


declare global {
  interface Window {
    electronAPI?: {
      getSensorStatus: () => Promise<SensorStatus | null>;
      getSensorId: () => Promise<string | null>;
      getHqServerUrl: () => Promise<string | null>;
      updateHqServerUrl: (url: string) => Promise<boolean>;
    };
  }
}

export function useSensor() {
  const [status, setStatus] = useState<SensorStatus | null>(null);
  const [sensorId, setSensorId] = useState<string>('');
  const [hqServerUrl, setHqServerUrl] = useState<string>('http://localhost:3000');

  useEffect(() => {
    if (!window.electronAPI) {
      // Running in browser, not Electron
      console.warn('Not running in Electron - using mock data');
      return;
    }

    // Initial load
    window.electronAPI.getSensorStatus().then(setStatus);
    window.electronAPI.getSensorId().then(id => id && setSensorId(id));
    window.electronAPI.getHqServerUrl().then(url => url && setHqServerUrl(url));

    // Update every 2 seconds
    const interval = setInterval(() => {
      window.electronAPI?.getSensorStatus().then(setStatus);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const updateHqServerUrl = async (url: string) => {
    if (window.electronAPI) {
      const success = await window.electronAPI.updateHqServerUrl(url);
      if (success) {
        setHqServerUrl(url);
      }
      return success;
    }
    return false;
  };

  return {
    status,
    sensorId,
    hqServerUrl,
    updateHqServerUrl,
    isElectron: !!window.electronAPI,
  };
}
