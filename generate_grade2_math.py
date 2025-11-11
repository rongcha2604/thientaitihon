#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để tạo bộ đề toán lớp 2 - 35 tuần, mỗi tuần 12 câu hỏi
Đảm bảo phân bổ đều đáp án đúng: 3 câu A, 3 câu B, 3 câu C, 3 câu D
"""

import json
import os
from typing import List, Dict, Any

# Định nghĩa nội dung cho từng tuần dựa trên phân phối chương trình
WEEK_CONTENT = {
    1: {
        "title": "Ôn tập các số đến 100",
        "topics": ["Ôn tập các số đến 100", "Tia số", "Số liền trước, số liền sau", "Các thành phần của phép cộng, phép trừ"]
    },
    2: {
        "title": "Hơn kém nhau bao nhiêu - Ôn tập phép cộng trừ",
        "topics": ["Hơn kém nhau bao nhiêu", "Ôn tập phép cộng, phép trừ (không nhớ) trong phạm vi 100"]
    },
    3: {
        "title": "Ôn tập phép cộng trừ (không nhớ)",
        "topics": ["Ôn tập phép cộng, phép trừ (không nhớ) trong phạm vi 100"]
    },
    4: {
        "title": "Phép cộng (qua 10) trong phạm vi 20",
        "topics": ["Phép cộng (qua 10) trong phạm vi 20", "Bảng cộng (qua 10)"]
    },
    5: {
        "title": "Bài toán về thêm, bớt một số đơn vị",
        "topics": ["Bài toán về thêm, bớt một số đơn vị"]
    },
    6: {
        "title": "Phép trừ (qua 10) trong phạm vi 20",
        "topics": ["Phép trừ (qua 10) trong phạm vi 20", "Bảng trừ (qua 10)"]
    },
    7: {
        "title": "Bài toán về nhiều hơn, ít hơn",
        "topics": ["Bài toán về nhiều hơn, ít hơn một số đơn vị"]
    },
    8: {
        "title": "Làm quen với khối lượng, dung tích",
        "topics": ["Ki-lô-gam", "Lít"]
    },
    9: {
        "title": "Thực hành với Ki-lô-gam và Lít",
        "topics": ["Thực hành và trải nghiệm với các đơn vị Ki-lô-gam, Lít"]
    },
    10: {
        "title": "Phép cộng (có nhớ) số có hai chữ số",
        "topics": ["Phép cộng (có nhớ) số có hai chữ số với số có một chữ số", "Phép cộng (có nhớ) số có hai chữ số với số có hai chữ số"]
    },
    11: {
        "title": "Phép trừ (có nhớ) số có hai chữ số",
        "topics": ["Phép trừ (có nhớ) số có hai chữ số với số có một chữ số", "Phép trừ (có nhớ) số có hai chữ số với số có hai chữ số"]
    },
    12: {
        "title": "Luyện tập chung phép cộng trừ có nhớ",
        "topics": ["Luyện tập chung phép cộng, phép trừ có nhớ"]
    },
    13: {
        "title": "Làm quen với hình phẳng",
        "topics": ["Điểm, đoạn thẳng, đường thẳng, đường cong", "Đường gấp khúc, hình tứ giác"]
    },
    14: {
        "title": "Hình phẳng - Thực hành",
        "topics": ["Thực hành gấp, cắt, ghép, xếp hình", "Vẽ đoạn thẳng"]
    },
    15: {
        "title": "Ngày - giờ, giờ - phút, ngày - tháng",
        "topics": ["Ngày - giờ, giờ - phút", "Ngày - tháng", "Xem đồng hồ"]
    },
    16: {
        "title": "Thực hành xem đồng hồ, xem lịch",
        "topics": ["Thực hành và trải nghiệm xem đồng hồ, xem lịch"]
    },
    17: {
        "title": "Ôn tập học kì I",
        "topics": ["Ôn tập phép cộng, phép trừ trong phạm vi 20, 100"]
    },
    18: {
        "title": "Ôn tập học kì I (tiếp)",
        "topics": ["Ôn tập hình phẳng", "Ôn tập đo lường"]
    },
    19: {
        "title": "Phép nhân",
        "topics": ["Phép nhân", "Thừa số, tích"]
    },
    20: {
        "title": "Bảng nhân 2, bảng nhân 5",
        "topics": ["Bảng nhân 2", "Bảng nhân 5", "Phép chia"]
    },
    21: {
        "title": "Phép chia - Bảng chia 2, bảng chia 5",
        "topics": ["Số bị chia, số chia, thương", "Bảng chia 2", "Bảng chia 5"]
    },
    22: {
        "title": "Luyện tập chung phép nhân, phép chia",
        "topics": ["Luyện tập chung phép nhân, phép chia"]
    },
    23: {
        "title": "Làm quen với hình khối",
        "topics": ["Khối trụ, khối cầu"]
    },
    24: {
        "title": "Các số trong phạm vi 1000",
        "topics": ["Đơn vị, chục, trăm, nghìn", "Các số tròn trăm, tròn chục"]
    },
    25: {
        "title": "Số có ba chữ số",
        "topics": ["Số có ba chữ số", "Viết số thành tổng các trăm, chục, đơn vị", "So sánh các số có ba chữ số"]
    },
    26: {
        "title": "So sánh các số có ba chữ số",
        "topics": ["So sánh các số có ba chữ số", "Luyện tập chung"]
    },
    27: {
        "title": "Độ dài và đơn vị đo độ dài",
        "topics": ["Đề-xi-mét, Mét, Ki-lô-mét", "Giới thiệu Tiền Việt Nam"]
    },
    28: {
        "title": "Thực hành đo độ dài",
        "topics": ["Thực hành và trải nghiệm đo độ dài"]
    },
    29: {
        "title": "Phép cộng trong phạm vi 1000",
        "topics": ["Phép cộng (không nhớ) trong phạm vi 1000", "Phép cộng (có nhớ) trong phạm vi 1000"]
    },
    30: {
        "title": "Phép trừ trong phạm vi 1000",
        "topics": ["Phép trừ (không nhớ) trong phạm vi 1000", "Phép trừ (có nhớ) trong phạm vi 1000"]
    },
    31: {
        "title": "Làm quen với yếu tố thống kê, xác suất",
        "topics": ["Thu thập, phân loại, kiểm đếm số liệu", "Biểu đồ tranh", "Chắc chắn, có thể, không thể"]
    },
    32: {
        "title": "Ôn tập cuối năm",
        "topics": ["Ôn tập các số trong phạm vi 1000", "Ôn tập phép cộng, phép trừ trong phạm vi 100"]
    },
    33: {
        "title": "Ôn tập cuối năm (tiếp)",
        "topics": ["Ôn tập phép cộng, phép trừ trong phạm vi 1000", "Ôn tập phép nhân, phép chia"]
    },
    34: {
        "title": "Ôn tập cuối năm (tiếp)",
        "topics": ["Ôn tập hình học", "Ôn tập đo lường"]
    },
    35: {
        "title": "Ôn tập cuối năm (tiếp)",
        "topics": ["Ôn tập kiểm đếm số liệu và lựa chọn khả năng", "Ôn tập chung"]
    }
}

def generate_questions_for_week(week: int) -> List[Dict[str, Any]]:
    """Tạo 12 câu hỏi cho một tuần, đảm bảo phân bổ đều đáp án đúng: 3A, 3B, 3C, 3D"""
    content = WEEK_CONTENT[week]
    questions = []
    
    # Định nghĩa câu hỏi mẫu cho từng tuần (sẽ được mở rộng)
    # Tạm thời tạo câu hỏi cơ bản, sau đó sẽ điều chỉnh
    
    # Phân bổ đáp án đúng: [0,0,0,1,1,1,2,2,2,3,3,3]
    correct_answers = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3]
    
    # Tạo 12 câu hỏi dựa trên nội dung tuần
    for i in range(12):
        q_id = f"q{i+1}"
        correct_answer = correct_answers[i]
        
        # Tạo câu hỏi dựa trên tuần và chủ đề
        question_data = create_question_for_week(week, i+1, correct_answer, content)
        questions.append(question_data)
    
    return questions

def create_question_for_week(week: int, q_num: int, correct_answer: int, content: Dict) -> Dict[str, Any]:
    """Tạo một câu hỏi cụ thể cho tuần"""
    # Đây là hàm placeholder, sẽ được implement chi tiết
    # Tạm thời trả về câu hỏi mẫu
    return {
        "id": f"q{q_num}",
        "type": "multiple-choice",
        "question": f"Câu hỏi tuần {week}, câu {q_num}",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": correct_answer,
        "explanation": "Giải thích",
        "imageUrl": null
    }

# Script này sẽ được mở rộng để tạo đầy đủ 35 tuần
# Tạm thời, tôi sẽ tạo thủ công từng tuần để đảm bảo chất lượng

if __name__ == "__main__":
    print("Script để generate questions - sẽ được implement chi tiết")

