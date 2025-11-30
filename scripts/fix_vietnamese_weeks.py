#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script kiểm tra và sửa phân phối đáp án đúng cho các tuần Tiếng Việt lớp 3
Đảm bảo: 3-3-3-3 và không có 2 câu liên tiếp cùng đáp án
"""

import json
import random
import sys
from pathlib import Path

# Fix encoding cho Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def generate_answer_distribution(num_questions=12):
    """Tạo phân phối đáp án đúng: 3 câu A, 3 câu B, 3 câu C, 3 câu D, không trùng liên tiếp"""
    # Tạo phân phối: 3 câu mỗi đáp án
    answers = [0] * 3 + [1] * 3 + [2] * 3 + [3] * 3
    
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
    
    # Nếu không tìm được, dùng pattern: 0,1,2,3,0,1,2,3,0,1,2,3
    return [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]

def fix_week_file(file_path, target_distribution):
    """Sửa file week để có phân phối đáp án đúng"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data['lessons'][0]['questions']
    
    # Kiểm tra và sửa từng câu hỏi
    for idx, q in enumerate(questions):
        original_correct = q['correctAnswer']
        target_correct = target_distribution[idx]
        
        # Nếu đáp án đúng khác với phân phối, cần đổi thứ tự options
        if original_correct != target_correct:
            options = q['options'].copy()
            correct_text = options[original_correct]
            wrong_texts = [options[i] for i in range(4) if i != original_correct]
            
            # Tạo options mới: đặt đáp án đúng vào vị trí target
            new_options = [None] * 4
            new_options[target_correct] = correct_text
            
            # Điền các đáp án sai vào vị trí còn lại
            wrong_idx = 0
            for i in range(4):
                if new_options[i] is None:
                    new_options[i] = wrong_texts[wrong_idx]
                    wrong_idx += 1
            
            q['options'] = new_options
            q['correctAnswer'] = target_correct
    
    # Ghi lại file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Kiểm tra kết quả
    answer_counts = [0, 0, 0, 0]
    consecutive_errors = []
    for idx, q in enumerate(questions):
        answer_counts[q['correctAnswer']] += 1
        if idx < len(questions) - 1:
            if questions[idx]['correctAnswer'] == questions[idx + 1]['correctAnswer']:
                consecutive_errors.append((idx + 1, idx + 2))
    
    print(f"  Phân phối: A={answer_counts[0]}, B={answer_counts[1]}, C={answer_counts[2]}, D={answer_counts[3]}")
    if consecutive_errors:
        print(f"  ⚠️  Có {len(consecutive_errors)} cặp câu liên tiếp trùng đáp án: {consecutive_errors}")
    else:
        print(f"  ✅ Không có câu liên tiếp trùng đáp án")

def main():
    base_dir = Path('public/data/questions/ket-noi-tri-thuc/grade-3/vietnamese')
    
    # Tạo phân phối đáp án đúng
    target_distribution = generate_answer_distribution(12)
    print(f"Phân phối đáp án đúng: {target_distribution}")
    print(f"  A={target_distribution.count(0)}, B={target_distribution.count(1)}, C={target_distribution.count(2)}, D={target_distribution.count(3)}")
    print()
    
    # Sửa từng tuần
    for week in range(33, 37):
        file_path = base_dir / f'week-{week}.json'
        if file_path.exists():
            print(f"Tuần {week}:")
            fix_week_file(file_path, target_distribution)
            print()
        else:
            print(f"⚠️  Không tìm thấy file: {file_path}")

if __name__ == '__main__':
    main()

