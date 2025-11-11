#!/usr/bin/env python3
"""Test logic của Vietnamese questions đã fix"""
import json
import os

def test_question(q, file_path, lesson_id):
    """Test logic một câu hỏi"""
    errors = []
    q_id = q.get('id', 'unknown')
    question_text = q.get('question', '').lower()
    options = q.get('options', [])
    correct_idx = q.get('correctAnswer', -1)
    
    # Test 1: Options phải khác nhau
    normalized = [opt.strip().lower() for opt in options]
    if len(set(normalized)) < len(options):
        errors.append(f"{q_id}: Options có duplicate: {options}")
    
    # Test 2: correctAnswer index hợp lệ
    if correct_idx < 0 or correct_idx >= len(options):
        errors.append(f"{q_id}: correctAnswer index không hợp lệ: {correct_idx} (phải từ 0 đến {len(options)-1})")
    
    # Test 3: Logic câu hỏi chính tả
    is_spelling = 'chính tả' in question_text or 'viết đúng' in question_text or 'viết sai' in question_text
    if is_spelling:
        correct_word = options[correct_idx] if 0 <= correct_idx < len(options) else None
        
        if 'viết đúng' in question_text or 'đúng chính tả' in question_text:
            # Câu hỏi "viết đúng" - correctAnswer phải là từ đúng
            explanation = q.get('explanation', '')
            # Extract từ đúng từ explanation
            import re
            match = re.search(r"['\"]([^'\"]+)['\"]", explanation)
            if match:
                expected_correct = match.group(1).strip()
                if correct_word and correct_word != expected_correct:
                    errors.append(f"{q_id}: Câu hỏi 'viết đúng' nhưng correctAnswer không khớp. Expected: '{expected_correct}', Got: '{correct_word}'")
        
        if 'viết sai' in question_text or 'sai chính tả' in question_text:
            # Câu hỏi "viết sai" - correctAnswer phải là từ SAI
            explanation = q.get('explanation', '')
            # Extract từ SAI từ explanation ("Từ sai là '...'")
            import re
            # Tìm "Từ sai là '...'"
            match_sai = re.search(r"Từ sai là\s*['\"]([^'\"]+)['\"]", explanation)
            if match_sai:
                expected_sai = match_sai.group(1).strip()
                if correct_word != expected_sai:
                    errors.append(f"{q_id}: Câu hỏi 'viết sai' nhưng correctAnswer '{correct_word}' không khớp với từ sai trong explanation '{expected_sai}'")
            # Nếu không tìm thấy "Từ sai là", thử extract từ đầu tiên trong explanation
            elif correct_word:
                # Kiểm tra xem correct_word có phải là từ đúng không (nếu explanation có "Từ đúng là")
                match_dung = re.search(r"Từ đúng là\s*['\"]([^'\"]+)['\"]", explanation)
                if match_dung:
                    expected_dung = match_dung.group(1).strip()
                    if correct_word == expected_dung:
                        errors.append(f"{q_id}: Câu hỏi 'viết sai' nhưng correctAnswer lại là từ ĐÚNG '{correct_word}'. Phải là từ SAI!")
    
    return errors

# Test các file đã fix
test_files = [
    'public/data/questions/ket-noi-tri-thuc/grade-2/vietnamese/week-1.json',
    'public/data/questions/ket-noi-tri-thuc/grade-2/vietnamese/week-2.json',
    'public/data/questions/ket-noi-tri-thuc/grade-2/vietnamese/week-3.json',
    'public/data/questions/ket-noi-tri-thuc/grade-2/vietnamese/week-10.json',
]

print("🧪 Testing Vietnamese questions logic...\n")
total_errors = 0

for file_path in test_files:
    if not os.path.exists(file_path):
        continue
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        file_errors = []
        for lesson in data.get('lessons', []):
            lesson_id = lesson.get('id', 'unknown')
            for q in lesson.get('questions', []):
                errors = test_question(q, file_path, lesson_id)
                file_errors.extend(errors)
        
        if file_errors:
            print(f"❌ {os.path.basename(file_path)}: {len(file_errors)} lỗi")
            for err in file_errors[:5]:  # Chỉ hiển thị 5 lỗi đầu
                print(f"   - {err}")
            if len(file_errors) > 5:
                print(f"   ... và {len(file_errors) - 5} lỗi khác")
            total_errors += len(file_errors)
        else:
            print(f"✅ {os.path.basename(file_path)}: OK")
    
    except Exception as e:
        print(f"❌ {os.path.basename(file_path)}: Error - {e}")

print(f"\n📊 Tổng số lỗi: {total_errors}")
if total_errors == 0:
    print("✅ Tất cả logic đều đúng!")
else:
    print("⚠️  Còn một số lỗi cần fix")

