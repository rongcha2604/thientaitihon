#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Debug script để kiểm tra logic thêm hình ảnh"""

import json
import sys
import codecs
from pathlib import Path

# Fix encoding cho Windows console
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Test với Week 5
file_path = Path("src/data/questions/ket-noi-tri-thuc/grade-1/english/week-5.json")

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

questions = data.get("lessons", [{}])[0].get("questions", [])

# Mapping emoji
VOCAB_EMOJI_MAP = {
    "chicken": "🐔", "chips": "🍟", "fish": "🐟", "milk": "🥛",
}

for i, q in enumerate(questions, 1):
    question_text = q.get("question", "")
    options = q.get("options", [])
    correct_answer_idx = q.get("correctAnswer")
    image_url = q.get("imageUrl")
    
    print(f"\nQ{i}: {question_text[:50]}...")
    print(f"  Options: {options}")
    print(f"  Correct answer index: {correct_answer_idx}")
    if correct_answer_idx is not None and 0 <= correct_answer_idx < len(options):
        correct_answer = options[correct_answer_idx]
        print(f"  Correct answer: {correct_answer}")
        
        # Kiểm tra logic
        if "picture" in question_text.lower() or "matches this" in question_text.lower():
            print(f"  ✅ Cần hình ảnh!")
            if correct_answer.lower() in VOCAB_EMOJI_MAP:
                emoji = VOCAB_EMOJI_MAP[correct_answer.lower()]
                expected_image_url = f"emoji:{emoji}"
                print(f"  Expected imageUrl: {expected_image_url}")
                print(f"  Current imageUrl: {image_url}")
                if image_url != expected_image_url:
                    print(f"  ❌ CHƯA CÓ HÌNH ẢNH!")
            else:
                print(f"  ⚠️  Không có emoji cho từ '{correct_answer}'")
        else:
                print(f"  Khong can hinh anh (khong co 'picture' hoac 'matches this')")

