#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script điền explanation cho tất cả câu hỏi tiếng Việt
Tạo explanation dựa trên câu hỏi và đáp án đúng
"""

import json
import os
import sys
from pathlib import Path
import re

# Fix encoding cho Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def generate_explanation(question, options, correct_answer_index):
    """Tạo explanation dựa trên câu hỏi và đáp án đúng"""
    q_text = question
    correct_answer = options[correct_answer_index]
    q_lower = q_text.lower()
    
    # Pattern 1: "Chữ cái nào sau đây là chữ 'X'?"
    match = re.search(r"chữ\s+(cái\s+)?nào\s+sau\s+đây\s+là\s+chữ\s+['\"](\w+)['\"]", q_text, re.IGNORECASE)
    if match:
        expected_char = match.group(2)
        return f"Chữ '{expected_char}' là chữ cái trong bảng chữ cái tiếng Việt. Đáp án đúng là '{correct_answer}'."
    
    # Pattern 2: "Chữ cái 'X' trong tiếng Việt đọc là gì?"
    match = re.search(r"chữ\s+(cái\s+)?['\"](\w+)['\"]\s+trong\s+tiếng\s+việt\s+đọc\s+là\s+gì", q_text, re.IGNORECASE)
    if match:
        char = match.group(2)
        return f"Chữ '{char}' trong tiếng Việt đọc là '{correct_answer}'. Đây là cách đọc chuẩn của chữ cái này."
    
    # Pattern 3: "Từ nào có chữ 'X'?" hoặc "Từ nào có vần 'X'?"
    match = re.search(r"từ\s+nào\s+có\s+(chữ|vần)\s+['\"](\w+)['\"]", q_text, re.IGNORECASE)
    if match:
        char_or_vowel = match.group(2)
        return f"Từ '{correct_answer}' có chứa {match.group(1)} '{char_or_vowel}'. Đây là đáp án đúng."
    
    # Pattern 4: "Vần 'X' có mấy chữ cái?"
    match = re.search(r"vần\s+['\"](\w+)['\"]\s+có\s+mấy\s+chữ\s+cái", q_text, re.IGNORECASE)
    if match:
        vowel = match.group(1)
        char_count = len(vowel.replace(" ", ""))
        return f"Vần '{vowel}' có {char_count} chữ cái. Đáp án đúng là '{correct_answer}'."
    
    # Pattern 5: "Chữ 'X' và chữ 'Y' khác nhau ở điểm nào?"
    match = re.search(r"chữ\s+['\"](\w+)['\"]\s+và\s+chữ\s+['\"](\w+)['\"]\s+khác\s+nhau\s+ở\s+điểm\s+nào", q_text, re.IGNORECASE)
    if match:
        char1 = match.group(1)
        char2 = match.group(2)
        return f"Đáp án đúng là '{correct_answer}'. Đây là điểm khác biệt giữa chữ '{char1}' và chữ '{char2}'."
    
    # Pattern 6: "Chữ 'X' và chữ 'Y' giống nhau ở điểm nào?"
    match = re.search(r"chữ\s+['\"](\w+)['\"]\s+và\s+chữ\s+['\"](\w+)['\"]\s+giống\s+nhau\s+ở\s+điểm\s+nào", q_text, re.IGNORECASE)
    if match:
        char1 = match.group(1)
        char2 = match.group(2)
        return f"Đáp án đúng là '{correct_answer}'. Đây là điểm giống nhau giữa chữ '{char1}' và chữ '{char2}'."
    
    # Pattern 7: "Vần 'X' và vần 'Y' khác nhau ở điểm nào?"
    match = re.search(r"vần\s+['\"](\w+)['\"]\s+và\s+vần\s+['\"](\w+)['\"]\s+khác\s+nhau\s+ở\s+điểm\s+nào", q_text, re.IGNORECASE)
    if match:
        vowel1 = match.group(1)
        vowel2 = match.group(2)
        return f"Đáp án đúng là '{correct_answer}'. Đây là điểm khác biệt giữa vần '{vowel1}' và vần '{vowel2}'."
    
    # Pattern 8: "Từ 'X' có nghĩa là gì?"
    match = re.search(r"từ\s+['\"](\w+(?:\s+\w+)*)['\"]\s+có\s+nghĩa\s+là\s+gì", q_text, re.IGNORECASE)
    if match:
        word = match.group(1)
        return f"Từ '{word}' có nghĩa là '{correct_answer}'. Đây là ý nghĩa của từ này."
    
    # Pattern 9: "Trong bài 'X', ..."
    match = re.search(r"trong\s+bài\s+['\"]([^'\"]+)['\"]", q_text, re.IGNORECASE)
    if match:
        lesson = match.group(1)
        return f"Trong bài '{lesson}', đáp án đúng là '{correct_answer}'. Hãy đọc lại bài để hiểu rõ hơn."
    
    # Pattern 10: "Câu nào sau đây là câu ...?"
    match = re.search(r"câu\s+nào\s+sau\s+đây\s+là\s+câu\s+([^?]+)\?", q_text, re.IGNORECASE)
    if match:
        question_type = match.group(1).strip()
        return f"Đáp án đúng là '{correct_answer}'. Đây là câu {question_type}."
    
    # Pattern 11: "Từ nào sau đây chỉ ...?"
    match = re.search(r"từ\s+nào\s+sau\s+đây\s+chỉ\s+([^?]+)\?", q_text, re.IGNORECASE)
    if match:
        meaning = match.group(1).strip()
        return f"Từ '{correct_answer}' chỉ {meaning}. Đây là đáp án đúng."
    
    # Pattern 12: "Từ nào sau đây viết đúng chính tả?"
    if "viết đúng chính tả" in q_lower:
        return f"Từ '{correct_answer}' được viết đúng chính tả. Đây là cách viết chuẩn."
    
    # Pattern 13: "Trong từ 'X', có bao nhiêu tiếng?"
    # Match cả escaped quotes và normal quotes
    match = re.search(r"trong\s+từ\s+(?:['\"]|\\['\"])(\w+(?:\s+\w+)*)(?:['\"]|\\['\"]).*?có\s+bao\s+nhiêu\s+tiếng", q_text, re.IGNORECASE)
    if match:
        word = match.group(1)
        # Đếm số tiếng (số từ)
        word_count = len(word.split())
        # Tách từ để giải thích rõ hơn
        words = word.split()
        if word_count == 1:
            return f"Từ '{word}' có 1 tiếng (là từ đơn). Đáp án đúng là '{correct_answer}'."
        elif word_count == 2:
            return f"Từ '{word}' có 2 tiếng: '{words[0]}' và '{words[1]}'. Đáp án đúng là '{correct_answer}'."
        else:
            word_list = ', '.join([f"'{w}'" for w in words])
            return f"Từ '{word}' có {word_count} tiếng: {word_list}. Đáp án đúng là '{correct_answer}'."
    
    # Pattern 14: "Từ nào sau đây chỉ tình ...?"
    if "chỉ tình" in q_lower or "chỉ cảm xúc" in q_lower:
        return f"Từ '{correct_answer}' chỉ {q_text.split('chỉ')[-1].replace('?', '').strip()}. Đây là đáp án đúng."
    
    # Pattern 15: "Câu nào sau đây viết đúng dấu câu?"
    if "viết đúng dấu câu" in q_lower:
        return f"Đáp án đúng là '{correct_answer}'. Câu này có dấu câu phù hợp với nội dung (dấu chấm cho câu kể, dấu hỏi cho câu hỏi, dấu chấm than cho câu cảm)."
    
    # Pattern 16: "Trong bài học, ... cần làm gì?"
    if "cần làm gì" in q_lower or "làm gì để" in q_lower:
        return f"Đáp án đúng là '{correct_answer}'. Hãy đọc lại câu hỏi và suy nghĩ về các hành động cần thiết."
    
    # Pattern 17: "Câu nào sau đây thể hiện ...?"
    if "câu nào sau đây thể hiện" in q_lower:
        meaning = q_text.split("thể hiện")[-1].replace("?", "").strip()
        return f"Đáp án đúng là '{correct_answer}'. Câu này thể hiện {meaning}."
    
    # Pattern 18: "Trong bài 'X', nhân vật học được điều gì?"
    match = re.search(r"trong\s+bài\s+['\"]([^'\"]+)['\"].*?học\s+được\s+điều\s+gì", q_text, re.IGNORECASE)
    if match:
        lesson = match.group(1)
        return f"Trong bài '{lesson}', đáp án đúng là '{correct_answer}'. Đây là bài học mà nhân vật trong bài học được."
    
    # Pattern 19: "Từ nào sau đây chỉ ...?"
    match = re.search(r"từ\s+nào\s+sau\s+đây\s+chỉ\s+([^?]+)\?", q_text, re.IGNORECASE)
    if match:
        meaning = match.group(1).strip()
        return f"Từ '{correct_answer}' chỉ {meaning}. Đây là đáp án đúng."
    
    # Pattern 20: "Trong bài 'X', ... giúp ích gì?"
    match = re.search(r"trong\s+bài\s+['\"]([^'\"]+)['\"].*?giúp\s+ích\s+gì", q_text, re.IGNORECASE)
    if match:
        lesson = match.group(1)
        return f"Trong bài '{lesson}', đáp án đúng là '{correct_answer}'. Đây là lợi ích được đề cập trong bài."
    
    # Default explanation - Cải thiện để chi tiết hơn
    # Nếu đáp án là "tất cả các đáp án trên", giải thích đặc biệt
    if "tất cả các đáp án trên" in correct_answer.lower():
        return f"Đáp án đúng là '{correct_answer}'. Tất cả các lựa chọn đều đúng, nên câu trả lời là 'tất cả các đáp án trên'."
    
    # Default explanation cho các câu khác
    return f"Đáp án đúng là '{correct_answer}'. Hãy đọc kỹ câu hỏi và xem xét từng lựa chọn để tìm ra đáp án chính xác nhất."

def process_week_file(file_path):
    """Xử lý một file week JSON"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        week = data.get("week", 0)
        lessons = data.get("lessons", [])
        updated = False
        
        for lesson in lessons:
            questions = lesson.get("questions", [])
            
            for question in questions:
                # Cập nhật explanation (có thể ghi đè nếu cần)
                explanation = generate_explanation(
                    question.get("question", ""),
                    question.get("options", []),
                    question.get("correctAnswer", 0)
                )
                # Luôn cập nhật explanation mới (cải thiện explanation cũ)
                current_explanation = question.get("explanation", "").strip()
                # Cập nhật nếu:
                # 1. Explanation rỗng
                # 2. Explanation có chứa "Hãy đọc kỹ" (default explanation cũ - BẮT BUỘC update)
                # 3. Explanation quá ngắn (< 30 ký tự)
                # 4. Explanation chỉ là "Đáp án đúng là..." (quá đơn giản)
                should_update = (
                    not current_explanation or
                    "Hãy đọc kỹ" in current_explanation or
                    len(current_explanation) < 30 or
                    (current_explanation.startswith("Đáp án đúng là") and len(current_explanation) < 50)
                )
                
                if should_update:
                    # Force update nếu explanation cũ có "Hãy đọc kỹ" (default explanation cũ)
                    if "Hãy đọc kỹ" in current_explanation:
                        question["explanation"] = explanation
                        updated = True
                    # Update nếu explanation mới khác explanation cũ (cho các trường hợp khác)
                    elif explanation != current_explanation:
                        question["explanation"] = explanation
                        updated = True
        
        if updated:
            # Lưu lại file
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True, week
        
        return False, week
    
    except Exception as e:
        return None, 0

def main():
    """Main function"""
    base_dir = Path("src/data/questions/ket-noi-tri-thuc/grade-1/vietnamese")
    
    print("=" * 70)
    print("📝 ĐIỀN EXPLANATION CHO TẤT CẢ CÂU HỎI TIẾNG VIỆT")
    print("=" * 70)
    print()
    
    if not base_dir.exists():
        print(f"❌ Lỗi: Thư mục không tồn tại: {base_dir}")
        return
    
    updated_count = 0
    total_questions = 0
    updated_questions = 0
    
    # Xử lý tất cả file week-*.json
    for week_file in sorted(base_dir.glob("week-*.json")):
        result, week = process_week_file(week_file)
        
        if result is None:
            print(f"❌ {week_file.name}: Lỗi khi xử lý")
            continue
        
        # Đếm số câu hỏi
        with open(week_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for lesson in data.get("lessons", []):
                questions = lesson.get("questions", [])
                total_questions += len(questions)
                
                # Đếm số câu hỏi đã được cập nhật
                for q in questions:
                    if q.get("explanation", "").strip():
                        updated_questions += 1
        
        if result:
            updated_count += 1
            print(f"✅ {week_file.name}: Đã cập nhật explanation")
        else:
            print(f"⏭️  {week_file.name}: Đã có explanation (bỏ qua)")
    
    print()
    print("=" * 70)
    print("📊 TỔNG KẾT")
    print("=" * 70)
    print(f"📁 Files đã xử lý: {len(list(base_dir.glob('week-*.json')))}")
    print(f"📝 Files đã cập nhật: {updated_count}")
    print(f"❓ Tổng số câu hỏi: {total_questions}")
    print(f"✅ Câu hỏi đã có explanation: {updated_questions}")
    print()
    print("✅ Hoàn thành!")

if __name__ == "__main__":
    main()

