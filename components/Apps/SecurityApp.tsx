
import React, { useRef, useEffect, useState } from 'react';
import { Shield, Camera, Mic, AlertTriangle, Lock, Eye, Activity, Zap } from 'lucide-react';

const SecurityApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [threatLevel, setThreatLevel] = useState(0);
  const [logs, setLogs] = useState<string[]>(["Sentinel Subsystem Standby..."]);

  const startMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsMonitoring(true);
      addLog("Vision & Audio Node Connected.");
      
      // Simulate real-time scanning
      const interval = setInterval(() => {
        const randomThreat = Math.random() > 0.9 ? Math.floor(Math.random() * 40) : 0;
        if (randomThreat > 20) {
          setThreatLevel(prev => Math.min(100, prev + 15));
          addLog("ANOMALY_DETECTED: Movement Pattern Irregular.");
        } else {
          setThreatLevel(prev => Math.max(0, prev - 5));
        }
      }, 3000);

      return () => clearInterval(interval);
    } catch (err) {
      addLog("ERROR: Sensor Access Denied.");
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 p-4 sm:p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl border ${isMonitoring ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Sentinel_Guard</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Active Threat Neutralization</p>
          </div>
        </div>
        <div className="flex gap-2">
          <StatusBadge label="Vision" active={isMonitoring} />
          <StatusBadge label="Audio" active={isMonitoring} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative flex-1 bg-black rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            {isMonitoring ? (
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800 gap-4">
                <Camera size={64} className="opacity-10" />
                <button 
                  onClick={startMonitoring}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95"
                >
                  Enable Sensors
                </button>
              </div>
            )}
            
            {/* HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none p-6 border-[20px] border-transparent">
              <div className="flex justify-between h-full border border-white/10 p-4 relative">
                 <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500/50" />
                 <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500/50" />
                 <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500/50" />
                 <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500/50" />
                 
                 {isMonitoring && (
                   <div className="flex flex-col justify-between w-full h-full">
                     <div className="flex justify-between items-start">
                       <div className="text-[10px] font-mono text-red-500 bg-red-500/20 px-2 py-1 rounded">LIVE_FEED_SECURE</div>
                       <div className="text-[10px] font-mono text-slate-400">FPS: 60 // RES: 1080P</div>
                     </div>
                     <div className="w-full flex justify-center">
                       <div className="w-48 h-48 border border-white/20 rounded-full flex items-center justify-center">
                         <div className="w-40 h-40 border-2 border-dashed border-white/10 rounded-full animate-spin-slow" />
                       </div>
                     </div>
                   </div>
                 )}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-6">
             <div className="flex-1">
               <div className="flex justify-between mb-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global_Threat_Index</span>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${threatLevel > 50 ? 'text-red-500' : 'text-green-500'}`}>{threatLevel}%</span>
               </div>
               <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                 <div className={`h-full transition-all duration-500 ${threatLevel > 50 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-green-500'}`} style={{ width: `${threatLevel}%` }} />
               </div>
             </div>
             <button className="px-6 py-2.5 bg-red-600/10 border border-red-600/30 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600/20 transition-all">
               Panic_Mode
             </button>
          </div>
        </div>

        <div className="space-y-4 flex flex-col">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex-1">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Activity size={14} className="text-indigo-400" /> Sensor_History
            </h3>
            <div className="space-y-3">
              {logs.map((log, i) => (
                <div key={i} className="text-[10px] font-mono text-slate-500 border-l border-white/10 pl-3 py-1">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Lock size={16} /></div>
              <h3 className="text-[11px] font-black text-white uppercase tracking-wider">Bio_Encryption</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-4">
              Biometric vault is active. Fingerprint & Face ID linked to personal robotic instance.
            </p>
            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-indigo-600/20">
              Verify Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ label, active }: any) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/10 text-slate-600'}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`} />
    {label}
  </div>
);

export default SecurityApp;
