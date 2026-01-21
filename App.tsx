import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, AppID } from './types';
import { AuraAPI } from './services/api';
import LoginPage from './components/Auth/LoginPage';
import OSHome from './components/OS/OSHome';
import ChatApp from './components/Apps/ChatApp';
import TerminalApp from './components/Apps/TerminalApp';
import MapsApp from './components/Apps/MapsApp';
import SecurityApp from './components/Apps/SecurityApp';
import RobotNetwork from './components/Apps/RobotNetwork';
import ProfileApp from './components/Apps/ProfileApp';
import ContentApp from './components/Apps/ContentApp';
import InboxApp from './components/Apps/InboxApp';
import VideoApp from './components/Apps/VideoApp';
import BooksApp from './components/Apps/BooksApp';
import FilesApp from './components/Apps/FilesApp';
import ControllerApp from './components/Apps/ControllerApp';
import CameraApp from './components/Apps/CameraApp';
import ExtensionsApp from './components/Apps/ExtensionsApp';
import StorageApp from './components/Apps/StorageApp';
import DJMusicApp from './components/Apps/DJMusicApp';
import { 
  Home, MessageSquare, Terminal, Map as MapIcon, 
  Database, Bell, User, Zap, Shield, Radio, PlayCircle, Mail, Film, BookOpen, Folder, Gamepad2, Camera, Puzzle, 
  Menu, X, Search, Settings, Layout, Command, CommandIcon, AlertCircle, RefreshCcw
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeApp, setActiveApp] = useState<AppID>('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const checkBack = async () => {
    setBackendStatus('checking');
    const isUp = await AuraAPI.checkConnection();
    setBackendStatus(isUp ? 'online' : 'offline');
  };

  useEffect(() => {
    checkBack();
    const interval = setInterval(checkBack, 15000); // Check every 15s

    const saved = localStorage.getItem('aura_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (e) { localStorage.removeItem('aura_user'); }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  const handleLogin = (profile: UserProfile) => {
    const freshProfile = { ...profile, credits: profile.credits || 12450.75, installedApps: profile.installedApps || [] };
    setUser(freshProfile);
    setActiveApp('home');
    localStorage.setItem('aura_user', JSON.stringify(freshProfile));
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_user');
    setUser(null);
    setActiveApp('home');
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'home': return <OSHome onLaunchApp={setActiveApp} installedApps={user.installedApps} />;
      case 'chat': return <ChatApp />;
      case 'terminal': return <TerminalApp />;
      case 'maps': return <MapsApp onBack={() => setActiveApp('home')} onLaunchApp={setActiveApp} />;
      case 'security': return <SecurityApp />;
      case 'network': return <RobotNetwork />;
      case 'content': return <ContentApp />;
      case 'inbox': return <InboxApp />;
      case 'video': return <VideoApp />;
      case 'books': return <BooksApp onBack={() => setActiveApp('home')} />;
      case 'files': return <FilesApp onBack={() => setActiveApp('home')} onLaunchApp={setActiveApp} />;
      case 'controller': return <ControllerApp onBack={() => setActiveApp('home')} />;
      case 'camera': return <CameraApp onBack={() => setActiveApp('home')} />;
      case 'extensions': return <ExtensionsApp user={user} onUpdateUser={() => {}} onBack={() => setActiveApp('home')} />;
      case 'storage': return <StorageApp onBack={() => setActiveApp('home')} onLaunchDJ={() => setActiveApp('djmusic')} />;
      case 'djmusic': return <DJMusicApp onBack={() => setActiveApp('storage')} />;
      case 'profile': return <ProfileApp user={user} onLogout={handleLogout} onBack={() => setActiveApp('home')} />;
      default: return <OSHome onLaunchApp={setActiveApp} installedApps={user.installedApps} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#020617] text-slate-200 overflow-hidden relative font-['Plus_Jakarta_Sans']">
      
      {/* Backend Status Notification */}
      {backendStatus === 'offline' && (
        <div className="fixed top-0 inset-x-0 z-[300] bg-red-600/90 backdrop-blur-md py-3 px-6 flex flex-col items-center justify-center gap-2 animate-in slide-in-from-top duration-500 shadow-2xl">
           <div className="flex items-center justify-center gap-3">
              <AlertCircle size={18} className="animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                Neural Link Failure: Core server unreachable
              </span>
              <button 
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="ml-4 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase hover:bg-white/30 transition-all"
              >
                {showDiagnostics ? 'Hide Info' : 'Diagnostics'}
              </button>
           </div>
           {showDiagnostics && (
             <div className="max-w-xl text-[9px] font-medium text-white/80 bg-black/20 p-4 rounded-xl border border-white/10 mt-1 animate-in fade-in zoom-in duration-300">
               <p className="mb-2">1. Ensure <strong>node server.js</strong> is running in your terminal.</p>
               <p className="mb-2">2. Current Probing Host: <code className="bg-black/40 px-1 rounded">{AuraAPI.getApiUrl()}</code></p>
               <p className="mb-3">3. VirtualBox Check: Ensure <strong>Port Forwarding</strong> for 3001 is set in VB settings.</p>
               <button 
                 onClick={checkBack}
                 className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all font-black uppercase text-[8px]"
               >
                 {/* Fix: Cast backendStatus to any to bypass TypeScript's narrowing which incorrectly flags this as impossible since we are inside an 'offline' block */}
                 <RefreshCcw size={10} className={(backendStatus as any) === 'checking' ? 'animate-spin' : ''} />
                 Re-probe Connection
               </button>
             </div>
           )}
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-2xl flex items-start justify-center pt-32 px-6">
           <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 border-b border-white/10 flex items-center gap-6">
                 <CommandIcon size={28} className="text-indigo-500" />
                 <input 
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Universal Search Core..."
                  className="flex-1 bg-transparent border-none text-xl font-black text-white uppercase italic tracking-tighter outline-none placeholder-slate-800"
                 />
                 <button onClick={() => setSearchOpen(false)} className="p-2 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">ESC</button>
              </div>
              <div className="p-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                 <SearchItem icon={<MessageSquare/>} label="Ask Aura" sub={`Query "${searchQuery}" in Neural Link`} onClick={() => { setActiveApp('chat'); setSearchOpen(false); }} />
                 <SearchItem icon={<Mail/>} label="Search Comms" sub="Lookup emails and story nodes" onClick={() => { setActiveApp('inbox'); setSearchOpen(false); }} />
                 <SearchItem icon={<Folder/>} label="Vault Access" sub="Search files and manifests" onClick={() => { setActiveApp('files'); setSearchOpen(false); }} />
                 <SearchItem icon={<Shield/>} label="Sentinel Guard" sub="Check security logs" onClick={() => { setActiveApp('security'); setSearchOpen(false); }} />
              </div>
           </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col w-20 xl:w-72 border-r border-white/5 bg-slate-950/80 backdrop-blur-3xl z-50 transition-all duration-500`}>
        <div className="h-24 flex items-center px-8 border-b border-white/5">
           <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/40 active-scale cursor-pointer" onClick={() => setSearchOpen(true)}>
              <Zap className="text-white w-7 h-7" />
           </div>
           <span className="ml-5 hidden xl:block font-black text-white uppercase tracking-tighter italic text-lg">Aura_OS</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
           <SidebarLink active={activeApp === 'home'} icon={<Home size={22}/>} label="Neural Hub" onClick={() => setActiveApp('home')} />
           <SidebarLink active={activeApp === 'chat'} icon={<MessageSquare size={22}/>} label="Neural Chat" onClick={() => setActiveApp('chat')} />
           <SidebarLink active={activeApp === 'storage'} icon={<Database size={22}/>} label="Data Storage" onClick={() => setActiveApp('storage')} />
           <SidebarLink active={activeApp === 'files'} icon={<Folder size={22}/>} label="Vault Explorer" onClick={() => setActiveApp('files')} />
           <SidebarLink active={activeApp === 'extensions'} icon={<Puzzle size={22}/>} label="Marketplace" onClick={() => setActiveApp('extensions')} />
           <SidebarLink active={activeApp === 'video'} icon={<Film size={22}/>} label="Cinema Lab" onClick={() => setActiveApp('video')} />
           <div className="pt-6 mt-6 border-t border-white/5">
             <SidebarLink active={activeApp === 'security'} icon={<Shield size={22}/>} label="Security Guard" onClick={() => setActiveApp('security')} />
             <SidebarLink active={activeApp === 'profile'} icon={<User size={22}/>} label="Personal ID" onClick={() => setActiveApp('profile')} />
           </div>
        </nav>

        <div className="p-6 border-t border-white/5">
           <button onClick={() => setSearchOpen(true)} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all mb-4">
              <span>Command Hub</span>
              <span className="opacity-40">⌘K</span>
           </button>
           <button onClick={handleLogout} className="w-full p-4 hover:bg-red-500/10 hover:text-red-500 transition-all rounded-2xl flex items-center justify-center gap-4 active-scale">
              <X size={22} /> <span className="hidden xl:block text-xs font-black uppercase tracking-widest">Shutdown</span>
           </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
        <header className="lg:hidden h-16 px-6 flex items-center justify-between border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl z-40">
           <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg active-scale" onClick={() => setSearchOpen(true)}>
                <Zap size={18} fill="white" />
              </div>
              <span className="text-[12px] font-black text-white uppercase tracking-tighter italic leading-none">{user.robotName}</span>
           </div>
           <div className="flex items-center gap-4">
              <Search size={20} className="text-slate-400" onClick={() => setSearchOpen(true)} />
              <div onClick={() => setActiveApp('profile')} className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center active-scale overflow-hidden shadow-xl">
                 <User size={16} className="text-indigo-400" />
              </div>
           </div>
        </header>

        <main className="flex-1 relative overflow-hidden flex flex-col custom-scrollbar bg-slate-950 sm:bg-transparent">
           {renderActiveApp()}
        </main>

        <nav className="lg:hidden h-[84px] px-6 border-t border-white/5 bg-slate-950/90 backdrop-blur-3xl flex items-center justify-around pb-[env(safe-area-inset-bottom)] z-50">
           <DockItem active={activeApp === 'home'} icon={<Home size={24}/>} label="Home" onClick={() => setActiveApp('home')} />
           <DockItem active={activeApp === 'chat'} icon={<MessageSquare size={24}/>} label="Neural" onClick={() => setActiveApp('chat')} />
           <DockItem active={activeApp === 'storage'} icon={<Database size={24}/>} label="Data" onClick={() => setActiveApp('storage')} />
           <DockItem active={activeApp === 'extensions'} icon={<Puzzle size={24}/>} label="Store" onClick={() => setActiveApp('extensions')} />
           <DockItem active={activeApp === 'files'} icon={<Folder size={24}/>} label="Vault" onClick={() => setActiveApp('files')} />
        </nav>
      </div>
    </div>
  );
};

const SearchItem = ({ icon, label, sub, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center gap-6 p-6 rounded-[1.5rem] hover:bg-indigo-600/10 border border-transparent hover:border-indigo-500/20 transition-all text-left group">
     <div className="p-4 bg-white/5 rounded-2xl text-slate-500 group-hover:text-indigo-400 transition-colors">{icon}</div>
     <div>
        <h4 className="text-sm font-black text-white uppercase tracking-tight">{label}</h4>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{sub}</p>
     </div>
  </button>
);

const SidebarLink = ({ active, icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 rounded-2xl flex items-center gap-5 transition-all group active-scale border ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border-indigo-500' : 'text-slate-500 hover:bg-white/5 hover:text-white border-transparent'}`}
  >
    <div className={`transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
    <span className="hidden xl:block text-sm font-black uppercase tracking-widest">{label}</span>
  </button>
);

const DockItem = ({ active, icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all active-scale ${active ? 'text-indigo-400' : 'text-slate-500'}`}
  >
    <div className={`p-2.5 rounded-2xl transition-all ${active ? 'bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/10' : ''}`}>
       {React.cloneElement(icon, { strokeWidth: active ? 2.5 : 2 })}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;