from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uvicorn
from app.database import get_db, engine, Base
from app.models import User, Subject, Question, Quiz, UserProgress, QuestionPaper
from app.schemas import UserCreate, UserLogin, QuizCreate, QuestionCreate
from app.auth import create_access_token, verify_token, get_password_hash, verify_password
from app.ollama_client import OllamaClient
import os
from dotenv import load_dotenv

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TNPSC Prep Hub API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()
ollama_client = OllamaClient()

# Authentication endpoints
@app.post("/api/auth/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": db_user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }

@app.post("/api/auth/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": db_user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }

# Protected route helper
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    email = verify_token(token)
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# Subjects endpoints
@app.get("/api/subjects")
async def get_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    return subjects

@app.get("/api/subjects/{subject_id}/questions")
async def get_subject_questions(subject_id: int, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.subject_id == subject_id).all()
    return questions

# Quiz endpoints
@app.get("/api/quizzes")
async def get_quizzes(db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).all()
    return quizzes

@app.post("/api/quizzes")
async def create_quiz(quiz: QuizCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_quiz = Quiz(**quiz.dict(), created_by=current_user.id)
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

# Question Papers endpoints
@app.get("/api/question-papers")
async def get_question_papers(year: str = None, subject: str = None, db: Session = Depends(get_db)):
    query = db.query(QuestionPaper)
    if year:
        query = query.filter(QuestionPaper.year == year)
    if subject:
        query = query.filter(QuestionPaper.subject == subject)
    
    if year:
        query = query.filter(QuestionPaper.year == year)
    if subject:
        query = query.filter(QuestionPaper.subject == subject)
    
    papers = query.all()
    return papers

# Chatbot endpoint
@app.post("/api/chat")
async def chat_with_bot(message: dict, current_user: User = Depends(get_current_user)):
    user_message = message.get("message", "")
    
    # Create context for TNPSC-specific responses
    context = """You are a helpful AI assistant for TNPSC (Tamil Nadu Public Service Commission) exam preparation. 
    You help students with questions about Tamil, Aptitude, General Studies, and Mental Ability subjects.
    Provide accurate, helpful, and encouraging responses to help students prepare for their exams."""
    
    try:
        response = await ollama_client.generate_response(user_message, context)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error generating response")

# User progress endpoints
@app.get("/api/user/progress")
async def get_user_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    progress = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    return progress

@app.post("/api/user/progress")
async def update_user_progress(progress_data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Update or create user progress
    existing_progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.subject_id == progress_data["subject_id"]
    ).first()
    
    if existing_progress:
        existing_progress.questions_completed = progress_data["questions_completed"]
        existing_progress.total_questions = progress_data["total_questions"]
        existing_progress.score = progress_data.get("score", 0)
    else:
        new_progress = UserProgress(
            user_id=current_user.id,
            subject_id=progress_data["subject_id"],
            questions_completed=progress_data["questions_completed"],
            total_questions=progress_data["total_questions"],
            score=progress_data.get("score", 0)
        )
        db.add(new_progress)
    
    db.commit()
    return {"message": "Progress updated successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)