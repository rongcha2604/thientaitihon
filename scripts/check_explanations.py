import json
import glob
import os
import sys
import io

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Find all week files
files = sorted(glob.glob('public/data/questions/ket-noi-tri-thuc/grade-1/math/week-*.json'))

fallback_count = 0
short_count = 0
total = 0
missing_count = 0
fallback_examples = []

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for lesson in data.get('lessons', []):
        for question in lesson.get('questions', []):
            total += 1
            explanation = question.get('explanation', '').strip()
            
            if not explanation:
                missing_count += 1
                fallback_examples.append(f"{os.path.basename(file_path)} - {question.get('id')}: (MISSING)")
            elif explanation.startswith('Đáp án đúng là'):
                fallback_count += 1
                if len(fallback_examples) < 10:
                    fallback_examples.append(f"{os.path.basename(file_path)} - {question.get('id')}: {explanation[:60]}")
            elif len(explanation) < 30:
                short_count += 1
                if len(fallback_examples) < 10:
                    fallback_examples.append(f"{os.path.basename(file_path)} - {question.get('id')}: {explanation[:60]}")

print(f"Total questions: {total}")
print(f"Missing explanations: {missing_count}")
print(f"Fallback explanations ('Đáp án đúng là...'): {fallback_count}")
print(f"Short explanations (<30 chars): {short_count}")
print(f"\nGood explanations: {total - missing_count - fallback_count - short_count}")
print(f"\nExamples of fallback/short/missing:")
for ex in fallback_examples:
    print(f"  - {ex}")

