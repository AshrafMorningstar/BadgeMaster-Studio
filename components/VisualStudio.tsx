/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

import React, { useState, useRef } from 'react';
import { generateBadgeImage, editProfileImage } from '../services/geminiService';
import { ImageSize } from '../types';
import { Loader2, Wand2, ImagePlus, Download, Sparkles, Key } from 'lucide-react';

const VisualStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'edit'>('create');
  
  // Create State
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Edit State
  const [editPrompt, setEditPrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    
    // Check key for Pro model
    const hasKey = await window.aistudio?.hasSelectedApiKey();
    if (!hasKey) {
        await window.aistudio?.openSelectKey();
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const url = await generateBadgeImage(prompt, size);
      setGeneratedImage(url);
    } catch (e) {
      console.error(e);
      alert("Failed to generate image. Ensure you are using a paid project key for Pro models.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!editPrompt || !sourceImage) return;
    setIsEditing(true);
    setEditedImage(null);
    try {
      // remove data:image/png;base64, prefix if present for the API, actually the API example shows keeping or using raw.
      // The API expects base64 string without prefix usually, let's strip it.
      const base64Data = sourceImage.split(',')[1];
      const url = await editProfileImage(base64Data, editPrompt);
      setEditedImage(url);
    } catch (e) {
      console.error(e);
      alert("Failed to edit image.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className="p-2 bg-pink-500/10 dark:bg-pink-500/20 rounded-lg">
                <Wand2 className="w-6 h-6 text-pink-600 dark:text-pink-400" />
             </div>
             <div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Visual Studio</h2>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Professional Badge & Asset Creation Suite</p>
             </div>
         </div>
         <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex text-sm font-medium transition-colors">
             <button
                onClick={() => setActiveTab('create')}
                className={`px-4 py-1.5 rounded-md transition-all ${activeTab === 'create' ? 'bg-white dark:bg-pink-600 text-pink-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
             >
                 Badge Creator
             </button>
             <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-1.5 rounded-md transition-all ${activeTab === 'edit' ? 'bg-white dark:bg-pink-600 text-pink-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
             >
                 Profile Editor
             </button>
         </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-6 overflow-y-auto custom-scrollbar shadow-sm dark:shadow-inner transition-colors duration-300">
        {activeTab === 'create' ? (
            <div className="flex flex-col lg:flex-row gap-8 h-full">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="A shiny golden badge shaped like a rocket ship, 3d render, isometric..."
                            className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Resolution</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[ImageSize.SIZE_1K, ImageSize.SIZE_2K, ImageSize.SIZE_4K].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                                        size === s 
                                        ? 'bg-pink-50 dark:bg-pink-500/20 border-pink-500 text-pink-700 dark:text-pink-400' 
                                        : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-500/30 rounded-lg p-3 mb-4 flex gap-3 items-start">
                             <Key className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                             <p className="text-xs text-amber-800 dark:text-amber-200">
                                 High-quality image generation (2K/4K) requires a paid project API key. You will be prompted to select one if needed.
                             </p>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="w-full py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white shadow-lg shadow-pink-900/20 dark:shadow-pink-900/20 transition-all flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                            Generate Badge
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center min-h-[400px] transition-colors">
                    {isGenerating ? (
                        <div className="text-center">
                            <Loader2 className="w-10 h-10 text-pink-500 animate-spin mx-auto mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">Crafting your badge...</p>
                        </div>
                    ) : generatedImage ? (
                        <div className="relative group w-full h-full p-4 flex items-center justify-center">
                            <img src={generatedImage} alt="Generated" className="max-w-full max-h-full rounded-lg shadow-2xl" />
                            <a 
                                href={generatedImage} 
                                download="badge.png"
                                className="absolute bottom-8 right-8 bg-white text-slate-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100"
                            >
                                <Download className="w-5 h-5" />
                            </a>
                        </div>
                    ) : (
                        <div className="text-slate-400 dark:text-slate-500 flex flex-col items-center">
                            <ImagePlus className="w-12 h-12 mb-2 opacity-50" />
                            <p>Preview area</p>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div className="flex flex-col lg:flex-row gap-8 h-full">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="space-y-4">
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Source Image</label>
                         <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors"
                         >
                            {sourceImage ? (
                                <img src={sourceImage} alt="Source" className="h-full object-contain" />
                            ) : (
                                <>
                                    <ImagePlus className="w-6 h-6 text-slate-400 mb-2" />
                                    <span className="text-sm text-slate-500">Click to upload</span>
                                </>
                            )}
                         </div>
                         <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Edit Instruction</label>
                        <textarea
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="Add a retro filter, remove the background, add a party hat..."
                            className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-colors"
                        />
                    </div>
                    
                    <button
                        onClick={handleEdit}
                        disabled={isEditing || !editPrompt || !sourceImage}
                        className="w-full mt-auto py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white shadow-lg shadow-pink-900/20 dark:shadow-pink-900/20 transition-all flex items-center justify-center gap-2"
                    >
                        {isEditing ? <Loader2 className="animate-spin" /> : <Wand2 />}
                        Apply Edit
                    </button>
                </div>

                <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center min-h-[400px] transition-colors">
                    {isEditing ? (
                         <div className="text-center">
                            <Loader2 className="w-10 h-10 text-pink-500 animate-spin mx-auto mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">Applying magic...</p>
                        </div>
                    ) : editedImage ? (
                         <div className="relative group w-full h-full p-4 flex items-center justify-center">
                            <img src={editedImage} alt="Edited" className="max-w-full max-h-full rounded-lg shadow-2xl" />
                             <a 
                                href={editedImage} 
                                download="edited_profile.png"
                                className="absolute bottom-8 right-8 bg-white text-slate-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100"
                            >
                                <Download className="w-5 h-5" />
                            </a>
                        </div>
                    ) : (
                        <div className="text-slate-400 dark:text-slate-500 flex flex-col items-center">
                            <Wand2 className="w-12 h-12 mb-2 opacity-50" />
                            <p>Edited result will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default VisualStudio;