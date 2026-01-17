
import React, { useState, useEffect } from 'react';
import { useSensor } from '../src/hooks/useSensor';
import Icon from './Icon';


const SettingsView: React.FC = () => {
  const sensor = useSensor();
  const [hqServerUrl, setHqServerUrl] = useState(sensor.hqServerUrl || 'http://localhost:3000');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (sensor.hqServerUrl) {
      setHqServerUrl(sensor.hqServerUrl);
    }
  }, [sensor.hqServerUrl]);

  const handleSave = async () => {
    if (sensor.updateHqServerUrl) {
      const success = await sensor.updateHqServerUrl(hqServerUrl);
      if (success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    }
  };

  return (
    <div className="h-full w-full p-6 flex flex-col items-center overflow-y-auto no-scrollbar bg-black/5 dark:bg-black/40">
      <div className="w-full max-w-2xl py-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary/20 flex items-center justify-center text-primary glow-blue">
            <Icon name="memory" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white">Node Configuration</h1>
            <p className="text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em]">Protocol & Hardware Identification</p>
          </div>
        </div>


        <div className="space-y-4">
          {/* HQ Server URL */}
          <div className="glass-card p-4 premium-shadow border border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary/10 flex items-center justify-center text-primary">
                <Icon name="dns" size={14} />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">HQ Protocol Address</h2>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={hqServerUrl}
                  onChange={(e) => setHqServerUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 text-primary dark:text-primary/80 font-mono text-[11px] focus:outline-none focus:border-primary/30 transition-all placeholder-slate-400"
                  placeholder="http://localhost:3000"
                />
              </div>
              <button
                onClick={handleSave}
                className={`px-6 py-2 font-bold text-[10px] uppercase tracking-widest transition-all ${saved ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary/80'
                  }`}
              >
                {saved ? 'SUCCESS' : 'SYNC'}
              </button>
            </div>
            <p className="mt-2 text-[9px] text-slate-500 dark:text-slate-600 font-bold uppercase tracking-tighter">
              CAUTION: Modifying the protocol address may disconnect the node.
            </p>
          </div>

          {/* Sensor Identification */}
          <div className="glass-card p-4 premium-shadow relative overflow-hidden border border-black/5 dark:border-white/5">
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
              <Icon name="fingerprint" size={60} className="text-primary" />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-accent/10 flex items-center justify-center text-accent">
                <Icon name="identity_platform" size={14} />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Hardware Fingerprint</h2>
            </div>

            <div className="p-3 bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 font-mono text-[11px] text-slate-600 dark:text-slate-500">
              {sensor.sensorId || 'X-NODE-000-UNIDENTIFIED'}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-[9px] font-bold text-slate-400 dark:text-white/5 uppercase tracking-[0.2em]">
          <span>Security Protocol V1.2.0</span>
          <span>SENTINEL SYSTEMS</span>
        </div>
      </div>
    </div>

  );
};


export default SettingsView;

