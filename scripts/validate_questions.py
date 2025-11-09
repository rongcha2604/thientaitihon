#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script rà soát và sửa lỗi câu hỏi trong JSON files
Đảm bảo correctAnswer index khớp với đáp án đúng trong câu hỏi
"""

import json
import os
import sys
from pathlib import Path
import re

# Fix encoding cho Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def check_question_logic(question, question_id):
    """Kiểm tra logic câu hỏi và đáp án đúng"""
    issues = []
    
    q_text = question["question"]
    options = question["options"]
    correct_index = question["correctAnswer"]
    correct_answer = options[correct_index] if 0 <= correct_index < len(options) else None
    
    if correct_answer is None:
        issues.append(f"❌ Question {question_id}: correctAnswer index {correct_index} out of range (0-{len(options)-1})")
        return issues
    
    # Kiểm tra các pattern phổ biến trong câu hỏi tiếng Việt
    q_lower = q_text.lower()
    
    # Pattern 1: "Chữ cái nào sau đây là chữ 'X'?"
    match = re.search(r"chữ\s+(cái\s+)?nào\s+sau\s+đây\s+là\s+chữ\s+['\"](\w+)['\"]", q_text, re.IGNORECASE)
    if match:
        expected_char = match.group(2).lower()
        correct_lower = correct_answer.lower().strip()
        if expected_char not in correct_lower and correct_lower not in expected_char:
            # Kiểm tra xem có đáp án nào khớp không
            matching_index = None
            for i, opt in enumerate(options):
                if expected_char.lower() in opt.lower() or opt.lower() in expected_char.lower():
                    matching_index = i
                    break
            
            if matching_index is not None and matching_index != correct_index:
                issues.append(f"⚠️  Question {question_id}: Câu hỏi hỏi về chữ '{expected_char}' nhưng đáp án đúng là '{correct_answer}' (index {correct_index}), trong khi đáp án '{options[matching_index]}' (index {matching_index}) có vẻ đúng hơn")
    
    # Pattern 2: "Chữ cái 'X' trong tiếng Việt đọc là gì?"
    match = re.search(r"chữ\s+(cái\s+)?['\"](\w+)['\"]\s+trong\s+tiếng\s+việt\s+đọc\s+là\s+gì", q_text, re.IGNORECASE)
    if match:
        char = match.group(2).lower()
        # Đáp án đúng thường là cách đọc của chữ cái đó
        # Không có pattern cụ thể để check, nhưng có thể log để review
    
    # Pattern 3: "Từ nào có chữ 'X'?"
    match = re.search(r"từ\s+nào\s+có\s+chữ\s+['\"](\w+)['\"]", q_text, re.IGNORECASE)
    if match:
        expected_char = match.group(1).lower()
        # Kiểm tra xem đáp án đúng có chứa chữ cái đó không
        if expected_char not in correct_answer.lower():
            # Tìm đáp án có chứa chữ cái đó
            matching_index = None
            for i, opt in enumerate(options):
                if expected_char.lower() in opt.lower():
                    matching_index = i
                    break
            
            if matching_index is not None and matching_index != correct_index:
                issues.append(f"⚠️  Question {question_id}: Câu hỏi hỏi từ nào có chữ '{expected_char}' nhưng đáp án đúng là '{correct_answer}' (index {correct_index}), trong khi đáp án '{options[matching_index]}' (index {matching_index}) có vẻ đúng hơn")
    
    # Pattern 4: "Vần 'X' có mấy chữ cái?"
    match = re.search(r"vần\s+['\"](\w+)['\"]\s+có\s+mấy\s+chữ\s+cái", q_text, re.IGNORECASE)
    if match:
        vần = match.group(1)
        # Đếm số chữ cái trong vần
        char_count = len(vần.replace(" ", ""))
        # Tìm đáp án có số tương ứng
        matching_index = None
        for i, opt in enumerate(options):
            # Tìm số trong đáp án
            numbers = re.findall(r'\d+', opt)
            if numbers and int(numbers[0]) == char_count:
                matching_index = i
                break
        
        if matching_index is not None and matching_index != correct_index:
            issues.append(f"⚠️  Question {question_id}: Vần '{vần}' có {char_count} chữ cái nhưng đáp án đúng là '{correct_answer}' (index {correct_index}), trong khi đáp án '{options[matching_index]}' (index {matching_index}) có vẻ đúng hơn")
    
    return issues

def validate_week_file(file_path):
    """Validate một file week JSON"""
    issues_found = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        week = data.get("week", 0)
        lessons = data.get("lessons", [])
        
        for lesson in lessons:
            lesson_id = lesson.get("id", "unknown")
            questions = lesson.get("questions", [])
            
            for question in questions:
                q_id = question.get("id", "unknown")
                
                # Kiểm tra cơ bản
                if "options" not in question:
                    issues_found.append(f"❌ Week {week}, Question {q_id}: Missing 'options'")
                    continue
                
                if "correctAnswer" not in question:
                    issues_found.append(f"❌ Week {week}, Question {q_id}: Missing 'correctAnswer'")
                    continue
                
                options = question["options"]
                correct_index = question["correctAnswer"]
                
                # Kiểm tra index hợp lệ
                if not isinstance(correct_index, int) or correct_index < 0 or correct_index >= len(options):
                    issues_found.append(f"❌ Week {week}, Question {q_id}: Invalid correctAnswer index {correct_index} (should be 0-{len(options)-1})")
                    continue
                
                # Kiểm tra logic
                logic_issues = check_question_logic(question, q_id)
                if logic_issues:
                    issues_found.extend([f"Week {week}, {issue}" for issue in logic_issues])
        
        return issues_found
    
    except Exception as e:
        return [f"❌ Error reading {file_path}: {str(e)}"]

def main():
    """Main function"""
    base_dir = Path("src/data/questions/ket-noi-tri-thuc/grade-1/vietnamese")
    
    print("=" * 70)
    print("🔍 RÀ SOÁT VÀ KIỂM TRA TẤT CẢ CÂU HỎI")
    print("=" * 70)
    print()
    
    all_issues = []
    files_checked = 0
    total_questions = 0
    
    # Kiểm tra tất cả file week-*.json
    for week_file in sorted(base_dir.glob("week-*.json")):
        files_checked += 1
        issues = validate_week_file(week_file)
        
        if issues:
            all_issues.extend(issues)
            print(f"⚠️  {week_file.name}: {len(issues)} vấn đề")
        else:
            # Đếm số câu hỏi
            with open(week_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for lesson in data.get("lessons", []):
                    total_questions += len(lesson.get("questions", []))
            print(f"✅ {week_file.name}: OK")
    
    print()
    print("=" * 70)
    print("📊 TỔNG KẾT")
    print("=" * 70)
    print(f"📁 Files đã kiểm tra: {files_checked}")
    print(f"❓ Tổng số câu hỏi: {total_questions}")
    print(f"⚠️  Số vấn đề tìm thấy: {len(all_issues)}")
    print()
    
    if all_issues:
        print("=" * 70)
        print("⚠️  CÁC VẤN ĐỀ TÌM THẤY:")
        print("=" * 70)
        for i, issue in enumerate(all_issues, 1):
            print(f"{i}. {issue}")
        print()
        print("💡 Lưu ý: Các vấn đề có thể là:")
        print("   - Lỗi thực sự cần sửa")
        print("   - Câu hỏi logic phức tạp (cần review thủ công)")
        print("   - Pattern không nhận diện được (cần kiểm tra thủ công)")
    else:
        print("✅ KHÔNG TÌM THẤY VẤN ĐỀ NÀO!")
        print("   Tất cả câu hỏi đã được kiểm tra và đúng format.")
    
    print()
    print("=" * 70)

if __name__ == "__main__":
    main()

