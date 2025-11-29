import json
import sys
from pathlib import Path
from collections import defaultdict

# Fix encoding for Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def load_errors():
    """Load validation errors from file"""
    try:
        with open('validation_errors.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def analyze_errors():
    """Analyze and categorize errors"""
    errors = load_errors()
    
    if not errors:
        print("No validation errors file found. Run validation first.")
        return
    
    # Group by file and error type
    by_file = defaultdict(lambda: {'missing_field': [], 'mismatch': [], 'index_out_of_range': [], 'other': []})
    
    for error in errors:
        file_path = error['file']
        error_type = error['type']
        
        if error_type in by_file[file_path]:
            by_file[file_path][error_type].append(error)
        else:
            by_file[file_path]['other'].append(error)
    
    # Generate report
    print("="*80)
    print("CHI TIẾT CÁC CÂU HỎI ĐÃ SỬA")
    print("="*80)
    print()
    
    total_fixed = 0
    
    for file_path in sorted(by_file.keys()):
        file_errors = by_file[file_path]
        file_total = sum(len(errs) for errs in file_errors.values())
        
        if file_total == 0:
            continue
        
        total_fixed += file_total
        
        # Extract file name
        file_name = Path(file_path).name
        grade = Path(file_path).parent.name
        
        print(f"📁 {grade}/{file_name}")
        print(f"   Tổng số lỗi đã sửa: {file_total}")
        print()
        
        # Missing answer_index (format cũ)
        if file_errors['missing_field']:
            print(f"   ❌ Thiếu field 'answer_index' ({len(file_errors['missing_field'])} câu):")
            for i, err in enumerate(file_errors['missing_field'][:10], 1):  # Show first 10
                q_id = err.get('question_id', 'unknown')
                print(f"      {i}. Question ID: {q_id}")
            if len(file_errors['missing_field']) > 10:
                print(f"      ... và {len(file_errors['missing_field']) - 10} câu khác")
            print()
        
        # Mismatch errors
        if file_errors['mismatch']:
            print(f"   ⚠️  Mismatch answer_index và answer_text ({len(file_errors['mismatch'])} câu):")
            for i, err in enumerate(file_errors['mismatch'][:20], 1):  # Show first 20
                q_id = err.get('question_id', 'unknown')
                expected = err.get('expected', 'N/A')
                actual = err.get('actual', 'N/A')
                print(f"      {i}. Question ID: {q_id}")
                print(f"         - answer_index trỏ đến: '{expected}'")
                print(f"         - answer_text hiện tại: '{actual}'")
                print(f"         → Đã sửa answer_text thành: '{expected}'")
            if len(file_errors['mismatch']) > 20:
                print(f"      ... và {len(file_errors['mismatch']) - 20} câu khác")
            print()
        
        # Index out of range
        if file_errors['index_out_of_range']:
            print(f"   ⚠️  answer_index ngoài phạm vi ({len(file_errors['index_out_of_range'])} câu):")
            for i, err in enumerate(file_errors['index_out_of_range'][:10], 1):
                q_id = err.get('question_id', 'unknown')
                msg = err.get('message', '')
                print(f"      {i}. Question ID: {q_id} - {msg}")
            if len(file_errors['index_out_of_range']) > 10:
                print(f"      ... và {len(file_errors['index_out_of_range']) - 10} câu khác")
            print()
        
        print("-" * 80)
        print()
    
    print("="*80)
    print(f"TỔNG KẾT: Đã sửa {total_fixed} câu hỏi trong {len(by_file)} files")
    print("="*80)
    
    # Save detailed report to file
    report_file = 'fix_report_detailed.txt'
    with open(report_file, 'w', encoding='utf-8') as f:
        # Redirect output to file (simplified version)
        f.write("CHI TIẾT CÁC CÂU HỎI ĐÃ SỬA\n")
        f.write("="*80 + "\n\n")
        f.write(f"Tổng số lỗi: {len(errors)}\n")
        f.write(f"Số files có lỗi: {len(by_file)}\n\n")
        
        for file_path in sorted(by_file.keys()):
            file_errors = by_file[file_path]
            file_name = Path(file_path).name
            f.write(f"{file_name}:\n")
            
            for error_type, errs in file_errors.items():
                if errs:
                    f.write(f"  {error_type}: {len(errs)} lỗi\n")
                    for err in errs[:5]:  # First 5 examples
                        f.write(f"    - {err.get('question_id', 'unknown')}: {err.get('message', '')}\n")
                    if len(errs) > 5:
                        f.write(f"    ... và {len(errs) - 5} lỗi khác\n")
            f.write("\n")
    
    print(f"\n✅ Báo cáo chi tiết đã được lưu vào: {report_file}")

if __name__ == "__main__":
    analyze_errors()

