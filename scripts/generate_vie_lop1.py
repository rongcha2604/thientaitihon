#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tạo nội dung Tiếng Việt lớp 1 theo chương trình CTGDPT 2018
"""

import json
from datetime import date

# Danh sách các bài học theo chương trình
LESSONS = [
    # BÀI 0-43: Chữ cái đơn và vần đơn giản (Cấp độ Dễ)
    ("BÀI 0: Chào em vào lớp 1", "easy"),
    ("BÀI 1: A a", "easy"),
    ("BÀI 2: B b", "easy"),
    ("BÀI 3: C c", "easy"),
    ("BÀI 4: E e È è", "easy"),
    ("BÀI 5: Ôn tập và kể chuyện", "easy"),
    ("BÀI 6: O o Ơ ơ", "easy"),
    ("BÀI 7: Ô ô", "easy"),
    ("BÀI 8: D d Đ d", "easy"),
    ("BÀI 9: Ơ ơ", "easy"),
    ("BÀI 10: Ôn tập và kể chuyện", "easy"),
    ("BÀI 11: I i K k", "easy"),
    ("BÀI 12: H h L l", "easy"),
    ("BÀI 13: U u Ư ư", "easy"),
    ("BÀI 14: Ch ch Kh kh", "easy"),
    ("BÀI 15: Ôn tập và kể chuyện", "easy"),
    ("BÀI 16: M m N n", "easy"),
    ("BÀI 17: G g Gi gi", "easy"),
    ("BÀI 18: Gh gh Nh nh", "easy"),
    ("BÀI 19: Ng ng Ngh ngh", "easy"),
    ("BÀI 20: Ôn tập và kể chuyện", "easy"),
    ("BÀI 21: R r S s", "easy"),
    ("BÀI 22: T t Tr tr", "easy"),
    ("BÀI 23: Th th ia", "easy"),
    ("BÀI 24: ua ua", "easy"),
    ("BÀI 25: Ôn tập và kể chuyện", "easy"),
    ("BÀI 26: Ph ph Qu qu", "easy"),
    ("BÀI 27: V v X x", "easy"),
    ("BÀI 28: Y y", "easy"),
    ("BÀI 29: Luyện tập chính tả", "easy"),
    ("BÀI 30: Ôn tập và kể chuyện", "easy"),
    ("BÀI 31: an ăn ân", "easy"),
    ("BÀI 32: on ôn ơn", "easy"),
    ("BÀI 33: en ên in un", "easy"),
    ("BÀI 34: am âm ăm", "easy"),
    ("BÀI 35: Ôn tập và kể chuyện", "easy"),
    ("BÀI 36: om ôm ơm", "easy"),
    ("BÀI 37: em êm im um", "easy"),
    ("BÀI 38: ai ay ây", "easy"),
    ("BÀI 39: oi ôi ơi", "easy"),
    ("BÀI 40: Ôn tập và kể chuyện", "easy"),
    ("BÀI 41: ui ưi", "easy"),
    ("BÀI 42: ao eo", "easy"),
    ("BÀI 43: au âu êu", "easy"),
    ("BÀI 44: iu ưu", "easy"),
    ("BÀI 45: Ôn tập và kể chuyện", "easy"),
    ("BÀI 46: ac ác âc", "easy"),
    ("BÀI 47: oc ốc ục uc", "easy"),
    ("BÀI 48: at át ât", "easy"),
    ("BÀI 49: ot ôt ơt", "easy"),
    ("BÀI 50: Ôn tập và kể chuyện", "easy"),
    ("BÀI 51: et êt it", "easy"),
    ("BÀI 52: ut ưt", "easy"),
    ("BÀI 53: ap ắp ập", "easy"),
    ("BÀI 54: op ốp ộp", "easy"),
    ("BÀI 55: Ôn tập và kể chuyện", "easy"),
    ("BÀI 56: ep ép ip up", "easy"),
    ("BÀI 57: anh ênh inh", "easy"),
    ("BÀI 58: ach êch ich", "easy"),
    ("BÀI 59: ang ăng ông", "easy"),
    ("BÀI 60: Ôn tập và kể chuyện", "easy"),
    ("BÀI 61: ong ông ung ưng", "easy"),
    # BÀI 62-79: Vần phức tạp (Cấp độ Trung bình)
    ("BÀI 62: iệc iên iêp", "medium"),
    ("BÀI 63: iêng iêm yên", "medium"),
    ("BÀI 64: iêt iêu yêu", "medium"),
    ("BÀI 65: Ôn tập và kể chuyện", "medium"),
    ("BÀI 66: uôi uôm", "medium"),
    ("BÀI 67: uộc uột", "medium"),
    ("BÀI 68: uôn uông", "medium"),
    ("BÀI 69: ươi ươu", "medium"),
    ("BÀI 70: Ôn tập và kể chuyện", "medium"),
    ("BÀI 71: uoc uot", "medium"),
    ("BÀI 72: uom uop", "medium"),
    ("BÀI 73: ươn ương", "medium"),
    ("BÀI 74: oa oe", "medium"),
    ("BÀI 75: Ôn tập và kể chuyện", "medium"),
    ("BÀI 76: oan oãn oat oát", "medium"),
    ("BÀI 77: oai uê uy", "medium"),
    ("BÀI 78: uân uật", "medium"),
    ("BÀI 79: uyên uyêt", "medium"),
    # BÀI 80-83: Ôn tập và đánh giá (Cấp độ Khó)
    ("BÀI 80: Ôn tập và kể chuyện", "hard"),
    ("BÀI 81: Ôn tập", "hard"),
    ("BÀI 82: Ôn tập", "hard"),
    ("BÀI 83: Đánh giá cuối học kì", "hard"),
]

def generate_questions(lesson_name, level):
    """Tạo câu hỏi cho mỗi bài học"""
    questions = []
    
    # Lấy nội dung bài học (bỏ "BÀI X: ")
    content = lesson_name.split(": ", 1)[1] if ": " in lesson_name else lesson_name
    
    if "Ôn tập" in content or "Đánh giá" in content:
        # Câu hỏi ôn tập
        questions.extend([
            {
                "id": f"VIE1{level[0].upper()}Q01",
                "question": f"Chọn câu viết đúng chính tả:",
                "options": ["Em đi học.", "em di hoc", "Em, đi học", "em đi học"],
                "answer_index": 0,
                "answer_text": "Em đi học.",
                "explanation": "Viết hoa chữ đầu câu, có dấu chấm cuối."
            },
            {
                "id": f"VIE1{level[0].upper()}Q02",
                "question": "Từ nào viết đúng?",
                "options": ["bé", "bé", "bé", "bé"],
                "answer_index": 0,
                "answer_text": "bé",
                "explanation": "Chính tả đúng là 'bé'."
            },
            {
                "id": f"VIE1{level[0].upper()}Q03",
                "question": "Sắp xếp thành câu: 'bé / đi / học'",
                "options": ["Bé đi học.", "đi học Bé", "học Bé đi", "Bé học đi"],
                "answer_index": 0,
                "answer_text": "Bé đi học.",
                "explanation": "Trật tự đúng: Bé đi học."
            },
            {
                "id": f"VIE1{level[0].upper()}Q04",
                "question": "Từ nào có nghĩa là 'người nhỏ'?",
                "options": ["bé", "lớn", "cao", "thấp"],
                "answer_index": 0,
                "answer_text": "bé",
                "explanation": "'bé' có nghĩa là người nhỏ."
            },
            {
                "id": f"VIE1{level[0].upper()}Q05",
                "question": "Chọn từ viết đúng:",
                "options": ["học", "họk", "hốc", "học"],
                "answer_index": 0,
                "answer_text": "học",
                "explanation": "Chính tả đúng là 'học'."
            }
        ])
    else:
        # Câu hỏi về chữ cái/vần
        # Lấy chữ cái hoặc vần chính
        main_chars = content.split()[0] if content.split() else content
        
        questions.extend([
            {
                "id": f"VIE1{level[0].upper()}Q01",
                "question": f"Chữ cái nào là chữ '{main_chars.lower()}'?",
                "options": [main_chars.upper(), "A", "B", "C"],
                "answer_index": 0,
                "answer_text": main_chars.upper(),
                "explanation": f"Chữ '{main_chars.lower()}' viết hoa là '{main_chars.upper()}', viết thường là '{main_chars.lower()}'."
            },
            {
                "id": f"VIE1{level[0].upper()}Q02",
                "question": f"Từ nào có chứa chữ '{main_chars.lower()}'?",
                "options": [f"b{main_chars.lower()}", "ba", "cá", "dê"],
                "answer_index": 0,
                "answer_text": f"b{main_chars.lower()}",
                "explanation": f"Từ 'b{main_chars.lower()}' có chứa chữ '{main_chars.lower()}'."
            },
            {
                "id": f"VIE1{level[0].upper()}Q03",
                "question": f"Ghép chữ 'b' và '{main_chars.lower()}' thành từ:",
                "options": [f"b{main_chars.lower()}", f"{main_chars.lower()}b", f"b {main_chars.lower()}", f"{main_chars.lower()} b"],
                "answer_index": 0,
                "answer_text": f"b{main_chars.lower()}",
                "explanation": f"b + {main_chars.lower()} = b{main_chars.lower()}."
            },
            {
                "id": f"VIE1{level[0].upper()}Q04",
                "question": f"Từ nào có âm '{main_chars.lower()}'?",
                "options": [f"b{main_chars.lower()}", "ba", "cá", "dê"],
                "answer_index": 0,
                "answer_text": f"b{main_chars.lower()}",
                "explanation": f"Từ 'b{main_chars.lower()}' có âm '{main_chars.lower()}'."
            },
            {
                "id": f"VIE1{level[0].upper()}Q05",
                "question": f"Chọn từ có chữ '{main_chars.lower()}':",
                "options": [f"b{main_chars.lower()}", "ba", "cá", "dê"],
                "answer_index": 0,
                "answer_text": f"b{main_chars.lower()}",
                "explanation": f"Từ 'b{main_chars.lower()}' có chữ '{main_chars.lower()}'."
            }
        ])
    
    return questions

def generate_file(level):
    """Tạo file JSON cho một cấp độ"""
    topics = []
    
    for i, (lesson_name, lesson_level) in enumerate(LESSONS):
        if lesson_level != level:
            continue
            
        topic_id = f"VIE1{level[0].upper()}{i:02d}"
        questions = generate_questions(lesson_name, level)
        
        topics.append({
            "id": topic_id,
            "name": lesson_name,
            "questions": questions
        })
    
    data = {
        "meta": {
            "grade": 1,
            "subject": "Tiếng Việt",
            "language": "vi",
            "created_date": date.today().strftime("%Y-%m-%d"),
            "level": level,
            "curriculum": "CTGDPT 2018 – Chuẩn 2025"
        },
        "topics": topics
    }
    
    return data

def main():
    """Hàm chính"""
    for level in ["easy", "medium", "hard"]:
        data = generate_file(level)
        
        output_file = f"public/data/lop1/vie.{level}.json"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Đã tạo file: {output_file} với {len(data['topics'])} topics")

if __name__ == "__main__":
    main()

