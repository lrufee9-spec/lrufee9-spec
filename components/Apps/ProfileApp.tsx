
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { 
  User, Shield, CreditCard, Settings, LogOut, Key, 
  ChevronRight, Fingerprint, Eye, Wallet, ArrowLeft, RefreshCw 
} from 'lucide-react';

interface Props {
  user: UserProfile;
  onLogout: () => void;
  onBack: () => void;
}

const ProfileApp: React.FC<Props> = ({ user, onLogout, onBack }) => {
  const [balance] = useState(12450.75);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
      {/* Header Area */}
      <div className="px-6 py-6 border-b border-white/5 bg-white/5 backdrop-blur-xl flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Identity_Vault</h2>
        <div className="w-8 h-8" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {/* Profile Card */}
        <section className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-[2.5rem] p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <User size={120} />
          </div>
          <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left gap-6">
            <div className="w-24 h-24 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-2xl">
              <User size={40} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">{user.name}</h3>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                Linked_To: <span className="text-white">{user.robotName}</span>
              </p>
              <div className="flex items-center gap-2 mt-4">
                <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[8px] font-black uppercase rounded tracking-widest flex items-center gap-1">
                  <Shield size={8} /> Verified_Human
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Balance Card */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Wallet size={18} />
              </div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aura_Credits</h4>
            </div>
            <button className="p-2 text-slate-500 hover:text-indigo-400 transition-all"><RefreshCw size={14} /></button>
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
            <div>
              <span className="text-4xl font-black text-white tracking-tighter leading-none">${balance.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 font-bold ml-2 uppercase">USD_EQUIVALENT</span>
            </div>
            <button className="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 shadow-xl">
              Deposit_Funds
            </button>
          </div>
        </section>

        {/* Action Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <SettingsTile 
            icon={<Key />} 
            label="Security Keys" 
            sub="Update Password" 
            color="text-red-400 bg-red-400/10 border-red-400/20"
          />
          <SettingsTile 
            icon={<Fingerprint />} 
            label="Biometrics" 
            sub="Face & Thumb" 
            color="text-indigo-400 bg-indigo-400/10 border-indigo-500/20"
          />
          <SettingsTile 
            icon={<Settings />} 
            label="OS Config" 
            sub="System Tweak" 
            color="text-slate-400 bg-slate-400/10 border-slate-500/20"
          />
          <SettingsTile 
            icon={<CreditCard />} 
            label="Subscription" 
            sub="Pro_Neural" 
            color="text-emerald-400 bg-emerald-400/10 border-emerald-500/20"
          />
        </div>

        {/* Recovery & Help */}
        <div className="p-6 bg-red-600/5 border border-red-600/10 rounded-3xl">
          <h5 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Shield size={12} /> Emergency_Protocol
          </h5>
          <p className="text-[10px] text-slate-500 font-medium mb-4">
            If you've lost your master encryption key, use the Neural Recovery path below. This requires biometric verification.
          </p>
          <button className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
            Initiate Lost Password Recovery <ChevronRight size={12} />
          </button>
        </div>

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="w-full py-5 bg-white/5 border border-white/5 hover:bg-red-600/10 hover:border-red-600/20 text-slate-500 hover:text-red-500 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <LogOut size={18} />
          Terminate_Session
        </button>

        <div className="h-4" />
      </div>
    </div>
  );
};

const SettingsTile = ({ icon, label, sub, color }: any) => (
  <button className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all text-left group">
    <div className={`p-3 rounded-2xl border transition-all ${color}`}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div className="flex-1">
      <h5 className="text-[11px] font-black text-white uppercase tracking-wider">{label}</h5>
      <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5 tracking-widest">{sub}</p>
    </div>
    <ChevronRight size={14} className="text-slate-700 group-hover:text-white transition-all" />
  </button>
);

export default ProfileApp;
