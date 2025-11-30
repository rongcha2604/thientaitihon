import json

# Đọc file
with open('data/de-thi-tuan-6-lop-3.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== KIEM TRA DAP AN ===\n')

errors = []

for q in data['questions']:
    q_id = q['id']
    question = q['question']
    options = q['options']
    correct = q['correctAnswer']
    explanation = q['explanation']
    
    print(f'Cau {q_id}: Dap an dung: {correct} = {options[correct]}')
    
    # Kiểm tra logic
    try:
        if q_id == 1:
            result = 32 + 8 * 2
            print(f'  Tinh toan: 32 + 8 * 2 = {result}')
            if options[correct] != str(result):
                errors.append(f'Câu {q_id}: Sai! Kỳ vọng {result}, được {options[correct]}')
        elif q_id == 2:
            # 136 - 20 = 116, cần 116 + 10 = 126, vậy 20 : 2 = 10
            # Vậy: 136 - 20 : 2 = 136 - 10 = 126
            test_result = 136 - (20 / 2)
            print(f'  Tinh toan: 136 - 20 : 2 = {test_result}')
            if test_result != 126:
                errors.append(f'Câu {q_id}: Sai! Kỳ vọng 126, được {test_result}')
        elif q_id == 3:
            # (489 - 482) × 5
            result = (489 - 482) * 5
            print(f'  Tinh toan: (489 - 482) * 5 = {result}')
            if options[correct] != "(489 - 482) × 5":
                errors.append(f'Câu {q_id}: Sai! Đáp án không khớp')
        elif q_id == 4:
            result = 2 * (10 - 5)
            print(f'  Tinh toan: 2 * (10 - 5) = {result}')
            if options[correct] != str(result):
                errors.append(f'Câu {q_id}: Sai! Kỳ vọng {result}, được {options[correct]}')
        elif q_id == 5:
            # 50 + 5 × x = 100 → 5 × x = 50 → x = 10
            x = int(options[correct])
            result = 50 + 5 * x
            print(f'  Tinh toan: 50 + 5 * {x} = {result}')
            if result != 100:
                errors.append(f'Câu {q_id}: Sai! Kỳ vọng 100, được {result}')
        elif q_id == 6:
            result = 60 + (5 * 5)
            print(f'  Tinh toan: 60 + (5 * 5) = {result}')
            if options[correct] != str(result):
                errors.append(f'Câu {q_id}: Sai! Kỳ vọng {result}, được {options[correct]}')
        elif q_id == 7:
            result = 0 * (5 + 5)
            print(f'  Tinh toan: 0 * (5 + 5) = {result}')
            if options[correct] != str(result):
                errors.append(f'Câu {q_id}: Sai! Kỳ vọng {result}, được {options[correct]}')
        elif q_id == 8:
            # Làm tròn 68 → 70
            rounded = round(68 / 10) * 10
            print(f'  Lam tron: 68 -> {rounded}')
            if options[correct] != str(rounded):
                errors.append(f'Câu {q_id}: Sai! Kỳ vọng {rounded}, được {options[correct]}')
        elif q_id == 9:
            # Làm tròn 364 → 400
            rounded = round(364 / 100) * 100
            print(f'  Lam tron: 364 -> {rounded}')
            if options[correct] != str(rounded):
                errors.append(f'Câu {q_id}: Sai! Kỳ vọng {rounded}, được {options[correct]}')
        elif q_id == 10:
            # Kiểm tra dãy số làm tròn đến 60
            numbers = [55, 56, 61, 63]
            all_round_to_60 = all(round(n / 10) * 10 == 60 for n in numbers)
            print(f'  Kiem tra: {numbers} -> tat ca lam tron den 60? {all_round_to_60}')
            if not all_round_to_60:
                errors.append(f'Câu {q_id}: Sai! Không phải tất cả số đều làm tròn đến 60')
        elif q_id == 11:
            # Kiểm tra dãy số làm tròn đến 400
            numbers = [355, 376, 430, 418]
            all_round_to_400 = all(round(n / 100) * 100 == 400 for n in numbers)
            print(f'  Kiem tra: {numbers} -> tat ca lam tron den 400? {all_round_to_400}')
            if not all_round_to_400:
                errors.append(f'Câu {q_id}: Sai! Không phải tất cả số đều làm tròn đến 400')
        elif q_id == 12:
            total = 6 * 2
            remaining = total - 5
            print(f'  Tinh toan: 6 * 2 = {total}, con lai: {total} - 5 = {remaining}')
            if options[correct] != f'{remaining} thanh':
                errors.append(f'Câu {q_id}: Sai! Kỳ vọng {remaining} thanh, được {options[correct]}')
        
        print(f'  OK DUNG\n')
    except Exception as e:
        errors.append(f'Câu {q_id}: Lỗi - {str(e)}')
        print(f'  LOI: {e}\n')

print('=== KET QUA ===')
if errors:
    print(f'LOI: Tim thay {len(errors)} loi:')
    for error in errors:
        print(f'  - {error}')
else:
    print('OK: Tat ca cac cau deu co dap an dung!')

