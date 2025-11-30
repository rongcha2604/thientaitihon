import json
import random
import os

# Grade 4 English Curriculum Topics
vocab_topics = {
    'easy': {
        'school_supplies': ['pen', 'pencil', 'book', 'ruler', 'eraser', 'bag'],
        'colors': ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'pink'],
        'animals': ['cat', 'dog', 'bird', 'fish', 'tiger', 'lion', 'monkey'],
        'family': ['father', 'mother', 'brother', 'sister', 'grandma', 'grandpa'],
        'numbers': ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
        'food': ['apple', 'banana', 'orange', 'cake', 'milk', 'rice', 'water']
    },
    'medium': {
        'jobs': ['teacher', 'student', 'doctor', 'nurse', 'driver', 'singer'],
        'daily_activities': ['get up', 'have breakfast', 'go to school', 'have lunch', 'go home', 'have dinner', 'go to bed'],
        'places': ['school', 'house', 'bookshop', 'zoo', 'park', 'supermarket'],
        'subjects': ['Maths', 'English', 'Science', 'Art', 'Music', 'Vietnamese']
    },
    'hard': {
        'adjectives': ['big', 'small', 'tall', 'short', 'long', 'beautiful', 'old', 'new', 'young'],
        'hobbies': ['reading books', 'playing football', 'listening to music', 'watching TV', 'swimming', 'singing'],
        'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
}

grammar_topics = {
    'easy': [
        {'type': 'article', 'question': 'Choose the correct word: __ {}', 'options': ['a', 'an']},
        {'type': 'plural', 'question': 'The plural of "{}" is __.', 'transform': lambda w: w + 's'},
    ],
    'medium': [
        {'type': 'present_simple', 'question': 'She ___ to school every day.', 'options': ['goes', 'go', 'going', 'went']},
        {'type': 'preposition_place', 'question': 'The book is __ the table.', 'options': ['on', 'in', 'at', 'under']},
        {'type': 'can_cannot', 'question': 'A bird can __, but a fish can\'t.', 'options': ['fly', 'swim', 'run', 'climb']},
    ],
    'hard': [
        {'type': 'past_simple', 'question': 'Yesterday, I ___ football with my friends.', 'options': ['played', 'play', 'playing', 'am playing']},
        {'type': 'comparative', 'question': 'An elephant is ___ than a mouse.', 'options': ['bigger', 'big', 'the biggest', 'as big']},
        {'type': 'wh_question', 'question': '___ is your name?', 'options': ['What', 'Who', 'When', 'Where']},
    ]
}

all_vocab = [word for sublist in vocab_topics.values() for cat in sublist.values() for word in cat]

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
        
        # Ensure level has grammar topics, otherwise default to vocab
        if level not in grammar_topics or not grammar_topics[level]:
            question_type = 'vocab'
        
        if question_type == 'vocab':
            # Vocabulary question
            category = random.choice(list(vocab_topics[level].keys()))
            correct_answer = random.choice(vocab_topics[level][category])
            
            question_data['id'] = f"ENG4{level.upper()[0]}V{i+1:03d}"
            question_data['question'] = f"Which word is a type of {category.replace('_', ' ')}?"
            options = [correct_answer] + generate_distractors(correct_answer, 3)
            random.shuffle(options)
            
            question_data['options'] = options
            question_data['answer_index'] = options.index(correct_answer)
            question_data['answer_text'] = correct_answer
            question_data['explanation'] = f"'{correct_answer}' is a {category.replace('_', ' ')}."

        else: # Grammar question
            grammar_rule = random.choice(grammar_topics[level])
            q_id_prefix = f"ENG4{level.upper()[0]}G{i+1:03d}"
            
            if grammar_rule['type'] == 'article':
                vowels = 'aeiou'
                word = random.choice([w for w in all_vocab if w[0] in vowels]) if random.random() > 0.5 else random.choice([w for w in all_vocab if w[0] not in vowels])
                correct_answer = 'an' if word[0] in vowels else 'a'
                
                question_data['id'] = q_id_prefix
                question_data['question'] = grammar_rule['question'].format(word)
                options = [correct_answer, 'the', 'a' if correct_answer == 'an' else 'an']
                distractors = generate_distractors(correct_answer, 1)
                options.append(distractors[0])
                random.shuffle(options)
                
                question_data['options'] = options
                question_data['answer_index'] = options.index(correct_answer)
                question_data['answer_text'] = correct_answer
                question_data['explanation'] = f"Use 'an' before vowel sounds and 'a' before consonant sounds."

            elif grammar_rule['type'] == 'plural':
                singular_word = random.choice(vocab_topics['easy']['school_supplies'] + vocab_topics['easy']['animals'])
                correct_answer = grammar_rule['transform'](singular_word)
                
                question_data['id'] = q_id_prefix
                question_data['question'] = grammar_rule['question'].format(singular_word)
                options = [correct_answer, singular_word, f"{singular_word}ing", f"{singular_word}ed"]
                random.shuffle(options)

                question_data['options'] = options
                question_data['answer_index'] = options.index(correct_answer)
                question_data['answer_text'] = correct_answer
                question_data['explanation'] = f"To make most nouns plural, you add '-s'."

            else: # Multiple choice grammar from pre-defined options
                correct_answer = grammar_rule['options'][0]
                options = grammar_rule['options'][:] # copy
                random.shuffle(options)

                question_data['id'] = q_id_prefix
                question_data['question'] = grammar_rule['question']
                question_data['options'] = options
                question_data['answer_index'] = options.index(correct_answer)
                question_data['answer_text'] = correct_answer
                question_data['explanation'] = f"This question tests the '{grammar_rule['type']}' grammar point."
        
        questions.append(question_data)
        
    return questions

def write_json_file(level, questions):
    data = {
        "meta": {
            "grade": 4,
            "subject": "English",
            "language": "en",
            "created_date": "2025-11-04",
            "level": level,
            "curriculum": "Generated based on common Grade 4 topics"
        },
        "topics": [
            {
                "id": f"ENG4_{level.upper()}_ALL",
                "name": "General English Practice",
                "difficulty": level,
                "questions": questions
            }
        ]
    }
    
    output_dir = os.path.join('public', 'data', 'lop4')
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
