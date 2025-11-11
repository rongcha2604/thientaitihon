#!/usr/bin/env python3
"""Fix tất cả Vietnamese questions - version đơn giản và nhanh"""
import json
import os
import re

def create_wrong_variants(correct_word):
    """Tạo 3 options sai từ từ đúng"""
    wrong = []
    seen = {correct_word.lower()}
    
    # Pattern 1: s <-> x
    if 's' in correct_word:
        w = correct_word.replace('s', 'x', 1)
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    if 'x' in correct_word and len(wrong) < 3:
        w = correct_word.replace('x', 's', 1)
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    
    # Pattern 2: gi <-> d <-> r
    if correct_word.startswith('gi') and len(wrong) < 3:
        w = 'd' + correct_word[2:]
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    if correct_word.startswith('d') and not correct_word.startswith('đ') and len(wrong) < 3:
        w = 'gi' + correct_word[1:]
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    
    # Pattern 3: Xóa ký tự cuối
    if len(correct_word) > 3 and len(wrong) < 3:
        w = correct_word[:-1]
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    
    # Pattern 4: Thay đổi nguyên âm
    if 'i' in correct_word and len(wrong) < 3:
        w = correct_word.replace('i', 'y', 1)
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    
    # Đảm bảo đủ 3
    while len(wrong) < 3:
        w = correct_word + 'x'
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
        else:
            break
    
    return wrong[:3]

def fix_question(q):
    """Fix một câu hỏi"""
    text = q.get('question', '').lower()
    if 'chính tả' not in text and 'viết đúng' not in text and 'viết sai' not in text:
        return False
    
    opts = q.get('options', [])
    norm = [o.strip().lower() for o in opts]
    if len(set(norm)) == len(opts):
        return False  # Không duplicate
    
    # Tìm từ đúng
    expl = q.get('explanation', '')
    m = re.search(r"['\"]([^'\"]+)['\"]", expl)
    if m:
        correct = m.group(1).strip()
    else:
        # Lấy unique đầu tiên
        seen = set()
        for o in opts:
            if o.strip().lower() not in seen:
                correct = o.strip()
                break
        else:
            correct = opts[0].strip()
    
    # Tạo options mới
    wrong = create_wrong_variants(correct)
    new_opts = [correct] + wrong
    q['options'] = new_opts[:4]
    
    # Fix correctAnswer
    if 'viết sai' in text:
        # Câu hỏi "viết sai" - đáp án là một trong các options sai
        q['correctAnswer'] = 1 if len(new_opts) > 1 else 0
    else:
        # Câu hỏi "viết đúng" - đáp án là từ đúng
        q['correctAnswer'] = new_opts.index(correct) if correct in new_opts else 0
    
    return True

# Main
files = []
for r, d, fs in os.walk('public/data/questions'):
    if 'backup' in r:
        continue
    if 'vietnamese' in r:
        files.extend([os.path.join(r, f) for f in fs if f.endswith('.json')])

print(f"🔧 Fixing {len(files)} files...\n")
total = 0

for f in sorted(files):
    try:
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        fixed = 0
        for lesson in data.get('lessons', []):
            for q in lesson.get('questions', []):
                if fix_question(q):
                    fixed += 1
        
        if fixed > 0:
            with open(f, 'w', encoding='utf-8') as file:
                json.dump(data, file, ensure_ascii=False, indent=2)
            print(f"✅ {os.path.basename(f)}: {fixed}")
            total += fixed
    except Exception as e:
        print(f"❌ {os.path.basename(f)}: {e}")

print(f"\n📊 Total: {total} questions fixed!")

