# 📱 Hướng Dẫn Đồng Bộ Data Questions và Audio Lên Smartphone

## ✅ Đã Hoàn Thành

### 1. Backend API Endpoints
- ✅ `GET /api/sync/metadata` - Lấy metadata về questions và audio
- ✅ `GET /api/sync/questions` - Lấy questions theo bookSeries/grade/subject/week
- ✅ `GET /api/sync/questions/list` - List tất cả questions files
- ✅ `GET /api/sync/audio/:filename` - Serve audio MP3 files
- ✅ `GET /api/sync/audio` - List tất cả audio files

### 2. Mobile Sync Service
- ✅ `src/lib/api/sync.ts` - API client cho sync endpoints
- ✅ `src/lib/storage/syncStorage.ts` - Local storage cho cached data
- ✅ `src/lib/services/syncService.ts` - Sync service class với progress callback
- ✅ `src/hooks/useSyncData.ts` - React hook để sync data tự động

### 3. Tích Hợp Vào App
- ✅ Auto-sync khi app khởi động (chỉ trên mobile/Capacitor)
- ✅ Local storage caching để offline support
- ✅ Progress callback để hiển thị tiến trình sync

## 🚀 Cách Sử Dụng

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3001`

### 2. Config Backend URL cho Mobile

**Development (test trên device):**
1. Tìm IP máy của bạn:
   ```bash
   # Windows
   ipconfig
   # Tìm IPv4 Address (ví dụ: 192.168.1.100)
   ```

2. Update `capacitor.config.ts`:
   ```typescript
   server: {
     url: 'http://192.168.1.100:3001', // Thay bằng IP máy của bạn
     cleartext: true, // Cho phép HTTP
   },
   ```

**Production (dùng built-in files):**
```typescript
server: {
  // url: 'http://...', // Comment để dùng built-in files
  androidScheme: 'https',
},
```

### 3. Build APK

**Option 1: Dùng Script (Recommended)**
```powershell
.\build-apk.ps1
```

**Option 2: Build Thủ Công**
```bash
# Step 1: Copy data files
.\copy-data-to-public.ps1

# Step 2: Build production
npm run build

# Step 3: Sync với Capacitor
npm run android:sync

# Step 4: Build APK
cd android
.\gradlew assembleDebug

# APK sẽ ở: android/app/build/outputs/apk/debug/app-debug.apk
```

### 4. Install APK trên Smartphone

1. Copy file APK vào smartphone
2. Enable "Install from Unknown Sources" trong Settings
3. Tap vào APK file để install

## 📋 Cách Sync Data Hoạt Động

### Khi App Khởi Động (Mobile):
1. App tự động check nếu cần sync
2. Nếu cần sync → Download questions và audio từ backend
3. Cache data vào local storage
4. App sử dụng cached data (offline support)

### Manual Sync:
```typescript
import { syncService } from './lib/services/syncService';

// Check if sync needed
const needsSync = await syncService.checkSyncNeeded();

// Sync all data
await syncService.syncAll();

// Get questions (from cache or server)
const questions = await syncService.getQuestions(
  'ket-noi-tri-thuc',
  1,
  'vietnamese',
  1
);
```

## 🔧 Troubleshooting

### APK không kết nối được backend:
- ✅ Kiểm tra IP server trong `capacitor.config.ts`
- ✅ Đảm bảo smartphone và máy cùng WiFi network
- ✅ Kiểm tra firewall không block port 3001
- ✅ Thử dùng `cleartext: true` trong config

### Sync không hoạt động:
- ✅ Kiểm tra backend server đang chạy
- ✅ Kiểm tra API_BASE_URL trong `src/lib/api/config.ts`
- ✅ Kiểm tra console logs để xem lỗi

### APK build failed:
- ✅ Kiểm tra Java version (cần Java 17+)
- ✅ Chạy `.\gradlew clean` trước khi build lại
- ✅ Kiểm tra Android SDK đã cài đặt

## 📝 Notes

- **Offline Support:** App sẽ dùng cached data nếu không có internet
- **Incremental Sync:** Chỉ download updates, không download lại toàn bộ
- **Audio Files:** Audio files được lazy load (download on demand)
- **Cache Size:** Cache được lưu trong localStorage (có giới hạn ~5-10MB)

## 🎯 Next Steps

1. **Test sync trên smartphone:**
   - Install APK
   - Mở app → Check sync hoạt động
   - Test offline mode

2. **Optimize sync:**
   - Compress questions data nếu cần
   - Lazy load audio files
   - Background sync

3. **Production:**
   - Deploy backend lên server
   - Update API_BASE_URL trong config
   - Build release APK

