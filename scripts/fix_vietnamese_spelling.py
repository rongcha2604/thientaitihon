#!/usr/bin/env python3
"""
Script để tự động fix các lỗi spelling trong Vietnamese questions
Fix các trường hợp:
1. Tất cả options giống nhau
2. Options có duplicate
3. Tạo options đúng/sai cho câu hỏi chính tả
"""

import json
import os
import re
from typing import List, Dict, Any, Tuple

# Dictionary: từ đúng -> [các biến thể sai phổ biến]
SPELLING_FIXES = {
    'làm việc': ['lầm việc', 'lạm việc', 'lảm việc'],
    'học sinh': ['học sin', 'học xinh', 'học xing'],
    'giải thưởng': ['dải thưởng', 'rải thưởng', 'giải thưởng'],
    'lớp học': ['lớp họ', 'lớp hộc', 'lớp hộc'],
    'gọi bạn': ['gọi bản', 'gọi bàn', 'gọi bạn'],
    'nhớ bạn': ['nhớ bản', 'nhớ bàn', 'nhớ bạn'],
    'bạn thân': ['bạn thần', 'bạn thấn', 'bạn thân'],
    'chữ cái': ['chữ cải', 'chữ cài', 'chữ cái'],
    'nhím nâu': ['nhím nầu', 'nhím nấu', 'nhím nâu'],
    'kết bạn': ['kết bản', 'kết bàn', 'kết bạn'],
    'thả diều': ['thả điều', 'thả điều', 'thả diều'],
    'đồ chơi': ['đồ chơi', 'đồ chơi', 'đồ chơi'],
    'nặn đồ chơi': ['nặn đồ chơi', 'nặn đồ chơi', 'nặn đồ chơi'],
    'đất sét': ['đất sét', 'đất sét', 'đất sét'],
    'tỉ muội': ['tỉ muội', 'tỉ muội', 'tỉ muội'],
    'mang về': ['mang về', 'mang về', 'mang về'],
    'yêu thương': ['yêu thương', 'yêu thương', 'yêu thương'],
    'mẹ yêu': ['mẹ yêu', 'mẹ yêu', 'mẹ yêu'],
    'trò chơi': ['trò chơi', 'trò chơi', 'trò chơi'],
    'bố mẹ': ['bố mẹ', 'bố mẹ', 'bố mẹ'],
    'cánh cửa': ['cánh cửa', 'cánh cửa', 'cánh cửa'],
    'thương ông': ['thương ông', 'thương ông', 'thương ông'],
    'ông bà': ['ông bà', 'ông bà', 'ông bà'],
    'ánh sáng': ['ánh sáng', 'ánh sáng', 'ánh sáng'],
    'chơi chông chóng': ['chơi chông chóng', 'chơi chông chóng', 'chơi chông chóng'],
    'cuối học kì': ['cuối học kì', 'cuối học kì', 'cuối học kì'],
    'đánh giá': ['đánh giá', 'đánh giá', 'đánh giá'],
    'hoàn thành': ['hoàn thành', 'hoàn thành', 'hoàn thành'],
    'bốn mùa': ['bốn mùa', 'bốn mùa', 'bốn mùa'],
    'mùa nước nổi': ['mùa nước nổi', 'mùa nước nổi', 'mùa nước nổi'],
    'thời tiết': ['thời tiết', 'thời tiết', 'thời tiết'],
    'hạnh phúc': ['hạnh phước', 'hạnh phước', 'hạnh phước'],
    'họa mi': ['họa mi', 'họa mi', 'họa mi'],
    'Tết đến': ['Tết đến', 'Tết đến', 'Tết đến'],
    'ngày lễ': ['ngày lễ', 'ngày lễ', 'ngày lễ'],
    'giọt nước': ['giọt nước', 'giọt nước', 'giọt nước'],
    'mùa vàng': ['mùa vàng', 'mùa vàng', 'mùa vàng'],
    'lúa chín': ['lúa chín', 'lúa chín', 'lúa chín'],
    'hạt thóc': ['hạt thóc', 'hạt thóc', 'hạt thóc'],
    'lũy tre': ['lũy tre', 'lũy tre', 'lũy tre'],
    'cây tre': ['cây tre', 'cây tre', 'cây tre'],
    'vè chim': ['vè chim', 'vè chim', 'vè chim'],
    'khủng long': ['khủng long', 'khủng long', 'khủng long'],
    'bờ tre': ['bờ tre', 'bờ tre', 'bờ tre'],
    'tiếng chổi tre': ['tiếng chổi tre', 'tiếng chổi tre', 'tiếng chổi tre'],
    'cỏ non': ['cỏ non', 'cỏ non', 'cỏ non'],
    'sao biển': ['sao biển', 'sao biển', 'sao biển'],
    'tạm biệt': ['tạm biệt', 'tạm biệt', 'tạm biệt'],
    'côn trùng': ['côn trùng', 'côn trùng', 'côn trùng'],
    'giữa học kì': ['giữa học kì', 'giữa học kì', 'giữa học kì'],
    'kiểm tra': ['kiểm tra', 'kiểm tra', 'kiểm tra'],
    'chào hỏi': ['chào hỏi', 'chào hỏi', 'chào hỏi'],
    'thư viện': ['thư viện', 'thư viện', 'thư viện'],
    'sách vở': ['sách vở', 'sách vở', 'sách vở'],
    'cảm ơn': ['cảm ơn', 'cảm ơn', 'cảm ơn'],
    'in-tơ-nét': ['in-tơ-nét', 'in-tơ-nét', 'in-tơ-nét'],
    'thông tin': ['thông tin', 'thông tin', 'thông tin'],
    'Mai An Tiêm': ['Mai An Tiêm', 'Mai An Tiêm', 'Mai An Tiêm'],
    'thư gửi': ['thư gửi', 'thư gửi', 'thư gửi'],
    'hòn đảo': ['hòn đảo', 'hòn đảo', 'hòn đảo'],
    'đất nước': ['đất nước', 'đất nước', 'đất nước'],
    'miền đất': ['miền đất', 'miền đất', 'miền đất'],
    'quê hương': ['quê hương', 'quê hương', 'quê hương'],
    'quả bầu': ['quả bầu', 'quả bầu', 'quả bầu'],
    'khám phá': ['khám phá', 'khám phá', 'khám phá'],
    'quần đảo': ['quần đảo', 'quần đảo', 'quần đảo'],
    'Hồ Gươm': ['Hồ Gươm', 'Hồ Gươm', 'Hồ Gươm'],
    'cánh đồng': ['cánh đồng', 'cánh đồng', 'cánh đồng'],
    'quê em': ['quê em', 'quê em', 'quê em'],
    'kết quả': ['kết quả', 'kết quả', 'kết quả'],
    'năm học': ['năm học', 'năm học', 'năm học'],
    'xinh đẹp': ['xinh đẹp', 'xinh đẹp', 'xinh đẹp'],
    'gia đình': ['gia đình', 'gia đình', 'gia đình'],
    'giờ học': ['giờ học', 'giờ học', 'giờ học'],
    'bóp nát': ['bóp nát', 'bóp nát', 'bóp nát'],
    'chiếc rễ': ['chiếc rễ', 'chiếc rễ', 'chiếc rễ'],
    'cây đa': ['cây đa', 'cây đa', 'cây đa'],
    'xấu hổ': ['xấu hổ', 'xấu hổ', 'xấu hổ'],
    'cầu thủ': ['cầu thủ', 'cầu thủ', 'cầu thủ'],
    'dự bị': ['dự bị', 'dự bị', 'dự bị'],
    'cô giáo': ['cô giáo', 'cô giáo', 'cô giáo'],
    'thời khóa biểu': ['thời khóa biểu', 'thời khóa biểu', 'thời khóa biểu'],
    'cái trống': ['cái trống', 'cái trống', 'cái trống'],
    'danh sách': ['danh sách', 'danh sách', 'danh sách'],
    'học vẽ': ['học vẽ', 'học vẽ', 'học vẽ'],
    'tranh vẽ': ['tranh vẽ', 'tranh vẽ', 'tranh vẽ'],
    'cuốn sách': ['cuốn sách', 'cuốn sách', 'cuốn sách'],
    'trang sách': ['trang sách', 'trang sách', 'trang sách'],
    'đọc sách': ['đọc sách', 'đọc sách', 'đọc sách'],
    'ôn tập': ['ôn tập', 'ôn tập', 'ôn tập'],
    'học kì': ['học kì', 'học kì', 'học kì'],
    'Lê- Gô': ['Lê- Gô', 'Lê- Gô', 'Lê- Gô'],
    'Xuân, Hạ, Thu, Đông': ['Xuân, Hạ, Thu, Đông', 'Xuân, Hạ, Thu, Đông', 'Xuân, Hạ, Thu, Đông'],
}

def get_unique_word_from_options(options: List[str]) -> str:
    """Lấy từ unique đầu tiên từ options"""
    seen = set()
    for opt in options:
        normalized = opt.strip()
        if normalized not in seen:
            seen.add(normalized)
            return normalized
    return options[0] if options else ""

def generate_spelling_options(correct_word: str) -> List[str]:
    """Tạo 4 options: 1 đúng + 3 sai"""
    if correct_word in SPELLING_FIXES:
        wrong_variants = SPELLING_FIXES[correct_word]
        # Đảm bảo không duplicate
        unique_wrong = []
        seen = {correct_word}
        for w in wrong_variants:
            if w not in seen:
                unique_wrong.append(w)
                seen.add(w)
        # Nếu chưa đủ 3, thêm variants
        while len(unique_wrong) < 3:
            # Tạo variant sai bằng cách thay đổi ký tự
            variant = create_wrong_variant(correct_word, seen)
            if variant:
                unique_wrong.append(variant)
                seen.add(variant)
        # Trộn và đảm bảo có 1 đúng
        options = [correct_word] + unique_wrong[:3]
        # Shuffle để đúng không luôn ở vị trí đầu
        import random
        random.seed(42)  # Deterministic
        random.shuffle(options)
        return options
    else:
        # Tạo tự động
        options = [correct_word]
        seen = {correct_word}
        for _ in range(3):
            variant = create_wrong_variant(correct_word, seen)
            if variant:
                options.append(variant)
                seen.add(variant)
        return options[:4]

def create_wrong_variant(word: str, seen: set) -> str:
    """Tạo variant sai của từ"""
    # Thay đổi phụ âm đầu: gi/d/r
    if word.startswith('gi'):
        variant = 'd' + word[2:]
        if variant not in seen:
            return variant
    if word.startswith('d') and not word.startswith('đ'):
        variant = 'gi' + word[1:]
        if variant not in seen:
            return variant
    # Thay đổi s/x
    if 's' in word:
        variant = word.replace('s', 'x', 1)
        if variant not in seen:
            return variant
    if 'x' in word:
        variant = word.replace('x', 's', 1)
        if variant not in seen:
            return variant
    # Thay đổi i/y
    if 'i' in word:
        variant = word.replace('i', 'y', 1)
        if variant not in seen:
            return variant
    # Xóa ký tự cuối
    if len(word) > 3:
        variant = word[:-1]
        if variant not in seen:
            return variant
    return None

def fix_question(question: Dict[str, Any]) -> Tuple[bool, str]:
    """Fix một câu hỏi, return (was_fixed, message)"""
    question_text = question.get('question', '').lower()
    options = question.get('options', [])
    
    is_spelling = 'chính tả' in question_text or 'viết đúng' in question_text or 'viết sai' in question_text
    
    # Check duplicate
    normalized = [opt.strip().lower() for opt in options]
    if len(set(normalized)) < len(options):
        if is_spelling:
            # Tìm từ đúng từ explanation
            explanation = question.get('explanation', '')
            match = re.search(r"['\"]([^'\"]+)['\"]", explanation)
            if match:
                correct_word = match.group(1).strip()
            else:
                # Lấy từ unique đầu tiên
                correct_word = get_unique_word_from_options(options)
            
            # Tạo options mới
            new_options = generate_spelling_options(correct_word)
            question['options'] = new_options
            
            # Fix correctAnswer
            correct_idx = new_options.index(correct_word) if correct_word in new_options else 0
            question['correctAnswer'] = correct_idx
            
            return (True, f"Fixed spelling question: '{correct_word}'")
        else:
            # Không phải spelling - chỉ remove duplicate
            unique = []
            seen = set()
            for opt in options:
                norm = opt.strip().lower()
                if norm not in seen:
                    unique.append(opt)
                    seen.add(norm)
            # Thêm options nếu thiếu
            while len(unique) < 4:
                base = unique[0] if unique else "Option"
                new = f"{base} {len(unique) + 1}"
                if new.lower() not in seen:
                    unique.append(new)
                    seen.add(new.lower())
            question['options'] = unique[:4]
            if question.get('correctAnswer', 0) >= len(question['options']):
                question['correctAnswer'] = 0
            return (True, "Removed duplicate options")
    
    return (False, "")

def fix_file(file_path: str) -> int:
    """Fix một file, return số câu đã fix"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        fixed_count = 0
        for lesson in data.get('lessons', []):
            for question in lesson.get('questions', []):
                was_fixed, _ = fix_question(question)
                if was_fixed:
                    fixed_count += 1
        
        if fixed_count > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        
        return fixed_count
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return 0

def main():
    print("🔧 Đang fix Vietnamese spelling questions...\n")
    
    base_path = "public/data/questions"
    files = []
    for root, dirs, filenames in os.walk(base_path):
        if 'backup' in root:
            continue
        if 'vietnamese' in root:
            for filename in filenames:
                if filename.endswith('.json'):
                    files.append(os.path.join(root, filename))
    
    files = sorted(files)
    print(f"📁 Tìm thấy {len(files)} files\n")
    
    total_fixed = 0
    files_fixed = 0
    
    for file_path in files:
        fixed = fix_file(file_path)
        if fixed > 0:
            files_fixed += 1
            total_fixed += fixed
            print(f"✅ {os.path.basename(file_path)}: {fixed} fixes")
    
    print(f"\n📊 Đã fix {total_fixed} câu hỏi trong {files_fixed} files")
    print("💡 Chạy validate_vietnamese_questions.py để verify")

if __name__ == '__main__':
    main()

