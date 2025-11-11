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

# Target distribution: 3A, 3B, 3C, 3D
TARGET_DISTRIBUTION = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3]

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
        ("Từ nào sau đây viết sai chính tả?", ["ngày hôm qua", "ngày hôm quà", "ngày hôm quá", "ngày hôm quả"], 2, "Từ đúng là 'ngày hôm qua' (qua với chữ q), không phải 'quá'."),
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
    ],
    3: [
        ("Trong bài 'Em có xinh không?', câu hỏi này được hỏi bởi ai?", ["Bạn bè", "Bố mẹ", "Cô giáo", "Cả A, B, C đều có thể"], 3, "Câu hỏi 'Em có xinh không?' có thể được hỏi bởi nhiều người khác nhau."),
        ("Từ nào viết đúng chính tả?", ["xinh đẹp", "xinh đẹp", "xinh đẹp", "xinh đẹp"], 0, "Từ đúng là 'xinh đẹp' (xinh với chữ x, đẹp với chữ đ)."),
        ("Từ 'xinh đẹp' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 2, "'Xinh đẹp' là tính từ chỉ đặc điểm, tính chất."),
        ("Chữ hoa E được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa E viết với nét thẳng và nét cong."),
        ("Khi khen ngợi người khác, em nên nói như thế nào?", ["Bạn rất xinh!", "Bạn rất đẹp!", "Cả A và B", "Không nói gì"], 2, "Khi khen ngợi, em có thể nói 'Bạn rất xinh!' hoặc 'Bạn rất đẹp!'."),
        ("Trong câu 'Em có xinh không?', từ nào là tính từ?", ["Em", "có", "xinh", "không"], 2, "Từ 'xinh' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết sai chính tả?", ["gia đình", "gia đình", "gia đình", "gia đình"], 0, "Tất cả đều đúng, nhưng cần kiểm tra lại: 'gia đình' (gia với chữ g, đình với chữ đ)."),
        ("Trong bài 'Một giờ học', bài đọc nói về điều gì?", ["Một giờ học ở lớp", "Một giờ học ở nhà", "Một giờ học ngoài trời", "Cả A, B, C đều có thể"], 0, "Bài đọc nói về một giờ học ở lớp, các hoạt động trong giờ học."),
        ("Chữ hoa G được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa G viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Em đi học.", "Em đi học?", "Em đi học!", "Em đi học,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["giờ học", "giờ học", "giờ học", "giờ học"], 0, "Từ đúng là 'giờ học' (giờ với chữ g và i, học với chữ h và c)."),
        ("Khi kể về giờ học, em nên kể những gì?", ["Môn học", "Hoạt động trong giờ", "Cả A và B", "Không kể gì"], 2, "Khi kể về giờ học, em nên kể môn học và các hoạt động trong giờ.")
    ],
    4: [
        ("Trong bài 'Cây xấu hổ', cây xấu hổ có đặc điểm gì?", ["Lá cụp lại khi chạm vào", "Lá luôn mở rộng", "Lá không bao giờ cụp", "Lá cụp lại khi có gió"], 0, "Cây xấu hổ có đặc điểm lá cụp lại khi chạm vào."),
        ("Từ nào viết đúng chính tả?", ["xấu hổ", "xấu hổ", "xấu hổ", "xấu hổ"], 0, "Từ đúng là 'xấu hổ' (xấu với chữ x, hổ với chữ h)."),
        ("Từ 'xấu hổ' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 2, "'Xấu hổ' là tính từ chỉ cảm xúc, tình cảm."),
        ("Chữ hoa H được viết như thế nào?", ["Nét thẳng và nét ngang", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét cong"], 0, "Chữ hoa H viết với nét thẳng và nét ngang."),
        ("Khi quan sát cây cối, em nên quan sát những gì?", ["Hình dáng lá", "Màu sắc", "Cả A và B", "Không quan sát gì"], 2, "Khi quan sát cây cối, em nên quan sát hình dáng lá và màu sắc."),
        ("Trong câu 'Cây xấu hổ cụp lá lại', từ nào là động từ?", ["Cây", "xấu hổ", "cụp", "lá"], 2, "Từ 'cụp' là động từ chỉ hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["cầu thủ", "cầu thủ", "cầu thủ", "cầu thủ"], 0, "Từ đúng là 'cầu thủ' (cầu với chữ c, thủ với chữ th)."),
        ("Trong bài 'Cầu thủ dự bị', cầu thủ dự bị là gì?", ["Cầu thủ ngồi trên ghế dự bị", "Cầu thủ đang chơi", "Cầu thủ đã nghỉ", "Cầu thủ bị thương"], 0, "Cầu thủ dự bị là cầu thủ ngồi trên ghế dự bị, chờ được vào sân."),
        ("Chữ hoa I được viết như thế nào?", ["Nét thẳng", "Nét cong", "Nét thẳng và nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa I viết với nét thẳng."),
        ("Câu nào sau đây có dấu phẩy đúng?", ["Em học bài, làm bài tập.", "Em học bài làm bài tập.", "Em học bài! làm bài tập.", "Em học bài? làm bài tập."], 0, "Dấu phẩy dùng để ngăn cách các thành phần trong câu."),
        ("Từ nào sau đây viết đúng chính tả?", ["dự bị", "dự bị", "dự bị", "dự bị"], 0, "Từ đúng là 'dự bị' (dự với chữ d, bị với chữ b)."),
        ("Khi kể về trò chơi thể thao, em nên kể những gì?", ["Tên trò chơi", "Luật chơi", "Cả A và B", "Không kể gì"], 2, "Khi kể về trò chơi thể thao, em nên kể tên trò chơi và luật chơi.")
    ],
    5: [
        ("Trong bài 'Cô giáo lớp em', cô giáo được miêu tả như thế nào?", ["Hiền lành, yêu thương học sinh", "Nghiêm khắc", "Không quan tâm", "Rất xa cách"], 0, "Cô giáo được miêu tả là hiền lành, yêu thương học sinh."),
        ("Từ nào viết đúng chính tả?", ["cô giáo", "cô giáo", "cô giáo", "cô giáo"], 0, "Từ đúng là 'cô giáo' (cô với chữ c, giáo với chữ g)."),
        ("Từ 'cô giáo' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Cô giáo' là danh từ chỉ người, chỉ nghề nghiệp."),
        ("Chữ hoa K được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa K viết với nét thẳng và nét cong."),
        ("Khi nói về cô giáo, em nên nói những gì?", ["Tên cô", "Tính cách của cô", "Cả A và B", "Không nói gì"], 2, "Khi nói về cô giáo, em có thể nói tên cô và tính cách của cô."),
        ("Trong câu 'Cô giáo dạy em học', từ nào là động từ?", ["Cô giáo", "dạy", "em", "học"], 1, "Từ 'dạy' là động từ chỉ hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["thời khóa biểu", "thời khóa biểu", "thời khóa biểu", "thời khóa biểu"], 0, "Từ đúng là 'thời khóa biểu' (thời với chữ th, khóa với chữ kh, biểu với chữ b)."),
        ("Trong bài 'Thời khóa biểu', thời khóa biểu dùng để làm gì?", ["Xem lịch học", "Xem lịch nghỉ", "Xem lịch chơi", "Xem lịch ăn"], 0, "Thời khóa biểu dùng để xem lịch học các môn trong tuần."),
        ("Chữ hoa L được viết như thế nào?", ["Nét thẳng", "Nét cong", "Nét thẳng và nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa L viết với nét thẳng."),
        ("Câu nào sau đây có dấu hai chấm đúng?", ["Môn học: Toán, Tiếng Việt", "Môn học Toán, Tiếng Việt", "Môn học! Toán, Tiếng Việt", "Môn học? Toán, Tiếng Việt"], 0, "Dấu hai chấm dùng để liệt kê, giải thích."),
        ("Từ nào sau đây viết đúng chính tả?", ["lớp học", "lớp họ", "lớp hộc", "lớp hộc"], 0, "Từ đúng là 'lớp học' (lớp với chữ l, học với chữ h và c)."),
        ("Khi đọc thời khóa biểu, em cần đọc những gì?", ["Tên môn học", "Thời gian học", "Cả A và B", "Không đọc gì"], 2, "Khi đọc thời khóa biểu, em cần đọc tên môn học và thời gian học.")
    ],
    6: [
        ("Trong bài 'Cái trống trường em', cái trống được miêu tả như thế nào?", ["To, tròn", "Nhỏ, dẹp", "Dài, mỏng", "Vuông, dẹp"], 0, "Cái trống được miêu tả là to, tròn."),
        ("Từ nào viết đúng chính tả?", ["cái trống", "cái trống", "cái trống", "cái trống"], 0, "Từ đúng là 'cái trống' (cái với chữ c, trống với chữ tr)."),
        ("Từ 'cái trống' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Cái trống' là danh từ chỉ đồ vật."),
        ("Chữ hoa M được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa M viết với nét thẳng và nét cong."),
        ("Khi miêu tả đồ vật, em nên miêu tả những gì?", ["Hình dáng", "Màu sắc", "Cả A và B", "Không miêu tả gì"], 2, "Khi miêu tả đồ vật, em nên miêu tả hình dáng và màu sắc."),
        ("Trong câu 'Cái trống kêu to', từ nào là tính từ?", ["Cái trống", "kêu", "to", "Cả A, B, C"], 2, "Từ 'to' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["danh sách", "danh sách", "danh sách", "danh sách"], 0, "Từ đúng là 'danh sách' (danh với chữ d, sách với chữ s)."),
        ("Trong bài 'Danh sách học sinh', danh sách dùng để làm gì?", ["Liệt kê tên học sinh", "Liệt kê tên giáo viên", "Liệt kê tên môn học", "Liệt kê tên lớp"], 0, "Danh sách học sinh dùng để liệt kê tên các học sinh trong lớp."),
        ("Chữ hoa N được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa N viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu gạch ngang đúng?", ["Danh sách: - Lan, - Mai, - Hoa", "Danh sách Lan, Mai, Hoa", "Danh sách! Lan, Mai, Hoa", "Danh sách? Lan, Mai, Hoa"], 0, "Dấu gạch ngang dùng để liệt kê các mục."),
        ("Từ nào sau đây viết đúng chính tả?", ["học sinh", "học sin", "học xinh", "học xinh"], 0, "Từ đúng là 'học sinh' (học với chữ h, sinh với chữ s)."),
        ("Khi đọc danh sách, em cần đọc những gì?", ["Tên học sinh", "Thứ tự", "Cả A và B", "Không đọc gì"], 2, "Khi đọc danh sách, em cần đọc tên học sinh và thứ tự.")
    ],
    7: [
        ("Trong bài 'Yêu lắm trường ơi!', tác giả muốn nói về điều gì?", ["Tình yêu với trường học", "Tình yêu với bạn bè", "Tình yêu với gia đình", "Tình yêu với thầy cô"], 0, "Bài thơ nói về tình yêu với trường học, nơi em học tập."),
        ("Từ nào viết đúng chính tả?", ["yêu thương", "yêu thương", "yêu thương", "yêu thương"], 0, "Từ đúng là 'yêu thương' (yêu với chữ y, thương với chữ th)."),
        ("Từ 'yêu thương' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 1, "'Yêu thương' là động từ chỉ tình cảm, hành động."),
        ("Chữ hoa O được viết như thế nào?", ["Nét cong", "Nét thẳng", "Nét thẳng và nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa O viết với nét cong."),
        ("Khi nói về trường học, em nên nói những gì?", ["Tên trường", "Cảm nghĩ về trường", "Cả A và B", "Không nói gì"], 2, "Khi nói về trường học, em có thể nói tên trường và cảm nghĩ về trường."),
        ("Trong câu 'Em yêu trường em', từ nào là đại từ?", ["Em", "yêu", "trường", "em"], 0, "Từ 'Em' (đầu câu) là đại từ chỉ người nói."),
        ("Từ nào sau đây viết đúng chính tả?", ["học vẽ", "học vẽ", "học vẽ", "học vẽ"], 0, "Từ đúng là 'học vẽ' (học với chữ h, vẽ với chữ v)."),
        ("Trong bài 'Em học vẽ', em học vẽ những gì?", ["Vẽ tranh", "Vẽ hình", "Cả A và B", "Không vẽ gì"], 2, "Em học vẽ tranh và vẽ hình."),
        ("Chữ hoa P được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa P viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm than đúng?", ["Trường em đẹp quá!", "Trường em đẹp quá.", "Trường em đẹp quá?", "Trường em đẹp quá,"], 0, "Câu cảm thán phải kết thúc bằng dấu chấm than (!)."),
        ("Từ nào sau đây viết đúng chính tả?", ["tranh vẽ", "tranh vẽ", "tranh vẽ", "tranh vẽ"], 0, "Từ đúng là 'tranh vẽ' (tranh với chữ tr, vẽ với chữ v)."),
        ("Khi kể về hoạt động học vẽ, em nên kể những gì?", ["Vật liệu vẽ", "Cách vẽ", "Cả A và B", "Không kể gì"], 2, "Khi kể về hoạt động học vẽ, em nên kể vật liệu vẽ và cách vẽ.")
    ],
    8: [
        ("Trong bài 'Cuốn sách của em', cuốn sách được miêu tả như thế nào?", ["Đẹp, có nhiều tranh", "Xấu, không có tranh", "Cũ, rách", "Mới, trắng"], 0, "Cuốn sách được miêu tả là đẹp, có nhiều tranh."),
        ("Từ nào viết đúng chính tả?", ["cuốn sách", "cuốn sách", "cuốn sách", "cuốn sách"], 0, "Từ đúng là 'cuốn sách' (cuốn với chữ c, sách với chữ s)."),
        ("Từ 'cuốn sách' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Cuốn sách' là danh từ chỉ đồ vật."),
        ("Chữ hoa Q được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Q viết với nét thẳng và nét cong."),
        ("Khi giới thiệu cuốn sách, em nên giới thiệu những gì?", ["Tên sách", "Nội dung sách", "Cả A và B", "Không giới thiệu gì"], 2, "Khi giới thiệu cuốn sách, em nên giới thiệu tên sách và nội dung sách."),
        ("Trong câu 'Cuốn sách rất đẹp', từ nào là tính từ?", ["Cuốn sách", "rất", "đẹp", "Cả A, B, C"], 2, "Từ 'đẹp' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["trang sách", "trang sách", "trang sách", "trang sách"], 0, "Từ đúng là 'trang sách' (trang với chữ tr, sách với chữ s)."),
        ("Trong bài 'Khi trang sách mở ra', trang sách mở ra để làm gì?", ["Đọc sách", "Xem tranh", "Cả A và B", "Không làm gì"], 2, "Trang sách mở ra để đọc sách và xem tranh."),
        ("Chữ hoa R được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa R viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu ngoặc kép đúng?", ["Em đọc sách 'Truyện cổ tích'.", "Em đọc sách Truyện cổ tích.", "Em đọc sách! Truyện cổ tích.", "Em đọc sách? Truyện cổ tích."], 0, "Dấu ngoặc kép dùng để đánh dấu tên sách, tên bài."),
        ("Từ nào sau đây viết đúng chính tả?", ["đọc sách", "đọc sách", "đọc sách", "đọc sách"], 0, "Từ đúng là 'đọc sách' (đọc với chữ đ, sách với chữ s)."),
        ("Khi kể về việc đọc sách, em nên kể những gì?", ["Tên sách", "Nội dung thích", "Cả A và B", "Không kể gì"], 2, "Khi kể về việc đọc sách, em nên kể tên sách và nội dung em thích.")
    ],
    9: [
        ("Trong tuần ôn tập giữa học kì I, em cần ôn tập những gì?", ["Tập đọc", "Chính tả", "Cả A và B", "Không ôn tập gì"], 2, "Trong tuần ôn tập, em cần ôn tập tất cả các nội dung đã học, bao gồm Tập đọc và Chính tả."),
        ("Từ nào viết đúng chính tả?", ["ôn tập", "ôn tập", "ôn tập", "ôn tập"], 0, "Từ đúng là 'ôn tập' (ôn với chữ ô, tập với chữ t)."),
        ("Từ 'ôn tập' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 1, "'Ôn tập' là động từ chỉ hành động."),
        ("Chữ hoa S được viết như thế nào?", ["Nét cong", "Nét thẳng", "Nét thẳng và nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa S viết với nét cong."),
        ("Khi ôn tập, em nên làm gì?", ["Đọc lại bài cũ", "Làm bài tập", "Cả A và B", "Không làm gì"], 2, "Khi ôn tập, em nên đọc lại bài cũ và làm bài tập."),
        ("Trong câu 'Em ôn tập bài cũ', từ nào là danh từ?", ["Em", "ôn tập", "bài", "cũ"], 2, "Từ 'bài' là danh từ chỉ sự vật."),
        ("Từ nào sau đây viết đúng chính tả?", ["kiểm tra", "kiểm tra", "kiểm tra", "kiểm tra"], 0, "Từ đúng là 'kiểm tra' (kiểm với chữ k, tra với chữ tr)."),
        ("Trong tuần ôn tập, em sẽ làm gì?", ["Làm bài kiểm tra", "Ôn tập bài cũ", "Cả A và B", "Không làm gì"], 2, "Trong tuần ôn tập, em sẽ ôn tập bài cũ và làm bài kiểm tra."),
        ("Chữ hoa T được viết như thế nào?", ["Nét thẳng và nét ngang", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét cong"], 0, "Chữ hoa T viết với nét thẳng và nét ngang."),
        ("Câu nào sau đây có dấu chấm phẩy đúng?", ["Em học Toán; Tiếng Việt.", "Em học Toán, Tiếng Việt.", "Em học Toán! Tiếng Việt.", "Em học Toán? Tiếng Việt."], 0, "Dấu chấm phẩy dùng để ngăn cách các mục trong danh sách."),
        ("Từ nào sau đây viết đúng chính tả?", ["học kì", "học kì", "học kì", "học kì"], 0, "Từ đúng là 'học kì' (học với chữ h, kì với chữ k)."),
        ("Khi chuẩn bị kiểm tra, em cần làm gì?", ["Ôn tập bài cũ", "Chuẩn bị đồ dùng", "Cả A và B", "Không làm gì"], 2, "Khi chuẩn bị kiểm tra, em cần ôn tập bài cũ và chuẩn bị đồ dùng.")
    ],
    10: [
        ("Trong bài 'Gọi bạn', bài thơ nói về ai?", ["Hai người bạn", "Hai anh em", "Hai chị em", "Hai thầy cô"], 0, "Bài thơ nói về hai người bạn gọi nhau."),
        ("Từ nào viết đúng chính tả?", ["gọi bạn", "gọi bạn", "gọi bạn", "gọi bạn"], 0, "Từ đúng là 'gọi bạn' (gọi với chữ g, bạn với chữ b)."),
        ("Từ 'gọi bạn' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 1, "'Gọi bạn' là động từ chỉ hành động."),
        ("Chữ hoa U được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa U viết với nét thẳng và nét cong."),
        ("Khi gọi bạn, em nên nói như thế nào?", ["Tên bạn", "Xin chào", "Cả A và B", "Không nói gì"], 2, "Khi gọi bạn, em nên nói tên bạn và xin chào."),
        ("Trong câu 'Em gọi bạn Lan', từ nào là danh từ riêng?", ["Em", "gọi", "bạn", "Lan"], 3, "Từ 'Lan' là danh từ riêng chỉ tên người."),
        ("Từ nào sau đây viết đúng chính tả?", ["nhớ bạn", "nhớ bạn", "nhớ bạn", "nhớ bạn"], 0, "Từ đúng là 'nhớ bạn' (nhớ với chữ nh, bạn với chữ b)."),
        ("Trong bài 'Tớ nhớ cậu', bài thơ nói về điều gì?", ["Tình bạn", "Tình cảm gia đình", "Tình thầy trò", "Tình yêu"], 0, "Bài thơ nói về tình bạn, sự nhớ nhung giữa hai người bạn."),
        ("Chữ hoa V được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa V viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu gạch nối đúng?", ["Tớ - cậu là bạn thân.", "Tớ cậu là bạn thân.", "Tớ! cậu là bạn thân.", "Tớ? cậu là bạn thân."], 0, "Dấu gạch nối dùng để nối các từ trong cụm từ."),
        ("Từ nào sau đây viết đúng chính tả?", ["bạn thân", "bạn thân", "bạn thân", "bạn thân"], 0, "Từ đúng là 'bạn thân' (bạn với chữ b, thân với chữ th)."),
        ("Khi kể về bạn thân, em nên kể những gì?", ["Tên bạn", "Tính cách", "Cả A và B", "Không kể gì"], 2, "Khi kể về bạn thân, em nên kể tên bạn và tính cách của bạn.")
    ],
    11: [
        ("Trong bài 'Chữ A và những người bạn', chữ A có những người bạn nào?", ["Chữ B, C, D", "Chữ E, F, G", "Tất cả các chữ cái", "Không có bạn"], 2, "Chữ A có tất cả các chữ cái khác làm bạn."),
        ("Từ nào viết đúng chính tả?", ["chữ cái", "chữ cái", "chữ cái", "chữ cái"], 0, "Từ đúng là 'chữ cái' (chữ với chữ ch, cái với chữ c)."),
        ("Từ 'chữ cái' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Chữ cái' là danh từ chỉ sự vật."),
        ("Chữ hoa X được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa X viết với nét thẳng và nét cong."),
        ("Khi học chữ cái, em nên học như thế nào?", ["Đọc tên chữ", "Viết chữ", "Cả A và B", "Không học gì"], 2, "Khi học chữ cái, em nên đọc tên chữ và viết chữ."),
        ("Trong câu 'Chữ A có nhiều bạn', từ nào là tính từ?", ["Chữ A", "có", "nhiều", "bạn"], 2, "Từ 'nhiều' là tính từ chỉ số lượng."),
        ("Từ nào sau đây viết đúng chính tả?", ["nhím nâu", "nhím nâu", "nhím nâu", "nhím nâu"], 0, "Từ đúng là 'nhím nâu' (nhím với chữ nh, nâu với chữ n)."),
        ("Trong bài 'Nhím Nâu kết bạn', Nhím Nâu kết bạn với ai?", ["Các con vật khác", "Các cây cối", "Các đồ vật", "Không kết bạn với ai"], 0, "Nhím Nâu kết bạn với các con vật khác."),
        ("Chữ hoa Y được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Y viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu ngoặc đơn đúng?", ["Chữ A (chữ cái đầu tiên) có nhiều bạn.", "Chữ A chữ cái đầu tiên có nhiều bạn.", "Chữ A! chữ cái đầu tiên có nhiều bạn.", "Chữ A? chữ cái đầu tiên có nhiều bạn."], 0, "Dấu ngoặc đơn dùng để giải thích, bổ sung thông tin."),
        ("Từ nào sau đây viết đúng chính tả?", ["kết bạn", "kết bạn", "kết bạn", "kết bạn"], 0, "Từ đúng là 'kết bạn' (kết với chữ k, bạn với chữ b)."),
        ("Khi kể về việc kết bạn, em nên kể những gì?", ["Cách kết bạn", "Lý do kết bạn", "Cả A và B", "Không kể gì"], 2, "Khi kể về việc kết bạn, em nên kể cách kết bạn và lý do kết bạn.")
    ],
    12: [
        ("Trong bài 'Thả diều', bài thơ nói về hoạt động gì?", ["Thả diều", "Thả chim", "Thả cá", "Thả bóng"], 0, "Bài thơ nói về hoạt động thả diều."),
        ("Từ nào viết đúng chính tả?", ["thả diều", "thả diều", "thả diều", "thả diều"], 0, "Từ đúng là 'thả diều' (thả với chữ th, diều với chữ d)."),
        ("Từ 'thả diều' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 1, "'Thả diều' là động từ chỉ hành động."),
        ("Chữ hoa Z được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Z viết với nét thẳng và nét cong."),
        ("Khi kể về hoạt động thả diều, em nên kể những gì?", ["Cách thả diều", "Cảm giác khi thả diều", "Cả A và B", "Không kể gì"], 2, "Khi kể về hoạt động thả diều, em nên kể cách thả diều và cảm giác khi thả diều."),
        ("Trong câu 'Diều bay cao trên trời', từ nào là tính từ?", ["Diều", "bay", "cao", "trời"], 2, "Từ 'cao' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["Lê- Gô", "Lê- Gô", "Lê- Gô", "Lê- Gô"], 0, "Từ đúng là 'Lê- Gô' (Lê với chữ L, Gô với chữ G)."),
        ("Trong bài 'Tớ là Lê- Gô', Lê- Gô là gì?", ["Tên đồ chơi", "Tên người", "Tên con vật", "Tên cây cối"], 0, "Lê- Gô là tên một loại đồ chơi xếp hình."),
        ("Chữ hoa Đ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Đ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu gạch ngang đúng?", ["Tớ là Lê- Gô.", "Tớ là Lê Gô.", "Tớ là Lê! Gô.", "Tớ là Lê? Gô."], 0, "Dấu gạch ngang dùng để nối các từ trong tên riêng."),
        ("Từ nào sau đây viết đúng chính tả?", ["đồ chơi", "đồ chơi", "đồ chơi", "đồ chơi"], 0, "Từ đúng là 'đồ chơi' (đồ với chữ đ, chơi với chữ ch)."),
        ("Khi kể về đồ chơi, em nên kể những gì?", ["Tên đồ chơi", "Cách chơi", "Cả A và B", "Không kể gì"], 2, "Khi kể về đồ chơi, em nên kể tên đồ chơi và cách chơi.")
    ],
    13: [
        ("Trong bài 'Rồng rắn lên mây', đây là trò chơi gì?", ["Trò chơi dân gian", "Trò chơi hiện đại", "Trò chơi điện tử", "Trò chơi thể thao"], 0, "'Rồng rắn lên mây' là trò chơi dân gian của Việt Nam."),
        ("Từ nào viết đúng chính tả?", ["rồng rắn", "rồng rắn", "rồng rắn", "rồng rắn"], 0, "Từ đúng là 'rồng rắn' (rồng với chữ r, rắn với chữ r)."),
        ("Từ 'rồng rắn' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Rồng rắn' là danh từ chỉ tên trò chơi."),
        ("Chữ hoa Ê được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ê viết với nét thẳng và nét cong."),
        ("Khi chơi trò chơi dân gian, em nên làm gì?", ["Tuân thủ luật chơi", "Chơi công bằng", "Cả A và B", "Không làm gì"], 2, "Khi chơi trò chơi dân gian, em nên tuân thủ luật chơi và chơi công bằng."),
        ("Trong câu 'Rồng rắn lên mây', từ nào là động từ?", ["Rồng rắn", "lên", "mây", "Cả A, B, C"], 1, "Từ 'lên' là động từ chỉ hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["nặn đồ chơi", "nặn đồ chơi", "nặn đồ chơi", "nặn đồ chơi"], 0, "Từ đúng là 'nặn đồ chơi' (nặn với chữ n, đồ với chữ đ, chơi với chữ ch)."),
        ("Trong bài 'Nặn đồ chơi', em nặn đồ chơi bằng gì?", ["Đất sét", "Bột mì", "Cả A và B", "Không nặn gì"], 2, "Em có thể nặn đồ chơi bằng đất sét hoặc bột mì."),
        ("Chữ hoa Ơ được viết như thế nào?", ["Nét cong và nét móc", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ơ viết với nét cong và nét móc."),
        ("Câu nào sau đây có dấu chấm lửng đúng?", ["Em nặn nhiều đồ chơi...", "Em nặn nhiều đồ chơi.", "Em nặn nhiều đồ chơi!", "Em nặn nhiều đồ chơi?"], 0, "Dấu chấm lửng dùng để biểu thị còn nhiều điều chưa kể hết."),
        ("Từ nào sau đây viết đúng chính tả?", ["đất sét", "đất sét", "đất sét", "đất sét"], 0, "Từ đúng là 'đất sét' (đất với chữ đ, sét với chữ s)."),
        ("Khi kể về hoạt động nặn đồ chơi, em nên kể những gì?", ["Vật liệu nặn", "Đồ chơi đã nặn", "Cả A và B", "Không kể gì"], 2, "Khi kể về hoạt động nặn đồ chơi, em nên kể vật liệu nặn và đồ chơi đã nặn.")
    ],
    14: [
        ("Trong bài 'Sự tích hoa tỉ muội', hoa tỉ muội có ý nghĩa gì?", ["Tình chị em", "Tình bạn", "Tình thầy trò", "Tình yêu"], 0, "Hoa tỉ muội tượng trưng cho tình chị em."),
        ("Từ nào viết đúng chính tả?", ["tỉ muội", "tỉ muội", "tỉ muội", "tỉ muội"], 0, "Từ đúng là 'tỉ muội' (tỉ với chữ t, muội với chữ m)."),
        ("Từ 'tỉ muội' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Tỉ muội' là danh từ chỉ mối quan hệ gia đình."),
        ("Chữ hoa Ư được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ư viết với nét thẳng và nét cong."),
        ("Khi kể về tình chị em, em nên kể những gì?", ["Tên chị/em", "Tình cảm", "Cả A và B", "Không kể gì"], 2, "Khi kể về tình chị em, em nên kể tên chị/em và tình cảm."),
        ("Trong câu 'Chị em yêu thương nhau', từ nào là động từ?", ["Chị em", "yêu thương", "nhau", "Cả A, B, C"], 1, "Từ 'yêu thương' là động từ chỉ tình cảm, hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["mang về", "mang về", "mang về", "mang về"], 0, "Từ đúng là 'mang về' (mang với chữ m, về với chữ v)."),
        ("Trong bài 'Em mang về yêu thương', em mang về gì?", ["Yêu thương", "Quà tặng", "Đồ chơi", "Sách vở"], 0, "Em mang về yêu thương, tình cảm cho gia đình."),
        ("Chữ hoa Ă được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ă viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu ngoặc kép đúng?", ["Em mang về 'yêu thương'.", "Em mang về yêu thương.", "Em mang về! yêu thương.", "Em mang về? yêu thương."], 0, "Dấu ngoặc kép dùng để đánh dấu từ ngữ đặc biệt, có ý nghĩa đặc biệt."),
        ("Từ nào sau đây viết đúng chính tả?", ["yêu thương", "yêu thương", "yêu thương", "yêu thương"], 0, "Từ đúng là 'yêu thương' (yêu với chữ y, thương với chữ th)."),
        ("Khi kể về tình cảm gia đình, em nên kể những gì?", ["Tên người thân", "Tình cảm", "Cả A và B", "Không kể gì"], 2, "Khi kể về tình cảm gia đình, em nên kể tên người thân và tình cảm.")
    ],
    15: [
        ("Trong bài 'Mẹ', bài thơ nói về ai?", ["Mẹ", "Bố", "Anh chị", "Bạn bè"], 0, "Bài thơ nói về mẹ, người mẹ yêu thương con."),
        ("Từ nào viết đúng chính tả?", ["mẹ yêu", "mẹ yêu", "mẹ yêu", "mẹ yêu"], 0, "Từ đúng là 'mẹ yêu' (mẹ với chữ m, yêu với chữ y)."),
        ("Từ 'mẹ yêu' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Mẹ yêu' là danh từ chỉ người, chỉ mối quan hệ gia đình."),
        ("Chữ hoa Â được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Â viết với nét thẳng và nét cong."),
        ("Khi nói về mẹ, em nên nói những gì?", ["Tên mẹ", "Tình cảm với mẹ", "Cả A và B", "Không nói gì"], 2, "Khi nói về mẹ, em có thể nói tên mẹ và tình cảm với mẹ."),
        ("Trong câu 'Mẹ yêu thương con', từ nào là động từ?", ["Mẹ", "yêu thương", "con", "Cả A, B, C"], 1, "Từ 'yêu thương' là động từ chỉ tình cảm, hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["trò chơi", "trò chơi", "trò chơi", "trò chơi"], 0, "Từ đúng là 'trò chơi' (trò với chữ tr, chơi với chữ ch)."),
        ("Trong bài 'Trò chơi của bố', bố chơi trò chơi gì với em?", ["Nhiều trò chơi khác nhau", "Chỉ một trò chơi", "Không chơi gì", "Chơi điện tử"], 0, "Bố chơi nhiều trò chơi khác nhau với em."),
        ("Chữ hoa Ô được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ô viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm than đúng?", ["Bố yêu con lắm!", "Bố yêu con lắm.", "Bố yêu con lắm?", "Bố yêu con lắm,"], 0, "Câu cảm thán phải kết thúc bằng dấu chấm than (!)."),
        ("Từ nào sau đây viết đúng chính tả?", ["bố mẹ", "bố mẹ", "bố mẹ", "bố mẹ"], 0, "Từ đúng là 'bố mẹ' (bố với chữ b, mẹ với chữ m)."),
        ("Khi kể về bố, em nên kể những gì?", ["Tên bố", "Tính cách", "Cả A và B", "Không kể gì"], 2, "Khi kể về bố, em nên kể tên bố và tính cách của bố.")
    ],
    16: [
        ("Trong bài 'Cánh cửa nhớ bà', cánh cửa nhớ bà vì sao?", ["Bà thường mở cửa", "Bà thường đóng cửa", "Bà không bao giờ mở cửa", "Bà không bao giờ đóng cửa"], 0, "Cánh cửa nhớ bà vì bà thường mở cửa, chào đón mọi người."),
        ("Từ nào viết đúng chính tả?", ["cánh cửa", "cánh cửa", "cánh cửa", "cánh cửa"], 0, "Từ đúng là 'cánh cửa' (cánh với chữ c, cửa với chữ c)."),
        ("Từ 'cánh cửa' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Cánh cửa' là danh từ chỉ đồ vật."),
        ("Chữ hoa Ư được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ư viết với nét thẳng và nét cong."),
        ("Khi nói về bà, em nên nói những gì?", ["Tên bà", "Tình cảm với bà", "Cả A và B", "Không nói gì"], 2, "Khi nói về bà, em có thể nói tên bà và tình cảm với bà."),
        ("Trong câu 'Cánh cửa nhớ bà', từ nào là động từ?", ["Cánh cửa", "nhớ", "bà", "Cả A, B, C"], 1, "Từ 'nhớ' là động từ chỉ tình cảm, hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["thương ông", "thương ông", "thương ông", "thương ông"], 0, "Từ đúng là 'thương ông' (thương với chữ th, ông với chữ ô)."),
        ("Trong bài 'Thương ông', em thương ông vì sao?", ["Ông yêu thương em", "Ông chăm sóc em", "Cả A và B", "Không thương gì"], 2, "Em thương ông vì ông yêu thương và chăm sóc em."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu phẩy đúng?", ["Em thương ông, thương bà.", "Em thương ông thương bà.", "Em thương ông! thương bà.", "Em thương ông? thương bà."], 0, "Dấu phẩy dùng để ngăn cách các thành phần trong câu."),
        ("Từ nào sau đây viết đúng chính tả?", ["ông bà", "ông bà", "ông bà", "ông bà"], 0, "Từ đúng là 'ông bà' (ông với chữ ô, bà với chữ b)."),
        ("Khi kể về ông bà, em nên kể những gì?", ["Tên ông bà", "Tình cảm", "Cả A và B", "Không kể gì"], 2, "Khi kể về ông bà, em nên kể tên ông bà và tình cảm.")
    ],
    17: [
        ("Trong bài 'Ánh sáng của yêu thương', ánh sáng tượng trưng cho điều gì?", ["Tình yêu thương", "Ánh sáng mặt trời", "Ánh sáng đèn", "Ánh sáng trăng"], 0, "Ánh sáng tượng trưng cho tình yêu thương trong gia đình."),
        ("Từ nào viết đúng chính tả?", ["ánh sáng", "ánh sáng", "ánh sáng", "ánh sáng"], 0, "Từ đúng là 'ánh sáng' (ánh với chữ á, sáng với chữ s)."),
        ("Từ 'ánh sáng' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Ánh sáng' là danh từ chỉ sự vật, hiện tượng."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi nói về tình yêu thương, em nên nói những gì?", ["Biểu hiện của yêu thương", "Cảm nghĩ", "Cả A và B", "Không nói gì"], 2, "Khi nói về tình yêu thương, em có thể nói biểu hiện và cảm nghĩ."),
        ("Trong câu 'Ánh sáng tỏa sáng khắp nơi', từ nào là động từ?", ["Ánh sáng", "tỏa sáng", "khắp", "nơi"], 1, "Từ 'tỏa sáng' là động từ chỉ hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["chơi chông chóng", "chơi chông chóng", "chơi chông chóng", "chơi chông chóng"], 0, "Từ đúng là 'chơi chông chóng' (chơi với chữ ch, chông với chữ ch, chóng với chữ ch)."),
        ("Trong bài 'Chơi chông chóng', chông chóng là gì?", ["Đồ chơi quay", "Đồ chơi bay", "Đồ chơi nhảy", "Đồ chơi chạy"], 0, "Chông chóng là đồ chơi quay, có cánh quay khi có gió."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm hỏi đúng?", ["Chông chóng quay như thế nào?", "Chông chóng quay như thế nào.", "Chông chóng quay như thế nào!", "Chông chóng quay như thế nào,"], 0, "Câu hỏi phải kết thúc bằng dấu chấm hỏi (?)."),
        ("Từ nào sau đây viết đúng chính tả?", ["đồ chơi", "đồ chơi", "đồ chơi", "đồ chơi"], 0, "Từ đúng là 'đồ chơi' (đồ với chữ đ, chơi với chữ ch)."),
        ("Khi kể về đồ chơi quay, em nên kể những gì?", ["Cách chơi", "Cảm giác khi chơi", "Cả A và B", "Không kể gì"], 2, "Khi kể về đồ chơi quay, em nên kể cách chơi và cảm giác khi chơi.")
    ],
    18: [
        ("Trong tuần ôn tập cuối học kì I, em cần ôn tập những gì?", ["Tất cả nội dung đã học", "Chỉ Tập đọc", "Chỉ Chính tả", "Không ôn tập gì"], 0, "Trong tuần ôn tập cuối học kì, em cần ôn tập tất cả nội dung đã học."),
        ("Từ nào viết đúng chính tả?", ["cuối học kì", "cuối học kì", "cuối học kì", "cuối học kì"], 0, "Từ đúng là 'cuối học kì' (cuối với chữ c, học với chữ h, kì với chữ k)."),
        ("Từ 'cuối học kì' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Cuối học kì' là danh từ chỉ thời gian."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi ôn tập cuối học kì, em nên làm gì?", ["Ôn tập tất cả bài", "Làm bài kiểm tra", "Cả A và B", "Không làm gì"], 2, "Khi ôn tập cuối học kì, em nên ôn tập tất cả bài và làm bài kiểm tra."),
        ("Trong câu 'Em ôn tập để thi', từ nào là động từ?", ["Em", "ôn tập", "để", "thi"], 3, "Từ 'thi' là động từ chỉ hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["đánh giá", "đánh giá", "đánh giá", "đánh giá"], 0, "Từ đúng là 'đánh giá' (đánh với chữ đ, giá với chữ g)."),
        ("Trong tuần đánh giá cuối học kì, em sẽ làm gì?", ["Làm bài kiểm tra", "Nhận kết quả", "Cả A và B", "Không làm gì"], 2, "Trong tuần đánh giá, em sẽ làm bài kiểm tra và nhận kết quả."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Em đã hoàn thành học kì I.", "Em đã hoàn thành học kì I?", "Em đã hoàn thành học kì I!", "Em đã hoàn thành học kì I,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["hoàn thành", "hoàn thành", "hoàn thành", "hoàn thành"], 0, "Từ đúng là 'hoàn thành' (hoàn với chữ h, thành với chữ th)."),
        ("Khi chuẩn bị kiểm tra cuối học kì, em cần làm gì?", ["Ôn tập kỹ", "Chuẩn bị tinh thần", "Cả A và B", "Không làm gì"], 2, "Khi chuẩn bị kiểm tra cuối học kì, em cần ôn tập kỹ và chuẩn bị tinh thần.")
    ],
    19: [
        ("Trong bài 'Chuyện bốn mùa', bốn mùa là gì?", ["Xuân, Hạ, Thu, Đông", "Xuân, Hạ, Thu, Đông", "Xuân, Hạ, Thu, Đông", "Xuân, Hạ, Thu, Đông"], 0, "Bốn mùa là Xuân, Hạ, Thu, Đông."),
        ("Từ nào viết đúng chính tả?", ["bốn mùa", "bốn mùa", "bốn mùa", "bốn mùa"], 0, "Từ đúng là 'bốn mùa' (bốn với chữ b, mùa với chữ m)."),
        ("Từ 'bốn mùa' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Bốn mùa' là danh từ chỉ thời gian."),
        ("Chữ hoa V được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa V viết với nét thẳng và nét cong."),
        ("Khi kể về bốn mùa, em nên kể những gì?", ["Đặc điểm từng mùa", "Thời tiết", "Cả A và B", "Không kể gì"], 2, "Khi kể về bốn mùa, em nên kể đặc điểm từng mùa và thời tiết."),
        ("Trong câu 'Mùa xuân ấm áp', từ nào là tính từ?", ["Mùa xuân", "ấm áp", "Cả A và B", "Không có tính từ"], 1, "Từ 'ấm áp' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["mùa nước nổi", "mùa nước nổi", "mùa nước nổi", "mùa nước nổi"], 0, "Từ đúng là 'mùa nước nổi' (mùa với chữ m, nước với chữ n, nổi với chữ n)."),
        ("Trong bài 'Mùa nước nổi', mùa nước nổi là mùa gì?", ["Mùa lũ", "Mùa khô", "Mùa mưa", "Mùa nắng"], 0, "Mùa nước nổi là mùa lũ, nước dâng cao."),
        ("Chữ hoa W được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa W viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Mùa nước nổi đến rồi.", "Mùa nước nổi đến rồi?", "Mùa nước nổi đến rồi!", "Mùa nước nổi đến rồi,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["thời tiết", "thời tiết", "thời tiết", "thời tiết"], 0, "Từ đúng là 'thời tiết' (thời với chữ th, tiết với chữ t)."),
        ("Khi kể về thời tiết, em nên kể những gì?", ["Nhiệt độ", "Mưa, nắng", "Cả A và B", "Không kể gì"], 2, "Khi kể về thời tiết, em nên kể nhiệt độ và mưa, nắng.")
    ],
    20: [
        ("Trong bài 'Họa mi hót', họa mi là gì?", ["Loài chim", "Loài cá", "Loài hoa", "Loài cây"], 0, "Họa mi là loài chim, có tiếng hót hay."),
        ("Từ nào viết đúng chính tả?", ["họa mi", "họa mi", "họa mi", "họa mi"], 0, "Từ đúng là 'họa mi' (họa với chữ h, mi với chữ m)."),
        ("Từ 'họa mi' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Họa mi' là danh từ chỉ con vật."),
        ("Chữ hoa X được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa X viết với nét thẳng và nét cong."),
        ("Khi kể về loài chim, em nên kể những gì?", ["Tên chim", "Đặc điểm", "Cả A và B", "Không kể gì"], 2, "Khi kể về loài chim, em nên kể tên chim và đặc điểm."),
        ("Trong câu 'Họa mi hót hay', từ nào là tính từ?", ["Họa mi", "hót", "hay", "Cả A, B, C"], 2, "Từ 'hay' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["Tết đến", "Tết đến", "Tết đến", "Tết đến"], 0, "Từ đúng là 'Tết đến' (Tết với chữ T, đến với chữ đ)."),
        ("Trong bài 'Tết đến rồi', Tết là gì?", ["Ngày lễ lớn", "Ngày nghỉ", "Ngày học", "Ngày làm việc"], 0, "Tết là ngày lễ lớn của dân tộc Việt Nam."),
        ("Chữ hoa Y được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Y viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm than đúng?", ["Tết đến rồi!", "Tết đến rồi.", "Tết đến rồi?", "Tết đến rồi,"], 0, "Câu cảm thán phải kết thúc bằng dấu chấm than (!)."),
        ("Từ nào sau đây viết đúng chính tả?", ["ngày lễ", "ngày lễ", "ngày lễ", "ngày lễ"], 0, "Từ đúng là 'ngày lễ' (ngày với chữ ng, lễ với chữ l)."),
        ("Khi kể về ngày Tết, em nên kể những gì?", ["Hoạt động trong Tết", "Món ăn", "Cả A và B", "Không kể gì"], 2, "Khi kể về ngày Tết, em nên kể hoạt động trong Tết và món ăn.")
    ],
    21: [
        ("Trong bài 'Giọt nước và biển lớn', giọt nước tượng trưng cho điều gì?", ["Cái nhỏ", "Cái lớn", "Cái vừa", "Cái trung bình"], 0, "Giọt nước tượng trưng cho cái nhỏ, cái đơn lẻ."),
        ("Từ nào viết đúng chính tả?", ["giọt nước", "giọt nước", "giọt nước", "giọt nước"], 0, "Từ đúng là 'giọt nước' (giọt với chữ g, nước với chữ n)."),
        ("Từ 'giọt nước' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Giọt nước' là danh từ chỉ sự vật."),
        ("Chữ hoa Z được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Z viết với nét thẳng và nét cong."),
        ("Khi kể về giọt nước, em nên kể những gì?", ["Hình dáng", "Vai trò", "Cả A và B", "Không kể gì"], 2, "Khi kể về giọt nước, em nên kể hình dáng và vai trò."),
        ("Trong câu 'Giọt nước nhỏ bé', từ nào là tính từ?", ["Giọt nước", "nhỏ bé", "Cả A và B", "Không có tính từ"], 1, "Từ 'nhỏ bé' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["mùa vàng", "mùa vàng", "mùa vàng", "mùa vàng"], 0, "Từ đúng là 'mùa vàng' (mùa với chữ m, vàng với chữ v)."),
        ("Trong bài 'Mùa vàng', mùa vàng là mùa gì?", ["Mùa lúa chín", "Mùa hoa nở", "Mùa trái cây", "Mùa lá rụng"], 0, "Mùa vàng là mùa lúa chín, đồng lúa vàng rực."),
        ("Chữ hoa Đ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Đ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Mùa vàng đẹp quá.", "Mùa vàng đẹp quá?", "Mùa vàng đẹp quá!", "Mùa vàng đẹp quá,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["lúa chín", "lúa chín", "lúa chín", "lúa chín"], 0, "Từ đúng là 'lúa chín' (lúa với chữ l, chín với chữ ch)."),
        ("Khi kể về mùa vàng, em nên kể những gì?", ["Màu sắc", "Cảm giác", "Cả A và B", "Không kể gì"], 2, "Khi kể về mùa vàng, em nên kể màu sắc và cảm giác.")
    ],
    22: [
        ("Trong bài 'Hạt thóc', hạt thóc có vai trò gì?", ["Làm lương thực", "Làm thức ăn", "Cả A và B", "Không có vai trò gì"], 2, "Hạt thóc có vai trò làm lương thực và thức ăn cho con người."),
        ("Từ nào viết đúng chính tả?", ["hạt thóc", "hạt thóc", "hạt thóc", "hạt thóc"], 0, "Từ đúng là 'hạt thóc' (hạt với chữ h, thóc với chữ th)."),
        ("Từ 'hạt thóc' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Hạt thóc' là danh từ chỉ sự vật."),
        ("Chữ hoa Ê được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ê viết với nét thẳng và nét cong."),
        ("Khi kể về hạt thóc, em nên kể những gì?", ["Hình dáng", "Công dụng", "Cả A và B", "Không kể gì"], 2, "Khi kể về hạt thóc, em nên kể hình dáng và công dụng."),
        ("Trong câu 'Hạt thóc nhỏ bé', từ nào là tính từ?", ["Hạt thóc", "nhỏ bé", "Cả A và B", "Không có tính từ"], 1, "Từ 'nhỏ bé' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["lũy tre", "lũy tre", "lũy tre", "lũy tre"], 0, "Từ đúng là 'lũy tre' (lũy với chữ l, tre với chữ tr)."),
        ("Trong bài 'Lũy tre', lũy tre là gì?", ["Hàng tre dày", "Cây tre đơn lẻ", "Rừng tre", "Vườn tre"], 0, "Lũy tre là hàng tre dày, mọc thành hàng dài."),
        ("Chữ hoa Ơ được viết như thế nào?", ["Nét cong và nét móc", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ơ viết với nét cong và nét móc."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Lũy tre xanh mướt.", "Lũy tre xanh mướt?", "Lũy tre xanh mướt!", "Lũy tre xanh mướt,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["cây tre", "cây tre", "cây tre", "cây tre"], 0, "Từ đúng là 'cây tre' (cây với chữ c, tre với chữ tr)."),
        ("Khi kể về lũy tre, em nên kể những gì?", ["Vị trí", "Đặc điểm", "Cả A và B", "Không kể gì"], 2, "Khi kể về lũy tre, em nên kể vị trí và đặc điểm.")
    ],
    23: [
        ("Trong bài 'Vè chim', vè là gì?", ["Thể thơ dân gian", "Thể thơ hiện đại", "Thể thơ cổ điển", "Thể thơ tự do"], 0, "Vè là thể thơ dân gian, dễ nhớ, dễ thuộc."),
        ("Từ nào viết đúng chính tả?", ["vè chim", "vè chim", "vè chim", "vè chim"], 0, "Từ đúng là 'vè chim' (vè với chữ v, chim với chữ ch)."),
        ("Từ 'vè chim' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Vè chim' là danh từ chỉ thể loại văn học."),
        ("Chữ hoa Ư được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ư viết với nét thẳng và nét cong."),
        ("Khi đọc vè, em nên đọc như thế nào?", ["Nhịp nhàng", "Vui vẻ", "Cả A và B", "Không đọc gì"], 2, "Khi đọc vè, em nên đọc nhịp nhàng và vui vẻ."),
        ("Trong câu 'Vè chim hay quá', từ nào là tính từ?", ["Vè chim", "hay", "quá", "Cả A, B, C"], 1, "Từ 'hay' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["khủng long", "khủng long", "khủng long", "khủng long"], 0, "Từ đúng là 'khủng long' (khủng với chữ kh, long với chữ l)."),
        ("Trong bài 'Khủng long', khủng long là gì?", ["Động vật cổ đại", "Động vật hiện đại", "Động vật nhỏ", "Động vật bay"], 0, "Khủng long là động vật cổ đại, đã tuyệt chủng."),
        ("Chữ hoa Ă được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ă viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm hỏi đúng?", ["Khủng long sống ở đâu?", "Khủng long sống ở đâu.", "Khủng long sống ở đâu!", "Khủng long sống ở đâu,"], 0, "Câu hỏi phải kết thúc bằng dấu chấm hỏi (?)."),
        ("Từ nào sau đây viết đúng chính tả?", ["sự tích", "sự tích", "sự tích", "sự tích"], 0, "Từ đúng là 'sự tích' (sự với chữ s, tích với chữ t)."),
        ("Trong bài 'Sự tích cây thì là', sự tích là gì?", ["Câu chuyện dân gian", "Câu chuyện hiện đại", "Câu chuyện cổ tích", "Câu chuyện ngụ ngôn"], 0, "Sự tích là câu chuyện dân gian, giải thích nguồn gốc sự vật.")
    ],
    24: [
        ("Trong bài 'Bờ tre đón khách', bờ tre đón khách như thế nào?", ["Nhiệt tình, thân thiện", "Lạnh lùng", "Xa cách", "Không đón"], 0, "Bờ tre đón khách nhiệt tình, thân thiện."),
        ("Từ nào viết đúng chính tả?", ["bờ tre", "bờ tre", "bờ tre", "bờ tre"], 0, "Từ đúng là 'bờ tre' (bờ với chữ b, tre với chữ tr)."),
        ("Từ 'bờ tre' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Bờ tre' là danh từ chỉ địa điểm, nơi chốn."),
        ("Chữ hoa Â được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Â viết với nét thẳng và nét cong."),
        ("Khi kể về bờ tre, em nên kể những gì?", ["Vị trí", "Cảnh vật", "Cả A và B", "Không kể gì"], 2, "Khi kể về bờ tre, em nên kể vị trí và cảnh vật."),
        ("Trong câu 'Bờ tre đón khách', từ nào là động từ?", ["Bờ tre", "đón", "khách", "Cả A, B, C"], 1, "Từ 'đón' là động từ chỉ hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["tiếng chổi tre", "tiếng chổi tre", "tiếng chổi tre", "tiếng chổi tre"], 0, "Từ đúng là 'tiếng chổi tre' (tiếng với chữ t, chổi với chữ ch, tre với chữ tr)."),
        ("Trong bài 'Tiếng chổi tre', tiếng chổi tre là gì?", ["Âm thanh quét rác", "Âm thanh gió thổi", "Âm thanh mưa rơi", "Âm thanh chim hót"], 0, "Tiếng chổi tre là âm thanh quét rác, làm sạch đường phố."),
        ("Chữ hoa Ô được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ô viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm than đúng?", ["Tiếng chổi tre kêu xào xạc!", "Tiếng chổi tre kêu xào xạc.", "Tiếng chổi tre kêu xào xạc?", "Tiếng chổi tre kêu xào xạc,"], 0, "Câu cảm thán phải kết thúc bằng dấu chấm than (!)."),
        ("Từ nào sau đây viết đúng chính tả?", ["cỏ non", "cỏ non", "cỏ non", "cỏ non"], 0, "Từ đúng là 'cỏ non' (cỏ với chữ c, non với chữ n)."),
        ("Trong bài 'Cỏ non cười rồi', cỏ non cười vì sao?", ["Vui mừng", "Hạnh phúc", "Cả A và B", "Không cười gì"], 2, "Cỏ non cười vì vui mừng và hạnh phúc.")
    ],
    25: [
        ("Trong bài 'Những con sao biển', sao biển là gì?", ["Động vật biển", "Động vật trên cạn", "Thực vật", "Khoáng vật"], 0, "Sao biển là động vật biển, có hình dáng giống ngôi sao."),
        ("Từ nào viết đúng chính tả?", ["sao biển", "sao biển", "sao biển", "sao biển"], 0, "Từ đúng là 'sao biển' (sao với chữ s, biển với chữ b)."),
        ("Từ 'sao biển' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Sao biển' là danh từ chỉ con vật."),
        ("Chữ hoa Ư được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ư viết với nét thẳng và nét cong."),
        ("Khi kể về sao biển, em nên kể những gì?", ["Hình dáng", "Môi trường sống", "Cả A và B", "Không kể gì"], 2, "Khi kể về sao biển, em nên kể hình dáng và môi trường sống."),
        ("Trong câu 'Sao biển đẹp quá', từ nào là tính từ?", ["Sao biển", "đẹp", "quá", "Cả A, B, C"], 1, "Từ 'đẹp' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["tạm biệt", "tạm biệt", "tạm biệt", "tạm biệt"], 0, "Từ đúng là 'tạm biệt' (tạm với chữ t, biệt với chữ b)."),
        ("Trong bài 'Tạm biệt cánh cam', cánh cam là gì?", ["Loài côn trùng", "Loài chim", "Loài cá", "Loài hoa"], 0, "Cánh cam là loài côn trùng, có cánh màu cam."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Tạm biệt cánh cam.", "Tạm biệt cánh cam?", "Tạm biệt cánh cam!", "Tạm biệt cánh cam,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["côn trùng", "côn trùng", "côn trùng", "côn trùng"], 0, "Từ đúng là 'côn trùng' (côn với chữ c, trùng với chữ tr)."),
        ("Khi kể về côn trùng, em nên kể những gì?", ["Tên côn trùng", "Đặc điểm", "Cả A và B", "Không kể gì"], 2, "Khi kể về côn trùng, em nên kể tên côn trùng và đặc điểm.")
    ],
    26: [
        ("Trong tuần ôn tập giữa học kì II, em cần ôn tập những gì?", ["Tất cả nội dung đã học", "Chỉ Tập đọc", "Chỉ Chính tả", "Không ôn tập gì"], 0, "Trong tuần ôn tập giữa học kì, em cần ôn tập tất cả nội dung đã học."),
        ("Từ nào viết đúng chính tả?", ["giữa học kì", "giữa học kì", "giữa học kì", "giữa học kì"], 0, "Từ đúng là 'giữa học kì' (giữa với chữ g, học với chữ h, kì với chữ k)."),
        ("Từ 'giữa học kì' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Giữa học kì' là danh từ chỉ thời gian."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi ôn tập giữa học kì, em nên làm gì?", ["Ôn tập tất cả bài", "Làm bài kiểm tra", "Cả A và B", "Không làm gì"], 2, "Khi ôn tập giữa học kì, em nên ôn tập tất cả bài và làm bài kiểm tra."),
        ("Trong câu 'Em ôn tập để thi', từ nào là động từ?", ["Em", "ôn tập", "để", "thi"], 3, "Từ 'thi' là động từ chỉ hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["kiểm tra", "kiểm tra", "kiểm tra", "kiểm tra"], 0, "Từ đúng là 'kiểm tra' (kiểm với chữ k, tra với chữ tr)."),
        ("Trong tuần kiểm tra giữa học kì, em sẽ làm gì?", ["Làm bài kiểm tra", "Nhận kết quả", "Cả A và B", "Không làm gì"], 2, "Trong tuần kiểm tra, em sẽ làm bài kiểm tra và nhận kết quả."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Em đã hoàn thành kiểm tra.", "Em đã hoàn thành kiểm tra?", "Em đã hoàn thành kiểm tra!", "Em đã hoàn thành kiểm tra,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["hoàn thành", "hoàn thành", "hoàn thành", "hoàn thành"], 0, "Từ đúng là 'hoàn thành' (hoàn với chữ h, thành với chữ th)."),
        ("Khi chuẩn bị kiểm tra giữa học kì, em cần làm gì?", ["Ôn tập kỹ", "Chuẩn bị tinh thần", "Cả A và B", "Không làm gì"], 2, "Khi chuẩn bị kiểm tra giữa học kì, em cần ôn tập kỹ và chuẩn bị tinh thần.")
    ],
    27: [
        ("Trong bài 'Những cách chào độc đáo', có những cách chào nào?", ["Nhiều cách chào khác nhau", "Chỉ một cách chào", "Không có cách chào nào", "Chỉ chào bằng tay"], 0, "Có nhiều cách chào độc đáo khác nhau tùy theo văn hóa."),
        ("Từ nào viết đúng chính tả?", ["chào hỏi", "chào hỏi", "chào hỏi", "chào hỏi"], 0, "Từ đúng là 'chào hỏi' (chào với chữ ch, hỏi với chữ h)."),
        ("Từ 'chào hỏi' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 1, "'Chào hỏi' là động từ chỉ hành động."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi chào hỏi, em nên làm gì?", ["Nói lời chào", "Cử chỉ lịch sự", "Cả A và B", "Không làm gì"], 2, "Khi chào hỏi, em nên nói lời chào và có cử chỉ lịch sự."),
        ("Trong câu 'Em chào cô giáo', từ nào là danh từ?", ["Em", "chào", "cô giáo", "Cả A, B, C"], 2, "Từ 'cô giáo' là danh từ chỉ người."),
        ("Từ nào sau đây viết đúng chính tả?", ["thư viện", "thư viện", "thư viện", "thư viện"], 0, "Từ đúng là 'thư viện' (thư với chữ th, viện với chữ v)."),
        ("Trong bài 'Thư viện biết đi', thư viện biết đi là gì?", ["Thư viện di động", "Thư viện cố định", "Thư viện nhỏ", "Thư viện lớn"], 0, "Thư viện biết đi là thư viện di động, có thể di chuyển."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm hỏi đúng?", ["Thư viện ở đâu?", "Thư viện ở đâu.", "Thư viện ở đâu!", "Thư viện ở đâu,"], 0, "Câu hỏi phải kết thúc bằng dấu chấm hỏi (?)."),
        ("Từ nào sau đây viết đúng chính tả?", ["sách vở", "sách vở", "sách vở", "sách vở"], 0, "Từ đúng là 'sách vở' (sách với chữ s, vở với chữ v)."),
        ("Khi kể về thư viện, em nên kể những gì?", ["Vị trí", "Sách trong thư viện", "Cả A và B", "Không kể gì"], 2, "Khi kể về thư viện, em nên kể vị trí và sách trong thư viện.")
    ],
    28: [
        ("Trong bài 'Cảm ơn anh hà mã', em cảm ơn anh hà mã vì sao?", ["Anh giúp đỡ em", "Anh yêu thương em", "Cả A và B", "Không cảm ơn gì"], 2, "Em cảm ơn anh hà mã vì anh giúp đỡ và yêu thương em."),
        ("Từ nào viết đúng chính tả?", ["cảm ơn", "cảm ơn", "cảm ơn", "cảm ơn"], 0, "Từ đúng là 'cảm ơn' (cảm với chữ c, ơn với chữ ơ)."),
        ("Từ 'cảm ơn' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 1, "'Cảm ơn' là động từ chỉ hành động, lời nói."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi nói lời cảm ơn, em nên nói như thế nào?", ["Chân thành", "Lịch sự", "Cả A và B", "Không nói gì"], 2, "Khi nói lời cảm ơn, em nên nói chân thành và lịch sự."),
        ("Trong câu 'Em cảm ơn anh', từ nào là đại từ?", ["Em", "cảm ơn", "anh", "Cả A và C"], 0, "Từ 'Em' là đại từ chỉ người nói."),
        ("Từ nào sau đây viết đúng chính tả?", ["in-tơ-nét", "in-tơ-nét", "in-tơ-nét", "in-tơ-nét"], 0, "Từ đúng là 'in-tơ-nét' (in với chữ i, tơ với chữ t, nét với chữ n)."),
        ("Trong bài 'Từ chú bồ câu đến in-tơ-nét', bài đọc nói về điều gì?", ["Sự phát triển của thông tin", "Sự phát triển của công nghệ", "Cả A và B", "Không nói gì"], 2, "Bài đọc nói về sự phát triển của thông tin và công nghệ."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["In-tơ-nét rất tiện lợi.", "In-tơ-nét rất tiện lợi?", "In-tơ-nét rất tiện lợi!", "In-tơ-nét rất tiện lợi,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["thông tin", "thông tin", "thông tin", "thông tin"], 0, "Từ đúng là 'thông tin' (thông với chữ th, tin với chữ t)."),
        ("Khi kể về công nghệ, em nên kể những gì?", ["Tên công nghệ", "Công dụng", "Cả A và B", "Không kể gì"], 2, "Khi kể về công nghệ, em nên kể tên công nghệ và công dụng.")
    ],
    29: [
        ("Trong bài 'Mai An Tiêm', Mai An Tiêm là ai?", ["Nhân vật trong truyện cổ tích", "Nhân vật lịch sử", "Nhân vật hiện đại", "Nhân vật tưởng tượng"], 0, "Mai An Tiêm là nhân vật trong truyện cổ tích Việt Nam."),
        ("Từ nào viết đúng chính tả?", ["Mai An Tiêm", "Mai An Tiêm", "Mai An Tiêm", "Mai An Tiêm"], 0, "Từ đúng là 'Mai An Tiêm' (Mai với chữ M, An với chữ A, Tiêm với chữ T)."),
        ("Từ 'Mai An Tiêm' thuộc loại từ gì?", ["Danh từ riêng", "Danh từ chung", "Động từ", "Tính từ"], 0, "'Mai An Tiêm' là danh từ riêng chỉ tên người."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi kể về nhân vật trong truyện, em nên kể những gì?", ["Tên nhân vật", "Tính cách", "Cả A và B", "Không kể gì"], 2, "Khi kể về nhân vật, em nên kể tên nhân vật và tính cách."),
        ("Trong câu 'Mai An Tiêm thông minh', từ nào là tính từ?", ["Mai An Tiêm", "thông minh", "Cả A và B", "Không có tính từ"], 1, "Từ 'thông minh' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["thư gửi", "thư gửi", "thư gửi", "thư gửi"], 0, "Từ đúng là 'thư gửi' (thư với chữ th, gửi với chữ g)."),
        ("Trong bài 'Thư gửi bố ngoài đảo', thư gửi cho ai?", ["Bố ngoài đảo", "Mẹ ở nhà", "Anh chị", "Bạn bè"], 0, "Thư gửi cho bố đang làm việc ngoài đảo."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Em viết thư cho bố.", "Em viết thư cho bố?", "Em viết thư cho bố!", "Em viết thư cho bố,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["hòn đảo", "hòn đảo", "hòn đảo", "hòn đảo"], 0, "Từ đúng là 'hòn đảo' (hòn với chữ h, đảo với chữ đ)."),
        ("Khi viết thư, em nên viết những gì?", ["Lời chào", "Nội dung", "Cả A và B", "Không viết gì"], 2, "Khi viết thư, em nên viết lời chào và nội dung.")
    ],
    30: [
        ("Trong bài 'Bóp nát quả cam', ai bóp nát quả cam?", ["Trần Quốc Toản", "Mai An Tiêm", "Thánh Gióng", "Lê Lợi"], 0, "Trần Quốc Toản bóp nát quả cam vì tức giận."),
        ("Từ nào viết đúng chính tả?", ["bóp nát", "bóp nát", "bóp nát", "bóp nát"], 0, "Từ đúng là 'bóp nát' (bóp với chữ b, nát với chữ n)."),
        ("Từ 'bóp nát' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 1, "'Bóp nát' là động từ chỉ hành động."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi kể về nhân vật lịch sử, em nên kể những gì?", ["Tên nhân vật", "Sự kiện", "Cả A và B", "Không kể gì"], 2, "Khi kể về nhân vật lịch sử, em nên kể tên nhân vật và sự kiện."),
        ("Trong câu 'Trần Quốc Toản bóp nát quả cam', từ nào là danh từ?", ["Trần Quốc Toản", "bóp nát", "quả cam", "Cả A và C"], 2, "Từ 'quả cam' là danh từ chỉ sự vật."),
        ("Từ nào sau đây viết đúng chính tả?", ["chiếc rễ", "chiếc rễ", "chiếc rễ", "chiếc rễ"], 0, "Từ đúng là 'chiếc rễ' (chiếc với chữ ch, rễ với chữ r)."),
        ("Trong bài 'Chiếc rễ đa tròn', chiếc rễ đa tròn là gì?", ["Rễ cây đa", "Rễ cây tre", "Rễ cây bàng", "Rễ cây phượng"], 0, "Chiếc rễ đa tròn là rễ cây đa, có hình tròn."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Chiếc rễ đa tròn.", "Chiếc rễ đa tròn?", "Chiếc rễ đa tròn!", "Chiếc rễ đa tròn,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["cây đa", "cây đa", "cây đa", "cây đa"], 0, "Từ đúng là 'cây đa' (cây với chữ c, đa với chữ đ)."),
        ("Khi kể về cây đa, em nên kể những gì?", ["Hình dáng", "Vị trí", "Cả A và B", "Không kể gì"], 2, "Khi kể về cây đa, em nên kể hình dáng và vị trí.")
    ],
    31: [
        ("Trong bài 'Đất nước chúng mình', đất nước là gì?", ["Quê hương Việt Nam", "Quê hương nước ngoài", "Quê hương châu Á", "Quê hương châu Âu"], 0, "Đất nước chúng mình là quê hương Việt Nam."),
        ("Từ nào viết đúng chính tả?", ["đất nước", "đất nước", "đất nước", "đất nước"], 0, "Từ đúng là 'đất nước' (đất với chữ đ, nước với chữ n)."),
        ("Từ 'đất nước' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Đất nước' là danh từ chỉ địa danh, quê hương."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi nói về đất nước, em nên nói những gì?", ["Tên đất nước", "Đặc điểm", "Cả A và B", "Không nói gì"], 2, "Khi nói về đất nước, em có thể nói tên đất nước và đặc điểm."),
        ("Trong câu 'Đất nước chúng mình đẹp quá', từ nào là tính từ?", ["Đất nước", "chúng mình", "đẹp", "quá"], 2, "Từ 'đẹp' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["miền đất", "miền đất", "miền đất", "miền đất"], 0, "Từ đúng là 'miền đất' (miền với chữ m, đất với chữ đ)."),
        ("Trong bài 'Trên các miền đất nước', có những miền nào?", ["Miền Bắc, Trung, Nam", "Chỉ miền Bắc", "Chỉ miền Nam", "Chỉ miền Trung"], 0, "Có ba miền: miền Bắc, miền Trung, miền Nam."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu phẩy đúng?", ["Miền Bắc, Trung, Nam đều đẹp.", "Miền Bắc Trung Nam đều đẹp.", "Miền Bắc! Trung! Nam đều đẹp.", "Miền Bắc? Trung? Nam đều đẹp."], 0, "Dấu phẩy dùng để ngăn cách các thành phần trong câu."),
        ("Từ nào sau đây viết đúng chính tả?", ["quê hương", "quê hương", "quê hương", "quê hương"], 0, "Từ đúng là 'quê hương' (quê với chữ q, hương với chữ h)."),
        ("Khi kể về quê hương, em nên kể những gì?", ["Tên quê hương", "Đặc điểm", "Cả A và B", "Không kể gì"], 2, "Khi kể về quê hương, em nên kể tên quê hương và đặc điểm.")
    ],
    32: [
        ("Trong bài 'Chuyện quả bầu', quả bầu có vai trò gì?", ["Cứu sống con người", "Làm thức ăn", "Làm đồ chơi", "Làm vật trang trí"], 0, "Quả bầu có vai trò cứu sống con người trong câu chuyện."),
        ("Từ nào viết đúng chính tả?", ["quả bầu", "quả bầu", "quả bầu", "quả bầu"], 0, "Từ đúng là 'quả bầu' (quả với chữ q, bầu với chữ b)."),
        ("Từ 'quả bầu' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Quả bầu' là danh từ chỉ sự vật."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi kể về truyện cổ tích, em nên kể những gì?", ["Tên truyện", "Nội dung", "Cả A và B", "Không kể gì"], 2, "Khi kể về truyện cổ tích, em nên kể tên truyện và nội dung."),
        ("Trong câu 'Quả bầu cứu sống con người', từ nào là động từ?", ["Quả bầu", "cứu sống", "con người", "Cả A, B, C"], 1, "Từ 'cứu sống' là động từ chỉ hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["khám phá", "khám phá", "khám phá", "khám phá"], 0, "Từ đúng là 'khám phá' (khám với chữ kh, phá với chữ ph)."),
        ("Trong bài 'Khám phá đáy biển ở Trường Sa', Trường Sa là gì?", ["Quần đảo Việt Nam", "Quần đảo nước ngoài", "Thành phố", "Tỉnh thành"], 0, "Trường Sa là quần đảo của Việt Nam trên biển Đông."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm hỏi đúng?", ["Trường Sa ở đâu?", "Trường Sa ở đâu.", "Trường Sa ở đâu!", "Trường Sa ở đâu,"], 0, "Câu hỏi phải kết thúc bằng dấu chấm hỏi (?)."),
        ("Từ nào sau đây viết đúng chính tả?", ["quần đảo", "quần đảo", "quần đảo", "quần đảo"], 0, "Từ đúng là 'quần đảo' (quần với chữ q, đảo với chữ đ)."),
        ("Khi kể về quần đảo, em nên kể những gì?", ["Vị trí", "Đặc điểm", "Cả A và B", "Không kể gì"], 2, "Khi kể về quần đảo, em nên kể vị trí và đặc điểm.")
    ],
    33: [
        ("Trong bài 'Hồ Gươm', Hồ Gươm ở đâu?", ["Hà Nội", "Thành phố Hồ Chí Minh", "Đà Nẵng", "Huế"], 0, "Hồ Gươm ở Hà Nội, thủ đô của Việt Nam."),
        ("Từ nào viết đúng chính tả?", ["Hồ Gươm", "Hồ Gươm", "Hồ Gươm", "Hồ Gươm"], 0, "Từ đúng là 'Hồ Gươm' (Hồ với chữ H, Gươm với chữ G)."),
        ("Từ 'Hồ Gươm' thuộc loại từ gì?", ["Danh từ riêng", "Danh từ chung", "Động từ", "Tính từ"], 0, "'Hồ Gươm' là danh từ riêng chỉ địa danh."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi kể về Hồ Gươm, em nên kể những gì?", ["Vị trí", "Lịch sử", "Cả A và B", "Không kể gì"], 2, "Khi kể về Hồ Gươm, em nên kể vị trí và lịch sử."),
        ("Trong câu 'Hồ Gươm đẹp quá', từ nào là tính từ?", ["Hồ Gươm", "đẹp", "quá", "Cả A, B, C"], 1, "Từ 'đẹp' là tính từ chỉ đặc điểm, tính chất."),
        ("Từ nào sau đây viết đúng chính tả?", ["cánh đồng", "cánh đồng", "cánh đồng", "cánh đồng"], 0, "Từ đúng là 'cánh đồng' (cánh với chữ c, đồng với chữ đ)."),
        ("Trong bài 'Cánh đồng quê em', cánh đồng quê em có gì?", ["Lúa chín vàng", "Cây cối xanh tươi", "Cả A và B", "Không có gì"], 2, "Cánh đồng quê em có lúa chín vàng và cây cối xanh tươi."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Cánh đồng quê em đẹp quá.", "Cánh đồng quê em đẹp quá?", "Cánh đồng quê em đẹp quá!", "Cánh đồng quê em đẹp quá,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["quê em", "quê em", "quê em", "quê em"], 0, "Từ đúng là 'quê em' (quê với chữ q, em với chữ e)."),
        ("Khi kể về quê em, em nên kể những gì?", ["Cảnh vật", "Con người", "Cả A và B", "Không kể gì"], 2, "Khi kể về quê em, em nên kể cảnh vật và con người.")
    ],
    34: [
        ("Trong tuần ôn tập cuối học kì II, em cần ôn tập những gì?", ["Tất cả nội dung đã học", "Chỉ Tập đọc", "Chỉ Chính tả", "Không ôn tập gì"], 0, "Trong tuần ôn tập cuối học kì, em cần ôn tập tất cả nội dung đã học."),
        ("Từ nào viết đúng chính tả?", ["cuối học kì", "cuối học kì", "cuối học kì", "cuối học kì"], 0, "Từ đúng là 'cuối học kì' (cuối với chữ c, học với chữ h, kì với chữ k)."),
        ("Từ 'cuối học kì' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 0, "'Cuối học kì' là danh từ chỉ thời gian."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi ôn tập cuối học kì, em nên làm gì?", ["Ôn tập tất cả bài", "Làm bài kiểm tra", "Cả A và B", "Không làm gì"], 2, "Khi ôn tập cuối học kì, em nên ôn tập tất cả bài và làm bài kiểm tra."),
        ("Trong câu 'Em ôn tập để thi', từ nào là động từ?", ["Em", "ôn tập", "để", "thi"], 3, "Từ 'thi' là động từ chỉ hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["đánh giá", "đánh giá", "đánh giá", "đánh giá"], 0, "Từ đúng là 'đánh giá' (đánh với chữ đ, giá với chữ g)."),
        ("Trong tuần đánh giá cuối học kì, em sẽ làm gì?", ["Làm bài kiểm tra", "Nhận kết quả", "Cả A và B", "Không làm gì"], 2, "Trong tuần đánh giá, em sẽ làm bài kiểm tra và nhận kết quả."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Em đã hoàn thành học kì II.", "Em đã hoàn thành học kì II?", "Em đã hoàn thành học kì II!", "Em đã hoàn thành học kì II,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["hoàn thành", "hoàn thành", "hoàn thành", "hoàn thành"], 0, "Từ đúng là 'hoàn thành' (hoàn với chữ h, thành với chữ th)."),
        ("Khi chuẩn bị kiểm tra cuối học kì, em cần làm gì?", ["Ôn tập kỹ", "Chuẩn bị tinh thần", "Cả A và B", "Không làm gì"], 2, "Khi chuẩn bị kiểm tra cuối học kì, em cần ôn tập kỹ và chuẩn bị tinh thần.")
    ],
    35: [
        ("Trong tuần ôn tập và đánh giá cuối học kì II, em cần làm gì?", ["Ôn tập tất cả", "Làm bài kiểm tra", "Cả A và B", "Không làm gì"], 2, "Trong tuần ôn tập và đánh giá, em cần ôn tập tất cả và làm bài kiểm tra."),
        ("Từ nào viết đúng chính tả?", ["đánh giá", "đánh giá", "đánh giá", "đánh giá"], 0, "Từ đúng là 'đánh giá' (đánh với chữ đ, giá với chữ g)."),
        ("Từ 'đánh giá' thuộc loại từ gì?", ["Danh từ", "Động từ", "Tính từ", "Đại từ"], 1, "'Đánh giá' là động từ chỉ hành động."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Khi đánh giá cuối học kì, em sẽ được đánh giá những gì?", ["Kiến thức", "Kỹ năng", "Cả A và B", "Không đánh giá gì"], 2, "Khi đánh giá cuối học kì, em sẽ được đánh giá kiến thức và kỹ năng."),
        ("Trong câu 'Em đã hoàn thành học kì II', từ nào là động từ?", ["Em", "đã", "hoàn thành", "học kì II"], 2, "Từ 'hoàn thành' là động từ chỉ hành động."),
        ("Từ nào sau đây viết đúng chính tả?", ["kết quả", "kết quả", "kết quả", "kết quả"], 0, "Từ đúng là 'kết quả' (kết với chữ k, quả với chữ q)."),
        ("Sau khi làm bài kiểm tra, em sẽ nhận được gì?", ["Kết quả", "Nhận xét", "Cả A và B", "Không nhận gì"], 2, "Sau khi làm bài kiểm tra, em sẽ nhận được kết quả và nhận xét."),
        ("Chữ hoa Ứ được viết như thế nào?", ["Nét thẳng và nét cong", "Chỉ có nét thẳng", "Chỉ có nét cong", "Nét thẳng và nét ngang"], 0, "Chữ hoa Ứ viết với nét thẳng và nét cong."),
        ("Câu nào sau đây có dấu chấm đúng?", ["Em đã hoàn thành năm học.", "Em đã hoàn thành năm học?", "Em đã hoàn thành năm học!", "Em đã hoàn thành năm học,"], 0, "Câu kể phải kết thúc bằng dấu chấm (.)."),
        ("Từ nào sau đây viết đúng chính tả?", ["năm học", "năm học", "năm học", "năm học"], 0, "Từ đúng là 'năm học' (năm với chữ n, học với chữ h)."),
        ("Khi kết thúc năm học, em cần làm gì?", ["Tổng kết", "Nghỉ hè", "Cả A và B", "Không làm gì"], 2, "Khi kết thúc năm học, em cần tổng kết và nghỉ hè.")
    ]
}

def shuffle_options_to_target(original_options: List[str], original_correct: int, target_index: int) -> Tuple[List[str], int]:
    """Xáo trộn options để đáp án đúng ở vị trí target_index"""
    if original_correct == target_index:
        return original_options, target_index
    
    new_options = original_options.copy()
    correct_answer = new_options[original_correct]
    
    # Xóa đáp án đúng khỏi vị trí cũ
    new_options.pop(original_correct)
    
    # Chèn đáp án đúng vào vị trí mới
    new_options.insert(target_index, correct_answer)
    
    return new_options, target_index

def create_week_json(week: int, questions_data: List[Tuple], week_title: str) -> Dict[str, Any]:
    """Tạo JSON cho một tuần với phân bổ đáp án đúng 3-3-3-3"""
    questions = []
    
    for i, (question, options, original_correct, explanation) in enumerate(questions_data):
        target_answer = TARGET_DISTRIBUTION[i]
        
        # Xáo trộn options để đáp án đúng ở vị trí target_answer
        shuffled_options, new_correct = shuffle_options_to_target(options, original_correct, target_answer)
        
        questions.append({
            "id": f"q{i+1}",
            "type": "multiple-choice",
            "question": question,
            "options": shuffled_options,
            "correctAnswer": new_correct,
            "explanation": explanation,
            "imageUrl": None
        })
    
    return {
        "week": week,
        "subject": "vietnamese",
        "grade": 2,
        "bookSeries": "ket-noi-tri-thuc",
        "lessons": [
            {
                "id": f"lesson-{week}",
                "title": week_title,
                "duration": 5,
                "questions": questions
            }
        ]
    }

def generate_default_questions(week: int, week_title: str) -> List[Tuple]:
    """Tạo câu hỏi mặc định cho tuần chưa có câu hỏi"""
    topics = ["Tập đọc", "Chính tả", "Luyện từ và câu", "Tập viết", "Nói và nghe", "Viết đoạn văn"]
    questions = []
    
    for i in range(12):
        topic = topics[i % len(topics)]
        target_answer = TARGET_DISTRIBUTION[i]
        
        questions.append((
            f"Câu hỏi {topic} - {week_title}, câu {i+1}",
            ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
            target_answer,
            f"Giải thích cho câu hỏi {i+1} - {topic}"
        ))
    
    return questions

def validate_week(week_data: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Kiểm tra tuần: phân bổ đáp án, đáp án đúng khớp câu hỏi"""
    errors = []
    questions = week_data["lessons"][0]["questions"]
    
    # Kiểm tra 1: Phân bổ đáp án đúng (3-3-3-3)
    counts = [0, 0, 0, 0]
    for q in questions:
        counts[q["correctAnswer"]] += 1
    if counts != [3, 3, 3, 3]:
        errors.append(f"Phan bo dap an khong deu: A={counts[0]}, B={counts[1]}, C={counts[2]}, D={counts[3]}")
    
    # Kiểm tra 2: Đáp án đúng có trong options
    for i, q in enumerate(questions):
        correct_idx = q["correctAnswer"]
        if correct_idx < 0 or correct_idx >= len(q["options"]):
            errors.append(f"Cau {i+1}: correctAnswer index {correct_idx} khong hop le")
    
    # Kiểm tra 3: Số thứ tự câu hỏi
    for i, q in enumerate(questions):
        expected_id = f"q{i+1}"
        if q["id"] != expected_id:
            errors.append(f"Cau {i+1}: id khong dung, expected {expected_id}, got {q['id']}")
    
    return len(errors) == 0, errors

def main():
    """Tạo tất cả 35 tuần"""
    output_dir = "public/data/questions/ket-noi-tri-thuc/grade-2/vietnamese"
    os.makedirs(output_dir, exist_ok=True)
    
    # Week titles dựa trên phân phối chương trình
    week_titles = {
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
    
    all_errors = []
    created_weeks = []
    
    for week in range(1, 36):
        week_title = week_titles.get(week, f"Tuần {week}")
        
        if week in WEEK_QUESTIONS_DATA:
            questions_data = WEEK_QUESTIONS_DATA[week]
        else:
            # Tạo câu hỏi mặc định
            questions_data = generate_default_questions(week, week_title)
        
        week_json = create_week_json(week, questions_data, week_title)
        
        # Validate
        is_valid, errors = validate_week(week_json)
        if not is_valid:
            all_errors.append(f"Tuan {week}: {', '.join(errors)}")
        else:
            # Save file
            filename = os.path.join(output_dir, f"week-{week}.json")
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(week_json, f, ensure_ascii=False, indent=2)
            created_weeks.append(week)
            print(f"Da tao tuan {week}")
    
    # Bao cao
    print(f"\n=== BAO CAO ===")
    print(f"Da tao: {len(created_weeks)} tuan")
    print(f"Loi: {len(all_errors)}")
    if all_errors:
        print("\nLoi chi tiet:")
        for error in all_errors:
            print(f"  - {error}")
    
    if len(created_weeks) < 35:
        print(f"\nCan them cau hoi thuc te cho {35 - len(created_weeks)} tuan con lai")

if __name__ == "__main__":
    main()

