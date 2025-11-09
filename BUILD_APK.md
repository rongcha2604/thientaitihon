# 📱 Hướng Dẫn Build APK Android

## 🚀 Bước 1: Cài đặt Dependencies

```bash
npm install
```

## 🔧 Bước 2: Khởi tạo Capacitor (Lần đầu tiên)

```bash
# Capacitor đã được config sẵn trong capacitor.config.ts
# Chỉ cần add Android platform:

npx cap add android
```

## 📦 Bước 3: Build Production

```bash
# Build React app thành static files
npm run build
```

## 🔄 Bước 4: Sync với Capacitor

```bash
# Sync files vào Android project
npx cap sync android
```

**Hoặc dùng script tự động:**
```bash
npm run android:sync
```

## 🏗️ Bước 5: Build APK

### **Option 1: Dùng Android Studio (Recommended - Dễ nhất)**

1. **Mở Android Studio:**
   ```bash
   npm run android:open
   ```
   Hoặc:
   ```bash
   npx cap open android
   ```

2. **Trong Android Studio:**
   - Chờ Gradle sync xong
   - Chọn **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Hoặc chọn **Build** → **Generate Signed Bundle / APK** (cho release)
   - APK sẽ được tạo trong `android/app/build/outputs/apk/debug/app-debug.apk`

3. **Install APK:**
   - Copy file APK vào điện thoại
   - Enable "Install from Unknown Sources" trong Settings
   - Tap vào APK file để install

### **Option 2: Dùng Command Line (Nhanh hơn)**

```bash
# Build debug APK
cd android
./gradlew assembleDebug

# APK sẽ được tạo tại:
# android/app/build/outputs/apk/debug/app-debug.apk
```

**Hoặc dùng script:**
```bash
npm run android:build
```

## ⚙️ Cấu hình Backend API

### **Development (Test với local server):**

1. **Tìm IP máy của bạn:**
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   # hoặc
   ip addr
   ```

2. **Update `capacitor.config.ts`:**
   ```typescript
   server: {
     url: 'http://192.168.1.XXX:3001', // Thay XXX bằng IP máy của bạn
     cleartext: true, // Cho phép HTTP (không HTTPS)
   },
   ```

3. **Build lại:**
   ```bash
   npm run android:sync
   ```

### **Production (Dùng built-in files):**

1. **Comment out `server.url` trong `capacitor.config.ts`:**
   ```typescript
   server: {
     // url: 'http://...', // Comment để dùng built-in files
     androidScheme: 'https',
   },
   ```

2. **Build lại:**
   ```bash
   npm run android:sync
   ```

## 📋 Checklist

- [ ] Đã cài `npm install`
- [ ] Đã chạy `npx cap add android`
- [ ] Đã build production: `npm run build`
- [ ] Đã sync: `npm run android:sync`
- [ ] Đã build APK (Android Studio hoặc command line)
- [ ] Đã test APK trên điện thoại

## 🐛 Troubleshooting

### **Lỗi: "Command not found: npx"**
```bash
# Cài Node.js và npm
# Download từ: https://nodejs.org/
```

### **Lỗi: "Gradle sync failed"**
```bash
# Xóa cache và rebuild
cd android
./gradlew clean
./gradlew build
```

### **Lỗi: "Cannot find module '@capacitor/core'"**
```bash
# Cài lại dependencies
npm install
```

### **APK không kết nối được backend:**
- Kiểm tra IP server trong `capacitor.config.ts`
- Đảm bảo điện thoại và máy cùng WiFi network
- Kiểm tra firewall không block port 3001
- Thử dùng `cleartext: true` trong config

### **APK quá lớn:**
- Build release APK (đã được minify)
- Enable ProGuard trong Android
- Xóa unused dependencies

## 📝 Scripts Available

- `npm run android:sync` - Build và sync với Android
- `npm run android:open` - Mở Android Studio
- `npm run android:build` - Build APK bằng command line
- `npm run cap:sync` - Sync tất cả platforms
- `npm run cap:open` - Mở Capacitor platform

## 🎯 Next Steps

1. **Test APK trên điện thoại thật**
2. **Cấu hình signing cho release APK** (nếu muốn publish)
3. **Optimize APK size** (nếu cần)
4. **Setup CI/CD** để build APK tự động (optional)

## 📚 Tài liệu tham khảo

- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Android Studio Setup](https://developer.android.com/studio)
- [Gradle Build](https://developer.android.com/studio/build)

