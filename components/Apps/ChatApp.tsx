
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role, Attachment, Contact } from '../../types';
import { AuraAPI } from '../../services/api';
import { playPCM, blobToBase64 } from '../../utils/audioUtils';
import { 
  Send, Plus, Volume2, Cpu, Mic, Zap, Image as ImageIcon, FileText, 
  Globe, Bell, ArrowLeft, MoreVertical, Paperclip, Share2, Users, 
  Mail, Phone, Video, MapPin, Smile, Heart, ThumbsUp, Trash2, ShieldOff,
  UserPlus, X, Languages, History
} from 'lucide-react';
import MessageList from '../Chat/MessageList';

const ChatApp: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'ai' | 'social' | 'inbox'>('ai');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: Role.ASSISTANT, content: "Neural linkage established. I can manage your social mesh or assist with core tasks.", timestamp: new Date() }
  ]);
  const [inboxMessages, setInboxMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'c1', name: 'Nexus-7', phone: '+1-555-0199', status: 'online', isBlocked: false },
    { id: 'c2', name: 'Zero-One', phone: '+1-555-0182', status: 'offline', isBlocked: false }
  ]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, inboxMessages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await blobToBase64(file);
      setAttachments(prev => [...prev, { mimeType: file.type, base64 }]);
    }
  };

  const startVoiceRecord = () => {
    setIsRecording(true);
    setRecordTime(0);
    timerRef.current = window.setInterval(() => {
      setRecordTime(prev => {
        if (prev >= 120) {
          stopVoiceRecord();
          return 120;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopVoiceRecord = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const audioMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: `[VOICE_NODE] ${recordTime}s Recording`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, audioMsg]);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    const contact: Contact = {
      id: `c${Date.now()}`,
      name: newContact.name,
      phone: newContact.phone,
      status: 'offline',
      isBlocked: false
    };
    setContacts(prev => [...prev, contact]);
    setNewContact({ name: '', phone: '' });
    setShowAddContact(false);
  };

  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const isLongMessage = input.length > 50;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: activeMode === 'ai' ? Role.USER : Role.FRIEND, 
      content: input, 
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
      isStoryline: isLongMessage
    };

    if (isLongMessage) {
      setInboxMessages(prev => [userMsg, ...prev]);
      setActiveMode('inbox');
      setInput('');
      setAttachments([]);
      return;
    }

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);

    if (activeMode === 'ai') {
      setIsTyping(true);
      let assistantText = "";
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantId, role: Role.ASSISTANT, content: "", timestamp: new Date() }]);

      try {
        const { fullText } = await AuraAPI.chat([...messages, userMsg], (chunk) => {
          assistantText += chunk;
          setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantText } : m));
        });
        const audioBase64 = await AuraAPI.speak(fullText);
        if (audioBase64) playPCM(audioBase64);
      } catch (err) {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: "Kernel linkage failure." } : m));
      } finally {
        setIsTyping(false);
      }
    }
  };

  const toggleBlockContact = (id: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, isBlocked: !c.isBlocked } : c));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative font-['Plus_Jakarta_Sans']">
      {/* HUD Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5 shadow-inner">
             <TabBtn active={activeMode === 'ai'} label="Core" icon={<Cpu size={14}/>} onClick={() => setActiveMode('ai')} />
             <TabBtn active={activeMode === 'social'} label="Social" icon={<Users size={14}/>} onClick={() => setActiveMode('social')} />
             <TabBtn active={activeMode === 'inbox'} label="Storylines" icon={<Mail size={14}/>} onClick={() => setActiveMode('inbox')} />
          </div>
        </div>
        <div className="flex items-center gap-2">
           {activeMode === 'social' && selectedContact && (
             <div className="flex gap-1 pr-4 border-r border-white/10 mr-2 animate-in slide-in-from-right duration-300">
               <button onClick={() => setIsCallActive(true)} className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"><Phone size={18}/></button>
               <button onClick={() => setIsCallActive(true)} className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"><Video size={18}/></button>
             </div>
           )}
           <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreVertical size={18}/></button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Contacts Sidebar (Mesh) */}
        {activeMode === 'social' && !selectedContact && (
          <div className="w-full sm:w-80 border-r border-white/5 bg-slate-950/40 p-4 space-y-4 overflow-y-auto custom-scrollbar animate-in slide-in-from-left duration-500">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural_Directory</h3>
               <button onClick={() => setShowAddContact(true)} className="p-1.5 bg-indigo-600/10 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                  <UserPlus size={14} />
               </button>
            </div>
            
            <div className="space-y-2">
              {contacts.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedContact(c)}
                  className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group border ${c.isBlocked ? 'opacity-40 grayscale border-transparent' : 'bg-white/5 border-white/5 hover:border-indigo-500/30 hover:bg-white/10'}`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Users size={20}/>
                    </div>
                    {!c.isBlocked && (
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 ${c.status === 'online' ? 'bg-green-500' : 'bg-slate-700'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white uppercase tracking-tight truncate">{c.name} {c.isBlocked && '(BLOCKED)'}</p>
                    <p className="text-[9px] text-slate-500 font-mono tracking-tighter">{c.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viewport (Chat / Inbox) */}
        <div className="flex-1 flex flex-col relative">
          {activeMode === 'inbox' ? (
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12">
               <div className="max-w-3xl mx-auto space-y-8">
                  <header className="border-b border-white/10 pb-6">
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Timeline_Archive</h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Personal Storyline & Sync History</p>
                  </header>

                  {inboxMessages.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-800 opacity-30 gap-4">
                      <History size={64} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-center">No long-form data detected.<br/>Messages &gt; 50 chars will sync here.</p>
                    </div>
                  ) : (
                    inboxMessages.map((msg, i) => (
                      <div key={msg.id} className="relative pl-8 border-l border-indigo-500/30 py-2 group">
                        <div className="absolute top-4 -left-1.5 w-3 h-3 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/40" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">{msg.timestamp.toLocaleString()} // STORY_NODE_{i+1}</span>
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-white/10 transition-all">
                           <p className="text-slate-200 text-lg font-medium leading-relaxed italic">"{msg.content}"</p>
                           {msg.attachments?.map((att, j) => (
                             <div key={j} className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-sm">
                               {att.mimeType.startsWith('image/') ? (
                                 <img src={`data:${att.mimeType};base64,${att.base64}`} className="w-full h-auto" alt="" />
                               ) : <div className="p-4 bg-indigo-600 text-white flex items-center gap-3"><FileText/> {att.mimeType}</div>}
                             </div>
                           ))}
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          ) : (
            <>
              {activeMode === 'social' && selectedContact && (
                <div className="px-6 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedContact(null)} className="p-1 text-slate-500 hover:text-white transition-colors"><ArrowLeft size={16}/></button>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{selectedContact.name} // PEER_LINK</span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => toggleBlockContact(selectedContact.id)} className={`transition-all ${selectedContact.isBlocked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}>
                      <ShieldOff size={14}/>
                    </button>
                    <button onClick={() => { setContacts(prev => prev.filter(c => c.id !== selectedContact.id)); setSelectedContact(null); }} className="text-slate-500 hover:text-red-500 transition-all">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6">
                <MessageList messages={messages} isTyping={isTyping} />
                <div ref={scrollRef} className="h-4" />
              </div>

              {/* Chat Input Area */}
              <div className="p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/5">
                <div className="max-w-4xl mx-auto space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative flex items-center">
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload}/>
                      <button onClick={() => fileInputRef.current?.click()} className="absolute left-4 p-2 text-slate-500 hover:text-indigo-400"><Paperclip size={18}/></button>
                      <textarea 
                        rows={1}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                        placeholder={isRecording ? `REC_MODE // ${recordTime}s / 120s` : "Enter query or social pulse..."}
                        className={`w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-24 py-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all resize-none overflow-hidden ${isRecording ? 'border-red-500/50 text-red-500' : ''}`}
                        disabled={isRecording}
                      />
                      <div className="absolute right-4 flex items-center gap-1">
                        <span className={`text-[9px] font-black pr-2 transition-colors ${input.length > 50 ? 'text-amber-500' : 'text-slate-600'}`}>
                          {input.length}/50
                        </span>
                        <button 
                          onMouseDown={startVoiceRecord}
                          onMouseUp={stopVoiceRecord}
                          onTouchStart={startVoiceRecord}
                          onTouchEnd={stopVoiceRecord}
                          className={`p-2 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:text-indigo-400'}`}
                        >
                          <Mic size={18} />
                        </button>
                        <button 
                          onClick={sendMessage} 
                          className={`p-2 rounded-xl active:scale-90 transition-all ${input.length > 50 ? 'bg-amber-600 text-white shadow-amber-600/20' : 'bg-indigo-600 text-white shadow-indigo-600/20 shadow-lg'}`}
                        >
                          {input.length > 50 ? <Mail size={18}/> : <Send size={18}/>}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-2 overflow-x-auto scroll-hide">
                    <div className="flex gap-4 min-w-max">
                      <EmojiReaction emoji="❤️" />
                      <EmojiReaction emoji="👍" />
                      <EmojiReaction emoji="🔥" />
                      <div className="w-px h-4 bg-white/10 mx-1 self-center" />
                      <ToolBtn icon={<MapPin size={12}/>} label="Share Loc" onClick={() => setInput(prev => prev + " [LOCATION_SYNC] ")} />
                      <ToolBtn icon={<Globe size={12}/>} label="Translate" onClick={() => setInput(prev => prev + " Translate this: ")} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL: Add Contact */}
      {showAddContact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
              <div className="flex justify-between items-start mb-8">
                 <div>
                   <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Add_Peer</h3>
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Bind Phone to Social Mesh</p>
                 </div>
                 <button onClick={() => setShowAddContact(false)} className="p-2 text-slate-500 hover:text-white"><X size={20}/></button>
              </div>
              <form onSubmit={handleAddContact} className="space-y-6">
                 <div>
                   <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2 px-2">Contact Name</label>
                   <input 
                     value={newContact.name}
                     onChange={e => setNewContact({...newContact, name: e.target.value})}
                     className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-indigo-500/50 outline-none"
                     placeholder="e.g. Nexus-Zero"
                   />
                 </div>
                 <div>
                   <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-2 px-2">Telephone Number</label>
                   <input 
                     value={newContact.phone}
                     onChange={e => setNewContact({...newContact, phone: e.target.value})}
                     className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-indigo-500/50 outline-none font-mono"
                     placeholder="+1-000-000-0000"
                   />
                 </div>
                 <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                    Link Neural ID
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* CALL OVERLAY (HUD) */}
      {isCallActive && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col p-8 animate-in fade-in zoom-in duration-500">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
             <div className="w-32 h-32 rounded-[2rem] bg-indigo-500/10 border-2 border-indigo-500 flex items-center justify-center mb-8 relative shadow-[0_0_50px_rgba(79,70,229,0.3)]">
                <div className="absolute inset-0 rounded-[2rem] border-4 border-indigo-500/20 animate-ping" />
                <Users size={48} className="text-indigo-400 animate-pulse" />
             </div>
             <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-2">{selectedContact?.name || 'AURA_PEER'}</h2>
             <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               Signal_Encrypted // SECURE
             </div>

             <div className="w-full max-w-sm grid grid-cols-2 gap-4 mb-12">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left">
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Aura_Status</p>
                   <p className="text-xs font-black text-white">Monitoring_Stream</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left">
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Translation</p>
                   <p className="text-xs font-black text-emerald-400 flex items-center gap-2"><Languages size={14}/> ACTIVE</p>
                </div>
             </div>

             <div className="w-full max-w-sm bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 mb-12">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black text-indigo-300 uppercase">Target Country</span>
                  <select className="bg-transparent text-white font-black uppercase text-[10px] outline-none cursor-pointer">
                    <option className="bg-slate-900">Japan (JP)</option>
                    <option className="bg-slate-900">Spain (ES)</option>
                    <option className="bg-slate-900">Korea (KR)</option>
                    <option className="bg-slate-900">France (FR)</option>
                  </select>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div className="w-1/3 h-full bg-indigo-500 animate-[loading_2s_infinite]" />
                </div>
                <p className="text-[10px] text-slate-400 italic">"Voice packets are being translated via Neural Mesh..."</p>
             </div>

             <div className="flex gap-8">
                <button className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-all active:scale-90"><MicOff/></button>
                <button 
                  onClick={() => setIsCallActive(false)}
                  className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/40 hover:bg-red-500 transition-all active:scale-90"
                >
                  <Phone size={32} className="rotate-[135deg]" />
                </button>
                <button className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-all active:scale-90"><Video/></button>
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
    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {icon} {label}
  </button>
);

const EmojiReaction = ({ emoji }: any) => (
  <button className="text-xl hover:scale-125 transition-all p-1 active:scale-90 grayscale hover:grayscale-0">{emoji}</button>
);

const ToolBtn = ({ icon, label, onClick }: any) => (
  <button onClick={onClick} className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-all group active:scale-95">
    <div className="p-1.5 bg-white/5 border border-white/5 rounded-lg group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20">{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const MicOff = () => <Mic size={24} className="opacity-50" />;

export default ChatApp;
