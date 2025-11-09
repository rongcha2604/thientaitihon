#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tìm tất cả câu hỏi toán dạng "Có X cái Y. Số nào tương ứng?"
và tạo prompts để generate ảnh
"""

import json
import os
from pathlib import Path
from typing import List, Dict, Tuple

def find_quantity_matching_questions(data_dir: str = "src/data/questions") -> List[Dict]:
    """
    Tìm tất cả câu hỏi toán dạng matching số lượng với số
    """
    questions = []
    base_path = Path(data_dir)
    
    # Tìm tất cả file math JSON
    math_files = list(base_path.rglob("**/math/*.json"))
    
    print(f"Dang tim trong {len(math_files)} file math...")
    
    for file_path in math_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Lấy thông tin file
            book_series = data.get('bookSeries', '')
            grade = data.get('grade', '')
            week = data.get('week', '')
            
            # Duyệt qua tất cả lessons và questions
            for lesson in data.get('lessons', []):
                for q in lesson.get('questions', []):
                    question_text = q.get('question', '').lower()
                    
                    # Tìm TẤT CẢ câu hỏi về số lượng có thể minh họa bằng ảnh:
                    # - "Có X cái Y. Số nào tương ứng?"
                    # - "Có X cái Y, thêm Z cái nữa"
                    # - "Có X con Y, bay đi Z con"
                    # - "Có X quả Y" (bất kỳ câu hỏi nào về số lượng)
                    
                    has_quantity = any(keyword in question_text for keyword in [
                        'có', 'có bao nhiêu'
                    ])
                    
                    has_object = any(keyword in question_text for keyword in [
                        'cái', 'con', 'quả', 'chiếc', 'bông', 'cây', 'quyển', 'bánh', 'kẹo', 
                        'táo', 'cam', 'gà', 'chim', 'bút', 'thước', 'bánh', 'kẹo'
                    ])
                    
                    # Tìm số lượng trong câu hỏi
                    import re
                    numbers_in_question = re.findall(r'\d+', q.get('question', ''))
                    
                    # Nếu có số lượng và đối tượng → Có thể minh họa bằng ảnh
                    if has_quantity and has_object and len(numbers_in_question) > 0:
                        
                        # Extract số lượng từ câu hỏi (số đầu tiên thường là số lượng chính)
                        quantity = numbers_in_question[0] if numbers_in_question else None
                        
                        # Extract object từ câu hỏi
                        object_match = re.search(r'có\s+\d+\s+(cái|con|quả|chiếc|bông|cây|quyển)\s+(\w+)', question_text)
                        object_name = object_match.group(2) if object_match else None
                        
                        # Detect câu hỏi dạng "thêm...nữa" hoặc "cho thêm" hoặc "mua thêm"
                        has_addition = any(keyword in question_text for keyword in [
                            'thêm', 'cho thêm', 'mua thêm', 'mua thêm'
                        ])
                        
                        # Extract số lượng thứ 2 nếu có (số lượng thêm vào)
                        quantity_added = None
                        if has_addition and len(numbers_in_question) >= 2:
                            # Tìm số lượng sau từ "thêm" hoặc "cho thêm" (có thể có "cái/con/quả" ở giữa)
                            # Pattern: "cho thêm 4 cái" hoặc "thêm 2 quả nữa" hoặc "mua thêm 2 cái"
                            # Thử nhiều patterns
                            patterns = [
                                r'(cho thêm|mua thêm)\s+(\d+)\s*(cái|con|quả|chiếc)',  # "cho thêm 4 cái"
                                r'thêm\s+(\d+)\s*(quả|con|cái)\s+nữa',  # "thêm 2 quả nữa"
                                r'thêm\s+(\d+)',  # "thêm 2" (fallback)
                            ]
                            
                            for pattern in patterns:
                                addition_match = re.search(pattern, question_text)
                                if addition_match:
                                    # Lấy số từ group 2 hoặc group 1 tùy pattern
                                    candidate = addition_match.group(2) if len(addition_match.groups()) >= 2 else addition_match.group(1)
                                    # Verify là số
                                    if candidate and candidate.isdigit():
                                        quantity_added = candidate
                                        break
                            
                            # Fallback cuối cùng: lấy số thứ 2 (số sau số đầu tiên)
                            if not quantity_added and len(numbers_in_question) >= 2:
                                quantity_added = numbers_in_question[1]
                        
                        # Lấy options
                        options = q.get('options', [])
                        
                        questions.append({
                            'file': str(file_path),
                            'bookSeries': book_series,
                            'grade': grade,
                            'week': week,
                            'lessonId': lesson.get('id', ''),
                            'questionId': q.get('id', ''),
                            'question': q.get('question', ''),
                            'options': options,
                            'correctAnswer': q.get('correctAnswer', 0),
                            'quantity': quantity,
                            'quantityAdded': quantity_added,  # Số lượng thêm vào (nếu có)
                            'hasAddition': has_addition,  # Có phải câu hỏi "thêm...nữa" không
                            'object': object_name,
                            'imageUrl': q.get('imageUrl')
                        })
        
        except Exception as e:
            print(f"Loi doc file {file_path}: {e}")
            continue
    
    return questions

def generate_image_prompts(questions: List[Dict]) -> List[Dict]:
    """
    Tạo prompts để generate ảnh cho các câu hỏi
    """
    prompts = []
    
    # Mapping object names to simple English descriptions
    object_descriptions = {
        'kẹo': 'colorful candies',
        'bánh': 'colorful cakes',
        'táo': 'red apples',
        'cam': 'orange oranges',
        'gà': 'yellow or brown chickens',
        'chim': 'colorful birds',
        'bút': 'colorful pens',
        'thước': 'colorful rulers',
        'hoa': 'colorful flowers'
    }
    
    for q in questions:
        question = q['question']
        quantity = q['quantity']
        quantity_added = q.get('quantityAdded')
        has_addition = q.get('hasAddition', False)
        object_name = q.get('object', 'vật')
        correct_answer = q['options'][q['correctAnswer']] if q['options'] else None
        
        # Tạo filename
        filename = f"math-question-{q['bookSeries']}-grade{q['grade']}-week{q['week']}-{q['questionId']}.png"
        
        # Lấy mô tả object (tiếng Anh đơn giản)
        object_desc = object_descriptions.get(object_name, f'{object_name}')
        
        # Tạo prompt đơn giản, rõ ràng, chính xác
        if has_addition and quantity_added:
            # Câu hỏi dạng "thêm...nữa" → Hiển thị 2 nhóm tách biệt rõ ràng
            total = int(quantity) + int(quantity_added)
            prompt = f"""Exactly {quantity} {object_desc} on the left, exactly {quantity_added} {object_desc} on the right, separated by space. Total {total} {object_desc}. Pixar 3D style, bright colors, white background, 512x512."""
        else:
            # Câu hỏi thông thường → Hiển thị số lượng chính xác
            prompt = f"""Exactly {quantity} {object_desc}, arranged in rows, easy to count. Pixar 3D style, bright colors, white background, 512x512."""
        
        prompts.append({
            'questionId': q['questionId'],
            'file': q['file'],
            'question': question,
            'quantity': quantity,
            'quantityAdded': quantity_added,
            'hasAddition': has_addition,
            'object': object_name,
            'correctAnswer': correct_answer,
            'filename': filename,
            'prompt': prompt
        })
    
    return prompts

def main():
    import sys
    import io
    # Set UTF-8 encoding for output
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    print("Dang tim cau hoi toan dang matching so luong...")
    print("=" * 60)
    
    # Tìm questions
    questions = find_quantity_matching_questions()
    
    print(f"\nTim thay {len(questions)} cau hoi tuong tu!")
    print("\nDanh sach cau hoi:")
    print("=" * 60)
    
    for i, q in enumerate(questions[:10], 1):  # Show first 10
        print(f"\n{i}. {q['question'][:80]}...")
        print(f"   File: {q['file']}")
        print(f"   Quantity: {q['quantity']}, Object: {q.get('object', 'N/A')}")
    
    if len(questions) > 10:
        print(f"\n... va {len(questions) - 10} cau hoi khac")
    
    # Generate prompts
    print("\nDang tao prompts...")
    prompts = generate_image_prompts(questions)
    
    # Save to file
    output_file = "math-question-image-prompts.md"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Prompts Tao Anh Cho Cau Hoi Toan - Matching So Luong\n\n")
        f.write(f"Tong so: {len(prompts)} cau hoi\n\n")
        f.write("---\n\n")
        
        for i, p in enumerate(prompts, 1):
            f.write(f"## Cau hoi {i}\n\n")
            f.write(f"**Cau hoi:** {p['question']}\n\n")
            f.write(f"**Ten file:** `{p['filename']}`\n\n")
            f.write(f"**Prompt:**\n```\n{p['prompt']}\n```\n\n")
            f.write("---\n\n")
    
    print(f"Da tao file: {output_file}")
    print(f"Tong so prompts: {len(prompts)}")

if __name__ == "__main__":
    main()

