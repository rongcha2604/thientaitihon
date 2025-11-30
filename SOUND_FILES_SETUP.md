# 🎵 Hướng Dẫn Setup Audio Files (Tiếng Người Thật)

## 📁 Cấu Trúc Thư Mục

Tạo các thư mục sau trong `public/sounds/`:

```
public/sounds/
├── correct/
│   ├── correct-01.mp3
│   ├── correct-02.mp3
│   ├── correct-03.mp3
│   ├── ...
│   └── correct-10.mp3
└── wrong/
    ├── wrong-01.mp3
    ├── wrong-02.mp3
    ├── wrong-03.mp3
    ├── ...
    └── wrong-10.mp3
```

## 🎤 Nội Dung Audio Files

### **Chúc mừng khi đúng (10 mẫu):**

1. **correct-01.mp3:** "Giỏi lắm con!"
2. **correct-02.mp3:** "Chính xác!"
3. **correct-03.mp3:** "Làm tốt lắm!"
4. **correct-04.mp3:** "Đúng rồi, tuyệt vời!"
5. **correct-05.mp3:** "Rất giỏi!"
6. **correct-06.mp3:** "Tuyệt vời con!"
7. **correct-07.mp3:** "Làm đúng rồi!"
8. **correct-08.mp3:** "Giỏi quá!"
9. **correct-09.mp3:** "Chúc mừng con!"
10. **correct-10.mp3:** "Con làm rất tốt!"

### **Động viên khi sai (10 mẫu):**

1. **wrong-01.mp3:** "Không sao, cố gắng lần sau!"
2. **wrong-02.mp3:** "Chưa đúng, nhưng con đã cố gắng!"
3. **wrong-03.mp3:** "Thử lại xem con!"
4. **wrong-04.mp3:** "Con đang học tốt đấy!"
5. **wrong-05.mp3:** "Cố gắng lên con!"
6. **wrong-06.mp3:** "Gần đúng rồi, cố thêm chút nữa!"
7. **wrong-07.mp3:** "Không sao, đọc lại câu hỏi nhé!"
8. **wrong-08.mp3:** "Con đã suy nghĩ kỹ rồi!"
9. **wrong-09.mp3:** "Học hỏi từ sai lầm là tốt!"
10. **wrong-10.mp3:** "Cố gắng, con sẽ làm tốt!"

## 🎯 Cách Thêm Files

### **Option 1: Record bằng điện thoại/máy tính**
1. Dùng Voice Recorder (điện thoại) hoặc Audacity (máy tính)
2. Record từng câu
3. Export ra MP3 format
4. Đặt tên đúng: `correct-01.mp3`, `correct-02.mp3`, ...
5. Copy vào `public/sounds/correct/` hoặc `public/sounds/wrong/`

### **Option 2: Dùng Text-to-Speech (TTS)**
1. Dùng online TTS: Google Text-to-Speech, Microsoft Azure, Amazon Polly
2. Generate audio từ text
3. Export MP3
4. Đặt tên đúng format
5. Copy vào thư mục tương ứng

### **Option 3: Thuê người record**
1. Thuê người record (Fiverr, Upwork)
2. Specify: Vietnamese language, friendly voice for children
3. Nhận files và đặt tên đúng format

## 📋 Naming Convention

**Format:** `[type]-[number].mp3`

- **Type:** `correct` hoặc `wrong`
- **Number:** `01` đến `10` (2 digits, có leading zero)

**Examples:**
- ✅ `correct-01.mp3`
- ✅ `correct-10.mp3`
- ✅ `wrong-05.mp3`
- ❌ `correct-1.mp3` (thiếu leading zero)
- ❌ `congrat-01.mp3` (sai type name)

## ⚙️ Technical Details

### **Auto-Detection:**
- App tự động detect files có sẵn
- Nếu có files → Play MP3 (random từ 10 files)
- Nếu không có files → Fallback về Web Audio (Victory Fanfare/Encouragement)

### **Random Selection:**
- Mỗi lần play → Random chọn 1 trong 10 files có sẵn
- Không lặp lại file vừa play (trong cùng session)

### **Preloading:**
- Files được preload khi app start
- Cache trong memory → Play ngay lập tức

### **Flexible Support:**
- Không cần đủ 10 files
- App sẽ dùng files có sẵn (1-10 files đều được)
- Nếu không có files → Dùng Web Audio

## 💡 Tips

1. **File Size:** Giữ files nhỏ (< 500KB mỗi file) để load nhanh
2. **Duration:** Mỗi câu khoảng 2-5 giây là đủ
3. **Quality:** 128kbps MP3 là đủ (không cần quá cao)
4. **Voice:** Giọng nữ ấm áp, thân thiện, phù hợp trẻ em
5. **Tone:** Vui vẻ, tích cực, động viên

## 🔄 Workflow

1. **Tạo thư mục:** `public/sounds/correct/` và `public/sounds/wrong/`
2. **Thêm files:** Record hoặc generate MP3 files
3. **Đặt tên đúng:** Format `correct-01.mp3`, `wrong-01.mp3`
4. **Test:** Run `npm run dev` → Test sounds
5. **Deploy:** Files trong `public/` sẽ được deploy cùng app

## 📝 Example Scripts để Record

**Chúc mừng:**
- "Giỏi lắm con! 🌟"
- "Chính xác! 🎉"
- "Làm tốt lắm! ✨"
- "Đúng rồi, tuyệt vời! 🎊"
- "Rất giỏi! 👏"

**Động viên:**
- "Không sao, cố gắng lần sau! 💪"
- "Chưa đúng, nhưng con đã cố gắng! 🌱"
- "Thử lại xem con! 🔄"
- "Con đang học tốt đấy! 📚"
- "Cố gắng lên con! 💫"

---

**Lưu ý:** Nếu không có audio files, app vẫn hoạt động bình thường với Web Audio (Victory Fanfare/Encouragement). Audio files là optional enhancement! 🎵✨

