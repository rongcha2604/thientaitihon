# 🐉 PROMPT TẠO LINH VẬT 5 CẤP ĐỘ

## 📋 HƯỚNG DẪN TẠO LINH VẬT MỚI

### 🎯 CẤU TRÚC CƠ BẢN

Mỗi linh vật cần có các thông tin sau:

```json
{
  "id": "MÃ_LINH_VẬT",
  "code": "MÃ_CODE",
  "baseNameVi": "Tên gốc",
  "maxStars": 5,
  "theme": "Chủ đề",
  "color": "Màu sắc",
  "specialEffect": "Hiệu ứng đặc biệt",
  "levels": [
    {
      "star": 1,
      "name_vi": "Tên cấp 1",
      "effect": { "bonus_points": 0.05 },
      "unlock_cost": { "STAR": 50 }
    },
    {
      "star": 2,
      "name_vi": "Tên cấp 2",
      "effect": { "bonus_xp": 0.1 },
      "unlock_cost": { "STAR": 100 }
    },
    {
      "star": 3,
      "name_vi": "Tên cấp 3",
      "effect": { "perfect_bonus": 0.15 },
      "unlock_cost": { "STAR": 200 }
    },
    {
      "star": 4,
      "name_vi": "Tên cấp 4",
      "effect": { "combo_bonus": 0.2 },
      "unlock_cost": { "STAR": 400 }
    },
    {
      "star": 5,
      "name_vi": "Tên cấp 5",
      "effect": { "double_points_chance": 0.08 },
      "unlock_cost": { "STAR": 800 }
    }
  ]
}
```

---

## 📝 CHI TIẾT TỪNG FIELD

### 1. **id** (Bắt buộc)
- **Mô tả:** Mã định danh duy nhất cho linh vật
- **Format:** Chữ hoa, số, gạch dưới
- **Ví dụ:** `"BE_NA"`, `"CO_BA_MIU"`, `"CAO_FLARE"`
- **Lưu ý:** Phải unique, không trùng với linh vật khác

### 2. **code** (Bắt buộc)
- **Mô tả:** Mã code ngắn gọn (thường giống id)
- **Format:** Chữ hoa, gạch dưới
- **Ví dụ:** `"BE_NA"`, `"CO_BA_MIU"`

### 3. **baseNameVi** (Bắt buộc)
- **Mô tả:** Tên gốc của linh vật (tên cấp 0 - chưa mở khóa)
- **Format:** Tiếng Việt, có dấu
- **Ví dụ:** `"Tiểu Long Bé Na"`, `"Cô Ba Miu"`, `"Cáo Flare"`

### 4. **maxStars** (Bắt buộc)
- **Mô tả:** Số cấp độ tối đa
- **Giá trị:** Luôn là `5`
- **Ví dụ:** `5`

### 5. **theme** (Tùy chọn)
- **Mô tả:** Chủ đề của linh vật
- **Format:** Tiếng Việt
- **Ví dụ:** `"Toán học"`, `"Văn học"`, `"Khoa học"`, `"Lịch sử"`

### 6. **color** (Tùy chọn)
- **Mô tả:** Màu sắc chủ đạo
- **Format:** Tiếng Việt
- **Ví dụ:** `"Xanh ngọc + đỏ"`, `"Vàng + cam"`, `"Tím + hồng"`

### 7. **specialEffect** (Tùy chọn)
- **Mô tả:** Hiệu ứng đặc biệt của linh vật
- **Format:** Tiếng Việt
- **Ví dụ:** `"Double points, combo"`, `"Bonus XP"`, `"Perfect streak"`

### 8. **levels** (Bắt buộc)
- **Mô tả:** Mảng 5 cấp độ (từ cấp 1 đến cấp 5)
- **Format:** Array of objects

---

## ⭐ CHI TIẾT MỖI LEVEL

Mỗi level trong `levels` array cần có:

### **star** (Bắt buộc)
- **Mô tả:** Số sao của cấp độ này
- **Giá trị:** `1`, `2`, `3`, `4`, `5`
- **Ví dụ:** `1` (cấp 1), `5` (cấp 5)

### **name_vi** (Bắt buộc)
- **Mô tả:** Tên của linh vật ở cấp độ này
- **Format:** Tiếng Việt, có dấu
- **Quy tắc đặt tên:**
  - Cấp 1: Tên đơn giản, dễ thương (ví dụ: "Rồng Con Bé Na")
  - Cấp 2: Thêm từ "Học Giả" hoặc "Thông Minh" (ví dụ: "Rồng Bé Na Học Giả")
  - Cấp 3: Thêm từ "Tỏa Sáng" hoặc "Rực Rỡ" (ví dụ: "Rồng Bé Na Tỏa Sáng")
  - Cấp 4: Thêm từ "Long Vân" hoặc "Thần Thánh" (ví dụ: "Rồng Bé Na Long Vân")
  - Cấp 5: Thêm từ "Ngọc Tỉ" hoặc "Thần Khí" (ví dụ: "Thần Long Bé Na Ngọc Tỉ")

### **effect** (Bắt buộc)
- **Mô tả:** Hiệu ứng của cấp độ này
- **Format:** Object với các key sau:
  - `bonus_points`: Bonus điểm (0.05 = +5%)
  - `bonus_xp`: Bonus kinh nghiệm (0.1 = +10%)
  - `perfect_bonus`: Bonus khi làm đúng (0.15 = +15%)
  - `combo_bonus`: Bonus combo (0.2 = +20%)
  - `double_points_chance`: Xác suất double points (0.08 = 8%)
- **Ví dụ:**
  ```json
  { "bonus_points": 0.05 }
  { "bonus_xp": 0.1 }
  { "perfect_bonus": 0.15 }
  { "combo_bonus": 0.2 }
  { "double_points_chance": 0.08 }
  ```

### **unlock_cost** (Bắt buộc)
- **Mô tả:** Chi phí để mở khóa/nâng cấp lên cấp này
- **Format:** Object với key `STAR`
- **Quy tắc chi phí:**
  - Cấp 1 (unlock): `50` ⭐
  - Cấp 2: `100` ⭐ (tổng: 150 ⭐)
  - Cấp 3: `200` ⭐ (tổng: 350 ⭐)
  - Cấp 4: `400` ⭐ (tổng: 750 ⭐)
  - Cấp 5: `800` ⭐ (tổng: 1550 ⭐)
- **Ví dụ:**
  ```json
  { "STAR": 50 }   // Cấp 1
  { "STAR": 100 }  // Cấp 2
  { "STAR": 200 }  // Cấp 3
  { "STAR": 400 }  // Cấp 4
  { "STAR": 800 }  // Cấp 5
  ```

---

## 📚 VÍ DỤ HOÀN CHỈNH

### Ví dụ 1: Linh vật "Cô Ba Miu"

```json
{
  "id": "CO_BA_MIU",
  "code": "CO_BA_MIU",
  "baseNameVi": "Cô Ba Miu",
  "maxStars": 5,
  "theme": "Văn học",
  "color": "Vàng + cam",
  "specialEffect": "Bonus XP, perfect streak",
  "levels": [
    {
      "star": 1,
      "name_vi": "Mèo Con Ba Miu",
      "effect": { "bonus_xp": 0.05 },
      "unlock_cost": { "STAR": 50 }
    },
    {
      "star": 2,
      "name_vi": "Mèo Ba Miu Học Giả",
      "effect": { "perfect_bonus": 0.1 },
      "unlock_cost": { "STAR": 100 }
    },
    {
      "star": 3,
      "name_vi": "Mèo Ba Miu Tỏa Sáng",
      "effect": { "bonus_points": 0.15 },
      "unlock_cost": { "STAR": 200 }
    },
    {
      "star": 4,
      "name_vi": "Mèo Ba Miu Long Vân",
      "effect": { "combo_bonus": 0.2 },
      "unlock_cost": { "STAR": 400 }
    },
    {
      "star": 5,
      "name_vi": "Thần Mèo Ba Miu Ngọc Tỉ",
      "effect": { "double_points_chance": 0.08 },
      "unlock_cost": { "STAR": 800 }
    }
  ]
}
```

### Ví dụ 2: Linh vật "Cáo Flare"

```json
{
  "id": "CAO_FLARE",
  "code": "CAO_FLARE",
  "baseNameVi": "Cáo Flare",
  "maxStars": 5,
  "theme": "Khoa học",
  "color": "Cam + đỏ",
  "specialEffect": "Combo bonus, streak multiplier",
  "levels": [
    {
      "star": 1,
      "name_vi": "Cáo Con Flare",
      "effect": { "bonus_points": 0.05 },
      "unlock_cost": { "STAR": 50 }
    },
    {
      "star": 2,
      "name_vi": "Cáo Flare Học Giả",
      "effect": { "combo_bonus": 0.1 },
      "unlock_cost": { "STAR": 100 }
    },
    {
      "star": 3,
      "name_vi": "Cáo Flare Tỏa Sáng",
      "effect": { "bonus_xp": 0.15 },
      "unlock_cost": { "STAR": 200 }
    },
    {
      "star": 4,
      "name_vi": "Cáo Flare Long Vân",
      "effect": { "perfect_bonus": 0.2 },
      "unlock_cost": { "STAR": 400 }
    },
    {
      "star": 5,
      "name_vi": "Thần Cáo Flare Ngọc Tỉ",
      "effect": { "double_points_chance": 0.1 },
      "unlock_cost": { "STAR": 800 }
    }
  ]
}
```

---

## 🎨 QUY TẮC ĐẶT TÊN THEO CẤP ĐỘ

### Pattern chung:
1. **Cấp 1:** `[Tên] Con` hoặc `[Tên] Nhỏ`
   - Ví dụ: "Rồng Con Bé Na", "Mèo Con Ba Miu"

2. **Cấp 2:** `[Tên] Học Giả` hoặc `[Tên] Thông Minh`
   - Ví dụ: "Rồng Bé Na Học Giả", "Mèo Ba Miu Học Giả"

3. **Cấp 3:** `[Tên] Tỏa Sáng` hoặc `[Tên] Rực Rỡ`
   - Ví dụ: "Rồng Bé Na Tỏa Sáng", "Mèo Ba Miu Tỏa Sáng"

4. **Cấp 4:** `[Tên] Long Vân` hoặc `[Tên] Thần Thánh`
   - Ví dụ: "Rồng Bé Na Long Vân", "Mèo Ba Miu Long Vân"

5. **Cấp 5:** `Thần [Tên] Ngọc Tỉ` hoặc `[Tên] Thần Khí`
   - Ví dụ: "Thần Long Bé Na Ngọc Tỉ", "Thần Mèo Ba Miu Ngọc Tỉ"

---

## 💡 GỢI Ý HIỆU ỨNG (effect)

### Các loại hiệu ứng phổ biến:

1. **bonus_points** (Bonus điểm)
   - Cấp 1-2: `0.05` - `0.1` (+5% - +10%)
   - Cấp 3-4: `0.15` - `0.2` (+15% - +20%)
   - Cấp 5: `0.25` - `0.3` (+25% - +30%)

2. **bonus_xp** (Bonus kinh nghiệm)
   - Cấp 1-2: `0.05` - `0.1` (+5% - +10%)
   - Cấp 3-4: `0.15` - `0.2` (+15% - +20%)
   - Cấp 5: `0.25` - `0.3` (+25% - +30%)

3. **perfect_bonus** (Bonus khi làm đúng)
   - Cấp 1-2: `0.1` - `0.15` (+10% - +15%)
   - Cấp 3-4: `0.2` - `0.25` (+20% - +25%)
   - Cấp 5: `0.3` - `0.35` (+30% - +35%)

4. **combo_bonus** (Bonus combo)
   - Cấp 1-2: `0.1` - `0.15` (+10% - +15%)
   - Cấp 3-4: `0.2` - `0.25` (+20% - +25%)
   - Cấp 5: `0.3` - `0.35` (+30% - +35%)

5. **double_points_chance** (Xác suất double points)
   - Cấp 1-2: `0.05` - `0.08` (5% - 8%)
   - Cấp 3-4: `0.1` - `0.12` (10% - 12%)
   - Cấp 5: `0.15` - `0.2` (15% - 20%)

---

## 📝 TEMPLATE ĐỂ COPY-PASTE

```json
{
  "id": "YOUR_PET_ID",
  "code": "YOUR_PET_CODE",
  "baseNameVi": "Tên gốc",
  "maxStars": 5,
  "theme": "Chủ đề",
  "color": "Màu sắc",
  "specialEffect": "Hiệu ứng đặc biệt",
  "levels": [
    {
      "star": 1,
      "name_vi": "[Tên] Con",
      "effect": { "bonus_points": 0.05 },
      "unlock_cost": { "STAR": 50 }
    },
    {
      "star": 2,
      "name_vi": "[Tên] Học Giả",
      "effect": { "bonus_xp": 0.1 },
      "unlock_cost": { "STAR": 100 }
    },
    {
      "star": 3,
      "name_vi": "[Tên] Tỏa Sáng",
      "effect": { "perfect_bonus": 0.15 },
      "unlock_cost": { "STAR": 200 }
    },
    {
      "star": 4,
      "name_vi": "[Tên] Long Vân",
      "effect": { "combo_bonus": 0.2 },
      "unlock_cost": { "STAR": 400 }
    },
    {
      "star": 5,
      "name_vi": "Thần [Tên] Ngọc Tỉ",
      "effect": { "double_points_chance": 0.08 },
      "unlock_cost": { "STAR": 800 }
    }
  ]
}
```

---

## ✅ CHECKLIST TRƯỚC KHI THÊM VÀO FILE

- [ ] `id` và `code` là unique, không trùng với linh vật khác
- [ ] `baseNameVi` có dấu đúng, dễ đọc
- [ ] `maxStars` = 5
- [ ] `levels` có đúng 5 phần tử (star: 1, 2, 3, 4, 5)
- [ ] Mỗi level có đủ: `star`, `name_vi`, `effect`, `unlock_cost`
- [ ] `unlock_cost.STAR` đúng: 50, 100, 200, 400, 800
- [ ] `name_vi` theo pattern: Con → Học Giả → Tỏa Sáng → Long Vân → Ngọc Tỉ
- [ ] `effect` có ít nhất 1 key hợp lệ
- [ ] JSON syntax đúng (dấu phẩy, ngoặc nhọn)

---

## 🚀 CÁCH THÊM VÀO FILE

1. Mở file: `public/data/spirit-pets.json`
2. Tìm array `"pets": [...]`
3. Thêm linh vật mới vào cuối array (trước dấu `]`)
4. Đảm bảo có dấu phẩy giữa các linh vật
5. Kiểm tra JSON syntax (có thể dùng JSON validator online)
6. Save file
7. Refresh trang web để thấy linh vật mới

---

## 💬 VÍ DỤ PROMPT ĐỂ TẠO LINH VẬT MỚI

**Prompt mẫu:**
```
Tạo linh vật mới:
- Tên: "Chim Phượng"
- Chủ đề: "Lịch sử"
- Màu sắc: "Đỏ + vàng"
- Hiệu ứng đặc biệt: "Perfect streak, bonus XP"
- ID: "CHIM_PHUONG"
```

**Kết quả sẽ là:**
```json
{
  "id": "CHIM_PHUONG",
  "code": "CHIM_PHUONG",
  "baseNameVi": "Chim Phượng",
  "maxStars": 5,
  "theme": "Lịch sử",
  "color": "Đỏ + vàng",
  "specialEffect": "Perfect streak, bonus XP",
  "levels": [
    {
      "star": 1,
      "name_vi": "Chim Con Phượng",
      "effect": { "perfect_bonus": 0.05 },
      "unlock_cost": { "STAR": 50 }
    },
    {
      "star": 2,
      "name_vi": "Chim Phượng Học Giả",
      "effect": { "bonus_xp": 0.1 },
      "unlock_cost": { "STAR": 100 }
    },
    {
      "star": 3,
      "name_vi": "Chim Phượng Tỏa Sáng",
      "effect": { "perfect_bonus": 0.15 },
      "unlock_cost": { "STAR": 200 }
    },
    {
      "star": 4,
      "name_vi": "Chim Phượng Long Vân",
      "effect": { "combo_bonus": 0.2 },
      "unlock_cost": { "STAR": 400 }
    },
    {
      "star": 5,
      "name_vi": "Thần Chim Phượng Ngọc Tỉ",
      "effect": { "double_points_chance": 0.08 },
      "unlock_cost": { "STAR": 800 }
    }
  ]
}
```

---

## 🎯 TIPS

1. **Đặt tên dễ thương:** Linh vật cho trẻ em nên có tên dễ thương, dễ nhớ
2. **Chủ đề đa dạng:** Tạo linh vật cho nhiều môn học khác nhau
3. **Hiệu ứng cân bằng:** Không làm hiệu ứng quá mạnh (giữ trong khoảng 0.05 - 0.3)
4. **Màu sắc bắt mắt:** Chọn màu sắc tươi sáng, phù hợp với trẻ em
5. **Kiểm tra kỹ:** Luôn validate JSON trước khi save

---

**Chúc bạn tạo được nhiều linh vật đẹp! 🐉✨**

