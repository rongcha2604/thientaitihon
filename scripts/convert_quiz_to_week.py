#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script chuyển đổi quiz file từ format test sang format week

QUY TẮC TẠO ĐỀ (theo cấu trúc grade-3/math):
1. Cấu trúc JSON:
   {
     "week": <số tuần>,
     "subject": "math",
     "grade": 3,
     "bookSeries": "ket-noi-tri-thuc",
     "lessons": [
       {
         "id": "lesson-1",
         "title": "ĐỀ THI TUẦN {week} - THỬ THÁCH 1 - LỚP {grade}",
         "duration": 30,
         "questions": [...]
       }
     ]
   }

2. Format câu hỏi:
   - id: "q1", "q2", "q3", ...
   - type: "multiple-choice"
   - options: array [a, b, c, d] - LUÔN có 4 đáp án
   - correctAnswer: index (0, 1, 2, 3) - CHỈ 1 đáp án đúng
   - explanation: string
   - imageUrl: null

3. QUY TẮC PHÂN PHỐI ĐÁP ÁN ĐÚNG (BẮT BUỘC):
   - Mỗi bộ đề có ĐÚNG 12 câu hỏi
   - Mỗi câu hỏi có ĐÚNG 4 đáp án (A, B, C, D)
   - Phân phối đáp án đúng: 3 câu A, 3 câu B, 3 câu C, 3 câu D (tổng 12 câu)
   - Xáo trộn đáp án đúng: KHÔNG có 2 câu liên tiếp có cùng đáp án đúng
     Ví dụ: Câu 1 đáp án đúng là A → Câu 2 phải khác A (B, C, hoặc D)
   - KIỂM TRA KỸ: Đảm bảo đáp án đúng phải khớp với câu hỏi và explanation

4. Vị trí lưu file:
   - public/data/questions/ket-noi-tri-thuc/grade-{grade}/{subject}/
   - Tên file: week-{week}.json

Ví dụ: public/data/questions/ket-noi-tri-thuc/grade-3/math/week-14.json
"""

import json
import os
import sys
import random
from pathlib import Path

# Fix encoding cho Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def generate_answer_distribution(num_questions=12):
    """
    Tạo phân phối đáp án đúng: 3 câu A, 3 câu B, 3 câu C, 3 câu D
    Xáo trộn để không có 2 câu liên tiếp có cùng đáp án đúng
    
    Returns: list of answer indices [0, 1, 2, 3] đã xáo trộn
    """
    # Tạo phân phối: 3 câu mỗi đáp án
    answers = [0] * 3 + [1] * 3 + [2] * 3 + [3] * 3  # [0,0,0,1,1,1,2,2,2,3,3,3]
    
    # Xáo trộn cho đến khi không có 2 câu liên tiếp trùng nhau
    max_attempts = 1000
    for attempt in range(max_attempts):
        random.shuffle(answers)
        # Kiểm tra không có 2 câu liên tiếp trùng nhau
        has_consecutive = False
        for i in range(len(answers) - 1):
            if answers[i] == answers[i + 1]:
                has_consecutive = True
                break
        if not has_consecutive:
            return answers
    
    # Nếu không tìm được sau max_attempts, thử sắp xếp thủ công
    # Pattern: 0,1,2,3,0,1,2,3,0,1,2,3
    return [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]

def convert_quiz_to_week(input_file, output_dir, book_series='ket-noi-tri-thuc', subject='math', grade=3):
    """Convert quiz file từ format test sang format week theo cấu trúc grade-3/math"""
    
    # Đọc file quiz
    with open(input_file, 'r', encoding='utf-8') as f:
        quiz_data = json.load(f)
    
    # Lấy thông tin từ quiz hoặc dùng giá trị mặc định
    grade = quiz_data.get('grade', grade)
    week = quiz_data.get('week', 1)
    
    # Format title theo chuẩn: "ĐỀ THI TUẦN {week} - THỬ THÁCH 1 - LỚP {grade}"
    title = f'ĐỀ THI TUẦN {week} - THỬ THÁCH 1 - LỚP {grade}'
    
    # Lấy danh sách câu hỏi từ quiz
    questions_raw = quiz_data.get('questions', [])
    
    # Kiểm tra số lượng câu hỏi
    if len(questions_raw) != 12:
        print(f'⚠️  CẢNH BÁO: Số câu hỏi là {len(questions_raw)}, cần đúng 12 câu!')
        if len(questions_raw) > 12:
            print(f'   → Chỉ lấy 12 câu đầu tiên')
            questions_raw = questions_raw[:12]
        elif len(questions_raw) < 12:
            print(f'   → Thiếu {12 - len(questions_raw)} câu hỏi!')
    
    # Tạo phân phối đáp án đúng: 3-3-3-3, không trùng liên tiếp
    answer_distribution = generate_answer_distribution(12)
    
    # Convert questions và áp dụng phân phối đáp án
    questions_new = []
    original_answers = []  # Lưu đáp án gốc để kiểm tra
    
    for idx, q in enumerate(questions_raw[:12], start=1):
        # Convert options từ object {a, b, c, d} sang array
        options_obj = q.get('options', {})
        options_array = [
            options_obj.get('a', ''),
            options_obj.get('b', ''),
            options_obj.get('c', ''),
            options_obj.get('d', '')
        ]
        
        # Kiểm tra có đủ 4 đáp án
        if len([opt for opt in options_array if opt]) < 4:
            print(f'⚠️  CẢNH BÁO: Câu {idx} không đủ 4 đáp án!')
        
        # Lấy đáp án đúng gốc từ quiz
        correct_answer_str = q.get('correctAnswer', 'a').lower()
        answer_mapping = {'a': 0, 'b': 1, 'c': 2, 'd': 3}
        original_correct_index = answer_mapping.get(correct_answer_str, 0)
        original_answers.append(original_correct_index)
        
        # Lấy đáp án đúng từ phân phối (theo thứ tự câu hỏi)
        target_answer_index = answer_distribution[idx - 1]
        
        # Nếu đáp án gốc khác với phân phối, cần đổi thứ tự options
        # Đưa đáp án đúng vào vị trí target_answer_index
        if original_correct_index != target_answer_index:
            # Lưu đáp án đúng
            correct_answer_text = options_array[original_correct_index]
            # Lấy các đáp án sai (giữ nguyên thứ tự)
            wrong_answers = [options_array[i] for i in range(4) if i != original_correct_index]
            # Tạo options mới: đặt đáp án đúng vào vị trí target, điền các đáp án sai vào vị trí còn lại
            options_array_new = [None] * 4
            options_array_new[target_answer_index] = correct_answer_text
            # Điền các đáp án sai vào các vị trí còn lại
            wrong_idx = 0
            for i in range(4):
                if options_array_new[i] is None:
                    options_array_new[i] = wrong_answers[wrong_idx]
                    wrong_idx += 1
            options_array = options_array_new
        
        # Tạo question mới với id format: q1, q2, q3, ...
        question_new = {
            'id': f'q{idx}',
            'type': 'multiple-choice',
            'question': q.get('question', ''),
            'options': options_array,
            'correctAnswer': target_answer_index,  # Dùng đáp án từ phân phối
            'explanation': q.get('explanation', ''),
            'imageUrl': None
        }
        questions_new.append(question_new)
    
    # Kiểm tra phân phối đáp án
    answer_counts = [0, 0, 0, 0]
    for q in questions_new:
        answer_counts[q['correctAnswer']] += 1
    
    # Kiểm tra không có 2 câu liên tiếp trùng đáp án
    consecutive_errors = []
    for i in range(len(questions_new) - 1):
        if questions_new[i]['correctAnswer'] == questions_new[i + 1]['correctAnswer']:
            consecutive_errors.append((i + 1, i + 2))
    
    # In thông tin kiểm tra
    print(f'📊 Phân phối đáp án đúng: A={answer_counts[0]}, B={answer_counts[1]}, C={answer_counts[2]}, D={answer_counts[3]}')
    if consecutive_errors:
        print(f'⚠️  CẢNH BÁO: Có {len(consecutive_errors)} cặp câu liên tiếp trùng đáp án: {consecutive_errors}')
    else:
        print(f'✅ Không có câu liên tiếp trùng đáp án')
    
    # Tạo week data structure theo đúng format grade-3/math
    week_data = {
        'week': week,
        'subject': subject,
        'grade': grade,
        'bookSeries': book_series,
        'lessons': [
            {
                'id': 'lesson-1',
                'title': title,
                'duration': quiz_data.get('timeLimit', 30),  # Sử dụng timeLimit từ quiz, mặc định 30 phút
                'questions': questions_new
            }
        ]
    }
    
    # Tạo output directory nếu chưa có
    os.makedirs(output_dir, exist_ok=True)
    
    # Ghi file với tên: week-{week}.json
    output_file = os.path.join(output_dir, f'week-{week}.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(week_data, f, ensure_ascii=False, indent=2)
    
    print(f'✅ Đã convert và lưu: {output_file}')
    print(f'   - {len(questions_new)} câu hỏi')
    print(f'   - Grade: {grade}, Week: {week}, Subject: {subject}')
    print(f'   - Title: {title}')
    
    return output_file

if __name__ == '__main__':
    import sys
    import argparse
    
    parser = argparse.ArgumentParser(description='Convert quiz file sang format week cho grade-3/math')
    parser.add_argument('input_file', nargs='?', default='data/de-thi-tuan-1-lop-3.json',
                       help='Đường dẫn file quiz input (JSON)')
    parser.add_argument('--grade', type=int, default=3, help='Lớp (mặc định: 3)')
    parser.add_argument('--subject', default='math', help='Môn học (mặc định: math)')
    parser.add_argument('--book-series', default='ket-noi-tri-thuc', 
                       help='Bộ sách (mặc định: ket-noi-tri-thuc)')
    parser.add_argument('--output-dir', 
                       default='public/data/questions/ket-noi-tri-thuc/grade-3/math',
                       help='Thư mục output (mặc định: public/data/questions/ket-noi-tri-thuc/grade-3/math)')
    
    args = parser.parse_args()
    
    # Đường dẫn output: public/data/questions/ket-noi-tri-thuc/grade-{grade}/{subject}/
    # Tự động tạo output_dir dựa trên grade và subject nếu không chỉ định
    if args.output_dir == parser.get_default('output_dir'):
        output_dir = Path(f'public/data/questions/{args.book_series}/grade-{args.grade}/{args.subject}')
    else:
        output_dir = Path(args.output_dir)
    
    convert_quiz_to_week(
        args.input_file, 
        output_dir, 
        book_series=args.book_series, 
        subject=args.subject,
        grade=args.grade
    )

