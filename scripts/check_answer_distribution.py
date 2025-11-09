#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script kiểm tra phân bổ đáp án đúng đều cho A, B, C, D (25% mỗi loại)
và rà soát kỹ lại đáp án đúng và câu hỏi
"""

import json
import sys
import codecs
from pathlib import Path
from collections import Counter

# Fix encoding cho Windows console
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def check_answer_distribution(file_path):
    """Kiểm tra phân bổ đáp án trong một file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        week = data.get("week", 0)
        lessons = data.get("lessons", [])
        
        all_answers = []
        all_questions = []
        
        for lesson in lessons:
            questions = lesson.get("questions", [])
            for question in questions:
                q_id = question.get("id", "unknown")
                correct_answer = question.get("correctAnswer", -1)
                question_text = question.get("question", "")
                options = question.get("options", [])
                explanation = question.get("explanation", "")
                
                all_answers.append(correct_answer)
                all_questions.append({
                    "id": q_id,
                    "question": question_text,
                    "options": options,
                    "correctAnswer": correct_answer,
                    "explanation": explanation
                })
        
        # Đếm phân bổ đáp án
        answer_counts = Counter(all_answers)
        total = len(all_answers)
        
        # Tính tỷ lệ phần trăm
        percentages = {}
        for ans in range(4):
            count = answer_counts.get(ans, 0)
            percentages[ans] = (count / total * 100) if total > 0 else 0
        
        return {
            "week": week,
            "total": total,
            "counts": dict(answer_counts),
            "percentages": percentages,
            "questions": all_questions
        }
    
    except Exception as e:
        return {
            "week": 0,
            "error": str(e)
        }

def check_question_logic(question):
    """Kiểm tra logic câu hỏi và đáp án đúng"""
    issues = []
    
    q_text = question["question"]
    options = question["options"]
    correct_index = question["correctAnswer"]
    explanation = question["explanation"]
    
    # Kiểm tra index hợp lệ
    if not isinstance(correct_index, int) or correct_index < 0 or correct_index >= len(options):
        issues.append(f"❌ Question {question['id']}: Invalid correctAnswer index {correct_index} (should be 0-{len(options)-1})")
        return issues
    
    correct_answer = options[correct_index]
    
    # Kiểm tra câu hỏi toán học
    # Pattern 1: "X + Y = ?"
    if " = ?" in q_text or "= ?" in q_text:
        # Tìm phép tính trong câu hỏi
        import re
        # Tìm phép cộng: "X + Y"
        match = re.search(r'(\d+)\s*\+\s*(\d+)', q_text)
        if match:
            x, y = int(match.group(1)), int(match.group(2))
            expected = x + y
            # Kiểm tra đáp án đúng
            try:
                correct_value = int(correct_answer.replace(" quả", "").replace(" con", "").replace(" cái", "").replace(" cái", "").strip())
                if correct_value != expected:
                    issues.append(f"⚠️  Question {question['id']}: Phép tính {x} + {y} = {expected} nhưng đáp án đúng là '{correct_answer}' (giá trị {correct_value})")
            except:
                # Nếu không parse được số, có thể là đáp án dạng text
                pass
        
        # Tìm phép trừ: "X - Y"
        match = re.search(r'(\d+)\s*-\s*(\d+)', q_text)
        if match:
            x, y = int(match.group(1)), int(match.group(2))
            expected = x - y
            # Kiểm tra đáp án đúng
            try:
                correct_value = int(correct_answer.replace(" quả", "").replace(" con", "").replace(" cái", "").replace(" cái", "").strip())
                if correct_value != expected:
                    issues.append(f"⚠️  Question {question['id']}: Phép tính {x} - {y} = {expected} nhưng đáp án đúng là '{correct_answer}' (giá trị {correct_value})")
            except:
                pass
    
    # Pattern 2: "Có X, thêm Y. Hỏi có tất cả bao nhiêu?"
    if "thêm" in q_text and "tất cả" in q_text:
        import re
        match = re.search(r'Có\s+(\d+)', q_text)
        match2 = re.search(r'thêm\s+(\d+)', q_text)
        if match and match2:
            x, y = int(match.group(1)), int(match2.group(1))
            expected = x + y
            # Kiểm tra đáp án đúng
            try:
                correct_value = int(correct_answer.replace(" quả", "").replace(" con", "").replace(" cái", "").replace(" cái", "").strip())
                if correct_value != expected:
                    issues.append(f"⚠️  Question {question['id']}: Có {x}, thêm {y} = {expected} nhưng đáp án đúng là '{correct_answer}' (giá trị {correct_value})")
            except:
                pass
    
    # Pattern 3: "Có X, bay đi/ăn hết Y. Hỏi còn lại bao nhiêu?"
    if ("bay đi" in q_text or "ăn hết" in q_text or "dùng hết" in q_text) and "còn lại" in q_text:
        import re
        match = re.search(r'Có\s+(\d+)', q_text)
        match2 = re.search(r'(bay đi|ăn hết|dùng hết)\s+(\d+)', q_text)
        if match and match2:
            x, y = int(match.group(1)), int(match2.group(2))
            expected = x - y
            # Kiểm tra đáp án đúng
            try:
                correct_value = int(correct_answer.replace(" quả", "").replace(" con", "").replace(" cái", "").replace(" cái", "").strip())
                if correct_value != expected:
                    issues.append(f"⚠️  Question {question['id']}: Có {x}, bay đi/ăn hết {y} = {expected} nhưng đáp án đúng là '{correct_answer}' (giá trị {correct_value})")
            except:
                pass
    
    return issues

def main():
    """Main function"""
    base_dir = Path("public/data/questions/ket-noi-tri-thuc/grade-1/math")
    
    print("=" * 70)
    print("🔍 KIỂM TRA PHÂN BỔ ĐÁP ÁN VÀ RÀ SOÁT KỸ LẠI")
    print("=" * 70)
    print()
    
    all_issues = []
    all_distributions = []
    files_checked = 0
    total_questions = 0
    
    # Kiểm tra tất cả file week-*.json
    for week_file in sorted(base_dir.glob("week-*.json")):
        files_checked += 1
        result = check_answer_distribution(week_file)
        
        if "error" in result:
            all_issues.append(f"❌ {week_file.name}: {result['error']}")
            print(f"❌ {week_file.name}: Lỗi đọc file")
            continue
        
        week = result["week"]
        total = result["total"]
        counts = result["counts"]
        percentages = result["percentages"]
        questions = result["questions"]
        
        total_questions += total
        
        # Kiểm tra phân bổ đáp án
        distribution_ok = True
        for ans in range(4):
            percentage = percentages.get(ans, 0)
            # Cho phép sai lệch ±10% (15% - 35%)
            if percentage < 15 or percentage > 35:
                distribution_ok = False
                break
        
        # Kiểm tra logic từng câu hỏi
        logic_issues = []
        for question in questions:
            issues = check_question_logic(question)
            if issues:
                logic_issues.extend(issues)
                all_issues.extend([f"Week {week}, {issue}" for issue in issues])
        
        # Hiển thị kết quả
        if distribution_ok and not logic_issues:
            print(f"✅ Week {week}: OK - {total} câu hỏi")
            print(f"   Phân bổ: A={percentages[0]:.1f}%, B={percentages[1]:.1f}%, C={percentages[2]:.1f}%, D={percentages[3]:.1f}%")
        else:
            print(f"⚠️  Week {week}: {total} câu hỏi")
            print(f"   Phân bổ: A={percentages[0]:.1f}%, B={percentages[1]:.1f}%, C={percentages[2]:.1f}%, D={percentages[3]:.1f}%")
            if not distribution_ok:
                print(f"   ⚠️  Phân bổ không đều (cần 15-35% mỗi loại)")
            if logic_issues:
                print(f"   ⚠️  {len(logic_issues)} vấn đề logic")
        
        all_distributions.append({
            "week": week,
            "counts": counts,
            "percentages": percentages,
            "total": total
        })
    
    print()
    print("=" * 70)
    print("📊 TỔNG KẾT")
    print("=" * 70)
    print(f"📁 Files đã kiểm tra: {files_checked}")
    print(f"❓ Tổng số câu hỏi: {total_questions}")
    print(f"⚠️  Số vấn đề tìm thấy: {len(all_issues)}")
    print()
    
    # Tổng hợp phân bổ đáp án toàn bộ
    total_all_answers = Counter()
    for dist in all_distributions:
        for ans, count in dist["counts"].items():
            total_all_answers[ans] += count
    
    total_all = sum(total_all_answers.values())
    if total_all > 0:
        print("📊 PHÂN BỔ ĐÁP ÁN TỔNG HỢP:")
        for ans in range(4):
            count = total_all_answers.get(ans, 0)
            percentage = (count / total_all * 100) if total_all > 0 else 0
            label = ["A", "B", "C", "D"][ans]
            status = "✅" if 15 <= percentage <= 35 else "⚠️"
            print(f"   {status} {label}: {count} câu ({percentage:.1f}%)")
        print()
    
    if all_issues:
        print("=" * 70)
        print("⚠️  CÁC VẤN ĐỀ TÌM THẤY:")
        print("=" * 70)
        for i, issue in enumerate(all_issues, 1):
            print(f"{i}. {issue}")
        print()
        print("💡 Lưu ý: Các vấn đề có thể là:")
        print("   - Phân bổ đáp án không đều (cần điều chỉnh)")
        print("   - Logic câu hỏi và đáp án không khớp (cần sửa)")
        print("   - Phép tính sai (cần kiểm tra lại)")
    else:
        print("✅ KHÔNG TÌM THẤY VẤN ĐỀ NÀO!")
        print("   Tất cả câu hỏi đã được kiểm tra và đúng format.")
        print("   Phân bổ đáp án đều nhau (A, B, C, D ~25% mỗi loại).")
    
    print()
    print("=" * 70)

if __name__ == "__main__":
    main()

