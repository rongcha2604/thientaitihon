import json
import os
import re

def fix_question(q):
    """Fix một câu hỏi"""
    text = q.get('question', '').lower()
    opts = q.get('options', [])
    
    # Chỉ fix câu hỏi chính tả
    if 'chính tả' not in text and 'viết đúng' not in text and 'viết sai' not in text:
        return False
    
    # Check duplicate
    norm = [o.strip().lower() for o in opts]
    if len(set(norm)) == len(opts):
        return False  # Không có duplicate
    
    # Tìm từ đúng từ explanation
    expl = q.get('explanation', '')
    m = re.search(r"['\"]([^'\"]+)['\"]", expl)
    if m:
        correct = m.group(1).strip()
    else:
        # Lấy từ unique đầu tiên
        seen = set()
        for o in opts:
            if o.strip().lower() not in seen:
                correct = o.strip()
                break
        else:
            correct = opts[0].strip()
    
    # Tạo options sai
    wrong = []
    if 's' in correct:
        wrong.append(correct.replace('s', 'x', 1))
    if 'x' in correct:
        wrong.append(correct.replace('x', 's', 1))
    if len(correct) > 3:
        wrong.append(correct[:-1])
    if 'i' in correct:
        wrong.append(correct.replace('i', 'y', 1))
    
    # Đảm bảo đủ 3 options sai, không duplicate
    unique_wrong = []
    seen = {correct.lower()}
    for w in wrong:
        if w.lower() not in seen and w != correct:
            unique_wrong.append(w)
            seen.add(w.lower())
    
    while len(unique_wrong) < 3:
        w = correct + 'x'
        if w.lower() not in seen:
            unique_wrong.append(w)
            seen.add(w.lower())
        else:
            break
    
    # Tạo 4 options
    new_opts = [correct] + unique_wrong[:3]
    q['options'] = new_opts[:4]
    q['correctAnswer'] = new_opts.index(correct) if correct in new_opts else 0
    return True

# Tìm files
files = []
for r, d, fs in os.walk('public/data/questions'):
    if 'backup' in r:
        continue
    if 'vietnamese' in r:
        for f in fs:
            if f.endswith('.json'):
                files.append(os.path.join(r, f))

print(f"Found {len(files)} files")
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
        print(f"❌ {f}: {e}")

print(f"\n📊 Total: {total} questions fixed")

