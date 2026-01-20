import React, { useState } from 'react';
import { generateCodeFromPrompt } from '../services/geminiService';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface AIGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onCodeGenerated: (code: string) => void;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({ isOpen, onClose, onCodeGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const code = await generateCodeFromPrompt(prompt);
      onCodeGenerated(code);
      onClose();
      setPrompt('');
    } catch (err) {
      setError("Failed to generate code. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Sparkles className="text-purple-500" size={18} />
            Generate with Gemini
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <label className="block text-sm text-gray-400 mb-2">
            Describe the webpage or component you want to create:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 bg-gray-950 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none placeholder-gray-600"
            placeholder="e.g., A responsive landing page for a coffee shop with a hero section, feature grid, and a dark theme..."
          />
          
          {error && (
            <div className="mt-3 text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-900/50">
              {error}
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-850 border-t border-gray-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium flex items-center gap-2 transition"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;