import json
import re
import sys

def create_better_wrong_variants(correct_word):
    """Tạo options sai tự nhiên hơn"""
    wrong = []
    seen = {correct_word.lower()}
    
    # Pattern 1: Thay đổi phụ âm cuối (bạn -> bạ, bản, bàn)
    if correct_word.endswith('n'):
        w = correct_word[:-1]  # Xóa n
        if w.lower() not in seen and len(w) > 2:
            wrong.append(w)
            seen.add(w.lower())
    
    # Pattern 2: Thay đổi nguyên âm (thân -> thần, thấn)
    if 'â' in correct_word:
        w = correct_word.replace('â', 'ầ', 1)
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    if 'â' in correct_word and len(wrong) < 3:
        w = correct_word.replace('â', 'ấ', 1)
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    
    # Pattern 3: s <-> x
    if 's' in correct_word and len(wrong) < 3:
        w = correct_word.replace('s', 'x', 1)
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    if 'x' in correct_word and len(wrong) < 3:
        w = correct_word.replace('x', 's', 1)
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    
    # Pattern 4: gi <-> d <-> r
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
    
    # Pattern 5: Xóa ký tự cuối (nếu từ dài)
    if len(correct_word) > 4 and len(wrong) < 3:
        w = correct_word[:-1]
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    
    # Pattern 6: Thay đổi dấu thanh
    if 'á' in correct_word and len(wrong) < 3:
        w = correct_word.replace('á', 'à', 1)
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    if 'à' in correct_word and len(wrong) < 3:
        w = correct_word.replace('à', 'ả', 1)
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
    
    # Đảm bảo đủ 3 options sai
    while len(wrong) < 3:
        # Thêm ký tự hoặc thay đổi nhỏ
        if len(correct_word) > 3:
            w = correct_word[:-1] + 'x'
        else:
            w = correct_word + 'x'
        if w.lower() not in seen:
            wrong.append(w)
            seen.add(w.lower())
        else:
            break
    
    return wrong[:3]

def fix_question(q):
    text = q.get('question', '').lower()
    if 'chính tả' not in text and 'viết đúng' not in text and 'viết sai' not in text:
        return False
    
    opts = q.get('options', [])
    norm = [o.strip().lower() for o in opts]
    if len(set(norm)) == len(opts):
        return False
    
    expl = q.get('explanation', '')
    m = re.search(r"['\"]([^'\"]+)['\"]", expl)
    correct = m.group(1).strip() if m else opts[0].strip()
    
    wrong = create_better_wrong_variants(correct)
    new_opts = [correct] + wrong
    # Đảm bảo không duplicate
    unique_opts = []
    seen = set()
    for o in new_opts:
        if o.lower() not in seen:
            unique_opts.append(o)
            seen.add(o.lower())
    
    while len(unique_opts) < 4:
        w = correct + str(len(unique_opts))
        if w.lower() not in seen:
            unique_opts.append(w)
            seen.add(w.lower())
        else:
            break
    
    q['options'] = unique_opts[:4]
    
    if 'viết sai' in text:
        q['correctAnswer'] = 1 if len(unique_opts) > 1 else 0
    else:
        q['correctAnswer'] = unique_opts.index(correct) if correct in unique_opts else 0
    return True

week_num = sys.argv[1] if len(sys.argv) > 1 else '10'
file_path = f'public/data/questions/ket-noi-tri-thuc/grade-2/vietnamese/week-{week_num}.json'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    fixed = 0
    for lesson in data.get('lessons', []):
        for q in lesson.get('questions', []):
            if fix_question(q):
                fixed += 1
    
    if fixed > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ Week {week_num}: Fixed {fixed} questions!")
    else:
        print(f"✅ Week {week_num}: No fixes needed")
except Exception as e:
    print(f"❌ Week {week_num}: Error - {e}")

