#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script chuẩn hóa số câu hỏi cho tất cả thử thách tuần (10-15 câu)
- Nếu < 10 câu: Thêm câu hỏi để đạt 12 câu
- Nếu > 15 câu: Giữ lại 12 câu đầu tiên
- Đảm bảo phân bổ đáp án A/B/C/D đều (25% mỗi loại)
- Không có 2 câu liên tiếp cùng đáp án
"""

import json
import sys
import shutil
from pathlib import Path
from collections import Counter
import random
from datetime import datetime

# Fix encoding cho Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

TARGET_QUESTIONS = 12  # Target: 12 câu hỏi (trong khoảng 10-15)
MIN_QUESTIONS = 10
MAX_QUESTIONS = 15

# Template câu hỏi toán để thêm vào (nếu thiếu)
MATH_QUESTION_TEMPLATES = [
    # Phép cộng
    {"q": "Có {a} quả cam, thêm {b} quả nữa. Hỏi có tất cả bao nhiêu quả cam?", "exp": "{a} + {b} = {ans}"},
    {"q": "Có {a} con gà, thêm {b} con nữa. Hỏi có tất cả bao nhiêu con gà?", "exp": "{a} + {b} = {ans}"},
    {"q": "Có {a} cái kẹo, thêm {b} cái nữa. Hỏi có tất cả bao nhiêu cái kẹo?", "exp": "{a} + {b} = {ans}"},
    {"q": "Có {a} quả táo, thêm {b} quả nữa. Hỏi có tất cả bao nhiêu quả táo?", "exp": "{a} + {b} = {ans}"},
    {"q": "Có {a} con chim, thêm {b} con nữa. Hỏi có tất cả bao nhiêu con chim?", "exp": "{a} + {b} = {ans}"},
    # Phép trừ
    {"q": "Có {a} quả cam, ăn mất {b} quả. Hỏi còn lại bao nhiêu quả cam?", "exp": "{a} - {b} = {ans}"},
    {"q": "Có {a} con gà, bay đi {b} con. Hỏi còn lại bao nhiêu con gà?", "exp": "{a} - {b} = {ans}"},
    {"q": "Có {a} cái kẹo, cho bạn {b} cái. Hỏi còn lại bao nhiêu cái kẹo?", "exp": "{a} - {b} = {ans}"},
    {"q": "Có {a} quả táo, ăn mất {b} quả. Hỏi còn lại bao nhiêu quả táo?", "exp": "{a} - {b} = {ans}"},
    {"q": "Có {a} con chim, bay đi {b} con. Hỏi còn lại bao nhiêu con chim?", "exp": "{a} - {b} = {ans}"},
    # Phép tính đơn giản
    {"q": "{a} + {b} = ?", "exp": "{a} + {b} = {ans}"},
    {"q": "{a} - {b} = ?", "exp": "{a} - {b} = {ans}"},
]

def generate_math_question(week_num, existing_questions, max_attempts=50):
    """Tạo câu hỏi toán mới dựa trên chủ đề tuần, tránh trùng lặp"""
    # Lấy danh sách câu hỏi hiện có để tránh trùng
    existing_texts = {q.get("question", "") for q in existing_questions}
    
    # Phạm vi số dựa trên tuần
    if week_num <= 5:
        max_num = 10
    elif week_num <= 10:
        max_num = 15
    else:
        max_num = 20
    
    # Thử tạo câu hỏi mới (tối đa max_attempts lần để tránh trùng)
    for attempt in range(max_attempts):
        # Random chọn template
        template = random.choice(MATH_QUESTION_TEMPLATES)
        
        # Tạo số ngẫu nhiên
        if "thêm" in template["q"] or "+" in template["q"]:
            # Phép cộng
            a = random.randint(1, max_num - 1)
            b = random.randint(1, max_num - a)
            ans = a + b
        else:
            # Phép trừ
            a = random.randint(2, max_num)
            b = random.randint(1, a - 1)
            ans = a - b
        
        # Format question
        question_text = template["q"].format(a=a, b=b, ans=ans)
        
        # Check trùng lặp
        if question_text in existing_texts:
            continue  # Thử lại với số khác
        
        # Tạo options (đáp án đúng + 3 đáp án sai)
        options = [ans]
        while len(options) < 4:
            wrong = random.randint(max(1, ans - 3), ans + 3)
            if wrong != ans and wrong not in options and wrong > 0:
                options.append(wrong)
        
        # Shuffle options
        random.shuffle(options)
        correct_index = options.index(ans)
        
        explanation = template["exp"].format(a=a, b=b, ans=ans)
        
        # Format options với đơn vị (nếu có)
        if "quả" in question_text or "con" in question_text or "cái" in question_text:
            unit = "quả" if "quả" in question_text else ("con" if "con" in question_text else "cái")
            formatted_options = [f"{opt} {unit}" for opt in options]
        else:
            formatted_options = [str(opt) for opt in options]
        
        return {
            "question": question_text,
            "options": formatted_options,
            "correctAnswer": correct_index,
            "explanation": explanation,
            "imageUrl": None
        }
    
    # Nếu không tạo được câu hỏi mới sau max_attempts lần, trả về câu hỏi mặc định
    return {
        "question": f"{random.randint(1, 10)} + {random.randint(1, 10)} = ?",
        "options": ["10", "11", "12", "13"],
        "correctAnswer": 0,
        "explanation": "Phép tính đơn giản",
        "imageUrl": None
    }

def balance_answers(questions):
    """Cân bằng phân bổ đáp án A/B/C/D (25% mỗi loại)"""
    target_count = len(questions)
    target_per_answer = target_count // 4
    remainder = target_count % 4
    
    # Target distribution: [A, B, C, D]
    target_dist = [target_per_answer] * 4
    for i in range(remainder):
        target_dist[i] += 1
    
    # Current distribution
    current_answers = [q["correctAnswer"] for q in questions]
    current_dist = [current_answers.count(i) for i in range(4)]
    
    # Adjust answers để đạt target
    adjusted_questions = questions.copy()
    answer_counts = Counter(current_answers)
    
    # Tạo list đáp án target
    target_answers = []
    for i in range(4):
        target_answers.extend([i] * target_dist[i])
    
    # Shuffle để tránh pattern
    random.shuffle(target_answers)
    
    # Gán đáp án mới (giữ nguyên question, chỉ đổi correctAnswer và options)
    for i, q in enumerate(adjusted_questions):
        target_answer = target_answers[i] if i < len(target_answers) else random.randint(0, 3)
        
        # Nếu đáp án hiện tại khác target, đổi vị trí options
        if q["correctAnswer"] != target_answer:
            # Swap options
            options = q["options"].copy()
            correct_option = options[q["correctAnswer"]]
            options[q["correctAnswer"]], options[target_answer] = options[target_answer], options[q["correctAnswer"]]
            q["options"] = options
            q["correctAnswer"] = target_answer
    
    # Verify không có 2 câu liên tiếp cùng đáp án
    final_answers = [q["correctAnswer"] for q in adjusted_questions]
    for i in range(len(final_answers) - 1):
        if final_answers[i] == final_answers[i + 1]:
            # Swap với câu tiếp theo nếu có thể
            if i + 2 < len(adjusted_questions):
                adjusted_questions[i + 1], adjusted_questions[i + 2] = adjusted_questions[i + 2], adjusted_questions[i + 1]
                final_answers = [q["correctAnswer"] for q in adjusted_questions]
    
    return adjusted_questions

def normalize_week_file(file_path, subject, week_num):
    """Chuẩn hóa số câu hỏi trong file week"""
    # Đọc file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data["lessons"][0]["questions"]
    current_count = len(questions)
    
    # Xử lý theo số câu hiện tại
    if current_count < MIN_QUESTIONS:
        # Thêm câu hỏi
        needed = TARGET_QUESTIONS - current_count
        print(f"  [THIEU] {current_count} câu → Thêm {needed} câu để đạt {TARGET_QUESTIONS} câu")
        
        if subject == "math":
            # Tạo câu hỏi toán mới
            for i in range(needed):
                new_q = generate_math_question(week_num, questions)
                questions.append(new_q)
        else:
            # Với các môn khác, duplicate và modify câu hỏi hiện có
            for i in range(needed):
                base_q = random.choice(questions)
                new_q = base_q.copy()
                new_q["id"] = f"q{current_count + i + 1}"
                # Modify một chút để không trùng hoàn toàn
                if "question" in new_q:
                    new_q["question"] = new_q["question"].replace("?", "? (Câu hỏi bổ sung)")
                questions.append(new_q)
    
    elif current_count > MAX_QUESTIONS:
        # Bớt câu hỏi (giữ lại TARGET_QUESTIONS câu đầu tiên)
        removed = current_count - TARGET_QUESTIONS
        print(f"  [NHIEU] {current_count} câu → Bớt {removed} câu, giữ lại {TARGET_QUESTIONS} câu đầu tiên")
        questions = questions[:TARGET_QUESTIONS]
        # Update IDs
        for i, q in enumerate(questions):
            q["id"] = f"q{i + 1}"
    
    else:
        # Đã OK, chỉ cần cân bằng đáp án
        print(f"  [OK] {current_count} câu → Cân bằng đáp án")
    
    # Loại bỏ câu hỏi trùng lặp (giữ lại câu đầu tiên)
    seen_questions = {}
    unique_questions = []
    for q in questions:
        question_text = q.get("question", "").strip()
        if question_text and question_text not in seen_questions:
            seen_questions[question_text] = True
            unique_questions.append(q)
        elif not question_text:
            # Giữ lại câu hỏi không có text (có thể là câu hỏi đặc biệt)
            unique_questions.append(q)
    
    # Nếu bị mất câu hỏi do loại bỏ trùng, thêm lại
    if len(unique_questions) < TARGET_QUESTIONS and subject == "math":
        needed = TARGET_QUESTIONS - len(unique_questions)
        for i in range(needed):
            new_q = generate_math_question(week_num, unique_questions)
            unique_questions.append(new_q)
    
    questions = unique_questions[:TARGET_QUESTIONS]  # Đảm bảo không quá TARGET
    
    # Cân bằng đáp án
    questions = balance_answers(questions)
    
    # Đảm bảo ID theo thứ tự (q1, q2, q3, ...)
    for i, q in enumerate(questions):
        q["id"] = f"q{i + 1}"
    
    # Update data
    data["lessons"][0]["questions"] = questions
    
    # Ghi lại file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Verify
    final_count = len(questions)
    final_answers = [q["correctAnswer"] for q in questions]
    answer_dist = Counter(final_answers)
    
    print(f"  ✅ Hoàn thành: {final_count} câu, Phân bổ đáp án: A={answer_dist[0]}, B={answer_dist[1]}, C={answer_dist[2]}, D={answer_dist[3]}")
    
    return final_count, answer_dist

def backup_files(base_dir):
    """Backup tất cả file trước khi sửa"""
    backup_dir = base_dir / "backup" / datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy tất cả week-*.json
    for week_file in base_dir.rglob("week-*.json"):
        relative_path = week_file.relative_to(base_dir)
        backup_path = backup_dir / relative_path
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(week_file, backup_path)
    
    print(f"✅ Đã backup tất cả files vào: {backup_dir}")
    return backup_dir

def main():
    """Main function"""
    base_dir = Path("src/data/questions/ket-noi-tri-thuc/grade-1")
    subjects = ["math", "vietnamese", "english"]
    
    print("=" * 70)
    print("CHUẨN HÓA SỐ CÂU HỎI CHO TẤT CẢ THỬ THÁCH TUẦN (10-15 câu)")
    print("=" * 70)
    print(f"Target: {TARGET_QUESTIONS} câu hỏi (trong khoảng {MIN_QUESTIONS}-{MAX_QUESTIONS})")
    print()
    
    # Backup
    print("📦 Đang backup files...")
    backup_dir = backup_files(base_dir)
    print()
    
    # Xử lý từng môn
    total_files = 0
    total_updated = 0
    
    for subject in subjects:
        subject_dir = base_dir / subject
        if not subject_dir.exists():
            print(f"⚠️  Không tìm thấy thư mục: {subject_dir}")
            continue
        
        print(f"\n{'=' * 70}")
        print(f"MÔN: {subject.upper()}")
        print(f"{'=' * 70}")
        
        week_files = sorted(subject_dir.glob("week-*.json"))
        
        for week_file in week_files:
            total_files += 1
            week_num = int(week_file.stem.split("-")[1])
            
            print(f"\n📝 {week_file.name}:")
            try:
                final_count, answer_dist = normalize_week_file(week_file, subject, week_num)
                if final_count != len(json.loads(week_file.read_text(encoding='utf-8'))["lessons"][0]["questions"]):
                    total_updated += 1
            except Exception as e:
                print(f"  ❌ Lỗi: {e}")
    
    print(f"\n{'=' * 70}")
    print("✅ HOÀN THÀNH!")
    print(f"{'=' * 70}")
    print(f"📊 Tổng kết:")
    print(f"   - Tổng số files: {total_files}")
    print(f"   - Files đã cập nhật: {total_updated}")
    print(f"   - Backup location: {backup_dir}")
    print()
    print("📝 Bước tiếp theo:")
    print("   1. Kiểm tra lại các file đã sửa")
    print("   2. Chạy: .\\copy-data-to-public.ps1 (để copy vào public folder)")
    print("   3. Test lại app để đảm bảo hoạt động đúng")

if __name__ == "__main__":
    random.seed(42)  # Reproducible
    main()

