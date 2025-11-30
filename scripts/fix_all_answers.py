import json
import os
import shutil
from pathlib import Path
from typing import Dict, Any, List

def fix_question(question: Dict[str, Any]) -> Dict[str, Any]:
    """Fix a single question and return the fixed version"""
    fixed = question.copy()
    
    # Fix 1: Convert old format "answer" → "answer_index" + "answer_text"
    if 'answer' in fixed and 'answer_index' not in fixed:
        answer = fixed['answer']
        options = fixed.get('options', [])
        
        # Find index of answer in options
        try:
            answer_index = options.index(answer)
            fixed['answer_index'] = answer_index
            fixed['answer_text'] = answer
            # Remove old "answer" field
            fixed.pop('answer', None)
        except ValueError:
            # Answer not found in options - skip this question
            print(f"  Warning: Answer '{answer}' not found in options for question {fixed.get('id', 'unknown')}")
            return fixed
    
    # Fix 2: Ensure answer_index and answer_text exist
    if 'answer_index' not in fixed or 'answer_text' not in fixed:
        return fixed
    
    options = fixed.get('options', [])
    answer_index = fixed['answer_index']
    answer_text = fixed['answer_text']
    
    # Validate answer_index
    if not isinstance(answer_index, int):
        return fixed
    
    if answer_index < 0 or answer_index >= len(options):
        # Invalid index - try to find answer_text in options
        try:
            new_index = options.index(answer_text)
            fixed['answer_index'] = new_index
            print(f"  Fixed: Updated answer_index to {new_index} for question {fixed.get('id', 'unknown')}")
        except ValueError:
            # answer_text not found in options - can't fix
            print(f"  Error: Cannot fix question {fixed.get('id', 'unknown')} - answer_text '{answer_text}' not in options")
        return fixed
    
    # Fix 3: Ensure answer_index matches answer_text
    correct_answer = options[answer_index]
    if correct_answer != answer_text:
        # Priority: answer_index is correct (options were shuffled)
        fixed['answer_text'] = correct_answer
        print(f"  Fixed: Updated answer_text to '{correct_answer}' for question {fixed.get('id', 'unknown')}")
    
    return fixed

def fix_file(file_path: str) -> tuple[int, int]:
    """Fix a single JSON file and return (total_questions, fixed_count)"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        total_questions = 0
        fixed_count = 0
        
        if 'topics' not in data:
            return 0, 0
        
        for topic in data.get('topics', []):
            if 'questions' not in topic:
                continue
            
            for i, question in enumerate(topic['questions']):
                total_questions += 1
                original = question.copy()
                fixed_question = fix_question(question)
                
                # Check if question was modified
                if fixed_question != original:
                    fixed_count += 1
                    topic['questions'][i] = fixed_question
        
        # Save fixed file
        if fixed_count > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        
        return total_questions, fixed_count
        
    except json.JSONDecodeError as e:
        print(f"  Error: Invalid JSON in {file_path}: {e}")
        return 0, 0
    except Exception as e:
        print(f"  Error processing {file_path}: {e}")
        return 0, 0

def backup_files(data_dir: Path):
    """Create backup of all JSON files"""
    backup_dir = data_dir.parent / 'data_backup'
    if backup_dir.exists():
        shutil.rmtree(backup_dir)
    
    shutil.copytree(data_dir, backup_dir)
    print(f"Backup created at: {backup_dir}")
    return backup_dir

def main():
    """Fix all JSON files in public/data/"""
    data_dir = Path('public/data')
    
    if not data_dir.exists():
        print(f"Error: Directory {data_dir} does not exist")
        return
    
    # Create backup
    print("Creating backup...")
    backup_dir = backup_files(data_dir)
    print()
    
    total_files = 0
    total_questions = 0
    total_fixed = 0
    
    # Process all grade directories
    for grade_dir in sorted(data_dir.iterdir()):
        if not grade_dir.is_dir():
            continue
        
        grade_name = grade_dir.name
        print(f"Processing {grade_name}...")
        
        grade_questions = 0
        grade_fixed = 0
        
        for json_file in sorted(grade_dir.glob('*.json')):
            total_files += 1
            file_path = str(json_file)
            questions, fixed = fix_file(file_path)
            
            total_questions += questions
            total_fixed += fixed
            grade_questions += questions
            grade_fixed += fixed
            
            if fixed > 0:
                print(f"  {json_file.name}: Fixed {fixed}/{questions} questions")
            else:
                print(f"  {json_file.name}: OK ({questions} questions)")
        
        if grade_fixed > 0:
            print(f"  {grade_name}: Fixed {grade_fixed}/{grade_questions} questions")
        print()
    
    # Print summary
    print("="*60)
    print("FIX SUMMARY")
    print("="*60)
    print(f"Files processed: {total_files}")
    print(f"Total questions: {total_questions}")
    print(f"Questions fixed: {total_fixed}")
    print(f"Backup location: {backup_dir}")
    print()
    
    if total_fixed > 0:
        print(f"[OK] Fixed {total_fixed} questions across {total_files} files")
        print("Please run validation script again to verify all fixes.")
    else:
        print("[OK] No fixes needed!")

if __name__ == "__main__":
    main()

