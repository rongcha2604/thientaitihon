# 📱 Hướng Dẫn Chạy Script Build APK

## 🚀 Cách 1: Chạy Script Tự Động (Dễ Nhất)

### **Bước 1: Mở PowerShell**

**Option A: Mở PowerShell từ thư mục project**
1. Mở File Explorer
2. Điều hướng đến thư mục: `D:\HocTapLTHT\ThienTaiDatViet`
3. Click chuột phải vào thư mục → **Open in Terminal** hoặc **Open PowerShell window here**

**Option B: Mở PowerShell thông thường**
1. Nhấn `Win + R`
2. Gõ `powershell` → Enter
3. Di chuyển đến thư mục project:
   ```powershell
   cd D:\HocTapLTHT\ThienTaiDatViet
   ```

### **Bước 2: Cho phép chạy script (Lần đầu tiên)**

Nếu gặp lỗi `cannot be loaded because running scripts is disabled`, chạy lệnh này:

```powershell
# Cho phép chạy script cho session hiện tại
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

**Hoặc cho phép vĩnh viễn (cần quyền Admin):**
```powershell
# Mở PowerShell as Administrator, rồi chạy:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Bước 3: Chạy script**

```powershell
.\build-apk.ps1
```

### **Bước 4: Làm theo hướng dẫn**

Script sẽ tự động:
1. ✅ **Cài dependencies** (`npm install`)
2. ✅ **Add Android platform** (`npx cap add android`) - nếu chưa có
3. ✅ **Build production** (`npm run build`)
4. ✅ **Sync với Capacitor** (`npx cap sync android`)
5. ✅ **Hỏi bạn muốn build bằng cách nào:**
   - **Option 1:** Mở Android Studio (recommended)
   - **Option 2:** Build bằng command line (Gradle)

**Nếu chọn Option 1 (Android Studio):**
- Script sẽ mở Android Studio
- Trong Android Studio:
  1. Chờ Gradle sync xong
  2. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
  3. APK sẽ ở: `android/app/build/outputs/apk/debug/app-debug.apk`

**Nếu chọn Option 2 (Command line):**
- Script sẽ tự động build APK bằng Gradle
- APK sẽ ở: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📋 Các Bước Script Tự Động Làm

### **Bước 1: Cài Dependencies**
```powershell
npm install
```
- Cài tất cả packages từ `package.json`
- Bao gồm Capacitor và Android dependencies

### **Bước 2: Add Android Platform**
```powershell
npx cap add android
```
- Chỉ chạy nếu chưa có thư mục `android/`
- Tạo Android project với Gradle
- Cấu hình AndroidManifest.xml, build.gradle, etc.

### **Bước 3: Build Production**
```powershell
npm run build
```
- Build React app thành static files
- Output: `dist/` folder (HTML, CSS, JS đã optimize)

### **Bước 4: Sync với Capacitor**
```powershell
npx cap sync android
```
- Copy files từ `dist/` vào `android/app/src/main/assets/public/`
- Update native code nếu cần
- Sync plugins và dependencies

### **Bước 5: Build APK**
**Option 1: Android Studio (Recommended)**
- Mở Android Studio
- Build APK bằng GUI (dễ nhất)

**Option 2: Command Line**
```powershell
cd android
./gradlew assembleDebug
```
- Build APK bằng Gradle command line
- Nhanh hơn, không cần Android Studio

---

## 🐛 Troubleshooting

### **Lỗi: "cannot be loaded because running scripts is disabled"**

**Giải pháp:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

**Hoặc chạy script trực tiếp:**
```powershell
powershell -ExecutionPolicy Bypass -File .\build-apk.ps1
```

### **Lỗi: "npm: command not found"**

**Giải pháp:**
- Cài Node.js: https://nodejs.org/
- Restart PowerShell sau khi cài

### **Lỗi: "npx: command not found"**

**Giải pháp:**
```powershell
npm install -g npm@latest
```

### **Lỗi: "Capacitor: command not found"**

**Giải pháp:**
```powershell
npm install
```

### **Lỗi: "Gradle sync failed" (khi mở Android Studio)**

**Giải pháp:**
```powershell
cd android
./gradlew clean
./gradlew build
```

### **Lỗi: "Android Studio not found"**

**Giải pháp:**
- Cài Android Studio: https://developer.android.com/studio
- Hoặc chọn Option 2 (command line) không cần Android Studio

---

## ✅ Checklist

- [ ] Đã mở PowerShell
- [ ] Đã di chuyển đến thư mục project
- [ ] Đã cho phép chạy script (nếu cần)
- [ ] Đã chạy `.\build-apk.ps1`
- [ ] Đã chọn cách build (Android Studio hoặc command line)
- [ ] APK đã được tạo thành công

---

## 📱 Sau khi có APK

1. **Copy APK vào điện thoại:**
   - Dùng USB cable
   - Hoặc upload lên Google Drive/Dropbox
   - Hoặc email cho chính mình

2. **Enable Unknown Sources:**
   - Settings → Security → Unknown Sources (Enable)
   - Hoặc Settings → Apps → Special access → Install unknown apps

3. **Install APK:**
   - Tap vào file APK
   - Click "Install"
   - Click "Open" để mở app

---

## 🎯 Quick Reference

```powershell
# Chạy script
.\build-apk.ps1

# Nếu gặp lỗi execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# Build thủ công (nếu script không chạy)
npm install
npx cap add android
npm run build
npx cap sync android
npx cap open android  # Hoặc: cd android && ./gradlew assembleDebug
```

---

## 📚 Tài liệu tham khảo

- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Android Studio Setup](https://developer.android.com/studio)
- [PowerShell Execution Policy](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)

