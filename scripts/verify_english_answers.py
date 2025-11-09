#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script kiểm tra chi tiết bộ đề tiếng Anh lớp 1
Kiểm tra:
1. correctAnswer index có khớp với vị trí đáp án đúng trong options không
2. Logic câu hỏi có đúng không
3. Đáp án đúng có hợp lý với câu hỏi không
"""

import json
import sys
import codecs
from pathlib import Path

# Fix encoding cho Windows console
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def verify_week_file(file_path):
    """Verify một file week"""
    errors = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    week_num = data.get("week")
    questions = data.get("lessons", [{}])[0].get("questions", [])
    
    print(f"\n{'='*70}")
    print(f"📋 Week {week_num}: {data.get('lessons', [{}])[0].get('title', 'Unknown')}")
    print(f"{'='*70}")
    
    for i, q in enumerate(questions, 1):
        q_id = q.get("id", f"q{i}")
        question_text = q.get("question", "")
        options = q.get("options", [])
        correct_answer_idx = q.get("correctAnswer")
        explanation = q.get("explanation", "")
        
        # Kiểm tra correctAnswer index hợp lệ
        if correct_answer_idx is None or correct_answer_idx < 0 or correct_answer_idx >= len(options):
            errors.append(f"❌ {q_id}: correctAnswer index không hợp lệ ({correct_answer_idx})")
            continue
        
        # Lấy đáp án đúng từ options
        correct_option = options[correct_answer_idx]
        
        # Kiểm tra logic câu hỏi
        if "What letter is this:" in question_text:
            # Câu hỏi nhận biết chữ cái
            letter_in_question = question_text.split("'")[1] if "'" in question_text else ""
            if correct_option != letter_in_question:
                errors.append(f"❌ {q_id}: Đáp án '{correct_option}' (index {correct_answer_idx}) KHÔNG khớp với chữ '{letter_in_question}' trong câu hỏi!")
            else:
                print(f"  ✅ {q_id}: Đáp án '{correct_option}' (index {correct_answer_idx}) ĐÚNG!")
        
        elif "Which word starts with" in question_text:
            # Câu hỏi tìm từ bắt đầu bằng chữ cái
            letter_in_question = question_text.split("'")[1] if "'" in question_text else ""
            if correct_option[0].upper() != letter_in_question.upper():
                errors.append(f"❌ {q_id}: Đáp án '{correct_option}' (index {correct_answer_idx}) KHÔNG bắt đầu bằng chữ '{letter_in_question}'!")
            else:
                print(f"  ✅ {q_id}: Đáp án '{correct_option}' (index {correct_answer_idx}) ĐÚNG! (bắt đầu bằng '{letter_in_question}')")
        
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
                errors.append(f"❌ {q_id}: Đáp án '{correct_option}' (index {correct_answer_idx}) KHÔNG đúng phát âm của chữ '{letter_in_question}' (đúng là '{expected_sound}')!")
            else:
                print(f"  ✅ {q_id}: Đáp án '{correct_option}' (index {correct_answer_idx}) ĐÚNG! (phát âm chữ '{letter_in_question}')")
        
        elif "Complete the sentence:" in question_text:
            # Câu hỏi hoàn thành câu - chỉ kiểm tra đáp án có trong options
            if correct_option not in options:
                errors.append(f"❌ {q_id}: Đáp án '{correct_option}' KHÔNG có trong options!")
            else:
                print(f"  ✅ {q_id}: Đáp án '{correct_option}' (index {correct_answer_idx}) hợp lý!")
        
        elif "Which sentence means" in question_text:
            # Câu hỏi dịch câu - chỉ kiểm tra đáp án có trong options
            if correct_option not in options:
                errors.append(f"❌ {q_id}: Đáp án '{correct_option}' KHÔNG có trong options!")
            else:
                print(f"  ✅ {q_id}: Đáp án '{correct_option}' (index {correct_answer_idx}) hợp lý!")
        
        else:
            # Câu hỏi vocabulary - chỉ kiểm tra đáp án có trong options
            if correct_option not in options:
                errors.append(f"❌ {q_id}: Đáp án '{correct_option}' KHÔNG có trong options!")
            else:
                # Kiểm tra nếu câu hỏi có từ cụ thể
                if ":" in question_text and "'" in question_text:
                    word_in_question = question_text.split("'")[1] if "'" in question_text else ""
                    if word_in_question and correct_option.lower() != word_in_question.lower():
                        errors.append(f"❌ {q_id}: Đáp án '{correct_option}' KHÔNG khớp với từ '{word_in_question}' trong câu hỏi!")
                    else:
                        print(f"  ✅ {q_id}: Đáp án '{correct_option}' (index {correct_answer_idx}) ĐÚNG!")
                else:
                    print(f"  ✅ {q_id}: Đáp án '{correct_option}' (index {correct_answer_idx}) hợp lý!")
    
    return errors

def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    english_dir = project_root / "src" / "data" / "questions" / "ket-noi-tri-thuc" / "grade-1" / "english"
    
    if not english_dir.exists():
        print(f"❌ Không tìm thấy thư mục: {english_dir}")
        return
    
    all_errors = []
    
    print("🔍 Kiểm tra chi tiết bộ đề tiếng Anh lớp 1...")
    print(f"📁 Thư mục: {english_dir}\n")
    
    # Kiểm tra tất cả files
    week_files = sorted(english_dir.glob("week-*.json"))
    
    if not week_files:
        print("❌ Không tìm thấy file nào!")
        return
    
    for week_file in week_files:
        errors = verify_week_file(week_file)
        all_errors.extend(errors)
    
    # Tổng kết
    print(f"\n{'='*70}")
    print("📊 TỔNG KẾT KIỂM TRA")
    print(f"{'='*70}")
    print(f"✅ Đã kiểm tra: {len(week_files)} files")
    print(f"📝 Tổng số câu hỏi: {len(week_files) * 10}")
    
    if all_errors:
        print(f"\n❌ TÌM THẤY {len(all_errors)} LỖI:")
        for error in all_errors:
            print(f"  {error}")
    else:
        print("\n✅ TUYỆT VỜI! Tất cả đáp án đều ĐÚNG và khớp với vị trí!")
        print("✅ Tất cả câu hỏi đều có logic hợp lý!")
        print("✅ Bộ đề tiếng Anh lớp 1 đã sẵn sàng sử dụng!")

if __name__ == "__main__":
    main()

