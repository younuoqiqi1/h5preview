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
  
  // 用于可拖动分割线的状态和refs
  const [editorWidth, setEditorWidth] = useState<number>(50); // 编辑器宽度百分比
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // 可拖动分割线相关事件处理
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const x = e.clientX - containerRect.left;
    
    // 计算编辑器宽度百分比，限制在10%到90%之间
    const newWidth = Math.max(10, Math.min(90, (x / containerWidth) * 100));
    setEditorWidth(newWidth);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // 添加和移除鼠标事件监听器
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden font-sans">
      {/* Top Toolbar */}
      {!isFullscreen && (
        <Toolbar 
          currentDevice={currentDevice}
          onDeviceChange={handleDeviceChange}
          isLandscape={isLandscape}
          toggleOrientation={() => setIsLandscape(!isLandscape)}
          onRefreshClick={handleRefresh}
          onSaveClick={handleSave}
          onFullscreenClick={handleFullscreen}
        />
      )}

      {/* Main Workspace */}
      <div ref={containerRef} className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 非全屏模式下显示编辑器和分割线 */}
        {!isFullscreen && (
          <>
            {/* Left: Editor Pane */}
            <div 
              className="h-1/2 lg:h-full border-b lg:border-b-0 border-gray-800 flex flex-col"
              style={{ width: isDragging ? 'auto' : `${editorWidth}%`, minWidth: '10%', maxWidth: '90%' }}
            >
              <Editor 
                code={code} 
                onChange={setCode} 
                onClear={handleClear}
              />
            </div>

            {/* Draggable Resizer */}
            <div
              ref={dragRef}
              className="h-1 lg:h-full w-full lg:w-1 bg-gray-700 cursor-col-resize flex-shrink-0"
              onMouseDown={handleDragStart}
              style={{
                backgroundColor: isDragging ? '#3b82f6' : '#374151',
                transition: isDragging ? 'none' : 'background-color 0.2s ease',
                cursor: 'col-resize',
                position: 'relative'
              }}
            >
              {/* 拖动提示线 */}
              {isDragging && (
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-50"
                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                />
              )}
            </div>
          </>
        )}

        {/* Right: Preview Pane */}
        <div 
          ref={previewRef} 
          className={`bg-[#121212] flex flex-col ${isFullscreen ? '' : 'h-1/2 lg:h-full flex-1'}`}
          style={{
            ...(!isFullscreen ? { minWidth: '10%', maxWidth: '90%' } : {}),
            backgroundColor: '#121212'
          }}
        >
          {/* 全屏模式下的退出按钮 */}
          {isFullscreen && (
            <button
              onClick={handleFullscreen}
              className="absolute top-4 right-4 p-2 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full shadow-lg z-50"
              title="Exit Fullscreen"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
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