#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script điều chỉnh phân bổ đáp án đúng đều cho A, B, C, D (25% mỗi loại)
"""

import json
import sys
import codecs
from pathlib import Path
from collections import Counter
import random

# Fix encoding cho Windows console
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def balance_answers_in_file(file_path):
    """Điều chỉnh phân bổ đáp án trong một file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        week = data.get("week", 0)
        lessons = data.get("lessons", [])
        
        all_questions = []
        for lesson in lessons:
            questions = lesson.get("questions", [])
            all_questions.extend(questions)
        
        total = len(all_questions)
        if total == 0:
            return {"week": week, "status": "no_questions"}
        
        # Mục tiêu: mỗi đáp án ~25%
        target_per_answer = total // 4
        remainder = total % 4
        
        # Phân bổ đáp án
        target_distribution = {0: target_per_answer, 1: target_per_answer, 2: target_per_answer, 3: target_per_answer}
        # Phân bổ phần dư
        for i in range(remainder):
            target_distribution[i] += 1
        
        # Đếm số câu hỏi hiện tại theo đáp án
        current_distribution = {0: 0, 1: 0, 2: 0, 3: 0}
        for question in all_questions:
            correct_answer = question.get("correctAnswer", 0)
            if 0 <= correct_answer < 4:
                current_distribution[correct_answer] += 1
        
        # Tính số câu hỏi cần điều chỉnh
        adjustments_needed = {}
        for ans in range(4):
            diff = current_distribution[ans] - target_distribution[ans]
            adjustments_needed[ans] = -diff  # Số câu cần tăng (âm = cần giảm)
        
        # Điều chỉnh câu hỏi
        # Tìm các câu hỏi có thể đổi đáp án (không ảnh hưởng logic)
        # Tạm thời, chỉ điều chỉnh các câu hỏi có thể đổi mà không ảnh hưởng logic
        
        # Đếm lại sau khi điều chỉnh
        new_distribution = {0: 0, 1: 0, 2: 0, 3: 0}
        for question in all_questions:
            correct_answer = question.get("correctAnswer", 0)
            if 0 <= correct_answer < 4:
                new_distribution[correct_answer] += 1
        
        # Ghi lại file
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        return {
            "week": week,
            "total": total,
            "before": current_distribution,
            "after": new_distribution,
            "target": target_distribution,
            "status": "balanced"
        }
    
    except Exception as e:
        return {
            "week": 0,
            "error": str(e)
        }

def main():
    """Main function"""
    base_dir = Path("public/data/questions/ket-noi-tri-thuc/grade-1/math")
    
    print("=" * 70)
    print("🔧 ĐIỀU CHỈNH PHÂN BỔ ĐÁP ÁN")
    print("=" * 70)
    print()
    
    results = []
    
    # Kiểm tra tất cả file week-*.json
    for week_file in sorted(base_dir.glob("week-*.json")):
        result = balance_answers_in_file(week_file)
        results.append(result)
        
        if "error" in result:
            print(f"❌ {week_file.name}: {result['error']}")
        elif result.get("status") == "no_questions":
            print(f"⚠️  {week_file.name}: Không có câu hỏi")
        else:
            week = result["week"]
            total = result["total"]
            before = result["before"]
            after = result["after"]
            target = result["target"]
            
            # Tính tỷ lệ phần trăm
            before_pct = {ans: (before[ans] / total * 100) if total > 0 else 0 for ans in range(4)}
            after_pct = {ans: (after[ans] / total * 100) if total > 0 else 0 for ans in range(4)}
            
            # Kiểm tra xem có cần điều chỉnh không
            needs_adjustment = False
            for ans in range(4):
                if after_pct[ans] < 15 or after_pct[ans] > 35:
                    needs_adjustment = True
                    break
            
            if needs_adjustment:
                print(f"⚠️  Week {week}: {total} câu hỏi - Cần điều chỉnh")
                print(f"   Trước: A={before_pct[0]:.1f}%, B={before_pct[1]:.1f}%, C={before_pct[2]:.1f}%, D={before_pct[3]:.1f}%")
                print(f"   Sau:   A={after_pct[0]:.1f}%, B={after_pct[1]:.1f}%, C={after_pct[2]:.1f}%, D={after_pct[3]:.1f}%")
            else:
                print(f"✅ Week {week}: OK - {total} câu hỏi")
                print(f"   Phân bổ: A={after_pct[0]:.1f}%, B={after_pct[1]:.1f}%, C={after_pct[2]:.1f}%, D={after_pct[3]:.1f}%")
    
    print()
    print("=" * 70)
    print("📊 TỔNG KẾT")
    print("=" * 70)
    print(f"📁 Files đã kiểm tra: {len(results)}")
    print()
    print("💡 Lưu ý: Script này chỉ kiểm tra phân bổ, không tự động điều chỉnh.")
    print("   Để điều chỉnh, cần sửa thủ công từng file để đảm bảo logic đúng.")
    print()
    print("=" * 70)

if __name__ == "__main__":
    main()

