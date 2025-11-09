#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script rà soát và sửa câu hỏi "X gồm mấy và mấy?" có nhiều đáp án đúng
"""

import json
import os
import sys
import re
import shutil
from pathlib import Path
from datetime import datetime

# Fix encoding cho Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def parse_number_from_text(text):
    """Extract số từ text"""
    match = re.search(r'\d+', text)
    if match:
        return int(match.group(0))
    return None

def parse_option_pair(option_text):
    """Parse option dạng "A và B" thành (A, B)"""
    match = re.search(r'(\d+)\s+và\s+(\d+)', option_text, re.IGNORECASE)
    if match:
        return (int(match.group(1)), int(match.group(2)))
    return None

def check_question_logic(question):
    """Kiểm tra câu hỏi dạng "X gồm mấy và mấy?" có bao nhiêu đáp án đúng"""
    q_text = question.get("question", "")
    options = question.get("options", [])
    correct_index = question.get("correctAnswer", -1)
    
    # Kiểm tra pattern "gồm mấy và mấy?"
    if "gồm mấy và mấy" not in q_text.lower():
        return None
    
    # Extract số X từ câu hỏi
    x_match = re.search(r'(\d+)\s+gồm\s+mấy\s+và\s+mấy', q_text, re.IGNORECASE)
    if not x_match:
        return None
    
    target_sum = int(x_match.group(1))
    
    # Kiểm tra tất cả options
    correct_answers = []
    for i, option in enumerate(options):
        pair = parse_option_pair(option)
        if pair:
            a, b = pair
            if a + b == target_sum:
                correct_answers.append(i)
    
    return {
        "question_id": question.get("id", "unknown"),
        "question_text": q_text,
        "target_sum": target_sum,
        "options": options,
        "current_correct": correct_index,
        "all_correct_answers": correct_answers,
        "correct_count": len(correct_answers),
        "has_issue": len(correct_answers) > 1
    }

def fix_question(question, issue_info):
    """Sửa câu hỏi có nhiều đáp án đúng"""
    # Lấy đáp án đúng hiện tại
    correct_index = issue_info["current_correct"]
    correct_option = issue_info["options"][correct_index]
    
    # Parse đáp án đúng: "Y và Z" → (Y, Z)
    pair = parse_option_pair(correct_option)
    if not pair:
        return None  # Không thể parse
    
    y, z = pair
    target_sum = issue_info["target_sum"]
    
    # Thay đổi câu hỏi: "X gồm mấy và mấy?" → "X gồm Y và mấy?"
    old_question = question["question"]
    new_question = re.sub(
        r'(\d+)\s+gồm\s+mấy\s+và\s+mấy',
        f'{target_sum} gồm {y} và mấy',
        old_question,
        flags=re.IGNORECASE
    )
    
    # Tạo options mới: Chỉ số thứ hai
    # Option đúng: "Z"
    # Options sai: Tạo các số khác Z (ví dụ: Z+1, Z-1, Z+2, Z-2)
    new_options = [str(z)]  # Đáp án đúng
    
    # Tạo đáp án sai (đảm bảo không bằng Z và hợp lý)
    wrong_answers = []
    for offset in [1, -1, 2, -2, 3]:
        wrong_value = z + offset
        if wrong_value > 0 and wrong_value != z and wrong_value not in wrong_answers:
            wrong_answers.append(wrong_value)
        if len(wrong_answers) >= 3:
            break
    
    # Nếu không đủ 3 đáp án sai, thêm các số khác
    while len(wrong_answers) < 3:
        for num in range(1, target_sum + 5):
            if num != z and num not in wrong_answers:
                wrong_answers.append(num)
                if len(wrong_answers) >= 3:
                    break
    
    new_options.extend([str(w) for w in wrong_answers[:3]])
    
    # Cập nhật question
    question["question"] = new_question
    question["options"] = new_options
    question["correctAnswer"] = 0  # Option đầu tiên là đúng
    question["explanation"] = f"{target_sum} = {y} + {z}, nên {target_sum} gồm {y} và {z}"
    
    return question

def scan_all_questions():
    """Scan tất cả câu hỏi trong thư mục math"""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    possible_paths = [
        project_root / "public/data/questions/ket-noi-tri-thuc/grade-1/math",
        project_root / "src/data/questions/ket-noi-tri-thuc/grade-1/math",
    ]
    
    base_path = None
    for path in possible_paths:
        if path.exists():
            base_path = path
            break
    
    if not base_path:
        print("❌ Không tìm thấy thư mục math!")
        return [], 0
    
    issues = []
    total_questions = 0
    
    # Scan tất cả file week-*.json
    for week_file in sorted(base_path.glob("week-*.json")):
        if "backup" in str(week_file):
            continue
        
        try:
            with open(week_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            lessons = data.get("lessons", [])
            for lesson in lessons:
                questions = lesson.get("questions", [])
                for question in questions:
                    total_questions += 1
                    result = check_question_logic(question)
                    if result and result["has_issue"]:
                        result["week_file"] = str(week_file)
                        result["lesson_title"] = lesson.get("title", "unknown")
                        result["question"] = question  # Lưu question object để sửa
                        result["lesson"] = lesson  # Lưu lesson để update
                        issues.append(result)
        except Exception as e:
            print(f"❌ Error reading {week_file}: {e}")
    
    return issues, total_questions

def fix_all_issues(dry_run=True):
    """Sửa tất cả câu hỏi có vấn đề"""
    issues, total = scan_all_questions()
    
    if not issues:
        print("✅ Không có câu hỏi nào cần sửa!")
        return
    
    print(f"📊 Tìm thấy {len(issues)} câu hỏi cần sửa")
    print()
    
    # Group by file
    files_to_fix = {}
    for issue in issues:
        week_file = issue["week_file"]
        if week_file not in files_to_fix:
            files_to_fix[week_file] = []
        files_to_fix[week_file].append(issue)
    
    # Fix từng file
    for week_file, file_issues in files_to_fix.items():
        print(f"📝 Đang sửa file: {week_file}")
        
        # Backup file
        backup_file = str(week_file) + f".backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        if not dry_run:
            shutil.copy2(week_file, backup_file)
            print(f"   💾 Đã backup: {backup_file}")
        
        # Load file
        with open(week_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Fix từng câu hỏi
        fixed_count = 0
        for issue in file_issues:
            question = issue["question"]
            fixed = fix_question(question, issue)
            if fixed:
                fixed_count += 1
                print(f"   ✅ Đã sửa: {issue['question_id']} - {issue['question_text']}")
                print(f"      → {fixed['question']}")
        
        # Save file
        if not dry_run and fixed_count > 0:
            with open(week_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"   💾 Đã lưu file: {week_file}")
        
        print()
    
    # Fix cả file trong src/ (đồng bộ)
    if not dry_run:
        print("🔄 Đồng bộ với thư mục src/...")
        for week_file in files_to_fix.keys():
            src_file = str(week_file).replace("public/", "src/")
            if Path(src_file).exists():
                shutil.copy2(week_file, src_file)
                print(f"   ✅ Đã đồng bộ: {src_file}")

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Rà soát và sửa câu hỏi có nhiều đáp án đúng')
    parser.add_argument('--fix', action='store_true', help='Thực sự sửa files (mặc định: chỉ báo cáo)')
    args = parser.parse_args()
    
    if args.fix:
        print("=" * 70)
        print("🔧 SỬA CÂU HỎI CÓ NHIỀU ĐÁP ÁN ĐÚNG")
        print("=" * 70)
        print()
        fix_all_issues(dry_run=False)
    else:
        print("=" * 70)
        print("🔍 RÀ SOÁT CÂU HỎI 'X GỒM MẤY VÀ MẤY?' CÓ NHIỀU ĐÁP ÁN ĐÚNG")
        print("=" * 70)
        print()
        
        issues, total = scan_all_questions()
        
        print(f"📊 Tổng số câu hỏi đã scan: {total}")
        print(f"⚠️  Số câu hỏi có vấn đề (nhiều đáp án đúng): {len(issues)}")
        print()
        
        if issues:
            print("=" * 70)
            print("📋 DANH SÁCH CÂU HỎI CẦN SỬA:")
            print("=" * 70)
            print()
            
            for i, issue in enumerate(issues, 1):
                print(f"{i}. ❌ Câu hỏi có {issue['correct_count']} đáp án đúng:")
                print(f"   📁 File: {issue['week_file']}")
                print(f"   🆔 ID: {issue['question_id']}")
                print(f"   ❓ Câu hỏi: {issue['question_text']}")
                print(f"   🎯 Tổng cần: {issue['target_sum']}")
                print(f"   ✅ Đáp án đúng hiện tại: {issue['current_correct']} - {issue['options'][issue['current_correct']]}")
                print(f"   ⚠️  Tất cả đáp án đúng: {issue['all_correct_answers']}")
                correct_options = [f"{idx}: {issue['options'][idx]}" for idx in issue['all_correct_answers']]
                print(f"      {', '.join(correct_options)}")
                print()
        else:
            print("✅ Không có câu hỏi nào có vấn đề!")
        
        print("=" * 70)
        print("💡 Để sửa tự động, chạy: python scripts/fix_multi_answer_questions.py --fix")
        print("=" * 70)
        print()

if __name__ == "__main__":
    main()
