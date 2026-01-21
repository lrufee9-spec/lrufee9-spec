
import React, { useState } from 'react';
import { Share2, Globe, MessageCircle, UserPlus, Cpu, Zap, Radio } from 'lucide-react';
import { RobotFriend } from '../../types';

const RobotNetwork: React.FC = () => {
  const [friends] = useState<RobotFriend[]>([
    { id: '1', name: 'Nexus-Prime', owner: 'Dev-User', status: 'online', lastSeen: new Date() },
    { id: '2', name: 'ECHO_v4', owner: 'Safety-Office', status: 'offline', lastSeen: new Date(Date.now() - 3600000) },
    { id: '3', name: 'AURA_Friend', owner: 'Global-Bot', status: 'online', lastSeen: new Date() },
  ]);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 p-6 space-y-8 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
            <Radio className="animate-pulse" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Neural_Mesh</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Inter-Bot Communication Protocol</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Globe size={18} /></button>
           <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><UserPlus size={18} /></button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pr-2">
        {friends.map((bot) => (
          <div key={bot.id} className="group bg-white/5 border border-white/5 hover:border-indigo-500/30 rounded-3xl p-6 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <Cpu size={80} />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${bot.status === 'online' ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">{bot.name}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{bot.owner}'s Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${bot.status === 'online' ? 'bg-green-500' : 'bg-slate-600'}`} />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{bot.status}</span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                <MessageCircle size={14} /> Ping
              </button>
              <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                <Share2 size={14} />
              </button>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-white/5 hover:border-indigo-500/30 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 group transition-all">
           <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-indigo-400 transition-all">
             <UserPlus size={24} />
           </div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white">Pair New Robot</span>
        </button>
      </div>

      <div className="mt-auto bg-indigo-600/5 border border-indigo-500/10 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><Share2 size={18} /></div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Intelligence Sync</p>
              <p className="text-[9px] text-slate-500 font-medium">Auto-sharing local file structure with paired nodes.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active Link</p>
              <p className="text-[9px] text-slate-600 font-mono">ENCRYPTED_256_BIT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotNetwork;
