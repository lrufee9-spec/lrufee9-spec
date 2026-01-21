
import React, { useState, useRef } from 'react';
import { FileAsset } from '../../types';
import { 
  Folder, FileText, Image as ImageIcon, Video, 
  ArrowLeft, Search, Plus, Share2, Download, 
  Trash2, Edit3, Shield, Lock, Globe, Mail, 
  MessageSquare, PlayCircle, MoreVertical, CheckCircle, 
  X, Layers, Filter, Zap, Clock, CreditCard
} from 'lucide-react';
import { blobToBase64 } from '../../utils/audioUtils';

const FilesApp: React.FC<{ onBack: () => void, onLaunchApp: (id: any) => void }> = ({ onBack, onLaunchApp }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'documents' | 'photos' | 'videos'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileAsset | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFilter, setEditFilter] = useState('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileAsset[]>([
    {
      id: 'f1',
      name: 'Neural_License.pdf',
      type: 'license',
      category: 'document',
      url: '',
      timestamp: new Date(),
      size: '1.2 MB',
      isPrivate: true
    },
    {
      id: 'f2',
      name: 'Core_System_Diagram.png',
      type: 'image',
      category: 'photo',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
      timestamp: new Date(Date.now() - 3600000),
      size: '4.5 MB',
      isPrivate: false
    },
    {
      id: 'f3',
      name: 'Cyberpunk_City_Walk.mp4',
      type: 'video',
      category: 'video',
      url: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800',
      timestamp: new Date(Date.now() - 86400000),
      size: '124 MB',
      isPrivate: false
    }
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await blobToBase64(file);
      const category: any = file.type.startsWith('image/') ? 'photo' : file.type.startsWith('video/') ? 'video' : 'document';
      const newFile: FileAsset = {
        id: `f${Date.now()}`,
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : (category === 'photo' ? 'image' : 'video'),
        category,
        url: category === 'photo' || category === 'video' ? URL.createObjectURL(file) : '',
        timestamp: new Date(),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        isPrivate: false
      };
      setFiles([newFile, ...files]);
    }
  };

  const handleSync = (app: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSelectedFile(null);
      alert(`NEURAL_SYNC_COMPLETE: ${selectedFile?.name} relayed to ${app}.`);
    }, 1500);
  };

  const filteredFiles = files.filter(f => 
    (activeTab === 'all' || f.category === activeTab.slice(0, -1)) &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <Folder size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Aura_Vault</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Central Intelligence Files</p>
          </div>
        </div>

        <div className="hidden sm:flex bg-white/5 rounded-2xl p-1 border border-white/5">
           <TabBtn active={activeTab === 'all'} label="Everything" icon={<Layers size={14}/>} onClick={() => setActiveTab('all')} />
           <TabBtn active={activeTab === 'documents'} label="Docs" icon={<FileText size={14}/>} onClick={() => setActiveTab('documents')} />
           <TabBtn active={activeTab === 'photos'} label="Photos" icon={<ImageIcon size={14}/>} onClick={() => setActiveTab('photos')} />
           <TabBtn active={activeTab === 'videos'} label="Videos" icon={<Video size={14}/>} onClick={() => setActiveTab('videos')} />
        </div>
        
        <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-cyan-600 text-white rounded-xl shadow-lg active-scale">
           <Plus size={20}/>
           <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
        </button>
      </div>

      {/* Search & Stats */}
      <div className="p-6 bg-slate-950/40 border-b border-white/5 flex flex-col sm:flex-row gap-6 items-center">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="LOCATE_STORED_DATA..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
            />
         </div>
         <div className="flex gap-4">
            <StatBox label="Storage" val="8.2 GB / 25 GB" />
            <StatBox label="Health" val="100% Secure" color="text-emerald-400" />
         </div>
      </div>

      {/* Explorer Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-7xl mx-auto">
           {filteredFiles.length === 0 ? (
             <div className="h-96 flex flex-col items-center justify-center text-slate-800 opacity-30 gap-6">
                <Folder size={80} />
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">No data packets detected.</p>
             </div>
           ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredFiles.map(file => (
                   <div 
                    key={file.id} 
                    onClick={() => setSelectedFile(file)}
                    className="bg-white/5 border border-white/5 rounded-3xl p-4 group hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer relative overflow-hidden active-scale"
                   >
                      <div className="aspect-square rounded-2xl bg-black/40 flex items-center justify-center mb-4 relative overflow-hidden">
                         {file.category === 'photo' ? (
                           <img src={file.url} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="" />
                         ) : file.category === 'video' ? (
                           <div className="w-full h-full relative">
                              <img src={file.url} className="w-full h-full object-cover opacity-40" alt="" />
                              <PlayCircle className="absolute inset-0 m-auto text-white/50 group-hover:text-white transition-colors" size={40} />
                           </div>
                         ) : (
                           <FileText size={40} className="text-cyan-500/50" />
                         )}
                         {file.isPrivate && (
                           <div className="absolute top-2 right-2 p-1 bg-amber-500/20 backdrop-blur-md rounded-lg text-amber-500 border border-amber-500/20">
                              <Lock size={12}/>
                           </div>
                         )}
                      </div>
                      <div>
                         <h4 className="text-[11px] font-black text-white uppercase truncate tracking-tight mb-1">{file.name}</h4>
                         <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-widest">
                            <span>{file.size}</span>
                            <span>{file.timestamp.toLocaleDateString()}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* FILE DETAILS PANEL (MODAL) */}
      {selectedFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl animate-in zoom-in duration-300">
              {/* Preview Area */}
              <div className="flex-1 bg-black flex items-center justify-center p-8 relative">
                 {selectedFile.category === 'photo' ? (
                    <img 
                      src={selectedFile.url} 
                      className={`max-w-full max-h-[50vh] object-contain rounded-2xl shadow-2xl transition-all duration-500 ${editFilter === 'sepia' ? 'sepia' : editFilter === 'grayscale' ? 'grayscale' : editFilter === 'neon' ? 'brightness-150 contrast-150 hue-rotate-90' : ''}`} 
                      alt="" 
                    />
                 ) : selectedFile.category === 'video' ? (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center">
                       <PlayCircle size={64} className="text-white animate-pulse" />
                    </div>
                 ) : (
                    <div className="flex flex-col items-center gap-6">
                       <FileText size={120} className="text-cyan-500/20" />
                       <span className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest">PDF_ENCRYPTED_NODE</span>
                    </div>
                 )}
                 <button onClick={() => { setSelectedFile(null); setIsEditing(false); }} className="absolute top-8 left-8 p-3 text-slate-500 hover:text-white bg-white/5 rounded-full"><X size={24}/></button>
              </div>

              {/* Info & Actions */}
              <div className="w-full lg:w-96 border-l border-white/5 flex flex-col">
                 <div className="p-8 border-b border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{selectedFile.name}</h3>
                       <button className="p-2 text-slate-500"><MoreVertical size={20}/></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <InfoItem label="Created" val={selectedFile.timestamp.toLocaleDateString()} />
                       <InfoItem label="File Size" val={selectedFile.size} />
                       <InfoItem label="Category" val={selectedFile.category.toUpperCase()} />
                       <InfoItem label="Access" val={selectedFile.isPrivate ? 'PRIVATE' : 'PUBLIC'} />
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Action Hub */}
                    <div className="space-y-4">
                       <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural_Operations</h5>
                       <div className="grid grid-cols-2 gap-3">
                          <OpBtn icon={<Download size={16}/>} label="Download" />
                          {selectedFile.category === 'photo' && (
                            <OpBtn icon={<Edit3 size={16}/>} label="Neural Edit" onClick={() => setIsEditing(!isEditing)} active={isEditing} />
                          )}
                          <OpBtn icon={<Trash2 size={16}/>} label="Purge" color="text-red-500" />
                          <OpBtn icon={<Lock size={16}/>} label={selectedFile.isPrivate ? 'Un-Vault' : 'Vault'} />
                       </div>
                    </div>

                    {isEditing && selectedFile.category === 'photo' && (
                       <div className="space-y-4 animate-in slide-in-from-top duration-300">
                          <h5 className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Filter_Arrays</h5>
                          <div className="flex gap-3 overflow-x-auto pb-2 scroll-hide">
                             <FilterBtn active={editFilter === 'none'} label="Clean" onClick={() => setEditFilter('none')} />
                             <FilterBtn active={editFilter === 'sepia'} label="Sepia" onClick={() => setEditFilter('sepia')} />
                             <FilterBtn active={editFilter === 'grayscale'} label="Gray" onClick={() => setEditFilter('grayscale')} />
                             <FilterBtn active={editFilter === 'neon'} label="Neon" onClick={() => setEditFilter('neon')} />
                          </div>
                       </div>
                    )}

                    {/* Sync Relay */}
                    <div className="space-y-4">
                       <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Neural_Sync_Relay</h5>
                       <div className="grid grid-cols-1 gap-3">
                          <SyncBtn icon={<Mail size={16}/>} label="Relay to Inbox" onClick={() => handleSync('Neural_Inbox')} />
                          <SyncBtn icon={<MessageSquare size={16}/>} label="Sync to AI Chat" onClick={() => handleSync('Aura_Chat')} />
                          <SyncBtn icon={<Zap size={16}/>} label="Post to Social Hub" onClick={() => handleSync('Content_Pulse')} />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* SYNCING HUD */}
      {isSyncing && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-8">
           <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-12 text-center shadow-2xl">
              <div className="w-20 h-20 bg-indigo-500/10 border-2 border-indigo-500 rounded-full flex items-center justify-center text-indigo-400 mx-auto mb-8 relative">
                 <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-ping" />
                 <Share2 size={32} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">Neural_Mesh_Relay</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10 leading-relaxed">Encapsulating Data Packet for Inter-App Synchronization</p>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-600 animate-[loading_1.5s_infinite]" />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const TabBtn = ({ active, label, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon} {label}
  </button>
);

const StatBox = ({ label, val, color }: any) => (
  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-center min-w-[120px]">
    <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-[10px] font-black ${color || 'text-white'}`}>{val}</p>
  </div>
);

const InfoItem = ({ label, val }: any) => (
  <div className="space-y-1">
    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    <p className="text-[10px] font-black text-white">{val}</p>
  </div>
);

const OpBtn = ({ icon, label, onClick, active, color }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${active ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-400 hover:text-white'} ${color || ''}`}
  >
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const FilterBtn = ({ active, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all min-w-max border ${active ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white/5 text-slate-500 border-white/10'}`}
  >
    {label}
  </button>
);

const SyncBtn = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl group hover:bg-indigo-600 hover:text-white transition-all text-indigo-400"
  >
    <div className="flex items-center gap-4">
       {icon}
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <CheckCircle size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
);

export default FilesApp;
