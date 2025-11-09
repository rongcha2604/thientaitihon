-- SQL Insert Script - Import Album Items
-- Chạy script này trong PostgreSQL để import vật phẩm

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Trạng Tí', 'character', '🧒', 20, 'Nhân vật Trạng Tí thông minh', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Thằng Bờm', 'character', '👦', 20, 'Nhân vật Thằng Bờm vui vẻ', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Chị Hằng', 'character', '👧', 25, 'Nhân vật Chị Hằng xinh đẹp', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Anh Cuội', 'character', '👨', 25, 'Nhân vật Anh Cuội trên cung trăng', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Bà Ngoại', 'character', '👵', 30, 'Bà Ngoại hiền từ', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Ông Ngoại', 'character', '👴', 30, 'Ông Ngoại thông thái', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Cô Giáo', 'character', '👩‍🏫', 25, 'Cô giáo dạy học', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Bác Sĩ', 'character', '👨‍⚕️', 25, 'Bác sĩ chữa bệnh', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Bạn Thân', 'character', '👫', 22, 'Đôi bạn thân', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Anh Trai', 'character', '👨‍🦱', 23, 'Anh trai lớn', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Chị Gái', 'character', '👩', 23, 'Chị gái xinh', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Em Bé', 'character', '👶', 20, 'Em bé dễ thương', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Bạn Học', 'character', '🧑‍🎓', 22, 'Bạn học cùng lớp', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Cô Bán Hàng', 'character', '👩‍💼', 24, 'Cô bán hàng rong', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Chú Công Nhân', 'character', '👷', 24, 'Chú công nhân chăm chỉ', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Bác Nông Dân', 'character', '🧑‍🌾', 26, 'Bác nông dân trồng lúa', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Cô Y Tá', 'character', '👩‍⚕️', 25, 'Cô y tá chăm sóc', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Chú Cảnh Sát', 'character', '👮', 27, 'Chú cảnh sát bảo vệ', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Bạn Nhỏ', 'character', '🧒', 21, 'Bạn nhỏ vui vẻ', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Thầy Giáo', 'character', '👨‍🏫', 28, 'Thầy giáo dạy học', 'coins',
  NULL, FALSE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Nón Lá', 'accessory', '👒', 15, 'Nón lá Việt Nam', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Quạt Mo', 'accessory', '🍃', 15, 'Quạt mo cọ', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khăn Rằn', 'accessory', '🧣', 20, 'Khăn rằn Nam Bộ', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Áo Dài', 'accessory', '👗', 25, 'Áo dài truyền thống', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Nón Cối', 'accessory', '🪖', 18, 'Nón cối bảo vệ', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Kính Mát', 'accessory', '🕶️', 16, 'Kính mát thời trang', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Túi Xách', 'accessory', '👜', 20, 'Túi xách đẹp', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Vòng Cổ', 'accessory', '📿', 17, 'Vòng cổ trang sức', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Vòng Tay', 'accessory', '📿', 16, 'Vòng tay đẹp', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Cặp Sách', 'accessory', '🎒', 22, 'Cặp sách học sinh', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Mũ Lưỡi Trai', 'accessory', '🧢', 15, 'Mũ lưỡi trai', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khăn Quàng', 'accessory', '🧣', 18, 'Khăn quàng đỏ', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Giày Dép', 'accessory', '👟', 19, 'Giày dép đi học', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Ô Dù', 'accessory', '☂️', 17, 'Ô dù che mưa', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Balo', 'accessory', '🎒', 21, 'Balo đi học', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Mũ Bảo Hiểm', 'accessory', '⛑️', 23, 'Mũ bảo hiểm an toàn', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Găng Tay', 'accessory', '🧤', 16, 'Găng tay ấm', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Tất Chân', 'accessory', '🧦', 14, 'Tất chân ấm', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Kính Đeo Mắt', 'accessory', '👓', 18, 'Kính đeo mắt', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Đồng Hồ', 'accessory', '⌚', 24, 'Đồng hồ xem giờ', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Cửa Sổ', 'frame', '🖼️', 10, 'Khung cửa sổ đẹp', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Làng Quê', 'frame', '🏞️', 15, 'Khung cảnh làng quê', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Phố Cổ', 'frame', '🏛️', 20, 'Khung cảnh phố cổ', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Biển', 'frame', '🌊', 18, 'Khung cảnh biển', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Núi', 'frame', '⛰️', 17, 'Khung cảnh núi', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Đồng Lúa', 'frame', '🌾', 16, 'Khung cảnh đồng lúa', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Cầu', 'frame', '🌉', 19, 'Khung cảnh cầu', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Chùa', 'frame', '⛩️', 20, 'Khung cảnh chùa', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Nhà', 'frame', '🏠', 12, 'Khung cảnh nhà', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Trường Học', 'frame', '🏫', 14, 'Khung cảnh trường học', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Công Viên', 'frame', '🌳', 13, 'Khung cảnh công viên', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Sông', 'frame', '🌊', 15, 'Khung cảnh sông', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Rừng', 'frame', '🌲', 16, 'Khung cảnh rừng', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Thành Phố', 'frame', '🏙️', 18, 'Khung cảnh thành phố', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Chợ', 'frame', '🏪', 17, 'Khung cảnh chợ', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Vườn', 'frame', '🌻', 14, 'Khung cảnh vườn', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Hoàng Hôn', 'frame', '🌅', 19, 'Khung cảnh hoàng hôn', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Bình Minh', 'frame', '🌄', 19, 'Khung cảnh bình minh', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Trăng', 'frame', '🌙', 20, 'Khung cảnh trăng', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Khung Sao', 'frame', '⭐', 18, 'Khung cảnh sao', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Đèn Lồng', 'sticker', '🏮', 5, 'Đèn lồng đỏ', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Diều Giấy', 'sticker', '🪁', 10, 'Diều giấy bay', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Mặt Nạ', 'sticker', '🎭', 10, 'Mặt nạ vui', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Trống', 'sticker', '🥁', 15, 'Trống đánh', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Kèn', 'sticker', '🎺', 12, 'Kèn thổi', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Đàn', 'sticker', '🎸', 14, 'Đàn ghi-ta', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Bóng Bay', 'sticker', '🎈', 6, 'Bóng bay đẹp', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Xe Đạp', 'sticker', '🚲', 13, 'Xe đạp đi chơi', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Máy Bay', 'sticker', '✈️', 15, 'Máy bay bay', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Tàu Thủy', 'sticker', '🚢', 14, 'Tàu thủy', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Xe Hơi', 'sticker', '🚗', 12, 'Xe hơi đẹp', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Búp Bê', 'sticker', '🎎', 11, 'Búp bê dễ thương', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Gấu Bông', 'sticker', '🧸', 13, 'Gấu bông mềm', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Xe Lửa', 'sticker', '🚂', 14, 'Xe lửa chạy', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Bánh Chưng', 'sticker', '🍙', 8, 'Bánh chưng Tết', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Bánh Dày', 'sticker', '🍘', 8, 'Bánh dày', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Hoa Đào', 'sticker', '🌸', 7, 'Hoa đào Tết', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Hoa Mai', 'sticker', '🌺', 7, 'Hoa mai vàng', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Cờ Tổ Quốc', 'sticker', '🇻🇳', 10, 'Cờ Tổ quốc', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Sao Vàng', 'sticker', '⭐', 9, 'Sao vàng năm cánh', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

INSERT INTO album_items (
  id, name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Bánh Xe', 'sticker', '🎡', 12, 'Bánh xe quay', 'coins',
  NULL, TRUE, NULL, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

