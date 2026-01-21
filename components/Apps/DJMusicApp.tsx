
import React, { useState, useEffect, useRef } from 'react';
import { 
  Disc, ArrowLeft, Search, Download, Trash2, 
  Settings, Music, Play, Waves, Zap, Scissors, 
  Share2, Save, MoreVertical, CheckCircle, RefreshCcw,
  FileAudio, Video, FileOutput, MousePointer2, Layers, X,
  Pause, SkipBack, SkipForward, Volume2
} from 'lucide-react';
import { Track } from '../../types';

interface Props {
  onBack: () => void;
}

const DJMusicApp: React.FC<Props> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<'browse' | 'analysis' | 'sync'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPos, setPlaybackPos] = useState(0);
  
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: 't1',
      name: 'Cyber_Synth_Loop_124.mp3',
      type: 'audio',
      category: 'music',
      url: '',
      timestamp: new Date(),
      size: '12.4 MB',
      isPrivate: false,
      bpm: 124,
      key: 'Am',
      cues: [10, 32, 64],
      beatgridSet: true,
      phraseSet: true,
      format: 'mp3'
    },
    {
      id: 't2',
      name: 'Deep_Neural_Bass.wav',
      type: 'audio',
      category: 'music',
      url: '',
      timestamp: new Date(Date.now() - 3600000),
      size: '48.2 MB',
      isPrivate: false,
      bpm: 128,
      key: 'Fm',
      cues: [],
      beatgridSet: false,
      phraseSet: false,
      format: 'wav'
    }
  ]);

  useEffect(() => {
    let interval: number;
    if (isPlaying && playbackPos < 100) {
      interval = window.setInterval(() => {
        setPlaybackPos(prev => (prev + 0.5) % 100);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackPos]);

  const handleDownload = () => {
    if (!searchQuery) return;
    setIsDownloading(true);
    setTimeout(() => {
      const newTrack: Track = {
        id: `t${Date.now()}`,
        name: `${searchQuery.split('/').pop() || 'Downloaded_Track'}.mp3`,
        type: 'audio',
        category: 'music',
        url: '',
        timestamp: new Date(),
        size: '15.0 MB',
        isPrivate: false,
        bpm: 126,
        key: 'Cm',
        cues: [],
        beatgridSet: false,
        phraseSet: false,
        format: 'mp3'
      };
      setTracks([newTrack, ...tracks]);
      setIsDownloading(false);
      setSearchQuery('');
    }, 3000);
  };

  const handleAnalysis = (track: Track) => {
    setSelectedTrack(track);
    setActiveMode('analysis');
    setPlaybackPos(0);
    setIsPlaying(false);
  };

  const toggleCue = (pos: number) => {
    if (!selectedTrack) return;
    const newCues = selectedTrack.cues.includes(pos)
      ? selectedTrack.cues.filter(c => c !== pos)
      : [...selectedTrack.cues, pos].sort((a, b) => a - b);
    
    const updated = { ...selectedTrack, cues: newCues };
    setSelectedTrack(updated);
    setTracks(tracks.map(t => t.id === selectedTrack.id ? updated : t));
  };

  const handleExport = (platform: string) => {
    alert(`NEURAL_BRIDGE_ACTIVE: Generating ${platform} metadata package. Filename: AURA_COLLECTION.xml`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Dynamic Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500">
            <Disc className={`${isPlaying ? 'animate-[spin_2s_linear_infinite]' : ''}`} size={20} />
          </div>
          <div className="hidden xs:block">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">DJ_Neural_Pro</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Integrated Audio Subsystem</p>
          </div>
        </div>

        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
           <TabBtn active={activeMode === 'browse'} label="Library" icon={<Download size={14}/>} onClick={() => setActiveMode('browse')} />
           <TabBtn active={activeMode === 'analysis'} label="Deck" icon={<Waves size={14}/>} onClick={() => setActiveMode('analysis')} />
           <TabBtn active={activeMode === 'sync'} label="Bridge" icon={<RefreshCcw size={14}/>} onClick={() => setActiveMode('sync')} />
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeMode === 'browse' && (
          <div className="flex-1 flex flex-col p-6 lg:p-12 space-y-10 overflow-hidden">
             {/* Search/Download Section */}
             <div className="max-w-4xl mx-auto w-full space-y-4">
                <div className="relative group">
                   <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                     <Search className="text-slate-600 group-focus-within:text-rose-500 transition-colors" size={20} />
                   </div>
                   <input 
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     placeholder="PASTE_LINK_OR_SEARCH_YOUTUBE..."
                     className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-6 text-sm text-white focus:border-rose-500/50 outline-none transition-all placeholder-slate-700 font-black uppercase tracking-tight"
                   />
                </div>
                <div className="flex flex-wrap gap-3">
                   <FormatBtn label="MP3" active />
                   <FormatBtn label="WAV" />
                   <FormatBtn label="FLAC" />
                   <div className="flex-1" />
                   <button 
                    onClick={handleDownload}
                    disabled={isDownloading || !searchQuery}
                    className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-rose-600/30 active:scale-95 disabled:opacity-50 flex items-center gap-3 transition-all"
                   >
                     {isDownloading ? <RefreshCcw size={14} className="animate-spin" /> : <Download size={14} />}
                     {isDownloading ? 'PULSING_DATA...' : 'Initialize_Fetch'}
                   </button>
                </div>
             </div>

             {/* Library Grid */}
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                <div className="flex justify-between items-center px-2">
                   <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Local_Cache_Registry</h3>
                   <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{tracks.length} Objects Analyzed</span>
                </div>
                <div className="grid gap-4">
                   {tracks.map(track => (
                     <div 
                      key={track.id} 
                      onClick={() => handleAnalysis(track)}
                      className="group bg-white/5 border border-white/5 rounded-[2.5rem] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
                     >
                        <div className="flex items-center gap-6 relative z-10">
                           <div className="p-5 bg-rose-500/10 rounded-2xl text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-lg group-hover:shadow-rose-600/30">
                              <Music size={24} />
                           </div>
                           <div>
                              <h4 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">{track.name}</h4>
                              <div className="flex items-center gap-4 mt-2">
                                 <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{track.bpm} BPM</span>
                                 <div className="w-1 h-1 bg-slate-800 rounded-full" />
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{track.key}</span>
                                 <div className="w-1 h-1 bg-slate-800 rounded-full" />
                                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{track.size}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4 md:mt-0 relative z-10">
                           <div className="flex gap-2">
                              {track.beatgridSet && <AnalysisBadge label="GRID" />}
                              {track.phraseSet && <AnalysisBadge label="PHR" />}
                              {track.cues.length > 0 && <AnalysisBadge label={`CUE[${track.cues.length}]`} />}
                           </div>
                           <div className="w-px h-10 bg-white/5 hidden md:block" />
                           <button className="p-3 text-slate-600 hover:text-white transition-all"><MoreVertical size={20}/></button>
                        </div>
                        {/* Interactive Waveform Background */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                           <div className="flex h-full items-center gap-1">
                              {[...Array(40)].map((_, i) => (
                                <div key={i} className="flex-1 bg-white" style={{ height: `${20 + Math.random() * 80}%` }} />
                              ))}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeMode === 'analysis' && selectedTrack && (
          <div className="flex-1 flex flex-col p-6 lg:p-12 space-y-8 animate-in zoom-in duration-500">
             <header className="flex items-center justify-between">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedTrack.name}</h3>
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] mt-3">Advanced Deck Analysis // {selectedTrack.bpm} BPM</p>
                </div>
                <button onClick={() => setActiveMode('browse')} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all active-scale"><X size={24}/></button>
             </header>

             {/* Interactive Waveform Display */}
             <div className="bg-black/40 border border-white/5 rounded-[3rem] p-12 h-80 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 flex items-center gap-1 px-8">
                   {[...Array(120)].map((_, i) => (
                     <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-all duration-300 ${i < (playbackPos * 1.2) ? 'bg-rose-500' : 'bg-slate-700'}`}
                      style={{ height: `${20 + Math.sin(i * 0.2) * 40 + Math.random() * 40}%` }}
                     />
                   ))}
                </div>
                
                {/* Cue Point Markers */}
                {selectedTrack.cues.map(pos => (
                   <div 
                    key={pos}
                    className="absolute top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_20px_orange] z-30 transition-all cursor-pointer group"
                    style={{ left: `${pos}%` }}
                    onClick={() => toggleCue(pos)}
                   >
                      <div className="absolute -top-4 -translate-x-1/2 bg-amber-500 text-black text-[8px] font-black px-2 py-1 rounded shadow-xl uppercase italic">CUE_{pos}</div>
                   </div>
                ))}

                {/* Playhead */}
                <div className="absolute top-0 bottom-0 w-0.5 bg-white z-40 shadow-[0_0_30px_white] transition-all duration-75" style={{ left: `${playbackPos}%` }}>
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full blur-[4px]" />
                </div>
                
                <p className="relative z-30 text-[11px] font-black text-white/20 uppercase tracking-[1em] text-center select-none">AURA_WAVE_VISUALIZER_v2</p>
             </div>

             {/* Pro Transport Controls */}
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-10 rounded-[3rem] border transition-all active:scale-95 flex flex-col items-center justify-center gap-4 ${isPlaying ? 'bg-rose-600 border-rose-500 text-white shadow-2xl shadow-rose-600/30' : 'bg-white/5 border-white/5 text-white hover:bg-white/10'}`}
                >
                  {isPlaying ? <Pause size={40} fill="white" /> : <Play size={40} fill="white" />}
                  <span className="text-[10px] font-black uppercase tracking-widest">{isPlaying ? 'STOP_STREAM' : 'DECK_PLAY'}</span>
                </button>
                <AnalysisTool 
                  icon={<Zap size={24}/>} 
                  label="Snap Beatgrid" 
                  sub="Auto-Quantize" 
                  active={selectedTrack.beatgridSet}
                  onClick={() => {
                    setSelectedTrack({...selectedTrack, beatgridSet: true});
                    setTracks(tracks.map(t => t.id === selectedTrack.id ? {...selectedTrack, beatgridSet: true} : t));
                  }}
                />
                <AnalysisTool 
                  icon={<MousePointer2 size={24}/>} 
                  label="Add HotCue" 
                  sub="Pos: 1/128" 
                  onClick={() => toggleCue(Math.floor(Math.random() * 80) + 10)}
                />
                <AnalysisTool 
                  icon={<FileOutput size={24}/>} 
                  label="Commit Sync" 
                  sub="Local Export" 
                  onClick={() => handleExport('Serato')}
                />
             </div>

             <div className="flex-1 bg-white/5 border border-white/5 rounded-[3rem] p-8 lg:p-12 flex flex-col justify-between space-y-8">
                <div className="grid sm:grid-cols-3 gap-8">
                   <MetaInput label="Collection_Tag" val={selectedTrack.name} />
                   <MetaInput label="Clock_BPM" val={`${selectedTrack.bpm} BPM`} />
                   <MetaInput label="Tonal_Key" val={selectedTrack.key} />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
                   <div className="flex gap-4">
                      <div className="flex items-center gap-3 text-rose-500 px-4 py-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                         <Volume2 size={16}/>
                         <span className="text-[10px] font-black uppercase tracking-widest">-3.2dB</span>
                      </div>
                      <div className="flex items-center gap-3 text-cyan-400 px-4 py-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                         {/* Fix: Changed RefreshCw to RefreshCcw (line 313) to match imports */}
                         <RefreshCcw size={16} className="animate-[spin_10s_linear_infinite]" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Buffer_Safe</span>
                      </div>
                   </div>
                   <button 
                    onClick={() => setActiveMode('browse')}
                    className="w-full sm:w-auto px-12 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                   >
                     Apply_Analysis_Protocol
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeMode === 'sync' && (
          <div className="flex-1 flex flex-col p-6 lg:p-12 space-y-12 animate-in slide-in-from-right duration-500">
             <header>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Neural_Bridge_Gateway</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-3">Syncing Aura_Collection to Computer_Filesystem</p>
             </header>

             <div className="grid md:grid-cols-3 gap-6">
                <SyncPlatformCard 
                  name="Serato DJ Pro" 
                  icon={<FileAudio size={40}/>} 
                  path="Music/_Serato_/Subcrates/Aura_Cloud" 
                  active={true}
                  onExport={() => handleExport('Serato')}
                />
                <SyncPlatformCard 
                  name="Rekordbox" 
                  icon={<Play size={40}/>} 
                  path="Music/Pioneer/Library_Export.xml" 
                  active={false}
                  onExport={() => handleExport('Rekordbox')}
                />
                <SyncPlatformCard 
                  name="Virtual DJ" 
                  icon={<RefreshCcw size={40}/>} 
                  path="Documents/VirtualDJ/Mappers" 
                  active={false}
                  onExport={() => handleExport('VirtualDJ')}
                />
             </div>

             <div className="bg-gradient-to-r from-rose-600/10 via-slate-900 to-rose-600/10 border border-rose-500/20 rounded-[3rem] p-10 lg:p-14 text-center space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-1 bg-rose-600 shadow-[0_0_20px_rose]" />
                <div className="w-20 h-20 bg-rose-500/20 rounded-[2rem] flex items-center justify-center text-rose-400 mx-auto group-hover:scale-110 transition-transform duration-700">
                   <FileOutput size={32}/>
                </div>
                <div className="space-y-4 max-w-2xl mx-auto">
                   <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">Global_Export_Sync</h4>
                   <p className="text-slate-400 text-sm leading-relaxed font-medium">
                      Push your analyzed metadata, hotcues, and beatgrids directly to your computer's local DJ databases. Once synced, simply open Serato, Rekordbox, or Virtual DJ and drag files from your "Aura_Sync" folder.
                   </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                   <button onClick={() => handleExport('Global')} className="px-12 py-5 bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-rose-600/30 active:scale-95 transition-all">
                      Sync_All_To_Filesystem
                   </button>
                   <button className="px-12 py-5 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:text-white transition-all">
                      Configure_Directory_Paths
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabBtn = ({ active, label, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-3 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon} {label}
  </button>
);

const FormatBtn = ({ label, active }: any) => (
  <button className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-rose-600/10 text-rose-500 border border-rose-500/20' : 'bg-white/5 text-slate-500 border border-white/5 hover:border-white/10'}`}>
     {label}
  </button>
);

const AnalysisBadge = ({ label }: any) => (
  <span className="px-3 py-1 bg-white/5 border border-white/10 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-lg">{label}</span>
);

const AnalysisTool = ({ icon, label, sub, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-10 border rounded-[3rem] text-left space-y-4 transition-all active:scale-95 group ${active ? 'bg-rose-600 border-rose-500 text-white shadow-2xl shadow-rose-600/20' : 'bg-white/5 border-white/5 text-slate-500 hover:border-rose-500/50 hover:bg-white/10'}`}
  >
     <div className={`transition-all ${active ? 'text-white' : 'group-hover:text-rose-500'}`}>{icon}</div>
     <div>
        <h5 className={`text-xs font-black uppercase tracking-tight ${active ? 'text-white' : 'text-white/80'}`}>{label}</h5>
        <p className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-white/60' : 'text-slate-600'}`}>{sub}</p>
     </div>
  </button>
);

const MetaInput = ({ label, val }: any) => (
  <div className="space-y-3 flex-1">
     <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2">{label}</label>
     <input 
      value={val}
      readOnly
      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-white uppercase outline-none focus:border-rose-500/30 transition-all shadow-inner"
     />
  </div>
);

const SyncPlatformCard = ({ name, icon, path, active, onExport }: any) => (
  <div className={`p-10 bg-white/5 border rounded-[3rem] space-y-8 transition-all hover:bg-white/10 group ${active ? 'border-rose-500/30' : 'border-white/5 opacity-60'}`}>
     <div className="flex justify-between items-start">
        <div className={`p-5 rounded-2xl transition-all group-hover:scale-110 ${active ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-800 text-slate-500'}`}>
           {icon}
        </div>
        <div className={`w-3 h-3 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_15px_green]' : 'bg-slate-700'}`} />
     </div>
     <div>
        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{name}</h4>
        <p className="text-[9px] font-mono text-slate-500 mt-3 truncate bg-black/40 p-2 rounded-lg">{path}</p>
     </div>
     <button onClick={onExport} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">Initiate_Relay</button>
  </div>
);

export default DJMusicApp;
