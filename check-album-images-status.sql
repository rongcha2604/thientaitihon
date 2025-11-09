-- SQL Query: Kiem tra trang thai image_file cua Album Items
-- Chay query nay de xem bao nhieu items da co image_file

-- Tong quan theo category
SELECT 
    category,
    COUNT(*) as total_items,
    COUNT(image_file) as items_with_image,
    COUNT(*) - COUNT(image_file) as items_without_image
FROM album_items
GROUP BY category
ORDER BY category;

-- Chi tiet items chua co image_file
SELECT 
    name,
    category,
    image_file
FROM album_items
WHERE image_file IS NULL
ORDER BY category, name;

-- Chi tiet items da co image_file (sample 10 items)
SELECT 
    name,
    category,
    image_file
FROM album_items
WHERE image_file IS NOT NULL
ORDER BY category, name
LIMIT 10;

