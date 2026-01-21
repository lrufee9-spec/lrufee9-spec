
import React, { useState } from 'react';
import { Book, NewsPost } from '../../types';
import { 
  BookOpen, Newspaper, ShoppingCart, Download, Printer, 
  ArrowLeft, Search, Plus, Repeat2, Heart, Share2, 
  FileText, Bookmark, ShoppingBag, Globe, Send,
  Layers, Filter, CheckCircle, Clock, MoreHorizontal
} from 'lucide-react';

const BooksApp: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'newspaper' | 'library' | 'store'>('newspaper');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsInput, setNewsInput] = useState('');

  const [books, setBooks] = useState<Book[]>([
    {
      id: 'b1',
      title: 'Neural Architecture 101',
      author: 'Dr. Nexus',
      type: 'pdf',
      price: 25.00,
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
      isPurchased: true,
      description: 'Foundational concepts of artificial synaptic pathways.'
    },
    {
      id: 'b2',
      title: 'The Silicon Soul',
      author: 'Aura_Echo',
      type: 'physical',
      price: 45.00,
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
      isPurchased: false,
      description: 'A deep dive into the philosophy of synthetic consciousness.'
    },
    {
      id: 'b3',
      title: 'Advanced CLI Mastery',
      author: 'Root_User',
      type: 'pdf',
      price: 12.00,
      cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      isPurchased: false,
      description: 'Mastering the Aura terminal for power users.'
    }
  ]);

  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([
    {
      id: 'n1',
      author: 'Sentinel_Prime',
      content: 'The Neural Mesh is expanding. Node 14 is now synchronized with Global Hub Alpha. #AuraOS #Sync',
      timestamp: new Date(),
      relays: 45,
      pulses: 128
    },
    {
      id: 'n2',
      author: 'Kore_Dev',
      content: 'Just deployed the Printer Array protocol. You can now physicalize any PDF node instantly. Testing with Dr. Nexus\'s papers.',
      timestamp: new Date(Date.now() - 3600000),
      relays: 12,
      pulses: 89
    }
  ]);

  const handlePostNews = () => {
    if (!newsInput.trim()) return;
    const newPost: NewsPost = {
      id: `n${Date.now()}`,
      author: 'Admin_User',
      content: newsInput,
      timestamp: new Date(),
      relays: 0,
      pulses: 0
    };
    setNewsPosts([newPost, ...newsPosts]);
    setNewsInput('');
  };

  const handlePurchase = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, isPurchased: true } : b));
    alert("TRANSACTION_SECURE // Knowledge Node Decrypted.");
  };

  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Aura_Knowledge</h2>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Neural Library Hub</p>
          </div>
        </div>

        <div className="hidden sm:flex bg-white/5 rounded-2xl p-1 border border-white/5 shadow-inner">
           <TabBtn active={activeTab === 'newspaper'} label="Broadcasts" icon={<Newspaper size={14}/>} onClick={() => setActiveTab('newspaper')} />
           <TabBtn active={activeTab === 'library'} label="My Vault" icon={<Bookmark size={14}/>} onClick={() => setActiveTab('library')} />
           <TabBtn active={activeTab === 'store'} label="Bookstore" icon={<ShoppingBag size={14}/>} onClick={() => setActiveTab('store')} />
        </div>
        
        <button className="sm:hidden p-2 text-slate-500 hover:text-white"><Filter size={20}/></button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'newspaper' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 max-w-2xl mx-auto w-full">
             {/* Post Input */}
             <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 space-y-4">
                <div className="flex gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Globe size={20}/>
                   </div>
                   <textarea 
                    value={newsInput}
                    onChange={e => setNewsInput(e.target.value)}
                    placeholder="BROADCAST_YOUR_THOUGHTS..."
                    className="flex-1 bg-transparent border-none text-white text-sm outline-none resize-none pt-2 placeholder-slate-700"
                    rows={2}
                   />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                   <div className="flex gap-2">
                      <button className="p-2 text-slate-500 hover:text-indigo-400"><Layers size={18}/></button>
                      <button className="p-2 text-slate-500 hover:text-indigo-400"><FileText size={18}/></button>
                   </div>
                   <button 
                    onClick={handlePostNews}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all"
                   >
                     Publish_Broadcast
                   </button>
                </div>
             </div>

             {/* Newspaper Feed */}
             <div className="space-y-6">
                {newsPosts.map(post => (
                  <div key={post.id} className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:bg-white/10 transition-all group">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[10px] font-black text-white uppercase">
                              {post.author[0]}
                           </div>
                           <div>
                              <h4 className="text-sm font-black text-white uppercase tracking-tight italic">{post.author}</h4>
                              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                           </div>
                        </div>
                        <button className="p-2 text-slate-700 hover:text-white transition-colors"><MoreHorizontal size={16}/></button>
                     </div>
                     <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">{post.content}</p>
                     <div className="flex gap-8">
                        <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-all text-[10px] font-black uppercase tracking-widest">
                           <Repeat2 size={16}/> {post.relays} Relays
                        </button>
                        <button className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-all text-[10px] font-black uppercase tracking-widest">
                           <Heart size={16}/> {post.pulses} Pulses
                        </button>
                        <button className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-all text-[10px] font-black uppercase tracking-widest">
                           <Share2 size={16}/> Matrix
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'library' && (
           <div className="flex-1 overflow-y-auto custom-scrollbar p-8 max-w-5xl mx-auto w-full space-y-10">
              <header>
                 <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">My_Vault</h3>
                 <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Authorized Neural Manuscripts</p>
              </header>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {books.filter(b => b.isPurchased).map(book => (
                   <div key={book.id} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 space-y-6 group hover:bg-white/10 transition-all active-scale cursor-pointer">
                      <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-black shadow-2xl relative">
                         <img src={book.cover} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                         <div className="absolute bottom-4 left-4 right-4">
                            <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">{book.type} Node</span>
                         </div>
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none truncate">{book.title}</h4>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{book.author}</p>
                      </div>
                      <div className="flex gap-3">
                         <button className="flex-1 py-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
                            <Download size={16}/> <span className="text-[9px] font-black uppercase tracking-widest">Download</span>
                         </button>
                         <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                            <Printer size={16}/>
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'store' && (
           <div className="flex-1 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5">
                 <div className="relative max-w-4xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="SEARCH_BOOK_PROTOCOLS..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
                    />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                 <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map(book => (
                       <div key={book.id} className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden group hover:border-indigo-500/30 transition-all flex flex-col">
                          <div className="aspect-[4/5] relative overflow-hidden bg-black flex-shrink-0">
                             <img src={book.cover} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-all duration-700" alt="" />
                             {!book.isPurchased && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                   <div className="flex flex-col items-center gap-2">
                                      <ShoppingBag className="text-white" size={24} />
                                      <span className="text-[10px] font-black text-white uppercase tracking-widest">${book.price.toFixed(2)}_CREDITS</span>
                                      <button 
                                        onClick={() => handlePurchase(book.id)}
                                        className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/40"
                                      >
                                        Initiate_Buy
                                      </button>
                                   </div>
                                </div>
                             )}
                             {book.isPurchased && (
                                <div className="absolute top-4 right-4 p-2 bg-emerald-500 text-white rounded-xl shadow-lg">
                                   <CheckCircle size={16} />
                                </div>
                             )}
                             <div className="absolute bottom-4 left-4">
                                <span className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[8px] font-black text-white uppercase tracking-widest">{book.type}</span>
                             </div>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                             <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{book.title}</h4>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1 italic">{book.author}</p>
                             </div>
                             {!book.isPurchased ? (
                               <div className="mt-4 flex items-center justify-between">
                                  <span className="text-sm font-black text-indigo-400 italic">${book.price}</span>
                                  <button onClick={() => handlePurchase(book.id)} className="p-2 text-slate-400 hover:text-white transition-all"><Plus size={20}/></button>
                               </div>
                             ) : (
                               <button 
                                onClick={() => setActiveTab('library')}
                                className="mt-4 w-full py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                               >
                                 Access_Manuscript
                               </button>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Back to Hub Footer (Mobile Only) */}
      <div className="sm:hidden p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/5">
         <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
            <TabBtn active={activeTab === 'newspaper'} label="News" icon={<Newspaper size={14}/>} onClick={() => setActiveTab('newspaper')} />
            <TabBtn active={activeTab === 'library'} label="Vault" icon={<Bookmark size={14}/>} onClick={() => setActiveTab('library')} />
            <TabBtn active={activeTab === 'store'} label="Store" icon={<ShoppingBag size={14}/>} onClick={() => setActiveTab('store')} />
         </div>
      </div>
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

export default BooksApp;
