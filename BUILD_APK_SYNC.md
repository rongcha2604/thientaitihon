# 📱 Hướng Dẫn Build APK với Sync Data

## ✅ Đã Setup

1. ✅ Backend API endpoints để serve questions và audio
2. ✅ Mobile sync service để fetch data từ backend
3. ✅ Auto-sync khi app khởi động (mobile only)
4. ✅ Local storage caching cho offline support

## 🚀 Build APK

### Bước 1: Start Backend Server
```bash
cd backend
npm run dev
```

Backend chạy tại: `http://localhost:3001`

### Bước 2: Config Backend URL (Nếu cần)

**Development (test trên device):**
- Tìm IP máy: `ipconfig` (Windows)
- Update `capacitor.config.ts`:
  ```typescript
  server: {
    url: 'http://192.168.1.XXX:3001', // Thay XXX bằng IP máy
    cleartext: true,
  },
  ```

**Production (dùng built-in files):**
- Comment `server.url` trong `capacitor.config.ts`

### Bước 3: Build APK

**Cách 1: Dùng Script (Dễ nhất)**
```powershell
.\build-apk.ps1
```

**Cách 2: Build Thủ Công**
```bash
# 1. Copy data files
.\copy-data-to-public.ps1

# 2. Build production
npm run build

# 3. Sync với Capacitor
npm run android:sync

# 4. Build APK
cd android
.\gradlew assembleDebug
```

**APK Location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Bước 4: Install APK

1. Copy APK file vào smartphone
2. Enable "Install from Unknown Sources" trong Settings
3. Tap APK file để install

## 📋 Sync Data Hoạt Động Như Thế Nào?

### Khi App Khởi Động:
1. App tự động check nếu cần sync
2. Nếu cần → Download questions và audio từ backend
3. Cache vào local storage
4. App dùng cached data (offline support)

### Manual Sync:
- App sẽ tự động sync khi cần
- Hoặc có thể thêm button "Sync" trong settings

## 🔧 Troubleshooting

### Lỗi: "error: invalid source release: 21"
- ✅ Đã fix: Update Java version trong build.gradle files
- ✅ Nếu vẫn lỗi: Chạy `.\gradlew clean` rồi build lại

### APK không kết nối được backend:
- ✅ Kiểm tra IP server trong `capacitor.config.ts`
- ✅ Đảm bảo smartphone và máy cùng WiFi
- ✅ Kiểm tra firewall

### Sync không hoạt động:
- ✅ Kiểm tra backend server đang chạy
- ✅ Kiểm tra API_BASE_URL trong config
- ✅ Xem console logs

## 📝 Notes

- **Offline Support:** App dùng cached data nếu không có internet
- **Incremental Sync:** Chỉ download updates
- **Audio Files:** Lazy load (download on demand)

