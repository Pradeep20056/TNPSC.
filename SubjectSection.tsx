import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { BookOpen, ChevronRight, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { subjectsAPI } from '@/utils/api'

interface SubjectSectionProps {
  subjects: any[]
  userProgress: any[]
}

const SubjectSection: React.FC<SubjectSectionProps> = ({ subjects, userProgress }) => {
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])

  const fetchQuestions = async (subjectId: number) => {
    try {
      const response = await subjectsAPI.getQuestions(subjectId)
      setQuestions(response.data)
      setCurrentQuestionIndex(0)
      setSelectedAnswer('')
      setShowAnswer(false)
      setScore(0)
      setAnsweredQuestions([])
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  const handleSubjectSelect = (subject: any) => {
    setSelectedSubject(subject)
    fetchQuestions(subject.id)
  }

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correct_answer

    if (isCorrect) {
      setScore(score + 1)
    }

    setAnsweredQuestions([...answeredQuestions, currentQuestionIndex])
    setShowAnswer(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setShowAnswer(false)
    }
  }

  const getProgressForSubject = (subjectId: number) => {
    const progress = userProgress.find(p => p.subject_id === subjectId)
    return progress ? (progress.questions_completed / progress.total_questions) * 100 : 0
  }

  if (selectedSubject && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex]
    const isLastQuestion = currentQuestionIndex === questions.length - 1
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedSubject(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Subjects
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedSubject.name}</h2>
              <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-green-600">{score}/{answeredQuestions.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} />
        </div>

        {/* Question Card */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{currentQuestion.difficulty}</Badge>
              <Badge variant="secondary">{currentQuestion.topic}</Badge>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Options */}
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showAnswer}>
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionText = currentQuestion[`option_${option.toLowerCase()}`]
                  const isCorrect = option === currentQuestion.correct_answer
                  const isSelected = option === selectedAnswer
                  
                  return (
                    <div
                      key={option}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                        showAnswer
                          ? isCorrect
                            ? 'bg-green-50 border-green-200'
                            : isSelected
                            ? 'bg-red-50 border-red-200'
                            : 'bg-gray-50 border-gray-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="flex-1 cursor-pointer">
                        <span className="font-medium mr-2">{option}.</span>
                        {optionText}
                      </Label>
                      {showAnswer && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {showAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  )
                })}
              </div>
            </RadioGroup>

            {/* Explanation */}
            {showAnswer && currentQuestion.explanation && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                <p className="text-blue-800">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <div></div>
              <div className="space-x-3">
                {!showAnswer ? (
                  <Button 
                    onClick={handleAnswerSubmit} 
                    disabled={!selectedAnswer}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNextQuestion}
                    disabled={isLastQuestion}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLastQuestion ? 'Complete' : 'Next Question'}
                    {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-2" />}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose a Subject</h2>
        <p className="text-gray-600">Select a subject to start practicing questions</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card 
            key={subject.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handleSubjectSelect(subject)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </div>
              <CardTitle className="text-xl">{subject.name}</CardTitle>
              <CardDescription>{subject.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(getProgressForSubject(subject.id))}%</span>
                </div>
                <Progress value={getProgressForSubject(subject.id)} />
                <Button className="w-full" variant="outline">
                  Start Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SubjectSection