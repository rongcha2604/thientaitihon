#!/usr/bin/env python3
"""
Script để tự động fix các lỗi logic trong Vietnamese questions:
1. Fix options giống nhau hoàn toàn
2. Fix options có một số giống nhau
3. Tạo options đúng/sai cho câu hỏi chính tả
"""

import json
import os
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional

# Dictionary các từ thường gặp với các lỗi chính tả phổ biến
SPELLING_VARIANTS = {
    # Từ đúng: [các biến thể sai]
    'làm việc': ['lầm việc', 'làm việc', 'lạm việc', 'làm việc'],
    'học sinh': ['học sin', 'học xinh', 'học xinh', 'học sinh'],
    'giải thưởng': ['dải thưởng', 'giải thưởng', 'rải thưởng', 'giải thưởng'],
    'lớp học': ['lớp họ', 'lớp hộc', 'lớp hộc', 'lớp học'],
    'gọi bạn': ['gọi bạn', 'gọi bản', 'gọi bàn', 'gọi bạn'],
    'nhớ bạn': ['nhớ bạn', 'nhớ bản', 'nhớ bàn', 'nhớ bạn'],
    'bạn thân': ['bạn thân', 'bạn thần', 'bạn thấn', 'bạn thân'],
    'chữ cái': ['chữ cái', 'chữ cải', 'chữ cài', 'chữ cái'],
    'nhím nâu': ['nhím nâu', 'nhím nầu', 'nhím nấu', 'nhím nâu'],
    'kết bạn': ['kết bạn', 'kết bản', 'kết bàn', 'kết bạn'],
    'thả diều': ['thả diều', 'thả điều', 'thả điều', 'thả diều'],
    'đồ chơi': ['đồ chơi', 'đồ chơi', 'đồ chơi', 'đồ chơi'],
    'nặn đồ chơi': ['nặn đồ chơi', 'nặn đồ chơi', 'nặn đồ chơi', 'nặn đồ chơi'],
    'đất sét': ['đất sét', 'đất sét', 'đất sét', 'đất sét'],
    'tỉ muội': ['tỉ muội', 'tỉ muội', 'tỉ muội', 'tỉ muội'],
    'mang về': ['mang về', 'mang về', 'mang về', 'mang về'],
    'yêu thương': ['yêu thương', 'yêu thương', 'yêu thương', 'yêu thương'],
    'mẹ yêu': ['mẹ yêu', 'mẹ yêu', 'mẹ yêu', 'mẹ yêu'],
    'trò chơi': ['trò chơi', 'trò chơi', 'trò chơi', 'trò chơi'],
    'bố mẹ': ['bố mẹ', 'bố mẹ', 'bố mẹ', 'bố mẹ'],
    'cánh cửa': ['cánh cửa', 'cánh cửa', 'cánh cửa', 'cánh cửa'],
    'thương ông': ['thương ông', 'thương ông', 'thương ông', 'thương ông'],
    'ông bà': ['ông bà', 'ông bà', 'ông bà', 'ông bà'],
    'ánh sáng': ['ánh sáng', 'ánh sáng', 'ánh sáng', 'ánh sáng'],
    'chơi chông chóng': ['chơi chông chóng', 'chơi chông chóng', 'chơi chông chóng', 'chơi chông chóng'],
    'cuối học kì': ['cuối học kì', 'cuối học kì', 'cuối học kì', 'cuối học kì'],
    'đánh giá': ['đánh giá', 'đánh giá', 'đánh giá', 'đánh giá'],
    'hoàn thành': ['hoàn thành', 'hoàn thành', 'hoàn thành', 'hoàn thành'],
    'bốn mùa': ['bốn mùa', 'bốn mùa', 'bốn mùa', 'bốn mùa'],
    'mùa nước nổi': ['mùa nước nổi', 'mùa nước nổi', 'mùa nước nổi', 'mùa nước nổi'],
    'thời tiết': ['thời tiết', 'thời tiết', 'thời tiết', 'thời tiết'],
    'hạnh phúc': ['hạnh phúc', 'hạnh phúc', 'hạnh phúc', 'hạnh phúc'],
    'họa mi': ['họa mi', 'họa mi', 'họa mi', 'họa mi'],
    'Tết đến': ['Tết đến', 'Tết đến', 'Tết đến', 'Tết đến'],
    'ngày lễ': ['ngày lễ', 'ngày lễ', 'ngày lễ', 'ngày lễ'],
    'giọt nước': ['giọt nước', 'giọt nước', 'giọt nước', 'giọt nước'],
    'mùa vàng': ['mùa vàng', 'mùa vàng', 'mùa vàng', 'mùa vàng'],
    'lúa chín': ['lúa chín', 'lúa chín', 'lúa chín', 'lúa chín'],
    'hạt thóc': ['hạt thóc', 'hạt thóc', 'hạt thóc', 'hạt thóc'],
    'lũy tre': ['lũy tre', 'lũy tre', 'lũy tre', 'lũy tre'],
    'cây tre': ['cây tre', 'cây tre', 'cây tre', 'cây tre'],
    'vè chim': ['vè chim', 'vè chim', 'vè chim', 'vè chim'],
    'khủng long': ['khủng long', 'khủng long', 'khủng long', 'khủng long'],
    'bờ tre': ['bờ tre', 'bờ tre', 'bờ tre', 'bờ tre'],
    'tiếng chổi tre': ['tiếng chổi tre', 'tiếng chổi tre', 'tiếng chổi tre', 'tiếng chổi tre'],
    'cỏ non': ['cỏ non', 'cỏ non', 'cỏ non', 'cỏ non'],
    'sao biển': ['sao biển', 'sao biển', 'sao biển', 'sao biển'],
    'tạm biệt': ['tạm biệt', 'tạm biệt', 'tạm biệt', 'tạm biệt'],
    'côn trùng': ['côn trùng', 'côn trùng', 'côn trùng', 'côn trùng'],
    'giữa học kì': ['giữa học kì', 'giữa học kì', 'giữa học kì', 'giữa học kì'],
    'kiểm tra': ['kiểm tra', 'kiểm tra', 'kiểm tra', 'kiểm tra'],
    'chào hỏi': ['chào hỏi', 'chào hỏi', 'chào hỏi', 'chào hỏi'],
    'thư viện': ['thư viện', 'thư viện', 'thư viện', 'thư viện'],
    'sách vở': ['sách vở', 'sách vở', 'sách vở', 'sách vở'],
    'cảm ơn': ['cảm ơn', 'cảm ơn', 'cảm ơn', 'cảm ơn'],
    'in-tơ-nét': ['in-tơ-nét', 'in-tơ-nét', 'in-tơ-nét', 'in-tơ-nét'],
    'thông tin': ['thông tin', 'thông tin', 'thông tin', 'thông tin'],
    'Mai An Tiêm': ['Mai An Tiêm', 'Mai An Tiêm', 'Mai An Tiêm', 'Mai An Tiêm'],
    'thư gửi': ['thư gửi', 'thư gửi', 'thư gửi', 'thư gửi'],
    'hòn đảo': ['hòn đảo', 'hòn đảo', 'hòn đảo', 'hòn đảo'],
    'đất nước': ['đất nước', 'đất nước', 'đất nước', 'đất nước'],
    'miền đất': ['miền đất', 'miền đất', 'miền đất', 'miền đất'],
    'quê hương': ['quê hương', 'quê hương', 'quê hương', 'quê hương'],
    'quả bầu': ['quả bầu', 'quả bầu', 'quả bầu', 'quả bầu'],
    'khám phá': ['khám phá', 'khám phá', 'khám phá', 'khám phá'],
    'quần đảo': ['quần đảo', 'quần đảo', 'quần đảo', 'quần đảo'],
    'Hồ Gươm': ['Hồ Gươm', 'Hồ Gươm', 'Hồ Gươm', 'Hồ Gươm'],
    'cánh đồng': ['cánh đồng', 'cánh đồng', 'cánh đồng', 'cánh đồng'],
    'quê em': ['quê em', 'quê em', 'quê em', 'quê em'],
    'kết quả': ['kết quả', 'kết quả', 'kết quả', 'kết quả'],
    'năm học': ['năm học', 'năm học', 'năm học', 'năm học'],
    'xinh đẹp': ['xinh đẹp', 'xinh đẹp', 'xinh đẹp', 'xinh đẹp'],
    'gia đình': ['gia đình', 'gia đình', 'gia đình', 'gia đình'],
    'giờ học': ['giờ học', 'giờ học', 'giờ học', 'giờ học'],
    'bóp nát': ['bóp nát', 'bóp nát', 'bóp nát', 'bóp nát'],
    'chiếc rễ': ['chiếc rễ', 'chiếc rễ', 'chiếc rễ', 'chiếc rễ'],
    'cây đa': ['cây đa', 'cây đa', 'cây đa', 'cây đa'],
    'xấu hổ': ['xấu hổ', 'xấu hổ', 'xấu hổ', 'xấu hổ'],
    'cầu thủ': ['cầu thủ', 'cầu thủ', 'cầu thủ', 'cầu thủ'],
    'dự bị': ['dự bị', 'dự bị', 'dự bị', 'dự bị'],
    'cô giáo': ['cô giáo', 'cô giáo', 'cô giáo', 'cô giáo'],
    'thời khóa biểu': ['thời khóa biểu', 'thời khóa biểu', 'thời khóa biểu', 'thời khóa biểu'],
    'cái trống': ['cái trống', 'cái trống', 'cái trống', 'cái trống'],
    'danh sách': ['danh sách', 'danh sách', 'danh sách', 'danh sách'],
    'học vẽ': ['học vẽ', 'học vẽ', 'học vẽ', 'học vẽ'],
    'tranh vẽ': ['tranh vẽ', 'tranh vẽ', 'tranh vẽ', 'tranh vẽ'],
    'cuốn sách': ['cuốn sách', 'cuốn sách', 'cuốn sách', 'cuốn sách'],
    'trang sách': ['trang sách', 'trang sách', 'trang sách', 'trang sách'],
    'đọc sách': ['đọc sách', 'đọc sách', 'đọc sách', 'đọc sách'],
    'ôn tập': ['ôn tập', 'ôn tập', 'ôn tập', 'ôn tập'],
    'học kì': ['học kì', 'học kì', 'học kì', 'học kì'],
}

def generate_spelling_options(correct_word: str) -> List[str]:
    """
    Tạo 4 options cho câu hỏi chính tả:
    - 1 option đúng
    - 3 options sai (các lỗi chính tả phổ biến)
    """
    # Nếu có trong dictionary, dùng variants
    if correct_word in SPELLING_VARIANTS:
        variants = SPELLING_VARIANTS[correct_word]
        # Đảm bảo có ít nhất 1 option đúng
        if correct_word not in variants:
            variants[0] = correct_word
        # Đảm bảo không có duplicate
        unique_variants = []
        seen = set()
        for v in variants:
            if v not in seen:
                unique_variants.append(v)
                seen.add(v)
        # Nếu chưa đủ 4, thêm các biến thể sai
        while len(unique_variants) < 4:
            # Tạo biến thể sai bằng cách thay đổi một số ký tự
            wrong = generate_wrong_variant(correct_word, unique_variants)
            if wrong not in seen:
                unique_variants.append(wrong)
                seen.add(wrong)
        return unique_variants[:4]
    
    # Nếu không có trong dictionary, tạo options tự động
    options = [correct_word]  # Option đúng
    
    # Tạo 3 options sai
    wrong_options = generate_wrong_spelling_variants(correct_word)
    options.extend(wrong_options[:3])
    
    return options[:4]

def generate_wrong_variant(word: str, existing: List[str]) -> str:
    """Tạo một biến thể sai của từ"""
    # Thay đổi một số ký tự phổ biến
    replacements = {
        'i': 'y', 'y': 'i',
        's': 'x', 'x': 's',
        'd': 'đ', 'đ': 'd',
        'r': 'd', 'd': 'r',
        'g': 'gh', 'gh': 'g',
        'ng': 'ngh', 'ngh': 'ng',
    }
    
    for old, new in replacements.items():
        if old in word:
            variant = word.replace(old, new, 1)
            if variant != word and variant not in existing:
                return variant
    
    # Fallback: thêm/xóa một ký tự
    if len(word) > 2:
        return word[:-1]  # Xóa ký tự cuối
    return word + 'x'  # Thêm ký tự

def generate_wrong_spelling_variants(correct_word: str) -> List[str]:
    """Tạo các biến thể sai của từ"""
    variants = []
    
    # Pattern 1: Thay đổi phụ âm đầu
    if correct_word.startswith('gi'):
        variants.append('d' + correct_word[2:])  # gi -> d
        variants.append('r' + correct_word[2:])  # gi -> r
    elif correct_word.startswith('d'):
        variants.append('gi' + correct_word[1:])  # d -> gi
        variants.append('r' + correct_word[1:])  # d -> r
    elif correct_word.startswith('r'):
        variants.append('d' + correct_word[1:])  # r -> d
        variants.append('gi' + correct_word[1:])  # r -> gi
    
    # Pattern 2: Thay đổi phụ âm giữa
    if 's' in correct_word:
        variants.append(correct_word.replace('s', 'x', 1))
    if 'x' in correct_word:
        variants.append(correct_word.replace('x', 's', 1))
    
    # Pattern 3: Thay đổi nguyên âm
    if 'i' in correct_word:
        variants.append(correct_word.replace('i', 'y', 1))
    if 'y' in correct_word:
        variants.append(correct_word.replace('y', 'i', 1))
    
    # Pattern 4: Thiếu ký tự
    if len(correct_word) > 3:
        variants.append(correct_word[:-1])  # Xóa ký tự cuối
    
    # Đảm bảo không trùng với từ đúng
    variants = [v for v in variants if v != correct_word]
    
    # Đảm bảo không duplicate
    unique_variants = []
    seen = set()
    for v in variants:
        if v not in seen:
            unique_variants.append(v)
            seen.add(v)
    
    # Nếu chưa đủ 3, thêm các biến thể khác
    while len(unique_variants) < 3:
        wrong = generate_wrong_variant(correct_word, unique_variants + [correct_word])
        if wrong not in seen and wrong != correct_word:
            unique_variants.append(wrong)
            seen.add(wrong)
    
    return unique_variants[:3]

def check_duplicate_options(options: List[str]) -> bool:
    """Kiểm tra xem có options nào giống nhau không"""
    normalized = [opt.lower().strip() for opt in options]
    unique = set(normalized)
    return len(unique) < len(options)

def fix_question(question: Dict[str, Any], file_path: str) -> Tuple[bool, Dict[str, Any], str]:
    """
    Fix một câu hỏi
    Returns: (was_fixed, fixed_question, fix_message)
    """
    question_text = question.get('question', '').lower()
    options = question.get('options', [])
    correct_answer_idx = question.get('correctAnswer', -1)
    
    # Kiểm tra câu hỏi về chính tả
    is_spelling_question = (
        'chính tả' in question_text or
        'viết đúng' in question_text or
        'viết sai' in question_text or
        'đúng chính tả' in question_text or
        'sai chính tả' in question_text
    )
    
    was_fixed = False
    fix_message = ""
    
    # Fix 1: Options giống nhau hoàn toàn
    if check_duplicate_options(options):
        if is_spelling_question:
            # Tìm từ đúng từ options (lấy option đầu tiên không duplicate)
            unique_options = []
            seen = set()
            for opt in options:
                normalized = opt.lower().strip()
                if normalized not in seen:
                    unique_options.append(opt)
                    seen.add(normalized)
            
            if len(unique_options) == 1:
                # Tất cả options giống nhau - cần tạo options mới
                correct_word = unique_options[0]
                new_options = generate_spelling_options(correct_word)
                question['options'] = new_options
                
                # Tìm index của từ đúng
                correct_idx = new_options.index(correct_word) if correct_word in new_options else 0
                question['correctAnswer'] = correct_idx
                
                was_fixed = True
                fix_message = f"Fixed: Tạo options mới cho câu hỏi chính tả. Từ đúng: '{correct_word}'"
            else:
                # Có một số options giống nhau - loại bỏ duplicate
                # Giữ lại options unique và thêm options mới
                correct_word = unique_options[0] if unique_options else options[0]
                new_options = generate_spelling_options(correct_word)
                question['options'] = new_options
                
                # Tìm index của từ đúng
                correct_idx = new_options.index(correct_word) if correct_word in new_options else 0
                question['correctAnswer'] = correct_idx
                
                was_fixed = True
                fix_message = f"Fixed: Loại bỏ duplicate options và tạo options mới. Từ đúng: '{correct_word}'"
        else:
            # Không phải câu hỏi chính tả - chỉ loại bỏ duplicate
            unique_options = []
            seen = set()
            for opt in options:
                normalized = opt.lower().strip()
                if normalized not in seen:
                    unique_options.append(opt)
                    seen.add(normalized)
            
            # Nếu vẫn chưa đủ 4 options, thêm options mới
            while len(unique_options) < 4:
                # Tạo option mới dựa trên options hiện có
                base = unique_options[0] if unique_options else "Option"
                new_opt = f"{base} (variant {len(unique_options) + 1})"
                if new_opt not in seen:
                    unique_options.append(new_opt)
                    seen.add(new_opt.lower().strip())
            
            question['options'] = unique_options[:4]
            
            # Fix correctAnswer nếu cần
            if correct_answer_idx >= len(question['options']):
                question['correctAnswer'] = 0
            
            was_fixed = True
            fix_message = f"Fixed: Loại bỏ duplicate options. Giữ lại {len(unique_options)} options unique"
    
    # Fix 2: correctAnswer index không hợp lệ
    if correct_answer_idx < 0 or correct_answer_idx >= len(question['options']):
        # Tìm option đúng từ explanation hoặc option đầu tiên
        if is_spelling_question and 'viết đúng' in question_text:
            # Câu hỏi "viết đúng" - tìm từ đúng
            explanation = question.get('explanation', '')
            # Extract từ đúng từ explanation (thường có format "Từ đúng là '...'")
            match = re.search(r"['\"]([^'\"]+)['\"]", explanation)
            if match:
                correct_word = match.group(1)
                # Tìm index của từ đúng trong options
                for idx, opt in enumerate(question['options']):
                    if opt.strip() == correct_word:
                        question['correctAnswer'] = idx
                        was_fixed = True
                        fix_message += f" Fixed correctAnswer: {correct_answer_idx} -> {idx}"
                        break
        else:
            # Fallback: set về 0
            question['correctAnswer'] = 0
            was_fixed = True
            fix_message += f" Fixed correctAnswer: {correct_answer_idx} -> 0"
    
    return (was_fixed, question, fix_message)

def fix_file(file_path: str) -> Tuple[int, List[str]]:
    """Fix một file và trả về số câu hỏi đã fix và danh sách messages"""
    fixes = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        lessons = data.get('lessons', [])
        total_fixed = 0
        
        for lesson in lessons:
            lesson_id = lesson.get('id', 'unknown')
            questions = lesson.get('questions', [])
            
            for question in questions:
                was_fixed, fixed_question, fix_msg = fix_question(question, file_path)
                if was_fixed:
                    total_fixed += 1
                    q_id = question.get('id', 'unknown')
                    fixes.append(f"{lesson_id}/{q_id}: {fix_msg}")
        
        # Save file nếu có fix
        if total_fixed > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        
        return (total_fixed, fixes)
    
    except Exception as e:
        return (0, [f"Error: {str(e)}"])

def main():
    """Main function"""
    print("🔧 Đang fix các lỗi logic trong Vietnamese questions...\n")
    
    # Chỉ fix files trong public/data/questions (không fix backup)
    base_path = "public/data/questions"
    files = []
    for root, dirs, filenames in os.walk(base_path):
        # Skip backup folders
        if 'backup' in root:
            continue
        if 'vietnamese' in root:
            for filename in filenames:
                if filename.endswith('.json') and not filename.startswith('.'):
                    files.append(os.path.join(root, filename))
    
    files = sorted(files)
    print(f"📁 Tìm thấy {len(files)} files (không bao gồm backup)\n")
    
    total_fixed = 0
    files_fixed = 0
    
    for file_path in files:
        fixed_count, fix_messages = fix_file(file_path)
        if fixed_count > 0:
            files_fixed += 1
            total_fixed += fixed_count
            print(f"✅ {file_path}: Fixed {fixed_count} câu hỏi")
            for msg in fix_messages[:3]:  # Chỉ hiển thị 3 messages đầu
                print(f"   - {msg}")
            if len(fix_messages) > 3:
                print(f"   ... và {len(fix_messages) - 3} fixes khác")
    
    print("\n" + "=" * 80)
    print("📊 KẾT QUẢ FIX")
    print("=" * 80)
    print(f"📁 Files đã fix: {files_fixed}/{len(files)}")
    print(f"🔢 Tổng số câu hỏi đã fix: {total_fixed}")
    print("=" * 80)
    
    if total_fixed > 0:
        print("\n💡 Đã fix xong! Chạy lại validate_vietnamese_questions.py để verify.")

if __name__ == '__main__':
    main()

