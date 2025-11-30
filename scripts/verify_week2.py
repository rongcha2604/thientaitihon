#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def verify_week2():
    print("============================================================")
    print("KIEM TRA DE THI TUAN 2 - LOP 3")
    print("============================================================")

    try:
        with open('data/de-thi-tuan-2-lop-3.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: File not found")
        return
    except json.JSONDecodeError:
        print("Error: Invalid JSON")
        return

    questions = data.get('questions', [])
    answer_key = data.get('answerKey', {})

    # 1. Verify answer distribution
    print("\n1. PHAN BO DAP AN:")
    dist = {}
    for q in questions:
        correct_ans = q.get('correctAnswer')
        if correct_ans:
            dist[correct_ans] = dist.get(correct_ans, 0) + 1

    expected_count = data['totalQuestions'] / 4
    all_correct_dist = True
    for ans_option in ['a', 'b', 'c', 'd']:
        count = dist.get(ans_option, 0)
        print(f"   {ans_option}: {count} cau")
        if count != expected_count:
            all_correct_dist = False
    if all_correct_dist:
        print(f"   OK: Phan bo dung: moi dap an {int(expected_count)} lan")
    else:
        print("   ERROR: Phan bo khong dung!")

    # 2. Verify correct answers match answerKey
    print("\n2. KIEM TRA DAP AN DUNG:")
    answer_key_errors = False
    for q in questions:
        q_id = str(q['id'])
        correct_ans_in_q = q['correctAnswer']
        correct_ans_in_key = answer_key.get(q_id)

        if correct_ans_in_q != correct_ans_in_key:
            print(f"   ERROR Cau {q_id}: Dap an trong cau hoi ({correct_ans_in_q}) khong khop voi answerKey ({correct_ans_in_key}).")
            answer_key_errors = True
        else:
            print(f"   Cau {q_id}: Dap an dung la {correct_ans_in_q} ({q['options'][correct_ans_in_q]})")

    print("\n============================================================")
    if all_correct_dist and not answer_key_errors:
        print("OK: TAT CA DEU DUNG!")
    else:
        print("ERROR: CO LOI XAY RA!")
    print("============================================================")

if __name__ == "__main__":
    verify_week2()

