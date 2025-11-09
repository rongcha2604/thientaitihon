#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Check vocabulary questions with images"""

import json
from pathlib import Path

total_vocab = 0
total_with_images = 0

for f in sorted(Path('src/data/questions/ket-noi-tri-thuc/grade-1/english').glob('week-*.json')):
    data = json.load(open(f, 'r', encoding='utf-8'))
    questions = data['lessons'][0]['questions']
    
    vocab_questions = [
        q for q in questions 
        if 'picture' in q['question'].lower() 
        or 'matches this' in q['question'].lower() 
        or 'choose the correct word' in q['question'].lower() 
        or 'select the right word' in q['question'].lower() 
        or 'find the word' in q['question'].lower() 
        or 'what is:' in q['question'].lower()
        or 'complete the sentence:' in q['question'].lower()  # Câu hỏi complete sentence cũng cần hình ảnh
    ]
    
    total_vocab += len(vocab_questions)
    total_with_images += sum(1 for q in vocab_questions if q.get('imageUrl') and q['imageUrl'] is not None)
    
    week_num = data.get('week')
    print(f"Week {week_num}: {len(vocab_questions)} vocabulary questions, {sum(1 for q in vocab_questions if q.get('imageUrl') and q['imageUrl'] is not None)} with images")

print(f"\nTotal vocabulary questions: {total_vocab}")
print(f"Questions with images: {total_with_images}")
if total_vocab > 0:
    print(f"Coverage: {total_with_images/total_vocab*100:.1f}%")

