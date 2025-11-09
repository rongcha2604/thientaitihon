#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tạo bộ đề tiếng Anh lớp 1 - 16 chặng thử thách
Mỗi chặng 10 câu hỏi, giải thích song ngữ (Tiếng Việt + English)
Phân bổ đáp án đúng cân đối (A, B, C, D)
"""

import json
import random
import sys
import codecs
from pathlib import Path
from collections import Counter

# Fix encoding cho Windows console
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Định nghĩa dữ liệu 16 units
UNITS_DATA = [
    {
        "unit": 1,
        "title": "Unit 1: In the school playground",
        "phonics": "Bb",
        "vocabulary": ["ball", "bike", "book"],
        "sentence_patterns": ["Hi, I'm Bill.", "Bye, Bill."],
        "answer_dist": [3, 3, 2, 2]  # 3A, 3B, 2C, 2D
    },
    {
        "unit": 2,
        "title": "Unit 2: In the dining room",
        "phonics": "Cc",
        "vocabulary": ["cake", "car", "cat", "cup"],
        "sentence_patterns": ["I have a car."],
        "answer_dist": [3, 3, 2, 2]
    },
    {
        "unit": 3,
        "title": "Unit 3: At the street market",
        "phonics": "Aa",
        "vocabulary": ["apple", "bag", "can", "hat"],
        "sentence_patterns": ["This is my bag."],
        "answer_dist": [3, 3, 2, 2]
    },
    {
        "unit": 4,
        "title": "Unit 4: In the bedroom",
        "phonics": "Dd",
        "vocabulary": ["desk", "dog", "door", "duck"],
        "sentence_patterns": ["This is a dog."],
        "answer_dist": [3, 3, 2, 2]
    },
    {
        "unit": 5,
        "title": "Unit 5: At the fish and chip shop",
        "phonics": "Ii",
        "vocabulary": ["chicken", "chips", "fish", "milk"],
        "sentence_patterns": ["I like milk."],
        "answer_dist": [2, 3, 3, 2]  # 2A, 3B, 3C, 2D
    },
    {
        "unit": 6,
        "title": "Unit 6: In the classroom",
        "phonics": "Ee",
        "vocabulary": ["bell", "pen", "pencil", "red"],
        "sentence_patterns": ["It's a red pen."],
        "answer_dist": [2, 3, 3, 2]
    },
    {
        "unit": 7,
        "title": "Unit 7: In the garden",
        "phonics": "Gg",
        "vocabulary": ["garden", "gate", "girl", "goat"],
        "sentence_patterns": ["There's a garden."],
        "answer_dist": [2, 3, 3, 2]
    },
    {
        "unit": 8,
        "title": "Unit 8: In the park",
        "phonics": "Hh",
        "vocabulary": ["hair", "hand", "head", "horse"],
        "sentence_patterns": ["Touch your hair."],
        "answer_dist": [2, 3, 3, 2]
    },
    {
        "unit": 9,
        "title": "Unit 9: In the shop",
        "phonics": "Oo",
        "vocabulary": ["clocks", "locks", "mops", "pots"],
        "sentence_patterns": ["How many clocks? Two."],
        "answer_dist": [3, 2, 3, 2]  # 3A, 2B, 3C, 2D
    },
    {
        "unit": 10,
        "title": "Unit 10: At the zoo",
        "phonics": "Mm",
        "vocabulary": ["mango", "monkey", "mother", "mouse"],
        "sentence_patterns": ["That's a monkey."],
        "answer_dist": [3, 2, 3, 2]
    },
    {
        "unit": 11,
        "title": "Unit 11: At the bus stop",
        "phonics": "Uu",
        "vocabulary": ["bus", "run", "sun", "truck"],
        "sentence_patterns": ["She's running.", "He's running."],
        "answer_dist": [3, 2, 3, 2]
    },
    {
        "unit": 12,
        "title": "Unit 12: At the lake",
        "phonics": "Ll",
        "vocabulary": ["lake", "leaf", "lemons"],
        "sentence_patterns": ["Look at the lemons."],
        "answer_dist": [3, 2, 3, 2]
    },
    {
        "unit": 13,
        "title": "Unit 13: In the school canteen",
        "phonics": "Nn",
        "vocabulary": ["bananas", "noodles", "nuts"],
        "sentence_patterns": ["She's having noodles."],
        "answer_dist": [2, 3, 2, 3]  # 2A, 3B, 2C, 3D
    },
    {
        "unit": 14,
        "title": "Unit 14: In the toy shop",
        "phonics": "Tt",
        "vocabulary": ["teddy bear", "tiger", "top", "turtle"],
        "sentence_patterns": ["I can see a tiger."],
        "answer_dist": [2, 3, 2, 3]
    },
    {
        "unit": 15,
        "title": "Unit 15: At the football match",
        "phonics": "Ff",
        "vocabulary": ["face", "father", "foot", "football"],
        "sentence_patterns": ["Point to your hand."],
        "answer_dist": [2, 3, 2, 3]
    },
    {
        "unit": 16,
        "title": "Unit 16: At home",
        "phonics": "Ww",
        "vocabulary": ["wash", "water", "window"],
        "sentence_patterns": ["How many windows can you see? I can see six."],
        "answer_dist": [2, 3, 2, 3]
    }
]

# Bảng dịch câu sang tiếng Việt
SENTENCE_TRANSLATIONS = {
    "Hi, I'm Bill.": "Xin chào, tôi là Bill.",
    "Bye, Bill.": "Tạm biệt, Bill.",
    "I have a car.": "Tôi có một chiếc xe hơi.",
    "This is my bag.": "Đây là cặp của tôi.",
    "This is a dog.": "Đây là một con chó.",
    "I like milk.": "Tôi thích sữa.",
    "It's a red pen.": "Đó là một cây bút màu đỏ.",
    "There's a garden.": "Có một khu vườn.",
    "Touch your hair.": "Chạm vào tóc của bạn.",
    "How many clocks? Two.": "Có bao nhiêu cái đồng hồ? Hai.",
    "That's a monkey.": "Đó là một con khỉ.",
    "She's running.": "Cô ấy đang chạy.",
    "He's running.": "Anh ấy đang chạy.",
    "Look at the lemons.": "Nhìn vào những quả chanh.",
    "She's having noodles.": "Cô ấy đang ăn mì.",
    "I can see a tiger.": "Tôi có thể thấy một con hổ.",
    "Point to your hand.": "Chỉ vào tay của bạn.",
    "How many windows can you see? I can see six.": "Bạn có thể thấy bao nhiêu cửa sổ? Tôi có thể thấy sáu."
}

# Tất cả từ vựng từ tất cả units (để tạo distractors)
ALL_VOCABULARY = []
for unit in UNITS_DATA:
    ALL_VOCABULARY.extend(unit["vocabulary"])

def get_distractor_words(correct_word, count=3, exclude_letter=None):
    """Lấy các từ distractors (khác với từ đúng)"""
    distractors = []
    available_words = [w for w in ALL_VOCABULARY if w != correct_word]
    if exclude_letter:
        # Loại bỏ các từ bắt đầu bằng chữ cái exclude_letter
        available_words = [w for w in available_words if w[0].lower() != exclude_letter.lower()]
    random.shuffle(available_words)
    return available_words[:count]

def create_phonics_questions(unit_data):
    """Tạo câu hỏi về Phonics (3-4 câu)"""
    questions = []
    phonics = unit_data["phonics"]
    letter = phonics[0].upper()
    letter_lower = phonics[0].lower()
    
    # Câu 1: Nhận biết chữ cái
    other_letters = []
    for offset in [1, -1, 2, -2]:
        candidate = chr(ord(letter) + offset)
        if 'A' <= candidate <= 'Z' and candidate not in other_letters:
            other_letters.append(candidate)
            if len(other_letters) >= 3:
                break
    while len(other_letters) < 3:
        for char in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
            if char != letter and char not in other_letters:
                other_letters.append(char)
                if len(other_letters) >= 3:
                    break
    
    options = [letter] + other_letters[:3]
    random.shuffle(options)
    correct_idx = options.index(letter)
    
    # Tên chữ cái bằng tiếng Việt
    letter_names_vn = {
        "A": "a", "B": "bê", "C": "xê", "D": "dê", "E": "e", "F": "ép", "G": "giê",
        "H": "hát", "I": "i", "J": "gi", "K": "ca", "L": "en-lờ", "M": "em-mờ",
        "N": "en-nờ", "O": "ô", "P": "pê", "Q": "quy", "R": "e-rờ", "S": "ét-sì",
        "T": "tê", "U": "u", "V": "vê", "W": "đắp-liu", "X": "ích-xì", "Y": "i-cờ-rét", "Z": "dét"
    }
    letter_name_vn = letter_names_vn.get(letter, letter.lower())
    
    questions.append({
        "question": f"What letter is this: '{letter}'?",
        "options": options,
        "correct": correct_idx,
        "explanation": f"Tiếng Việt: Đây là chữ cái '{letter}' (đọc là '{letter_name_vn}'). English: This is the letter '{letter}'."
    })
    
    # Câu 2: Tìm từ bắt đầu bằng chữ cái (CHỈ lấy từ thực sự bắt đầu bằng chữ đó)
    vocab_words_starting_with_letter = [w for w in unit_data["vocabulary"] if w[0].lower() == letter_lower]
    if vocab_words_starting_with_letter:
        vocab_word = vocab_words_starting_with_letter[0]
        distractors = get_distractor_words(vocab_word, 3, exclude_letter=letter_lower)
        options = [vocab_word] + distractors[:3]
        random.shuffle(options)
        correct_idx = options.index(vocab_word)
        
        questions.append({
            "question": f"Which word starts with '{letter}'?",
            "options": options,
            "correct": correct_idx,
            "explanation": f"Tiếng Việt: Từ '{vocab_word}' bắt đầu bằng chữ '{letter}'. English: The word '{vocab_word}' starts with the letter '{letter}'."
        })
    
    # Câu 3: Phát âm
    sound_map = {
        "Bb": "/b/", "Cc": "/k/", "Aa": "/æ/", "Dd": "/d/",
        "Ii": "/ɪ/", "Ee": "/e/", "Gg": "/g/", "Hh": "/h/",
        "Oo": "/ɒ/", "Mm": "/m/", "Uu": "/ʌ/", "Ll": "/l/",
        "Nn": "/n/", "Tt": "/t/", "Ff": "/f/", "Ww": "/w/"
    }
    correct_sound = sound_map.get(phonics, "/?/")
    all_sounds = list(sound_map.values())
    other_sounds = [s for s in all_sounds if s != correct_sound]
    options = [correct_sound] + random.sample(other_sounds, 3)
    random.shuffle(options)
    correct_idx = options.index(correct_sound)
    
    questions.append({
        "question": f"How do you pronounce the letter '{letter}'?",
        "options": options,
        "correct": correct_idx,
        "explanation": f"Tiếng Việt: Chữ '{letter}' được phát âm là {correct_sound}. English: The letter '{letter}' is pronounced {correct_sound}."
    })
    
    return questions

def create_vocabulary_questions(unit_data):
    """Tạo câu hỏi về Vocabulary (3-4 câu)"""
    questions = []
    vocab_list = unit_data["vocabulary"]
    question_templates = [
        "What is the English word for this picture?",
        "Choose the correct word:",
        "Which word matches this?",
        "Select the right word:"
    ]
    
    used_templates = []
    for i, vocab_word in enumerate(vocab_list):
        # Chọn template khác nhau cho mỗi câu
        template = question_templates[i % len(question_templates)]
        if template in used_templates:
            template = f"Choose the correct word: '{vocab_word}'"
        used_templates.append(template)
        
        distractors = get_distractor_words(vocab_word, 3)
        options = [vocab_word] + distractors[:3]
        random.shuffle(options)
        correct_idx = options.index(vocab_word)
        
        question_text = f"{template} {vocab_word}" if ":" in template else f"{template}"
        
        questions.append({
            "question": question_text,
            "options": options,
            "correct": correct_idx,
            "explanation": f"Tiếng Việt: '{vocab_word}' là từ tiếng Anh đúng. English: '{vocab_word}' is the correct English word."
        })
    
    return questions

def create_sentence_questions(unit_data):
    """Tạo câu hỏi về Sentence patterns (2-3 câu)"""
    questions = []
    sentences = unit_data["sentence_patterns"]
    
    if not sentences:
        return questions
    
    # Câu 1: Hoàn thành câu
    sentence = sentences[0]
    # Xử lý câu có dấu "?" (như "How many windows can you see? I can see six." hoặc "How many clocks? Two.")
    if "?" in sentence:
        # Tách câu thành 2 phần: phần trước "?" và phần sau
        parts = sentence.split("?")
        if len(parts) == 2:
            # Phần sau "?" là câu thứ 2 (hoặc từ đơn)
            second_part = parts[1].strip()
            words = second_part.replace(".", "").replace(",", "").split()
            if len(words) >= 2:
                # Câu dài: "How many windows can you see? I can see six."
                # Chọn từ cuối của phần 2
                blank_word = words[-1]
                incomplete = parts[0] + "? " + " ".join(words[:-1]) + " _____."
            elif len(words) == 1:
                # Câu ngắn: "How many clocks? Two."
                blank_word = words[0]
                incomplete = parts[0] + "? _____."
            else:
                # Fallback: xử lý như câu bình thường
                words = sentence.replace(".", "").replace(",", "").replace("?", "").split()
                blank_word = words[-1] if words else ""
                incomplete = " ".join(words[:-1]) + " _____" + ("." if "." in sentence else "?")
        else:
            # Không có "?", xử lý bình thường
            words = sentence.replace(".", "").replace(",", "").split()
            blank_word = words[-1]
            incomplete = " ".join(words[:-1]) + " _____."
    else:
        words = sentence.replace(".", "").replace(",", "").split()
        if len(words) >= 3:
            # Chọn từ cuối để làm blank (thường là từ quan trọng)
            blank_word = words[-1]
            incomplete = " ".join(words[:-1]) + " _____."
        else:
            blank_word = ""
            incomplete = ""
    
    if blank_word and incomplete:
        
        # Tạo options từ vocabulary của unit
        distractors = []
        for vocab in unit_data["vocabulary"]:
            if vocab.lower() != blank_word.lower() and vocab not in distractors:
                distractors.append(vocab)
                if len(distractors) >= 3:
                    break
        # Nếu thiếu, lấy từ units khác
        while len(distractors) < 3:
            for vocab in ALL_VOCABULARY:
                if vocab.lower() != blank_word.lower() and vocab not in distractors:
                    distractors.append(vocab)
                    if len(distractors) >= 3:
                        break
        
        options = [blank_word] + distractors[:3]
        random.shuffle(options)
        correct_idx = options.index(blank_word)
        
        questions.append({
            "question": f"Complete the sentence: {incomplete}",
            "options": options,
            "correct": correct_idx,
            "explanation": f"Tiếng Việt: Câu hoàn chỉnh là '{sentence}'. English: The complete sentence is '{sentence}'."
        })
    
    # Câu 2: Dịch câu (nếu có câu thứ 2, dùng câu thứ 2, không thì dùng câu 1)
    if len(sentences) > 1:
        sentence = sentences[1]
    else:
        sentence = sentences[0]
    
    vietnamese = SENTENCE_TRANSLATIONS.get(sentence, f"Dịch: {sentence}")
    
    # Lấy các câu khác làm distractors
    other_sentences = []
    for unit in UNITS_DATA:
        if unit["unit"] != unit_data["unit"] and unit["sentence_patterns"]:
            for s in unit["sentence_patterns"]:
                if s != sentence and s not in other_sentences:
                    other_sentences.append(s)
                    if len(other_sentences) >= 10:
                        break
        if len(other_sentences) >= 10:
            break
    
    options = [sentence] + random.sample(other_sentences, min(3, len(other_sentences)))
    random.shuffle(options)
    correct_idx = options.index(sentence)
    
    questions.append({
        "question": f"Which sentence means '{vietnamese}'?",
        "options": options,
        "correct": correct_idx,
        "explanation": f"Tiếng Việt: '{sentence}' có nghĩa là '{vietnamese}'. English: '{sentence}' means '{vietnamese}'."
    })
    
    return questions

def assign_correct_answers(questions, answer_distribution):
    """Phân bổ đáp án đúng theo distribution và đổi chỗ options"""
    # Tạo list đáp án theo distribution
    target_answers = []
    for idx, count in enumerate(answer_distribution):
        target_answers.extend([idx] * count)
    
    # Xáo trộn để tránh liên tiếp, nhưng đảm bảo không có 2 câu liên tiếp cùng đáp án
    max_attempts = 100
    for attempt in range(max_attempts):
        random.shuffle(target_answers)
        # Kiểm tra không có 2 câu liên tiếp cùng đáp án
        consecutive = False
        for i in range(len(target_answers) - 1):
            if target_answers[i] == target_answers[i + 1]:
                consecutive = True
                break
        if not consecutive:
            break
    
    # Gán đáp án đúng cho từng câu
    for i, question in enumerate(questions):
        target_answer = target_answers[i] if i < len(target_answers) else i % 4
        current_correct = question["correct"]
        
        # Nếu đáp án hiện tại khác target, đổi chỗ
        if current_correct != target_answer:
            # Đổi chỗ options
            temp = question["options"][current_correct]
            question["options"][current_correct] = question["options"][target_answer]
            question["options"][target_answer] = temp
            question["correct"] = target_answer
    
    return questions

def create_week_file(unit_data, output_dir):
    """Tạo file JSON cho một unit"""
    week_num = unit_data["unit"]
    
    # Tạo tất cả câu hỏi
    all_questions = []
    
    # Phonics questions (3 câu)
    phonics_questions = create_phonics_questions(unit_data)
    all_questions.extend(phonics_questions)
    
    # Vocabulary questions (tối đa 4 câu, nhưng chỉ lấy đủ để có 10 câu tổng)
    vocab_questions = create_vocabulary_questions(unit_data)
    all_questions.extend(vocab_questions)
    
    # Sentence questions (2-3 câu)
    sentence_questions = create_sentence_questions(unit_data)
    all_questions.extend(sentence_questions)
    
    # Đảm bảo có đúng 10 câu, không trùng lặp
    unique_questions = []
    seen_questions = set()
    for q in all_questions:
        question_key = q["question"]
        if question_key not in seen_questions:
            unique_questions.append(q)
            seen_questions.add(question_key)
            if len(unique_questions) >= 10:
                break
    
    # Nếu vẫn thiếu, thêm câu hỏi bổ sung từ vocabulary
    while len(unique_questions) < 10:
        vocab_list = unit_data["vocabulary"]
        question_types_extra = [
            "Find the word:",
            "What is:",
            "Choose:",
            "Match:"
        ]
        for i, vocab in enumerate(vocab_list):
            if len(unique_questions) >= 10:
                break
            # Tạo câu hỏi mới với format phù hợp lớp 1 (KHÔNG dùng "What does X mean?")
            question_type = question_types_extra[i % len(question_types_extra)]
            question_text = f"{question_type} '{vocab}'"
            if question_text not in seen_questions:
                distractors = get_distractor_words(vocab, 3)
                options = [vocab] + distractors[:3]
                random.shuffle(options)
                correct_idx = options.index(vocab)
                unique_questions.append({
                    "question": question_text,
                    "options": options,
                    "correct": correct_idx,
                    "explanation": f"Tiếng Việt: '{vocab}' là từ tiếng Anh đúng. English: '{vocab}' is the correct English word."
                })
                seen_questions.add(question_text)
    
    # Giới hạn đúng 10 câu
    unique_questions = unique_questions[:10]
    
    # Phân bổ đáp án đúng
    unique_questions = assign_correct_answers(unique_questions, unit_data["answer_dist"])
    
    # Convert sang format JSON
    json_questions = []
    for i, q in enumerate(unique_questions):
        json_questions.append({
            "id": f"q{i + 1}",
            "type": "multiple-choice",
            "question": q["question"],
            "options": q["options"],
            "correctAnswer": q["correct"],
            "explanation": q["explanation"],
            "imageUrl": None
        })
    
    # Tạo structure JSON
    week_data = {
        "week": week_num,
        "subject": "english",
        "grade": 1,
        "bookSeries": "ket-noi-tri-thuc",
        "lessons": [
            {
                "id": f"lesson-{week_num}",
                "title": unit_data["title"],
                "duration": 10,
                "questions": json_questions
            }
        ]
    }
    
    # Ghi file
    output_path = Path(output_dir) / f"week-{week_num}.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(week_data, f, ensure_ascii=False, indent=2)
    
    # Verify phân bổ đáp án
    answer_counts = Counter(q["correctAnswer"] for q in json_questions)
    print(f"✅ Created: week-{week_num}.json | Answers: A={answer_counts[0]}, B={answer_counts[1]}, C={answer_counts[2]}, D={answer_counts[3]}")
    
    return week_data

def main():
    # Set random seed để có thể reproduce
    random.seed(42)
    
    # Đường dẫn output
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    output_dir = project_root / "src" / "data" / "questions" / "ket-noi-tri-thuc" / "grade-1" / "english"
    
    # Tạo thư mục nếu chưa có
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("🚀 Bắt đầu tạo bộ đề tiếng Anh lớp 1 - 16 chặng thử thách...")
    print(f"📁 Output directory: {output_dir}\n")
    
    # Tạo 16 files
    for unit_data in UNITS_DATA:
        create_week_file(unit_data, output_dir)
    
    print(f"\n✅ Hoàn thành! Đã tạo {len(UNITS_DATA)} files trong: {output_dir}")

if __name__ == "__main__":
    main()
