#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script chuyển đổi JSON data từ format cũ sang format chuẩn
Format cũ: {bookInfo, tests: [{week, questions: [{options: {A, B, C, D}, correctAnswer: "A"}]}]}
Format mới: {week, subject, grade, bookSeries, lessons: [{questions: [{options: [], correctAnswer: 0}]}]}
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

def convert_options_to_array(options_obj):
    """Chuyển options từ object {A: "...", B: "...", C: "...", D: "..."} sang array"""
    return [
        options_obj.get("A", ""),
        options_obj.get("B", ""),
        options_obj.get("C", ""),
        options_obj.get("D", "")
    ]

def convert_correct_answer_to_index(correct_answer_str):
    """Chuyển correctAnswer từ string "A"/"B"/"C"/"D" sang index 0-3"""
    mapping = {"A": 0, "B": 1, "C": 2, "D": 3}
    return mapping.get(correct_answer_str.upper(), 0)

def convert_question(question_old):
    """Convert một question từ format cũ sang format mới"""
    # Convert options từ object sang array
    options_array = convert_options_to_array(question_old["options"])
    
    # Convert correctAnswer từ string sang index
    correct_answer_index = convert_correct_answer_to_index(question_old["correctAnswer"])
    
    # Tạo question mới
    question_new = {
        "id": f"q{question_old['id']}",
        "type": "multiple-choice",
        "question": question_old["question"],
        "options": options_array,
        "correctAnswer": correct_answer_index,
        "explanation": "",  # Có thể thêm explanation sau
        "imageUrl": None
    }
    
    return question_new

def convert_test_to_week(test_data, book_series, grade, subject):
    """Convert một test thành format week mới"""
    week_number = test_data["week"]
    
    # Convert tất cả questions
    questions_new = [convert_question(q) for q in test_data["questions"]]
    
    # Tạo structure mới
    # Mỗi tuần có thể có nhiều lessons, nhưng hiện tại nhóm tất cả questions vào 1 lesson
    week_data = {
        "week": week_number,
        "subject": subject,
        "grade": grade,
        "bookSeries": book_series,
        "lessons": [
            {
                "id": f"lesson-1",
                "title": test_data.get("title", f"TUẦN {week_number}"),
                "duration": 15,  # Mặc định 15 phút
                "questions": questions_new
            }
        ]
    }
    
    return week_data

def convert_file(input_file_path, output_dir, book_series, grade, subject):
    """Convert một file JSON từ format cũ sang format mới"""
    print(f"📖 Đang đọc file: {input_file_path}")
    
    # Đọc file gốc
    with open(input_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Lấy thông tin bookInfo
    book_info = data.get("bookInfo", {})
    tests = data.get("tests", [])
    
    print(f"✅ Tìm thấy {len(tests)} tuần trong file")
    
    # Tạo output directory nếu chưa có
    os.makedirs(output_dir, exist_ok=True)
    
    # Convert mỗi test thành 1 file JSON riêng
    converted_count = 0
    for test in tests:
        week_number = test["week"]
        
        # Convert test sang format mới
        week_data = convert_test_to_week(test, book_series, grade, subject)
        
        # Tạo file path
        output_file = os.path.join(output_dir, f"week-{week_number}.json")
        
        # Ghi file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(week_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Đã tạo: {output_file} ({len(week_data['lessons'][0]['questions'])} câu hỏi)")
        converted_count += 1
    
    print(f"\n🎉 Hoàn thành! Đã convert {converted_count} tuần")
    return converted_count

def main():
    """Main function"""
    # Đường dẫn file gốc
    base_dir = Path("Sách/Kết nối tri thức với cuộc sống/Lớp 1")
    
    # File input
    file1 = base_dir / "tiengviet1-tap1.json"
    file2 = base_dir / "tiengviet1-tap2.json"
    
    # Thông tin convert
    book_series = "ket-noi-tri-thuc"
    grade = 1
    subject = "vietnamese"
    
    # Output directory
    output_base = Path("src/data/questions")
    output_dir = output_base / book_series / f"grade-{grade}" / subject
    
    print("=" * 60)
    print("🔄 CHUYỂN ĐỔI JSON DATA - FORMAT CŨ → FORMAT MỚI")
    print("=" * 60)
    print()
    
    # Convert file 1
    if file1.exists():
        print(f"📚 File 1: {file1.name}")
        print("-" * 60)
        convert_file(file1, output_dir, book_series, grade, subject)
        print()
    else:
        print(f"❌ Không tìm thấy file: {file1}")
    
    # Convert file 2
    if file2.exists():
        print(f"📚 File 2: {file2.name}")
        print("-" * 60)
        convert_file(file2, output_dir, book_series, grade, subject)
        print()
    else:
        print(f"❌ Không tìm thấy file: {file2}")
    
    print("=" * 60)
    print("✅ HOÀN THÀNH CHUYỂN ĐỔI!")
    print("=" * 60)
    print(f"📁 Output directory: {output_dir}")
    print()

if __name__ == "__main__":
    main()

