import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import injectSwVersion from './scripts/vite-plugin-inject-sw-version.js';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      root: '.',
      server: {
        port: 5173,
        host: '0.0.0.0', // Allow external connections (LAN/internet)
      },
      plugins: [
        react(),
        injectSwVersion(), // Inject version vào service worker khi build
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Cache busting: Tạo hash cho tất cả files
        rollupOptions: {
          output: {
            // Hash-based filenames cho cache busting
            entryFileNames: 'assets/[name].[hash].js',
            chunkFileNames: 'assets/[name].[hash].js',
            assetFileNames: (assetInfo) => {
              // Hash cho CSS và assets khác
              if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                return 'assets/[name].[hash][extname]';
              }
              // Images và fonts giữ nguyên tên (hoặc có thể hash nếu muốn)
              return 'assets/[name].[hash][extname]';
            },
            // Manual chunk splitting để optimize bundle size
            manualChunks: (id) => {
              // Tách vendor libraries thành chunk riêng
              if (id.includes('node_modules')) {
                // React và React DOM riêng (critical)
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'vendor-react';
                }
                // Capacitor riêng (chỉ dùng trên mobile)
                if (id.includes('@capacitor')) {
                  return 'vendor-capacitor';
                }
                // Các libraries khác
                return 'vendor';
              }
              
              // Tách pages thành chunks riêng (đã có lazy loading nhưng có thể optimize thêm)
              if (id.includes('components/pages')) {
                const pageName = id.split('components/pages/')[1]?.split('.')[0];
                if (pageName) {
                  return `page-${pageName}`;
                }
              }
              
              // Tách contexts thành chunk riêng
              if (id.includes('contexts/')) {
                return 'contexts';
              }
            }
          }
        },
        // Đảm bảo chunk size warning không block build
        chunkSizeWarningLimit: 1000,
        // Minify và optimize (dùng esbuild - nhanh hơn và không cần dependency)
        minify: 'esbuild', // Nhanh hơn terser và không cần cài thêm
        // Source maps cho production (có thể tắt để giảm size)
        sourcemap: false,
        // Target modern browsers để giảm bundle size
        target: 'esnext',
        // CSS code splitting
        cssCodeSplit: true,
      }
    };
});
