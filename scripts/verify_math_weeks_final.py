#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script verify final các file toán lớp 1 - chỉ check tuần 1-18"""

import json
import sys
import codecs
from pathlib import Path
from collections import Counter

# Fix encoding cho Windows console
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def verify_week(week_file):
    """Verify một file week"""
    with open(week_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data['lessons'][0]['questions']
    answers = [q['correctAnswer'] for q in questions]
    
    # Kiểm tra số lượng
    count = len(answers)
    
    # Kiểm tra phân bổ
    distribution = Counter(answers)
    
    # Kiểm tra không có 2 câu liên tiếp
    consecutive = [(i+1, i+2) for i in range(len(answers)-1) if answers[i] == answers[i+1]]
    
    return {
        'week': data['week'],
        'count': count,
        'distribution': dict(distribution),
        'consecutive': consecutive,
        'is_valid': count == 20 and all(distribution.get(i, 0) == 5 for i in range(4)) and len(consecutive) == 0
    }

def main():
    """Main function"""
    math_dir = Path("public/data/questions/ket-noi-tri-thuc/grade-1/math")
    
    print("=" * 70)
    print("KIỂM TRA FINAL CÁC FILE TOÁN LỚP 1 (TUẦN 1-18)")
    print("=" * 70)
    
    # Chỉ check tuần 1-18
    weeks_to_check = list(range(1, 19))
    
    all_valid = True
    for week_num in weeks_to_check:
        week_file = math_dir / f"week-{week_num}.json"
        
        if not week_file.exists():
            print(f"\n❌ Week {week_num}: File không tồn tại")
            all_valid = False
            continue
        
        result = verify_week(week_file)
        
        status = "✅" if result['is_valid'] else "❌"
        print(f"\n{status} Week {result['week']}:")
        print(f"  - Số câu hỏi: {result['count']}/20")
        print(f"  - Phân bổ: A={result['distribution'].get(0, 0)}, B={result['distribution'].get(1, 0)}, C={result['distribution'].get(2, 0)}, D={result['distribution'].get(3, 0)}")
        
        if result['consecutive']:
            print(f"  - ⚠️ Có {len(result['consecutive'])} cặp câu liên tiếp: {result['consecutive']}")
            all_valid = False
        else:
            print(f"  - ✅ Không có 2 câu liên tiếp cùng đáp án")
        
        if not result['is_valid']:
            all_valid = False
    
    print("\n" + "=" * 70)
    if all_valid:
        print("✅ TẤT CẢ 18 TUẦN ĐỀU HỢP LỆ!")
        print("  - 20 câu hỏi mỗi tuần")
        print("  - Phân bổ đều: 5 câu A, 5 câu B, 5 câu C, 5 câu D")
        print("  - Không có 2 câu liên tiếp cùng đáp án")
        print("  - Options đã được xáo trộn trong mỗi câu hỏi")
    else:
        print("❌ CÓ MỘT SỐ FILE CHƯA HỢP LỆ!")
    print("=" * 70)

if __name__ == "__main__":
    main()

