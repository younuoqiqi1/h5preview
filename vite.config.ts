import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    // 开发服务器配置（本地开发用，不影响Cloudflare部署）
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    // 核心插件：启用React编译，处理TSX/JSX语法（解决语法错误关键）
    plugins: [react()],
    // 环境变量配置（保持你原有的API_KEY配置，修复重复定义问题）
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    // 路径别名配置（保持原有逻辑）
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      // 明确解析后缀，避免Cloudflare构建时找不到文件
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    },
    // Cloudflare部署关键配置：强制转译兼容语法
    build: {
      // 转译为所有现代浏览器兼容的ES版本（解决语法错误）
      target: 'es2015',
      // 用esbuild强制处理TSX/TS文件，确保编译完整
      esbuild: {
        loader: 'tsx', // 优先处理TSX文件
        target: 'es2015', // 统一转译目标版本
      },
      // 优化构建产物，避免冗余代码
      rollupOptions: {
        output: {
          manualChunks: undefined, // 合并代码块，减少文件数量
        },
      },
    },
    // 其他优化配置
    optimizeDeps: {
      // 预构建依赖，加快构建速度
      include: ['react', 'react-dom', 'axios'], // 按需添加你的项目依赖
    },
  };
});
