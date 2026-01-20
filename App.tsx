import React, { useState, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import PreviewFrame from './components/PreviewFrame';
import AIGenerator from './components/AIGenerator';
import { DEVICES, DEFAULT_CODE } from './constants';
import { Device } from './types';

function App() {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  // We use a separate state for the preview to allow debouncing (optional optimization, but good for heavy rendering)
  const [previewCode, setPreviewCode] = useState<string>(DEFAULT_CODE);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [currentDevice, setCurrentDevice] = useState<Device>(DEVICES[7]); // Default to responsive
  const [isLandscape, setIsLandscape] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Debounce the preview update slightly to avoid rapid iframe flashing on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setPreviewCode(code);
    }, 500);
    return () => clearTimeout(handler);
  }, [code]);

  const handleDeviceChange = (device: Device) => {
    setCurrentDevice(device);
    // Reset orientation if switching devices, optional but often cleaner
    setIsLandscape(false);
  };

  const handleRefresh = () => {
    setPreviewCode(code);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleClear = () => {
    setCode('');
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden font-sans">
      
      {/* Top Toolbar */}
      <Toolbar 
        currentDevice={currentDevice}
        onDeviceChange={handleDeviceChange}
        isLandscape={isLandscape}
        toggleOrientation={() => setIsLandscape(!isLandscape)}
        onGenerateClick={() => setIsAIModalOpen(true)}
        onRefreshClick={handleRefresh}
        onSaveClick={handleSave}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Editor Pane */}
        <div className="h-1/2 lg:h-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col">
          <Editor 
            code={code} 
            onChange={setCode} 
            onClear={handleClear}
          />
        </div>

        {/* Right: Preview Pane */}
        <div className="h-1/2 lg:h-full lg:w-1/2 relative bg-[#121212]">
          <PreviewFrame 
            code={previewCode} 
            device={currentDevice}
            isLandscape={isLandscape}
            refreshTrigger={refreshTrigger}
          />
        </div>

      </div>

      {/* AI Modal */}
      <AIGenerator 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)}
        onCodeGenerated={(newCode) => setCode(newCode)}
      />

    </div>
  );
}

export default App;