#!/usr/bin/env python3
"""
Script để tự động fix các lỗi trong questions:
1. Fix correctAnswer index nếu sai
2. Fix explanation nếu thiếu kết quả
"""

import json
import re
from pathlib import Path
from typing import Dict, Any, Tuple, Optional

NUMBER_PATTERN = re.compile(r'\d+')

def calculate_from_question(question: str) -> Tuple[Optional[str], Optional[float]]:
    """Tìm phép tính trong câu hỏi và tính kết quả"""
    # Pattern cho phép cộng
    add_patterns = [
        re.compile(r'(\d+)\s*\+\s*(\d+)'),  # 46 + 33
        re.compile(r'(\d+)\s+quả.*thêm\s+(\d+)'),  # 46 quả táo, thêm 33
        re.compile(r'(\d+).*cộng\s+(\d+)'),  # 46 cộng 33
        re.compile(r'Tính:\s*(\d+)\s*\+\s*(\d+)'),  # Tính: 27 + 15
    ]
    
    # Pattern cho phép trừ
    sub_patterns = [
        re.compile(r'(\d+)\s*-\s*(\d+)'),  # 68 - 35
        re.compile(r'(\d+).*bay đi\s+(\d+)'),  # 5 con chim, bay đi 2
        re.compile(r'(\d+).*trừ\s+(\d+)'),  # 5 trừ 2
        re.compile(r'Tính:\s*(\d+)\s*-\s*(\d+)'),  # Tính: 456 - 234
    ]
    
    # Pattern cho phép nhân
    mul_patterns = [
        re.compile(r'(\d+)\s*[x×]\s*(\d+)'),  # 5 x 3
        re.compile(r'(\d+).*nhân\s+(\d+)'),  # 5 nhân 3
        re.compile(r'Tính:\s*(\d+)\s*[x×]\s*(\d+)'),  # Tính: 5 x 3
    ]
    
    # Pattern cho phép chia
    div_patterns = [
        re.compile(r'(\d+)\s*[:÷]\s*(\d+)'),  # 15 : 3
        re.compile(r'(\d+).*chia\s+(\d+)'),  # 15 chia 3
        re.compile(r'Tính:\s*(\d+)\s*[:÷]\s*(\d+)'),  # Tính: 15 : 3
    ]
    
    # Check phép cộng
    for pattern in add_patterns:
        match = pattern.search(question)
        if match:
            a, b = int(match.group(1)), int(match.group(2))
            return ('+', a + b)
    
    # Check phép trừ
    for pattern in sub_patterns:
        match = pattern.search(question)
        if match:
            a, b = int(match.group(1)), int(match.group(2))
            return ('-', a - b)
    
    # Check phép nhân
    for pattern in mul_patterns:
        match = pattern.search(question)
        if match:
            a, b = int(match.group(1)), int(match.group(2))
            return ('x', a * b)
    
    # Check phép chia
    for pattern in div_patterns:
        match = pattern.search(question)
        if match:
            a, b = int(match.group(1)), int(match.group(2))
            if b != 0:
                return ('/', a / b)
    
    return (None, None)

def extract_number_from_text(text: str) -> Optional[int]:
    """Extract số đầu tiên từ text"""
    match = NUMBER_PATTERN.search(text)
    if match:
        return int(match.group(0))
    return None

def find_correct_option_index(options: list, target_value: float) -> Optional[int]:
    """Tìm index của option có số khớp với target_value"""
    for idx, option in enumerate(options):
        numbers = NUMBER_PATTERN.findall(option)
        if numbers:
            # Check số đầu tiên trong option
            option_value = int(numbers[0])
            if abs(option_value - target_value) < 0.01:
                return idx
    return None

def fix_question(q: Dict[str, Any]) -> Tuple[bool, str]:
    """Fix một câu hỏi và trả về (has_fix, fix_message)"""
    question_text = q.get('question', '')
    options = q.get('options', [])
    correct_answer_idx = q.get('correctAnswer')
    explanation = q.get('explanation', '')
    q_id = q.get('id', 'unknown')
    
    # Skip nếu không phải multiple-choice
    if q.get('type') != 'multiple-choice' or not options:
        return (False, '')
    
    # Nếu là câu hỏi toán học
    if NUMBER_PATTERN.search(question_text):
        operation, calculated_result = calculate_from_question(question_text)
        
        if operation and calculated_result is not None:
            # Tìm đáp án đúng trong options
            correct_idx = find_correct_option_index(options, calculated_result)
            
            if correct_idx is None:
                return (False, f"  ⚠️  {q_id}: Không tìm thấy đáp án đúng ({calculated_result}) trong options")
            
            fixes = []
            
            # Fix correctAnswer nếu sai
            if correct_answer_idx != correct_idx:
                q['correctAnswer'] = correct_idx
                fixes.append(f"correctAnswer: {correct_answer_idx} → {correct_idx}")
            
            # Fix explanation nếu thiếu kết quả hoặc sai
            # Check xem explanation có chứa kết quả đúng không
            explanation_has_result = False
            if explanation:
                # Tìm số sau dấu "=" đầu tiên (thường là kết quả)
                equals_match = re.search(r'=\s*(\d+)', explanation)
                if equals_match:
                    explanation_result = int(equals_match.group(1))
                    if abs(explanation_result - calculated_result) < 0.01:
                        explanation_has_result = True
            
            # Nếu explanation không có kết quả đúng, update nó
            if not explanation_has_result:
                # Tạo explanation mới dựa trên operation
                if operation == '+':
                    a, b = re.search(r'(\d+)\s*\+\s*(\d+)', question_text)
                    if a and b:
                        new_explanation = f"{a.group(1)} + {a.group(2)} = {int(calculated_result)}."
                elif operation == '-':
                    a, b = re.search(r'(\d+)\s*-\s*(\d+)', question_text)
                    if a and b:
                        new_explanation = f"{a.group(1)} - {a.group(2)} = {int(calculated_result)}."
                else:
                    # Giữ nguyên explanation nếu không phải + hoặc -
                    new_explanation = explanation
                
                if new_explanation and new_explanation != explanation:
                    q['explanation'] = new_explanation
                    fixes.append(f"explanation updated")
            
            if fixes:
                return (True, f"  ✅ {q_id}: {'; '.join(fixes)}")
    
    return (False, '')

def fix_file(file_path: Path) -> Tuple[int, list]:
    """Fix một file và trả về (số câu đã fix, danh sách messages)"""
    fixes_count = 0
    messages = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        lessons = data.get('lessons', [])
        for lesson in lessons:
            questions = lesson.get('questions', [])
            
            for q in questions:
                has_fix, message = fix_question(q)
                if has_fix:
                    fixes_count += 1
                    if message:
                        messages.append(message)
        
        # Save file nếu có fix
        if fixes_count > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
    
    except Exception as e:
        messages.append(f"  ❌ Error: {e}")
    
    return (fixes_count, messages)

def main():
    """Main function"""
    base_dir = Path('public/data/questions')
    
    if not base_dir.exists():
        print(f"❌ Không tìm thấy thư mục: {base_dir}")
        return
    
    print("🔧 Đang fix tất cả questions...")
    print(f"📁 Thư mục: {base_dir}\n")
    
    total_fixes = 0
    files_fixed = 0
    
    # Scan tất cả file JSON (không scan backup folders)
    for json_file in base_dir.rglob('*.json'):
        # Skip backup folders
        if 'backup' in str(json_file):
            continue
        
        fixes_count, messages = fix_file(json_file)
        
        if fixes_count > 0:
            files_fixed += 1
            total_fixes += fixes_count
            relative_path = json_file.relative_to(base_dir)
            print(f"📄 {relative_path}:")
            for msg in messages:
                print(msg)
            print()
    
    print(f"✅ Hoàn thành!")
    print(f"  - Files đã fix: {files_fixed}")
    print(f"  - Tổng số câu đã fix: {total_fixes}")

if __name__ == '__main__':
    main()

