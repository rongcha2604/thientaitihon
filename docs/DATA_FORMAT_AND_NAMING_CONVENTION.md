# 📚 ĐỊNH DẠNG CHUẨN VÀ QUY CÁCH ĐẶT TÊN FILE DATA JSON

## 📋 Mục Lục

1. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
2. [Quy Ước Đặt Tên](#quy-ước-đặt-tên)
3. [Định Dạng JSON Chuẩn](#định-dạng-json-chuẩn)
4. [Validation Rules](#validation-rules)
5. [Ví Dụ Cụ Thể](#ví-dụ-cụ-thể)
6. [Checklist Tạo File](#checklist-tạo-file)
7. [Tools & Scripts](#tools--scripts)

---

## 📂 Cấu Trúc Thư Mục

### Cấu Trúc Tổng Quan

```
src/data/questions/
├── {book-series}/              ← Bộ sách (kebab-case)
│   ├── grade-{grade}/          ← Lớp (1-5)
│   │   ├── {subject}/          ← Môn học (lowercase)
│   │   │   ├── week-{week}.json
│   │   │   ├── week-{week}.json
│   │   │   └── ...
```

### Ví Dụ Cấu Trúc Thực Tế

```
src/data/questions/
├── ket-noi-tri-thuc/           ← Bộ sách "Kết nối tri thức"
│   ├── grade-1/                 ← Lớp 1
│   │   ├── math/                ← Môn Toán
│   │   │   ├── week-1.json
│   │   │   ├── week-2.json
│   │   │   └── ...
│   │   ├── vietnamese/          ← Môn Tiếng Việt
│   │   │   ├── week-1.json
│   │   │   ├── week-2.json
│   │   │   └── ...
│   │   └── english/             ← Môn Tiếng Anh
│   │       ├── week-1.json
│   │       └── ...
│   ├── grade-2/
│   │   └── ...
│   └── ...
├── chan-troi-sang-tao/          ← Bộ sách "Chân trời sáng tạo"
│   └── ...
├── cung-hoc/                    ← Bộ sách "Phát triển năng lực"
│   └── ...
└── vi-su-binh-dang/             ← Bộ sách "Bình đẳng & Dân chủ"
    └── ...
```

---

## 🏷️ Quy Ước Đặt Tên

### 1. Bộ Sách (Book Series)

**Quy tắc:**
- ✅ **Lowercase** (chữ thường)
- ✅ **Kebab-case** (dấu gạch ngang `-`)
- ✅ **Không có dấu tiếng Việt** (unicode → latin)
- ✅ **Không có khoảng trắng**

**Mapping Table:**

| Bộ Sách (Tiếng Việt) | Tên Thư Mục (Folder) |
|----------------------|---------------------|
| Kết nối tri thức | `ket-noi-tri-thuc` |
| Chân trời sáng tạo | `chan-troi-sang-tao` |
| Phát triển năng lực | `cung-hoc` |
| Bình đẳng & Dân chủ | `vi-su-binh-dang` |

**Ví dụ:**
- ✅ `ket-noi-tri-thuc` (đúng)
- ❌ `Ket-Noi-Tri-Thuc` (sai - có chữ hoa)
- ❌ `ket_noi_tri_thuc` (sai - dùng underscore)
- ❌ `ket noi tri thuc` (sai - có khoảng trắng)

### 2. Lớp (Grade)

**Quy tắc:**
- ✅ Format: `grade-{số lớp}`
- ✅ Số lớp: `1`, `2`, `3`, `4`, `5`
- ✅ Không có số 0 (không có `grade-0`)

**Ví dụ:**
- ✅ `grade-1`, `grade-2`, `grade-3`, `grade-4`, `grade-5`
- ❌ `grade1` (sai - thiếu dấu gạch ngang)
- ❌ `grade-01` (sai - không cần số 0 đứng trước)
- ❌ `Lop-1` (sai - không dùng tiếng Việt)

### 3. Môn Học (Subject)

**Quy tắc:**
- ✅ **Lowercase** (chữ thường)
- ✅ **Tiếng Anh** (không dùng tiếng Việt)
- ✅ **Không có dấu gạch ngang** (trừ khi cần thiết)

**Mapping Table:**

| Môn Học (Tiếng Việt) | Tên Thư Mục (Folder) |
|---------------------|---------------------|
| Toán | `math` |
| Tiếng Việt | `vietnamese` |
| Tiếng Anh | `english` |

**Ví dụ:**
- ✅ `math`, `vietnamese`, `english`
- ❌ `toan`, `tieng-viet`, `TiengAnh` (sai)

### 4. Tuần (Week)

**Quy tắc:**
- ✅ Format: `week-{số tuần}.json`
- ✅ Số tuần: `1` - `35` (35 tuần = 1 năm học)
- ✅ **Phải có extension `.json`**
- ✅ Số tuần **không có số 0 đứng trước** (trừ khi > 9)

**Ví dụ:**
- ✅ `week-1.json`, `week-2.json`, `week-10.json`, `week-35.json`
- ❌ `week1.json` (sai - thiếu dấu gạch ngang)
- ❌ `week-01.json` (sai - không cần số 0)
- ❌ `Week-1.json` (sai - có chữ hoa)
- ❌ `week-1.JSON` (sai - extension phải lowercase)

---

## 📄 Định Dạng JSON Chuẩn

### Structure Tổng Quan

```json
{
  "week": number,
  "subject": string,
  "grade": number,
  "bookSeries": string,
  "lessons": [
    {
      "id": string,
      "title": string,
      "duration": number,
      "questions": [
        {
          "id": string,
          "type": string,
          "question": string,
          "options": string[],
          "correctAnswer": number,
          "explanation": string,
          "imageUrl": string | null
        }
      ]
    }
  ]
}
```

### Field Descriptions

#### Root Level

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `week` | `number` | ✅ Yes | Số tuần (1-35) | `1` |
| `subject` | `string` | ✅ Yes | Môn học (`math`, `vietnamese`, `english`) | `"vietnamese"` |
| `grade` | `number` | ✅ Yes | Lớp (1-5) | `1` |
| `bookSeries` | `string` | ✅ Yes | Bộ sách (kebab-case) | `"ket-noi-tri-thuc"` |
| `lessons` | `array` | ✅ Yes | Array các bài học | `[{...}]` |

#### Lesson Object

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | `string` | ✅ Yes | ID bài học (unique) | `"lesson-1"` |
| `title` | `string` | ✅ Yes | Tên bài học | `"TUẦN 1"` |
| `duration` | `number` | ✅ Yes | Thời gian (phút) | `15` |
| `questions` | `array` | ✅ Yes | Array câu hỏi | `[{...}]` |

#### Question Object

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | `string` | ✅ Yes | ID câu hỏi (unique) | `"q1"` |
| `type` | `string` | ✅ Yes | Loại câu hỏi | `"multiple-choice"` |
| `question` | `string` | ✅ Yes | Nội dung câu hỏi | `"Chữ nào sau đây là chữ 'a'?"` |
| `options` | `string[]` | ✅ Yes | Array đáp án (4 options) | `["a", "b", "c", "d"]` |
| `correctAnswer` | `number` | ✅ Yes | Index đáp án đúng (0-3) | `0` |
| `explanation` | `string` | ✅ Yes | Giải thích đáp án | `"Chữ 'a' là chữ cái đầu tiên"` |
| `imageUrl` | `string \| null` | ✅ Yes | URL hình ảnh | `null` |

### Example JSON Hoàn Chỉnh

```json
{
  "week": 1,
  "subject": "vietnamese",
  "grade": 1,
  "bookSeries": "ket-noi-tri-thuc",
  "lessons": [
    {
      "id": "lesson-1",
      "title": "TUẦN 1",
      "duration": 15,
      "questions": [
        {
          "id": "q1",
          "type": "multiple-choice",
          "question": "Chữ cái nào sau đây là chữ \"a\"?",
          "options": [
            "b",
            "e",
            "a",
            "ê"
          ],
          "correctAnswer": 2,
          "explanation": "Chữ 'a' là chữ cái đầu tiên trong bảng chữ cái tiếng Việt",
          "imageUrl": null
        },
        {
          "id": "q2",
          "type": "multiple-choice",
          "question": "Chữ cái nào sau đây là chữ \"b\"?",
          "options": [
            "a",
            "b",
            "e",
            "ê"
          ],
          "correctAnswer": 1,
          "explanation": "Chữ 'b' là phụ âm trong bảng chữ cái tiếng Việt",
          "imageUrl": null
        }
      ]
    }
  ]
}
```

### Question Types

Hiện tại hỗ trợ các loại câu hỏi:

| Type | Description | Options Count | Example |
|------|-------------|---------------|---------|
| `multiple-choice` | Trắc nghiệm nhiều lựa chọn | 4 | ✅ Đang dùng |
| `true-false` | Đúng/Sai | 2 | ⏳ Chưa implement |
| `fill-blank` | Điền vào chỗ trống | N/A | ⏳ Chưa implement |

**Lưu ý:** Hiện tại chỉ hỗ trợ `multiple-choice` với 4 options.

---

## ✅ Validation Rules

### 1. File Naming

- ✅ Tên file: `week-{number}.json` (lowercase)
- ✅ Số tuần: `1` - `35` (không có số 0 đứng trước)
- ✅ Extension: `.json` (lowercase)

### 2. Directory Structure

- ✅ Bộ sách: lowercase, kebab-case
- ✅ Lớp: `grade-{1-5}`
- ✅ Môn học: lowercase, tiếng Anh

### 3. JSON Structure

- ✅ **Valid JSON** (parse được)
- ✅ **UTF-8 encoding**
- ✅ **2 spaces indentation** (khuyến nghị)
- ✅ **All required fields** present

### 4. Data Validation

#### Root Level
- ✅ `week`: `number`, range `1-35`
- ✅ `subject`: `string`, one of `["math", "vietnamese", "english"]`
- ✅ `grade`: `number`, range `1-5`
- ✅ `bookSeries`: `string`, kebab-case, matching folder name
- ✅ `lessons`: `array`, length `>= 1`

#### Lesson Level
- ✅ `id`: `string`, unique within file
- ✅ `title`: `string`, non-empty
- ✅ `duration`: `number`, `> 0`
- ✅ `questions`: `array`, length `>= 1`

#### Question Level
- ✅ `id`: `string`, unique within lesson
- ✅ `type`: `string`, currently only `"multiple-choice"`
- ✅ `question`: `string`, non-empty
- ✅ `options`: `array`, length `= 4` (for multiple-choice)
- ✅ `correctAnswer`: `number`, range `0-3` (matching options array index)
- ✅ `explanation`: `string` (can be empty)
- ✅ `imageUrl`: `string | null` (null if no image)

### 5. CorrectAnswer Validation

**QUAN TRỌNG:** `correctAnswer` phải là **index** (0-3), không phải giá trị!

```json
// ✅ ĐÚNG
{
  "options": ["a", "b", "c", "d"],
  "correctAnswer": 0  // ← Index 0 = "a"
}

// ❌ SAI
{
  "options": ["a", "b", "c", "d"],
  "correctAnswer": "a"  // ← Không phải index!
}
```

### 6. Logic Validation

- ✅ `correctAnswer` index phải khớp với đáp án đúng trong câu hỏi
- ✅ Options không được rỗng
- ✅ Question text không được rỗng

---

## 📝 Ví Dụ Cụ Thể

### Ví Dụ 1: Tiếng Việt, Lớp 1, Tuần 1

**File Path:**
```
src/data/questions/ket-noi-tri-thuc/grade-1/vietnamese/week-1.json
```

**File Content:**
```json
{
  "week": 1,
  "subject": "vietnamese",
  "grade": 1,
  "bookSeries": "ket-noi-tri-thuc",
  "lessons": [
    {
      "id": "lesson-1",
      "title": "TUẦN 1",
      "duration": 15,
      "questions": [
        {
          "id": "q1",
          "type": "multiple-choice",
          "question": "Chữ cái nào sau đây là chữ \"a\"?",
          "options": [
            "b",
            "e",
            "a",
            "ê"
          ],
          "correctAnswer": 2,
          "explanation": "Chữ 'a' là chữ cái đầu tiên trong bảng chữ cái tiếng Việt",
          "imageUrl": null
        }
      ]
    }
  ]
}
```

### Ví Dụ 2: Toán, Lớp 1, Tuần 1

**File Path:**
```
src/data/questions/ket-noi-tri-thuc/grade-1/math/week-1.json
```

**File Content:**
```json
{
  "week": 1,
  "subject": "math",
  "grade": 1,
  "bookSeries": "ket-noi-tri-thuc",
  "lessons": [
    {
      "id": "lesson-1",
      "title": "Số đếm",
      "duration": 5,
      "questions": [
        {
          "id": "q1",
          "type": "multiple-choice",
          "question": "Có 3 quả táo, thêm 2 quả táo nữa. Hỏi có tất cả bao nhiêu quả táo?",
          "options": [
            "4 quả táo",
            "5 quả táo",
            "6 quả táo",
            "7 quả táo"
          ],
          "correctAnswer": 1,
          "explanation": "3 + 2 = 5",
          "imageUrl": null
        }
      ]
    }
  ]
}
```

### Ví Dụ 3: Tiếng Anh, Lớp 1, Tuần 1

**File Path:**
```
src/data/questions/ket-noi-tri-thuc/grade-1/english/week-1.json
```

**File Content:**
```json
{
  "week": 1,
  "subject": "english",
  "grade": 1,
  "bookSeries": "ket-noi-tri-thuc",
  "lessons": [
    {
      "id": "lesson-1",
      "title": "Hello",
      "duration": 10,
      "questions": [
        {
          "id": "q1",
          "type": "multiple-choice",
          "question": "How do you say 'Xin chào' in English?",
          "options": [
            "Hello",
            "Goodbye",
            "Thank you",
            "Please"
          ],
          "correctAnswer": 0,
          "explanation": "'Hello' means 'Xin chào' in English",
          "imageUrl": null
        }
      ]
    }
  ]
}
```

---

## ✅ Checklist Tạo File

### Trước Khi Tạo File

- [ ] Xác định đúng **bộ sách** (book series)
- [ ] Xác định đúng **lớp** (grade)
- [ ] Xác định đúng **môn học** (subject)
- [ ] Xác định đúng **tuần** (week)

### Khi Tạo File

- [ ] Đặt tên file đúng: `week-{số tuần}.json`
- [ ] Đặt đúng thư mục: `{book-series}/grade-{grade}/{subject}/`
- [ ] JSON format đúng (valid JSON)
- [ ] UTF-8 encoding
- [ ] 2 spaces indentation (khuyến nghị)

### Validation

- [ ] Field `week` đúng (1-35)
- [ ] Field `subject` đúng (`math`, `vietnamese`, `english`)
- [ ] Field `grade` đúng (1-5)
- [ ] Field `bookSeries` đúng (khớp với tên thư mục)
- [ ] `lessons` array không rỗng
- [ ] Mỗi lesson có `id`, `title`, `duration`, `questions`
- [ ] `questions` array không rỗng
- [ ] Mỗi question có `id`, `type`, `question`, `options`, `correctAnswer`, `explanation`, `imageUrl`
- [ ] `options` array có đúng 4 phần tử
- [ ] `correctAnswer` là index (0-3), không phải giá trị
- [ ] `correctAnswer` index khớp với đáp án đúng
- [ ] `explanation` có nội dung (có thể để trống nhưng nên có)
- [ ] `imageUrl` là `null` hoặc URL hợp lệ

### Sau Khi Tạo File

- [ ] Chạy validation script để kiểm tra
- [ ] Test load file trong ứng dụng
- [ ] Kiểm tra câu hỏi hiển thị đúng
- [ ] Kiểm tra đáp án đúng được highlight

---

## 🛠️ Tools & Scripts

### 1. Validation Script

**Script:** `scripts/validate_questions.py`

**Mục đích:** Kiểm tra format và logic của tất cả câu hỏi

**Cách dùng:**
```bash
python scripts/validate_questions.py
```

**Output:**
- ✅ List files đã kiểm tra
- ✅ Tổng số câu hỏi
- ✅ Số vấn đề tìm thấy
- ✅ Chi tiết các vấn đề (nếu có)

### 2. Verify Correct Answers Script

**Script:** `scripts/verify_correct_answers.py`

**Mục đích:** So sánh file gốc và file đã convert để đảm bảo `correctAnswer` index đúng

**Cách dùng:**
```bash
python scripts/verify_correct_answers.py
```

**Output:**
- ✅ So sánh từng tuần
- ✅ Kiểm tra `correctAnswer` index
- ✅ Báo cáo lỗi (nếu có)

### 3. Deep Logic Validation Script

**Script:** `scripts/deep_validate_logic.py`

**Mục đích:** Kiểm tra logic câu hỏi chi tiết (đáp án đúng khớp với nội dung câu hỏi)

**Cách dùng:**
```bash
python scripts/deep_validate_logic.py
```

**Output:**
- ✅ Kiểm tra logic từng câu hỏi
- ✅ Phát hiện đáp án sai logic
- ✅ Gợi ý đáp án đúng (nếu có)

### 4. Final Validation Script

**Script:** `scripts/final_validation.py`

**Mục đích:** Kiểm tra tổng hợp cuối cùng (format + logic + sample)

**Cách dùng:**
```bash
python scripts/final_validation.py
```

**Output:**
- ✅ Tổng hợp tất cả kiểm tra
- ✅ Sample câu hỏi để review thủ công
- ✅ Báo cáo tổng kết

### 5. JSON Syntax Check

**Cách dùng:**
```bash
# Node.js
node -e "JSON.parse(require('fs').readFileSync('src/data/questions/ket-noi-tri-thuc/grade-1/vietnamese/week-1.json', 'utf8'))"

# Python
python -m json.tool src/data/questions/ket-noi-tri-thuc/grade-1/vietnamese/week-1.json
```

---

## 📚 Notes & Best Practices

### File Encoding
- ✅ **UTF-8** (bắt buộc)
- ❌ Không dùng ASCII hoặc encoding khác

### Indentation
- ✅ **2 spaces** (khuyến nghị)
- ✅ Hoặc **4 spaces** (cũng được)
- ❌ Không dùng **tabs**

### Line Endings
- ✅ **LF** (Unix) hoặc **CRLF** (Windows) đều được
- ✅ Git sẽ tự động handle

### Image URLs
- ✅ Nếu có hình ảnh, đặt trong `public/images/`
- ✅ Dùng đường dẫn `/images/{filename}`
- ✅ Ví dụ: `"/images/week-1-q1.jpg"`
- ✅ Không có hình: `null`

### Question IDs
- ✅ Format: `"q{number}"` (ví dụ: `"q1"`, `"q2"`, `"q20"`)
- ✅ Unique within lesson
- ✅ Không cần unique across lessons

### Lesson IDs
- ✅ Format: `"lesson-{number}"` (ví dụ: `"lesson-1"`, `"lesson-2"`)
- ✅ Unique within file
- ✅ Không cần unique across files

### Explanation
- ✅ Nên có nội dung giải thích rõ ràng
- ✅ Có thể để trống `""` nếu không cần
- ✅ Tiếng Việt, dễ hiểu cho học sinh lớp 1

### Duration
- ✅ Unit: **phút** (minutes)
- ✅ Range: `1` - `60` (khuyến nghị)
- ✅ Ước tính thời gian hoàn thành bài học

---

## 🔍 Troubleshooting

### Lỗi Thường Gặp

#### 1. JSON Syntax Error
**Lỗi:** `SyntaxError: Unexpected token`

**Nguyên nhân:**
- Thiếu dấu phẩy `,`
- Thiếu dấu ngoặc `{}` hoặc `[]`
- Dấu ngoặc kép không đúng

**Cách fix:**
- Dùng JSON validator để kiểm tra
- Check indentation
- Kiểm tra dấu phẩy cuối cùng

#### 2. CorrectAnswer Index Out of Range
**Lỗi:** `correctAnswer` index `>= 4` hoặc `< 0`

**Nguyên nhân:**
- `correctAnswer` không phải index (ví dụ: `"a"` thay vì `0`)
- Options array không đủ 4 phần tử
- Index tính sai

**Cách fix:**
- Đảm bảo `correctAnswer` là số (0-3)
- Đảm bảo `options` array có đúng 4 phần tử
- Kiểm tra index: `options[correctAnswer]` phải là đáp án đúng

#### 3. File Not Found
**Lỗi:** `Failed to load week data: 404`

**Nguyên nhân:**
- Tên file sai
- Đường dẫn sai
- File không tồn tại

**Cách fix:**
- Kiểm tra tên file: `week-{number}.json`
- Kiểm tra đường dẫn: `{book-series}/grade-{grade}/{subject}/`
- Kiểm tra file có tồn tại không

#### 4. Encoding Error
**Lỗi:** Ký tự tiếng Việt hiển thị sai

**Nguyên nhân:**
- File không phải UTF-8
- Editor không hỗ trợ UTF-8

**Cách fix:**
- Save file với UTF-8 encoding
- Dùng editor hỗ trợ UTF-8 (VS Code, Notepad++)

---

## 📖 References

- [JSON Standard](https://www.json.org/)
- [UTF-8 Encoding](https://en.wikipedia.org/wiki/UTF-8)
- [Kebab Case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case)

---

## 📝 Changelog

### Version 1.0.0 (2024-01-XX)
- ✅ Initial document
- ✅ Standard format defined
- ✅ Naming convention established
- ✅ Validation scripts created

---

**📌 Lưu ý:** Document này là tài liệu chính thức về format và naming convention. Mọi thay đổi phải được update trong document này.

