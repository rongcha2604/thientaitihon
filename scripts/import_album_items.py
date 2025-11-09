#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script import vật phẩm album từ JSON vào database
Sử dụng Prisma hoặc direct SQL
"""

import json
import sys
import codecs
from pathlib import Path

# Fix encoding cho Windows console
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Thêm đường dẫn vào sys.path để import từ backend
sys.path.insert(0, str(Path(__file__).parent.parent / 'backend' / 'src'))

def load_album_items(json_path: str):
    """Load danh sách vật phẩm từ JSON file"""
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data.get('items', [])

def generate_prisma_seed_script(items: list, output_path: str):
    """Generate Prisma seed script để import vật phẩm"""
    script = """// Prisma Seed Script - Import Album Items
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const albumItems = [
"""
    
    for item in items:
        # Convert emoji và các field
        image = item.get('image', '📦')
        unlock_condition = item.get('unlockCondition')
        unlock_condition_str = 'null'
        if unlock_condition:
            unlock_condition_str = json.dumps(unlock_condition, ensure_ascii=False)
        
        script += f"""  {{
    name: "{item['name']}",
    category: "{item['category']}",
    image: "{image}",
    price: {item['price']},
    description: "{item.get('description', '')}",
    unlockType: "{item.get('unlockType', 'coins')}",
    unlockCondition: {unlock_condition_str},
    downloadable: {str(item.get('downloadable', False)).lower()},
    imageFile: {f'"{item.get("imageFile")}"' if item.get('imageFile') else 'null'},
    downloadFile: {f'"{item.get("downloadFile")}"' if item.get('downloadFile') else 'null'},
    isActive: true,
  }},
"""
    
    script += """];

async function main() {
  console.log('🌱 Seeding album items...');
  
  for (const item of albumItems) {
    await prisma.albumItem.upsert({
      where: { 
        // Use name + category as unique identifier
        id: '', // Will be created if not exists
      },
      update: item,
      create: item,
    });
  }
  
  console.log(`✅ Seeded ${albumItems.length} album items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(script)
    
    print(f"✅ Đã tạo Prisma seed script: {output_path}")

def generate_sql_insert_script(items: list, output_path: str):
    """Generate SQL INSERT script"""
    sql = """-- SQL Insert Script - Import Album Items
-- Chạy script này trong PostgreSQL để import vật phẩm

"""
    
    for item in items:
        name = item['name'].replace("'", "''")
        category = item['category']
        image = item.get('image', '📦').replace("'", "''")
        price = item['price']
        description = item.get('description', '').replace("'", "''")
        unlock_type = item.get('unlockType', 'coins')
        unlock_condition = item.get('unlockCondition')
        unlock_condition_json = 'NULL'
        if unlock_condition:
            unlock_condition_json = f"'{json.dumps(unlock_condition, ensure_ascii=False)}'::jsonb"
        downloadable = str(item.get('downloadable', False)).upper()
        image_file = item.get('imageFile') or 'NULL'
        if image_file and image_file != 'NULL':
            image_file = f"'{image_file}'"
        download_file = item.get('downloadFile') or 'NULL'
        if download_file and download_file != 'NULL':
            download_file = f"'{download_file}'"
        
        sql += f"""INSERT INTO album_items (
  name, category, image, price, description, unlock_type, 
  unlock_condition, downloadable, image_file, download_file, is_active
) VALUES (
  '{name}', '{category}', '{image}', {price}, '{description}', '{unlock_type}',
  {unlock_condition_json}, {downloadable}, {image_file}, {download_file}, true
) ON CONFLICT DO NOTHING;

"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(sql)
    
    print(f"✅ Đã tạo SQL insert script: {output_path}")

def main():
    # Đường dẫn file JSON
    json_path = Path(__file__).parent.parent / 'data' / 'album-items-template.json'
    
    if not json_path.exists():
        print(f"❌ Không tìm thấy file: {json_path}")
        sys.exit(1)
    
    # Load items
    items = load_album_items(str(json_path))
    print(f"📦 Đã load {len(items)} vật phẩm từ {json_path}")
    
    # Generate Prisma seed script
    prisma_seed_path = Path(__file__).parent.parent / 'backend' / 'prisma' / 'seed-album-items.ts'
    generate_prisma_seed_script(items, str(prisma_seed_path))
    
    # Generate SQL script
    sql_path = Path(__file__).parent.parent / 'backend' / 'prisma' / 'seed-album-items.sql'
    generate_sql_insert_script(items, str(sql_path))
    
    print("\n✅ Hoàn thành! Bạn có thể:")
    print("1. Chạy Prisma seed: npx prisma db seed (nếu đã config)")
    print("2. Chạy SQL script: psql -d your_database -f seed-album-items.sql")
    print("3. Hoặc import qua Admin Interface")

if __name__ == '__main__':
    main()

