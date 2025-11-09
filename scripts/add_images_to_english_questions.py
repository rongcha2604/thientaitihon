#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tự động thêm imageUrl cho các câu hỏi tiếng Anh cần hình ảnh
Sử dụng Unsplash Source API (miễn phí, không cần key)
Hoặc emoji mapping cho từ vựng
"""

import json
import sys
import codecs
from pathlib import Path

# Fix encoding cho Windows console
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Mapping từ vựng → Emoji (cho phương án 2: Emoji-based)
VOCAB_EMOJI_MAP = {
    # Unit 1
    "ball": "⚽", "bike": "🚲", "book": "📚",
    # Unit 2
    "cake": "🎂", "car": "🚗", "cat": "🐱", "cup": "☕",
    # Unit 3
    "apple": "🍎", "bag": "👜", "can": "🥫", "hat": "👒",
    # Unit 4
    "desk": "🪑", "dog": "🐶", "door": "🚪", "duck": "🦆",
    # Unit 5
    "chicken": "🐔", "chips": "🍟", "fish": "🐟", "milk": "🥛",
    # Unit 6
    "bell": "🔔", "pen": "✏️", "pencil": "✏️", "red": "🔴",
    # Unit 7
    "garden": "🌳", "gate": "🚧", "girl": "👧", "goat": "🐐",
    # Unit 8
    "hair": "💇", "hand": "✋", "head": "👤", "horse": "🐴",
    # Unit 9
    "clocks": "🕐", "locks": "🔒", "mops": "🧹", "pots": "🍲",
    # Unit 10
    "mango": "🥭", "monkey": "🐵", "mother": "👩", "mouse": "🐭",
    # Unit 11
    "bus": "🚌", "run": "🏃", "sun": "☀️", "truck": "🚚",
    # Unit 12
    "lake": "🏞️", "leaf": "🍃", "lemons": "🍋",
    # Unit 13
    "bananas": "🍌", "noodles": "🍜", "nuts": "🥜",
    # Unit 14
    "teddy bear": "🧸", "tiger": "🐯", "top": "🧩", "turtle": "🐢",
    # Unit 15
    "face": "😊", "father": "👨", "foot": "🦶", "football": "⚽",
    # Unit 16
    "wash": "🧼", "water": "💧", "window": "🪟",
}

# Mapping từ vựng → Unsplash keywords (cho phương án 1: Unsplash API)
VOCAB_UNSPLASH_KEYWORDS = {
    # Unit 1
    "ball": "soccer ball", "bike": "bicycle", "book": "book",
    # Unit 2
    "cake": "birthday cake", "car": "red car", "cat": "cute cat", "cup": "coffee cup",
    # Unit 3
    "apple": "red apple", "bag": "handbag", "can": "tin can", "hat": "sun hat",
    # Unit 4
    "desk": "desk", "dog": "cute dog", "door": "wooden door", "duck": "yellow duck",
    # Unit 5
    "chicken": "chicken", "chips": "french fries", "fish": "fish", "milk": "milk",
    # Unit 6
    "bell": "bell", "pen": "pen", "pencil": "pencil", "red": "red color",
    # Unit 7
    "garden": "garden", "gate": "gate", "girl": "little girl", "goat": "goat",
    # Unit 8
    "hair": "hair", "hand": "hand", "head": "head", "horse": "horse",
    # Unit 9
    "clocks": "clock", "locks": "lock", "mops": "mop", "pots": "pot",
    # Unit 10
    "mango": "mango", "monkey": "monkey", "mother": "mother", "mouse": "mouse",
    # Unit 11
    "bus": "bus", "run": "running", "sun": "sun", "truck": "truck",
    # Unit 12
    "lake": "lake", "leaf": "leaf", "lemons": "lemon",
    # Unit 13
    "bananas": "banana", "noodles": "noodles", "nuts": "nuts",
    # Unit 14
    "teddy bear": "teddy bear", "tiger": "tiger", "top": "spinning top", "turtle": "turtle",
    # Unit 15
    "face": "face", "father": "father", "foot": "foot", "football": "football",
    # Unit 16
    "wash": "washing hands", "water": "water", "window": "window",
}

def get_image_url_for_vocab(vocab_word, method="unsplash"):
    """
    Tạo imageUrl cho từ vựng
    method: "unsplash" hoặc "emoji" hoặc "local"
    """
    vocab_lower = vocab_word.lower()
    
    if method == "unsplash":
        # Sử dụng Picsum Photos (Lorem Picsum) - miễn phí, không cần key, hình ảnh đẹp
        # Hoặc có thể dùng Unsplash Image API (cần key)
        # Format: https://picsum.photos/400/400?random={seed}
        # Seed dựa trên từ vựng để có hình ảnh cố định
        import hashlib
        seed = int(hashlib.md5(vocab_lower.encode()).hexdigest()[:8], 16)
        return f"https://picsum.photos/400/400?random={seed}"
        
        # Hoặc sử dụng API khác:
        # - Bing Image Search API (cần key)
        # - Google Custom Search API (cần key)
        # - Hoặc emoji (dễ nhất, không cần internet)
    
    elif method == "emoji":
        # Sử dụng emoji (không cần hình ảnh thực, chỉ cần emoji)
        # Frontend sẽ render emoji thay vì hình ảnh
        
        # Xử lý các trường hợp đặc biệt: số đếm, tên riêng
        # Số đếm → emoji số
        number_emoji_map = {
            "one": "1️⃣", "two": "2️⃣", "three": "3️⃣", "four": "4️⃣", 
            "five": "5️⃣", "six": "6️⃣", "seven": "7️⃣", "eight": "8️⃣", 
            "nine": "9️⃣", "ten": "🔟"
        }
        if vocab_lower in number_emoji_map:
            return f"emoji:{number_emoji_map[vocab_lower]}"
        
        # Tên riêng → emoji người
        name_emoji_map = {
            "bill": "👨", "bill's": "👨", "billy": "👨",
            "tom": "👦", "tommy": "👦",
            "mary": "👩", "marry": "👩",
            "john": "👨", "jane": "👩"
        }
        if vocab_lower in name_emoji_map:
            return f"emoji:{name_emoji_map[vocab_lower]}"
        
        # Từ vựng thông thường → lấy từ VOCAB_EMOJI_MAP
        emoji = VOCAB_EMOJI_MAP.get(vocab_lower, "📷")
        # Trả về emoji dưới dạng data URI hoặc chỉ cần emoji string
        # Để đơn giản, ta sẽ dùng format đặc biệt: "emoji:{emoji}"
        return f"emoji:{emoji}"
    
    elif method == "local":
        # Sử dụng hình ảnh local (cần tạo hình ảnh trước)
        # Format: /images/english/grade-1/{vocab}.png
        return f"/images/english/grade-1/{vocab_lower}.png"
    
    else:
        return None

def extract_vocab_from_question(question_text, correct_answer):
    """
    Trích xuất từ vựng từ câu hỏi và đáp án đúng
    """
    # Câu hỏi "What is the English word for this picture?" → đáp án đúng là từ vựng
    if "What is the English word for this picture" in question_text:
        return correct_answer
    
    # Câu hỏi "Which word matches this?" → đáp án đúng là từ vựng
    if "Which word matches this" in question_text:
        return correct_answer
    
    # Câu hỏi "Choose the correct word:" hoặc "Select the right word:" → từ vựng trong câu hỏi
    if "Choose the correct word:" in question_text or "Select the right word:" in question_text:
        # Lấy từ sau dấu ":"
        parts = question_text.split(":")
        if len(parts) >= 2:
            word = parts[1].strip().replace("'", "").strip()
            return word
    
    # Câu hỏi "Find the word:" hoặc "What is:" → từ vựng trong câu hỏi
    if "Find the word:" in question_text or "What is:" in question_text:
        parts = question_text.split(":")
        if len(parts) >= 2:
            word = parts[1].strip().replace("'", "").strip()
            return word
    
    # Câu hỏi "Complete the sentence:" → đáp án đúng là từ vựng (cần hình ảnh để học sinh biết chọn từ nào)
    if "Complete the sentence:" in question_text:
        # Đáp án đúng là từ vựng cần điền vào chỗ trống
        return correct_answer
    
    return None

def add_images_to_week_file(file_path, method="unsplash"):
    """
    Thêm imageUrl cho các câu hỏi cần hình ảnh
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    week_num = data.get("week")
    questions = data.get("lessons", [{}])[0].get("questions", [])
    
    updated_count = 0
    
    for q in questions:
        question_text = q.get("question", "")
        options = q.get("options", [])
        correct_answer_idx = q.get("correctAnswer")
        
        # Thêm hình ảnh cho TẤT CẢ câu hỏi vocabulary (để học sinh nhìn hình và chọn từ đúng):
        # - "What is the English word for this picture?" → cần hình ảnh
        # - "Which word matches this?" → cần hình ảnh
        # - "Choose the correct word:" → cần hình ảnh
        # - "Select the right word:" → cần hình ảnh
        # - "Find the word:" → cần hình ảnh
        # - "What is:" → cần hình ảnh
        
        # Lấy đáp án đúng
        if correct_answer_idx is not None and 0 <= correct_answer_idx < len(options):
            correct_answer = options[correct_answer_idx]
            
            # Trích xuất từ vựng
            vocab = extract_vocab_from_question(question_text, correct_answer)
            
            # Kiểm tra xem câu hỏi có phải là câu hỏi vocabulary không (cần hình ảnh)
            is_vocabulary_question = (
                "picture" in question_text.lower() or
                "matches this" in question_text.lower() or
                "choose the correct word" in question_text.lower() or
                "select the right word" in question_text.lower() or
                "find the word" in question_text.lower() or
                "what is:" in question_text.lower() or
                "complete the sentence:" in question_text.lower()  # Cần hình ảnh để biết chọn từ nào
            )
            
            # Nếu có từ vựng và là câu hỏi vocabulary
            if vocab and is_vocabulary_question:
                # Tạo imageUrl (hàm sẽ xử lý cả từ vựng thông thường và trường hợp đặc biệt)
                image_url = get_image_url_for_vocab(vocab, method)
                if image_url:
                    # Thêm hình ảnh cho TẤT CẢ câu hỏi vocabulary
                    q["imageUrl"] = image_url
                    updated_count += 1
    
    # Ghi lại file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    return updated_count

def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    # Đường dẫn đến các file JSON
    english_dir_src = project_root / "src" / "data" / "questions" / "ket-noi-tri-thuc" / "grade-1" / "english"
    english_dir_public = project_root / "public" / "data" / "questions" / "ket-noi-tri-thuc" / "grade-1" / "english"
    
    if not english_dir_src.exists():
        print(f"❌ Không tìm thấy thư mục: {english_dir_src}")
        return
    
    print("🖼️  Bắt đầu thêm hình ảnh cho các câu hỏi tiếng Anh...")
    print(f"📁 Thư mục: {english_dir_src}\n")
    
    # Phương án: "unsplash" (hình ảnh từ Picsum), "emoji" (emoji), hoặc "local" (hình ảnh local)
    # Khuyến nghị: "emoji" - dễ nhất, không cần internet, phù hợp lớp 1
    method = "emoji"  # Có thể đổi thành "unsplash" hoặc "local"
    
    total_updated = 0
    
    # Xử lý tất cả files
    week_files = sorted(english_dir_src.glob("week-*.json"))
    
    for week_file in week_files:
        updated_count = add_images_to_week_file(week_file, method)
        total_updated += updated_count
        if updated_count > 0:
            print(f"✅ {week_file.name}: Đã thêm {updated_count} hình ảnh")
    
    # Copy sang public
    if english_dir_public.exists():
        for week_file in week_files:
            import shutil
            shutil.copy(week_file, english_dir_public / week_file.name)
        print(f"\n✅ Đã copy files sang: {english_dir_public}")
    
    print(f"\n✅ Hoàn thành! Đã thêm {total_updated} hình ảnh cho {len(week_files)} files")
    print(f"📝 Phương án sử dụng: {method}")
    if method == "unsplash":
        print("🌐 Hình ảnh từ Unsplash Source API (miễn phí, không cần key)")
    elif method == "emoji":
        print("😀 Hình ảnh dạng emoji (cần cập nhật frontend để hiển thị emoji)")

if __name__ == "__main__":
    main()

