#!/usr/bin/env python3
"""Quick fix Vietnamese spelling questions - chỉ fix files chính, skip backup"""
import json
import os
import re

def fix_duplicate_options(question, correct_word):
    """Fix options duplicate bằng cách tạo options mới"""
    # Tạo 3 options sai từ từ đúng
    wrong_options = []
    
    # Pattern 1: Thay đổi phụ âm đầu
    if correct_word.startswith('gi'):
        wrong_options.append('d' + correct_word[2:])
        wrong_options.append('r' + correct_word[2:])
    elif correct_word.startswith('d') and not correct_word.startswith('đ'):
        wrong_options.append('gi' + correct_word[1:])
        wrong_options.append('r' + correct_word[1:])
    elif correct_word.startswith('r'):
        wrong_options.append('d' + correct_word[1:])
        wrong_options.append('gi' + correct_word[1:])
    
    # Pattern 2: Thay đổi s/x
    if 's' in correct_word and len(wrong_options) < 3:
        wrong_options.append(correct_word.replace('s', 'x', 1))
    if 'x' in correct_word and len(wrong_options) < 3:
        wrong_options.append(correct_word.replace('x', 's', 1))
    
    # Pattern 3: Xóa ký tự cuối
    if len(correct_word) > 3 and len(wrong_options) < 3:
        wrong_options.append(correct_word[:-1])
    
    # Đảm bảo đủ 3 options sai
    while len(wrong_options) < 3:
        wrong_options.append(correct_word + 'x')
    
    # Tạo 4 options: 1 đúng + 3 sai (shuffle)
    all_options = [correct_word] + wrong_options[:3]
    # Đảm bảo không duplicate
    unique = []
    seen = set()
    for opt in all_options:
        if opt not in seen:
            unique.append(opt)
            seen.add(opt)
    while len(unique) < 4:
        unique.append(correct_word + str(len(unique)))
    
    question['options'] = unique[:4]
    # Tìm index của từ đúng
    correct_idx = unique.index(correct_word) if correct_word in unique else 0
    question['correctAnswer'] = correct_idx

def fix_file(file_path):
    """Fix một file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        fixed = 0
        for lesson in data.get('lessons', []):
            for q in lesson.get('questions', []):
                question_text = q.get('question', '').lower()
                options = q.get('options', [])
                
                # Chỉ fix câu hỏi về chính tả
                if 'chính tả' not in question_text and 'viết đúng' not in question_text and 'viết sai' not in question_text:
                    continue
                
                # Check duplicate
                normalized = [o.strip().lower() for o in options]
                if len(set(normalized)) < len(options):
                    # Tìm từ đúng từ explanation
                    explanation = q.get('explanation', '')
                    match = re.search(r"['\"]([^'\"]+)['\"]", explanation)
                    if match:
                        correct_word = match.group(1).strip()
                    else:
                        # Lấy từ unique đầu tiên
                        seen = set()
                        for opt in options:
                            norm = opt.strip()
                            if norm.lower() not in seen:
                                correct_word = norm
                                break
                        else:
                            correct_word = options[0].strip()
                    
                    fix_duplicate_options(q, correct_word)
                    fixed += 1
        
        if fixed > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        
        return fixed
    except Exception as e:
        return 0

# Chỉ fix files trong public/data/questions, skip backup
files = []
for root, dirs, filenames in os.walk('public/data/questions'):
    if 'backup' in root:
        continue
    if 'vietnamese' in root:
        for f in filenames:
            if f.endswith('.json'):
                files.append(os.path.join(root, f))

print(f"🔧 Fixing {len(files)} files...\n")
total = 0
for f in sorted(files):
    fixed = fix_file(f)
    if fixed > 0:
        print(f"✅ {os.path.basename(f)}: {fixed} fixes")
        total += fixed

print(f"\n📊 Đã fix {total} câu hỏi!")

