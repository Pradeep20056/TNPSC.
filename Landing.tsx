import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Brain, MessageCircle, Trophy, ArrowRight } from 'lucide-react'
import AuthModal from '@/components/AuthModal'

const Landing: React.FC = () => {
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null)

  const features = [
    {
      icon: BookOpen,
      title: 'Previous Year Papers',
      description: 'Access comprehensive collection of TNPSC previous year question papers with detailed solutions',
    },
    {
      icon: Brain,
      title: 'Subject-wise Practice',
      description: 'Organized sections for Tamil, Aptitude, General Studies, and Mental Ability',
    },
    {
      icon: Trophy,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with timed quizzes and instant feedback',
    },
    {
      icon: MessageCircle,
      title: 'AI Chatbot',
      description: 'Get instant doubt clarification with our intelligent AI assistant',
    },
  ]

  const subjects = [
    { name: 'Tamil', questions: '500+', color: 'bg-blue-500' },
    { name: 'Aptitude', questions: '750+', color: 'bg-green-500' },
    { name: 'General Studies', questions: '1200+', color: 'bg-purple-500' },
    { name: 'Mental Ability', questions: '600+', color: 'bg-orange-500' },
  ]

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Question Papers', value: '500+' },
    { label: 'Practice Questions', value: '25,000+' },
    { label: 'Success Rate', value: '85%' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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
            <Button variant="ghost" onClick={() => setAuthModal('login')}>
              Login
            </Button>
            <Button
              onClick={() => setAuthModal('signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">🎯 Your TNPSC Success Partner</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Master TNPSC with
            <br />
            Smart Preparation
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access previous year papers, practice with interactive quizzes, and get instant doubt clarification with our
            AI-powered platform designed specifically for TNPSC aspirants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setAuthModal('signup')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
            >
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources designed to help you crack TNPSC exams with confidence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Master Every Subject</h2>
            <p className="text-xl text-gray-600">Comprehensive coverage of all TNPSC exam subjects</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <CardHeader className="text-center">
                  <div
                    className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <CardDescription>{subject.questions} Questions</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your TNPSC Journey?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of successful candidates who trusted TNPSC Prep Hub</p>
          <Button
            size="lg"
            onClick={() => setAuthModal('signup')}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TNPSC Prep Hub</span>
              </div>
              <p className="text-gray-400">Your trusted partner for TNPSC exam preparation</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Previous Papers</li>
                <li>Practice Quizzes</li>
                <li>AI Chatbot</li>
                <li>Subject-wise Study</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Subjects</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Tamil</li>
                <li>Aptitude</li>
                <li>General Studies</li>
                <li>Mental Ability</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TNPSC Prep Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {authModal && (
        <AuthModal type={authModal} onClose={() => setAuthModal(null)} onSwitch={(type) => setAuthModal(type)} />
      )}
    </div>
  )
}

export default Landing