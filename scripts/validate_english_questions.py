#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script kiểm tra và validate bộ đề tiếng Anh lớp 1
Kiểm tra:
1. Câu trả lời đúng có khớp với câu hỏi không
2. Vị trí correctAnswer có khớp với vị trí thực tế trong options không
3. Logic câu hỏi có đúng không
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

def validate_week_file(file_path):
    """Validate một file week"""
    errors = []
    warnings = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    week_num = data.get("week")
    questions = data.get("lessons", [{}])[0].get("questions", [])
    
    print(f"\n{'='*60}")
    print(f"📋 Week {week_num}: {data.get('lessons', [{}])[0].get('title', 'Unknown')}")
    print(f"{'='*60}")
    
    # Kiểm tra số lượng câu hỏi
    if len(questions) != 10:
        errors.append(f"❌ Week {week_num}: Số lượng câu hỏi không đúng (có {len(questions)} câu, cần 10 câu)")
    
    # Kiểm tra từng câu hỏi
    for i, q in enumerate(questions, 1):
        q_id = q.get("id", f"q{i}")
        question_text = q.get("question", "")
        options = q.get("options", [])
        correct_answer = q.get("correctAnswer")
        explanation = q.get("explanation", "")
        
        # Kiểm tra có đủ 4 options
        if len(options) != 4:
            errors.append(f"❌ {q_id}: Không đủ 4 options (có {len(options)} options)")
            continue
        
        # Kiểm tra correctAnswer index hợp lệ
        if correct_answer is None or correct_answer < 0 or correct_answer >= len(options):
            errors.append(f"❌ {q_id}: correctAnswer không hợp lệ ({correct_answer})")
            continue
        
        # Kiểm tra đáp án đúng có khớp với câu hỏi không
        correct_option = options[correct_answer]
        
        # Kiểm tra logic câu hỏi
        if "What letter is this:" in question_text:
            # Câu hỏi nhận biết chữ cái
            letter_in_question = question_text.split("'")[1] if "'" in question_text else ""
            if correct_option != letter_in_question:
                errors.append(f"❌ {q_id}: Đáp án '{correct_option}' không khớp với chữ cái trong câu hỏi '{letter_in_question}'")
        
        elif "Which word starts with" in question_text:
            # Câu hỏi tìm từ bắt đầu bằng chữ cái
            letter_in_question = question_text.split("'")[1] if "'" in question_text else ""
            if correct_option[0].upper() != letter_in_question.upper():
                errors.append(f"❌ {q_id}: Đáp án '{correct_option}' không bắt đầu bằng chữ '{letter_in_question}'")
        
        elif "How do you pronounce the letter" in question_text:
            # Câu hỏi phát âm
            letter_in_question = question_text.split("'")[1] if "'" in question_text else ""
            sound_map = {
                "B": "/b/", "C": "/k/", "A": "/æ/", "D": "/d/",
                "I": "/ɪ/", "E": "/e/", "G": "/g/", "H": "/h/",
                "O": "/ɒ/", "M": "/m/", "U": "/ʌ/", "L": "/l/",
                "N": "/n/", "T": "/t/", "F": "/f/", "W": "/w/"
            }
            expected_sound = sound_map.get(letter_in_question.upper(), "")
            if correct_option != expected_sound and expected_sound:
                errors.append(f"❌ {q_id}: Đáp án '{correct_option}' không đúng phát âm của chữ '{letter_in_question}' (đúng là '{expected_sound}')")
        
        elif "Complete the sentence:" in question_text:
            # Câu hỏi hoàn thành câu
            # Kiểm tra đáp án có hợp lý không (không thể kiểm tra chính xác vì không biết câu đầy đủ)
            if not correct_option or len(correct_option.strip()) == 0:
                errors.append(f"❌ {q_id}: Đáp án rỗng")
        
        elif "Which sentence means" in question_text:
            # Câu hỏi dịch câu
            # Kiểm tra đáp án có phải là câu hoàn chỉnh không
            if not correct_option.endswith(".") and not correct_option.endswith("?"):
                warnings.append(f"⚠️ {q_id}: Đáp án có vẻ không phải là câu hoàn chỉnh")
        
        elif "What does" in question_text and "mean?" in question_text:
            # Câu hỏi "What does X mean?" - không phù hợp với lớp 1
            word_in_question = question_text.split("'")[1] if "'" in question_text else ""
            if correct_option != word_in_question:
                warnings.append(f"⚠️ {q_id}: Câu hỏi 'What does X mean?' không phù hợp với lớp 1, nên đổi thành 'What is X?'")
        
        # Kiểm tra explanation có đầy đủ không
        if not explanation or len(explanation.strip()) < 10:
            warnings.append(f"⚠️ {q_id}: Explanation quá ngắn hoặc rỗng")
        
        # Kiểm tra explanation có song ngữ không
        if "Tiếng Việt:" not in explanation or "English:" not in explanation:
            warnings.append(f"⚠️ {q_id}: Explanation thiếu phần song ngữ (Tiếng Việt hoặc English)")
    
    # Kiểm tra phân bổ đáp án
    answer_counts = Counter(q.get("correctAnswer") for q in questions)
    print(f"📊 Phân bổ đáp án: A={answer_counts[0]}, B={answer_counts[1]}, C={answer_counts[2]}, D={answer_counts[3]}")
    
    # Kiểm tra có 2 câu liên tiếp cùng đáp án không
    for i in range(len(questions) - 1):
        if questions[i].get("correctAnswer") == questions[i + 1].get("correctAnswer"):
            warnings.append(f"⚠️ Câu {i+1} và {i+2} có cùng đáp án đúng (có thể gây nhàm chán)")
    
    return errors, warnings

def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    english_dir = project_root / "src" / "data" / "questions" / "ket-noi-tri-thuc" / "grade-1" / "english"
    
    if not english_dir.exists():
        print(f"❌ Không tìm thấy thư mục: {english_dir}")
        return
    
    all_errors = []
    all_warnings = []
    
    print("🔍 Bắt đầu kiểm tra bộ đề tiếng Anh lớp 1...")
    print(f"📁 Thư mục: {english_dir}\n")
    
    # Kiểm tra tất cả files
    week_files = sorted(english_dir.glob("week-*.json"))
    
    if not week_files:
        print("❌ Không tìm thấy file nào!")
        return
    
    for week_file in week_files:
        errors, warnings = validate_week_file(week_file)
        all_errors.extend(errors)
        all_warnings.extend(warnings)
    
    # Tổng kết
    print(f"\n{'='*60}")
    print("📊 TỔNG KẾT")
    print(f"{'='*60}")
    print(f"✅ Đã kiểm tra: {len(week_files)} files")
    print(f"❌ Lỗi: {len(all_errors)}")
    print(f"⚠️ Cảnh báo: {len(all_warnings)}")
    
    if all_errors:
        print(f"\n❌ CÁC LỖI TÌM THẤY:")
        for error in all_errors:
            print(f"  {error}")
    
    if all_warnings:
        print(f"\n⚠️ CÁC CẢNH BÁO:")
        for warning in all_warnings:
            print(f"  {warning}")
    
    if not all_errors and not all_warnings:
        print("\n✅ Tuyệt vời! Không có lỗi nào!")
    elif not all_errors:
        print("\n✅ Không có lỗi nghiêm trọng, chỉ có cảnh báo nhỏ.")

if __name__ == "__main__":
    main()

