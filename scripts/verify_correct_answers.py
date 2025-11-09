#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script so sánh file gốc và file đã convert để đảm bảo correctAnswer index đúng
"""

import json
import os
import sys
from pathlib import Path

# Fix encoding cho Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def convert_answer_to_index(answer_str):
    """Chuyển answer string "A"/"B"/"C"/"D" sang index"""
    mapping = {"A": 0, "B": 1, "C": 2, "D": 3}
    return mapping.get(answer_str.upper(), None)

def verify_week_file(original_file, converted_file, week_num):
    """So sánh file gốc và file đã convert"""
    issues = []
    
    try:
        # Đọc file gốc
        with open(original_file, 'r', encoding='utf-8') as f:
            original_data = json.load(f)
        
        # Tìm test tương ứng với week
        test_data = None
        for test in original_data.get("tests", []):
            if test.get("week") == week_num:
                test_data = test
                break
        
        if not test_data:
            issues.append(f"❌ Week {week_num}: Không tìm thấy test trong file gốc")
            return issues
        
        # Đọc file đã convert
        with open(converted_file, 'r', encoding='utf-8') as f:
            converted_data = json.load(f)
        
        original_questions = test_data.get("questions", [])
        converted_questions = converted_data.get("lessons", [])[0].get("questions", [])
        
        if len(original_questions) != len(converted_questions):
            issues.append(f"❌ Week {week_num}: Số lượng câu hỏi không khớp ({len(original_questions)} vs {len(converted_questions)})")
            return issues
        
        # So sánh từng câu hỏi
        for i, (orig_q, conv_q) in enumerate(zip(original_questions, converted_questions), 1):
            # Lấy correctAnswer từ file gốc
            orig_answer_str = orig_q.get("correctAnswer", "")
            orig_answer_index = convert_answer_to_index(orig_answer_str)
            
            if orig_answer_index is None:
                issues.append(f"❌ Week {week_num}, Question {i}: Invalid original answer '{orig_answer_str}'")
                continue
            
            # Lấy correctAnswer từ file đã convert
            conv_answer_index = conv_q.get("correctAnswer")
            
            if orig_answer_index != conv_answer_index:
                # Kiểm tra xem options có đúng thứ tự không
                orig_options_obj = orig_q.get("options", {})
                orig_options_array = [
                    orig_options_obj.get("A", ""),
                    orig_options_obj.get("B", ""),
                    orig_options_obj.get("C", ""),
                    orig_options_obj.get("D", "")
                ]
                conv_options_array = conv_q.get("options", [])
                
                # So sánh options
                if orig_options_array != conv_options_array:
                    issues.append(f"❌ Week {week_num}, Question {i}: Options không khớp")
                    issues.append(f"   Original: {orig_options_array}")
                    issues.append(f"   Converted: {conv_options_array}")
                    continue
                
                # So sánh correctAnswer
                orig_correct_text = orig_options_array[orig_answer_index]
                conv_correct_text = conv_options_array[conv_answer_index] if conv_answer_index < len(conv_options_array) else None
                
                issues.append(f"❌ Week {week_num}, Question {i}: correctAnswer index không khớp!")
                issues.append(f"   Original: '{orig_answer_str}' (index {orig_answer_index}) = '{orig_correct_text}'")
                issues.append(f"   Converted: index {conv_answer_index} = '{conv_correct_text}'")
                issues.append(f"   Question: {orig_q.get('question', '')[:50]}...")
        
        return issues
    
    except Exception as e:
        return [f"❌ Error verifying week {week_num}: {str(e)}"]

def main():
    """Main function"""
    original_dir = Path("Sách/Kết nối tri thức với cuộc sống/Lớp 1")
    converted_dir = Path("src/data/questions/ket-noi-tri-thuc/grade-1/vietnamese")
    
    original_files = [
        original_dir / "tiengviet1-tap1.json",
        original_dir / "tiengviet1-tap2.json"
    ]
    
    print("=" * 70)
    print("🔍 KIỂM TRA CHÍNH XÁC CÂU TRẢ LỜI")
    print("=" * 70)
    print()
    
    all_issues = []
    total_questions_checked = 0
    
    # Đọc file gốc 1 (week 1-17)
    if original_files[0].exists():
        print(f"📖 Đang kiểm tra: {original_files[0].name}")
        print("-" * 70)
        
        with open(original_files[0], 'r', encoding='utf-8') as f:
            data1 = json.load(f)
        
        for test in data1.get("tests", []):
            week_num = test.get("week")
            converted_file = converted_dir / f"week-{week_num}.json"
            
            if converted_file.exists():
                issues = verify_week_file(original_files[0], converted_file, week_num)
                if issues:
                    all_issues.extend(issues)
                    print(f"⚠️  Week {week_num}: {len(issues)} vấn đề")
                else:
                    total_questions_checked += len(test.get("questions", []))
                    print(f"✅ Week {week_num}: OK ({len(test.get('questions', []))} câu hỏi)")
            else:
                all_issues.append(f"❌ Week {week_num}: Không tìm thấy file đã convert")
                print(f"❌ Week {week_num}: File không tồn tại")
        
        print()
    
    # Đọc file gốc 2 (week 19-35)
    if original_files[1].exists():
        print(f"📖 Đang kiểm tra: {original_files[1].name}")
        print("-" * 70)
        
        with open(original_files[1], 'r', encoding='utf-8') as f:
            data2 = json.load(f)
        
        for test in data2.get("tests", []):
            week_num = test.get("week")
            converted_file = converted_dir / f"week-{week_num}.json"
            
            if converted_file.exists():
                issues = verify_week_file(original_files[1], converted_file, week_num)
                if issues:
                    all_issues.extend(issues)
                    print(f"⚠️  Week {week_num}: {len(issues)} vấn đề")
                else:
                    total_questions_checked += len(test.get("questions", []))
                    print(f"✅ Week {week_num}: OK ({len(test.get('questions', []))} câu hỏi)")
            else:
                all_issues.append(f"❌ Week {week_num}: Không tìm thấy file đã convert")
                print(f"❌ Week {week_num}: File không tồn tại")
        
        print()
    
    print("=" * 70)
    print("📊 TỔNG KẾT")
    print("=" * 70)
    print(f"❓ Tổng số câu hỏi đã kiểm tra: {total_questions_checked}")
    print(f"⚠️  Số vấn đề tìm thấy: {len(all_issues)}")
    print()
    
    if all_issues:
        print("=" * 70)
        print("⚠️  CÁC VẤN ĐỀ TÌM THẤY:")
        print("=" * 70)
        for i, issue in enumerate(all_issues, 1):
            print(f"{i}. {issue}")
        print()
        return False
    else:
        print("✅ TẤT CẢ CÂU TRẢ LỜI ĐÚNG 100%!")
        print("   Đã so sánh file gốc và file đã convert, không có lỗi nào.")
        print()
        return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

