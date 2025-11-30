import json
import random
import os

# Grade 2 English "Getting Acquainted" Curriculum Topics
vocab_topics = {
    'easy': {
        'greetings': ['hello', 'hi', 'bye', 'goodbye'],
        'colors_basic': ['red', 'blue', 'green', 'yellow'],
        'numbers_1_5': ['one', 'two', 'three', 'four', 'five'],
        'animals_pets': ['cat', 'dog', 'bird', 'fish'],
    },
    'medium': {
        'school_items': ['pen', 'pencil', 'book', 'bag', 'ruler'],
        'numbers_6_10': ['six', 'seven', 'eight', 'nine', 'ten'],
        'family_basic': ['father', 'mother', 'brother', 'sister'],
        'toys_basic': ['ball', 'doll', 'car', 'robot'],
    },
    'hard': {
        'body_simple': ['head', 'hand', 'leg', 'eye', 'nose', 'ear'],
        'food_simple': ['apple', 'banana', 'cake', 'milk'],
        'actions_simple': ['stand up', 'sit down', 'open', 'close'],
        'adjectives_very_basic': ['big', 'small', 'happy', 'sad'],
    }
}

grammar_topics = {
    'easy': [
        {'type': 'identification', 'question': 'What is this?', 'answer_prefix': "It's a "},
    ],
    'medium': [
        {'type': 'color_question', 'question': 'What color is it?', 'answer_prefix': "It's "},
        {'type': 'counting', 'question': 'How many cats?', 'options': ['two', 'three', 'four']},
    ],
    'hard': [
        {'type': 'simple_command', 'question': 'Please, ___ ___.' , 'options': ['stand up', 'sit down', 'open your book']},
        {'type': 'simple_feeling', 'question': 'I am ___.', 'options': ['happy', 'sad', 'big']},
    ]
}

all_vocab = [word for level_topics in vocab_topics.values() for category_words in level_topics.values() for word in category_words]

def generate_distractors(correct_answer, count=3):
    distractors = set()
    # Ensure correct_answer is a string
    correct_answer_str = str(correct_answer)
    while len(distractors) < count:
        distractor = random.choice(all_vocab)
        if distractor != correct_answer_str and distractor not in distractors:
            distractors.add(distractor)
    return list(distractors)

def generate_questions(level, num_questions=100):
    questions = []
    for i in range(num_questions):
        question_data = {}
        # Grade 2 is mostly vocab recognition
        question_type = 'vocab' if random.random() < 0.8 else 'grammar'

        if level not in grammar_topics or not grammar_topics[level]:
            question_type = 'vocab'
            
        q_id_prefix = f"ENG2{level.upper()[0]}{question_type.upper()[0]}{i+1:03d}"
        question_data['id'] = q_id_prefix

        if question_type == 'vocab':
            category = random.choice(list(vocab_topics[level].keys()))
            correct_answer = random.choice(vocab_topics[level][category])
            
            question_data['question'] = f"Point to the word: '{correct_answer}'"
            options = [correct_answer] + generate_distractors(correct_answer, 3)
            random.shuffle(options)
            
            question_data['options'] = options
            question_data['answer_index'] = options.index(correct_answer)
            question_data['answer_text'] = correct_answer
            question_data['explanation'] = f"This is the word for '{correct_answer}'."

        else: # Grammar / Simple Phrases
            grammar_rule = random.choice(grammar_topics[level])
            rule_type = grammar_rule['type']
            
            if rule_type == 'identification':
                category = random.choice(list(vocab_topics['medium'].keys()))
                correct_answer = random.choice(vocab_topics['medium'][category])
                question_data['question'] = grammar_rule['question']
                options = [correct_answer] + generate_distractors(correct_answer, 3)
                question_data['answer_text'] = f"{grammar_rule['answer_prefix']}{correct_answer}."

            elif rule_type == 'color_question':
                correct_answer = random.choice(vocab_topics['easy']['colors_basic'])
                question_data['question'] = grammar_rule['question']
                options = [correct_answer] + [c for c in vocab_topics['easy']['colors_basic'] if c != correct_answer]
                question_data['answer_text'] = f"{grammar_rule['answer_prefix']}{correct_answer}."

            else: # Pre-defined options
                correct_answer = grammar_rule['options'][0]
                options = grammar_rule['options'][:]
                question_data['question'] = grammar_rule['question']
                question_data['answer_text'] = correct_answer
            
            random.shuffle(options)
            question_data['options'] = options
            question_data['answer_index'] = options.index(correct_answer)
            question_data['explanation'] = f"This is a '{rule_type}' phrase."

        questions.append(question_data)
        
    return questions

def write_json_file(level, questions):
    data = {
        "meta": {
            "grade": 2,
            "subject": "English",
            "language": "en",
            "created_date": "2025-11-04",
            "level": level,
            "curriculum": "Generated based on Grade 2 'Getting Acquainted' topics"
        },
        "topics": [
            {
                "id": f"ENG2_{level.upper()}_ALL",
                "name": "General English Acquaintance",
                "difficulty": level,
                "questions": questions
            }
        ]
    }
    
    output_dir = os.path.join('public', 'data', 'lop2')
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, f'eng.{level}.json')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Successfully generated {filepath}")

def main():
    levels = ['easy', 'medium', 'hard']
    for level in levels:
        questions = generate_questions(level, 100)
        write_json_file(level, questions)

if __name__ == "__main__":
    main()
