"""
Script để generate placeholder icons cho PWA
Tạo icons đơn giản với text "TT" (Thiên Tài) và màu theme
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """Tạo icon với kích thước size x size"""
    # Tạo image mới với nền màu amber (#F59E0B)
    img = Image.new('RGB', (size, size), color='#F59E0B')
    draw = ImageDraw.Draw(img)
    
    # Vẽ border tròn (optional)
    margin = size // 20  # 5% margin
    draw.ellipse(
        [margin, margin, size - margin, size - margin],
        fill='#F59E0B',
        outline='#D97706',
        width=max(2, size // 100)
    )
    
    # Thêm text "TT" hoặc emoji
    text = "TT"
    font_size = size // 2
    
    try:
        # Thử dùng font system (Windows)
        if os.name == 'nt':
            font_path = "C:/Windows/Fonts/arial.ttf"
            if os.path.exists(font_path):
                font = ImageFont.truetype(font_path, font_size)
            else:
                font = ImageFont.load_default()
        else:
            # Linux/Mac
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    # Tính toán vị trí text (center)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size - text_width) // 2, (size - text_height) // 2)
    
    # Vẽ text màu trắng
    draw.text(position, text, fill='white', font=font)
    
    # Lưu file
    img.save(output_path, 'PNG')
    print(f"✅ Đã tạo icon: {output_path} ({size}x{size})")

def main():
    """Main function"""
    # Tạo thư mục icons nếu chưa có
    icons_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
    os.makedirs(icons_dir, exist_ok=True)
    
    # Tạo 2 icons
    icon_192_path = os.path.join(icons_dir, 'icon-192x192.png')
    icon_512_path = os.path.join(icons_dir, 'icon-512x512.png')
    
    print("🎨 Đang tạo icons cho PWA...")
    print("=" * 50)
    
    create_icon(192, icon_192_path)
    create_icon(512, icon_512_path)
    
    print("=" * 50)
    print("✅ Hoàn thành! Icons đã được tạo trong public/icons/")
    print("")
    print("📝 Lưu ý:")
    print("   - Đây là placeholder icons đơn giản")
    print("   - Bạn có thể thay thế bằng logo/icon đẹp hơn sau")
    print("   - Test PWA: Chrome DevTools → Application → Manifest")

if __name__ == '__main__':
    try:
        main()
    except ImportError:
        print("❌ Lỗi: Cần cài đặt Pillow library")
        print("   Chạy: pip install Pillow")
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        print("   Vui lòng kiểm tra lại hoặc tạo icons thủ công")

