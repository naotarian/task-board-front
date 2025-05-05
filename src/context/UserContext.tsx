'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type User = {
  id: string
  name: string
  verified_at: string | null
  organizations: Array<{
    id: string
    name: string
    subdomain: string
    logo: string | null
    roles: Array<{
      name: string
      display_name: string
    }>
  }>
}

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
  statusCode: number | null
  setStatusCode: (code: number | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!
        const res = await fetch(`${API_URL}/me`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'x-subdomain': window.location.host.replace(process.env.NEXT_PUBLIC_SUB_REPLACE!, ''),
          },
        })
        setStatusCode(res.status)
        if (res.ok) {
          const data = await res.json()
          setUser({
            id: data.id,
            name: data.name,
            verified_at: data.email_verified_at,
            organizations: data.organizations,
          })
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        setStatusCode(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading, statusCode, setStatusCode }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}
