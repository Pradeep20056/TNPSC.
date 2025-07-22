import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Clock, Trophy, Play, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { quizAPI, subjectsAPI } from '@/utils/api'

const QuizSection: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)
  const [quizQuestions, setQuizQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [answers, setAnswers] = useState<{[key: number]: string}>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && quizStarted) {
      handleQuizComplete()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, quizStarted, quizCompleted])

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getAll()
      setQuizzes(response.data)
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    }
  }

  const startQuiz = async (quiz: any) => {
    try {
      // Fetch questions for the quiz subject
      const response = await subjectsAPI.getQuestions(quiz.subject_id)
      const shuffledQuestions = response.data
        .sort(() => Math.random() - 0.5)
        .slice(0, quiz.total_questions)
      
      setSelectedQuiz(quiz)
      setQuizQuestions(shuffledQuestions)
      setTimeLeft(quiz.duration_minutes * 60)
      setQuizStarted(true)
      setCurrentQuestionIndex(0)
      setAnswers({})
      setSelectedAnswer('')
      setQuizCompleted(false)
      setScore(0)
    } catch (error) {
      console.error('Error starting quiz:', error)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    setAnswers({ ...answers, [currentQuestionIndex]: answer })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(answers[currentQuestionIndex + 1] || '')
    } else {
      handleQuizComplete()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(answers[currentQuestionIndex - 1] || '')
    }
  }

  const handleQuizComplete = () => {
    let correctAnswers = 0
    quizQuestions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctAnswers++
      }
    })
    setScore(correctAnswers)
    setQuizCompleted(true)
    setQuizStarted(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const resetQuiz = () => {
    setSelectedQuiz(null)
    setQuizQuestions([])
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setAnswers({})
    setTimeLeft(0)
    setQuizStarted(false)
    setQuizCompleted(false)
    setScore(0)
  }

  // Quiz Results View
  if (quizCompleted) {
    const percentage = Math.round((score / quizQuestions.length) * 100)
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-gray-600">Here are your results</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{selectedQuiz.title}</CardTitle>
            <CardDescription>Your Performance Summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                {percentage}%
              </div>
              <p className="text-gray-600">
                {score} out of {quizQuestions.length} questions correct
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{quizQuestions.length - score}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{selectedQuiz.duration_minutes}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={resetQuiz} className="w-full">
                Back to Quizzes
              </Button>
              <Button onClick={() => startQuiz(selectedQuiz)} variant="outline" className="w-full">
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Quiz Taking View
  if (quizStarted && quizQuestions.length > 0) {
    const currentQuestion = quizQuestions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100

    return (
      <div className="space-y-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={resetQuiz}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Quiz
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedQuiz.title}</h2>
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-red-600">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Question */}
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
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionText = currentQuestion[`option_${option.toLowerCase()}`]
                  return (
                    <div
                      key={option}
                      className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="flex-1 cursor-pointer">
                        <span className="font-medium mr-2">{option}.</span>
                        {optionText}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <div className="space-x-3">
                <Button
                  onClick={handleNextQuestion}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigator */}
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <div className="grid grid-cols-10 gap-2">
              {quizQuestions.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentQuestionIndex ? "default" : answers[index] ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentQuestionIndex(index)
                    setSelectedAnswer(answers[index] || '')
                  }}
                  className="aspect-square"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Quiz Selection View
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Available Quizzes</h2>
        <p className="text-gray-600">Test your knowledge with timed quizzes</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{quiz.difficulty}</Badge>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{quiz.duration_minutes}m</span>
                </div>
              </div>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Questions: {quiz.total_questions}</span>
                <span>Duration: {quiz.duration_minutes} min</span>
              </div>
              <Button 
                onClick={() => startQuiz(quiz)} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default QuizSection