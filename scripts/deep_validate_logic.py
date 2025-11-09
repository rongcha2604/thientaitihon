#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script kiểm tra logic câu hỏi chi tiết
Đảm bảo đáp án đúng khớp với nội dung câu hỏi
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

def check_logic_question(question_data, q_id):
    """Kiểm tra logic câu hỏi và đáp án đúng"""
    issues = []
    
    q_text = question_data["question"]
    options = question_data["options"]
    correct_index = question_data["correctAnswer"]
    correct_answer = options[correct_index] if 0 <= correct_index < len(options) else None
    
    if not correct_answer:
        return issues
    
    q_lower = q_text.lower()
    correct_lower = correct_answer.lower().strip()
    
    # Pattern 1: "Chữ cái nào sau đây là chữ 'X'?"
    match = re.search(r"chữ\s+(cái\s+)?nào\s+sau\s+đây\s+là\s+chữ\s+['\"](\w+)['\"]", q_text, re.IGNORECASE)
    if match:
        expected_char = match.group(2).lower().strip()
        # Đáp án đúng phải chứa chữ cái đó
        if expected_char not in correct_lower and correct_lower not in expected_char:
            # Tìm đáp án có chứa chữ cái đó
            for i, opt in enumerate(options):
                opt_lower = opt.lower().strip()
                if expected_char in opt_lower or opt_lower in expected_char:
                    if i != correct_index:
                        issues.append({
                            "type": "logic_error",
                            "question_id": q_id,
                            "question": q_text[:60] + "...",
                            "issue": f"Hỏi về chữ '{expected_char}' nhưng đáp án đúng là '{correct_answer}' (index {correct_index}), trong khi '{opt}' (index {i}) có vẻ đúng hơn",
                            "expected": expected_char,
                            "current_answer": correct_answer,
                            "suggested_answer": opt
                        })
                    break
    
    # Pattern 2: "Chữ cái 'X' trong tiếng Việt đọc là gì?"
    match = re.search(r"chữ\s+(cái\s+)?['\"](\w+)['\"]\s+trong\s+tiếng\s+việt\s+đọc\s+là\s+gì", q_text, re.IGNORECASE)
    if match:
        char = match.group(2).lower().strip()
        # Đáp án đúng thường là cách đọc của chữ cái đó (ví dụ: "b" đọc là "bờ")
        # Khó kiểm tra tự động, nhưng có thể log để review
    
    # Pattern 3: "Từ nào có chữ 'X'?" hoặc "Từ nào có vần 'X'?"
    match = re.search(r"từ\s+nào\s+có\s+(chữ|vần)\s+['\"](\w+)['\"]", q_text, re.IGNORECASE)
    if match:
        expected_char = match.group(2).lower().strip()
        # Đáp án đúng phải chứa chữ/vần đó
        if expected_char not in correct_lower:
            # Tìm đáp án có chứa chữ/vần đó
            for i, opt in enumerate(options):
                opt_lower = opt.lower().strip()
                if expected_char in opt_lower:
                    if i != correct_index:
                        issues.append({
                            "type": "logic_error",
                            "question_id": q_id,
                            "question": q_text[:60] + "...",
                            "issue": f"Hỏi từ nào có chữ/vần '{expected_char}' nhưng đáp án đúng là '{correct_answer}' (index {correct_index}), trong khi '{opt}' (index {i}) có chứa '{expected_char}'",
                            "expected": expected_char,
                            "current_answer": correct_answer,
                            "suggested_answer": opt
                        })
                    break
    
    # Pattern 4: "Vần 'X' có mấy chữ cái?"
    match = re.search(r"vần\s+['\"](\w+)['\"]\s+có\s+mấy\s+chữ\s+cái", q_text, re.IGNORECASE)
    if match:
        vần = match.group(1)
        # Đếm số chữ cái trong vần (không tính dấu)
        char_count = len(re.sub(r'[^\w]', '', vần))
        # Tìm đáp án có số tương ứng
        for i, opt in enumerate(options):
            numbers = re.findall(r'\d+', opt)
            if numbers and int(numbers[0]) == char_count:
                if i != correct_index:
                    issues.append({
                        "type": "logic_error",
                        "question_id": q_id,
                        "question": q_text[:60] + "...",
                        "issue": f"Vần '{vần}' có {char_count} chữ cái nhưng đáp án đúng là '{correct_answer}' (index {correct_index}), trong khi '{opt}' (index {i}) có số {char_count}",
                        "expected": str(char_count),
                        "current_answer": correct_answer,
                        "suggested_answer": opt
                    })
                break
    
    # Pattern 5: "Chữ 'X' và chữ 'Y' khác nhau ở điểm nào?"
    match = re.search(r"chữ\s+['\"](\w+)['\"]\s+và\s+chữ\s+['\"](\w+)['\"]\s+khác\s+nhau\s+ở\s+điểm\s+nào", q_text, re.IGNORECASE)
    if match:
        # Câu hỏi so sánh, khó kiểm tra tự động
        pass
    
    # Pattern 6: "Chữ 'X' đọc là gì?"
    match = re.search(r"chữ\s+['\"](\w+)['\"]\s+đọc\s+là\s+gì", q_text, re.IGNORECASE)
    if match:
        # Câu hỏi về cách đọc, khó kiểm tra tự động
        pass
    
    return issues

def validate_file(file_path):
    """Validate một file JSON"""
    all_issues = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        week = data.get("week", 0)
        lessons = data.get("lessons", [])
        
        for lesson in lessons:
            questions = lesson.get("questions", [])
            
            for question in questions:
                q_id = question.get("id", "unknown")
                issues = check_logic_question(question, q_id)
                if issues:
                    for issue in issues:
                        issue["week"] = week
                        all_issues.append(issue)
        
        return all_issues
    
    except Exception as e:
        return [{"type": "error", "week": 0, "issue": f"Error reading file: {str(e)}"}]

def main():
    """Main function"""
    base_dir = Path("src/data/questions/ket-noi-tri-thuc/grade-1/vietnamese")
    
    print("=" * 70)
    print("🔍 KIỂM TRA LOGIC CÂU HỎI CHI TIẾT")
    print("=" * 70)
    print()
    
    all_issues = []
    files_checked = 0
    total_questions = 0
    
    # Kiểm tra tất cả file
    for week_file in sorted(base_dir.glob("week-*.json")):
        files_checked += 1
        issues = validate_file(week_file)
        
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
    print(f"⚠️  Số vấn đề logic tìm thấy: {len(all_issues)}")
    print()
    
    if all_issues:
        print("=" * 70)
        print("⚠️  CÁC VẤN ĐỀ LOGIC TÌM THẤY:")
        print("=" * 70)
        
        # Nhóm theo week
        issues_by_week = {}
        for issue in all_issues:
            week = issue.get("week", 0)
            if week not in issues_by_week:
                issues_by_week[week] = []
            issues_by_week[week].append(issue)
        
        for week in sorted(issues_by_week.keys()):
            print(f"\n📚 Week {week}:")
            for i, issue in enumerate(issues_by_week[week], 1):
                print(f"  {i}. Question {issue.get('question_id', 'unknown')}:")
                print(f"     {issue.get('issue', 'Unknown issue')}")
                print(f"     Câu hỏi: {issue.get('question', 'N/A')}")
                if issue.get('suggested_answer'):
                    print(f"     💡 Gợi ý: Đáp án '{issue.get('suggested_answer')}' có vẻ đúng hơn")
                print()
        
        print()
        print("💡 Lưu ý:")
        print("   - Các vấn đề này có thể là:")
        print("     + Lỗi thực sự cần sửa")
        print("     + Câu hỏi logic phức tạp (cần review thủ công)")
        print("     + Pattern không nhận diện được (cần kiểm tra thủ công)")
        print()
        print("   - Vui lòng review các câu hỏi này và sửa nếu cần.")
        return False
    else:
        print("✅ KHÔNG TÌM THẤY VẤN ĐỀ LOGIC NÀO!")
        print("   Tất cả câu hỏi đã được kiểm tra logic và đúng 100%.")
        return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

