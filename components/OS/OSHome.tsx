
import React, { useEffect, useState } from 'react';
import { AppID } from '../../types';
import { AuraAPI } from '../../services/api';
import { 
  MessageSquare, Terminal, Map as MapIcon, Database, 
  Camera, User, Mail, Video, Shield, Radio, Layers, Activity, Sparkles, Zap,
  PlayCircle, Gamepad2, Film, BookOpen, Folder, Compass, Puzzle, Trophy, Sword, CarFront, Globe, Cpu
} from 'lucide-react';

interface Props {
  onLaunchApp: (id: AppID) => void;
  installedApps?: string[];
}

const OSHome: React.FC<Props> = ({ onLaunchApp, installedApps }) => {
  const [systemData, setSystemData] = useState<any>(null);

  useEffect(() => {
    const sync = async () => {
      const state = await AuraAPI.getSystemState();
      if (state) setSystemData(state);
    };
    sync();
    const interval = setInterval(sync, 5000); // Poll every 5s for full-stack feel
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Live Telemetry Dashboard */}
        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
           <TelemetryCard 
            title="Neural Hub" 
            value={systemData ? `${systemData.logs.length} Evt` : "Syncing..."} 
            sub="Mesh Network Active" 
            icon={<Cpu size={20} className="text-indigo-400"/>} 
            color="bg-indigo-600" 
           />
           <TelemetryCard 
            title="Comms Load" 
            value={systemData ? `${systemData.emails.length}` : "0"} 
            sub="Neural Inbox Healthy" 
            icon={<Mail size={20} className="text-emerald-400"/>} 
            color="bg-emerald-600" 
           />
           <TelemetryCard 
            title="Stored Pulse" 
            value={systemData ? `${systemData.files.length} Nodes` : "---"} 
            sub="Vault Integrity Stable" 
            icon={<Database size={20} className="text-rose-400"/>} 
            color="bg-rose-600" 
           />
           <TelemetryCard 
            title="Mesh Peers" 
            value={systemData ? `${systemData.contacts.length}` : "0"} 
            sub="Inter-Bot Linkage Open" 
            icon={<Globe size={20} className="text-cyan-400"/>} 
            color="bg-cyan-600" 
           />
        </section>

        {/* Primary Command Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Primary_Subsystems</h3>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-indigo-400 uppercase">Live_State_Active</span>
             </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <AppTile icon={<Shield />} label="Sentinel" sub="Security" color="red" onClick={() => onLaunchApp('security')} />
            <AppTile icon={<MessageSquare />} label="AI Link" sub="Interface" color="indigo" onClick={() => onLaunchApp('chat')} />
            <AppTile icon={<Database />} label="Storage" sub="Data Core" color="cyan" onClick={() => onLaunchApp('storage')} />
            <AppTile icon={<Camera />} label="Lens" sub="Optical" color="blue" onClick={() => onLaunchApp('camera')} />
            <AppTile icon={<Puzzle />} label="Market" sub="Extensions" color="amber" onClick={() => onLaunchApp('extensions')} />
            <AppTile icon={<Folder />} label="Vault" sub="Files" color="emerald" onClick={() => onLaunchApp('files')} />
            <AppTile icon={<Film />} label="Cinema" sub="Video" color="rose" onClick={() => onLaunchApp('video')} />
            <AppTile icon={<BookOpen />} label="Books" sub="Library" color="violet" onClick={() => onLaunchApp('books')} />
            <AppTile icon={<PlayCircle />} label="Social" sub="Mesh Feed" color="orange" onClick={() => onLaunchApp('content')} />
            <AppTile icon={<Terminal />} label="System" sub="CLI Pro" color="slate" onClick={() => onLaunchApp('terminal')} />
            <AppTile icon={<Compass />} label="Tactical" sub="GPS Maps" color="teal" onClick={() => onLaunchApp('maps')} />
            <AppTile icon={<Mail />} label="Inbox" sub="Comms" color="sky" onClick={() => onLaunchApp('inbox')} />
          </div>
        </section>

        {/* Recent Neural Events List */}
        {systemData && (
          <section className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 animate-in slide-in-from-bottom duration-500">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural_Telemetery_Stream</h3>
                <Activity size={16} className="text-indigo-500" />
             </div>
             <div className="space-y-4">
                {systemData.logs.slice(0, 4).map((log: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 group">
                    <span className="text-[10px] font-mono text-slate-600">0{i+1}</span>
                    <span className="text-[11px] font-black text-slate-400 group-hover:text-white transition-colors">{log}</span>
                  </div>
                ))}
             </div>
          </section>
        )}

        {/* Store CTA Banner */}
        <section className="bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900/40 border border-indigo-500/20 rounded-[3rem] p-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <Puzzle size={140} />
           </div>
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left space-y-4">
                 <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">Expand_Capabilities</h4>
                 <p className="text-slate-400 text-sm max-w-lg leading-relaxed font-medium">Aura Marketplace allows you to bind new logical cores and expand system storage nodes.</p>
                 <div className="flex justify-center lg:justify-start gap-4 pt-4">
                    <button onClick={() => onLaunchApp('extensions')} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">Visit Market</button>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

const TelemetryCard = ({ title, value, sub, icon, color }: any) => (
  <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] space-y-4 hover:bg-white/10 transition-all group">
     <div className="flex justify-between items-start">
        <div className="p-3 bg-black/40 rounded-2xl border border-white/5">{icon}</div>
        <div className="text-right">
           <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{value}</p>
           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{title}</p>
        </div>
     </div>
     <div className="space-y-2">
        <div className="h-1 bg-black/40 rounded-full overflow-hidden">
           <div className={`h-full ${color}`} style={{ width: '40%' }} />
        </div>
        <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{sub}</p>
     </div>
  </div>
);

const AppTile = ({ icon, label, sub, onClick, color }: any) => {
  const themes: any = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white',
    slate: 'text-slate-400 bg-slate-500/10 border-slate-500/20 group-hover:bg-slate-600 group-hover:text-white',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20 group-hover:bg-violet-600 group-hover:text-white',
    red: 'text-red-400 bg-red-500/10 border-red-500/20 group-hover:bg-red-600 group-hover:text-white',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-600 group-hover:text-white',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:bg-cyan-600 group-hover:text-white',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-600 group-hover:text-white',
    teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20 group-hover:bg-teal-600 group-hover:text-white',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20 group-hover:bg-orange-600 group-hover:text-white',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20 group-hover:bg-sky-600 group-hover:text-white',
  };

  return (
    <button 
      onClick={onClick} 
      className="bg-white/5 p-5 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all flex flex-col items-center gap-4 active:scale-95 group relative overflow-hidden shadow-lg shadow-black/20"
    >
      <div className={`p-4 rounded-2xl transition-all duration-500 ${themes[color]}`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <div className="text-center">
        <span className="text-[10px] font-black text-white block uppercase tracking-tight italic">{label}</span>
        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">{sub}</span>
      </div>
    </button>
  );
};

export default OSHome;
