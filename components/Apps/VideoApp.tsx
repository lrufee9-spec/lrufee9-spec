
import React, { useState, useEffect, useRef } from 'react';
import { VideoContent } from '../../types';
import { 
  Play, Pause, Heart, MessageCircle, Download, 
  Search, ArrowLeft, Bookmark, ShoppingBag, 
  Film, Music, Star, Clock, X, Volume2, 
  MoreVertical, ShieldCheck, CheckCircle, DownloadCloud,
  Layers, User, AlertCircle, Send
} from 'lucide-react';

const VideoApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'playlist' | 'my-vault'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adTimer, setAdTimer] = useState(60);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  
  const [videos, setVideos] = useState<VideoContent[]>([
    {
      id: 'v1',
      title: 'Neon Skyline: The Final Mission',
      creator: 'Aura_Cinema',
      type: 'movie',
      thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800',
      videoUrl: '',
      price: 15.00,
      likes: 4520,
      isPurchased: false,
      description: 'A cinematic journey through the last cyberpunk stronghold.'
    },
    {
      id: 'v2',
      title: 'Neural Beats Vol. 4',
      creator: 'Synth_Wave',
      type: 'music',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
      videoUrl: '',
      price: 5.00,
      likes: 8900,
      isPurchased: true,
      description: 'Audio-visual immersion for deep work focus.'
    },
    {
      id: 'v3',
      title: 'Robot Dance Championships',
      creator: 'Talent_Core',
      type: 'talented',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
      videoUrl: '',
      price: 2.50,
      likes: 120,
      isPurchased: false,
      description: 'The world\'s best bots compete for the neural crown.'
    }
  ]);

  // Ad and Playback Logic
  useEffect(() => {
    let adInterval: number;
    let playInterval: number;

    if (selectedVideo && !isAdPlaying) {
      playInterval = window.setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= 300) { // Every 5 minutes (300 seconds)
            setIsAdPlaying(true);
            setAdTimer(60);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    if (isAdPlaying && adTimer > 0) {
      adInterval = window.setInterval(() => setAdTimer(prev => prev - 1), 1000);
    } else if (adTimer === 0) {
      setIsAdPlaying(false);
    }

    return () => {
      clearInterval(adInterval);
      clearInterval(playInterval);
    };
  }, [selectedVideo, isAdPlaying, adTimer]);

  const handlePurchase = (id: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, isPurchased: true } : v));
    alert("TRANSACTION_SECURE // Video Access Granted.");
  };

  const handleDownload = (id: string) => {
    setIsDownloading(id);
    setTimeout(() => {
      setVideos(prev => prev.map(v => v.id === id ? { ...v, isDownloaded: true } : v));
      setIsDownloading(null);
    }, 3000);
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500">
            <Film size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Aura_Cinema</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Multidimensional Stream</p>
          </div>
        </div>
        
        <div className="hidden sm:flex bg-white/5 rounded-2xl p-1 border border-white/5">
          <TabBtn active={activeTab === 'explore'} label="Explore" icon={<Search size={14}/>} onClick={() => setActiveTab('explore')} />
          <TabBtn active={activeTab === 'playlist'} label="Purchased" icon={<Bookmark size={14}/>} onClick={() => setActiveTab('playlist')} />
          <TabBtn active={activeTab === 'my-vault'} label="My Vault" icon={<Layers size={14}/>} onClick={() => setActiveTab('my-vault')} />
        </div>

        <button className="sm:hidden p-2 text-slate-500 hover:text-white"><MoreVertical size={20}/></button>
      </div>

      {/* Search Bar */}
      <div className="p-4 sm:p-6 bg-slate-950/40">
        <div className="relative max-w-4xl mx-auto">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
           <input 
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             placeholder="SEARCH_MEDIA_INTEL..."
             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-rose-500/50 outline-none transition-all"
           />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-20">
        <div className="max-w-7xl mx-auto py-4">
          {activeTab === 'explore' && (
            <div className="space-y-12">
               {/* Categories */}
               <section className="flex gap-4 overflow-x-auto pb-4 scroll-hide">
                  <CategoryBtn icon={<Film size={14}/>} label="Movies" />
                  <CategoryBtn icon={<Music size={14}/>} label="Music" />
                  <CategoryBtn icon={<Star size={14}/>} label="Talented" />
               </section>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {filteredVideos.map(video => (
                   <div 
                    key={video.id} 
                    className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden group hover:border-rose-500/30 transition-all active-scale cursor-pointer"
                    onClick={() => video.isPurchased ? setSelectedVideo(video) : null}
                   >
                     <div className="aspect-video relative overflow-hidden bg-black">
                        <img src={video.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="" />
                        {!video.isPurchased && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                             <div className="flex flex-col items-center gap-2">
                                <ShoppingBag className="text-white" size={24} />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">${video.price.toFixed(2)}_CREDITS</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handlePurchase(video.id); }}
                                  className="mt-2 px-6 py-2 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest"
                                >
                                  Subscribe
                                </button>
                             </div>
                          </div>
                        )}
                        {video.isPurchased && (
                          <div className="absolute top-2 right-2 p-1.5 bg-emerald-500 text-white rounded-lg shadow-lg">
                             <CheckCircle size={12} />
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] font-black text-white">04:20</div>
                     </div>
                     <div className="p-5 space-y-3">
                        <div>
                           <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{video.title}</h4>
                           <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">CREATOR: {video.creator}</p>
                        </div>
                        <div className="flex justify-between items-center">
                           <div className="flex gap-4">
                              <span className="flex items-center gap-1.5 text-[10px] text-rose-500 font-black uppercase"><Heart size={14}/> {video.likes}</span>
                              <span className="flex items-center gap-1.5 text-[10px] text-slate-500 font-black uppercase"><MessageCircle size={14}/> 24</span>
                           </div>
                           {video.isPurchased && (
                             <button 
                              onClick={(e) => { e.stopPropagation(); handleDownload(video.id); }}
                              disabled={video.isDownloaded || isDownloading === video.id}
                              className={`p-2 rounded-xl transition-all ${video.isDownloaded ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-500 hover:text-white bg-white/5'}`}
                             >
                               {isDownloading === video.id ? <Clock size={16} className="animate-spin" /> : video.isDownloaded ? <CheckCircle size={16}/> : <Download size={16}/>}
                             </button>
                           )}
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {(activeTab === 'playlist' || activeTab === 'my-vault') && (
            <div className="space-y-6">
               <header className="border-b border-white/5 pb-4">
                  <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">
                    {activeTab === 'playlist' ? 'Stored_Acquisitions' : 'Local_Media_Vault'}
                  </h3>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Linked To Neural Profile</p>
               </header>

               <div className="grid gap-4">
                 {videos.filter(v => activeTab === 'playlist' ? v.isPurchased : v.creator === 'Aura_Cinema').map(video => (
                   <div key={video.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-6 hover:bg-white/10 transition-all">
                      <div className="w-40 h-24 rounded-xl overflow-hidden bg-black flex-shrink-0 relative">
                         <img src={video.thumbnail} className="w-full h-full object-cover opacity-60" alt="" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <button onClick={() => setSelectedVideo(video)} className="p-3 bg-rose-600/20 backdrop-blur-md rounded-full text-white border border-rose-500/40">
                               <Play size={16} fill="white"/>
                            </button>
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{video.title}</h4>
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Type: {video.type} // Source: {video.creator}</p>
                         <div className="flex gap-4 mt-3">
                            <button className="text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest flex items-center gap-1.5"><Heart size={12}/> Like</button>
                            <button className="text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest flex items-center gap-1.5"><MessageCircle size={12}/> Comment</button>
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         {video.isDownloaded ? (
                           <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                              <DownloadCloud size={10}/> OFFLINE_SYNCED
                           </span>
                         ) : (
                           <button onClick={() => handleDownload(video.id)} className="p-3 text-slate-500 hover:text-white"><Download size={20}/></button>
                         )}
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN PLAYER OVERLAY */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-500">
           <div className="flex-1 relative flex flex-col items-center justify-center p-8">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-8 left-8 p-3 text-white/50 hover:text-white transition-all z-[110]"
              >
                <ArrowLeft size={24}/>
              </button>

              <div className="w-full max-w-5xl aspect-video bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden relative shadow-[0_0_100px_rgba(244,63,94,0.15)]">
                 <img src={selectedVideo.thumbnail} className="w-full h-full object-cover opacity-20" alt="" />
                 
                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <button className="w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center shadow-2xl shadow-rose-600/40 animate-pulse">
                       <Play size={40} fill="white" className="ml-1" />
                    </button>
                    <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em]">BUFFERING_STREAMING_NODE</p>
                 </div>

                 {/* Playback Controls HUD */}
                 <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <button className="text-white"><Play size={20}/></button>
                       <div className="flex items-center gap-3">
                          <Volume2 size={18} className="text-slate-500"/>
                          <div className="w-24 h-1 bg-white/10 rounded-full">
                             <div className="w-1/2 h-full bg-rose-500 rounded-full"/>
                          </div>
                       </div>
                    </div>
                    <div className="flex-1 mx-8 flex flex-col gap-2">
                       <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-600" style={{ width: `${(playbackTime % 300) / 3}%` }} />
                       </div>
                       <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                          <span>{Math.floor(playbackTime / 60)}:{(playbackTime % 60).toString().padStart(2, '0')}</span>
                          <span>AD_IN: {Math.floor((300 - playbackTime) / 60)}:{((300 - playbackTime) % 60).toString().padStart(2, '0')}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded">PRO_STREAM</span>
                    </div>
                 </div>
              </div>

              <div className="w-full max-w-5xl mt-8 flex flex-col sm:flex-row gap-8">
                 <div className="flex-1 space-y-4">
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">{selectedVideo.title}</h1>
                    <div className="flex items-center gap-4">
                       <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500"><User size={12}/></div>
                          <span className="text-[10px] font-black text-white uppercase">{selectedVideo.creator}</span>
                       </div>
                       <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Follow</button>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{selectedVideo.description}</p>
                 </div>
                 <div className="w-full sm:w-80 bg-white/5 border border-white/5 rounded-3xl p-6">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural_Discussion</h3>
                    <div className="space-y-4 h-32 overflow-y-auto custom-scrollbar pr-2 mb-4">
                       <Comment author="Nexus_9" text="Stunning visuals on this one." />
                       <Comment author="Cyber_Punk" text="Where can I get the soundtrack?" />
                    </div>
                    <div className="relative">
                       <input 
                         placeholder="Pulse_Comment..."
                         className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[10px] text-white outline-none focus:border-rose-500/50"
                       />
                       {/* Fix: Added Send to lucide-react imports to resolve 'Cannot find name Send' */}
                       <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-rose-500"><Send size={14}/></button>
                    </div>
                 </div>
              </div>
           </div>

           {/* AD OVERLAY (UNSKIPPABLE) */}
           {isAdPlaying && (
             <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-[3rem] p-12 text-center relative overflow-hidden">
                   <div className="absolute top-0 inset-x-0 h-1 bg-white/5">
                      <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(60 - adTimer) * 1.66}%` }} />
                   </div>
                   
                   <div className="w-20 h-20 bg-amber-500/10 border-2 border-amber-500 rounded-[1.5rem] flex items-center justify-center text-amber-500 mx-auto mb-8 animate-bounce">
                      <AlertCircle size={32} />
                   </div>
                   
                   <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Aura_Partner_Sync</h2>
                   <p className="text-slate-400 text-sm mb-10 leading-relaxed">Maintaining neural connectivity for free tiers. Upgrading to AURA_ELITE removes these synoptic pauses.</p>
                   
                   <div className="flex flex-col items-center gap-4">
                      <div className="text-4xl font-black text-amber-500 tracking-tighter italic">00:{adTimer.toString().padStart(2, '0')}</div>
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Mandatory_Broadcast_Active</p>
                   </div>

                   <button 
                     disabled={adTimer > 0}
                     className={`mt-12 px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${adTimer === 0 ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40' : 'bg-white/5 text-slate-700 cursor-not-allowed'}`}
                   >
                     Skip_Ad_Relay
                   </button>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

const TabBtn = ({ active, label, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon} {label}
  </button>
);

const CategoryBtn = ({ icon, label }: any) => (
  <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-slate-400 hover:text-white hover:border-rose-500/50 transition-all group min-w-max">
     <div className="text-rose-500/50 group-hover:text-rose-500">{icon}</div>
     <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const Comment = ({ author, text }: any) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
       <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
       <span className="text-[8px] font-black text-white uppercase">{author}</span>
    </div>
    <p className="text-[10px] text-slate-500 pl-3 leading-tight">{text}</p>
  </div>
);

export default VideoApp;
