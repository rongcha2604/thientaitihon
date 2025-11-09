#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to add explanations to math questions in JSON files
"""
import json
import re
import os
import sys
from pathlib import Path

# Fix encoding for Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def generate_explanation(question, options, correct_answer_index):
    """Generate explanation based on question type and content"""
    correct_answer = options[correct_answer_index]
    question_lower = question.lower()
    
    # Extract numbers from question
    numbers = re.findall(r'\d+', question)
    
    # Type 1: Counting questions - "Có X ... Số nào tương ứng?"
    if "có" in question_lower and "số nào tương ứng" in question_lower:
        count = numbers[0] if numbers else ""
        return f"Có {count} {extract_object(question)}, vậy số tương ứng là {correct_answer}. Em có thể đếm: {generate_counting_sequence(int(correct_answer))}."
    
    # Type 2: Position questions - "Số nào đứng sau/trước/giữa số X?"
    if "đứng sau" in question_lower:
        base_num = numbers[0] if numbers else ""
        next_num = str(int(base_num) + 1)
        return f"Số đứng sau số {base_num} là số {correct_answer}. Dãy số là: {generate_number_sequence(int(base_num), int(correct_answer))}..."
    
    if "đứng trước" in question_lower:
        base_num = numbers[0] if numbers else ""
        prev_num = str(int(base_num) - 1)
        return f"Số đứng trước số {base_num} là số {correct_answer}. Dãy số là: ... {generate_number_sequence(int(correct_answer), int(base_num))}..."
    
    if "đứng giữa" in question_lower or "nằm giữa" in question_lower:
        nums = [int(n) for n in numbers[:2]] if len(numbers) >= 2 else []
        if nums:
            return f"Số nằm giữa số {nums[0]} và số {nums[1]} là số {correct_answer}. Dãy số là: {nums[0]}, {correct_answer}, {nums[1]}."
    
    # Type 3: Comparison - "Số nào lớn nhất/nhỏ nhất" or "lớn hơn/ít hơn"
    if "lớn nhất" in question_lower:
        nums_str = extract_numbers_from_text(question)
        return f"Số lớn nhất trong các số {nums_str} là số {correct_answer}. Vì {generate_comparison_chain(nums_str, 'desc')}."
    
    if "nhỏ nhất" in question_lower:
        nums_str = extract_numbers_from_text(question)
        return f"Số nhỏ nhất trong các số {nums_str} là số {correct_answer}. Vì {generate_comparison_chain(nums_str, 'asc')}."
    
    if "lớn hơn" in question_lower or "nhiều hơn" in question_lower:
        nums = [int(n) for n in numbers[:2]] if len(numbers) >= 2 else []
        if nums:
            larger = max(nums)
            smaller = min(nums)
            return f"Số {larger} lớn hơn số {smaller}. Vì {larger} > {smaller}."
    
    if "ít hơn" in question_lower:
        # Extract numbers from question and options
        nums = [int(n) for n in numbers] if numbers else []
        if len(nums) >= 2:
            smaller = min(nums)
            larger = max(nums)
            # Check if answer contains the smaller number
            if str(smaller) in correct_answer:
                return f"{correct_answer} ít hơn vì có {smaller}, trong khi có {larger}. {smaller} < {larger}."
    
    if "bằng nhau" in question_lower or ("như thế nào" in question_lower and "số lượng" in question_lower):
        if "bằng nhau" in correct_answer.lower():
            nums = [int(n) for n in numbers[:2]] if len(numbers) >= 2 else []
            if nums and nums[0] == nums[1]:
                return f"Cả hai đều có số lượng {nums[0]}, nên bằng nhau. {nums[0]} = {nums[1]}."
    
    # Type 3b: Comparison with operators - "So sánh: X và Y. Kết quả nào đúng?"
    if "so sánh" in question_lower and "kết quả nào đúng" in question_lower:
        nums = [int(n) for n in numbers[:2]] if len(numbers) >= 2 else []
        if nums:
            if "<" in correct_answer:
                return f"So sánh {nums[0]} và {nums[1]}: {nums[0]} < {nums[1]} vì {nums[0]} nhỏ hơn {nums[1]}."
            elif ">" in correct_answer:
                return f"So sánh {nums[0]} và {nums[1]}: {nums[0]} > {nums[1]} vì {nums[0]} lớn hơn {nums[1]}."
            elif "=" in correct_answer:
                return f"So sánh {nums[0]} và {nums[1]}: {nums[0]} = {nums[1]} vì hai số bằng nhau."
    
    # Type 3c: "nhỏ hơn" comparison
    if "nhỏ hơn" in question_lower:
        nums = [int(n) for n in numbers[:2]] if len(numbers) >= 2 else []
        if nums:
            smaller = min(nums)
            larger = max(nums)
            return f"Số {smaller} nhỏ hơn số {larger}. Vì {smaller} < {larger}."
    
    # Type 3d: "nhiều hơn" with objects
    if "nhiều hơn" in question_lower and ("con" in question_lower or "quả" in question_lower or "bông" in question_lower):
        nums = [int(n) for n in numbers[:2]] if len(numbers) >= 2 else []
        if nums:
            larger = max(nums)
            smaller = min(nums)
            return f"{correct_answer} nhiều hơn vì có {larger}, trong khi có {smaller}. {larger} > {smaller}."
    
    # Type 4: Sequence - "Dãy số nào đúng theo thứ tự từ nhỏ đến lớn/lớn đến nhỏ?" or "Sắp xếp các số"
    if "dãy số nào đúng" in question_lower or "sắp xếp các số" in question_lower:
        if "từ nhỏ đến lớn" in question_lower:
            nums_str = extract_numbers_from_text(question)
            return f"Dãy số đúng theo thứ tự từ nhỏ đến lớn là: {correct_answer}. Em sắp xếp các số {nums_str} từ số nhỏ nhất đến số lớn nhất."
        elif "từ lớn đến nhỏ" in question_lower:
            nums_str = extract_numbers_from_text(question)
            return f"Dãy số đúng theo thứ tự từ lớn đến nhỏ là: {correct_answer}. Em sắp xếp các số {nums_str} từ số lớn nhất đến số nhỏ nhất."
    
    # Type 5: Addition - "X và Y bằng mấy?" or "Có X..., thêm Y... Hỏi có tất cả mấy...?" or "X + Y = ?"
    if "và" in question_lower and "bằng mấy" in question_lower:
        nums = [int(n) for n in numbers[:2]] if len(numbers) >= 2 else []
        if nums:
            result = nums[0] + nums[1]
            return f"{nums[0]} + {nums[1]} = {correct_answer}. Em có thể đếm: bắt đầu từ {nums[0]}, thêm {nums[1]} nữa là {correct_answer}."
    
    if "thêm" in question_lower and ("hỏi có tất cả mấy" in question_lower or "hỏi có tất cả bao nhiêu" in question_lower):
        nums = [int(n) for n in numbers[:2]] if len(numbers) >= 2 else []
        obj_match = re.search(r'(quả|con|cái|bông|ngôi)\s+(\w+)', question_lower)
        obj_text = f" {obj_match.group(1)} {obj_match.group(2)}" if obj_match else ""
        if nums:
            correct_num = re.search(r'\d+', str(correct_answer))
            if correct_num:
                correct_num = int(correct_num.group())
                return f"Có {nums[0]}{obj_text}, thêm {nums[1]} nữa là {correct_answer}. Em tính: {nums[0]} + {nums[1]} = {correct_num}."
    
    if "+" in question and "=" in question:
        nums = [int(n) for n in numbers[:2]] if len(numbers) >= 2 else []
        if nums:
            return f"{nums[0]} + {nums[1]} = {correct_answer}. Em có thể đếm: bắt đầu từ {nums[0]}, thêm {nums[1]} nữa là {correct_answer}."
    
    # Type 6: Subtraction - "X - Y = ?" or subtraction word problems
    if "-" in question and "=" in question:
        nums = [int(n) for n in numbers[:2]] if len(numbers) >= 2 else []
        if nums:
            return f"{nums[0]} - {nums[1]} = {correct_answer}. Em bắt đầu từ {nums[0]} và đếm ngược {nums[1]}: {generate_countdown_sequence(nums[0], nums[1])}."
    
    # Type 7: Meaning of zero - "Có 0 quả... Điều này có nghĩa là gì?"
    if "0" in question and "có nghĩa là gì" in question_lower:
        return f"Có 0 có nghĩa là không có gì cả. Số 0 dùng để chỉ khi không có gì cả."
    
    # Type 8: Geometry questions - Shapes
    if "hình nào" in question_lower or "hình" in question_lower:
        if "hình chữ nhật" in correct_answer.lower():
            if "4 cạnh" in question_lower and "2 cạnh dài" in question_lower:
                return "Hình chữ nhật có 4 cạnh, trong đó 2 cạnh dài bằng nhau và 2 cạnh ngắn bằng nhau."
            elif "4 cạnh" in question_lower:
                return "Hình chữ nhật có 4 cạnh và 4 góc vuông."
        elif "hình vuông" in correct_answer.lower():
            if "4 cạnh bằng nhau" in question_lower or "4 góc vuông" in question_lower:
                return "Hình vuông có 4 cạnh bằng nhau và 4 góc vuông. Tất cả các cạnh đều dài bằng nhau."
            elif "mấy cạnh" in question_lower:
                return "Hình vuông có 4 cạnh. Tất cả 4 cạnh đều bằng nhau."
            elif "dạng khối" in question_lower or "khối" in correct_answer.lower():
                return "Khối lập phương là một hình khối 3 chiều, có 6 mặt đều là hình vuông."
        elif "hình tam giác" in correct_answer.lower():
            if "3 cạnh" in question_lower:
                return "Hình tam giác có 3 cạnh và 3 góc."
            elif "mấy cạnh" in question_lower:
                return "Hình tam giác có 3 cạnh."
        elif "hình tròn" in correct_answer.lower():
            return "Hình tròn là hình không có cạnh, có dạng tròn và có thể lăn được."
    
    # Type 8b: Number of sides/edges questions
    if "mấy cạnh" in question_lower or "có mấy cạnh" in question_lower:
        if correct_answer.isdigit():
            num = int(correct_answer)
            if "hình vuông" in question_lower:
                return f"Hình vuông có {num} cạnh. Tất cả {num} cạnh đều bằng nhau."
            elif "hình tam giác" in question_lower:
                return f"Hình tam giác có {num} cạnh."
            elif "hình chữ nhật" in question_lower:
                return f"Hình chữ nhật có {num} cạnh."
            else:
                return f"Hình này có {num} cạnh."
    
    # Type 8c: "Hình nào có dạng khối?"
    if "dạng khối" in question_lower or ("hình nào" in question_lower and "khối" in question_lower):
        if "khối lập phương" in correct_answer.lower():
            return "Khối lập phương là hình có dạng khối 3 chiều, có 6 mặt đều là hình vuông."
        elif "khối" in correct_answer.lower():
            return f"{correct_answer} là hình có dạng khối 3 chiều."
    
    # Type 8d: "Hình nào KHÔNG có góc?"
    if "không có góc" in question_lower or "không có cạnh" in question_lower:
        if "hình tròn" in correct_answer.lower():
            return "Hình tròn là hình không có góc và không có cạnh, có dạng tròn và có thể lăn được."
    
    # Type 8i: "có góc không?" - Yes/No questions
    if "có góc không" in question_lower:
        if "không" in correct_answer.lower():
            if "hình tròn" in question_lower:
                return "Hình tròn không có góc vì hình tròn là hình cong, không có các cạnh thẳng tạo thành góc."
        elif "có" in correct_answer.lower():
            shape_match = re.search(r'hình\s+(\w+)', question_lower)
            if shape_match:
                shape = shape_match.group(1)
                return f"Hình {shape} có góc vì hình {shape} có các cạnh thẳng tạo thành các góc."
    
    # Type 8e: "Hình nào có dạng tròn, không có góc?"
    if "dạng tròn" in question_lower and "không có góc" in question_lower:
        if "hình tròn" in correct_answer.lower():
            return "Hình tròn là hình có dạng tròn, không có góc và không có cạnh, có thể lăn được."
    
    # Type 8f: "giống nhau ở điểm nào" - Comparison of shapes
    if "giống nhau" in question_lower and "điểm nào" in question_lower:
        if "6 mặt" in correct_answer.lower():
            return "Khối lập phương và khối hộp chữ nhật đều có 6 mặt. Đây là điểm giống nhau của chúng."
        elif "4 cạnh" in correct_answer.lower():
            return "Hai hình này đều có 4 cạnh, đây là điểm giống nhau của chúng."
        elif "góc vuông" in correct_answer.lower():
            return "Hai hình này đều có góc vuông, đây là điểm giống nhau của chúng."
    
    # Type 8j: "khác... ở điểm nào" - Difference between shapes
    if "khác" in question_lower and "ở điểm nào" in question_lower:
        if "khối lập phương" in question_lower and "khối hộp chữ nhật" in question_lower:
            if "hình vuông" in correct_answer.lower() and "hình chữ nhật" in correct_answer.lower():
                return "Khối lập phương khác khối hộp chữ nhật ở điểm: khối lập phương có tất cả các mặt đều là hình vuông, còn khối hộp chữ nhật có các mặt là hình chữ nhật hoặc hình vuông."
        elif "hình tam giác" in question_lower and "hình vuông" in question_lower:
            if "3 cạnh" in correct_answer.lower() and "4 cạnh" in correct_answer.lower():
                return "Hình tam giác khác hình vuông ở điểm: hình tam giác có 3 cạnh, còn hình vuông có 4 cạnh. Đây là sự khác biệt chính giữa hai hình."
    
    # Type 8l: "Em có thể dùng hình X để xếp thành hình gì?" - Shape composition
    if "em có thể dùng hình" in question_lower and "xếp thành hình gì" in question_lower:
        if "nhiều hình khác nhau" in correct_answer.lower():
            if "hình tam giác" in question_lower:
                return "Em có thể dùng nhiều hình tam giác để xếp thành nhiều hình khác nhau như hình vuông, hình chữ nhật, hình thoi, v.v. Hình tam giác rất linh hoạt trong việc xếp hình."
            elif "hình vuông" in question_lower:
                return "Em có thể dùng nhiều hình vuông để xếp thành nhiều hình khác nhau như hình chữ nhật, hình thoi, các hình phức tạp hơn. Hình vuông rất linh hoạt trong việc xếp hình."
        elif "hình chữ nhật" in correct_answer.lower():
            if "hình vuông" in question_lower:
                return "Em có thể dùng nhiều hình vuông để xếp thành hình chữ nhật. Bằng cách đặt các hình vuông cạnh nhau, em có thể tạo ra hình chữ nhật."
            elif "hình tam giác" in question_lower:
                return "Em có thể dùng nhiều hình tam giác để xếp thành hình chữ nhật. Bằng cách ghép các hình tam giác lại với nhau, em có thể tạo ra hình chữ nhật."
    
    # Type 8g: "các mặt như thế nào" - Describe faces
    if "các mặt như thế nào" in question_lower or "mặt như thế nào" in question_lower:
        if "hình vuông" in correct_answer.lower():
            return "Tất cả các mặt của khối lập phương đều là hình vuông bằng nhau."
        elif "hình chữ nhật" in correct_answer.lower():
            return "Các mặt của khối hộp chữ nhật là hình chữ nhật hoặc hình vuông."
    
    # Type 8k: "có tất cả các mặt là hình gì?" - What shape are all faces?
    if "có tất cả các mặt là hình gì" in question_lower or "tất cả các mặt là hình gì" in question_lower:
        if "hình vuông" in correct_answer.lower():
            return "Khối lập phương có tất cả các mặt đều là hình vuông. Tất cả 6 mặt của khối lập phương đều là hình vuông bằng nhau."
        elif "hình chữ nhật" in correct_answer.lower():
            return "Khối hộp chữ nhật có các mặt là hình chữ nhật hoặc hình vuông."
    
    # Type 8h: "Hình nào có 4 cạnh bằng nhau và 4 góc vuông?"
    if "4 cạnh bằng nhau" in question_lower and "4 góc vuông" in question_lower:
        if "hình vuông" in correct_answer.lower():
            return "Hình vuông có 4 cạnh bằng nhau và 4 góc vuông. Tất cả các cạnh đều dài bằng nhau."
    
    # Type 9: 3D shapes - "Khối lập phương", "Khối hộp chữ nhật"
    if "khối" in question_lower:
        if "lập phương" in question_lower:
            if "mấy mặt" in question_lower or "có mấy mặt" in question_lower:
                return "Khối lập phương có 6 mặt, tất cả các mặt đều là hình vuông bằng nhau."
            elif "lăn được" in question_lower:
                if "không" in correct_answer.lower():
                    return "Khối lập phương không thể lăn được vì các mặt của nó phẳng, không tròn."
        elif "hộp chữ nhật" in question_lower:
            if "mấy mặt" in question_lower or "có mấy mặt" in question_lower:
                return "Khối hộp chữ nhật có 6 mặt, các mặt là hình chữ nhật."
            elif "lăn được" in question_lower:
                if "không" in correct_answer.lower():
                    return "Khối hộp chữ nhật không thể lăn được vì các mặt của nó phẳng, không tròn."
            elif "giống nhau" in question_lower:
                if "6 mặt" in correct_answer.lower():
                    return "Khối lập phương và khối hộp chữ nhật đều có 6 mặt. Đây là điểm giống nhau của chúng."
        elif "các mặt" in question_lower:
            if "hình vuông" in correct_answer.lower():
                return "Tất cả các mặt của khối lập phương đều là hình vuông bằng nhau."
            elif "hình chữ nhật" in correct_answer.lower():
                return "Các mặt của khối hộp chữ nhật là hình chữ nhật hoặc hình vuông."
    
    # Type 10: Position questions - "ở phía nào", "Sau", "Phải", "Trái", "Trước", "Trên", "Dưới"
    if "ở phía nào" in question_lower or "bên nào" in question_lower:
        if "sau" in correct_answer.lower():
            return "Sau có nghĩa là ở phía sau, đằng sau một vật nào đó."
        elif "phải" in correct_answer.lower():
            return "Phải có nghĩa là ở bên phải, bên tay phải của mình."
        elif "trái" in correct_answer.lower():
            return "Trái có nghĩa là ở bên trái, bên tay trái của mình."
        elif "trước" in correct_answer.lower():
            return "Trước có nghĩa là ở phía trước, đằng trước một vật nào đó."
        elif "trên" in correct_answer.lower():
            return "Trên có nghĩa là ở phía trên, cao hơn một vật nào đó."
        elif "dưới" in correct_answer.lower():
            return "Dưới có nghĩa là ở phía dưới, thấp hơn một vật nào đó."
    
    # Type 11c: "Hình nào ở giữa ba hình?" (Check this FIRST - more specific)
    if "hình nào" in question_lower and "ở giữa" in question_lower and "ba hình" in question_lower:
        if "thứ" in correct_answer.lower():
            return f"{correct_answer} là hình ở vị trí giữa trong ba hình. Em đếm từ trái sang phải: hình thứ nhất, {correct_answer}, hình thứ ba. {correct_answer} là hình ở giữa."
    
    # Type 11: Sequence position - "Hình nào ở cuối cùng", "Hình thứ..."
    if "hình nào" in question_lower and ("cuối cùng" in question_lower or "đầu tiên" in question_lower or "thứ" in question_lower):
        if "cuối cùng" in question_lower:
            return f"{correct_answer} là hình ở vị trí cuối cùng trong dãy. Em đếm từ trái sang phải, hình cuối cùng là hình ở vị trí cuối cùng."
        elif "đầu tiên" in question_lower:
            return f"{correct_answer} là hình ở vị trí đầu tiên trong dãy. Em đếm từ trái sang phải, hình đầu tiên là hình ở vị trí đầu tiên."
        elif "thứ" in correct_answer.lower() or "thứ nhất" in correct_answer.lower() or "thứ hai" in correct_answer.lower():
            return f"{correct_answer} là vị trí của hình trong dãy. Em đếm từ trái sang phải để xác định vị trí của hình."
    
    # Type 12: Subtraction word problems - "Có X..., bay đi mất Y... Hỏi còn lại mấy...?"
    if "bay đi" in question_lower or "mất" in question_lower or "còn lại" in question_lower:
        nums = [int(n) for n in numbers[:2]] if len(numbers) >= 2 else []
        if nums:
            result = nums[0] - nums[1]
            return f"Có {nums[0]}, bay đi mất {nums[1]} còn lại {correct_answer}. Em tính: {nums[0]} - {nums[1]} = {correct_answer}."
    
    # Type 13: Odd/Even numbers - "Số lẻ", "Số chẵn"
    if "số lẻ" in question_lower or "số chẵn" in question_lower:
        if "số lẻ" in correct_answer.lower() or any(int(n) % 2 == 1 for n in numbers if numbers):
            return "Số lẻ là các số: 1, 3, 5, 7, 9... (các số không chia hết cho 2)."
        elif "số chẵn" in correct_answer.lower() or any(int(n) % 2 == 0 for n in numbers if numbers):
            return "Số chẵn là các số: 0, 2, 4, 6, 8, 10... (các số chia hết cho 2)."
    
    # Default fallback - try to be more helpful
    # Check if it's a simple answer that can be explained
    if len(correct_answer) < 20 and not any(char in correct_answer for char in ['<', '>', '=']):
        # Try to extract context from question
        if any(word in question_lower for word in ['có', 'là', 'mấy', 'nào']):
            return f"Đáp án đúng là {correct_answer}. Em hãy đọc kỹ câu hỏi và chọn đáp án phù hợp nhất."
    
    # Final fallback
    return f"Đáp án đúng là {correct_answer}."

def extract_object(question):
    """Extract object name from question (e.g., 'quả táo', 'con chim')"""
    patterns = [
        r'(\d+)\s+(quả\s+\w+|con\s+\w+|cái\s+\w+|bông\s+\w+|ngôi\s+\w+)',
        r'có\s+(\d+)\s+(quả\s+\w+|con\s+\w+|cái\s+\w+|bông\s+\w+|ngôi\s+\w+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, question, re.IGNORECASE)
        if match:
            return match.group(2) if len(match.groups()) > 1 else match.group(1)
    return "đồ vật"

def extract_numbers_from_text(text):
    """Extract all numbers from text and return as string"""
    numbers = re.findall(r'\d+', text)
    return ", ".join(numbers)

def generate_counting_sequence(n):
    """Generate counting sequence up to n (e.g., '1, 2, 3' for n=3)"""
    if n <= 0:
        return "0"
    return ", ".join(str(i) for i in range(1, n + 1))

def generate_number_sequence(start, end):
    """Generate number sequence between start and end"""
    if start < end:
        return ", ".join(str(i) for i in range(start, end + 1))
    else:
        return ", ".join(str(i) for i in range(end, start + 1))

def generate_comparison_chain(numbers_str, order='asc'):
    """Generate comparison chain (e.g., '5 > 4 > 3 > 2')"""
    numbers = [int(n.strip()) for n in numbers_str.split(',')]
    numbers.sort(reverse=(order == 'desc'))
    if len(numbers) < 2:
        return ""
    comparisons = [f"{numbers[i]} {'>' if order == 'desc' else '<'} {numbers[i+1]}" for i in range(len(numbers)-1)]
    return " > ".join(comparisons) if order == 'desc' else " < ".join(comparisons)

def generate_countdown_sequence(start, steps):
    """Generate countdown sequence (e.g., '8, 7, 6, 5' for start=8, steps=3)"""
    result = start - steps
    sequence = [str(i) for i in range(start, result - 1, -1)]
    return ", ".join(sequence)

def process_file(file_path):
    """Process a single JSON file and add explanations"""
    print(f"Processing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated = False
    for lesson in data.get('lessons', []):
        for question in lesson.get('questions', []):
            current_explanation = question.get('explanation', '').strip()
            # Force update if explanation is empty, too short, or is a fallback
            needs_update = (
                not current_explanation or 
                current_explanation == '' or
                current_explanation.startswith('Đáp án đúng là') or
                len(current_explanation) < 30
            )
            
            if needs_update:
                explanation = generate_explanation(
                    question['question'],
                    question['options'],
                    question['correctAnswer']
                )
                # Only update if new explanation is better (longer than current or not a fallback)
                if explanation and (not explanation.startswith('Đáp án đúng là') or not current_explanation):
                    question['explanation'] = explanation
                    updated = True
                    action = "Updated" if current_explanation else "Added"
                    print(f"  {action} explanation for {question['id']}: {explanation[:50]}...")
    
    if updated:
        # Write back to file with proper formatting
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"  [OK] Updated {file_path}")
    else:
        print(f"  [SKIP] No updates needed for {file_path}")
    
    return updated

def main():
    """Main function to process all week JSON files"""
    base_dir = Path(__file__).parent.parent
    math_dir = base_dir / 'public' / 'data' / 'questions' / 'ket-noi-tri-thuc' / 'grade-1' / 'math'
    
    if not math_dir.exists():
        print(f"Error: Directory not found: {math_dir}")
        return
    
    week_files = sorted(math_dir.glob('week-*.json'))
    print(f"Found {len(week_files)} week files")
    
    updated_count = 0
    for week_file in week_files:
        if process_file(week_file):
            updated_count += 1
    
    print(f"\n[COMPLETE] Completed! Updated {updated_count} files.")

if __name__ == '__main__':
    main()

