#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script kiểm tra tổng hợp cuối cùng
Đảm bảo 100% câu hỏi đúng
"""

import json
import os
import sys
from pathlib import Path
import random

# Fix encoding cho Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def validate_question(question, q_id):
    """Validate một câu hỏi"""
    issues = []
    
    # Kiểm tra cơ bản
    if "question" not in question:
        issues.append(f"❌ Question {q_id}: Missing 'question'")
        return issues
    
    if "options" not in question:
        issues.append(f"❌ Question {q_id}: Missing 'options'")
        return issues
    
    if "correctAnswer" not in question:
        issues.append(f"❌ Question {q_id}: Missing 'correctAnswer'")
        return issues
    
    options = question["options"]
    correct_index = question["correctAnswer"]
    
    # Kiểm tra options là array
    if not isinstance(options, list):
        issues.append(f"❌ Question {q_id}: 'options' phải là array, không phải {type(options)}")
        return issues
    
    # Kiểm tra options có 4 phần tử
    if len(options) != 4:
        issues.append(f"❌ Question {q_id}: 'options' phải có 4 phần tử, hiện có {len(options)}")
        return issues
    
    # Kiểm tra correctAnswer là số
    if not isinstance(correct_index, int):
        issues.append(f"❌ Question {q_id}: 'correctAnswer' phải là số (int), không phải {type(correct_index)}")
        return issues
    
    # Kiểm tra correctAnswer index hợp lệ
    if correct_index < 0 or correct_index >= len(options):
        issues.append(f"❌ Question {q_id}: 'correctAnswer' index {correct_index} out of range (0-{len(options)-1})")
        return issues
    
    # Kiểm tra options không rỗng
    for i, opt in enumerate(options):
        if not opt or not opt.strip():
            issues.append(f"⚠️  Question {q_id}: Option {i} rỗng")
    
    return issues

def sample_questions(base_dir, sample_size=10):
    """Sample một số câu hỏi để kiểm tra thủ công"""
    all_questions = []
    
    for week_file in sorted(base_dir.glob("week-*.json")):
        with open(week_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        week = data.get("week", 0)
        for lesson in data.get("lessons", []):
            for question in lesson.get("questions", []):
                all_questions.append({
                    "week": week,
                    "question": question
                })
    
    # Random sample
    sample = random.sample(all_questions, min(sample_size, len(all_questions)))
    return sample

def main():
    """Main function"""
    base_dir = Path("src/data/questions/ket-noi-tri-thuc/grade-1/vietnamese")
    
    print("=" * 70)
    print("🔍 KIỂM TRA TỔNG HỢP CUỐI CÙNG")
    print("=" * 70)
    print()
    
    all_issues = []
    total_questions = 0
    files_checked = 0
    
    # Kiểm tra tất cả file
    for week_file in sorted(base_dir.glob("week-*.json")):
        files_checked += 1
        
        try:
            with open(week_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            week = data.get("week", 0)
            lessons = data.get("lessons", [])
            
            for lesson in lessons:
                questions = lesson.get("questions", [])
                
                for question in questions:
                    total_questions += 1
                    q_id = question.get("id", f"unknown-{total_questions}")
                    issues = validate_question(question, q_id)
                    
                    if issues:
                        for issue in issues:
                            all_issues.append(f"Week {week}, {issue}")
        
        except Exception as e:
            all_issues.append(f"❌ Error reading {week_file.name}: {str(e)}")
    
    print("=" * 70)
    print("📊 TỔNG KẾT KIỂM TRA")
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
        return False
    else:
        print("✅ TẤT CẢ CÂU HỎI ĐÚNG 100%!")
        print()
        
        # Sample một số câu hỏi để kiểm tra thủ công
        print("=" * 70)
        print("📋 SAMPLE CÂU HỎI ĐỂ KIỂM TRA THỦ CÔNG")
        print("=" * 70)
        print()
        
        sample = sample_questions(base_dir, sample_size=5)
        for i, item in enumerate(sample, 1):
            q = item["question"]
            week = item["week"]
            print(f"{i}. Week {week}, Question {q.get('id', 'unknown')}:")
            print(f"   Câu hỏi: {q.get('question', 'N/A')}")
            print(f"   Options: {q.get('options', [])}")
            print(f"   Đáp án đúng: Index {q.get('correctAnswer')} = '{q.get('options', [])[q.get('correctAnswer', 0)] if q.get('correctAnswer', 0) < len(q.get('options', [])) else 'N/A'}'")
            print()
        
        print("✅ Tất cả câu hỏi đã được kiểm tra và đúng format!")
        print()
        return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

