import React, { useRef, useState, useEffect } from 'react';
import { Device } from '../types';

interface PreviewFrameProps {
  code: string;
  device: Device;
  isLandscape: boolean;
  refreshTrigger: number;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ code, device, isLandscape, refreshTrigger }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);

  // Determine actual dimensions based on orientation
  const width = isLandscape ? device.height : device.width;
  const height = isLandscape ? device.width : device.height;
  
  const isResponsiveMode = device.width === 0;

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || isResponsiveMode) {
        setScale(1);
        return;
      }

      const containerW = containerRef.current.clientWidth;
      const containerH = containerRef.current.clientHeight;
      const padding = 40; // Space around the device

      const availableW = containerW - padding;
      const availableH = containerH - padding;

      const scaleW = availableW / width;
      const scaleH = availableH / height;

      // Fit within container, max scale 1 (don't upscale pixelated)
      const newScale = Math.min(scaleW, scaleH, 1);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [width, height, isResponsiveMode]);

  // Handle iframe load state to prevent flashing
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [code, refreshTrigger]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-gray-800/50 flex items-center justify-center overflow-hidden relative"
      style={{ 
        backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', 
        backgroundSize: '20px 20px' 
      }}
    >
      <div
        style={{
          width: isResponsiveMode ? '100%' : `${width}px`,
          height: isResponsiveMode ? '100%' : `${height}px`,
          transform: isResponsiveMode ? 'none' : `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'width 0.3s ease, height 0.3s ease, transform 0.3s ease',
          boxShadow: isResponsiveMode ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
        className={`bg-white transition-all ${isResponsiveMode ? '' : 'rounded-lg border-[10px] border-gray-900'}`}
      >
         {/* 
           Using key={refreshTrigger} forces the iframe to remount when refresh is clicked,
           simulating a full page reload.
         */}
        <iframe
          key={refreshTrigger}
          title="preview"
          srcDoc={code}
          className="w-full h-full bg-white block"
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
          style={{ border: 'none', borderRadius: isResponsiveMode ? '0' : '4px' }}
        />
      </div>
      
      {/* Device Info Badge */}
      {!isResponsiveMode && (
        <div className="absolute bottom-4 right-4 bg-gray-900/80 text-gray-300 text-xs px-2 py-1 rounded backdrop-blur-sm">
          {width}px × {height}px ({Math.round(scale * 100)}%)
        </div>
      )}
    </div>
  );
};

export default PreviewFrame;