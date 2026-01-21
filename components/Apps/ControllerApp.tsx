
import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Tv, ArrowLeft, Settings, Bluetooth, 
  Wifi, Zap, Monitor, Sliders, Battery, Link,
  CheckCircle, Play, RefreshCw, X, Radio
} from 'lucide-react';

const ControllerApp: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'peripherals' | 'tv' | 'settings'>('peripherals');
  const [isScanning, setIsScanning] = useState(false);
  const [syncedPad, setSyncedPad] = useState<string | null>(null);
  const [tvStatus, setTvStatus] = useState<'disconnected' | 'pairing' | 'connected'>('disconnected');
  const [sensitivity, setSensitivity] = useState(75);
  const [vibration, setVibration] = useState(true);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSyncedPad('AURA_PS5_DUALSENSE');
    }, 2500);
  };

  const handleTvSync = () => {
    setTvStatus('pairing');
    setTimeout(() => {
      setTvStatus('connected');
    }, 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
            <Gamepad2 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Aura_Controller</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Neural Peripheral Interface</p>
          </div>
        </div>

        <div className="hidden sm:flex bg-white/5 rounded-2xl p-1 border border-white/5 shadow-inner">
           <TabBtn active={activeTab === 'peripherals'} label="Gamepads" icon={<Gamepad2 size={14}/>} onClick={() => setActiveTab('peripherals')} />
           <TabBtn active={activeTab === 'tv'} label="TV Sync" icon={<Tv size={14}/>} onClick={() => setActiveTab('tv')} />
           <TabBtn active={activeTab === 'settings'} label="Config" icon={<Settings size={14}/>} onClick={() => setActiveTab('settings')} />
        </div>
        
        <button className="sm:hidden p-2 text-slate-500 hover:text-white"><Sliders size={20}/></button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'peripherals' && (
          <div className="p-8 max-w-4xl mx-auto space-y-10">
             <div className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-[3rem] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                   <Gamepad2 size={160} />
                </div>
                <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left gap-6">
                   <div className="p-5 bg-violet-600 text-white rounded-[2rem] shadow-2xl shadow-violet-600/40">
                      <Bluetooth size={32} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Gamepad_Search</h3>
                      <p className="text-slate-400 text-sm mt-2 max-w-md">Scanning for DualSense, Xbox Wireless, and Aura Neural Controllers within the mesh radius.</p>
                   </div>
                   <button 
                    onClick={handleScan}
                    disabled={isScanning}
                    className="px-10 py-4 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-violet-600/20 hover:bg-violet-500 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                   >
                     {isScanning ? <RefreshCw size={18} className="animate-spin" /> : <Link size={18} />}
                     {isScanning ? 'SEARCHING_NODES...' : 'Initiate_Pairing'}
                   </button>
                </div>
             </div>

             <div className="grid gap-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] px-2">Detected_Hardware</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                   <HardwareCard 
                     icon={<Radio size={20}/>} 
                     name="DualSense Wireless" 
                     id="BT_0x452" 
                     status={syncedPad === 'AURA_PS5_DUALSENSE' ? 'connected' : 'available'} 
                   />
                   <HardwareCard 
                     icon={<Zap size={20}/>} 
                     name="Xbox Elite Series" 
                     id="BT_0x981" 
                     status="available" 
                   />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'tv' && (
          <div className="p-8 max-w-4xl mx-auto space-y-10">
             <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
                <div className="flex-1 bg-black p-10 flex flex-col items-center justify-center text-center gap-6 relative min-h-[300px]">
                   <Monitor size={120} className={`transition-all duration-1000 ${tvStatus === 'connected' ? 'text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]' : 'text-slate-800'}`} />
                   {tvStatus === 'pairing' && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-4">
                           <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                           <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Aura_Display_Sync...</span>
                        </div>
                     </div>
                   )}
                   {tvStatus === 'connected' && (
                     <div className="absolute top-6 left-6 px-3 py-1 bg-cyan-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> SYNCED_4K_60FPS
                     </div>
                   )}
                </div>
                <div className="w-full md:w-80 p-10 space-y-8 bg-slate-900 border-l border-white/5">
                   <div>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Display_Relay</h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Connect to Smart TV or Neural Projector</p>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                         <span>Display_Health</span>
                         <span className={tvStatus === 'connected' ? 'text-emerald-400' : 'text-slate-600'}>{tvStatus === 'connected' ? 'OPTIMAL' : 'OFFLINE'}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <div className={`h-full transition-all duration-1000 ${tvStatus === 'connected' ? 'bg-cyan-500 w-full' : 'bg-slate-700 w-0'}`} />
                      </div>
                   </div>

                   <button 
                    onClick={handleTvSync}
                    disabled={tvStatus !== 'disconnected'}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${tvStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-cyan-600 text-white shadow-xl shadow-cyan-600/30 active:scale-95'}`}
                   >
                      {tvStatus === 'connected' ? 'Connected_To_Main_TV' : 'Scan_For_Displays'}
                   </button>
                </div>
             </div>

             <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-center sm:text-left">
                   <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-500"><Wifi size={24}/></div>
                   <div>
                      <h5 className="text-sm font-black text-white uppercase tracking-tight">Wireless_HDMI_Bridge</h5>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Direct Neural Cast Enabled</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right">
                      <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Latency</p>
                      <p className="text-xs font-black text-emerald-500 tracking-tighter">0.4 ms</p>
                   </div>
                   <div className="w-px h-8 bg-white/10 mx-2" />
                   <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10">Configure</button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-8 max-w-2xl mx-auto space-y-8">
             <header>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Neural_Config</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Latency & Haptic Fine-Tuning</p>
             </header>

             <div className="space-y-6">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-6">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <span>Stick_Sensitivity</span>
                         <span className="text-violet-400">{sensitivity}%</span>
                      </div>
                      <input 
                        type="range" 
                        value={sensitivity}
                        onChange={e => setSensitivity(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none accent-violet-500" 
                      />
                   </div>

                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-white/5 rounded-xl text-slate-500"><Zap size={18}/></div>
                         <div>
                            <p className="text-[11px] font-black text-white uppercase tracking-wider">Haptic_Feedback</p>
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest">Neural Impulse Vibration</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => setVibration(!vibration)}
                        className={`w-12 h-6 rounded-full transition-all relative ${vibration ? 'bg-violet-600' : 'bg-slate-800'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${vibration ? 'right-1' : 'left-1'}`} />
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <ConfigCard label="Button_Mapping" sub="Neural Remap" />
                   <ConfigCard label="Adaptive_Triggers" sub="Sync Force" />
                   <ConfigCard label="Audio_Pass_Through" sub="Pad Speaker" />
                   <ConfigCard label="Energy_Saver" sub="Auto Standby" />
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Back to Hub Navigation (Mobile Only) */}
      <div className="sm:hidden p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/5">
         <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
            <TabBtn active={activeTab === 'peripherals'} label="Pad" icon={<Gamepad2 size={14}/>} onClick={() => setActiveTab('peripherals')} />
            <TabBtn active={activeTab === 'tv'} label="TV" icon={<Tv size={14}/>} onClick={() => setActiveTab('tv')} />
            <TabBtn active={activeTab === 'settings'} label="Cfg" icon={<Settings size={14}/>} onClick={() => setActiveTab('settings')} />
         </div>
      </div>
    </div>
  );
};

const TabBtn = ({ active, label, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon} {label}
  </button>
);

const HardwareCard = ({ icon, name, id, status }: any) => (
  <div className={`bg-white/5 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/10 transition-all ${status === 'connected' ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
     <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${status === 'connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
           {icon}
        </div>
        <div>
           <h4 className="text-xs font-black text-white uppercase tracking-tight">{name}</h4>
           <p className="text-[8px] font-mono text-slate-500 mt-0.5">{id}</p>
        </div>
     </div>
     {status === 'connected' ? (
       <div className="flex flex-col items-end gap-1">
          <CheckCircle size={14} className="text-emerald-500" />
          <div className="flex items-center gap-1.5 text-[7px] text-slate-500 font-black uppercase">
             <Battery size={10} className="text-emerald-500"/> 84%
          </div>
       </div>
     ) : (
       <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest">Pair</button>
     )}
  </div>
);

const ConfigCard = ({ label, sub }: any) => (
  <button className="p-6 bg-white/5 border border-white/5 rounded-3xl text-left hover:bg-white/10 transition-all group">
     <h5 className="text-[10px] font-black text-white uppercase tracking-wider mb-1 group-hover:text-violet-400 transition-colors">{label}</h5>
     <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{sub}</p>
  </button>
);

export default ControllerApp;
