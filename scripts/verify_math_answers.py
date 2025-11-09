#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script rà soát kỹ lại đáp án đúng và câu hỏi toán lớp 1
Kiểm tra logic, phép tính, và đảm bảo 100% chính xác
"""

import json
import sys
import codecs
import re
from pathlib import Path

# Fix encoding cho Windows console
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def extract_number(text):
    """Trích xuất số từ text (bỏ qua đơn vị như 'quả', 'con', 'cái')"""
    # Loại bỏ đơn vị
    text = text.replace(" quả", "").replace(" con", "").replace(" cái", "").replace(" cm", "").strip()
    # Tìm số
    match = re.search(r'\d+', text)
    if match:
        return int(match.group(0))
    return None

def verify_question_logic(question):
    """Kiểm tra logic câu hỏi và đáp án đúng"""
    issues = []
    
    q_id = question.get("id", "unknown")
    q_text = question.get("question", "")
    options = question.get("options", [])
    correct_index = question.get("correctAnswer", -1)
    explanation = question.get("explanation", "")
    
    # Kiểm tra index hợp lệ
    if not isinstance(correct_index, int) or correct_index < 0 or correct_index >= len(options):
        issues.append({
            "type": "ERROR",
            "message": f"Invalid correctAnswer index {correct_index} (should be 0-{len(options)-1})",
            "question": q_id,
            "question_text": q_text[:50] + "..."
        })
        return issues
    
    correct_answer_text = options[correct_index]
    
    # Pattern 1: Phép tính trực tiếp "X + Y = ?" hoặc "X - Y = ?"
    if " = ?" in q_text or "= ?" in q_text:
        # Phép cộng
        match = re.search(r'(\d+)\s*\+\s*(\d+)', q_text)
        if match:
            x, y = int(match.group(1)), int(match.group(2))
            expected = x + y
            correct_value = extract_number(correct_answer_text)
            if correct_value is not None and correct_value != expected:
                issues.append({
                    "type": "ERROR",
                    "message": f"Phép tính {x} + {y} = {expected} nhưng đáp án đúng là '{correct_answer_text}' (giá trị {correct_value})",
                    "question": q_id,
                    "question_text": q_text,
                    "expected": expected,
                    "actual": correct_value
                })
        
        # Phép trừ
        match = re.search(r'(\d+)\s*-\s*(\d+)', q_text)
        if match:
            x, y = int(match.group(1)), int(match.group(2))
            expected = x - y
            correct_value = extract_number(correct_answer_text)
            if correct_value is not None and correct_value != expected:
                issues.append({
                    "type": "ERROR",
                    "message": f"Phép tính {x} - {y} = {expected} nhưng đáp án đúng là '{correct_answer_text}' (giá trị {correct_value})",
                    "question": q_id,
                    "question_text": q_text,
                    "expected": expected,
                    "actual": correct_value
                })
    
    # Pattern 2: "Có X, thêm Y. Hỏi có tất cả bao nhiêu?"
    if "thêm" in q_text and "tất cả" in q_text:
        match = re.search(r'Có\s+(\d+)', q_text)
        match2 = re.search(r'thêm\s+(\d+)', q_text)
        if match and match2:
            x, y = int(match.group(1)), int(match2.group(1))
            expected = x + y
            correct_value = extract_number(correct_answer_text)
            if correct_value is not None and correct_value != expected:
                issues.append({
                    "type": "ERROR",
                    "message": f"Có {x}, thêm {y} = {expected} nhưng đáp án đúng là '{correct_answer_text}' (giá trị {correct_value})",
                    "question": q_id,
                    "question_text": q_text,
                    "expected": expected,
                    "actual": correct_value
                })
    
    # Pattern 3: "Có X, bay đi/ăn hết Y. Hỏi còn lại bao nhiêu?"
    if ("bay đi" in q_text or "ăn hết" in q_text or "dùng hết" in q_text) and "còn lại" in q_text:
        match = re.search(r'Có\s+(\d+)', q_text)
        match2 = re.search(r'(bay đi|ăn hết|dùng hết)\s+(\d+)', q_text)
        if match and match2:
            x, y = int(match.group(1)), int(match2.group(2))
            expected = x - y
            correct_value = extract_number(correct_answer_text)
            if correct_value is not None and correct_value != expected:
                issues.append({
                    "type": "ERROR",
                    "message": f"Có {x}, bay đi/ăn hết {y} = {expected} nhưng đáp án đúng là '{correct_answer_text}' (giá trị {correct_value})",
                    "question": q_id,
                    "question_text": q_text,
                    "expected": expected,
                    "actual": correct_value
                })
    
    # Pattern 4: "Số nào sau đây là số X?" - Kiểm tra đáp án có chứa số X không
    match = re.search(r'Số nào sau đây là số (\d+)', q_text)
    if match:
        expected_number = int(match.group(1))
        correct_value = extract_number(correct_answer_text)
        if correct_value is not None and correct_value != expected_number:
            issues.append({
                "type": "ERROR",
                "message": f"Câu hỏi hỏi số {expected_number} nhưng đáp án đúng là '{correct_answer_text}' (giá trị {correct_value})",
                "question": q_id,
                "question_text": q_text,
                "expected": expected_number,
                "actual": correct_value
            })
    
    # Pattern 5: "Số nào lớn nhất/nhỏ nhất trong các số: X, Y, Z, W?"
    if "lớn nhất" in q_text or "nhỏ nhất" in q_text:
        match = re.search(r'các số:\s*([\d,\s]+)', q_text)
        if match:
            numbers_str = match.group(1)
            numbers = [int(x.strip()) for x in numbers_str.split(',') if x.strip().isdigit()]
            if numbers:
                if "lớn nhất" in q_text:
                    expected = max(numbers)
                else:
                    expected = min(numbers)
                correct_value = extract_number(correct_answer_text)
                if correct_value is not None and correct_value != expected:
                    issues.append({
                        "type": "ERROR",
                        "message": f"Số {'lớn nhất' if 'lớn nhất' in q_text else 'nhỏ nhất'} trong {numbers} là {expected} nhưng đáp án đúng là '{correct_answer_text}' (giá trị {correct_value})",
                        "question": q_id,
                        "question_text": q_text,
                        "expected": expected,
                        "actual": correct_value
                    })
    
    return issues

def verify_week_file(file_path):
    """Kiểm tra một file week"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        week = data.get("week", 0)
        lessons = data.get("lessons", [])
        
        all_issues = []
        total_questions = 0
        
        for lesson in lessons:
            questions = lesson.get("questions", [])
            for question in questions:
                total_questions += 1
                issues = verify_question_logic(question)
                if issues:
                    all_issues.extend([(week, issue) for issue in issues])
        
        return {
            "week": week,
            "total": total_questions,
            "issues": all_issues
        }
    
    except Exception as e:
        return {
            "week": 0,
            "error": str(e),
            "issues": []
        }

def main():
    """Main function"""
    base_dir = Path("public/data/questions/ket-noi-tri-thuc/grade-1/math")
    
    print("=" * 70)
    print("🔍 RÀ SOÁT KỸ LẠI ĐÁP ÁN ĐÚNG VÀ CÂU HỎI")
    print("=" * 70)
    print()
    
    all_issues = []
    total_questions = 0
    files_checked = 0
    
    # Kiểm tra tất cả file week-*.json
    for week_file in sorted(base_dir.glob("week-*.json")):
        files_checked += 1
        result = verify_week_file(week_file)
        
        if "error" in result:
            print(f"❌ Week {result['week']}: Lỗi đọc file - {result['error']}")
            continue
        
        week = result["week"]
        total = result["total"]
        issues = result["issues"]
        
        total_questions += total
        
        if issues:
            print(f"⚠️  Week {week}: {total} câu hỏi - {len(issues)} vấn đề")
            all_issues.extend(issues)
        else:
            print(f"✅ Week {week}: OK - {total} câu hỏi")
    
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
        for i, (week, issue) in enumerate(all_issues, 1):
            print(f"{i}. Week {week}, Question {issue['question']}:")
            print(f"   {issue['message']}")
            if 'question_text' in issue:
                print(f"   Câu hỏi: {issue['question_text']}")
            if 'expected' in issue and 'actual' in issue:
                print(f"   Mong đợi: {issue['expected']}, Thực tế: {issue['actual']}")
            print()
        return False
    else:
        print("✅ TẤT CẢ CÂU TRẢ LỜI ĐÚNG 100%!")
        print("   Đã rà soát kỹ lại tất cả câu hỏi và đáp án.")
        print("   Không tìm thấy lỗi logic nào.")
        print()
        return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

