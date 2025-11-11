#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để tạo bộ đề Tiếng Việt lớp 2 - 35 tuần, mỗi tuần 12 câu hỏi
Bộ sách: Kết nối tri thức với cuộc sống
Đảm bảo phân bổ đều đáp án đúng: 3 câu A, 3 câu B, 3 câu C, 3 câu D
"""

import json
import os
from typing import List, Dict, Any, Tuple

# Định nghĩa câu hỏi cho từng tuần
# Format: (question, [option1, option2, option3, option4], correct_index, explanation)
WEEK_QUESTIONS_DATA = {
    1: [
        ("Trong bài 'Tôi là học sinh lớp 2', nhân vật chính là ai?", ["Học sinh lớp 1", "Học sinh lớp 2", "Học sinh lớp 3", "Học sinh lớp 4"], 1, "Bài đọc nói về học sinh lớp 2, nên nhân vật chính là học sinh lớp 2."),
        ("Từ nào viết đúng chính tả?", ["học sinh", "học sin", "học xinh", "học xinh"], 0, "Từ đúng là 'học sinh' (sinh với chữ s)."),
        ("Từ 'học sinh' thuộc loại từ gì?", ["Động từ", "Danh từ", "Tính từ", "Đại từ"], 1, "'Học sinh' là danh từ chỉ người, chỉ người đi học."),
        ("Chữ hoa A được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa A viết với nét thẳng và nét cong."),
        ("Khi giới thiệu bản thân, em nên nói như thế nào?", ["Xin chào, tôi là...", "Chào bạn, mình là...", "Xin chào, em là...", "Cả A, B, C đều đúng"], 3, "Có nhiều cách giới thiệu bản thân, tùy vào hoàn cảnh và đối tượng."),
        ("Trong câu 'Tôi là học sinh lớp 2', từ nào là động từ?", ["Tôi", "là", "học sinh", "lớp 2"], 1, "Từ 'là' là động từ nối, dùng để giới thiệu, định nghĩa."),
        ("Từ nào sau đây viết sai chính tả?", ["ngày hôm qua", "ngày hôm quá", "ngày hôm quà", "ngày hôm quả"], 1, "Từ đúng là 'ngày hôm qua' (qua với chữ q), không phải 'quá'."),
        ("Trong bài 'Ngày hôm qua đâu rồi?', tác giả muốn nói về điều gì?", ["Thời gian trôi qua", "Ngày hôm qua bị mất", "Tìm ngày hôm qua", "Ngày hôm qua quay lại"], 0, "Bài thơ nói về thời gian trôi qua, ngày hôm qua đã qua đi không thể quay lại."),
        ("Chữ hoa B được viết như thế nào?", ["Nét thẳng và hai nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa B viết với nét thẳng và hai nét cong."),
        ("Câu nào sau đây có dấu chấm hỏi đúng?", ["Bạn tên là gì?", "Bạn tên là gì.", "Bạn tên là gì!", "Bạn tên là gì,"], 0, "Câu hỏi phải kết thúc bằng dấu chấm hỏi (?)."),
        ("Từ nào sau đây viết đúng chính tả?", ["lớp học", "lớp họ", "lớp hộc", "lớp hộc"], 0, "Từ đúng là 'lớp học' (học với chữ h và c)."),
        ("Khi kể về bản thân, em nên kể những gì?", ["Tên, tuổi, lớp", "Sở thích, gia đình", "Cả A và B", "Không kể gì"], 2, "Khi kể về bản thân, em có thể kể tên, tuổi, lớp, sở thích, gia đình...")
    ],
    2: [
        ("Trong bài 'Niềm vui của Bi và Bống', Bi và Bống là ai?", ["Hai bạn học sinh", "Hai anh em", "Hai người bạn", "Cả A, B, C đều có thể"], 3, "Bi và Bống có thể là bạn học, anh em, hoặc bạn bè, tùy vào cách hiểu của người đọc."),
        ("Từ nào viết đúng chính tả?", ["niềm vui", "niềm vùi", "niềm vui", "niềm vùi"], 0, "Từ đúng là 'niềm vui' (vui với chữ v và u)."),
        ("Từ 'niềm vui' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Niềm vui' là danh từ chỉ cảm xúc, tình cảm."),
        ("Chữ hoa C được viết như thế nào?", ["Nét cong", "Nét thẳng", "Nét ngang", "Nét thẳng và nét cong"], 0, "Chữ hoa C viết với nét cong."),
        ("Khi kể về niềm vui, em nên kể như thế nào?", ["Kể ngắn gọn", "Kể chi tiết", "Kể có cảm xúc", "Cả A, B, C đều đúng"], 3, "Khi kể về niềm vui, em có thể kể ngắn gọn, chi tiết, và có cảm xúc."),
        ("Trong câu 'Làm việc thật là vui', từ nào là tính từ?", ["Làm", "việc", "thật", "vui"], 3, "Từ 'vui' là tính từ chỉ cảm xúc, tình cảm."),
        ("Từ nào sau đây viết đúng chính tả?", ["làm việc", "làm việc", "làm việc", "làm việc"], 0, "Từ đúng là 'làm việc' (làm với chữ l, việc với chữ v)."),
        ("Bài 'Làm việc thật là vui' muốn nói về điều gì?", ["Làm việc rất vui", "Làm việc rất mệt", "Làm việc rất khó", "Làm việc rất chán"], 0, "Bài đọc muốn nói rằng làm việc thật là vui, giúp ta cảm thấy hạnh phúc."),
        ("Chữ hoa D được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa D viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm than đúng?", ["Làm việc thật là vui!", "Làm việc thật là vui.", "Làm việc thật là vui?", "Làm việc thật là vui,"], 0, "Câu cảm thán phải kết thúc bằng dấu chấm than (!)."),
        ("Từ nào sau đây viết đúng chính tả?", ["hạnh phúc", "hạnh phúc", "hạnh phúc", "hạnh phúc"], 0, "Từ đúng là 'hạnh phúc' (hạnh với chữ h, phúc với chữ ph)."),
        ("Khi kể về công việc em thích làm, em nên kể những gì?", ["Tên công việc", "Lý do thích", "Cả A và B", "Không kể gì"], 2, "Khi kể về công việc em thích, em nên kể tên công việc và lý do thích.")
    ]
    # Các tuần còn lại sẽ được thêm vào sau
}

def create_week_json(week: int, output_dir: str):
    """Tạo file JSON cho một tuần"""
    # Phân bổ đáp án đúng: [0,0,0,1,1,1,2,2,2,3,3,3] = 3A, 3B, 3C, 3D
    correct_answers = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3]
    
    if week in WEEK_QUESTIONS_DATA:
        questions_data = WEEK_QUESTIONS_DATA[week]
    else:
        # Tạo câu hỏi mặc định nếu chưa có
        questions_data = []
        topics = ["Tập đọc", "Chính tả", "Luyện từ và câu", "Tập viết", "Nói và nghe", "Viết đoạn văn"]
        for i in range(12):
            topic = topics[i % len(topics)]
            questions_data.append((
                f"Câu hỏi {topic} - Tuần {week}, câu {i+1}",
                ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
                correct_answers[i],
                f"Giải thích cho câu hỏi {i+1} - {topic}"
            ))
    
    # Tạo questions với phân bổ đáp án đúng
    questions = []
    for i in range(12):
        q_data = questions_data[i]
        question_text, options, original_correct, explanation = q_data
        
        # Điều chỉnh để đáp án đúng ở vị trí correct_answers[i]
        if original_correct != correct_answers[i]:
            # Hoán đổi đáp án
            correct_option = options[original_correct]
            options[correct_answers[i]], options[original_correct] = options[original_correct], options[correct_answers[i]]
        
        questions.append({
            "id": f"q{i+1}",
            "type": "multiple-choice",
            "question": question_text,
            "options": options,
            "correctAnswer": correct_answers[i],
            "explanation": explanation,
            "imageUrl": None
        })
    
    # Xác định title
    titles = {
        1: "Em lớn lên từng ngày",
        2: "Em lớn lên từng ngày (tiếp)",
        3: "Mái ấm gia đình",
        4: "Mái ấm gia đình (tiếp)",
        5: "Mái ấm gia đình (tiếp)",
        6: "Mái ấm gia đình (tiếp)",
        7: "Đi học vui sao",
        8: "Đi học vui sao (tiếp)",
        9: "Ôn tập giữa học kì I",
        10: "Niềm vui tuổi thơ",
        11: "Niềm vui tuổi thơ (tiếp)",
        12: "Niềm vui tuổi thơ (tiếp)",
        13: "Niềm vui tuổi thơ (tiếp)",
        14: "Niềm vui tuổi thơ (tiếp)",
        15: "Mái ấm gia đình",
        16: "Mái ấm gia đình (tiếp)",
        17: "Mái ấm gia đình (tiếp)",
        18: "Ôn tập và đánh giá cuối học kì I",
        19: "Vẻ đẹp quanh em",
        20: "Vẻ đẹp quanh em (tiếp)",
        21: "Vẻ đẹp quanh em (tiếp)",
        22: "Vẻ đẹp quanh em (tiếp)",
        23: "Vẻ đẹp quanh em (tiếp)",
        24: "Hành trình xanh của em",
        25: "Hành trình xanh của em (tiếp)",
        26: "Hành trình xanh của em (tiếp)",
        27: "Ôn tập giữa học kì II",
        28: "Giao tiếp và kết nối",
        29: "Giao tiếp và kết nối (tiếp)",
        30: "Con người Việt Nam",
        31: "Con người Việt Nam (tiếp)",
        32: "Con người Việt Nam (tiếp)",
        33: "Việt Nam quê hương em",
        34: "Việt Nam quê hương em (tiếp)",
        35: "Ôn tập và đánh giá cuối học kì II"
    }
    
    title = titles.get(week, f"Tuần {week}")
    
    week_data = {
        "week": week,
        "subject": "vietnamese",
        "grade": 2,
        "bookSeries": "ket-noi-tri-thuc",
        "lessons": [
            {
                "id": f"lesson-{week}",
                "title": title,
                "duration": 5,
                "questions": questions
            }
        ]
    }
    
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, f"week-{week}.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(week_data, f, ensure_ascii=False, indent=2)
    
    print(f"Da tao file: {output_file}")
    return output_file

if __name__ == "__main__":
    output_dir = "public/data/questions/ket-noi-tri-thuc/grade-2/vietnamese"
    
    print("Bat dau tao bo de Tieng Viet lop 2...")
    print(f"Tong so tuan: 35 tuan")
    print(f"Moi tuan: 12 cau hoi")
    print(f"Phan bo dap an: 3A, 3B, 3C, 3D\n")
    
    for week in range(1, 36):
        create_week_json(week, output_dir)
    
    print(f"\nHoan thanh! Da tao {35} file JSON trong thu muc: {output_dir}")

