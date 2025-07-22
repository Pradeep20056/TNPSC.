import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/api/auth/register', userData),
  login: (credentials: any) => api.post('/api/auth/login', credentials),
}

// Subjects API
export const subjectsAPI = {
  getAll: () => api.get('/api/subjects'),
  getQuestions: (subjectId: number) => api.get(`/api/subjects/${subjectId}/questions`),
}

// Quiz API
export const quizAPI = {
  getAll: () => api.get('/api/quizzes'),
  create: (quizData: any) => api.post('/api/quizzes', quizData),
}

// Question Papers API
export const papersAPI = {
  getAll: (params?: any) => api.get('/api/question-papers', { params }),
}

// Chat API
export const chatAPI = {
  sendMessage: (message: string) => api.post('/api/chat', { message }),
}

// User Progress API
export const progressAPI = {
  get: () => api.get('/api/user/progress'),
  update: (progressData: any) => api.post('/api/user/progress', progressData),
}

export default api