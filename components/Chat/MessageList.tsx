
import React from 'react';
import { Message, Role } from '../../types';
import { ExternalLink, User, Cpu, Sparkles, FileText, Image as ImageIcon } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {messages.map((message) => {
        if (message.role === Role.SYSTEM) {
          return (
            <div key={message.id} className="flex justify-center py-2">
              <div className="px-4 py-1.5 bg-indigo-500/5 border border-indigo-500/10 rounded-full flex items-center gap-2">
                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />
                <span className="text-[9px] font-mono text-indigo-400/70 uppercase tracking-widest">{message.content}</span>
              </div>
            </div>
          );
        }

        return (
          <div key={message.id} className={`flex gap-3 ${message.role === Role.USER ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
              message.role === Role.USER 
              ? 'bg-slate-800 border-white/5 text-slate-500 shadow-sm' 
              : 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
            }`}>
              {message.role === Role.USER ? <User size={16} /> : <Cpu size={16} />}
            </div>
            
            <div className={`flex flex-col flex-1 space-y-2 ${message.role === Role.USER ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-[12px] leading-relaxed shadow-sm transition-all hover:shadow-md ${
                message.role === Role.USER 
                ? 'bg-slate-800 text-slate-200 border border-white/5 rounded-tr-none' 
                : 'bg-white/5 text-white rounded-tl-none border border-white/10'
              }`}>
                {/* File Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {message.attachments.map((att, i) => (
                      <div key={i} className="p-2 bg-black/20 rounded-xl border border-white/5 flex items-center gap-3">
                        {att.mimeType.startsWith('image/') ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img src={`data:${att.mimeType};base64,${att.base64}`} className="w-full h-full object-cover" alt="" />
                          </div>
                        ) : <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><FileText size={16} /></div>}
                        <div className="pr-2">
                          <p className="text-[9px] font-black text-white uppercase tracking-tight">ATTACHMENT_NOD_0{i+1}</p>
                          <p className="text-[7px] text-slate-500 uppercase">{att.mimeType}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="whitespace-pre-wrap font-medium tracking-wide">{message.content || (message.role === Role.ASSISTANT && !isTyping ? "..." : "")}</div>
                
                {message.groundingUrls && message.groundingUrls.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                    {message.groundingUrls.map((link, idx) => (
                      <a 
                        key={idx} href={link.uri} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20 transition-all"
                      >
                        {link.title}
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 px-1">
                <span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      
      {isTyping && (
        <div className="flex gap-3 items-center animate-pulse">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles size={16} />
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-indigo-500/40 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-indigo-500/40 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 bg-indigo-500/40 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
