import { Device, DeviceType } from './types';

export const DEVICES: Device[] = [
  { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, type: DeviceType.MOBILE },
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', width: 393, height: 852, type: DeviceType.MOBILE },
  { id: 'pixel-7', name: 'Pixel 7', width: 412, height: 915, type: DeviceType.MOBILE },
  { id: 'ipad-mini', name: 'iPad Mini', width: 768, height: 1024, type: DeviceType.TABLET },
  { id: 'ipad-pro', name: 'iPad Pro 11', width: 834, height: 1194, type: DeviceType.TABLET },
  { id: 'desktop-sm', name: 'Laptop (Small)', width: 1280, height: 800, type: DeviceType.DESKTOP },
  { id: 'desktop-hd', name: 'Desktop (1080p)', width: 1920, height: 1080, type: DeviceType.DESKTOP },
  { id: 'full-width', name: 'Responsive (100%)', width: 0, height: 0, type: DeviceType.DESKTOP },
];

export const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: sans-serif; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }
  </style>
</head>
<body class="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex items-center justify-center text-white">

  <div class="bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full border border-white/30 transform transition hover:scale-105 duration-300">
    <div class="flex justify-center mb-6">
      <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl animate-float shadow-lg">
        🚀
      </div>
    </div>
    <h1 class="text-3xl font-bold text-center mb-2">Hello World!</h1>
    <p class="text-center text-white/90 mb-6">
      Edit this code on the left to see changes instantly. 
      Try resizing the viewport to test responsiveness!
    </p>
    <button onclick="alert('It works!')" class="w-full py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-opacity-90 transition shadow-lg">
      Click Me
    </button>
  </div>

</body>
</html>`;