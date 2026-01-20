import React, { useState, useEffect, useRef } from 'react';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import PreviewFrame from './components/PreviewFrame';
import { DEVICES, DEFAULT_CODE } from './constants';
import { Device } from './types';

function App() {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  // We use a separate state for the preview to allow debouncing (optional optimization, but good for heavy rendering)
  const [previewCode, setPreviewCode] = useState<string>(DEFAULT_CODE);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [currentDevice, setCurrentDevice] = useState<Device>(DEVICES[7]); // Default to responsive
  const [isLandscape, setIsLandscape] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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

  const handleFullscreen = () => {
    if (!isFullscreen && previewRef.current) {
      // Enter fullscreen
      if (previewRef.current.requestFullscreen) {
        previewRef.current.requestFullscreen();
      } else if ((previewRef.current as any).webkitRequestFullscreen) {
        (previewRef.current as any).webkitRequestFullscreen();
      } else if ((previewRef.current as any).msRequestFullscreen) {
        (previewRef.current as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className={`flex flex-col h-screen bg-gray-950 text-white overflow-hidden font-sans ${isFullscreen ? 'hidden' : ''}`}>
      
      {/* Top Toolbar */}
      <Toolbar 
        currentDevice={currentDevice}
        onDeviceChange={handleDeviceChange}
        isLandscape={isLandscape}
        toggleOrientation={() => setIsLandscape(!isLandscape)}
        onRefreshClick={handleRefresh}
        onSaveClick={handleSave}
        onFullscreenClick={handleFullscreen}
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
        <div ref={previewRef} className="h-1/2 lg:h-full lg:w-1/2 relative bg-[#121212]">
          <PreviewFrame 
            code={previewCode} 
            device={currentDevice}
            isLandscape={isLandscape}
            refreshTrigger={refreshTrigger}
          />
        </div>

      </div>

    </div>
  );
}

export default App;