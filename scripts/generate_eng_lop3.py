import json
import random
import os

# Grade 3 English Curriculum Topics
vocab_topics = {
    'easy': {
        'colors': ['red', 'blue', 'green', 'yellow', 'black', 'white'],
        'numbers_1_10': ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
        'school_supplies_basic': ['pen', 'pencil', 'book', 'ruler', 'eraser'],
        'animals_common': ['cat', 'dog', 'bird', 'fish', 'duck', 'pig'],
    },
    'medium': {
        'family': ['father', 'mother', 'brother', 'sister', 'grandma', 'grandpa'],
        'food_drinks': ['apple', 'banana', 'cake', 'milk', 'water', 'rice'],
        'body_parts': ['head', 'arm', 'leg', 'hand', 'foot', 'eye', 'nose'],
        'toys': ['ball', 'doll', 'car', 'teddy bear', 'robot'],
    },
    'hard': {
        'adjectives_simple': ['big', 'small', 'happy', 'sad', 'tall', 'short', 'old', 'young'],
        'actions_verbs': ['run', 'jump', 'swim', 'sing', 'read', 'write', 'draw'],
        'weather': ['sunny', 'rainy', 'cloudy', 'windy'],
        'places_basic': ['school', 'house', 'park', 'zoo'],
    }
}

grammar_topics = {
    'easy': [
        {'type': 'what_is_this', 'question': 'What is this? - It is a __.', 'options_from_vocab': 'easy'},
        {'type': 'plural_simple', 'question': 'one book, two ___', 'options': ['books', 'book', 'booking']},
    ],
    'medium': [
        {'type': 'present_simple_be', 'question': 'I __ a student.', 'options': ['am', 'is', 'are', 'be']},
        {'type': 'present_simple_verb', 'question': 'She ___ apples.', 'options': ['likes', 'like', 'liking']},
        {'type': 'preposition_in_on', 'question': 'The cat is __ the box.', 'options': ['in', 'on', 'at']},
        {'type': 'article_a_an', 'question': 'It is __ apple.', 'options': ['an', 'a', 'the']},
    ],
    'hard': [
        {'type': 'can_cant', 'question': 'A bird can __.', 'options': ['fly', 'swim', 'run']},
        {'type': 'how_many', 'question': 'How many ___ are there?', 'options_from_plural': 'medium'},
        {'type': 'where_is', 'question': 'Where is the ball? - It is __ the table.', 'options': ['under', 'in', 'on']},
    ]
}

all_vocab = [word for level_topics in vocab_topics.values() for category_words in level_topics.values() for word in category_words]

def generate_distractors(correct_answer, count=3):
    distractors = set()
    while len(distractors) < count:
        distractor = random.choice(all_vocab)
        if distractor != correct_answer and distractor not in distractors:
            distractors.add(distractor)
    return list(distractors)

def generate_questions(level, num_questions=100):
    questions = []
    for i in range(num_questions):
        question_data = {}
        question_type = random.choice(['vocab', 'grammar'])
        
        if level not in grammar_topics or not grammar_topics[level]:
            question_type = 'vocab'
        
        q_id_prefix = f"ENG3{level.upper()[0]}{question_type.upper()[0]}{i+1:03d}"
        question_data['id'] = q_id_prefix

        if question_type == 'vocab':
            category = random.choice(list(vocab_topics[level].keys()))
            correct_answer = random.choice(vocab_topics[level][category])
            
            question_data['question'] = f"Which one is a '{category.replace('_', ' ')}'?"
            options = [correct_answer] + generate_distractors(correct_answer, 3)
            random.shuffle(options)
            
            question_data['options'] = options
            question_data['answer_index'] = options.index(correct_answer)
            question_data['answer_text'] = correct_answer
            question_data['explanation'] = f"'{correct_answer}' is a {category.replace('_', ' ')}."
        
        else: # Grammar
            grammar_rule = random.choice(grammar_topics[level])
            
            # Special handling for dynamic questions
            if grammar_rule['type'] == 'what_is_this':
                vocab_level = grammar_rule['options_from_vocab']
                category = random.choice(list(vocab_topics[vocab_level].keys()))
                correct_answer = random.choice(vocab_topics[vocab_level][category])
                question_data['question'] = grammar_rule['question']
                options = [correct_answer] + generate_distractors(correct_answer, 3)
            
            elif grammar_rule['type'] == 'how_many':
                vocab_level = grammar_rule['options_from_plural']
                category = random.choice(list(vocab_topics[vocab_level].keys()))
                word = random.choice(vocab_topics[vocab_level][category])
                correct_answer = word + 's' if not word.endswith('s') else word + 'es'
                question_data['question'] = grammar_rule['question'].replace('___', correct_answer)
                # Ensure options are relevant
                options = [correct_answer, word, 'a ' + word, random.choice(all_vocab) + 's']

            else: # Standard grammar questions with predefined options
                correct_answer = grammar_rule['options'][0]
                options = grammar_rule['options'][:]
                question_data['question'] = grammar_rule['question']


            random.shuffle(options)
            question_data['options'] = options
            question_data['answer_index'] = options.index(correct_answer)
            question_data['answer_text'] = correct_answer
            question_data['explanation'] = f"This question tests '{grammar_rule['type'].replace('_', ' ')}'."

        questions.append(question_data)
        
    return questions

def write_json_file(level, questions):
    data = {
        "meta": {
            "grade": 3,
            "subject": "English",
            "language": "en",
            "created_date": "2025-11-04",
            "level": level,
            "curriculum": "Generated based on common Grade 3 topics (CTGDPT 2018)"
        },
        "topics": [
            {
                "id": f"ENG3_{level.upper()}_ALL",
                "name": "General English Practice",
                "difficulty": level,
                "questions": questions
            }
        ]
    }
    
    output_dir = os.path.join('public', 'data', 'lop3')
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
