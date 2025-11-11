// Vite plugin để inject version vào service-worker.js trong dist folder
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo version từ timestamp
function getVersion() {
  // Dùng timestamp (luôn unique mỗi lần build)
  return `v${Date.now()}`;
}

export default function injectSwVersion() {
  return {
    name: 'inject-sw-version',
    writeBundle() {
      // Hook này chạy sau khi Vite đã copy files vào dist
      const distPath = path.join(__dirname, '..', 'dist');
      const swPath = path.join(distPath, 'service-worker.js');
      
      // Kiểm tra xem file có tồn tại không
      if (!fs.existsSync(swPath)) {
        console.warn('[Vite Plugin] service-worker.js not found in dist, skipping version injection');
        return;
      }
      
      const version = getVersion();
      
      console.log(`[Vite Plugin] Injecting version ${version} into service-worker.js`);
      
      let swContent = fs.readFileSync(swPath, 'utf-8');
      
      // Replace placeholder với version thực tế
      swContent = swContent.replace(/{{APP_VERSION}}/g, version);
      
      fs.writeFileSync(swPath, swContent, 'utf-8');
      
      console.log(`[Vite Plugin] ✅ Service worker version updated to: ${version}`);
    }
  };
}

