# 📸 Hướng Dẫn Thêm Ảnh Vào App và Build APK

## 🎯 Mục Tiêu

1. ✅ Thêm ảnh vào app (update imageUrl trong JSON files)
2. ✅ Copy ảnh vào thư mục đúng
3. ✅ Build APK có luôn ảnh và chức năng thưởng items

---

## 📋 BƯỚC 1: Chuẩn Bị Ảnh

### 1.1. Tạo Thư Mục Lưu Ảnh

```powershell
# Tạo thư mục cho ảnh math questions
New-Item -ItemType Directory -Path "public/data/questions/images/math" -Force
```

### 1.2. Copy Ảnh Vào Thư Mục

Copy 10 ảnh đã tạo vào thư mục:
```
public/data/questions/images/math/
├── math-question-ket-noi-tri-thuc-grade1-week1-q1.png
├── math-question-ket-noi-tri-thuc-grade1-week1-q2.png
├── math-question-ket-noi-tri-thuc-grade1-week13-q1.png
├── math-question-ket-noi-tri-thuc-grade1-week13-q2.png
├── math-question-ket-noi-tri-thuc-grade1-week13-q3.png
├── ... (10 ảnh đầu tiên)
```

**Lưu ý:** Đảm bảo tên file đúng với tên trong `math-question-image-prompts.md`

---

## 📋 BƯỚC 2: Update ImageUrl Trong JSON Files

### 2.1. Chạy Script Tự Động

```powershell
python scripts/update_math_question_images.py
```

Script sẽ:
- ✅ Đọc `math-question-image-prompts.md` để lấy mapping questionId → filename
- ✅ Kiểm tra ảnh đã có trong `public/data/questions/images/math/`
- ✅ Tự động update `imageUrl` trong JSON files
- ✅ Báo cáo số lượng đã update và ảnh còn thiếu

### 2.2. Kiểm Tra Kết Quả

Script sẽ hiển thị:
```
✅ Updated: ket-noi-tri-thuc/grade-1/math/week-1.json - q1
✅ Updated: ket-noi-tri-thuc/grade-1/math/week-1.json - q2
...
✅ Hoàn thành!
   - Đã update: 10 câu hỏi
   - Ảnh chưa có: 0 ảnh
```

### 2.3. Verify Thủ Công (Optional)

Mở file JSON để kiểm tra:
```json
{
  "id": "q1",
  "question": "Có 3 quả táo, thêm 2 quả táo nữa...",
  "imageUrl": "/data/questions/images/math/math-question-ket-noi-tri-thuc-grade1-week1-q1.png"
}
```

---

## 📋 BƯỚC 3: Copy Data Vào Public Folder

### 3.1. Chạy Script Copy Data

```powershell
.\copy-data-to-public.ps1
```

Script sẽ:
- ✅ Copy tất cả JSON files từ `src/data/questions/` → `public/data/questions/`
- ✅ Đảm bảo ảnh và data được sync

### 3.2. Verify

Kiểm tra file đã được copy:
```powershell
# Kiểm tra JSON files
Get-ChildItem -Path "public/data/questions" -Recurse -Filter "*.json" | Select-Object -First 5

# Kiểm tra ảnh
Get-ChildItem -Path "public/data/questions/images/math" -Filter "*.png"
```

---

## 📋 BƯỚC 4: Test Trong Browser (Optional)

### 4.1. Start Frontend

```powershell
npm run dev
```

### 4.2. Test Hiển Thị Ảnh

1. Mở browser: `http://localhost:5173` (hoặc port khác)
2. Vào trang **Luyện Tập** → Chọn **Toán** → Chọn **Tuần 1**
3. Kiểm tra câu hỏi có hiển thị ảnh không

**Lưu ý:** Nếu ảnh không hiển thị, kiểm tra:
- ✅ File ảnh có trong `public/data/questions/images/math/` không?
- ✅ `imageUrl` trong JSON có đúng path không?
- ✅ Console có lỗi 404 không?

---

## 📋 BƯỚC 5: Build APK

### 5.1. Build APK Tự Động (Recommended)

```powershell
.\build-apk.ps1
```

Script sẽ tự động:
1. ✅ Install dependencies
2. ✅ Copy data files vào public folder
3. ✅ Build production (`npm run build`)
4. ✅ Sync với Capacitor (`npx cap sync android`)
5. ✅ Build APK

**APK Location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 5.2. Build APK Thủ Công

Nếu muốn build từng bước:

```powershell
# Step 1: Copy data
.\copy-data-to-public.ps1

# Step 2: Build production
npm run build

# Step 3: Sync với Capacitor
npx cap sync android

# Step 4: Build APK (Option A - Android Studio)
npx cap open android
# Trong Android Studio: Build → Build APK(s)

# Step 4: Build APK (Option B - Command Line)
cd android
.\gradlew assembleDebug
```

---

## 📋 BƯỚC 6: Install APK Trên Smartphone

### 6.1. Copy APK Vào Smartphone

1. Copy file `android/app/build/outputs/apk/debug/app-debug.apk` vào smartphone
2. Có thể dùng:
   - USB cable
   - Email
   - Cloud storage (Google Drive, Dropbox)
   - ADB: `adb install app-debug.apk`

### 6.2. Install APK

1. **Enable "Install from Unknown Sources":**
   - Settings → Security → Enable "Install from Unknown Sources"
   - Hoặc Settings → Apps → Special Access → Install Unknown Apps

2. **Tap vào APK file để install**

3. **Mở app và test:**
   - ✅ Vào **Luyện Tập** → **Toán** → **Tuần 1**
   - ✅ Kiểm tra ảnh có hiển thị không
   - ✅ Test chức năng thưởng items (đã làm trước đó)

---

## 🔍 Kiểm Tra APK Có Ảnh Không

### Cách 1: Extract APK (Optional)

```powershell
# Rename APK thành ZIP
Copy-Item "android/app/build/outputs/apk/debug/app-debug.apk" "app-debug.zip"

# Extract ZIP
Expand-Archive -Path "app-debug.zip" -DestinationPath "apk-extracted"

# Kiểm tra ảnh có trong APK không
Get-ChildItem -Path "apk-extracted/assets/public/data/questions/images/math" -Filter "*.png"
```

### Cách 2: Test Trực Tiếp Trên Smartphone

- Install APK
- Mở app
- Vào câu hỏi có ảnh
- Kiểm tra ảnh có hiển thị không

---

## ✅ Checklist

- [ ] **Bước 1:** Đã copy 10 ảnh vào `public/data/questions/images/math/`
- [ ] **Bước 2:** Đã chạy script update imageUrl
- [ ] **Bước 3:** Đã copy data vào public folder
- [ ] **Bước 4:** (Optional) Đã test trong browser
- [ ] **Bước 5:** Đã build APK thành công
- [ ] **Bước 6:** Đã install APK trên smartphone
- [ ] **Bước 7:** Đã test ảnh hiển thị trong app
- [ ] **Bước 8:** Đã test chức năng thưởng items

---

## 🐛 Troubleshooting

### Lỗi: "Ảnh không hiển thị trong app"

**Nguyên nhân:**
- ❌ Ảnh chưa được copy vào `public/data/questions/images/math/`
- ❌ `imageUrl` trong JSON sai path
- ❌ Ảnh chưa được sync vào APK

**Giải pháp:**
1. ✅ Kiểm tra ảnh có trong `public/data/questions/images/math/` không
2. ✅ Kiểm tra `imageUrl` trong JSON có đúng format: `/data/questions/images/math/filename.png`
3. ✅ Chạy lại `.\copy-data-to-public.ps1`
4. ✅ Chạy lại `npx cap sync android`
5. ✅ Build lại APK

### Lỗi: "Script update_math_question_images.py không tìm thấy ảnh"

**Nguyên nhân:**
- ❌ Tên file ảnh không khớp với tên trong prompts file
- ❌ Ảnh chưa được copy vào thư mục đúng

**Giải pháp:**
1. ✅ Kiểm tra tên file ảnh có đúng format không:
   - Format: `math-question-ket-noi-tri-thuc-grade1-week1-q1.png`
   - Không có khoảng trắng, ký tự đặc biệt
2. ✅ Copy ảnh vào đúng thư mục: `public/data/questions/images/math/`
3. ✅ Chạy lại script

### Lỗi: "APK build failed"

**Xem hướng dẫn:** `BUILD_APK.md` hoặc `FIX_APK_BUILD.md`

---

## 📝 Notes

- **Ảnh được lưu trong APK:** Khi build APK, tất cả files trong `public/` sẽ được copy vào `android/app/src/main/assets/public/`
- **Path trong APK:** Ảnh sẽ accessible qua path `/data/questions/images/math/filename.png`
- **Offline Support:** Ảnh được embed trong APK, không cần internet để hiển thị
- **Chức năng thưởng items:** Đã có sẵn, không cần làm gì thêm

---

## 🎯 Next Steps

Sau khi test thành công 10 ảnh đầu:
1. ✅ Tạo tiếp các ảnh còn lại (62 ảnh)
2. ✅ Chạy lại script update imageUrl
3. ✅ Build APK mới với tất cả ảnh
4. ✅ Test toàn bộ app

