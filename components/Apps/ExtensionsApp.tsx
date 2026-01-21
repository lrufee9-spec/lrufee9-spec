
import React, { useState } from 'react';
import { 
  Puzzle, ArrowLeft, BookOpen, Film, CreditCard, Gamepad2, 
  Download, Zap, Search, Star, Shield, Filter, Plus, Check,
  Sparkles, Video, Play, Award, ShoppingCart, RefreshCcw
} from 'lucide-react';
import { UserProfile } from '../../types';

interface Props {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onBack: () => void;
}

const ExtensionsApp: React.FC<Props> = ({ user, onUpdateUser, onBack }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'class' | 'ai-video' | 'gift-card' | 'games'>('all');
  const [installingId, setInstallingId] = useState<string | null>(null);

  const handlePurchaseGiftCard = (amount: number) => {
    const confirmBuy = window.confirm(`Initiate Neural Transaction for $${amount} Credit?`);
    if (confirmBuy) {
      const updatedUser = {
        ...user,
        credits: (user.credits || 0) + amount
      };
      onUpdateUser(updatedUser);
      alert(`TRANSACTION_SUCCESS: $${amount} added to ${user.robotName}'s core wallet.`);
    }
  };

  const handleInstallGame = (gameId: string, gameName: string) => {
    if (user.installedApps?.includes(gameId)) return;
    
    setInstallingId(gameId);
    setTimeout(() => {
      const updatedUser = {
        ...user,
        installedApps: [...(user.installedApps || []), gameId]
      };
      onUpdateUser(updatedUser);
      setInstallingId(null);
      alert(`INSTALLATION_COMPLETE: ${gameName} synced to Home Desktop.`);
    }, 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
            <Puzzle size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Aura_Market</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Neural Extensions & Mods</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active_Balance</span>
            <span className="text-sm font-black text-emerald-400 italic">${(user.credits || 0).toLocaleString()}</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Category Ribbon */}
      <div className="px-6 py-3 bg-slate-950/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto scroll-hide">
        <CatBtn active={activeCategory === 'all'} label="All Modals" onClick={() => setActiveCategory('all')} />
        <CatBtn active={activeCategory === 'class'} label="Academy Classes" icon={<Award size={12}/>} onClick={() => setActiveCategory('class')} />
        <CatBtn active={activeCategory === 'ai-video'} label="AI Media Lab" icon={<Sparkles size={12}/>} onClick={() => setActiveCategory('ai-video')} />
        <CatBtn active={activeCategory === 'gift-card'} label="Credit Nodes" icon={<CreditCard size={12}/>} onClick={() => setActiveCategory('gift-card')} />
        <CatBtn active={activeCategory === 'games'} label="Gaming Packs" icon={<Gamepad2 size={12}/>} onClick={() => setActiveCategory('games')} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Classes / Academy */}
          {(activeCategory === 'all' || activeCategory === 'class') && (
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">Aura_Academy // Classes</h3>
                <span className="text-[10px] text-slate-600 font-black uppercase">3 Modules Available</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ExtensionCard 
                  title="Neural Prompting" 
                  desc="Master the art of AI communication via robotic protocols." 
                  icon={<BookOpen size={24}/>} 
                  price="FREE"
                  color="indigo"
                />
                <ExtensionCard 
                  title="Cyber Security 101" 
                  desc="Learn to defend your personal neural mesh from intrusion." 
                  icon={<Shield size={24}/>} 
                  price="$25.00"
                  color="red"
                />
                <ExtensionCard 
                  title="Robotic Logic" 
                  desc="Understanding the decision trees of Aura-X core." 
                  icon={<Zap size={24}/>} 
                  price="$15.00"
                  color="amber"
                />
              </div>
            </section>
          )}

          {/* AI Video Edit */}
          {(activeCategory === 'all' || activeCategory === 'ai-video') && (
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-[0.4em]">Neural_Studio // AI Video Edit</h3>
              </div>
              <div className="bg-gradient-to-br from-rose-600/10 to-purple-600/10 border border-rose-500/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-full md:w-1/2 aspect-video bg-black rounded-[2rem] border border-white/10 overflow-hidden relative group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-rose-600/40">
                      <Play size={24} fill="white" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 inset-x-6 flex gap-2">
                    <div className="h-1 bg-rose-600 flex-1 rounded-full" />
                    <div className="h-1 bg-white/20 flex-1 rounded-full" />
                    <div className="h-1 bg-white/20 flex-1 rounded-full" />
                  </div>
                </div>
                <div className="flex-1 space-y-6 text-center md:text-left">
                  <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">AI_Cinematic_Morph</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Automatically enhance, edit, and morph your captures into high-fidelity cinematic masterpieces using Aura's cloud GPU clusters.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <button className="px-8 py-3 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-600/30 active:scale-95">Open Media Lab</button>
                    <button className="px-8 py-3 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">Subscription Options</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Gift Cards */}
          {(activeCategory === 'all' || activeCategory === 'gift-card') && (
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em]">Credit_Nodes // Gift Cards</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <GiftCard amount={10} onClick={() => handlePurchaseGiftCard(10)} />
                <GiftCard amount={25} onClick={() => handlePurchaseGiftCard(25)} />
                <GiftCard amount={50} onClick={() => handlePurchaseGiftCard(50)} />
                <GiftCard amount={100} onClick={() => handlePurchaseGiftCard(100)} />
              </div>
            </section>
          )}

          {/* Game Packs */}
          {(activeCategory === 'all' || activeCategory === 'games') && (
            <section className="space-y-6 pb-20">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.4em]">Gaming_Modals // pack game</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <GameExtensionCard 
                  id="game_soccer_elite"
                  title="Soccer Elite X" 
                  desc="High-octane neural soccer league for the Aura platform." 
                  price="$9.99"
                  isInstalled={user.installedApps?.includes('game_soccer_elite')}
                  isInstalling={installingId === 'game_soccer_elite'}
                  onInstall={() => handleInstallGame('game_soccer_elite', 'Soccer Elite X')}
                />
                <GameExtensionCard 
                  id="game_mortal_combat"
                  title="Mortal Combat: Aura" 
                  desc="Neural link fighting championship. Full cross-play." 
                  price="$14.99"
                  isInstalled={user.installedApps?.includes('game_mortal_combat')}
                  isInstalling={installingId === 'game_mortal_combat'}
                  onInstall={() => handleInstallGame('game_mortal_combat', 'Mortal Combat: Aura')}
                />
                <GameExtensionCard 
                  id="game_cyber_kart"
                  title="Cyber Kart 3000" 
                  desc="Gravitational racing pack. New maps and vehicle nodes." 
                  price="$4.99"
                  isInstalled={user.installedApps?.includes('game_cyber_kart')}
                  isInstalling={installingId === 'game_cyber_kart'}
                  onInstall={() => handleInstallGame('game_cyber_kart', 'Cyber Kart 3000')}
                />
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

const CatBtn = ({ active, label, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all min-w-max border ${active ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'}`}
  >
    {icon} {label}
  </button>
);

const ExtensionCard = ({ title, desc, icon, price, color }: any) => {
  const colors: any = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    red: 'text-red-400 bg-red-400/10 border-red-500/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-500/20',
  };

  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 transition-all group">
      <div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 ${colors[color]}`}>
          {icon}
        </div>
        <h4 className="text-lg font-black text-white uppercase tracking-tight italic mb-2">{title}</h4>
        <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm font-black text-white">{price}</span>
        <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};

const GiftCard = ({ amount, onClick }: any) => (
  <button 
    onClick={onClick}
    className="aspect-[1.6/1] bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between text-left group hover:scale-105 active:scale-95 transition-all relative overflow-hidden"
  >
    <div className="absolute -top-4 -right-4 opacity-5 text-white group-hover:scale-125 transition-transform duration-1000">
      <CreditCard size={80} />
    </div>
    <div className="flex justify-between items-start">
      <div className="p-2 bg-emerald-500 text-white rounded-lg">
        <Zap size={14} fill="white" />
      </div>
      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Aura_Node</span>
    </div>
    <div className="space-y-1">
      <p className="text-3xl font-black text-white tracking-tighter italic leading-none">${amount}</p>
      <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Universal_Credit</p>
    </div>
  </button>
);

const GameExtensionCard = ({ title, desc, price, onInstall, isInstalled, isInstalling }: any) => (
  <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 flex flex-col group relative overflow-hidden">
    <div className="flex-1 space-y-4">
      <div className="w-14 h-14 bg-cyan-600/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400">
        <Gamepad2 size={24} />
      </div>
      <div>
        <h4 className="text-xl font-black text-white uppercase italic tracking-tight">{title}</h4>
        <p className="text-slate-500 text-xs leading-relaxed mt-2">{desc}</p>
      </div>
    </div>
    <div className="mt-8 flex items-center justify-between">
      <span className="text-sm font-black text-cyan-400 italic">{price}</span>
      <button 
        onClick={onInstall}
        disabled={isInstalled || isInstalling}
        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
          isInstalled 
          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default' 
          : 'bg-cyan-600 text-white shadow-xl shadow-cyan-600/20 active:scale-95 hover:bg-cyan-500'
        }`}
      >
        {isInstalling ? <RefreshCcw size={12} className="animate-spin" /> : isInstalled ? <Check size={12}/> : <Download size={12}/>}
        {isInstalling ? 'Syncing...' : isInstalled ? 'Installed' : 'Install'}
      </button>
    </div>
  </div>
);

export default ExtensionsApp;
