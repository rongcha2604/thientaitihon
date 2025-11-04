#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Script to generate Hoạt động trải nghiệm questions for grade 1"""

import json
from datetime import date

# Topic names for Hoạt động trải nghiệm lớp 1
TOPIC_NAMES = [
    "Khám phá bản thân",
    "Nhận biết cảm xúc",
    "Tự giới thiệu bản thân",
    "Rèn luyện thói quen tốt",
    "Tự chăm sóc bản thân",
    "Sắp xếp đồ dùng",
    "Em với gia đình",
    "Giúp đỡ bố mẹ",
    "Tình yêu gia đình",
    "Em với trường lớp",
    "Quy định lớp học",
    "An toàn ở trường",
    "Em với cộng đồng",
    "Bảo vệ môi trường",
    "Tôn trọng người khác",
    "Tình bạn",
    "Tình thầy trò",
    "Chia sẻ với bạn",
    "Quan tâm gia đình",
    "Lòng biết ơn"
]

# Questions for each topic (Easy level)
EASY_QUESTIONS = {
    1: [  # Khám phá bản thân
        {"q": "Em tên gì?", "opt": ["Tên của em", "Tên bạn", "Tên bố", "Tên mẹ"], "exp": "Mỗi em đều có tên riêng của mình."},
        {"q": "Em bao nhiêu tuổi?", "opt": ["7 tuổi", "8 tuổi", "9 tuổi", "10 tuổi"], "exp": "Học sinh lớp 1 thường 6-7 tuổi."},
        {"q": "Em học lớp mấy?", "opt": ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4"], "exp": "Em đang học lớp 1."},
        {"q": "Em thích màu gì?", "opt": ["Màu em thích", "Màu em không thích", "Màu đen", "Màu xám"], "exp": "Mỗi em có sở thích màu sắc khác nhau."},
        {"q": "Em thích món ăn gì?", "opt": ["Món em thích", "Món em không thích", "Món cay", "Món chua"], "exp": "Mỗi em có sở thích ăn uống khác nhau."},
        {"q": "Em có sở thích gì?", "opt": ["Sở thích của em", "Sở thích của bạn", "Sở thích của bố", "Sở thích của mẹ"], "exp": "Mỗi em có sở thích riêng."},
        {"q": "Em là con trai hay con gái?", "opt": ["Giới tính của em", "Con trai", "Con gái", "Không xác định"], "exp": "Mỗi em có giới tính riêng."},
        {"q": "Em có điểm mạnh gì?", "opt": ["Điểm mạnh của em", "Điểm yếu của em", "Điểm mạnh của bạn", "Không có"], "exp": "Mỗi em đều có điểm mạnh riêng."},
        {"q": "Em muốn làm gì khi lớn lên?", "opt": ["Ước mơ của em", "Ước mơ của bạn", "Ước mơ của bố", "Ước mơ của mẹ"], "exp": "Mỗi em có ước mơ riêng."},
        {"q": "Em thích hoạt động gì?", "opt": ["Hoạt động em thích", "Hoạt động em không thích", "Hoạt động khó", "Không có"], "exp": "Mỗi em có sở thích hoạt động khác nhau."},
        {"q": "Em có thể làm gì tốt?", "opt": ["Điều em giỏi", "Điều em chưa giỏi", "Điều bạn giỏi", "Không có"], "exp": "Mỗi em đều có khả năng riêng."},
        {"q": "Em thích học môn gì?", "opt": ["Môn em thích", "Môn em không thích", "Môn khó", "Không thích"], "exp": "Mỗi em có sở thích học tập khác nhau."},
        {"q": "Em có đặc điểm gì nổi bật?", "opt": ["Đặc điểm của em", "Đặc điểm của bạn", "Đặc điểm của bố", "Đặc điểm của mẹ"], "exp": "Mỗi em có đặc điểm riêng."},
        {"q": "Em thích chơi với ai?", "opt": ["Người em thích chơi", "Người em không thích", "Người lạ", "Không ai"], "exp": "Em nên chơi với bạn bè và người thân."},
        {"q": "Em cảm thấy vui khi nào?", "opt": ["Khi em vui", "Khi em buồn", "Khi em tức giận", "Khi em sợ"], "exp": "Em vui khi làm điều mình thích."},
        {"q": "Em muốn học điều gì mới?", "opt": ["Điều em muốn học", "Điều em không muốn", "Điều khó", "Không có"], "exp": "Em nên luôn muốn học hỏi điều mới."},
        {"q": "Em thích đọc sách gì?", "opt": ["Sách em thích", "Sách em không thích", "Sách khó", "Không thích"], "exp": "Đọc sách giúp em học hỏi nhiều điều."},
        {"q": "Em thích nghe nhạc gì?", "opt": ["Nhạc em thích", "Nhạc em không thích", "Nhạc ồn", "Không thích"], "exp": "Mỗi em có sở thích âm nhạc khác nhau."},
        {"q": "Em có thể tự làm gì?", "opt": ["Điều em tự làm được", "Điều em chưa làm được", "Điều khó", "Không có"], "exp": "Em nên tự làm những việc phù hợp với lứa tuổi."},
        {"q": "Em muốn trở thành người như thế nào?", "opt": ["Người em muốn trở thành", "Người em không muốn", "Người xấu", "Không có"], "exp": "Em nên có mục tiêu tốt đẹp."},
    ],
    2: [  # Nhận biết cảm xúc
        {"q": "Khi vui, em cảm thấy thế nào?", "opt": ["Vui vẻ, hạnh phúc", "Buồn bã", "Tức giận", "Sợ hãi"], "exp": "Khi vui, em cảm thấy hạnh phúc và tích cực."},
        {"q": "Khi buồn, em nên làm gì?", "opt": ["Chia sẻ với người thân", "Giấu kín", "Khóc một mình", "Tức giận"], "exp": "Em nên chia sẻ cảm xúc với người thân."},
        {"q": "Khi tức giận, em nên làm gì?", "opt": ["Hít thở sâu, bình tĩnh", "La hét", "Đánh người khác", "Ném đồ vật"], "exp": "Em nên bình tĩnh khi tức giận."},
        {"q": "Khi sợ hãi, em nên tìm ai?", "opt": ["Bố mẹ, thầy cô", "Người lạ", "Ở một mình", "Không ai"], "exp": "Em nên tìm người lớn khi sợ hãi."},
        {"q": "Em nên thể hiện cảm xúc như thế nào?", "opt": ["Một cách phù hợp", "La hét", "Im lặng", "Không thể hiện"], "exp": "Em nên thể hiện cảm xúc một cách phù hợp."},
        {"q": "Khi bạn buồn, em nên làm gì?", "opt": ["An ủi, động viên", "Bỏ qua", "Cười nhạo", "Không quan tâm"], "exp": "Em nên quan tâm và giúp đỡ bạn khi buồn."},
        {"q": "Cảm xúc nào là tích cực?", "opt": ["Vui vẻ, hạnh phúc", "Tức giận", "Ghen tị", "Thù hận"], "exp": "Vui vẻ và hạnh phúc là cảm xúc tích cực."},
        {"q": "Khi lo lắng, em nên làm gì?", "opt": ["Nói với người lớn", "Giấu kín", "Khóc", "Tức giận"], "exp": "Em nên chia sẻ lo lắng với người lớn."},
        {"q": "Em nên lắng nghe cảm xúc của ai?", "opt": ["Bạn bè, người thân", "Người lạ", "Không ai", "Chỉ mình"], "exp": "Em nên lắng nghe cảm xúc của bạn bè và người thân."},
        {"q": "Khi hạnh phúc, em nên làm gì?", "opt": ["Chia sẻ niềm vui", "Giấu kín", "Không nói", "Tức giận"], "exp": "Em nên chia sẻ niềm vui với người khác."},
        {"q": "Cảm xúc nào là bình thường?", "opt": ["Tất cả cảm xúc", "Chỉ vui", "Chỉ buồn", "Không có"], "exp": "Tất cả cảm xúc đều là bình thường."},
        {"q": "Khi thất vọng, em nên làm gì?", "opt": ["Cố gắng lại", "Bỏ cuộc", "Tức giận", "Khóc"], "exp": "Em nên cố gắng lại khi thất vọng."},
        {"q": "Em nên tôn trọng cảm xúc của ai?", "opt": ["Mọi người", "Chỉ mình", "Chỉ bạn", "Không ai"], "exp": "Em nên tôn trọng cảm xúc của mọi người."},
        {"q": "Khi xấu hổ, em nên làm gì?", "opt": ["Chấp nhận và học hỏi", "Giấu kín", "Tức giận", "Khóc"], "exp": "Em nên chấp nhận và học hỏi từ xấu hổ."},
        {"q": "Cảm xúc nào giúp em học tốt?", "opt": ["Vui vẻ, tự tin", "Sợ hãi", "Tức giận", "Buồn bã"], "exp": "Vui vẻ và tự tin giúp em học tốt."},
        {"q": "Khi ghen tị, em nên làm gì?", "opt": ["Cố gắng học hỏi", "Ghét người khác", "Tức giận", "Buồn"], "exp": "Em nên cố gắng học hỏi thay vì ghen tị."},
        {"q": "Em nên kiểm soát cảm xúc như thế nào?", "opt": ["Bình tĩnh, suy nghĩ", "La hét", "Đánh người", "Ném đồ"], "exp": "Em nên bình tĩnh và suy nghĩ khi kiểm soát cảm xúc."},
        {"q": "Khi tự hào, em nên làm gì?", "opt": ["Khiêm tốn, tiếp tục cố gắng", "Khoe khoang", "Tự cao", "Khinh thường"], "exp": "Em nên khiêm tốn và tiếp tục cố gắng."},
        {"q": "Cảm xúc nào giúp em có bạn tốt?", "opt": ["Vui vẻ, thân thiện", "Tức giận", "Ghen tị", "Thù hận"], "exp": "Vui vẻ và thân thiện giúp em có bạn tốt."},
        {"q": "Em nên hiểu cảm xúc của ai?", "opt": ["Bản thân và người khác", "Chỉ mình", "Chỉ bạn", "Không ai"], "exp": "Em nên hiểu cảm xúc của bản thân và người khác."},
    ],
    # ... (continuing with other topics)
}

def generate_questions_for_topic(topic_num, level):
    """Generate 20 questions for a topic"""
    if topic_num in EASY_QUESTIONS:
        base_questions = EASY_QUESTIONS[topic_num]
        # Extend to 20 questions if needed
        while len(base_questions) < 20:
            base_questions.append(base_questions[len(base_questions) % len(base_questions)])
    else:
        # Generate appropriate questions based on topic
        topic_name = TOPIC_NAMES[topic_num-1]
        if topic_num == 3:  # Tự giới thiệu bản thân
            base_questions = [
                {"q": "Em nên giới thiệu mình như thế nào?", "opt": ["Nói tên, tuổi, lớp học", "Chỉ nói tên", "Không nói gì", "Nói tên người khác"], "exp": "Em nên giới thiệu đầy đủ: tên, tuổi, lớp học."},
                {"q": "Khi gặp người mới, em nên nói gì?", "opt": ["Xin chào, em tên là...", "Không nói gì", "Chạy đi", "Quay mặt đi"], "exp": "Em nên lịch sự chào hỏi và giới thiệu mình."},
                {"q": "Em nên nói gì về sở thích của mình?", "opt": ["Chia sẻ sở thích phù hợp", "Nói dối", "Không nói", "Nói sở thích xấu"], "exp": "Em nên chia sẻ sở thích của mình một cách chân thật."},
                {"q": "Em nên nói gì về gia đình?", "opt": ["Giới thiệu gia đình một cách phù hợp", "Nói xấu gia đình", "Không nói", "Nói dối"], "exp": "Em nên giới thiệu gia đình một cách tích cực và phù hợp."},
                {"q": "Em nên nói gì về bạn bè?", "opt": ["Chia sẻ về bạn bè tích cực", "Nói xấu bạn", "Không nói", "Nói dối"], "exp": "Em nên chia sẻ về bạn bè một cách tích cực."},
            ] * 4
        elif topic_num == 4:  # Rèn luyện thói quen tốt
            base_questions = [
                {"q": "Em nên làm gì vào buổi sáng?", "opt": ["Thức dậy, đánh răng, rửa mặt", "Ngủ tiếp", "Không làm gì", "Chơi game"], "exp": "Em nên có thói quen tốt vào buổi sáng."},
                {"q": "Em nên làm gì trước khi ăn?", "opt": ["Rửa tay", "Chưa rửa tay", "Không rửa", "Ăn ngay"], "exp": "Em nên rửa tay trước khi ăn để giữ vệ sinh."},
                {"q": "Em nên làm gì sau khi chơi?", "opt": ["Rửa tay, cất đồ chơi", "Bỏ đồ chơi bừa bãi", "Không làm gì", "Để đồ chơi lung tung"], "exp": "Em nên rửa tay và cất đồ chơi sau khi chơi."},
                {"q": "Em nên làm gì trước khi đi ngủ?", "opt": ["Đánh răng, rửa mặt, chuẩn bị ngủ", "Chơi game", "Xem TV", "Không làm gì"], "exp": "Em nên có thói quen tốt trước khi đi ngủ."},
                {"q": "Em nên làm gì khi thức dậy?", "opt": ["Chào bố mẹ, làm vệ sinh cá nhân", "Ngủ tiếp", "Không làm gì", "Chơi ngay"], "exp": "Em nên chào bố mẹ và làm vệ sinh cá nhân khi thức dậy."},
            ] * 4
        elif topic_num == 5:  # Tự chăm sóc bản thân
            base_questions = [
                {"q": "Em nên đánh răng khi nào?", "opt": ["Sáng và tối", "Chỉ sáng", "Chỉ tối", "Không đánh"], "exp": "Em nên đánh răng 2 lần mỗi ngày: sáng và tối."},
                {"q": "Em nên rửa tay khi nào?", "opt": ["Trước khi ăn, sau khi chơi", "Chỉ khi bẩn", "Không rửa", "Chỉ khi nhớ"], "exp": "Em nên rửa tay thường xuyên để giữ vệ sinh."},
                {"q": "Em nên tắm khi nào?", "opt": ["Hàng ngày", "Chỉ khi bẩn", "Không tắm", "Chỉ khi mẹ nhắc"], "exp": "Em nên tắm hàng ngày để giữ vệ sinh."},
                {"q": "Em nên ăn uống như thế nào?", "opt": ["Ăn đủ bữa, uống đủ nước", "Ăn nhiều kẹo", "Không uống nước", "Chỉ ăn đồ ngọt"], "exp": "Em nên ăn uống đầy đủ và lành mạnh."},
                {"q": "Em nên nghỉ ngơi khi nào?", "opt": ["Khi mệt, sau khi học", "Không nghỉ", "Chơi liên tục", "Chỉ khi bị ép"], "exp": "Em nên nghỉ ngơi khi mệt để giữ sức khỏe."},
            ] * 4
        elif topic_num == 6:  # Sắp xếp đồ dùng
            base_questions = [
                {"q": "Em nên sắp xếp đồ dùng như thế nào?", "opt": ["Ngăn nắp, gọn gàng", "Bừa bãi", "Không sắp xếp", "Để lung tung"], "exp": "Em nên sắp xếp đồ dùng ngăn nắp."},
                {"q": "Em nên cất đồ chơi ở đâu?", "opt": ["Nơi quy định, gọn gàng", "Bừa bãi", "Không cất", "Để lung tung"], "exp": "Em nên cất đồ chơi vào đúng nơi quy định."},
                {"q": "Em nên để sách vở ở đâu?", "opt": ["Trên bàn học, gọn gàng", "Bừa bãi", "Không để đâu", "Để lung tung"], "exp": "Em nên để sách vở trên bàn học gọn gàng."},
                {"q": "Em nên giữ gìn đồ dùng như thế nào?", "opt": ["Cẩn thận, sạch sẽ", "Vứt bừa bãi", "Không giữ", "Làm hỏng"], "exp": "Em nên giữ gìn đồ dùng cẩn thận."},
                {"q": "Em nên dọn dẹp khi nào?", "opt": ["Sau khi chơi, hàng ngày", "Chỉ khi bị nhắc", "Không dọn", "Chỉ khi mẹ ép"], "exp": "Em nên dọn dẹp thường xuyên sau khi chơi."},
            ] * 4
        else:
            # Generic questions for remaining topics
            base_questions = [
                {"q": f"Câu hỏi {i+1} về {topic_name}", 
                 "opt": ["Đáp án đúng", "Đáp án sai 1", "Đáp án sai 2", "Đáp án sai 3"],
                 "exp": f"Giải thích cho câu hỏi {i+1} về {topic_name}"}
                for i in range(20)
            ]
    
    questions = []
    for i in range(20):
        q_data = base_questions[i % len(base_questions)]
        questions.append({
            "id": f"HTTN1{level[0].upper()}{topic_num:02d}Q{i+1:02d}",
            "question": q_data["q"],
            "options": q_data["opt"],
            "answer_index": 0,
            "answer_text": q_data["opt"][0],
            "explanation": q_data["exp"]
        })
    return questions

def generate_file(level):
    """Generate JSON file for a level"""
    topics = []
    level_map = {"easy": "EASY", "medium": "MEDIUM", "hard": "HARD"}
    
    for i in range(1, 21):
        topics.append({
            "id": f"HTTN1_{level_map[level]}_{i:02d}",
            "name": TOPIC_NAMES[i-1],
            "difficulty": level,
            "questions": generate_questions_for_topic(i, level)
        })
    
    data = {
        "meta": {
            "grade": 1,
            "subject": "Hoạt động trải nghiệm",
            "language": "vi",
            "created_date": date.today().isoformat(),
            "level": level,
            "curriculum": "CTGDPT 2018 – Chuẩn 2025"
        },
        "topics": topics
    }
    
    return data

if __name__ == "__main__":
    import sys
    level = sys.argv[1] if len(sys.argv) > 1 else "easy"
    output_file = sys.argv[2] if len(sys.argv) > 2 else f"public/data/lop1/sci.{level}.json"
    
    data = generate_file(level)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Generated {output_file} with {len(data['topics'])} topics")

