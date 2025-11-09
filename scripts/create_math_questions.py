#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tạo bộ đề toán lớp 1 - Kết nối tri thức
Đảm bảo phân bổ đáp án đều cho A, B, C, D (25% mỗi loại)
"""

import json
import os
from pathlib import Path
from collections import Counter

# Định nghĩa các tuần và nội dung
WEEKS_DATA = {
    # Tuần 10-14: Phép cộng, phép trừ trong phạm vi 10
    10: {
        "title": "Phép cộng trong phạm vi 10",
        "duration": 15,
        "questions": [
            {"q": "3 + 4 = ?", "options": ["6", "7", "8", "9"], "correct": 1, "exp": "3 + 4 = 7"},
            {"q": "5 + 2 = ?", "options": ["6", "7", "8", "9"], "correct": 1, "exp": "5 + 2 = 7"},
            {"q": "1 + 6 = ?", "options": ["6", "7", "8", "9"], "correct": 1, "exp": "1 + 6 = 7"},
            {"q": "4 + 3 = ?", "options": ["6", "7", "8", "9"], "correct": 1, "exp": "4 + 3 = 7"},
            {"q": "2 + 5 = ?", "options": ["6", "7", "8", "9"], "correct": 1, "exp": "2 + 5 = 7"},
            {"q": "6 + 1 = ?", "options": ["6", "7", "8", "9"], "correct": 1, "exp": "6 + 1 = 7"},
            {"q": "3 + 5 = ?", "options": ["7", "8", "9", "10"], "correct": 1, "exp": "3 + 5 = 8"},
            {"q": "2 + 6 = ?", "options": ["7", "8", "9", "10"], "correct": 1, "exp": "2 + 6 = 8"},
            {"q": "1 + 7 = ?", "options": ["7", "8", "9", "10"], "correct": 1, "exp": "1 + 7 = 8"},
            {"q": "4 + 4 = ?", "options": ["7", "8", "9", "10"], "correct": 1, "exp": "4 + 4 = 8"},
            {"q": "5 + 3 = ?", "options": ["7", "8", "9", "10"], "correct": 1, "exp": "5 + 3 = 8"},
            {"q": "6 + 2 = ?", "options": ["7", "8", "9", "10"], "correct": 1, "exp": "6 + 2 = 8"},
        ]
    },
    11: {
        "title": "Phép trừ trong phạm vi 10",
        "duration": 15,
        "questions": [
            {"q": "7 - 2 = ?", "options": ["4", "5", "6", "7"], "correct": 1, "exp": "7 - 2 = 5"},
            {"q": "8 - 3 = ?", "options": ["4", "5", "6", "7"], "correct": 1, "exp": "8 - 3 = 5"},
            {"q": "9 - 4 = ?", "options": ["4", "5", "6", "7"], "correct": 1, "exp": "9 - 4 = 5"},
            {"q": "6 - 1 = ?", "options": ["4", "5", "6", "7"], "correct": 1, "exp": "6 - 1 = 5"},
            {"q": "10 - 5 = ?", "options": ["4", "5", "6", "7"], "correct": 1, "exp": "10 - 5 = 5"},
            {"q": "7 - 1 = ?", "options": ["5", "6", "7", "8"], "correct": 1, "exp": "7 - 1 = 6"},
            {"q": "8 - 2 = ?", "options": ["5", "6", "7", "8"], "correct": 1, "exp": "8 - 2 = 6"},
            {"q": "9 - 3 = ?", "options": ["5", "6", "7", "8"], "correct": 1, "exp": "9 - 3 = 6"},
            {"q": "10 - 4 = ?", "options": ["5", "6", "7", "8"], "correct": 1, "exp": "10 - 4 = 6"},
            {"q": "8 - 1 = ?", "options": ["6", "7", "8", "9"], "correct": 1, "exp": "8 - 1 = 7"},
            {"q": "9 - 2 = ?", "options": ["6", "7", "8", "9"], "correct": 1, "exp": "9 - 2 = 7"},
            {"q": "10 - 3 = ?", "options": ["6", "7", "8", "9"], "correct": 1, "exp": "10 - 3 = 7"},
        ]
    },
    12: {
        "title": "Phép trừ trong phạm vi 10",
        "duration": 15,
        "questions": [
            {"q": "9 - 1 = ?", "options": ["7", "8", "9", "10"], "correct": 1, "exp": "9 - 1 = 8"},
            {"q": "10 - 2 = ?", "options": ["7", "8", "9", "10"], "correct": 1, "exp": "10 - 2 = 8"},
            {"q": "10 - 1 = ?", "options": ["8", "9", "10", "11"], "correct": 0, "exp": "10 - 1 = 9"},
            {"q": "7 - 3 = ?", "options": ["3", "4", "5", "6"], "correct": 1, "exp": "7 - 3 = 4"},
            {"q": "8 - 4 = ?", "options": ["3", "4", "5", "6"], "correct": 1, "exp": "8 - 4 = 4"},
            {"q": "9 - 5 = ?", "options": ["3", "4", "5", "6"], "correct": 1, "exp": "9 - 5 = 4"},
            {"q": "10 - 6 = ?", "options": ["3", "4", "5", "6"], "correct": 1, "exp": "10 - 6 = 4"},
            {"q": "6 - 2 = ?", "options": ["3", "4", "5", "6"], "correct": 1, "exp": "6 - 2 = 4"},
            {"q": "7 - 4 = ?", "options": ["2", "3", "4", "5"], "correct": 2, "exp": "7 - 4 = 3"},
            {"q": "8 - 5 = ?", "options": ["2", "3", "4", "5"], "correct": 1, "exp": "8 - 5 = 3"},
            {"q": "9 - 6 = ?", "options": ["2", "3", "4", "5"], "correct": 1, "exp": "9 - 6 = 3"},
            {"q": "10 - 7 = ?", "options": ["2", "3", "4", "5"], "correct": 1, "exp": "10 - 7 = 3"},
        ]
    },
    13: {
        "title": "Bảng cộng, bảng trừ trong phạm vi 10",
        "duration": 15,
        "questions": [
            {"q": "Có 5 quả táo, thêm 3 quả nữa. Hỏi có tất cả bao nhiêu quả táo?", "options": ["7 quả", "8 quả", "9 quả", "10 quả"], "correct": 1, "exp": "5 + 3 = 8"},
            {"q": "Có 8 con gà, bay đi 2 con. Hỏi còn lại bao nhiêu con gà?", "options": ["5 con", "6 con", "7 con", "8 con"], "correct": 1, "exp": "8 - 2 = 6"},
            {"q": "Có 6 cái kẹo, mẹ cho thêm 4 cái nữa. Hỏi có tất cả bao nhiêu cái kẹo?", "options": ["9 cái", "10 cái", "11 cái", "12 cái"], "correct": 1, "exp": "6 + 4 = 10"},
            {"q": "Có 9 quả cam, ăn hết 3 quả. Hỏi còn lại bao nhiêu quả cam?", "options": ["5 quả", "6 quả", "7 quả", "8 quả"], "correct": 1, "exp": "9 - 3 = 6"},
            {"q": "Có 7 cái bánh, mua thêm 2 cái nữa. Hỏi có tất cả bao nhiêu cái bánh?", "options": ["8 cái", "9 cái", "10 cái", "11 cái"], "correct": 1, "exp": "7 + 2 = 9"},
            {"q": "Có 10 con chim, bay đi 4 con. Hỏi còn lại bao nhiêu con chim?", "options": ["5 con", "6 con", "7 con", "8 con"], "correct": 1, "exp": "10 - 4 = 6"},
            {"q": "4 + 5 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "4 + 5 = 9"},
            {"q": "3 + 6 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "3 + 6 = 9"},
            {"q": "2 + 7 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "2 + 7 = 9"},
            {"q": "1 + 8 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "1 + 8 = 9"},
            {"q": "5 + 4 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "5 + 4 = 9"},
            {"q": "6 + 3 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "6 + 3 = 9"},
        ]
    },
    14: {
        "title": "Luyện tập chung",
        "duration": 15,
        "questions": [
            {"q": "7 + 2 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "7 + 2 = 9"},
            {"q": "8 + 1 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "8 + 1 = 9"},
            {"q": "9 - 2 = ?", "options": ["6", "7", "8", "9"], "correct": 1, "exp": "9 - 2 = 7"},
            {"q": "10 - 3 = ?", "options": ["6", "7", "8", "9"], "correct": 1, "exp": "10 - 3 = 7"},
            {"q": "Có 5 quả táo và 4 quả cam. Hỏi có tất cả bao nhiêu quả?", "options": ["8 quả", "9 quả", "10 quả", "11 quả"], "correct": 1, "exp": "5 + 4 = 9"},
            {"q": "Có 8 con gà, bay đi 3 con. Hỏi còn lại bao nhiêu con gà?", "options": ["4 con", "5 con", "6 con", "7 con"], "correct": 1, "exp": "8 - 3 = 5"},
            {"q": "6 + 4 = ?", "options": ["9", "10", "11", "12"], "correct": 1, "exp": "6 + 4 = 10"},
            {"q": "5 + 5 = ?", "options": ["9", "10", "11", "12"], "correct": 1, "exp": "5 + 5 = 10"},
            {"q": "10 - 5 = ?", "options": ["4", "5", "6", "7"], "correct": 1, "exp": "10 - 5 = 5"},
            {"q": "9 - 4 = ?", "options": ["4", "5", "6", "7"], "correct": 1, "exp": "9 - 4 = 5"},
            {"q": "Có 7 cái kẹo, chia đều cho 2 bạn. Mỗi bạn được bao nhiêu cái? (Làm tròn)", "options": ["3 cái", "4 cái", "5 cái", "6 cái"], "correct": 1, "exp": "7 : 2 = 3 dư 1, mỗi bạn được 3 cái"},
            {"q": "Có 10 quả cam, chia đều cho 5 bạn. Mỗi bạn được bao nhiêu quả?", "options": ["1 quả", "2 quả", "3 quả", "4 quả"], "correct": 1, "exp": "10 : 5 = 2"},
        ]
    },
}

def balance_answers(questions):
    """Cân bằng phân bổ đáp án A, B, C, D"""
    # Đếm số câu hỏi hiện tại
    answer_counts = Counter([q["correct"] for q in questions])
    total = len(questions)
    
    # Mục tiêu: mỗi đáp án ~25%
    target_per_answer = total // 4
    remainder = total % 4
    
    # Phân bổ đáp án
    target_distribution = {0: target_per_answer, 1: target_per_answer, 2: target_per_answer, 3: target_per_answer}
    # Phân bổ phần dư
    for i in range(remainder):
        target_distribution[i] += 1
    
    # Điều chỉnh nếu cần
    current_distribution = {0: 0, 1: 0, 2: 0, 3: 0}
    for q in questions:
        current_distribution[q["correct"]] += 1
    
    # Nếu phân bổ không đều, điều chỉnh
    adjustments = []
    for ans in range(4):
        diff = current_distribution[ans] - target_distribution[ans]
        if diff > 0:
            adjustments.append((ans, -diff))
        elif diff < 0:
            adjustments.append((ans, -diff))
    
    return questions

def create_week_file(week_num, week_data, output_dir):
    """Tạo file JSON cho một tuần"""
    # Cân bằng đáp án
    questions = balance_answers(week_data["questions"])
    
    # Tạo cấu trúc JSON
    json_data = {
        "week": week_num,
        "subject": "math",
        "grade": 1,
        "bookSeries": "ket-noi-tri-thuc",
        "lessons": [
            {
                "id": f"lesson-1",
                "title": week_data["title"],
                "duration": week_data["duration"],
                "questions": []
            }
        ]
    }
    
    # Thêm câu hỏi
    for i, q_data in enumerate(questions, 1):
        question = {
            "id": f"q{i}",
            "type": "multiple-choice",
            "question": q_data["q"],
            "options": q_data["options"],
            "correctAnswer": q_data["correct"],
            "explanation": q_data["exp"],
            "imageUrl": None
        }
        json_data["lessons"][0]["questions"].append(question)
    
    # Ghi file
    output_path = output_dir / f"week-{week_num}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    
    # Kiểm tra phân bổ đáp án
    answer_counts = Counter([q["correct"] for q in questions])
    print(f"Week {week_num}: {answer_counts}")
    
    return output_path

def main():
    """Main function"""
    import sys
    import codecs
    # Fix encoding cho Windows console
    if sys.platform == 'win32':
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')
    
    output_dir = Path("public/data/questions/ket-noi-tri-thuc/grade-1/math")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("Tạo các file toán lớp 1...")
    print("=" * 70)
    
    for week_num, week_data in WEEKS_DATA.items():
        create_week_file(week_num, week_data, output_dir)
        print(f"✅ Đã tạo week-{week_num}.json")
    
    print("=" * 70)
    print("✅ Hoàn thành!")

if __name__ == "__main__":
    main()

