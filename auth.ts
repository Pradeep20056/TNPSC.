export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token)
}

export const getAuthToken = () => {
  return localStorage.getItem('token')
}

export const removeAuthToken = () => {
  localStorage.removeItem('token')
}

interface User {
  id: number;
  name: string;
}

export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const getUser = (): User | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const removeUser = () => {
  localStorage.removeItem('user')
}

export const logout = () => {
  removeAuthToken()
  removeUser()
  window.location.href = '/'
}