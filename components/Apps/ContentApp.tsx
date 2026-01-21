
import React, { useState, useEffect, useRef } from 'react';
import { Post, Game, Contact } from '../../types';
import { 
  Heart, MessageCircle, Send, Play, Camera, Search, 
  Gamepad2, UserPlus, Gift, Timer, Hand, DollarSign, 
  Tv, Layers, Filter, PlusSquare, ArrowLeft, Trophy,
  Wifi, ShieldCheck, Gamepad, Zap
} from 'lucide-react';

const ContentApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'live' | 'games' | 'networking'>('feed');
  const [isLive, setIsLive] = useState(false);
  const [speakerTimer, setSpeakerTimer] = useState(60);
  const [isSpeakerActive, setIsSpeakerActive] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [controllerSynced, setControllerSynced] = useState(false);

  const [posts] = useState<Post[]>([
    { id: '1', userId: 'u1', userName: 'Nexus_Core', type: 'video', mediaUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800', caption: 'Atmospheric Pulse // 2m Burst', likes: 1240, timestamp: new Date() },
    { id: '2', userId: 'u2', userName: 'Zero_G', type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', caption: 'Circuit aesthetics.', likes: 890, timestamp: new Date() }
  ]);

  const [games] = useState<Game[]>([
    { id: 'g1', title: 'Aura League Soccer', genre: 'soccer', platformSync: ['ps5', 'xbox'] },
    { id: 'g2', title: 'Mortal Combat: Neural', genre: 'fighting', platformSync: ['ps4', 'ps5'] },
    { id: 'g3', title: 'Chronos-Quest', genre: 'adventure', platformSync: ['pc', 'xbox'] },
    { id: 'g4', title: 'Wrestle-Pulse', genre: 'fighting', platformSync: ['ps5'] },
    { id: 'g5', title: 'Boxing-Alpha', genre: 'fighting', platformSync: ['xbox'] }
  ]);

  const [usersToKnow] = useState([
    { name: 'Kore-X', sub: 'Global Comm' },
    { name: 'Puck_Dev', sub: 'Logic Core' },
    { name: 'Fenrir_9', sub: 'Security' }
  ]);

  // Live Stream Logic
  useEffect(() => {
    let interval: number;
    if (isSpeakerActive && speakerTimer > 0) {
      interval = window.setInterval(() => setSpeakerTimer(prev => prev - 1), 1000);
    } else if (speakerTimer === 0 && isSpeakerActive) {
      // Contract end logic: In a real app, send money or reverse here
      setIsSpeakerActive(false);
    }
    return () => clearInterval(interval);
  }, [isSpeakerActive, speakerTimer]);

  const handleSyncPad = () => {
    setControllerSynced(true);
    setTimeout(() => alert("Aura-Link: PS5 Controller Synchronized Globally."), 500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] overflow-hidden">
      {/* Dynamic Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-40">
        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
          <TabBtn active={activeTab === 'feed'} label="Pulse" icon={<Tv size={14}/>} onClick={() => setActiveTab('feed')} />
          <TabBtn active={activeTab === 'live'} label="Live" icon={<Wifi size={14}/>} onClick={() => setActiveTab('live')} />
          <TabBtn active={activeTab === 'games'} label="Arcade" icon={<Gamepad2 size={14}/>} onClick={() => setActiveTab('games')} />
          <TabBtn active={activeTab === 'networking'} label="Sync" icon={<UserPlus size={14}/>} onClick={() => setActiveTab('networking')} />
        </div>
        <button className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg active-scale"><PlusSquare size={18}/></button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'feed' && (
          <div className="max-w-2xl mx-auto py-8 space-y-12 px-4">
            {posts.map(post => (
              <div key={post.id} className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden group">
                <div className="p-5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 font-black text-xs">
                        {post.userName[0]}
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{post.userName}</h4>
                        <p className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Linked_Social_Node</p>
                     </div>
                   </div>
                   <button className="p-2 text-slate-500 hover:text-white"><Search size={16}/></button>
                </div>
                <div className="aspect-square relative overflow-hidden bg-black">
                   <img src={post.mediaUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" alt="" />
                   {post.type === 'video' && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white shadow-2xl">
                          <Play size={24} fill="white"/>
                        </div>
                     </div>
                   )}
                </div>
                <div className="p-6 space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex gap-5">
                         <button className="flex items-center gap-2 text-white hover:text-red-500 transition-all active:scale-125"><Heart size={20}/> <span className="text-xs font-black">{post.likes}</span></button>
                         <button className="text-white hover:text-indigo-400 transition-all"><MessageCircle size={20}/></button>
                         <button className="text-white hover:text-emerald-400 transition-all"><Send size={20}/></button>
                      </div>
                      <button className="text-indigo-400"><Layers size={20}/></button>
                   </div>
                   <p className="text-slate-300 text-sm font-medium"><span className="font-black text-white mr-2 uppercase">{post.userName}</span> {post.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'live' && !isLive && (
           <div className="h-full flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600/10 border-2 border-indigo-500 flex items-center justify-center text-indigo-400 relative">
                 <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-[2.5rem] animate-ping" />
                 <Tv size={48} />
              </div>
              <div className="text-center space-y-2">
                 <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Aura_Broadcaster</h2>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Host Monetized Live Sessions</p>
              </div>
              <button 
                onClick={() => setIsLive(true)}
                className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all"
              >
                Launch Live Session
              </button>
           </div>
        )}

        {activeTab === 'live' && isLive && (
           <div className="h-full flex flex-col animate-in slide-in-from-bottom duration-500">
              <div className="flex-1 bg-black relative flex flex-col items-center justify-center p-6">
                 {/* Live HUD */}
                 <div className="absolute top-6 left-6 flex items-center gap-4">
                    <div className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" /> LIVE
                    </div>
                    <div className="text-white/60 text-[10px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                      1.2K Viewing
                    </div>
                 </div>
                 
                 <button onClick={() => setIsLive(false)} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"><ArrowLeft size={24}/></button>

                 <div className="w-48 h-48 rounded-full border-4 border-indigo-500/40 flex items-center justify-center relative shadow-[0_0_100px_rgba(79,70,229,0.2)]">
                    {isSpeakerActive && (
                       <div className="absolute inset-0 border-8 border-indigo-500 rounded-full animate-[spin_10s_linear_infinite]" style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent' }} />
                    )}
                    <div className="text-center">
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Speaker_Time</p>
                       <p className={`text-4xl font-black tracking-tighter ${speakerTimer < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>00:{speakerTimer.toString().padStart(2, '0')}</p>
                    </div>
                 </div>

                 <div className="absolute bottom-12 w-full max-w-sm flex gap-4">
                    <button 
                      onClick={() => { setHandRaised(!handRaised); if(!handRaised) alert("Hand Raised // Awaiting Host Permission"); }}
                      className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95 ${handRaised ? 'bg-amber-600 text-white shadow-amber-600/20' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'}`}
                    >
                      <Hand size={24} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Raise Hand</span>
                    </button>
                    <button 
                      onClick={() => { setIsSpeakerActive(true); setSpeakerTimer(60); }}
                      className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl flex flex-col items-center gap-2 shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all"
                    >
                      <DollarSign size={24} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Buy Sub</span>
                    </button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'games' && (
          <div className="p-8 space-y-8 max-w-4xl mx-auto">
             <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                   <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Global_Arcade</h1>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Cross-Platform Neural Gaming</p>
                </div>
                <button 
                  onClick={handleSyncPad}
                  className={`px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${controllerSynced ? 'bg-emerald-600 text-white' : 'bg-white/5 border border-white/10 text-slate-400'}`}
                >
                   <Gamepad size={18}/> {controllerSynced ? 'Pad Linked' : 'Sync Console Pad'}
                </button>
             </header>

             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map(game => (
                  <div key={game.id} className="bg-slate-900 border border-white/5 rounded-3xl p-6 hover:bg-slate-800 transition-all group cursor-pointer active-scale">
                     <div className="flex items-center justify-between mb-8">
                        <div className="p-3 bg-white/5 rounded-xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                           {game.genre === 'soccer' ? <Trophy size={20}/> : <ShieldCheck size={20}/>}
                        </div>
                        <div className="flex gap-1">
                           {game.platformSync.map(p => <span key={p} className="text-[7px] font-black text-slate-600 uppercase border border-white/10 px-1.5 py-0.5 rounded">{p}</span>)}
                        </div>
                     </div>
                     <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">{game.title}</h3>
                     <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Global Multiplayer Active</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'networking' && (
           <div className="p-8 space-y-12 max-w-2xl mx-auto">
              <section className="space-y-6">
                 <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">Peer_Discovery</h3>
                 <div className="grid gap-3">
                    {usersToKnow.map(u => (
                       <div key={u.name} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <UserPlus size={20}/>
                             </div>
                             <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">{u.name}</h4>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{u.sub}</p>
                             </div>
                          </div>
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">Follow</button>
                       </div>
                    ))}
                 </div>
              </section>

              <div className="h-px bg-white/5" />

              <section className="space-y-4">
                 <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Identity_Search</h3>
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      placeholder="ENTER_NEURAL_ID..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-indigo-500/50 outline-none"
                    />
                 </div>
              </section>
           </div>
        )}
      </div>

      {/* Floating Gift Panel (Only in Live) */}
      {isLive && isSpeakerActive && (
         <div className="absolute top-24 right-6 flex flex-col gap-3 animate-in slide-in-from-right duration-500">
            <GiftBtn icon={<Heart size={14}/>} label="Love" cost="5" />
            <GiftBtn icon={<PlusSquare size={14}/>} label="Sub" cost="50" />
            <GiftBtn icon={<Zap size={14}/>} label="Hype" cost="10" />
         </div>
      )}
    </div>
  );
};

const TabBtn = ({ active, label, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon} {label}
  </button>
);

const GiftBtn = ({ icon, label, cost }: any) => (
  <button className="bg-indigo-600/20 backdrop-blur-md border border-indigo-500/30 p-3 rounded-2xl flex flex-col items-center gap-1 text-white hover:bg-indigo-600 transition-all group active:scale-90">
     <div className="group-hover:scale-125 transition-transform">{icon}</div>
     <span className="text-[7px] font-black uppercase tracking-widest">${cost}</span>
  </button>
);

export default ContentApp;
