#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để update imageUrl cho các câu hỏi toán học đã có ảnh
Chạy: python scripts/update_math_question_images.py
"""

import json
import os
from pathlib import Path
import sys
import io

# Set UTF-8 encoding for output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def update_image_urls(prompts_file: str = "math-question-image-prompts.md", 
                      images_dir: str = "public/data/questions/images/math",
                      data_dir: str = "src/data/questions"):
    """
    Update imageUrl trong JSON files dựa trên prompts file và ảnh đã có
    """
    # Đọc prompts file để lấy mapping questionId -> filename
    question_to_filename = {}
    
    if not os.path.exists(prompts_file):
        print(f"❌ Không tìm thấy file: {prompts_file}")
        return
    
    print(f"📖 Đang đọc prompts file: {prompts_file}")
    with open(prompts_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse prompts file để lấy questionId và filename
    import re
    
    # Tìm tất cả "**Ten file:** `filename.png`"
    file_matches = re.findall(r'\*\*Ten file:\*\* `([^`]+)`', content)
    
    print(f"🔍 Tìm thấy {len(file_matches)} filenames trong prompts file")
    
    # Extract questionId từ filename
    for filename in file_matches:
        # Format: math-question-ket-noi-tri-thuc-grade1-week1-q1.png
        # Hoặc: math-question-ket-noi-tri-thuc-grade1-week13-q1.png
        name_without_ext = filename.replace('.png', '')
        
        # Parse bằng regex để extract các phần
        # Pattern: math-question-{bookSeries}-grade{grade}-week{week}-{questionId}
        match = re.match(r'math-question-(.+?)-grade(\d+)-week(\d+)-(.+)', name_without_ext)
        
        if match:
            book_series = match.group(1)  # ket-noi-tri-thuc
            grade = match.group(2)  # 1
            week = match.group(3)  # 1 hoặc 13
            question_id = match.group(4)  # q1
            
            key = f"{book_series}-grade{grade}-week{week}-{question_id}"
            question_to_filename[key] = filename
            print(f"   📝 {key} → {filename}")
    
    print(f"✅ Tìm thấy {len(question_to_filename)} prompts")
    
    # Kiểm tra ảnh đã có
    if not os.path.exists(images_dir):
        print(f"⚠️  Thư mục ảnh chưa tồn tại: {images_dir}")
        print(f"📁 Tạo thư mục...")
        os.makedirs(images_dir, exist_ok=True)
    
    # List ảnh đã có
    image_files = {}
    if os.path.exists(images_dir):
        for img_file in os.listdir(images_dir):
            if img_file.endswith('.png'):
                image_files[img_file] = os.path.join(images_dir, img_file)
    
    print(f"📸 Tìm thấy {len(image_files)} ảnh trong {images_dir}")
    
    # Update JSON files
    updated_count = 0
    not_found_count = 0
    
    # Tìm tất cả JSON files
    base_path = Path(data_dir)
    json_files = list(base_path.rglob("**/math/*.json"))
    
    print(f"\n📂 Tìm thấy {len(json_files)} file JSON math")
    print("=" * 60)
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Extract bookSeries, grade, week từ path
            parts = json_file.parts
            book_series_idx = parts.index('ket-noi-tri-thuc') if 'ket-noi-tri-thuc' in parts else -1
            if book_series_idx == -1:
                continue
            
            book_series = parts[book_series_idx]
            grade = parts[parts.index('grade-1')] if 'grade-1' in parts else None
            week = data.get('week')
            
            if not week:
                continue
            
            # Update questions
            lessons = data.get('lessons', [])
            file_updated = False
            
            for lesson in lessons:
                questions = lesson.get('questions', [])
                
                for q in questions:
                    question_id = q.get('id', '')
                    key = f"{book_series}-grade1-week{week}-{question_id}"
                    
                    # Tìm filename từ prompts
                    filename = question_to_filename.get(key)
                    
                    if filename:
                        # Kiểm tra ảnh có tồn tại không
                        if filename in image_files:
                            # Tạo imageUrl path (relative từ public/)
                            # Format: /data/questions/images/math/filename.png
                            image_url = f"/data/questions/images/math/{filename}"
                            
                            # Chỉ update nếu chưa có imageUrl hoặc imageUrl khác
                            if q.get('imageUrl') != image_url:
                                q['imageUrl'] = image_url
                                file_updated = True
                                updated_count += 1
                                print(f"✅ Updated: {book_series}/grade-1/math/week-{week}.json - {question_id}")
                        else:
                            not_found_count += 1
                            print(f"⚠️  Ảnh chưa có: {filename} (cần tạo ảnh này)")
            
            # Ghi lại file nếu có thay đổi
            if file_updated:
                with open(json_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print(f"💾 Đã lưu: {json_file.name}")
        
        except Exception as e:
            print(f"❌ Lỗi khi xử lý {json_file}: {e}")
            continue
    
    print("\n" + "=" * 60)
    print(f"✅ Hoàn thành!")
    print(f"   - Đã update: {updated_count} câu hỏi")
    print(f"   - Ảnh chưa có: {not_found_count} ảnh")
    print(f"\n📋 Bước tiếp theo:")
    print(f"   1. Copy ảnh vào: {images_dir}")
    print(f"   2. Chạy: .\\copy-data-to-public.ps1")
    print(f"   3. Build APK: .\\build-apk.ps1")

if __name__ == "__main__":
    print("🖼️  Update Image URLs cho Math Questions")
    print("=" * 60)
    
    # Cho phép override paths
    prompts_file = sys.argv[1] if len(sys.argv) > 1 else "math-question-image-prompts.md"
    images_dir = sys.argv[2] if len(sys.argv) > 2 else "public/data/questions/images/math"
    data_dir = sys.argv[3] if len(sys.argv) > 3 else "src/data/questions"
    
    update_image_urls(prompts_file, images_dir, data_dir)

