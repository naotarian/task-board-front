'use client'

import { useState } from 'react'
import { publicFetch } from '@/lib/fetcher'
import { useUser } from '@/context/UserContext'
export const useLoginForm = () => {
  const { setUser } = useUser()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    try {
      const host = window.location.host
      const subdomain = host.replace(process.env.NEXT_PUBLIC_SUB_REPLACE!, '')
      const tokenRes = await publicFetch('/login', {
        method: 'POST',
        headers: {
          'x-subdomain': subdomain,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!tokenRes.ok) {
        const data = await tokenRes.json()
        console.error('Login failed:', data)
        throw new Error('ログインに失敗しました。ユーザー名またはパスワードが正しくありません。')
      }
      const data = await tokenRes.json()
      const token = data.token
      const user = data.user

      localStorage.setItem('auth_token', token)

      setUser({
        id: user.id,
        name: user.name,
        verified_at: user.email_verified_at,
        organizations: user.organizations,
      })

      window.location.href = '/'
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('不明なエラーが発生しました')
      }
    }
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleLogin,
  }
}
