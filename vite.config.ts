import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      // 增强React编译，用Babel兜底转译（解决TSX/JSX语法问题）
      react({
        babel: {
          presets: [
            ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
        },
      }),
      // 自动替换所有中文符号（彻底解决语法错误）
      {
        name: 'replace-chinese-symbols',
        transformIndexHtml(html) {
          // 替换中文引号、逗号、分号等为英文
          return html.replace(/“|”|‘|’|，|；|：|。/g, (match) => {
            switch (match) {
              case '“': case '”': return '"';
              case '‘': case '’': return "'";
              case '，': return ',';
              case '；': return ';';
              case '：': return ':';
              case '。': return '.';
              default: return '';
            }
          });
        },
        transform(code) {
          // 替换所有代码文件中的中文符号
          return code.replace(/“|”|‘|’|，|；|：|。/g, (match) => {
            switch (match) {
              case '“': case '”': return '"';
              case '‘': case '’': return "'";
              case '，': return ',';
              case '；': return ';';
              case '：': return ':';
              case '。': return '.';
              default: return '';
            }
          });
        },
      },
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    },
    // 本地预构建所有依赖（避免CDN冲突）
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'lucide-react',
        '@google/genai',
      ],
    },
    build: {
      target: 'es2020', // 适配ESM模块，兼容所有现代浏览器
      esbuild: {
        loader: {
          '.ts': 'ts',
          '.tsx': 'tsx',
          '.js': 'js',
          '.jsx': 'jsx',
        },
        target: 'es2020',
        minifySyntax: true, // 压缩语法，移除无效符号
      },
      rollupOptions: {
        output: {
          format: 'esm',
          manualChunks: undefined, // 合并代码块，减少加载错误
        },
      },
      sourcemap: true, // 方便调试（可选，部署后可关闭）
    },
  };
});
