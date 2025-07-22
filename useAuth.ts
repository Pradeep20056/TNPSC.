import { useState, useEffect } from 'react'
import { getUser, getAuthToken, logout, setUser as setLSUser } from '@/utils/auth'

interface User {
  id: number;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    const currentUser = getUser()
    if (token && currentUser) {
      setUser(currentUser)
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [])

  return { user, loading, logout }
}
