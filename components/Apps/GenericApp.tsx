
import React from 'react';
import { Settings, RefreshCw, Lock, Zap, Search } from 'lucide-react';

interface Props {
  title: string;
  icon: React.ReactNode;
  color: string;
}

const GenericApp: React.FC<Props> = ({ title, icon, color }) => {
  const colors: any = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="flex-1 flex flex-col p-6 items-center justify-center space-y-6 animate-in zoom-in duration-500">
      <div className="relative">
        <div className={`w-24 h-24 rounded-[2rem] border flex items-center justify-center shadow-xl transition-transform duration-700 hover:rotate-3 ${colors[color]}`}>
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 40 }) : icon}
        </div>
        <div className="absolute -top-2 -right-2 p-2 bg-indigo-950/80 backdrop-blur-xl rounded-lg border border-white/10">
          <Zap size={12} className="text-amber-400 fill-amber-400" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase">{title}</h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
          <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.4em]">Node_Sync_Stable</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full max-w-xs pt-4">
        <ControlBtn icon={<RefreshCw size={12} />} label="Refresh" />
        <ControlBtn icon={<Search size={12} />} label="Analyze" />
        <ControlBtn icon={<Lock size={12} />} label="Secure" active />
        <ControlBtn icon={<Settings size={12} />} label="Config" />
      </div>

      <p className="text-slate-700 text-[8px] font-black uppercase tracking-[0.3em] pt-6">
        Aura Subsystem Core // V4.2
      </p>
    </div>
  );
};

const ControlBtn = ({ icon, label, active }: any) => (
  <button className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all active:scale-95 ${
    active 
    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
    : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-300'
  }`}>
    {icon}
    <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
  </button>
);

export default GenericApp;
