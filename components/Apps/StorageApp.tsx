
import React, { useState } from 'react';
import { 
  Database, ArrowLeft, HardDrive, Cloud, Music, 
  Disc, Folder, Search, Zap, Trash2, Shield,
  ChevronRight, LayoutGrid, List, Activity, Settings
} from 'lucide-react';

interface Props {
  onBack: () => void;
  onLaunchDJ: () => void;
}

const StorageApp: React.FC<Props> = ({ onBack, onLaunchDJ }) => {
  const [activeTab, setActiveTab] = useState<'drive' | 'cloud' | 'analytics'>('drive');

  return (
    <div className="flex-1 flex flex-col bg-[#020617] overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <Database size={20} />
          </div>
          <div className="hidden xs:block">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Aura_Storage</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Core Data Subsystem</p>
          </div>
        </div>

        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
           <TabBtn active={activeTab === 'drive'} label="Local" icon={<HardDrive size={14}/>} onClick={() => setActiveTab('drive')} />
           <TabBtn active={activeTab === 'cloud'} label="Vault" icon={<Cloud size={14}/>} onClick={() => setActiveTab('cloud')} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Storage Capacity HUD - Mobile Optimized Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
             <CapacityCard label="Local System" used="124.5 GB" total="512 GB" color="cyan" />
             <CapacityCard label="Neural Vault" used="4.2 TB" total="10 TB" color="indigo" />
             <CapacityCard label="DJ Cache" used="68.1 GB" total="100 GB" color="rose" />
          </div>

          {/* Module Links */}
          <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
             <ModuleLink 
               title="DJ_MUSIC_HUB" 
               sub="Analyzed Audio Repository" 
               icon={<Disc size={28}/>} 
               color="rose"
               onClick={onLaunchDJ}
             />
             <ModuleLink 
               title="VAULT_DOCS" 
               sub="Encrypted System Data" 
               icon={<Shield size={28}/>} 
               color="emerald"
               onClick={() => {}}
             />
             <ModuleLink 
               title="SYSTEM_CACHE" 
               sub="Temporary Pulse Buffers" 
               icon={<Zap size={28}/>} 
               color="amber"
               onClick={() => {}}
             />
          </section>

          {/* File Explorer (Drive) */}
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Root_Directories</h3>
                <div className="flex gap-2">
                   <button className="p-2 text-slate-600 hover:text-white transition-all"><LayoutGrid size={16}/></button>
                   <button className="p-2 text-slate-600 hover:text-white transition-all"><List size={16}/></button>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                <FolderIcon label="System_Apps" count={14} />
                <FolderIcon label="Personal_Logs" count={89} />
                <FolderIcon label="Media_Export" count={42} />
                <FolderIcon label="DJ_Sync_Node" count={128} color="rose" onClick={onLaunchDJ} />
             </div>
          </section>

          {/* Activity Logs - Responsive Stack */}
          <section className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 sm:p-10">
             <div className="flex items-center gap-3 mb-8">
                <Activity size={18} className="text-cyan-400" />
                <h4 className="text-sm font-black text-white uppercase tracking-widest italic">I/O_Telemetry_Stream</h4>
             </div>
             <div className="space-y-4">
                <LogItem time="04:20:11" msg="Synced [DEEP_HOUSE_01.MP3] to Serato" status="STABLE" />
                <LogItem time="04:18:55" msg="Analyzing Beatgrid for [NEURAL_BASS]" status="ACTIVE" />
                <LogItem time="03:44:02" msg="Cloud Vault backup initiated" status="COMPLETE" />
                <LogItem time="02:11:59" msg="Encryption protocols refreshed" status="STABLE" />
             </div>
          </section>

        </div>
      </div>
    </div>
  );
};

const TabBtn = ({ active, label, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon} {label}
  </button>
);

const CapacityCard = ({ label, used, total, color }: any) => {
  const themes: any = {
    cyan: 'text-cyan-400 border-cyan-500/20',
    indigo: 'text-indigo-400 border-indigo-500/20',
    rose: 'text-rose-400 border-rose-500/20',
  };
  return (
    <div className={`p-8 bg-white/5 border rounded-[2rem] space-y-6 group hover:bg-white/10 transition-all ${themes[color]}`}>
       <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
          <span className="text-[10px] font-black text-white italic">{used} <span className="text-slate-700 mx-1">/</span> {total}</span>
       </div>
       <div className="h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div className={`h-full bg-current opacity-80 rounded-full transition-all duration-1000 group-hover:scale-x-105 origin-left`} style={{ width: '45%' }} />
       </div>
    </div>
  );
};

const ModuleLink = ({ title, sub, icon, color, onClick }: any) => {
  const themes: any = {
    rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/20',
  };
  return (
    <button onClick={onClick} className={`p-10 rounded-[3rem] border text-left transition-all active:scale-95 group shadow-xl shadow-black/20 ${themes[color]}`}>
       <div className="mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">{icon}</div>
       <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{title}</h4>
       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-2">{sub}</p>
    </button>
  );
};

const FolderIcon = ({ label, count, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center gap-6 hover:bg-white/10 hover:border-white/10 hover:shadow-2xl transition-all group active:scale-95"
  >
    <div className={`p-4 rounded-2xl bg-black/20 transition-all ${color === 'rose' ? 'text-rose-500' : 'text-slate-600 group-hover:text-cyan-400 group-hover:scale-110'}`}>
       <Folder size={32} fill="currentColor" fillOpacity={0.1}/>
    </div>
    <div className="text-center">
       <p className="text-[11px] font-black text-white uppercase tracking-tight italic group-hover:text-cyan-400 transition-colors">{label}</p>
       <p className="text-[8px] text-slate-600 uppercase tracking-widest mt-1.5">{count} Objects</p>
    </div>
  </button>
);

const LogItem = ({ time, msg, status }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 border-b border-white/5 last:border-0 group">
     <div className="flex gap-4 items-center">
        <span className="font-mono text-[9px] text-slate-600">{time}</span>
        <span className="font-black text-[11px] text-slate-400 uppercase tracking-tight group-hover:text-white transition-colors">{msg}</span>
     </div>
     <span className={`w-fit font-black uppercase tracking-widest text-[8px] px-3 py-1 rounded-full ${status === 'STABLE' ? 'bg-emerald-500/10 text-emerald-500' : status === 'ACTIVE' ? 'bg-amber-500/10 text-amber-500 animate-pulse' : 'bg-indigo-500/10 text-indigo-500'}`}>{status}</span>
  </div>
);

export default StorageApp;
