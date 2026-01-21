
import React, { useState, useRef, useEffect } from 'react';
import { terminalCommand } from '../../services/geminiService';
import { Terminal as TermIcon, ChevronRight } from 'lucide-react';

const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<{ cmd: string, output: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const cmd = input;
    setInput('');
    setLoading(true);

    try {
      const output = await terminalCommand(cmd);
      setHistory(prev => [...prev, { cmd, output }]);
    } catch (err) {
      setHistory(prev => [...prev, { cmd, output: 'SYSTEM_ERROR: CMD_NOT_FOUND' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black mono text-white p-6 text-[11px] overflow-hidden">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <TermIcon className="w-4 h-4 text-red-600" />
        <span className="font-black tracking-[0.4em] uppercase text-[10px]">AURA_SHELL_V2.5</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 mb-6 custom-scrollbar pr-4">
        <div className="text-slate-600 leading-relaxed">
          [INIT] AURA_PRO_KERNEL_LOADED_X64<br />
          [BOOT] PRIMARY_SUBSYSTEMS_ONLINE<br />
          [INFO] SYSTEM ENCRYPTED // TYPE 'HELP' FOR MODULES.
        </div>
        
        {history.map((h, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-red-600 font-black tracking-widest">AURA@SYSTEM_CMD&gt;</span>
              <span className="text-white font-bold">{h.cmd}</span>
            </div>
            <div className="pl-6 text-slate-400 leading-relaxed whitespace-pre-wrap selection:bg-red-600 selection:text-white">
              {h.output}
            </div>
          </div>
        ))}
        {loading && <div className="animate-pulse text-red-600">[PROCESSING...]</div>}
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-3 border-t border-white/10 pt-6">
        <ChevronRight className="w-4 h-4 text-red-600" />
        <input 
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ENTER_COMMAND"
          className="flex-1 bg-transparent outline-none border-none text-white font-bold placeholder-slate-800"
        />
      </form>
    </div>
  );
};

export default TerminalApp;
