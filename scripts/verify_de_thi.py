#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Đọc file đề thi
file_path = os.path.join('data', 'de-thi-tuan-1-lop-3.json')
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=" * 60)
print("KIEM TRA DE THI TUAN 1 - LOP 3")
print("=" * 60)

# Kiểm tra phân bổ đáp án
print("\n1. PHAN BO DAP AN:")
dist = {}
for q in data['questions']:
    ans = q['correctAnswer']
    dist[ans] = dist.get(ans, 0) + 1

print(f"   a: {dist.get('a', 0)} câu")
print(f"   b: {dist.get('b', 0)} câu")
print(f"   c: {dist.get('c', 0)} câu")
print(f"   d: {dist.get('d', 0)} câu")

if dist.get('a', 0) == 3 and dist.get('b', 0) == 3 and dist.get('c', 0) == 3 and dist.get('d', 0) == 3:
    print("   OK: Phan bo dung: moi dap an 3 lan")
else:
    print("   ERROR: Phan bo chua dung!")

# Kiểm tra tính toán
print("\n2. KIEM TRA TINH TOAN:")
checks = [
    ("Cau 2", 987 + 10, 997, "Tong so lon nhat 3 chu so khac nhau + so be nhat 2 chu so khac nhau"),
    ("Cau 5", 98 - 10, 88, "Hieu so chan lon nhat 2 chu so - so tron chuc nho nhat"),
    ("Cau 7", 999 - 901, 98, "Hieu so lon nhat va be nhat trong khoang 900-1000"),
    ("Cau 8", 225 + 425, 650, "225 + 425"),
    ("Cau 8", 690 - 40, 650, "690 - 40 (phai bang 225 + 425)"),
    ("Cau 9", 750 - 200, 550, "750 - 200"),
    ("Cau 9", 421 + 129, 550, "421 + 129 (phai bang 750 - 200)"),
    ("Cau 11", 275 + 319, 594, "275 + 319"),
    ("Cau 12", 560 - 280, 280, "560 - 280"),
]

all_correct = True
for check_name, calculated, expected, desc in checks:
    if calculated == expected:
        print(f"   OK {check_name}: {desc} = {calculated}")
    else:
        print(f"   ERROR {check_name}: {desc} = {calculated} (ky vong: {expected})")
        all_correct = False

# Kiểm tra đáp án đúng
print("\n3. KIEM TRA DAP AN DUNG:")
for q in data['questions']:
    q_id = q['id']
    correct_ans = q['correctAnswer']
    correct_value = q['options'][correct_ans]
    print(f"   Cau {q_id}: Dap an dung la {correct_ans} ({correct_value})")

print("\n" + "=" * 60)
if all_correct and dist.get('a', 0) == 3 and dist.get('b', 0) == 3 and dist.get('c', 0) == 3 and dist.get('d', 0) == 3:
    print("OK: TAT CA DEU DUNG!")
else:
    print("ERROR: CO LOI CAN SUA!")
print("=" * 60)

