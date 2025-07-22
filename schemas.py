from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class SubjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    color: str
    
    class Config:
        from_attributes = True

class QuestionCreate(BaseModel):
    subject_id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    explanation: Optional[str] = None
    difficulty: str = "Medium"
    topic: Optional[str] = None

class QuestionResponse(BaseModel):
    id: int
    subject_id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    explanation: Optional[str]
    difficulty: str
    topic: Optional[str]
    
    class Config:
        from_attributes = True

class QuizCreate(BaseModel):
    title: str
    description: Optional[str] = None
    subject_id: int
    duration_minutes: int = 30
    total_questions: int = 20
    difficulty: str = "Medium"

class QuizResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    subject_id: int
    duration_minutes: int
    total_questions: int
    difficulty: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str