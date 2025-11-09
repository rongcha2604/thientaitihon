#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tạo bộ đề toán lớp 1 - Kết nối tri thức
Yêu cầu:
- 20 câu hỏi mỗi tuần
- Phân bổ đều: 5 câu A, 5 câu B, 5 câu C, 5 câu D
- Xáo trộn ngẫu nhiên và KHÔNG có 2 câu liên tiếp cùng đáp án đúng
- Xáo trộn vị trí đáp án trong mỗi câu hỏi
"""

import json
import random
import sys
import codecs
from pathlib import Path
from collections import Counter

# Fix encoding cho Windows console
if sys.platform == 'win32':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Load dữ liệu từ file toan1-ky1.json
def load_week_data_from_json():
    """Load dữ liệu từ file toan1-ky1.json và script create_all_math_weeks.py"""
    json_path = Path("Sách/Kết nối tri thức với cuộc sống/Lớp 1/toan1-ky1.json")
    
    weeks_data = {}
    
    # Load từ toan1-ky1.json
    if json_path.exists():
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for test in data.get("tests", []):
            week_num = test.get("week")
            if not week_num:
                continue
            
            # Convert từ format cũ (options là dict) sang format mới (options là list)
            questions = []
            for q in test.get("questions", []):
                # Convert options từ dict sang list
                options_dict = q.get("options", {})
                options_list = [options_dict.get("A"), options_dict.get("B"), options_dict.get("C"), options_dict.get("D")]
                
                # Convert correctAnswer từ "A"/"B"/"C"/"D" sang index 0/1/2/3
                correct_answer = q.get("correctAnswer", "A")
                correct_index = ord(correct_answer) - ord("A") if isinstance(correct_answer, str) else correct_answer
                
                questions.append({
                    "q": q.get("question", ""),
                    "options": options_list,
                    "correct": correct_index,
                    "exp": q.get("explanation", "")
                })
            
            weeks_data[week_num] = {
                "title": test.get("title", f"TUẦN {week_num}").replace("TUẦN ", ""),
                "description": test.get("description", ""),
                "duration": 20,  # 20 câu hỏi, ~1 phút mỗi câu
                "questions": questions
            }
    else:
        print(f"⚠️ Không tìm thấy file: {json_path}")
    
    # Load week 13 từ script create_all_math_weeks.py (nếu không có trong toan1-ky1.json)
    if 13 not in weeks_data:
        # Week 13 data từ create_all_math_weeks.py
        week_13_questions = [
            {"q": "Có 5 quả táo, thêm 3 quả nữa. Hỏi có tất cả bao nhiêu quả táo?", "options": ["7 quả", "8 quả", "9 quả", "10 quả"], "correct": 1, "exp": "5 + 3 = 8"},
            {"q": "Có 8 con gà, bay đi 2 con. Hỏi còn lại bao nhiêu con gà?", "options": ["5 con", "6 con", "7 con", "8 con"], "correct": 1, "exp": "8 - 2 = 6"},
            {"q": "Có 6 cái kẹo, mẹ cho thêm 4 cái nữa. Hỏi có tất cả bao nhiêu cái kẹo?", "options": ["9 cái", "10 cái", "11 cái", "12 cái"], "correct": 1, "exp": "6 + 4 = 10"},
            {"q": "Có 9 quả cam, ăn hết 3 quả. Hỏi còn lại bao nhiêu quả cam?", "options": ["5 quả", "6 quả", "7 quả", "8 quả"], "correct": 1, "exp": "9 - 3 = 6"},
            {"q": "Có 7 cái bánh, mua thêm 2 cái nữa. Hỏi có tất cả bao nhiêu cái bánh?", "options": ["8 cái", "9 cái", "10 cái", "11 cái"], "correct": 1, "exp": "7 + 2 = 9"},
            {"q": "Có 10 con chim, bay đi 4 con. Hỏi còn lại bao nhiêu con chim?", "options": ["5 con", "6 con", "7 con", "8 con"], "correct": 1, "exp": "10 - 4 = 6"},
            {"q": "4 + 5 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "4 + 5 = 9"},
            {"q": "3 + 6 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "3 + 6 = 9"},
            {"q": "2 + 7 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "2 + 7 = 9"},
            {"q": "1 + 8 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "1 + 8 = 9"},
            {"q": "5 + 4 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "5 + 4 = 9"},
            {"q": "6 + 3 = ?", "options": ["8", "9", "10", "11"], "correct": 1, "exp": "6 + 3 = 9"},
        ]
        
        weeks_data[13] = {
            "title": "Bảng cộng, bảng trừ trong phạm vi 10",
            "description": "Bảng cộng, bảng trừ trong phạm vi 10",
            "duration": 20,
            "questions": week_13_questions
        }
    
    return weeks_data

def expand_questions_to_20(questions, week_num):
    """Mở rộng danh sách câu hỏi lên 20 câu, lặp lại câu hỏi nếu thiếu"""
    current_count = len(questions)
    if current_count >= 20:
        # Nếu đã có >= 20 câu, chỉ lấy 20 câu đầu
        return questions[:20]
    
    # Nếu thiếu, lặp lại câu hỏi (sẽ được xáo trộn options sau)
    expanded = questions.copy()
    
    # Lặp lại câu hỏi cho đủ 20 câu
    while len(expanded) < 20:
        # Lấy câu hỏi theo vòng tròn để đảm bảo đa dạng
        index = len(expanded) % current_count
        expanded.append(questions[index].copy())
    
    return expanded[:20]

def shuffle_options_with_correct_answer(question):
    """Xáo trộn vị trí các đáp án, nhưng track đáp án đúng mới"""
    options = question["options"].copy()
    correct_index = question["correct"]
    correct_answer = options[correct_index]
    
    # Xáo trộn options
    random.shuffle(options)
    
    # Tìm vị trí mới của đáp án đúng
    new_correct_index = options.index(correct_answer)
    
    return {
        "q": question["q"],
        "options": options,
        "correct": new_correct_index,
        "exp": question["exp"]
    }

def distribute_answers_evenly_no_consecutive():
    """Tạo phân bổ đáp án đều (5 mỗi loại) và không có 2 câu liên tiếp cùng đáp án"""
    # Với 4 loại đáp án (A, B, C, D) và mỗi loại 5 câu, luôn có thể tạo sequence không có 2 câu liên tiếp
    # Strategy: Tạo pattern đảm bảo không lặp lại
    
    # Tạo danh sách đáp án: 5 câu A, 5 câu B, 5 câu C, 5 câu D
    answer_pool = [0] * 5 + [1] * 5 + [2] * 5 + [3] * 5
    
    # Thuật toán: Xây dựng sequence từng bước, đảm bảo không có 2 câu liên tiếp
    shuffled_answers = []
    remaining_answers = answer_pool.copy()
    random.shuffle(remaining_answers)  # Xáo trộn ban đầu
    
    # Đếm số lượng còn lại của mỗi loại
    counts = {0: 5, 1: 5, 2: 5, 3: 5}
    
    for _ in range(20):
        if not remaining_answers:
            break
        
        if not shuffled_answers:
            # Câu đầu tiên: chọn ngẫu nhiên
            chosen = random.choice(remaining_answers)
        else:
            # Câu tiếp theo: chọn ngẫu nhiên nhưng khác đáp án câu trước
            last_answer = shuffled_answers[-1]
            
            # Lọc các đáp án khác với câu trước
            available = [a for a in remaining_answers if a != last_answer]
            
            if not available:
                # Trường hợp này không nên xảy ra với 4 loại đáp án
                # Nếu xảy ra, chọn ngẫu nhiên từ remaining (sẽ có warning)
                chosen = random.choice(remaining_answers)
            else:
                # Ưu tiên chọn đáp án có số lượng còn nhiều nhất (để tránh bị cạn kiệt)
                available_counts = {a: remaining_answers.count(a) for a in set(available)}
                max_count = max(available_counts.values())
                best_available = [a for a, count in available_counts.items() if count == max_count]
                chosen = random.choice(best_available)
        
        shuffled_answers.append(chosen)
        remaining_answers.remove(chosen)
    
    # Verify kết quả
    is_valid, error_index = verify_no_consecutive_duplicates(shuffled_answers)
    if not is_valid:
        # Nếu vẫn có lỗi, thử lại với cách khác
        return distribute_answers_evenly_no_consecutive_alternative()
    
    return shuffled_answers

def distribute_answers_evenly_no_consecutive_alternative():
    """Thuật toán thay thế: Tạo pattern đảm bảo không lặp lại"""
    # Tạo pattern: A, B, C, D, A, B, C, D, ... (vòng tròn)
    # Rồi xáo trộn nhưng đảm bảo không có 2 câu liên tiếp
    base_pattern = [0, 1, 2, 3] * 5  # [0,1,2,3, 0,1,2,3, 0,1,2,3, 0,1,2,3, 0,1,2,3]
    
    # Xáo trộn nhưng đảm bảo không có 2 câu liên tiếp
    shuffled = []
    remaining = base_pattern.copy()
    
    while remaining:
        if not shuffled:
            chosen = random.choice(remaining)
        else:
            last = shuffled[-1]
            available = [a for a in remaining if a != last]
            if not available:
                # Fallback: chọn ngẫu nhiên
                chosen = random.choice(remaining)
            else:
                chosen = random.choice(available)
        
        shuffled.append(chosen)
        remaining.remove(chosen)
    
    return shuffled

def assign_answers_to_questions(questions, answer_distribution):
    """Gán đáp án cho các câu hỏi, xáo trộn options và đặt đáp án đúng vào vị trí target"""
    result_questions = []
    
    for i, question in enumerate(questions):
        target_answer = answer_distribution[i]
        
        # Lấy đáp án đúng hiện tại
        current_correct_index = question["correct"]
        current_correct_answer = question["options"][current_correct_index]
        
        # Xáo trộn options
        shuffled_options = question["options"].copy()
        random.shuffle(shuffled_options)
        
        # Tìm vị trí của đáp án đúng trong options đã shuffle
        new_correct_index = shuffled_options.index(current_correct_answer)
        
        # Nếu vị trí đúng không khớp với target, đổi lại
        if new_correct_index != target_answer:
            # Đổi vị trí: đưa đáp án đúng vào vị trí target
            shuffled_options[target_answer], shuffled_options[new_correct_index] = \
                shuffled_options[new_correct_index], shuffled_options[target_answer]
            new_correct_index = target_answer
        
        result_questions.append({
            "q": question["q"],
            "options": shuffled_options,
            "correct": new_correct_index,
            "exp": question["exp"]
        })
    
    return result_questions

def verify_no_consecutive_duplicates(answers):
    """Kiểm tra không có 2 câu liên tiếp cùng đáp án"""
    for i in range(len(answers) - 1):
        if answers[i] == answers[i + 1]:
            return False, i
    return True, -1

def create_week_file_with_20_questions(week_num, week_data, output_dir):
    """Tạo file JSON cho một tuần với 20 câu hỏi"""
    # Mở rộng lên 20 câu hỏi
    questions = expand_questions_to_20(week_data["questions"], week_num)
    
    # Tạo phân bổ đáp án đều và không có 2 câu liên tiếp
    answer_distribution = distribute_answers_evenly_no_consecutive()
    
    # Xáo trộn thứ tự câu hỏi (nhưng vẫn đảm bảo không có 2 câu liên tiếp cùng đáp án)
    # Tạo list (question, target_answer) pairs
    question_answer_pairs = list(zip(questions, answer_distribution))
    
    # Shuffle với constraint: không có 2 câu liên tiếp cùng đáp án
    # Thử nhiều lần để đảm bảo không có 2 câu liên tiếp
    max_shuffle_attempts = 100
    best_shuffled_pairs = None
    best_consecutive_count = float('inf')
    
    for shuffle_attempt in range(max_shuffle_attempts):
        shuffled_pairs = []
        remaining_pairs = question_answer_pairs.copy()
        random.shuffle(remaining_pairs)  # Xáo trộn ban đầu
        
        while remaining_pairs:
            if not shuffled_pairs:
                # Câu đầu tiên: chọn ngẫu nhiên
                chosen = random.choice(remaining_pairs)
            else:
                # Câu tiếp theo: chọn ngẫu nhiên nhưng khác đáp án câu trước
                last_answer = shuffled_pairs[-1][1]
                available = [p for p in remaining_pairs if p[1] != last_answer]
                
                if not available:
                    # Nếu không có đáp án nào khác, thử lại từ đầu
                    break
                
                chosen = random.choice(available)
            
            shuffled_pairs.append(chosen)
            remaining_pairs.remove(chosen)
        
        # Kiểm tra số lượng cặp liên tiếp
        if len(shuffled_pairs) == 20:
            final_answers_temp = [p[1] for p in shuffled_pairs]
            consecutive_count = sum(1 for i in range(len(final_answers_temp) - 1) 
                                  if final_answers_temp[i] == final_answers_temp[i + 1])
            
            if consecutive_count == 0:
                # Tìm thấy sequence hoàn hảo
                best_shuffled_pairs = shuffled_pairs
                break
            elif consecutive_count < best_consecutive_count:
                # Lưu sequence tốt nhất
                best_shuffled_pairs = shuffled_pairs
                best_consecutive_count = consecutive_count
    
    # Sử dụng sequence tốt nhất
    if best_shuffled_pairs is None:
        # Fallback: sử dụng sequence gốc
        best_shuffled_pairs = question_answer_pairs
    
    # Extract questions và target answers
    shuffled_questions = [p[0] for p in best_shuffled_pairs]
    final_answer_distribution = [p[1] for p in best_shuffled_pairs]
    
    # Gán đáp án cho các câu hỏi (xáo trộn options và đặt đáp án đúng vào vị trí target)
    final_questions = assign_answers_to_questions(shuffled_questions, final_answer_distribution)
    
    # Verify lại phân bổ đáp án cuối cùng
    final_answers = [q["correct"] for q in final_questions]
    is_valid, error_index = verify_no_consecutive_duplicates(final_answers)
    if not is_valid:
        print(f"⚠️ Week {week_num}: Vẫn có 2 câu liên tiếp cùng đáp án tại vị trí {error_index}")
    
    # Tạo cấu trúc JSON
    json_data = {
        "week": week_num,
        "subject": "math",
        "grade": 1,
        "bookSeries": "ket-noi-tri-thuc",
        "lessons": [
            {
                "id": "lesson-1",
                "title": week_data["title"].replace("TUẦN ", ""),
                "duration": week_data["duration"],
                "questions": []
            }
        ]
    }
    
    # Thêm câu hỏi
    for i, q_data in enumerate(final_questions, 1):
        question = {
            "id": f"q{i}",
            "type": "multiple-choice",
            "question": q_data["q"],
            "options": q_data["options"],
            "correctAnswer": q_data["correct"],
            "explanation": q_data["exp"],
            "imageUrl": None
        }
        json_data["lessons"][0]["questions"].append(question)
    
    # Ghi file
    output_path = output_dir / f"week-{week_num}.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    
    # Kiểm tra phân bổ đáp án
    answer_counts = Counter(final_answers)
    print(f"Week {week_num}: Phân bổ đáp án: {dict(answer_counts)} (A={answer_counts[0]}, B={answer_counts[1]}, C={answer_counts[2]}, D={answer_counts[3]})")
    
    # Kiểm tra không có 2 câu liên tiếp
    consecutive_errors = []
    for i in range(len(final_answers) - 1):
        if final_answers[i] == final_answers[i + 1]:
            consecutive_errors.append((i + 1, i + 2))
    
    if consecutive_errors:
        print(f"  ⚠️ Có {len(consecutive_errors)} cặp câu liên tiếp cùng đáp án: {consecutive_errors}")
    else:
        print(f"  ✅ Không có 2 câu liên tiếp cùng đáp án")
    
    # Verify số lượng câu hỏi
    if len(final_questions) != 20:
        print(f"  ⚠️ Số lượng câu hỏi: {len(final_questions)} (mong đợi: 20)")
    
    return output_path

def main():
    """Main function"""
    # Set seed để có thể reproduce
    random.seed(42)
    
    output_dir = Path("public/data/questions/ket-noi-tri-thuc/grade-1/math")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Load dữ liệu từ file JSON
    print("Đang load dữ liệu từ toan1-ky1.json...")
    weeks_data = load_week_data_from_json()
    
    if not weeks_data:
        print("❌ Không có dữ liệu để tạo!")
        return
    
    print(f"✅ Đã load {len(weeks_data)} tuần: {sorted(weeks_data.keys())}")
    print("=" * 70)
    print("Tạo các file toán lớp 1 với 20 câu hỏi mỗi tuần...")
    print("Yêu cầu: 20 câu hỏi, 5 câu A/B/C/D, không có 2 câu liên tiếp cùng đáp án")
    print("=" * 70)
    
    for week_num in sorted(weeks_data.keys()):
        print(f"\n📝 Đang xử lý Week {week_num}...")
        try:
            create_week_file_with_20_questions(week_num, weeks_data[week_num], output_dir)
            print(f"✅ Đã tạo week-{week_num}.json")
        except Exception as e:
            print(f"❌ Lỗi khi tạo week-{week_num}.json: {e}")
    
    print("\n" + "=" * 70)
    print("✅ Hoàn thành!")

if __name__ == "__main__":
    main()

