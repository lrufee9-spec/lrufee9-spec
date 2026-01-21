
import React, { useState, useRef } from 'react';
import { Email, Attachment } from '../../types';
import { 
  Mail, Send, Trash2, Printer, FileText, FileDown, 
  Search, Plus, Archive, Star, Inbox as InboxIcon,
  ChevronRight, ArrowLeft, Paperclip, CheckCircle,
  AlertCircle, RefreshCw, X, File
} from 'lucide-react';
import { blobToBase64 } from '../../utils/audioUtils';

const InboxApp: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: 'e1',
      sender: 'Nexus_Systems',
      recipient: 'Admin',
      subject: 'Security Protocol Updated: v5.2',
      body: 'The neural mesh has been upgraded to support secure email tunneling. Please review the attached documentation for the new encryption keys.',
      timestamp: new Date(Date.now() - 3600000),
      isRead: false,
      attachments: [{ name: 'Security_Log.txt', mimeType: 'text/plain', base64: '' }]
    },
    {
      id: 'e2',
      sender: 'Kore_Neural',
      recipient: 'Admin',
      subject: 'Weekly Neural Performance Report',
      body: 'Aura efficiency has increased by 14% since the last update. Synaptic latency is within optimal bounds.',
      timestamp: new Date(Date.now() - 86400000),
      isRead: true
    }
  ]);

  const [view, setView] = useState<'list' | 'read' | 'compose'>('list');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  
  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeAttachments, setComposeAttachments] = useState<Attachment[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await blobToBase64(file);
      setComposeAttachments(prev => [...prev, { name: file.name, mimeType: file.type, base64 }]);
    }
  };

  const convertToPDF = (index: number) => {
    setIsConverting(true);
    setTimeout(() => {
      setComposeAttachments(prev => prev.map((att, i) => 
        i === index ? { ...att, name: att.name?.replace(/\.[^/.]+$/, "") + ".pdf", mimeType: 'application/pdf', isPDF: true } : att
      ));
      setIsConverting(false);
    }, 1500);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setPrintProgress(0);
    const interval = setInterval(() => {
      setPrintProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsPrinting(false), 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleSend = () => {
    const newEmail: Email = {
      id: `e${Date.now()}`,
      sender: 'Admin',
      recipient: composeTo,
      subject: composeSubject,
      body: composeBody,
      timestamp: new Date(),
      isRead: true,
      attachments: composeAttachments
    };
    setEmails(prev => [newEmail, ...prev]);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setComposeAttachments([]);
    setView('list');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Neural_Inbox</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Comms_Link Protocol</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setView('compose')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-2">
             <Plus size={14} /> New_Comms
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="hidden md:flex w-64 border-r border-white/5 bg-slate-950/40 p-4 flex-col gap-2">
           <NavBtn active={view === 'list'} icon={<InboxIcon size={16}/>} label="Inbox" count={emails.filter(e => !e.isRead).length} onClick={() => setView('list')} />
           <NavBtn active={false} icon={<Star size={16}/>} label="Starred" onClick={() => {}} />
           <NavBtn active={false} icon={<Send size={16}/>} label="Sent_Relay" onClick={() => {}} />
           <NavBtn active={false} icon={<Archive size={16}/>} label="Archive" onClick={() => {}} />
           <div className="mt-auto p-4 bg-white/5 border border-white/5 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Printer size={16} className="text-cyan-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Printer_Binding</span>
              </div>
              <p className="text-[8px] text-slate-500 uppercase leading-relaxed">HP_Laser_Aura_01 Connected</p>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-slate-900/20 relative">
          {view === 'list' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <div className="p-4 space-y-2">
                 {emails.map(email => (
                   <div 
                    key={email.id} 
                    onClick={() => { setSelectedEmail(email); setView('read'); email.isRead = true; }}
                    className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer border transition-all ${email.isRead ? 'bg-white/5 border-transparent opacity-60' : 'bg-white/10 border-cyan-500/20 shadow-lg shadow-cyan-500/5'}`}
                   >
                     <div className={`w-2 h-2 rounded-full ${email.isRead ? 'bg-slate-700' : 'bg-cyan-500 animate-pulse'}`} />
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[10px] font-black text-white uppercase tracking-tight">{email.sender}</span>
                           <span className="text-[8px] text-slate-500 font-mono">{email.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 truncate">{email.subject}</h4>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{email.body}</p>
                     </div>
                     {email.attachments && <Paperclip size={14} className="text-slate-600" />}
                   </div>
                 ))}
               </div>
            </div>
          )}

          {view === 'read' && selectedEmail && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300">
               <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-950/40">
                  <button onClick={() => setView('list')} className="p-2 -ml-2 text-slate-400 hover:text-white transition-all"><ArrowLeft size={20}/></button>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-500 hover:text-white transition-all"><Star size={18}/></button>
                    <button className="p-2 text-slate-500 hover:text-red-500 transition-all"><Trash2 size={18}/></button>
                    <button onClick={handlePrint} className="p-2 text-cyan-400 hover:text-cyan-300 transition-all"><Printer size={18}/></button>
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  <header>
                    <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedEmail.subject}</h1>
                    <div className="flex items-center gap-3 mt-4">
                       <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black">
                          {selectedEmail.sender[0]}
                       </div>
                       <div>
                          <p className="text-sm font-black text-white">{selectedEmail.sender}</p>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">TO: {selectedEmail.recipient}</p>
                       </div>
                    </div>
                  </header>
                  <div className="bg-white/5 border border-white/5 rounded-3xl p-8">
                     <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedEmail.body}</p>
                  </div>

                  {selectedEmail.attachments && (
                    <div className="space-y-4">
                       <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Encapsulated_Buffers</h5>
                       <div className="flex flex-wrap gap-4">
                          {selectedEmail.attachments.map((att, i) => (
                            <div key={i} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all">
                               <FileText className="text-indigo-400" size={20} />
                               <div>
                                  <p className="text-[10px] font-black text-white uppercase tracking-tight">{att.name}</p>
                                  <p className="text-[8px] text-slate-600 uppercase">{att.mimeType}</p>
                               </div>
                               <button className="p-2 text-slate-500 hover:text-white transition-all"><FileDown size={16}/></button>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {view === 'compose' && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-bottom duration-500">
               <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-950/40">
                  <h3 className="text-sm font-black text-white uppercase italic tracking-tight">Initiate_Comms_Relay</h3>
                  <button onClick={() => setView('list')} className="p-2 text-slate-500 hover:text-white"><X size={20}/></button>
               </div>
               <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  <div className="space-y-4">
                    <input 
                      value={composeTo}
                      onChange={e => setComposeTo(e.target.value)}
                      placeholder="TARGET_NEURAL_ID"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500/50 outline-none"
                    />
                    <input 
                      value={composeSubject}
                      onChange={e => setComposeSubject(e.target.value)}
                      placeholder="COMMS_SUBJECT"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-indigo-500/50 outline-none"
                    />
                    <textarea 
                      value={composeBody}
                      onChange={e => setComposeBody(e.target.value)}
                      placeholder="ENTER_DATA_PACKET_CONTENT..."
                      rows={8}
                      className="w-full bg-white/5 border border-white/5 rounded-3xl px-6 py-6 text-sm text-white focus:border-indigo-500/50 outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Linked_Attachments</h5>
                       <button onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-all flex items-center gap-1">
                         <Plus size={12}/> Append_Buffer
                       </button>
                       <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload}/>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                       {composeAttachments.map((att, i) => (
                         <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                               <File size={16} className={att.isPDF ? 'text-red-500' : 'text-slate-500'} />
                               <div className="min-w-0">
                                  <p className="text-[10px] font-black text-white uppercase truncate pr-4">{att.name}</p>
                                  <p className="text-[7px] text-slate-600 uppercase">{att.isPDF ? 'PDF_STATIC' : att.mimeType}</p>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               {!att.isPDF && (
                                 <button 
                                  onClick={() => convertToPDF(i)}
                                  className="p-1.5 bg-red-600/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                  title="Convert to PDF"
                                 >
                                    <FileDown size={14} />
                                 </button>
                               )}
                               <button 
                                onClick={() => setComposeAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                className="p-1.5 text-slate-600 hover:text-white transition-all"
                               >
                                  <Trash2 size={14} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
               <div className="p-6 border-t border-white/5 flex items-center justify-between bg-slate-950/40">
                  <div className="flex gap-4">
                     <button onClick={handlePrint} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Printer size={18}/></button>
                  </div>
                  <button 
                    onClick={handleSend}
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-3"
                  >
                    Relay_Packet <Send size={16}/>
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* PRINT HUD OVERLAY */}
      {isPrinting && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-indigo-500/10 border-2 border-indigo-500 flex items-center justify-center text-indigo-400 mx-auto mb-8 relative">
                 <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-ping" />
                 <Printer size={32} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Printing_Physical_Copy</h3>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] mb-10">Binding Aura_Docs to Physical_Matrix</p>
              
              <div className="space-y-4">
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${printProgress}%` }} />
                 </div>
                 <div className="flex justify-between text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                    <span>Task_Sync: {printProgress}%</span>
                    <span>{printProgress === 100 ? 'COMPLETE' : 'PHYSICALIZING...'}</span>
                 </div>
              </div>
              
              {printProgress === 100 && (
                <div className="mt-10 flex items-center justify-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-bounce">
                   <CheckCircle size={14} /> Output_Array_Buffer_Released
                </div>
              )}
           </div>
        </div>
      )}

      {/* CONVERSION OVERLAY */}
      {isConverting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
           <div className="px-8 py-4 bg-white/10 border border-white/20 rounded-2xl flex items-center gap-4 text-white shadow-2xl animate-pulse">
              <RefreshCw className="animate-spin" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural_PDF_Transmutation_Active</span>
           </div>
        </div>
      )}
    </div>
  );
};

const NavBtn = ({ active, icon, label, count, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all group ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/10' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
  >
    <div className="flex items-center gap-4">
       {icon}
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    {count !== undefined && count > 0 && (
      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black ${active ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'}`}>
        {count}
      </span>
    )}
  </button>
);

export default InboxApp;
