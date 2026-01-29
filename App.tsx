import React, { useState, useEffect, useRef } from 'react';
import BadgeGuide from './components/BadgeGuide';
import VisualStudio from './components/VisualStudio';
import ExpertChat from './components/ExpertChat';
import { BookOpen, Palette, MessageSquare, Award, Sun, Moon } from 'lucide-react';

// --- Particle Background Component ---
const ParticleBackground = ({ isDark }: { isDark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; dx: number; dy: number; size: number; alpha: number; pulse: number }[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = window.innerWidth < 768 ? 20 : 40; 
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.2,
          dy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.5 + 0.1,
          pulse: Math.random() * 0.01
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.alpha += p.pulse;
        if (p.alpha > 0.6 || p.alpha < 0.1) p.pulse *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Subtle stars/dust
        ctx.fillStyle = isDark 
          ? `rgba(255, 255, 255, ${p.alpha * 0.2})` // Reduced opacity
          : `rgba(79, 70, 229, ${p.alpha * 0.15})`; // Reduced opacity
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guide' | 'studio' | 'chat'>('guide');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30 overflow-hidden relative bg-slate-50 dark:bg-[#050914] text-slate-900 dark:text-slate-100 transition-colors duration-700">
      
      {/* --- Premium Background System --- */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* 1. Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white/80 to-slate-100/50 dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#0B1120] transition-colors duration-700"></div>

        {/* 2. Animated Blobs - Reduced opacity for readability */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-float-slow"></div>
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-float-delayed"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-float-reverse"></div>

        {/* 3. Texture Overlay (Noise) */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* 4. Canvas Particles */}
        <ParticleBackground isDark={theme === 'dark'} />
      </div>

      {/* --- Glass Navigation Sidebar --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm md:max-w-none md:w-auto md:translate-x-0 md:left-6 md:top-6 md:bottom-6 md:flex-col bg-white/70 dark:bg-[#0F172A]/70 backdrop-blur-2xl border border-white/40 dark:border-slate-700/40 shadow-2xl dark:shadow-black/50 z-50 rounded-2xl md:rounded-[2rem] flex justify-between md:justify-start p-2 md:p-6 transition-all duration-300 ring-1 ring-black/5 dark:ring-white/5 animate-fade-in">
        
        {/* Brand */}
        <div className="hidden md:flex flex-col items-center mb-10 gap-4 mt-2">
          <div className="relative group cursor-pointer">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-500"></div>
             <div className="relative bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Award className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
             </div>
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent tracking-tight">BadgeMaster</h1>
            <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-500 dark:text-indigo-400 uppercase">Studio</span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex md:flex-col w-full gap-2 md:gap-3 justify-between md:justify-start items-center md:items-stretch">
            <NavButton 
              active={activeTab === 'guide'} 
              onClick={() => setActiveTab('guide')} 
              icon={<BookOpen className="w-5 h-5" />} 
              label="Gallery" 
            />
            <NavButton 
              active={activeTab === 'studio'} 
              onClick={() => setActiveTab('studio')} 
              icon={<Palette className="w-5 h-5" />} 
              label="Studio" 
            />
            <NavButton 
              active={activeTab === 'chat'} 
              onClick={() => setActiveTab('chat')} 
              icon={<MessageSquare className="w-5 h-5" />} 
              label="Expert" 
            />
        </div>

        {/* Theme Toggle & Attribution */}
        <div className="hidden md:flex flex-col gap-4 mt-auto">
           <button 
             onClick={toggleTheme}
             className="w-full h-12 flex items-center justify-center rounded-xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400 transition-all duration-300 group overflow-hidden"
           >
             <div className="relative z-10 flex items-center gap-2">
                 {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                 <span className="text-xs font-semibold">Theme</span>
             </div>
           </button>
           
           <div className="text-center px-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
                Created by<br/>Ashraf Morningstar
              </p>
           </div>
        </div>
        
        {/* Mobile Theme Toggle */}
         <button onClick={toggleTheme} className="md:hidden p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
             {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
         </button>

      </nav>

      {/* Main Content Area */}
      <main className="md:pl-32 lg:pl-80 w-full min-h-screen p-4 md:p-8 pb-32 md:pb-8 transition-all duration-500">
        <div className="max-w-[1600px] mx-auto h-full">
          {/* Using key to force re-animation when tab changes */}
          <div key={activeTab} className="animate-fade-in">
            {activeTab === 'guide' && <BadgeGuide />}
            {activeTab === 'studio' && <VisualStudio />}
            {activeTab === 'chat' && <ExpertChat />}
          </div>
        </div>
      </main>

      {/* Styles for scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`
      relative group flex flex-col md:flex-row items-center md:gap-3 p-3 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl transition-all duration-300 ease-out w-full overflow-hidden
      ${active 
        ? 'text-white shadow-[0_8px_20px_-6px_rgba(79,70,229,0.4)] scale-[1.02]' 
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-white/5'
      }
    `}
  >
    {/* Active Background - Gradient Mesh */}
    {active && (
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-600 -z-10 animate-fade-in">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>
    )}
    
    <div className={`relative z-10 ${active ? 'text-white' : ''} transition-transform duration-300 group-hover:scale-110 md:group-hover:scale-100`}>
        {icon}
    </div>
    <span className={`relative z-10 text-[10px] md:text-sm font-semibold mt-1 md:mt-0 ${active ? 'text-indigo-50' : ''}`}>{label}</span>
    
    {/* Subtle Glow on Hover (Non-active) */}
    {!active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full hidden md:block"></div>
    )}
  </button>
);

export default App;