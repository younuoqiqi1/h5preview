import React from 'react';
import { Trash2 } from 'lucide-react';

interface EditorProps {
  code: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const Editor: React.FC<EditorProps> = ({ code, onChange, onClear }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      
      // Insert 2 spaces for tab
      target.value = value.substring(0, start) + "  " + value.substring(end);
      target.selectionStart = target.selectionEnd = start + 2;
      onChange(target.value);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e]">
      <div className="bg-[#252526] px-4 py-2 text-xs text-gray-400 font-mono border-b border-[#333] flex justify-between items-center">
        <span>index.html</span>
        <button 
          type="button"
          onClick={onClear}
          className="text-gray-400 hover:text-red-400 hover:bg-[#333] p-1 rounded transition-colors"
          title="Clear Code"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <textarea
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1 w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-none focus:outline-none leading-relaxed"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Type your HTML, CSS, and JS here..."
      />
    </div>
  );
};

export default Editor;