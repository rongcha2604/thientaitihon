#!/usr/bin/env python3
"""
Script để kiểm tra và validate tất cả questions trong data/questions
Tìm các lỗi:
1. correctAnswer không khớp với explanation
2. Tính toán sai trong explanation
3. correctAnswer index không trỏ đến đáp án đúng
"""

import json
import os
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple

# Pattern để extract số từ text
NUMBER_PATTERN = re.compile(r'\d+')

def extract_numbers(text: str) -> List[int]:
    """Extract tất cả số từ text"""
    return [int(match) for match in NUMBER_PATTERN.findall(text)]

def calculate_from_question(question: str) -> Tuple[str, float]:
    """
    Tìm phép tính trong câu hỏi và tính kết quả
    Returns: (operation, result)
    """
    # Pattern cho phép cộng: "46 + 33", "thêm 33", "cộng 33"
    add_patterns = [
        re.compile(r'(\d+)\s*\+\s*(\d+)'),  # 46 + 33
        re.compile(r'(\d+)\s+quả.*thêm\s+(\d+)'),  # 46 quả táo, thêm 33
        re.compile(r'(\d+).*cộng\s+(\d+)'),  # 46 cộng 33
    ]
    
    # Pattern cho phép trừ: "68 - 35", "bay đi 2", "trừ 2"
    sub_patterns = [
        re.compile(r'(\d+)\s*-\s*(\d+)'),  # 68 - 35
        re.compile(r'(\d+).*bay đi\s+(\d+)'),  # 5 con chim, bay đi 2
        re.compile(r'(\d+).*trừ\s+(\d+)'),  # 5 trừ 2
    ]
    
    # Pattern cho phép nhân: "5 x 3", "5 nhân 3"
    mul_patterns = [
        re.compile(r'(\d+)\s*[x×]\s*(\d+)'),  # 5 x 3
        re.compile(r'(\d+).*nhân\s+(\d+)'),  # 5 nhân 3
    ]
    
    # Pattern cho phép chia: "15 : 3", "15 chia 3"
    div_patterns = [
        re.compile(r'(\d+)\s*[:÷]\s*(\d+)'),  # 15 : 3
        re.compile(r'(\d+).*chia\s+(\d+)'),  # 15 chia 3
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

def extract_result_from_explanation(explanation: str) -> float:
    """Extract kết quả từ explanation (số sau dấu = đầu tiên thường là kết quả)"""
    # Tìm số sau dấu "=" đầu tiên (thường là kết quả)
    equals_match = re.search(r'=\s*(\d+)', explanation)
    if equals_match:
        return int(equals_match.group(1))
    
    # Fallback: Lấy số cuối cùng
    numbers = extract_numbers(explanation)
    if numbers:
        return numbers[-1]
    return None

def extract_result_from_options(options: List[str]) -> Dict[str, int]:
    """Extract số từ mỗi option và map với index"""
    result_map = {}
    for idx, option in enumerate(options):
        numbers = extract_numbers(option)
        if numbers:
            # Lấy số đầu tiên trong option
            result_map[option] = (idx, numbers[0])
    return result_map

def validate_question(q: Dict[str, Any], file_path: str, lesson_id: str) -> List[str]:
    """Validate một câu hỏi và trả về danh sách lỗi"""
    errors = []
    q_id = q.get('id', 'unknown')
    
    question_text = q.get('question', '')
    options = q.get('options', [])
    correct_answer_idx = q.get('correctAnswer')
    explanation = q.get('explanation', '')
    
    # Skip nếu không phải multiple-choice hoặc không có options
    if q.get('type') != 'multiple-choice' or not options:
        return errors
    
    # Check correctAnswer index hợp lệ
    if correct_answer_idx is None or correct_answer_idx < 0 or correct_answer_idx >= len(options):
        errors.append(f"  ❌ {q_id}: correctAnswer index {correct_answer_idx} không hợp lệ (phải từ 0 đến {len(options)-1})")
        return errors
    
    # Nếu là câu hỏi toán học (có số trong question)
    if NUMBER_PATTERN.search(question_text):
        # Skip các câu hỏi về thuật ngữ (có từ "được gọi là", "gọi là", "là gì" mà không có dấu ? ở cuối phép tính)
        is_term_question = re.search(r'(được gọi là|gọi là|là gì)\?', question_text, re.IGNORECASE)
        if is_term_question:
            # Đây là câu hỏi về thuật ngữ, không phải tính toán
            return errors
        
        # Tính toán từ question
        operation, calculated_result = calculate_from_question(question_text)
        
        if operation and calculated_result is not None:
            # Extract kết quả từ explanation
            explanation_result = extract_result_from_explanation(explanation)
            
            # Extract số từ options
            option_map = extract_result_from_options(options)
            
            # Check 1: Explanation có khớp với tính toán không?
            if explanation_result is not None:
                if abs(explanation_result - calculated_result) > 0.01:  # Cho phép sai số nhỏ
                    errors.append(f"  ❌ {q_id}: Explanation sai! Tính toán: {calculated_result}, Explanation: {explanation_result}")
            
            # Check 2: correctAnswer có trỏ đến đáp án đúng không?
            correct_option = options[correct_answer_idx]
            correct_option_number = extract_numbers(correct_option)
            
            if correct_option_number:
                correct_option_value = correct_option_number[0]
                if abs(correct_option_value - calculated_result) > 0.01:
                    # Tìm đáp án đúng trong options
                    correct_idx = None
                    for idx, opt in enumerate(options):
                        opt_numbers = extract_numbers(opt)
                        if opt_numbers and abs(opt_numbers[0] - calculated_result) < 0.01:
                            correct_idx = idx
                            break
                    
                    if correct_idx is not None:
                        errors.append(f"  ❌ {q_id}: correctAnswer SAI! Đang chọn index {correct_answer_idx} ('{correct_option}'), nhưng đáp án đúng là index {correct_idx} ('{options[correct_idx]}') - Kết quả: {calculated_result}")
                    else:
                        errors.append(f"  ❌ {q_id}: Không tìm thấy đáp án đúng ({calculated_result}) trong options!")
            
            # Check 3: Explanation có khớp với correctAnswer không?
            if explanation_result is not None and correct_option_number:
                if abs(explanation_result - correct_option_number[0]) > 0.01:
                    errors.append(f"  ❌ {q_id}: Explanation ({explanation_result}) không khớp với correctAnswer ('{correct_option}' = {correct_option_number[0]})")
    
    return errors

def validate_file(file_path: Path) -> List[str]:
    """Validate một file JSON và trả về danh sách lỗi"""
    errors = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        lessons = data.get('lessons', [])
        for lesson in lessons:
            lesson_id = lesson.get('id', 'unknown')
            questions = lesson.get('questions', [])
            
            for q in questions:
                q_errors = validate_question(q, str(file_path), lesson_id)
                if q_errors:
                    errors.extend(q_errors)
    
    except json.JSONDecodeError as e:
        errors.append(f"  ❌ JSON parse error: {e}")
    except Exception as e:
        errors.append(f"  ❌ Error reading file: {e}")
    
    return errors

def main():
    """Main function để scan tất cả files"""
    base_dir = Path('public/data/questions')
    
    if not base_dir.exists():
        print(f"❌ Không tìm thấy thư mục: {base_dir}")
        return
    
    print("🔍 Đang quét tất cả file questions...")
    print(f"📁 Thư mục: {base_dir}\n")
    
    all_errors = {}
    total_files = 0
    total_questions = 0
    
    # Scan tất cả file JSON (không scan backup folders)
    for json_file in base_dir.rglob('*.json'):
        # Skip backup folders
        if 'backup' in str(json_file):
            continue
        
        total_files += 1
        relative_path = json_file.relative_to(base_dir)
        
        errors = validate_file(json_file)
        if errors:
            all_errors[str(relative_path)] = errors
        
        # Count questions
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for lesson in data.get('lessons', []):
                    total_questions += len(lesson.get('questions', []))
        except:
            pass
    
    # Report
    print(f"📊 Thống kê:")
    print(f"  - Tổng số files: {total_files}")
    print(f"  - Tổng số câu hỏi: {total_questions}")
    print(f"  - Files có lỗi: {len(all_errors)}\n")
    
    if all_errors:
        print("❌ CÁC LỖI TÌM THẤY:\n")
        for file_path, errors in all_errors.items():
            print(f"📄 {file_path}:")
            for error in errors:
                print(error)
            print()
    else:
        print("✅ Không tìm thấy lỗi nào! Tất cả questions đều đúng.")
    
    # Return errors để có thể fix tự động
    return all_errors

if __name__ == '__main__':
    main()
