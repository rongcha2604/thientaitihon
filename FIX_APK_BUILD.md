# 🔧 Fix Lỗi Build APK - Hướng Dẫn

## ✅ Đã Fix Xong

1. ✅ **Data files đã copy vào public folder**
2. ✅ **Path đã update trong ExercisePage.tsx** (từ `/src/data/questions/` → `/data/questions/`)
3. ✅ **Java compatibility config đã thêm** (Java 17 trong build.gradle)

## 🚨 Vấn đề hiện tại

Build bằng command line gặp lỗi Java version. **Giải pháp tốt nhất: Dùng Android Studio**

## 📱 Cách Build APK bằng Android Studio (Khuyến Nghị)

### **Bước 1: Mở Android Studio**

```powershell
# Đã build và sync xong, chỉ cần mở Android Studio
npx cap open android
```

### **Bước 2: Trong Android Studio**

1. **Chờ Gradle sync xong** (tự động hoặc click "Sync Now")

2. **Build APK:**
   - Click menu **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Hoặc click **Build** → **Generate Signed Bundle / APK** (cho release)

3. **Chờ build xong:**
   - Sẽ có thông báo "APK(s) generated successfully"
   - Click "locate" để mở folder chứa APK

4. **APK location:**
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### **Bước 3: Install APK trên điện thoại**

1. Copy file `app-debug.apk` vào điện thoại
2. Enable "Install from Unknown Sources" trong Settings
3. Tap vào APK file để install

---

## 🔧 Nếu vẫn muốn build bằng Command Line

### **Option 1: Cài Java 21 (Recommended)**

1. Download Java 21:
   - https://adoptium.net/temurin/releases/?version=21
   - Hoặc: https://www.oracle.com/java/technologies/downloads/#java21

2. Cài đặt và set JAVA_HOME:
   ```powershell
   # Set JAVA_HOME (tạm thời cho session này)
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
   
   # Verify
   java -version
   ```

3. Build lại:
   ```powershell
   cd android
   .\gradlew assembleDebug
   ```

### **Option 2: Dùng Android Studio JDK**

Android Studio có Java riêng. Bạn có thể set JAVA_HOME trỏ đến Android Studio JDK:

```powershell
# Tìm Android Studio JDK path (thường là)
$env:JAVA_HOME = "$env:LOCALAPPDATA\Android\Sdk\jbr"
# hoặc
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"

# Build
cd android
.\gradlew assembleDebug
```

---

## ✅ Checklist

- [x] Data files đã copy vào `public/data/questions/`
- [x] Path đã update trong `ExercisePage.tsx`
- [x] Build production đã chạy thành công
- [x] Capacitor sync đã chạy thành công
- [ ] Build APK bằng Android Studio (khuyến nghị)
- [ ] Test APK trên điện thoại
- [ ] Kiểm tra dữ liệu đã load chưa

---

## 🎯 Quick Steps

```powershell
# 1. Mở Android Studio
npx cap open android

# 2. Trong Android Studio:
#    - Build → Build Bundle(s) / APK(s) → Build APK(s)
#    - APK sẽ ở: android/app/build/outputs/apk/debug/app-debug.apk

# 3. Install trên điện thoại và test
```

---

## 📝 Lưu ý

- **Android Studio:** Tự động handle Java version, dễ nhất ✅
- **Command Line:** Cần Java 21, phức tạp hơn
- **Data files:** Đã được copy và sync vào APK ✅
- **Path:** Đã fix để load từ `/data/questions/` ✅

Dùng Android Studio là cách nhanh nhất và đơn giản nhất!



