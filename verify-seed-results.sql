-- SQL Query: Verify Album Items đã được insert
-- Chạy các query này để kiểm tra kết quả

-- 1. Tổng số items
SELECT COUNT(*) as total_items FROM album_items;

-- 2. Số items theo category
SELECT 
    category,
    COUNT(*) as total
FROM album_items
GROUP BY category
ORDER BY category;

-- 3. Items mẫu (10 items đầu tiên)
SELECT 
    name,
    category,
    price,
    image_file,
    created_at
FROM album_items
ORDER BY category, name
LIMIT 10;

-- 4. Kiểm tra items có image_file chưa (sẽ NULL vì chưa chạy update script)
SELECT 
    COUNT(*) as items_with_image,
    COUNT(*) FILTER (WHERE image_file IS NULL) as items_without_image
FROM album_items;

