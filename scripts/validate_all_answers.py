import json
import os
from pathlib import Path
from typing import List, Dict, Any

def validate_question(question: Dict[str, Any], file_path: str, question_num: int) -> List[Dict[str, Any]]:
    """Validate a single question and return list of errors"""
    errors = []
    q_id = question.get('id', f'Q{question_num}')
    
    # Check required fields
    if 'options' not in question:
        errors.append({
            'type': 'missing_field',
            'question_id': q_id,
            'file': file_path,
            'message': 'Missing "options" field'
        })
        return errors
    
    if 'answer_index' not in question:
        errors.append({
            'type': 'missing_field',
            'question_id': q_id,
            'file': file_path,
            'message': 'Missing "answer_index" field'
        })
        return errors
    
    if 'answer_text' not in question:
        errors.append({
            'type': 'missing_field',
            'question_id': q_id,
            'file': file_path,
            'message': 'Missing "answer_text" field'
        })
        return errors
    
    options = question['options']
    answer_index = question['answer_index']
    answer_text = question['answer_text']
    
    # Check answer_index is valid
    if not isinstance(answer_index, int):
        errors.append({
            'type': 'invalid_type',
            'question_id': q_id,
            'file': file_path,
            'message': f'answer_index must be integer, got {type(answer_index).__name__}'
        })
        return errors
    
    if answer_index < 0 or answer_index >= len(options):
        errors.append({
            'type': 'index_out_of_range',
            'question_id': q_id,
            'file': file_path,
            'message': f'answer_index {answer_index} is out of range [0, {len(options)-1}]'
        })
        return errors
    
    # Check answer_index matches answer_text
    correct_answer = options[answer_index]
    if correct_answer != answer_text:
        errors.append({
            'type': 'mismatch',
            'question_id': q_id,
            'file': file_path,
            'message': f'answer_index {answer_index} points to "{correct_answer}" but answer_text is "{answer_text}"',
            'expected': correct_answer,
            'actual': answer_text
        })
    
    return errors

def validate_file(file_path: str) -> List[Dict[str, Any]]:
    """Validate a single JSON file"""
    all_errors = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if 'topics' not in data:
            all_errors.append({
                'type': 'file_structure',
                'file': file_path,
                'message': 'Missing "topics" field'
            })
            return all_errors
        
        for topic_idx, topic in enumerate(data.get('topics', [])):
            if 'questions' not in topic:
                continue
            
            for q_idx, question in enumerate(topic['questions']):
                errors = validate_question(question, file_path, q_idx + 1)
                all_errors.extend(errors)
    
    except json.JSONDecodeError as e:
        all_errors.append({
            'type': 'json_error',
            'file': file_path,
            'message': f'Invalid JSON: {str(e)}'
        })
    except Exception as e:
        all_errors.append({
            'type': 'file_error',
            'file': file_path,
            'message': f'Error reading file: {str(e)}'
        })
    
    return all_errors

def main():
    """Validate all JSON files in public/data/"""
    data_dir = Path('public/data')
    
    if not data_dir.exists():
        print(f"Error: Directory {data_dir} does not exist")
        return
    
    all_errors = []
    files_checked = 0
    
    # Find all JSON files
    for grade_dir in sorted(data_dir.iterdir()):
        if not grade_dir.is_dir():
            continue
        
        grade_name = grade_dir.name
        print(f"\nChecking {grade_name}...")
        
        for json_file in sorted(grade_dir.glob('*.json')):
            files_checked += 1
            file_path = str(json_file)
            errors = validate_file(file_path)
            
            if errors:
                all_errors.extend(errors)
                print(f"  [ERROR] {json_file.name}: {len(errors)} errors")
            else:
                print(f"  [OK] {json_file.name}: OK")
    
    # Print summary
    print("\n" + "="*60)
    print("VALIDATION SUMMARY")
    print("="*60)
    print(f"Files checked: {files_checked}")
    print(f"Total errors: {len(all_errors)}")
    
    if all_errors:
        print("\nERROR BREAKDOWN BY TYPE:")
        error_types = {}
        for error in all_errors:
            error_type = error['type']
            error_types[error_type] = error_types.get(error_type, 0) + 1
        
        for error_type, count in sorted(error_types.items()):
            print(f"  {error_type}: {count}")
        
        print("\nDETAILED ERRORS:")
        print("="*60)
        for i, error in enumerate(all_errors, 1):
            print(f"\nError #{i}:")
            print(f"  Type: {error['type']}")
            print(f"  File: {error['file']}")
            if 'question_id' in error:
                print(f"  Question ID: {error['question_id']}")
            print(f"  Message: {error['message']}")
            if 'expected' in error:
                print(f"  Expected: {error['expected']}")
                print(f"  Actual: {error['actual']}")
        
        # Save errors to file
        errors_file = 'validation_errors.json'
        with open(errors_file, 'w', encoding='utf-8') as f:
            json.dump(all_errors, f, indent=2, ensure_ascii=False)
        print(f"\n[OK] Detailed errors saved to: {errors_file}")
    else:
        print("\n[OK] All files are valid! No errors found.")

if __name__ == "__main__":
    main()

