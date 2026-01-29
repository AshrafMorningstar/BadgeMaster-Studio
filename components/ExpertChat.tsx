import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ModelMode, ChatMessage } from '../types';
import { Send, Zap, Globe, BrainCircuit, Bot, User, Loader2, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ExpertChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your GitHub Achievements Expert. Ask me anything about badges, or switch modes for specialized help." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ModelMode>(ModelMode.FAST);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for API (converting our generic type to Gemini format)
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await sendChatMessage(input, mode, history);
      
      const modelMsg: ChatMessage = {
        role: 'model',
        text: response.text || "I couldn't generate a response.",
        sources: response.sources
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error processing your request." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  }

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto animate-fade-in">
       <div className="flex items-center justify-between mb-4">
         <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg">
                <Bot className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
             </div>
             <div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Expert Chat</h2>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Select a specialized mode for your needs</p>
             </div>
         </div>
         
         <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg transition-colors">
             <button
                onClick={() => setMode(ModelMode.FAST)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${mode === ModelMode.FAST ? 'bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
             >
                <Zap className="w-4 h-4" />
                <span>Fast</span>
             </button>
             <button
                onClick={() => setMode(ModelMode.SEARCH)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${mode === ModelMode.SEARCH ? 'bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
             >
                <Globe className="w-4 h-4" />
                <span>Search</span>
             </button>
             <button
                onClick={() => setMode(ModelMode.THINKING)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${mode === ModelMode.THINKING ? 'bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
             >
                <BrainCircuit className="w-4 h-4" />
                <span>Deep Think</span>
             </button>
         </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden shadow-sm dark:shadow-inner transition-colors duration-300">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-4 transition-colors ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'}`}>
                          <div className="flex items-center gap-2 mb-2 opacity-50 text-xs uppercase tracking-wider font-semibold">
                              {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                              {msg.role === 'user' ? 'You' : 'Expert'}
                          </div>
                          <div className="prose dark:prose-invert prose-sm max-w-none">
                             <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                          {msg.sources && msg.sources.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600">
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Sources:</p>
                                  <div className="flex flex-wrap gap-2">
                                      {msg.sources.map((src, i) => (
                                          <a 
                                            key={i} 
                                            href={src.uri} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center gap-1 text-xs bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-600 px-2 py-1 rounded-md text-blue-500 dark:text-blue-300 transition-colors truncate max-w-[200px] border border-slate-200 dark:border-slate-600"
                                          >
                                              <ExternalLink className="w-3 h-3" />
                                              <span className="truncate">{src.title || src.uri}</span>
                                          </a>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              ))}
              {loading && (
                  <div className="flex justify-start">
                      <div className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-3 transition-colors">
                          <Loader2 className="w-5 h-5 animate-spin text-emerald-500 dark:text-emerald-400" />
                          <span className="text-sm text-slate-500 dark:text-slate-300">
                              {mode === ModelMode.THINKING ? 'Thinking deeply...' : mode === ModelMode.SEARCH ? 'Searching the web...' : 'Typing...'}
                          </span>
                      </div>
                  </div>
              )}
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors">
              <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask about GitHub achievements (${mode === ModelMode.THINKING ? 'Thinking Mode' : mode === ModelMode.SEARCH ? 'Search Mode' : 'Fast Mode'})...`}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl pl-4 pr-12 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none max-h-32 min-h-[56px] custom-scrollbar transition-colors"
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="absolute right-2 bottom-2 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-all"
                  >
                      <Send className="w-4 h-4" />
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ExpertChat;