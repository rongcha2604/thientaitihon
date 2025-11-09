-- SQL Script: Cap nhat imageFile cho tat ca Album Items
-- Chay script nay trong PostgreSQL de cap nhat duong dan anh
-- Script tu dong tao tu danh sach files thuc te

-- Characters (30 items)
UPDATE album_items SET image_file = '/uploads/album/characters/character-trang-ti.png' WHERE name = 'Trạng Tí' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-thang-bom.png' WHERE name = 'Thằng Bờm' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-chi-hang.png' WHERE name = 'Chị Hằng' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-anh-cuoi.png' WHERE name = 'Anh Cuội' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-ba-ngoai.png' WHERE name = 'Bà Ngoại' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-ong-ngoai.png' WHERE name = 'Ông Ngoại' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-co-giao.png' WHERE name = 'Cô Giáo' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-bac-si.png' WHERE name = 'Bác Sĩ' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-ban-than.png' WHERE name = 'Bạn Thân' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-anh-trai.png' WHERE name = 'Anh Trai' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-chi-gai.png' WHERE name = 'Chị Gái' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-em-be.png' WHERE name = 'Em Bé' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-ban-hoc.png' WHERE name = 'Bạn Học' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-co-ban-hang.png' WHERE name = 'Cô Bán Hàng' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-chu-cong-nhan.png' WHERE name = 'Chú Công Nhân' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-bac-nong-dan.png' WHERE name = 'Bác Nông Dân' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-co-y-ta.png' WHERE name = 'Cô Y Tá' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-chu-canh-sat.png' WHERE name = 'Chú Cảnh Sát' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-ban-nho.png' WHERE name = 'Bạn Nhỏ' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-thay-giao.png' WHERE name = 'Thầy Giáo' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-con-trau-vang.png' WHERE name = 'Con Trâu Vàng' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-rong-con.png' WHERE name = 'Rồng Con' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-ga-trong-lua.png' WHERE name = 'Gà Trống Lửa' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-meo-tam-the.png' WHERE name = 'Mèo Tam Thể' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-ca-chep-vang.png' WHERE name = 'Cá Chép Vàng' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-sao-la.png' WHERE name = 'Sao La' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-voi-con.png' WHERE name = 'Voi Con' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-gau-truc-do.png' WHERE name = 'Gấu Trúc' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-khi-vang.png' WHERE name = 'Khỉ Vàng' AND category = 'character';
UPDATE album_items SET image_file = '/uploads/album/characters/character-chim-lac.png' WHERE name = 'Chim Lạc' AND category = 'character';

-- Accessories (20 items)
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-non-la.png' WHERE name = 'Nón Lá' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-quat-mo.png' WHERE name = 'Quạt Mo' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-khan-ran.png' WHERE name = 'Khăn Rằn' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-ao-dai.png' WHERE name = 'Áo Dài' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-non-coi.png' WHERE name = 'Nón Cối' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-kinh-mat.png' WHERE name = 'Kính Mát' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-tui-xach.png' WHERE name = 'Túi Xách' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-vong-co.png' WHERE name = 'Vòng Cổ' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-vong-tay.png' WHERE name = 'Vòng Tay' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-cap-sach.png' WHERE name = 'Cặp Sách' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-mu-luoi-trai.png' WHERE name = 'Mũ Lưỡi Trai' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-khan-quang.png' WHERE name = 'Khăn Quàng' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-giay-dep.png' WHERE name = 'Giày Dép' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-o-du.png' WHERE name = 'Ô Dù' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-balo.png' WHERE name = 'Balo' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-mu-bao-hiem.png' WHERE name = 'Mũ Bảo Hiểm' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-gang-tay.png' WHERE name = 'Găng Tay' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-tat-chan.png' WHERE name = 'Tất Chân' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-kinh-deo-mat.png' WHERE name = 'Kính Đeo Mắt' AND category = 'accessory';
UPDATE album_items SET image_file = '/uploads/album/accessories/accessory-dong-ho.png' WHERE name = 'Đồng Hồ' AND category = 'accessory';

-- Frames (20 items)
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-cua-so.png' WHERE name = 'Khung Cửa Sổ' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-lang-que.png' WHERE name = 'Khung Làng Quê' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-pho-co.png' WHERE name = 'Khung Phố Cổ' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-bien.png' WHERE name = 'Khung Biển' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-nui.png' WHERE name = 'Khung Núi' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-dong-lua.png' WHERE name = 'Khung Đồng Lúa' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-cau.png' WHERE name = 'Khung Cầu' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-chua.png' WHERE name = 'Khung Chùa' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-nha.png' WHERE name = 'Khung Nhà' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-truong-hoc.png' WHERE name = 'Khung Trường Học' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-cong-vien.png' WHERE name = 'Khung Công Viên' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-song.png' WHERE name = 'Khung Sông' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-rung.png' WHERE name = 'Khung Rừng' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-thanh-pho.png' WHERE name = 'Khung Thành Phố' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-cho.png' WHERE name = 'Khung Chợ' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-vuon.png' WHERE name = 'Khung Vườn' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-hoang-hon.png' WHERE name = 'Khung Hoàng Hôn' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-binh-minh.png' WHERE name = 'Khung Bình Minh' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-trang.png' WHERE name = 'Khung Trăng' AND category = 'frame';
UPDATE album_items SET image_file = '/uploads/album/frames/frame-khung-sao.png' WHERE name = 'Khung Sao' AND category = 'frame';

-- Stickers (21 items)
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-den-long.png' WHERE name = 'Đèn Lồng' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-dieu-giay.png' WHERE name = 'Diều Giấy' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-mat-na.png' WHERE name = 'Mặt Nạ' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-trong.png' WHERE name = 'Trống' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-ken.png' WHERE name = 'Kèn' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-dan.png' WHERE name = 'Đàn' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-bong-bay.png' WHERE name = 'Bóng Bay' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-xe-dap.png' WHERE name = 'Xe Đạp' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-may-bay.png' WHERE name = 'Máy Bay' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-tau-thuy.png' WHERE name = 'Tàu Thủy' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-xe-hoi.png' WHERE name = 'Xe Hơi' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-bup-be.png' WHERE name = 'Búp Bê' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-gau-bong.png' WHERE name = 'Gấu Bông' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-xe-lua.png' WHERE name = 'Xe Lửa' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-banh-chung.png' WHERE name = 'Bánh Chưng' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-banh-day.png' WHERE name = 'Bánh Dày' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-hoa-dao.png' WHERE name = 'Hoa Đào' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-hoa-mai.png' WHERE name = 'Hoa Mai' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-co-to-quoc.png' WHERE name = 'Cờ Tổ Quốc' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-sao-vang.png' WHERE name = 'Sao Vàng' AND category = 'sticker';
UPDATE album_items SET image_file = '/uploads/album/stickers/sticker-banh-xe.png' WHERE name = 'Bánh Xe' AND category = 'sticker';

-- Xac nhan ket qua
SELECT 
    category,
    COUNT(*) as total_items,
    COUNT(image_file) as items_with_image,
    COUNT(*) - COUNT(image_file) as items_without_image
FROM album_items
GROUP BY category
ORDER BY category;
