from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from .models import Base, Subject, Question, Quiz, QuestionPaper
from datetime import datetime

# Create tables
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    try:
        # Create subjects
        subjects_data = [
            {"name": "Tamil", "description": "Tamil language, literature, and grammar", "color": "bg-blue-500"},
            {"name": "Aptitude", "description": "Quantitative aptitude and logical reasoning", "color": "bg-green-500"},
            {"name": "General Studies", "description": "History, geography, polity, and current affairs", "color": "bg-purple-500"},
            {"name": "Mental Ability", "description": "Reasoning, problem-solving, and analytical skills", "color": "bg-orange-500"}
        ]
        
        for subject_data in subjects_data:
            existing_subject = db.query(Subject).filter(Subject.name == subject_data["name"]).first()
            if not existing_subject:
                subject = Subject(**subject_data)
                db.add(subject)
        
        db.commit()
        
        # Get subjects for foreign keys
        tamil_subject = db.query(Subject).filter(Subject.name == "Tamil").first()
        aptitude_subject = db.query(Subject).filter(Subject.name == "Aptitude").first()
        gs_subject = db.query(Subject).filter(Subject.name == "General Studies").first()
        mental_subject = db.query(Subject).filter(Subject.name == "Mental Ability").first()
        
        # Sample questions for Tamil
        tamil_questions = [
            {
                "subject_id": tamil_subject.id,
                "question_text": "Which of the following is the correct Tamil grammar rule for plural formation?",
                "option_a": "Add 'கள்' to the end of singular nouns",
                "option_b": "Add 'ங்கள்' to the end of singular nouns",
                "option_c": "Add 'கள்' or 'ங்கள்' depending on the noun",
                "option_d": "Tamil doesn't have plural forms",
                "correct_answer": "C",
                "explanation": "Tamil plural formation depends on the type of noun - animate or inanimate.",
                "difficulty": "Medium",
                "topic": "Grammar"
            },
            {
                "subject_id": tamil_subject.id,
                "question_text": "What is the Tamil word for 'book'?",
                "option_a": "புத்தகம்",
                "option_b": "பேனா",
                "option_c": "காகிதம்",
                "option_d": "மேஜை",
                "correct_answer": "A",
                "explanation": "புத்தகம் is the correct Tamil word for book.",
                "difficulty": "Easy",
                "topic": "Vocabulary"
            }
        ]
        
        # Sample questions for Aptitude
        aptitude_questions = [
            {
                "subject_id": aptitude_subject.id,
                "question_text": "If 2x + 3 = 11, what is the value of x?",
                "option_a": "3",
                "option_b": "4",
                "option_c": "5",
                "option_d": "6",
                "correct_answer": "B",
                "explanation": "2x + 3 = 11, so 2x = 8, therefore x = 4",
                "difficulty": "Easy",
                "topic": "Algebra"
            },
            {
                "subject_id": aptitude_subject.id,
                "question_text": "What is 15% of 200?",
                "option_a": "25",
                "option_b": "30",
                "option_c": "35",
                "option_d": "40",
                "correct_answer": "B",
                "explanation": "15% of 200 = (15/100) × 200 = 30",
                "difficulty": "Easy",
                "topic": "Percentage"
            }
        ]
        
        # Add questions to database
        all_questions = tamil_questions + aptitude_questions
        for question_data in all_questions:
            existing_question = db.query(Question).filter(
                Question.question_text == question_data["question_text"]
            ).first()
            if not existing_question:
                question = Question(**question_data)
                db.add(question)
        
        # Create sample quizzes
        quizzes_data = [
            {
                "title": "Tamil Grammar Basics",
                "description": "Test your knowledge of basic Tamil grammar rules",
                "subject_id": tamil_subject.id,
                "duration_minutes": 30,
                "total_questions": 20,
                "difficulty": "Easy"
            },
            {
                "title": "Number System",
                "description": "Practice problems on number system and basic arithmetic",
                "subject_id": aptitude_subject.id,
                "duration_minutes": 45,
                "total_questions": 25,
                "difficulty": "Medium"
            }
        ]
        
        for quiz_data in quizzes_data:
            existing_quiz = db.query(Quiz).filter(Quiz.title == quiz_data["title"]).first()
            if not existing_quiz:
                quiz = Quiz(**quiz_data)
                db.add(quiz)
        
        # Create sample question papers
        papers_data = [
            {
                "title": "TNPSC Group 1 Main Examination",
                "year": "2023",
                "subject": "General Studies",
                "exam_date": datetime(2023, 12, 15),
                "duration_hours": 3.0,
                "total_questions": 200,
                "exam_type": "Main",
                "difficulty": "Hard",
                "has_answer_key": True
            },
            {
                "title": "TNPSC Group 2 Preliminary Examination",
                "year": "2023",
                "subject": "General Studies",
                "exam_date": datetime(2023, 10, 22),
                "duration_hours": 2.5,
                "total_questions": 150,
                "exam_type": "Preliminary",
                "difficulty": "Medium",
                "has_answer_key": True
            }
        ]
        
        for paper_data in papers_data:
            existing_paper = db.query(QuestionPaper).filter(
                QuestionPaper.title == paper_data["title"]
            ).first()
            if not existing_paper:
                paper = QuestionPaper(**paper_data)
                db.add(paper)
        
        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()