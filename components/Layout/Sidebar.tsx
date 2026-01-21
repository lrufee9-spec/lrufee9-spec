
import React from 'react';
import { Plus, MessageSquare, History, Search, Command } from 'lucide-react';
import { ChatSession } from '../../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, currentSessionId, onSelectSession, onNewSession }) => {
  return (
    <aside className="w-80 border-r border-slate-800 bg-[#0b1222] flex flex-col hidden lg:flex">
      <div className="p-6">
        <button 
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-700 py-3 rounded-xl transition-all active:scale-[0.98] font-medium"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      <div className="px-4 mb-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400" />
          <input 
            type="text" 
            placeholder="Search history..." 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2">
        <div className="flex items-center gap-2 px-2 mb-2">
          <History className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recent Activity</span>
        </div>
        
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all group ${
              currentSessionId === session.id 
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm' 
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <MessageSquare className={`w-4 h-4 flex-shrink-0 ${currentSessionId === session.id ? 'text-indigo-400' : 'text-slate-500'}`} />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{session.title}</p>
              <p className="text-[11px] opacity-40 mt-0.5">{session.messages.length} messages</p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-6 mt-auto border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
          <div className="w-8 h-8 rounded-full aura-gradient flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-white">Developer</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Pro Workspace</p>
          </div>
          <Command className="w-4 h-4 text-slate-600" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
