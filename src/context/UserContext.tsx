'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { authFetch } from '@/lib/fetcher'

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
  const searchParams = useSearchParams()
  const router = useRouter()

  const subdomain =
    typeof window !== 'undefined'
      ? window.location.host.replace(process.env.NEXT_PUBLIC_SUB_REPLACE!, '')
      : ''

  useEffect(() => {
    const initUser = async () => {
      try {
        const queryToken = searchParams.get('token')
        const token = queryToken ? decodeURIComponent(queryToken) : null
        if (token) {
          // トークン交換リクエスト
          const res = await fetch(`/api/token-exchange`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'x-subdomain': subdomain,
            },
          })
          setStatusCode(res.status)

          if (res.ok) {
            const data = await res.json()
            const token = data.token
            localStorage.setItem('auth_token', token)
            setUser({
              id: data.user.id,
              name: data.user.name,
              verified_at: data.user.email_verified_at,
              organizations: data.user.organizations,
            })

            // クエリパラメータを消す（URLを綺麗に）
            const newUrl =
              window.location.pathname + window.location.search.replace(/token=[^&]+&?/, '')
            window.history.replaceState({}, '', newUrl.replace(/[\?&]$/, ''))
          } else {
            setUser(null)
          }
        } else {
          // 通常の /me リクエスト
          const token = localStorage.getItem('auth_token')
          if (!token) {
            setUser(null)
            setStatusCode(401)
            return
          }

          const res = await authFetch(`/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'x-subdomain': subdomain,
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
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        setUser(null)
        setStatusCode(null)
      } finally {
        setLoading(false)
      }
    }

    initUser()
  }, [searchParams, subdomain])

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
