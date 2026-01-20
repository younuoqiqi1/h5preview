import React from 'react';
import { DEVICES } from '../constants';
import { Device, DeviceType } from '../types';
import { Smartphone, Monitor, Tablet, RotateCw, Wand2, RefreshCw, Download } from 'lucide-react';

interface ToolbarProps {
  currentDevice: Device;
  onDeviceChange: (device: Device) => void;
  isLandscape: boolean;
  toggleOrientation: () => void;
  onRefreshClick: () => void;
  onSaveClick: () => void;
  onFullscreenClick: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  currentDevice, 
  onDeviceChange, 
  isLandscape, 
  toggleOrientation,
  onRefreshClick,
  onSaveClick,
  onFullscreenClick
}) => {

  const getIcon = (type: DeviceType) => {
    switch (type) {
      case DeviceType.MOBILE: return <Smartphone size={16} />;
      case DeviceType.TABLET: return <Tablet size={16} />;
      case DeviceType.DESKTOP: return <Monitor size={16} />;
    }
  };

  return (
    <div className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 select-none">
      {/* Left Section: Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
           <span className="text-blue-500">{`</>`}</span> LiveCode
        </div>
      </div>

      {/* Right Section: All Controls */}
      <div className="flex items-center gap-3">
        
        {/* Device Selector */}
        <div className="flex items-center bg-gray-800 rounded-lg p-1 overflow-hidden">
           <div className="px-2 text-gray-400">
             {getIcon(currentDevice.type)}
           </div>
          <select 
            value={currentDevice.id}
            onChange={(e) => {
              const device = DEVICES.find(d => d.id === e.target.value);
              if (device) onDeviceChange(device);
            }}
            className="bg-transparent text-sm text-gray-200 focus:outline-none px-2 py-1 cursor-pointer"
          >
            {DEVICES.map(d => (
              <option key={d.id} value={d.id} className="bg-gray-800">
                {d.name} {d.width > 0 ? `(${d.width}x${d.height})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Orientation Toggle */}
        <button 
          onClick={toggleOrientation}
          disabled={currentDevice.width === 0}
          className={`p-2 rounded-md transition-colors ${
            currentDevice.width === 0 
            ? 'opacity-30 cursor-not-allowed text-gray-500' 
            : isLandscape ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
          title="Toggle Orientation"
        >
          <RotateCw size={18} />
        </button>

        <div className="h-6 w-px bg-gray-700 mx-1"></div>

        {/* Action Buttons */}
        <button 
          onClick={onSaveClick}
          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-md transition-colors"
          title="Save HTML"
        >
          <Download size={18} />
        </button>

        <button 
           onClick={onRefreshClick}
           className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded-md transition-colors"
           title="Refresh Preview"
        >
          <RefreshCw size={18} />
        </button>

        <button 
          onClick={onFullscreenClick}
          className="ml-2 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white text-xs font-semibold rounded-md shadow-lg transition-all transform hover:scale-105"
          title="Fullscreen Preview"
        >
          <Monitor size={14} />
          <span>Fullscreen</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;