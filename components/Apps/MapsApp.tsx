
import React, { useState, useEffect } from 'react';
import { getMapsInfo } from '../../services/geminiService';
import { 
  MapPin, Search, Navigation, Compass, Target, 
  ArrowLeft, Share2, CameraOff, Car, ShieldAlert, 
  Layers, Map as MapIcon, ChevronRight, X, Zap, 
  Wifi, Info, Send, LocateFixed, Eye
} from 'lucide-react';

interface Props {
  onBack: () => void;
  onLaunchApp: (id: any) => void;
}

const MapsApp: React.FC<Props> = ({ onBack, onLaunchApp }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'scanner' | 'directions'>('map');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: 37.7749, lng: -122.4194 });
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<'camera' | 'traffic' | null>(null);
  const [detectedItems, setDetectedItems] = useState<any[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.log('Location access denied'),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const info = await getMapsInfo(query, coords.lat, coords.lng);
      setResults(info);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (type: 'camera' | 'traffic') => {
    setScanType(type);
    setIsScanning(true);
    setDetectedItems([]);
    
    // Simulate Neural Scanning
    setTimeout(() => {
      setIsScanning(false);
      if (type === 'camera') {
        setDetectedItems([
          { id: 1, name: 'CCTV_NODE_41', distance: '120m', street: '4th & Market' },
          { id: 2, name: 'HIDDEN_LENS_02', distance: '340m', street: 'Mission St' },
          { id: 3, name: 'TRAFFIC_CAM_9', distance: '450m', street: 'Howard Blvd' }
        ]);
      } else {
        setDetectedItems([
          { id: 1, name: 'GRID_LOCK_NODE', level: 'HIGH', street: 'Broadway Exp' },
          { id: 2, name: 'FLOW_STABLE', level: 'LOW', street: 'Pine St' },
          { id: 3, name: 'MINOR_CONGESTION', level: 'MED', street: 'Oak Ave' }
        ]);
      }
    }, 2500);
  };

  const shareToChat = () => {
    alert("NEURAL_RELAY: Location packet [LAT: " + coords.lat.toFixed(4) + "] synced to Aura_Chat.");
    onLaunchApp('chat');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-xl text-red-600">
            <Compass className="animate-pulse" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Aura_Tactical_GPS</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Global Tracking Module</p>
          </div>
        </div>

        <div className="hidden sm:flex bg-white/5 rounded-2xl p-1 border border-white/5">
           <TabBtn active={activeTab === 'map'} label="Map" icon={<MapIcon size={14}/>} onClick={() => setActiveTab('map')} />
           <TabBtn active={activeTab === 'scanner'} label="Scanner" icon={<Eye size={14}/>} onClick={() => setActiveTab('scanner')} />
           <TabBtn active={activeTab === 'directions'} label="Nav" icon={<Navigation size={14}/>} onClick={() => setActiveTab('directions')} />
        </div>
        
        <button onClick={shareToChat} className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg active-scale">
           <Share2 size={18}/>
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-red-600" />
              <input 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="SEARCH_COORDINATES_OR_POI..."
                className="w-full bg-[#0f172a] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white text-xs font-bold focus:border-red-600/40 outline-none transition-all placeholder-slate-800"
              />
              {loading && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />}
            </form>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2">
               {results ? (
                 <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                    <div className="p-6 bg-white/5 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-4 opacity-10 text-red-600"><Target size={60} /></div>
                       <div className="relative z-10 space-y-4">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">Location_Profile</h4>
                          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mono uppercase tracking-tight">{results.text}</p>
                          <div className="flex gap-3 pt-2">
                             <button className="px-6 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20">Set_Destination</button>
                             <button onClick={shareToChat} className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Send size={16}/></button>
                          </div>
                       </div>
                    </div>
                    
                    {results.sources.length > 0 && (
                      <div className="grid gap-3">
                        <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2">Neural_Nodes_Detected</h5>
                        {results.sources.map((chunk: any, i: number) => chunk.maps && (
                          <a 
                            key={i} href={chunk.maps.uri} target="_blank" rel="noreferrer"
                            className="p-5 bg-white/5 border border-white/5 hover:border-red-600/30 rounded-2xl flex items-center justify-between group transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <MapPin className="text-red-600 w-5 h-5" />
                              <span className="text-xs font-black text-white uppercase tracking-widest">{chunk.maps.title || 'RESTRICTED_NODE'}</span>
                            </div>
                            <Navigation className="w-4 h-4 text-slate-700 group-hover:text-red-600 transition-all" />
                          </a>
                        ))}
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-800 gap-8">
                    <div className="relative">
                       <div className="w-48 h-48 border-2 border-dashed border-red-600/10 rounded-full flex items-center justify-center">
                          <MapPin size={64} className="text-red-600/20" />
                       </div>
                       <div className="absolute inset-0 border-2 border-red-600/5 rounded-full animate-ping" />
                    </div>
                    <div className="text-center space-y-2">
                       <p className="font-black uppercase tracking-[0.5em] text-[9px]">Neural_Idle // Global_Hub_Active</p>
                       <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">LAT: {coords.lat.toFixed(4)} // LNG: {coords.lng.toFixed(4)}</p>
                    </div>
                    <button 
                      onClick={() => setQuery("Find nearby tech hubs and robotic cafes")}
                      className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all"
                    >
                      Autoscan_Region
                    </button>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'scanner' && (
          <div className="flex-1 flex flex-col p-8 space-y-8 animate-in fade-in duration-500">
             <header>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Tactical_Scanner</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Surrounding Infrastructure Discovery</p>
             </header>

             <div className="grid sm:grid-cols-2 gap-6">
                <ScanCard 
                  icon={<CameraOff size={24}/>} 
                  label="Hidden Cameras" 
                  sub="4 Street Radius" 
                  color="rose"
                  onClick={() => handleScan('camera')}
                />
                <ScanCard 
                  icon={<Car size={24}/>} 
                  label="Traffic Density" 
                  sub="5 Street Relay" 
                  color="cyan"
                  onClick={() => handleScan('traffic')}
                />
             </div>

             <div className="flex-1 bg-white/5 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
                {isScanning ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                     <div className="w-24 h-24 bg-red-600/10 border-2 border-red-600 rounded-full flex items-center justify-center text-red-500 relative">
                        <div className="absolute inset-0 border-4 border-red-600/20 rounded-full animate-ping" />
                        <Zap size={32} className="animate-pulse" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-lg font-black text-white uppercase italic tracking-tight">SCANNING_NEURAL_SPACE...</p>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Locating {scanType === 'camera' ? 'Unlisted Sensors' : 'Congestion Hubs'}</p>
                     </div>
                  </div>
                ) : detectedItems.length > 0 ? (
                  <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detection_Results: {detectedItems.length}</h4>
                     <div className="grid gap-3">
                        {detectedItems.map(item => (
                          <div key={item.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between group">
                             <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl bg-white/5 ${scanType === 'camera' ? 'text-rose-500' : 'text-cyan-400'}`}>
                                   {scanType === 'camera' ? <ShieldAlert size={18}/> : <Car size={18}/>}
                                </div>
                                <div>
                                   <p className="text-xs font-black text-white uppercase tracking-tight">{item.name || item.street}</p>
                                   <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">Location: {item.street} // Status: {item.distance || item.level}</p>
                                </div>
                             </div>
                             <button className="p-2 text-slate-600 hover:text-white"><Info size={16}/></button>
                          </div>
                        ))}
                     </div>
                     <button onClick={() => setDetectedItems([])} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Clear_Scan_Cache</button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-800 opacity-30 gap-6">
                     <Layers size={64} />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em]">Select Scan Protocol Above</p>
                  </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'directions' && (
          <div className="flex-1 flex flex-col p-8 space-y-10 animate-in slide-in-from-right duration-500">
             <header>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Navigation_Relay</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Route Calibration Protocol</p>
             </header>

             <div className="space-y-6">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4">
                   <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                      <input placeholder="START_LOCATION (MY_NODE)" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-10 pr-6 text-xs text-white outline-none" disabled />
                   </div>
                   <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-600 rounded-full" />
                      <input placeholder="DESTINATION_COORDINATES..." className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-6 text-xs text-white focus:border-red-600/40 outline-none" />
                   </div>
                   <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/30">Calc_Route_Matrix</button>
                </div>

                <div className="grid gap-4">
                   <NavStep step="1" text="Head North-West on Market St" dist="450m" />
                   <NavStep step="2" text="Enter Neural Tunnel 4" dist="1.2km" />
                   <NavStep step="3" text="Arrive at Alpha Hub" dist="Dest" />
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around">
         <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center gap-1 ${activeTab === 'map' ? 'text-red-600' : 'text-slate-500'}`}>
            <MapIcon size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Tactical</span>
         </button>
         <button onClick={() => setActiveTab('scanner')} className={`flex flex-col items-center gap-1 ${activeTab === 'scanner' ? 'text-red-600' : 'text-slate-500'}`}>
            <Eye size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Scanner</span>
         </button>
         <button onClick={() => setActiveTab('directions')} className={`flex flex-col items-center gap-1 ${activeTab === 'directions' ? 'text-red-600' : 'text-slate-500'}`}>
            <Navigation size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Guide</span>
         </button>
         <button onClick={() => {}} className="flex flex-col items-center gap-1 text-slate-500">
            <LocateFixed size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest">Recenter</span>
         </button>
      </div>
    </div>
  );
};

const TabBtn = ({ active, label, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon} {label}
  </button>
);

const ScanCard = ({ icon, label, sub, color, onClick }: any) => {
  const themes: any = {
    rose: 'border-rose-500/20 hover:border-rose-500/50 text-rose-500',
    cyan: 'border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400'
  };
  return (
    <button 
      onClick={onClick}
      className={`p-6 bg-white/5 border rounded-3xl text-left flex items-center gap-6 transition-all group active:scale-95 ${themes[color]}`}
    >
       <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div>
          <h4 className="text-sm font-black text-white uppercase tracking-tight">{label}</h4>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">{sub}</p>
       </div>
    </button>
  );
};

const NavStep = ({ step, text, dist }: any) => (
  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
     <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">{step}</div>
     <p className="flex-1 text-[11px] font-medium text-slate-200">{text}</p>
     <span className="text-[9px] font-black text-red-600 uppercase">{dist}</span>
  </div>
);

export default MapsApp;
