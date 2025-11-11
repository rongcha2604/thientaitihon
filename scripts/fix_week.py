import json
import re
import sys

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
    
    wrong = []
    if 's' in correct:
        wrong.append(correct.replace('s', 'x', 1))
    if 'x' in correct and len(wrong) < 3:
        wrong.append(correct.replace('x', 's', 1))
    if len(correct) > 3 and len(wrong) < 3:
        wrong.append(correct[:-1])
    if 'i' in correct and len(wrong) < 3:
        wrong.append(correct.replace('i', 'y', 1))
    while len(wrong) < 3:
        wrong.append(correct + 'x')
    
    new_opts = [correct] + wrong[:3]
    q['options'] = new_opts[:4]
    
    if 'viết sai' in text:
        q['correctAnswer'] = 1 if len(new_opts) > 1 else 0
    else:
        q['correctAnswer'] = new_opts.index(correct) if correct in new_opts else 0
    return True

week_num = sys.argv[1] if len(sys.argv) > 1 else '2'
file_path = f'public/data/questions/ket-noi-tri-thuc/grade-2/vietnamese/week-{week_num}.json'

print(f"🔧 Fixing week-{week_num}.json...")

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
        print(f"✅ Fixed {fixed} questions!")
    else:
        print("✅ No fixes needed")
except Exception as e:
    print(f"❌ Error: {e}")

