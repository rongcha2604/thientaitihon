#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script export album items từ seed file thành JSON cho frontend
"""

import json
import sys
from pathlib import Path

# Fix encoding cho Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Album items từ seed file (copy từ backend/prisma/seed-album-items.ts)
album_items = [
    {"name": "Trạng Tí", "category": "character", "image": "🧒", "price": 20, "description": "Nhân vật Trạng Tí thông minh", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Thằng Bờm", "category": "character", "image": "👦", "price": 20, "description": "Nhân vật Thằng Bờm vui vẻ", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Chị Hằng", "category": "character", "image": "👧", "price": 25, "description": "Nhân vật Chị Hằng xinh đẹp", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Anh Cuội", "category": "character", "image": "👨", "price": 25, "description": "Nhân vật Anh Cuội trên cung trăng", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Bà Ngoại", "category": "character", "image": "👵", "price": 30, "description": "Bà Ngoại hiền từ", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Ông Ngoại", "category": "character", "image": "👴", "price": 30, "description": "Ông Ngoại thông thái", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Cô Giáo", "category": "character", "image": "👩‍🏫", "price": 25, "description": "Cô giáo dạy học", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Bác Sĩ", "category": "character", "image": "👨‍⚕️", "price": 25, "description": "Bác sĩ chữa bệnh", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Bạn Thân", "category": "character", "image": "👫", "price": 22, "description": "Đôi bạn thân", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Anh Trai", "category": "character", "image": "👨‍🦱", "price": 23, "description": "Anh trai lớn", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Chị Gái", "category": "character", "image": "👩", "price": 23, "description": "Chị gái xinh", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Em Bé", "category": "character", "image": "👶", "price": 20, "description": "Em bé dễ thương", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Bạn Học", "category": "character", "image": "🧑‍🎓", "price": 22, "description": "Bạn học cùng lớp", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Cô Bán Hàng", "category": "character", "image": "👩‍💼", "price": 24, "description": "Cô bán hàng rong", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Chú Công Nhân", "category": "character", "image": "👷", "price": 24, "description": "Chú công nhân chăm chỉ", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Bác Nông Dân", "category": "character", "image": "🧑‍🌾", "price": 26, "description": "Bác nông dân trồng lúa", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Cô Y Tá", "category": "character", "image": "👩‍⚕️", "price": 25, "description": "Cô y tá chăm sóc", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Chú Cảnh Sát", "category": "character", "image": "👮", "price": 27, "description": "Chú cảnh sát bảo vệ", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Bạn Nhỏ", "category": "character", "image": "🧒", "price": 21, "description": "Bạn nhỏ vui vẻ", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Thầy Giáo", "category": "character", "image": "👨‍🏫", "price": 28, "description": "Thầy giáo dạy học", "unlockType": "coins", "unlockCondition": None, "downloadable": False, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Nón Lá", "category": "accessory", "image": "👒", "price": 15, "description": "Nón lá Việt Nam", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Quạt Mo", "category": "accessory", "image": "🍃", "price": 15, "description": "Quạt mo cọ", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khăn Rằn", "category": "accessory", "image": "🧣", "price": 20, "description": "Khăn rằn Nam Bộ", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Áo Dài", "category": "accessory", "image": "👗", "price": 25, "description": "Áo dài truyền thống", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Nón Cối", "category": "accessory", "image": "🪖", "price": 18, "description": "Nón cối bảo vệ", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Kính Mát", "category": "accessory", "image": "🕶️", "price": 16, "description": "Kính mát thời trang", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Túi Xách", "category": "accessory", "image": "👜", "price": 20, "description": "Túi xách đẹp", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Vòng Cổ", "category": "accessory", "image": "📿", "price": 17, "description": "Vòng cổ trang sức", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Vòng Tay", "category": "accessory", "image": "📿", "price": 16, "description": "Vòng tay đẹp", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Cặp Sách", "category": "accessory", "image": "🎒", "price": 22, "description": "Cặp sách học sinh", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Mũ Lưỡi Trai", "category": "accessory", "image": "🧢", "price": 15, "description": "Mũ lưỡi trai", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khăn Quàng", "category": "accessory", "image": "🧣", "price": 18, "description": "Khăn quàng đỏ", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Giày Dép", "category": "accessory", "image": "👟", "price": 19, "description": "Giày dép đi học", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Ô Dù", "category": "accessory", "image": "☂️", "price": 17, "description": "Ô dù che mưa", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Balo", "category": "accessory", "image": "🎒", "price": 21, "description": "Balo đi học", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Mũ Bảo Hiểm", "category": "accessory", "image": "⛑️", "price": 23, "description": "Mũ bảo hiểm an toàn", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Găng Tay", "category": "accessory", "image": "🧤", "price": 16, "description": "Găng tay ấm", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Tất Chân", "category": "accessory", "image": "🧦", "price": 14, "description": "Tất chân ấm", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Kính Đeo Mắt", "category": "accessory", "image": "👓", "price": 18, "description": "Kính đeo mắt", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Đồng Hồ", "category": "accessory", "image": "⌚", "price": 24, "description": "Đồng hồ xem giờ", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Cửa Sổ", "category": "frame", "image": "🖼️", "price": 10, "description": "Khung cửa sổ đẹp", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Làng Quê", "category": "frame", "image": "🏞️", "price": 15, "description": "Khung cảnh làng quê", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Phố Cổ", "category": "frame", "image": "🏛️", "price": 20, "description": "Khung cảnh phố cổ", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Biển", "category": "frame", "image": "🌊", "price": 18, "description": "Khung cảnh biển", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Núi", "category": "frame", "image": "⛰️", "price": 17, "description": "Khung cảnh núi", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Đồng Lúa", "category": "frame", "image": "🌾", "price": 16, "description": "Khung cảnh đồng lúa", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Cầu", "category": "frame", "image": "🌉", "price": 19, "description": "Khung cảnh cầu", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Chùa", "category": "frame", "image": "⛩️", "price": 20, "description": "Khung cảnh chùa", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Nhà", "category": "frame", "image": "🏠", "price": 12, "description": "Khung cảnh nhà", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Trường Học", "category": "frame", "image": "🏫", "price": 14, "description": "Khung cảnh trường học", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Công Viên", "category": "frame", "image": "🌳", "price": 13, "description": "Khung cảnh công viên", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Sông", "category": "frame", "image": "🌊", "price": 15, "description": "Khung cảnh sông", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Rừng", "category": "frame", "image": "🌲", "price": 16, "description": "Khung cảnh rừng", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Thành Phố", "category": "frame", "image": "🏙️", "price": 18, "description": "Khung cảnh thành phố", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Chợ", "category": "frame", "image": "🏪", "price": 17, "description": "Khung cảnh chợ", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Vườn", "category": "frame", "image": "🌻", "price": 14, "description": "Khung cảnh vườn", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Hoàng Hôn", "category": "frame", "image": "🌅", "price": 19, "description": "Khung cảnh hoàng hôn", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Bình Minh", "category": "frame", "image": "🌄", "price": 19, "description": "Khung cảnh bình minh", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Trăng", "category": "frame", "image": "🌙", "price": 20, "description": "Khung cảnh trăng", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Khung Sao", "category": "frame", "image": "⭐", "price": 18, "description": "Khung cảnh sao", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Đèn Lồng", "category": "sticker", "image": "🏮", "price": 5, "description": "Đèn lồng đỏ", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Diều Giấy", "category": "sticker", "image": "🪁", "price": 10, "description": "Diều giấy bay", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Mặt Nạ", "category": "sticker", "image": "🎭", "price": 10, "description": "Mặt nạ vui", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Trống", "category": "sticker", "image": "🥁", "price": 15, "description": "Trống đánh", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Kèn", "category": "sticker", "image": "🎺", "price": 12, "description": "Kèn thổi", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Đàn", "category": "sticker", "image": "🎸", "price": 14, "description": "Đàn ghi-ta", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Bóng Bay", "category": "sticker", "image": "🎈", "price": 6, "description": "Bóng bay đẹp", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Xe Đạp", "category": "sticker", "image": "🚲", "price": 13, "description": "Xe đạp đi chơi", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Máy Bay", "category": "sticker", "image": "✈️", "price": 15, "description": "Máy bay bay", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Tàu Thủy", "category": "sticker", "image": "🚢", "price": 14, "description": "Tàu thủy", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Xe Hơi", "category": "sticker", "image": "🚗", "price": 12, "description": "Xe hơi đẹp", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Búp Bê", "category": "sticker", "image": "🎎", "price": 11, "description": "Búp bê dễ thương", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Gấu Bông", "category": "sticker", "image": "🧸", "price": 13, "description": "Gấu bông mềm", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Xe Lửa", "category": "sticker", "image": "🚂", "price": 14, "description": "Xe lửa chạy", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Bánh Chưng", "category": "sticker", "image": "🍙", "price": 8, "description": "Bánh chưng Tết", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Bánh Dày", "category": "sticker", "image": "🍘", "price": 8, "description": "Bánh dày", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Hoa Đào", "category": "sticker", "image": "🌸", "price": 7, "description": "Hoa đào Tết", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Hoa Mai", "category": "sticker", "image": "🌺", "price": 7, "description": "Hoa mai vàng", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Cờ Tổ Quốc", "category": "sticker", "image": "🇻🇳", "price": 10, "description": "Cờ Tổ quốc", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Sao Vàng", "category": "sticker", "image": "⭐", "price": 9, "description": "Sao vàng năm cánh", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
    {"name": "Bánh Xe", "category": "sticker", "image": "🎡", "price": 12, "description": "Bánh xe quay", "unlockType": "coins", "unlockCondition": None, "downloadable": True, "imageFile": None, "downloadFile": None, "isActive": True},
]

def remove_vietnamese_accents(text):
    """Remove Vietnamese accents để match với tên file"""
    # Mapping đầy đủ các ký tự có dấu
    vietnamese_map = {
        'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
        'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
        'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
        'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
        'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
        'đ': 'd',
    }
    
    result = ''
    for char in text.lower():
        result += vietnamese_map.get(char, char)
    return result

def generate_image_file_path(item):
    """Generate image file path từ tên và category"""
    # Convert tên thành slug (lowercase, remove dấu, thay dấu cách bằng dấu gạch ngang)
    name_no_accents = remove_vietnamese_accents(item["name"])
    name_slug = name_no_accents.replace(" ", "-")
    
    # Map category to folder name (plural)
    category_folders = {
        "character": "characters",
        "accessory": "accessories",
        "frame": "frames",
        "sticker": "stickers"
    }
    folder = category_folders.get(item["category"], item["category"] + "s")
    
    # Format: {category}-{name-slug}.png
    filename = f"{item['category']}-{name_slug}.png"
    return f"/uploads/album/{folder}/{filename}"

def main():
    """Export album items thành JSON"""
    output_file = Path("public/data/album-items.json")
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Check ảnh có tồn tại không và generate imageFile path
    images_dir = Path("public/uploads/album")
    
    items_with_images = []
    for i, item in enumerate(album_items, 1):
        # Generate ID
        item_id = f"album-item-{i:03d}"
        
        # Check ảnh có tồn tại không
        image_file_path = generate_image_file_path(item)
        image_file_relative = image_file_path.lstrip("/")
        image_file_full_path = Path("public") / image_file_relative
        
        # Nếu ảnh tồn tại, dùng imageFile, nếu không dùng emoji
        if image_file_full_path.exists():
            image_file = image_file_path
        else:
            image_file = None
        
        # Format item cho frontend
        formatted_item = {
            "id": item_id,
            "name": item["name"],
            "category": item["category"],
            "image": item["image"],  # Emoji fallback
            "imageFile": image_file,  # Path ảnh nếu có
            "price": item["price"],
            "description": item["description"],
            "isActive": item["isActive"],
            "owned": False,  # Default: chưa sở hữu
        }
        
        items_with_images.append(formatted_item)
    
    # Write JSON
    output_data = {
        "items": items_with_images
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Đã export {len(items_with_images)} album items vào: {output_file}")
    print(f"📊 Thống kê:")
    
    # Count by category
    by_category = {}
    with_images = 0
    without_images = 0
    
    for item in items_with_images:
        cat = item["category"]
        by_category[cat] = by_category.get(cat, 0) + 1
        if item["imageFile"]:
            with_images += 1
        else:
            without_images += 1
    
    for cat, count in sorted(by_category.items()):
        print(f"   - {cat}: {count} items")
    
    print(f"   - Có ảnh: {with_images} items")
    print(f"   - Chưa có ảnh (dùng emoji): {without_images} items")

if __name__ == "__main__":
    main()

