import React, { useState, useEffect, useRef } from 'react';
import { generateBadgeGuide } from '../services/geminiService';
import { Loader2, RefreshCw, BookOpen, Search, Filter, ArrowUpDown, ChevronRight, Trophy, Star, Shield, Lock, ArrowLeft, Plus, X, CheckCircle2, LayoutGrid, LayoutList, Info, Copy, Check, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '../types';
import { INITIAL_BADGES } from '../data/badges';

const BadgeGuide: React.FC = () => {
  const [mode, setMode] = useState<'gallery' | 'docs'>('gallery');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  
  // Gallery State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Badge; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState<'all' | 'owned' | 'unowned'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Scroll Restoration
  const lastViewedIdRef = useRef<string | null>(null);
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [badgeToAdd, setBadgeToAdd] = useState<string>('');

  // Docs State
  const [docContent, setDocContent] = useState<string>("");
  const [loadingDocs, setLoadingDocs] = useState(false);

  // --- Effects ---

  // Scroll to the last viewed badge when returning to gallery
  useEffect(() => {
    if (!selectedBadge && lastViewedIdRef.current && mode === 'gallery') {
      // Small timeout to ensure DOM is rendered
      setTimeout(() => {
        const element = document.getElementById(`badge-${lastViewedIdRef.current}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [selectedBadge, mode, viewMode]);

  // --- Actions ---

  const handleBadgeSelect = (badge: Badge) => {
    lastViewedIdRef.current = badge.id;
    setSelectedBadge(badge);
  };

  const handleCopyId = (id: string) => {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSort = (key: keyof Badge) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleOwnership = (id: string) => {
    setBadges(prev => prev.map(b => b.id === id ? { ...b, owned: !b.owned } : b));
  };

  const loadGuide = async () => {
    setLoadingDocs(true);
    try {
      const text = await generateBadgeGuide();
      setDocContent(text);
    } catch (e) {
      setDocContent("Error generating guide.");
    } finally {
      setLoadingDocs(false);
    }
  };

  // --- Filtering & Sorting Logic ---
  const lowerSearch = searchTerm.toLowerCase();
  
  const filteredBadges = badges
    .filter(b => {
      const matchesSearch = 
        b.name.toLowerCase().includes(lowerSearch) || 
        b.description.toLowerCase().includes(lowerSearch) ||
        b.howToEarn.toLowerCase().includes(lowerSearch) ||
        (b.strategy && b.strategy.toLowerCase().includes(lowerSearch)) ||
        b.category.toLowerCase().includes(lowerSearch);
        
      const matchesStatus = filterStatus === 'all' 
                          ? true 
                          : filterStatus === 'owned' ? b.owned : !b.owned;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const getRelatedBadges = (badge: Badge) => {
    return badges
      .filter(b => b.id !== badge.id && b.category === badge.category)
      .slice(0, 3);
  };

  // --- Components ---

  const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAnalyzing(true);
        // Simulate fetching strategy
        setTimeout(() => {
            setIsAnalyzing(false);
            handleBadgeSelect(badge);
        }, 1200);
    };

    return (
        <div 
            id={`badge-${badge.id}`}
            onClick={() => handleBadgeSelect(badge)}
            className="group relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 z-0"
        >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl backdrop-blur-sm scale-95 group-hover:scale-100 origin-bottom border border-white/10 dark:border-slate-200/20">
                <div className="font-bold mb-1 flex items-center gap-1.5 text-indigo-400 dark:text-indigo-600">
                    <Trophy className="w-3 h-3" />
                    How to Earn
                </div>
                <p className="leading-relaxed font-medium">{badge.howToEarn}</p>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent border-t-slate-900/95 dark:border-t-white/95"></div>
            </div>

            {/* Card Body Container - Handles Overflow and Shape */}
            <div className="relative h-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-[2rem] border border-white/60 dark:border-slate-700/60 p-6 overflow-hidden shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-500/10 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors duration-300 flex flex-col">
                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-white/30 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform ease-in-out duration-1000"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-5">
                        <div className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-white/20 dark:border-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
                            ${badge.owned ? 'bg-emerald-500/10 backdrop-blur-sm' : 'bg-slate-100/80 dark:bg-slate-700/50'}
                        `}>
                            {badge.emoji}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm transition-all duration-500 ${
                            badge.owned 
                            ? 'bg-emerald-500/90 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/20' 
                            : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400 border-transparent'
                        }`}>
                            {badge.owned ? 'Owned' : 'Locked'}
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {badge.name}
                    </h3>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-5 font-medium leading-relaxed">
                        {badge.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm transition-all duration-700 ${
                            badge.rarity === 'Common' ? 'text-slate-600 bg-slate-100/80 dark:bg-slate-800/80' :
                            badge.rarity === 'Rare' ? 'text-sky-600 bg-sky-100/80 dark:bg-sky-900/40' :
                            badge.rarity === 'Epic' ? 'text-purple-600 bg-purple-100/80 dark:bg-purple-900/40' :
                            'text-amber-600 bg-amber-100/80 dark:bg-amber-900/40'
                        } ${badge.owned ? 'shadow-[0_0_15px_rgba(255,255,255,0.4)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] animate-pulse scale-110' : ''}`}>
                            {badge.rarity}
                        </span>

                        <button 
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className={`
                                relative overflow-hidden rounded-full h-8 px-3 flex items-center gap-2 text-xs font-bold transition-all duration-300
                                ${isAnalyzing 
                                    ? 'w-8 px-0 justify-center bg-indigo-500 text-white' 
                                    : 'bg-white/80 dark:bg-slate-700/80 text-slate-500 hover:text-white hover:bg-indigo-500 w-auto'
                                }
                            `}
                        >
                            {isAnalyzing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                   <BrainCircuit className="w-3.5 h-3.5" />
                                   <span className="hidden group-hover:inline">Analyze</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const BadgeRow: React.FC<{ badge: Badge }> = ({ badge }) => (
    <tr 
        id={`badge-${badge.id}`}
        onClick={() => handleBadgeSelect(badge)}
        className="group border-b border-slate-100 dark:border-slate-800 hover:bg-white/60 dark:hover:bg-slate-800/60 cursor-pointer transition-all duration-300"
    >
        <td className="px-6 py-4">
            <div className="flex items-center gap-4 relative">
                <div className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-2xl group-hover:scale-110 transition-transform">
                    {badge.emoji}
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-500 transition-colors">
                    {badge.name}
                </div>
            </div>
        </td>
        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
            {badge.description}
        </td>
        <td className="px-6 py-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                 badge.rarity === 'Common' ? 'text-slate-500 bg-slate-100 dark:bg-slate-800' :
                 badge.rarity === 'Rare' ? 'text-sky-600 bg-sky-50 dark:bg-sky-900/20' :
                 badge.rarity === 'Epic' ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' :
                 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
            }`}>
                {badge.rarity}
            </span>
        </td>
        <td className="px-6 py-4">
            {badge.owned ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
                <Lock className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            )}
        </td>
    </tr>
  );

  // --- Detail View ---

  if (selectedBadge) {
      const relatedBadges = getRelatedBadges(selectedBadge);
      
      return (
          <div className="h-full flex flex-col animate-zoom-in">
              <div className="mb-6 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedBadge(null)}
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 transition-all shadow-sm hover:shadow-lg"
                  >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                      <span className="font-bold text-sm">Back to Gallery</span>
                  </button>
              </div>

              <div className="flex-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[3rem] border border-white/50 dark:border-slate-700/50 shadow-2xl overflow-hidden relative group animate-slide-up">
                   {/* Cinematic Background Glow */}
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-indigo-500/10 to-purple-500/0 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none animate-pulse duration-[8000ms]"></div>
                   
                   <div className="h-full overflow-y-auto custom-scrollbar p-8 lg:p-12 relative z-10">
                       <div className="flex flex-col lg:flex-row gap-12">
                           
                           {/* Left Column: Visuals */}
                           <div className="flex-shrink-0 flex flex-col gap-6 lg:w-80 xl:w-96">
                               <div className="aspect-square rounded-[2.5rem] bg-gradient-to-br from-white/90 to-slate-100/50 dark:from-slate-800/90 dark:to-slate-900/50 border border-white/50 dark:border-slate-700/50 shadow-2xl flex items-center justify-center text-[8rem] lg:text-[10rem] relative overflow-hidden group/icon backdrop-blur-sm">
                                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                   <div className="relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-6 transition-all duration-700 ease-spring drop-shadow-2xl">
                                       {selectedBadge.emoji}
                                   </div>
                               </div>
                               
                               <div className="space-y-3">
                                   <div className="flex justify-between items-center px-6 py-4 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/40 dark:border-slate-700/40 backdrop-blur-sm">
                                       <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</span>
                                       <span className={`text-sm font-bold flex items-center gap-2 ${selectedBadge.owned ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                                           {selectedBadge.owned ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                           {selectedBadge.owned ? 'Unlocked' : 'Locked'}
                                       </span>
                                   </div>

                                   <button 
                                      onClick={() => toggleOwnership(selectedBadge.id)}
                                      className={`w-full py-4 px-6 rounded-2xl text-sm font-bold tracking-wide border transition-all transform active:scale-95 shadow-xl ${
                                          selectedBadge.owned 
                                          ? 'bg-white/80 dark:bg-slate-800/80 text-red-500 border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 backdrop-blur' 
                                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent hover:shadow-emerald-500/30'
                                      }`}
                                   >
                                       {selectedBadge.owned ? 'Mark as Unowned' : 'Mark as Owned'}
                                   </button>
                               </div>

                               {/* Copy ID Footer */}
                               <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700/50">
                                   <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-black/20 border border-slate-200 dark:border-slate-800">
                                       <div className="flex flex-col">
                                           <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Badge ID</span>
                                           <code className="text-xs font-mono text-slate-600 dark:text-slate-300">{selectedBadge.id}</code>
                                       </div>
                                       <button 
                                            onClick={() => handleCopyId(selectedBadge.id)}
                                            className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 dark:text-slate-400 relative"
                                       >
                                           {copiedId === selectedBadge.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                           {copiedId === selectedBadge.id && (
                                               <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded animate-fade-in">
                                                   Copied!
                                               </span>
                                           )}
                                       </button>
                                   </div>
                               </div>
                           </div>
                           
                           {/* Right Column: Info */}
                           <div className="flex-1 space-y-10">
                               <div>
                                   <div className="flex flex-wrap items-center gap-4 mb-4">
                                       <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm">{selectedBadge.name}</h1>
                                       <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm border backdrop-blur-md ${
                                           selectedBadge.category === 'Historical' 
                                           ? 'bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800' 
                                           : 'bg-indigo-100/80 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800'
                                       }`}>
                                           {selectedBadge.category}
                                       </span>
                                   </div>
                                   <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">{selectedBadge.description}</p>
                               </div>

                               <div className="grid md:grid-cols-2 gap-6">
                                   <div className="space-y-6">
                                       {/* Strategy Card */}
                                       <div className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
                                            <div className="absolute top-0 right-0 p-20 bg-amber-500/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                                            <h3 className="relative z-10 text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl text-amber-600 dark:text-amber-400">
                                                    <Trophy className="w-5 h-5" /> 
                                                </div>
                                                How to Earn
                                            </h3>
                                            <p className="relative z-10 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                                {selectedBadge.howToEarn}
                                            </p>
                                       </div>
                                       
                                       {selectedBadge.strategy && (
                                           <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-[2rem] shadow-2xl shadow-indigo-500/30 text-white hover:-translate-y-1 transition-transform duration-300 border border-white/10">
                                                <div className="absolute top-0 right-0 p-24 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
                                                <h3 className="relative z-10 text-lg font-bold flex items-center gap-3 mb-3">
                                                    <div className="p-2 bg-white/20 rounded-xl text-white backdrop-blur-sm">
                                                        <Star className="w-5 h-5 fill-current" /> 
                                                    </div>
                                                    Pro Strategy
                                                </h3>
                                                <p className="relative z-10 text-indigo-50 leading-relaxed font-medium">
                                                    {selectedBadge.strategy}
                                                </p>
                                           </div>
                                       )}
                                   </div>

                                   <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-md rounded-[2rem] border border-white/40 dark:border-slate-700/40 p-6">
                                       <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                                           <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-300">
                                               <Shield className="w-5 h-5" /> 
                                           </div>
                                           Tiers & Progress
                                       </h3>
                                       
                                       {/* Progress Bar */}
                                       <div className="mb-6">
                                            <div className="flex justify-between text-xs font-bold mb-2 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                <span>Progress</span>
                                                <span>{selectedBadge.owned ? '100%' : '0%'}</span>
                                            </div>
                                            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${selectedBadge.owned ? 'bg-gradient-to-r from-emerald-500 to-teal-400 w-full' : 'w-0'}`}
                                                ></div>
                                            </div>
                                       </div>

                                       <div className="flex-1 space-y-3">
                                            {selectedBadge.tiers.map((tier, idx) => (
                                                <div key={idx} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur p-4 rounded-2xl border border-white/50 dark:border-slate-700/50 grid grid-cols-[1fr_auto] gap-4 group/tier hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors shadow-sm relative overflow-hidden">
                                                    {/* Connector Line (visual) */}
                                                    {idx !== selectedBadge.tiers.length - 1 && (
                                                        <div className="absolute left-6 bottom-0 top-12 w-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
                                                    )}

                                                    <div className="flex flex-col justify-center">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="font-black text-slate-900 dark:text-white text-lg">{tier.name}</div>
                                                            <Star className={`w-3.5 h-3.5 ${selectedBadge.owned ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                                                        </div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{tier.criteria}</div>
                                                    </div>
                                                    
                                                    <div className="flex items-center">
                                                        {selectedBadge.owned ? (
                                                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 scale-0 animate-zoom-in fill-mode-forwards" style={{animationDelay: `${idx * 150}ms`}}>
                                                                <CheckCircle2 className="w-6 h-6" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-300 dark:text-slate-500">
                                                                <Lock className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                       </div>
                                   </div>
                               </div>

                               {relatedBadges.length > 0 && (
                                 <div className="pt-4">
                                   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Related Badges</h3>
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     {relatedBadges.map(related => (
                                       <div 
                                         key={related.id}
                                         onClick={() => handleBadgeSelect(related)}
                                         className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-white/30 dark:border-slate-700/30 hover:bg-white/60 dark:hover:bg-slate-700/60 cursor-pointer transition-colors"
                                       >
                                          <div className="text-2xl">{related.emoji}</div>
                                          <div className="overflow-hidden">
                                            <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{related.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{related.rarity}</div>
                                          </div>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               )}
                           </div>
                       </div>
                   </div>
              </div>
          </div>
      )
  }

  // --- Main Gallery View ---

  return (
    <div className="h-full flex flex-col gap-8 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4 drop-shadow-sm">
                Badge Gallery
                <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 backdrop-blur align-middle">
                    {badges.length} Items
                </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl">
                The ultimate collection of GitHub achievements. Track your progress, learn strategies, and unlock your potential.
            </p>
        </div>

        <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 dark:border-slate-700/40 shadow-lg">
            <button 
                onClick={() => setMode('gallery')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'gallery' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
                Gallery
            </button>
            <button 
                onClick={() => { setMode('docs'); if(!docContent) loadGuide(); }}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${mode === 'docs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
                Guide
            </button>
        </div>
      </div>

      {mode === 'gallery' && (
        <>
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 p-1">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search badges, strategies, or descriptions..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-12 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-2xl text-base font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm hover:shadow-md text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    )}
                </div>
                
                <div className="flex gap-2">
                     <button 
                        onClick={() => setFilterStatus(prev => prev === 'all' ? 'owned' : prev === 'owned' ? 'unowned' : 'all')}
                        className="px-6 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800 transition-all flex items-center gap-3 min-w-[140px]"
                    >
                        <Filter className="w-4 h-4" />
                        <span>{filterStatus === 'all' ? 'All' : filterStatus === 'owned' ? 'Owned' : 'Missing'}</span>
                    </button>

                    <button 
                        onClick={() => handleSort('name')}
                        className="px-6 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800 transition-all flex items-center gap-3"
                    >
                        <ArrowUpDown className="w-4 h-4" />
                        <span>Sort</span>
                    </button>

                    <div className="flex bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-2xl p-1.5">
                        <button 
                           onClick={() => setViewMode('grid')}
                           className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button 
                           onClick={() => setViewMode('list')}
                           className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <LayoutList className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Badges Grid/List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar rounded-[2.5rem] p-2 -mx-2">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                        {filteredBadges.map(badge => (
                            <BadgeCard key={badge.id} badge={badge} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 dark:border-slate-700/60 overflow-hidden pb-20">
                         <table className="w-full text-left">
                             <thead className="bg-white/40 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700">
                                 <tr>
                                     <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Badge</th>
                                     <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Description</th>
                                     <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Rarity</th>
                                     <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Status</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {filteredBadges.map(badge => (
                                     <BadgeRow key={badge.id} badge={badge} />
                                 ))}
                             </tbody>
                         </table>
                    </div>
                )}

                {filteredBadges.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Search className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No badges found matching your criteria.</p>
                        <button 
                           onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                           className="mt-4 text-indigo-500 hover:text-indigo-600 font-bold"
                        >
                           Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </>
      )}

      {mode === 'docs' && (
          <div className="flex-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-slate-700/40 p-8 lg:p-12 overflow-y-auto custom-scrollbar shadow-sm animate-slide-up">
              {loadingDocs ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                          <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-slate-700"></div>
                          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Consulting the archives...</p>
                  </div>
              ) : (
                  <article className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-2xl">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{docContent}</ReactMarkdown>
                  </article>
              )}
          </div>
      )}
    </div>
  );
};

export default BadgeGuide;