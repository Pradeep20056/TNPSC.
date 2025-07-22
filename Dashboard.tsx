import React, { useState, useEffect } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs'
import {
  BookOpen, Brain, MessageCircle, Trophy, User, LogOut, Target
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { logout } from '@/utils/auth'
import SubjectSection from '@/components/SubjectSection'
import QuizSection from '@/components/QuizSection'
import PreviousPapers from '@/components/PreviousPapers'
import ChatBot from '@/components/ChatBot'
import { subjectsAPI, progressAPI } from '@/utils/api'

interface Subject {
  id: number
  name: string
  description?: string
  color?: string
}

interface ProgressData {
  subject_id: number
  questions_completed: number
  total_questions: number
}

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [userProgress, setUserProgress] = useState<ProgressData[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/'
    }
  }, [user, loading])

  useEffect(() => {
    fetchSubjects()
    fetchUserProgress()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await subjectsAPI.getAll()
      setSubjects(response.data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const fetchUserProgress = async () => {
    try {
      const response = await progressAPI.get()
      setUserProgress(response.data)
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const getProgressForSubject = (subjectId: number): number => {
    const progress = userProgress.find(p => p.subject_id === subjectId)
    return progress ? (progress.questions_completed / progress.total_questions) * 100 : 0
  }

  const getTotalProgress = (): number => {
    if (userProgress.length === 0) return 0
    const totalCompleted = userProgress.reduce((sum, p) => sum + p.questions_completed, 0)
    const totalQuestions = userProgress.reduce((sum, p) => sum + p.total_questions, 0)
    return totalQuestions > 0 ? (totalCompleted / totalQuestions) * 100 : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TNPSC Prep Hub
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChatOpen(true)}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>AI Assistant</span>
            </Button>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">{user?.name || 'Guest'}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">Continue your TNPSC preparation journey</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <DashboardCard title="Overall Progress" value={`${Math.round(getTotalProgress())}%`} icon={<Target />} progress={getTotalProgress()} />
          <DashboardCard title="Subjects" value={subjects.length.toString()} icon={<BookOpen />} />
          <DashboardCard title="Questions Solved" value={userProgress.reduce((sum, p) => sum + p.questions_completed, 0).toString()} icon={<Brain />} />
          <DashboardCard title="Study Streak" value="7" icon={<Trophy />} />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="papers">Previous Papers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map(subject => (
                <Card key={subject.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 ${subject.color || 'bg-blue-500'} rounded-lg flex items-center justify-center`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <Badge variant="secondary">{Math.round(getProgressForSubject(subject.id))}%</Badge>
                    </div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription>{subject.description || 'No description'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={getProgressForSubject(subject.id)} className="mb-2" />
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => setActiveTab('subjects')}
                    >
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subjects">
            <SubjectSection subjects={subjects} userProgress={userProgress} />
          </TabsContent>

          <TabsContent value="quizzes">
            <QuizSection />
          </TabsContent>

          <TabsContent value="papers">
            <PreviousPapers />
          </TabsContent>
        </Tabs>
      </div>

      {/* ChatBot */}
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </div>
  )
}

const DashboardCard = ({
  title,
  value,
  icon,
  progress
}: {
  title: string
  value: string
  icon: React.ReactNode
  progress?: number
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {progress !== undefined && <Progress value={progress} className="mt-2" />}
    </CardContent>
  </Card>
)

export default Dashboard
