#!/usr/bin/env python3
"""
Script để kiểm tra và validate tất cả Vietnamese questions
Tìm các lỗi:
1. Options giống nhau hoàn toàn
2. Câu hỏi về chính tả nhưng options không có sự khác biệt
3. correctAnswer không hợp lý
4. Logic không đúng (ví dụ: "viết đúng" nhưng tất cả options giống nhau)
"""

import json
import os
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple

def find_vietnamese_files(base_path: str = "public/data/questions") -> List[str]:
    """Tìm tất cả file Vietnamese questions"""
    files = []
    for root, dirs, filenames in os.walk(base_path):
        if 'vietnamese' in root:
            for filename in filenames:
                if filename.endswith('.json') and not filename.startswith('.'):
                    files.append(os.path.join(root, filename))
    return sorted(files)

def check_duplicate_options(options: List[str]) -> bool:
    """Kiểm tra xem có options nào giống nhau không"""
    # Normalize: lowercase, trim spaces
    normalized = [opt.lower().strip() for opt in options]
    unique = set(normalized)
    return len(unique) < len(options)

def check_spelling_question_logic(question: Dict[str, Any]) -> Tuple[bool, str]:
    """
    Kiểm tra logic của câu hỏi về chính tả
    Returns: (is_valid, error_message)
    """
    question_text = question.get('question', '').lower()
    options = question.get('options', [])
    correct_answer_idx = question.get('correctAnswer', -1)
    
    # Kiểm tra câu hỏi về chính tả
    is_spelling_question = (
        'chính tả' in question_text or
        'viết đúng' in question_text or
        'viết sai' in question_text or
        'đúng chính tả' in question_text or
        'sai chính tả' in question_text
    )
    
    if not is_spelling_question:
        return (True, "")  # Không phải câu hỏi chính tả, skip
    
    # Kiểm tra options có giống nhau không
    if check_duplicate_options(options):
        return (False, f"Tất cả options giống nhau: {options}")
    
    # Kiểm tra nếu là "viết đúng" thì phải có ít nhất 1 option đúng
    if 'viết đúng' in question_text or 'đúng chính tả' in question_text:
        # Tất cả options phải khác nhau
        if len(set(options)) < len(options):
            return (False, f"Câu hỏi 'viết đúng' nhưng có options giống nhau: {options}")
        
        # correctAnswer phải hợp lệ
        if correct_answer_idx < 0 or correct_answer_idx >= len(options):
            return (False, f"correctAnswer index không hợp lệ: {correct_answer_idx}")
    
    # Kiểm tra nếu là "viết sai" thì phải có ít nhất 1 option sai
    if 'viết sai' in question_text or 'sai chính tả' in question_text:
        # Tất cả options phải khác nhau
        if len(set(options)) < len(options):
            return (False, f"Câu hỏi 'viết sai' nhưng có options giống nhau: {options}")
        
        # correctAnswer phải hợp lệ
        if correct_answer_idx < 0 or correct_answer_idx >= len(options):
            return (False, f"correctAnswer index không hợp lệ: {correct_answer_idx}")
    
    return (True, "")

def validate_question(question: Dict[str, Any], file_path: str, lesson_id: str) -> List[Dict[str, Any]]:
    """Validate một câu hỏi và trả về danh sách lỗi"""
    errors = []
    q_id = question.get('id', 'unknown')
    
    # Kiểm tra cấu trúc cơ bản
    if 'question' not in question:
        errors.append({
            'file': file_path,
            'lesson': lesson_id,
            'question_id': q_id,
            'error': 'Thiếu field "question"',
            'type': 'missing_field'
        })
        return errors
    
    if 'options' not in question:
        errors.append({
            'file': file_path,
            'lesson': lesson_id,
            'question_id': q_id,
            'error': 'Thiếu field "options"',
            'type': 'missing_field'
        })
        return errors
    
    options = question.get('options', [])
    correct_answer_idx = question.get('correctAnswer', -1)
    
    # Kiểm tra options có đủ 4 options không
    if len(options) != 4:
        errors.append({
            'file': file_path,
            'lesson': lesson_id,
            'question_id': q_id,
            'error': f'Options không đủ 4 (có {len(options)} options)',
            'type': 'invalid_options_count'
        })
    
    # Kiểm tra options có giống nhau không
    if check_duplicate_options(options):
        errors.append({
            'file': file_path,
            'lesson': lesson_id,
            'question_id': q_id,
            'error': f'Options giống nhau: {options}',
            'type': 'duplicate_options',
            'question': question.get('question', ''),
            'options': options
        })
    
    # Kiểm tra correctAnswer index
    if correct_answer_idx < 0 or correct_answer_idx >= len(options):
        errors.append({
            'file': file_path,
            'lesson': lesson_id,
            'question_id': q_id,
            'error': f'correctAnswer index không hợp lệ: {correct_answer_idx} (phải từ 0 đến {len(options)-1})',
            'type': 'invalid_correct_answer'
        })
    
    # Kiểm tra logic câu hỏi chính tả
    is_valid, error_msg = check_spelling_question_logic(question)
    if not is_valid:
        errors.append({
            'file': file_path,
            'lesson': lesson_id,
            'question_id': q_id,
            'error': error_msg,
            'type': 'spelling_logic_error',
            'question': question.get('question', ''),
            'options': options,
            'correctAnswer': correct_answer_idx
        })
    
    return errors

def validate_file(file_path: str) -> List[Dict[str, Any]]:
    """Validate một file JSON"""
    errors = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        lessons = data.get('lessons', [])
        for lesson in lessons:
            lesson_id = lesson.get('id', 'unknown')
            questions = lesson.get('questions', [])
            
            for question in questions:
                question_errors = validate_question(question, file_path, lesson_id)
                errors.extend(question_errors)
    
    except json.JSONDecodeError as e:
        errors.append({
            'file': file_path,
            'error': f'JSON syntax error: {str(e)}',
            'type': 'json_error'
        })
    except Exception as e:
        errors.append({
            'file': file_path,
            'error': f'Error reading file: {str(e)}',
            'type': 'file_error'
        })
    
    return errors

def main():
    """Main function"""
    print("🔍 Đang tìm tất cả file Vietnamese questions...")
    files = find_vietnamese_files()
    print(f"📁 Tìm thấy {len(files)} files\n")
    
    all_errors = []
    files_with_errors = set()
    
    for file_path in files:
        errors = validate_file(file_path)
        if errors:
            all_errors.extend(errors)
            files_with_errors.add(file_path)
    
    # Tổng hợp kết quả
    print("=" * 80)
    print("📊 KẾT QUẢ KIỂM TRA")
    print("=" * 80)
    print(f"📁 Tổng số files: {len(files)}")
    print(f"❌ Files có lỗi: {len(files_with_errors)}")
    print(f"🔢 Tổng số lỗi: {len(all_errors)}\n")
    
    # Phân loại lỗi
    error_types = {}
    for error in all_errors:
        error_type = error.get('type', 'unknown')
        error_types[error_type] = error_types.get(error_type, 0) + 1
    
    print("📋 Phân loại lỗi:")
    for error_type, count in sorted(error_types.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {error_type}: {count} lỗi")
    print()
    
    # Hiển thị chi tiết lỗi
    if all_errors:
        print("=" * 80)
        print("❌ CHI TIẾT LỖI")
        print("=" * 80)
        
        # Group by file
        errors_by_file = {}
        for error in all_errors:
            file_path = error.get('file', 'unknown')
            if file_path not in errors_by_file:
                errors_by_file[file_path] = []
            errors_by_file[file_path].append(error)
        
        for file_path, file_errors in sorted(errors_by_file.items()):
            print(f"\n📄 {file_path} ({len(file_errors)} lỗi):")
            for error in file_errors:
                q_id = error.get('question_id', 'unknown')
                error_msg = error.get('error', 'Unknown error')
                print(f"  - {q_id}: {error_msg}")
                if 'question' in error:
                    print(f"    Câu hỏi: {error['question']}")
                if 'options' in error:
                    print(f"    Options: {error['options']}")
                if 'correctAnswer' in error:
                    print(f"    correctAnswer: {error['correctAnswer']}")
    
    # Tóm tắt
    print("\n" + "=" * 80)
    if all_errors:
        print(f"⚠️  Tìm thấy {len(all_errors)} lỗi trong {len(files_with_errors)} files")
        print("💡 Chạy script fix_vietnamese_questions.py để tự động sửa các lỗi")
    else:
        print("✅ Không tìm thấy lỗi nào!")
    print("=" * 80)

if __name__ == '__main__':
    main()

