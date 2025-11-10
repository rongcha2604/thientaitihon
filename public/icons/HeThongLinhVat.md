🐉 HỆ THỐNG LINH VẬT – TÓM TẮT CẤU TRÚC CHUẨN
🎯 MỤC TIÊU

Tạo hệ thống game hoá hành trình học tập: bé tích sao (⭐) qua bài học → mở khóa linh vật → tiến hoá qua 5 cấp → trang trí linh vật bằng vật phẩm sưu tầm.
Mỗi cấp sao tương ứng ngoại hình đẹp hơn, hiệu ứng mạnh hơn, tạo động lực học lâu dài.

🌟 1. CẤU TRÚC SAO & ĐIỂM TIẾN HOÁ
Cấp	Tên	Sao cần để mở	Tổng sao tích luỹ	Mô tả tiến hoá
⭐	Bé thú khởi đầu	50	50	Dễ thương, thân thiện, xuất hiện sớm
⭐⭐	Linh thú học giả	100	150	Có thêm phụ kiện, thông minh hơn
⭐⭐⭐	Linh thú năng lượng	200	350	Tỏa sáng, có hiệu ứng ánh sáng
⭐⭐⭐⭐	Linh thú Long Vân	400	750	Bay giữa mây, thần thái nhẹ nhàng
⭐⭐⭐⭐⭐	Thần thú Ngọc Tỉ	800	1550	Thần thú huyền thoại, hiệu ứng cầu vồng

Tổng sao để đạt cấp tối đa: ~1550 sao (cấp số nhân nhẹ, dễ đạt nhưng vẫn thử thách).

🧬 2. CẤU TRÚC JSON MẪU
{
  "id": "BE_NA",
  "base_name_vi": "Tiểu Long Bé Na",
  "max_stars": 5,
  "levels": [
    { "star": 1, "name_vi": "Rồng Con Bé Na", "effect": { "bonus_points": 0.05 }, "unlock_cost": { "STAR": 50 } },
    { "star": 2, "name_vi": "Rồng Bé Na Học Giả", "effect": { "bonus_xp": 0.1 }, "unlock_cost": { "STAR": 100 } },
    { "star": 3, "name_vi": "Rồng Bé Na Tỏa Sáng", "effect": { "perfect_bonus": 0.15 }, "unlock_cost": { "STAR": 200 } },
    { "star": 4, "name_vi": "Rồng Bé Na Long Vân", "effect": { "combo_bonus": 0.2 }, "unlock_cost": { "STAR": 400 } },
    { "star": 5, "name_vi": "Thần Long Bé Na Ngọc Tỉ", "effect": { "double_points_chance": 0.08 }, "unlock_cost": { "STAR": 800, "EVOL_CRYSTAL": 1 } }
  ]
}

🐾 3. DANH SÁCH LINH VẬT CHÍNH (10 nhân vật)
Mã	Tên	Chủ đề / Môn	Màu chính	Hiệu ứng đặc biệt
BE_NA	Tiểu Long Bé Na	Toán học	Xanh ngọc + đỏ	Double points, combo
MIU	Cô Ba Miu	Tiếng Việt	Vàng nhạt + trắng	Hint & review bonus
FLARE	Cáo Flare	Khoa học	Cam + vàng	Speed & perfect bonus
TURU	Rùa Sóng	Môi trường / Biển	Xanh lam	Shield & energy regen
PHOEN	Chim Phượng	Tiếng Anh	Đỏ hồng	Revival & protect score
DEER	Nai Tri Thức	Khoa học tự nhiên	Nâu + lá	Streak & focus bonus
STARFAE	Tinh Linh Sao	Sáng tạo / Nghệ thuật	Tím + trắng	Random gift & combo
TY	Thỏ Tý	Kỹ năng sống	Nâu + xanh	Streak bonus & time buff
SHADOW	Long Bóng Tối	Logic nâng cao	Tím đen	XP boost & rare drop
KILAN	Kỳ Lân Sao	Tổng hợp	Cầu vồng	Unlock world bonus
⚙️ 5. LUỒNG TIẾN HOÁ (LOGIC)

Bé học bài → nhận Sao (⭐)

Tích đủ → mở khoá linh vật cấp 1 (⭐)

Tiếp tục học → nâng sao dần (⭐ → ⭐⭐⭐⭐⭐)

Cấp càng cao → linh vật đẹp hơn, hiệu ứng mạnh hơn

Trang trí bằng vật phẩm → tăng cá nhân hoá & động lực

🎨 6. PHONG CÁCH HÌNH ẢNH (chuẩn dùng trong AI Studio)

Pixar / Disney 3D ultra-realistic, ánh sáng mềm, màu ấm.

Giữ nhất quán nhân vật (same look reference).

Cấp 1–3: dễ thương – vui tươi – ánh sáng nhẹ.

Cấp 4: Long Vân – bay giữa mây sáng, thanh khiết.

Cấp 5: Ngọc Tỉ – thần khí, cầu vồng, vương miện ánh sáng.