#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để test toàn bộ đề toán khối 2
Kiểm tra:
1. JSON format đúng không
2. Phân bổ đáp án đúng có đều không (3A, 3B, 3C, 3D)
3. Có đủ 12 câu hỏi không
4. Cấu trúc dữ liệu có đúng không
"""

import json
import os
from collections import Counter
from pathlib import Path

def test_json_file(file_path):
    """Test một file JSON"""
    errors = []
    warnings = []
    
    try:
        # 1. Kiểm tra JSON format
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 2. Kiểm tra cấu trúc
        required_fields = ['week', 'subject', 'grade', 'bookSeries', 'lessons']
        for field in required_fields:
            if field not in data:
                errors.append(f"Thiếu field: {field}")
        
        # 3. Kiểm tra lessons
        if 'lessons' in data and len(data['lessons']) > 0:
            lesson = data['lessons'][0]
            if 'questions' not in lesson:
                errors.append("Thiếu 'questions' trong lesson")
            else:
                questions = lesson['questions']
                
                # 4. Kiểm tra số lượng câu hỏi
                if len(questions) != 12:
                    errors.append(f"Có {len(questions)} câu hỏi, cần 12 câu")
                
                # 5. Kiểm tra phân bổ đáp án đúng
                correct_answers = [q.get('correctAnswer') for q in questions if 'correctAnswer' in q]
                answer_counts = Counter(correct_answers)
                
                # Phải có đúng 3 câu mỗi đáp án (0=A, 1=B, 2=C, 3=D)
                expected_distribution = {0: 3, 1: 3, 2: 3, 3: 3}
                for answer, count in expected_distribution.items():
                    actual_count = answer_counts.get(answer, 0)
                    if actual_count != count:
                        warnings.append(f"Đáp án {['A','B','C','D'][answer]}: có {actual_count} câu, cần {count} câu")
                
                # 6. Kiểm tra từng câu hỏi
                for i, q in enumerate(questions, 1):
                    required_q_fields = ['id', 'type', 'question', 'options', 'correctAnswer', 'explanation']
                    for field in required_q_fields:
                        if field not in q:
                            errors.append(f"Câu {i}: Thiếu field '{field}'")
                    
                    # Kiểm tra options
                    if 'options' in q:
                        if len(q['options']) != 4:
                            errors.append(f"Câu {i}: Có {len(q['options'])} lựa chọn, cần 4 lựa chọn")
                    
                    # Kiểm tra correctAnswer hợp lệ
                    if 'correctAnswer' in q and 'options' in q:
                        if q['correctAnswer'] < 0 or q['correctAnswer'] >= len(q['options']):
                            errors.append(f"Câu {i}: correctAnswer ({q['correctAnswer']}) không hợp lệ")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings,
            'answer_distribution': dict(answer_counts) if 'questions' in lesson else {}
        }
    
    except json.JSONDecodeError as e:
        return {
            'valid': False,
            'errors': [f"JSON không hợp lệ: {str(e)}"],
            'warnings': [],
            'answer_distribution': {}
        }
    except Exception as e:
        return {
            'valid': False,
            'errors': [f"Lỗi khi đọc file: {str(e)}"],
            'warnings': [],
            'answer_distribution': {}
        }

def main():
    """Test tất cả các file JSON"""
    base_path = Path("public/data/questions/ket-noi-tri-thuc/grade-2/math")
    
    if not base_path.exists():
        print(f"[ERROR] Khong tim thay thu muc: {base_path}")
        return
    
    files = sorted(base_path.glob("week-*.json"))
    
    if not files:
        print(f"[ERROR] Khong tim thay file JSON nao trong {base_path}")
        return
    
    print(f"Dang test {len(files)} file JSON...\n")
    
    total_errors = 0
    total_warnings = 0
    valid_files = 0
    invalid_files = 0
    
    results = []
    
    for file_path in files:
        week_num = file_path.stem.split('-')[1]
        result = test_json_file(file_path)
        
        results.append({
            'week': week_num,
            'file': file_path.name,
            'result': result
        })
        
        if result['valid']:
            valid_files += 1
        else:
            invalid_files += 1
        
        total_errors += len(result['errors'])
        total_warnings += len(result['warnings'])
    
    # In kết quả
    print("=" * 80)
    print("KET QUA TEST TONG QUAN")
    print("=" * 80)
    print(f"[OK] File hop le: {valid_files}/{len(files)}")
    print(f"[ERROR] File khong hop le: {invalid_files}/{len(files)}")
    print(f"[WARNING] Tong so loi: {total_errors}")
    print(f"[WARNING] Tong so canh bao: {total_warnings}")
    print()
    
    # In chi tiết các file có vấn đề
    if total_errors > 0 or total_warnings > 0:
        print("=" * 80)
        print("CHI TIET CAC FILE CO VAN DE")
        print("=" * 80)
        
        for r in results:
            if r['result']['errors'] or r['result']['warnings']:
                print(f"\nWeek {r['week']} ({r['file']}):")
                
                if r['result']['errors']:
                    print("  [ERROR] Loi:")
                    for error in r['result']['errors']:
                        print(f"     - {error}")
                
                if r['result']['warnings']:
                    print("  [WARNING] Canh bao:")
                    for warning in r['result']['warnings']:
                        print(f"     - {warning}")
                
                if r['result']['answer_distribution']:
                    print(f"  Phan bo dap an: {r['result']['answer_distribution']}")
    
    # In phân bổ đáp án cho tất cả các file
    print("\n" + "=" * 80)
    print("PHAN BO DAP AN DUNG (Tong hop)")
    print("=" * 80)
    
    all_distributions = {}
    for r in results:
        week = r['week']
        dist = r['result']['answer_distribution']
        if dist:
            all_distributions[week] = dist
    
    # Đếm số file có phân bổ đúng
    correct_distribution_count = 0
    for week, dist in all_distributions.items():
        expected = {0: 3, 1: 3, 2: 3, 3: 3}
        if dist == expected:
            correct_distribution_count += 1
        else:
            print(f"Week {week}: {dist} ([ERROR] Khong deu)")
    
    print(f"\n[OK] So file co phan bo dung (3A, 3B, 3C, 3D): {correct_distribution_count}/{len(files)}")
    
    # Kết luận
    print("\n" + "=" * 80)
    if total_errors == 0 and total_warnings == 0:
        print("[OK] TAT CA FILE DEU HOP LE!")
    elif total_errors == 0:
        print("[WARNING] CO CANH BAO VE PHAN BO DAP AN!")
    else:
        print("[ERROR] CO LOI CAN SUA!")
    print("=" * 80)

if __name__ == "__main__":
    main()

