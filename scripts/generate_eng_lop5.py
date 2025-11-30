import json
import random
import os

# Grade 5 English Curriculum Topics
vocab_topics = {
    'easy': {
        'jobs': ['teacher', 'doctor', 'nurse', 'student', 'driver', 'singer'],
        'places': ['school', 'hospital', 'library', 'park', 'zoo', 'supermarket'],
        'subjects': ['Maths', 'English', 'Science', 'Art', 'Music', 'Vietnamese'],
        'transport': ['bike', 'bus', 'car', 'motorbike', 'taxi'],
    },
    'medium': {
        'activities': ['reading books', 'playing football', 'listening to music', 'watching TV', 'swimming', 'singing'],
        'weather': ['sunny', 'rainy', 'cloudy', 'windy', 'snowy'],
        'adjectives': ['big', 'small', 'tall', 'short', 'long', 'beautiful', 'old', 'new', 'young'],
        'time_expressions': ['morning', 'afternoon', 'evening', 'night', 'today', 'yesterday', 'tomorrow'],
    },
    'hard': {
        'comparisons': ['bigger', 'smaller', 'taller', 'shorter', 'longer', 'better', 'worse'],
        'past_verbs': ['went', 'saw', 'did', 'had', 'ate', 'drank', 'played', 'visited'],
        'future_expressions': ['will go', 'will visit', 'will play', 'will study', 'will help'],
        'complex_adjectives': ['interesting', 'boring', 'exciting', 'difficult', 'easy', 'important'],
    }
}

grammar_topics = {
    'easy': [
        {'type': 'present_simple_3rd', 'question': 'She ___ to school every day.', 'options': ['goes', 'go', 'going', 'went']},
        {'type': 'present_simple_plural', 'question': 'They ___ football on Sundays.', 'options': ['play', 'plays', 'playing', 'played']},
        {'type': 'preposition_place', 'question': 'The book is __ the table.', 'options': ['on', 'in', 'at', 'under']},
    ],
    'medium': [
        {'type': 'past_simple', 'question': 'Yesterday, I ___ football with my friends.', 'options': ['played', 'play', 'playing', 'am playing']},
        {'type': 'present_continuous', 'question': 'She is ___ now.', 'options': ['reading', 'read', 'reads', 'readed']},
        {'type': 'comparative', 'question': 'An elephant is ___ than a mouse.', 'options': ['bigger', 'big', 'the biggest', 'as big']},
        {'type': 'can_cant', 'question': 'A bird can __, but a fish can\'t.', 'options': ['fly', 'swim', 'run', 'climb']},
    ],
    'hard': [
        {'type': 'past_simple_irregular', 'question': 'Last week, I ___ to the zoo.', 'options': ['went', 'go', 'goes', 'going']},
        {'type': 'superlative', 'question': 'This is the ___ building in the city.', 'options': ['tallest', 'tall', 'taller', 'as tall']},
        {'type': 'future_will', 'question': 'Tomorrow, I ___ visit my grandparents.', 'options': ['will', 'am', 'was', 'have']},
        {'type': 'wh_question', 'question': '___ did you go yesterday?', 'options': ['Where', 'What', 'Who', 'When']},
        {'type': 'present_perfect', 'question': 'I have ___ my homework.', 'options': ['done', 'do', 'did', 'doing']},
    ]
}

all_vocab = [word for level_topics in vocab_topics.values() for category_words in level_topics.values() for word in category_words]

def generate_distractors(correct_answer, count=3):
    distractors = set()
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
        question_type = random.choice(['vocab', 'grammar'])
        
        if level not in grammar_topics or not grammar_topics[level]:
            question_type = 'vocab'
        
        q_id_prefix = f"ENG5{level.upper()[0]}{question_type.upper()[0]}{i+1:03d}"
        question_data['id'] = q_id_prefix

        if question_type == 'vocab':
            category = random.choice(list(vocab_topics[level].keys()))
            correct_answer = random.choice(vocab_topics[level][category])
            
            question_data['question'] = f"Which word is related to '{category.replace('_', ' ')}'?"
            options = [correct_answer] + generate_distractors(correct_answer, 3)
            random.shuffle(options)
            
            question_data['options'] = options
            question_data['answer_index'] = options.index(correct_answer)
            question_data['answer_text'] = correct_answer
            question_data['explanation'] = f"'{correct_answer}' is related to {category.replace('_', ' ')}."

        else: # Grammar
            grammar_rule = random.choice(grammar_topics[level])
            correct_answer = grammar_rule['options'][0]
            options = grammar_rule['options'][:]
            question_data['question'] = grammar_rule['question']
            
            random.shuffle(options)
            question_data['options'] = options
            question_data['answer_index'] = options.index(correct_answer)
            question_data['answer_text'] = correct_answer
            question_data['explanation'] = f"This question tests the '{grammar_rule['type'].replace('_', ' ')}' grammar point."

        questions.append(question_data)
        
    return questions

def write_json_file(level, questions):
    data = {
        "meta": {
            "grade": 5,
            "subject": "English",
            "language": "en",
            "created_date": "2025-11-04",
            "level": level,
            "curriculum": "Generated based on common Grade 5 topics (CTGDPT 2018)"
        },
        "topics": [
            {
                "id": f"ENG5_{level.upper()}_ALL",
                "name": "General English Practice",
                "difficulty": level,
                "questions": questions
            }
        ]
    }
    
    output_dir = os.path.join('public', 'data', 'lop5')
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

