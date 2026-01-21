
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Fingerprint, ShieldCheck, Sparkles, ChevronRight, Zap } from 'lucide-react';

interface Props {
  onLogin: (profile: UserProfile) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [robotName, setRobotName] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin({ 
        name: 'Admin', 
        robotName: robotName || 'Aura-X', 
        isLoggedIn: true,
        bioRegistered: true 
      });
    }, 2000);
  };

  return (
    <div className="h-full bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 mx-auto flex items-center justify-center shadow-2xl mb-8 animate-pulse">
            <Zap className="text-indigo-400 w-8 h-8 fill-indigo-400/20" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Robot_Initiation</h1>
          <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-[0.4em]">Personal Intelligence Setup</p>
        </div>

        {isAuthenticating ? (
          <div className="flex flex-col items-center gap-6 py-12">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.5em]">Binding_Neural_Cores...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
               <div>
                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-2 px-2">Robot Custom Designation</label>
                <input 
                  type="text" 
                  placeholder="e.g. AURA-7, SENTINEL, NOVA"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-600 outline-none transition-all placeholder-slate-700"
                  value={robotName}
                  onChange={e => setRobotName(e.target.value)}
                />
              </div>
            </div>

            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 hover:bg-indigo-500 active:scale-[0.98] transition-all">
              Initialize Bio-Link
              <Fingerprint size={18} />
            </button>

            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
               <ShieldCheck size={20} className="text-indigo-400" />
               <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                 Biometric data is encrypted locally and shared only via the Neural Mesh Network.
               </p>
            </div>
          </form>
        )}
      </div>

      <div className="mt-20 flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase tracking-widest">
        Aura Robotic Subsystem // v5.0.2 Secure
      </div>
    </div>
  );
};

export default LoginPage;
