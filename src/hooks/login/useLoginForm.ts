'use client'

import { useState } from 'react'
import { publicFetch, authFetch } from '@/lib/fetcher'
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
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      if (!tokenRes.ok) {
        const data = await tokenRes.json()
        console.error('Login failed:', data)
        throw new Error('ログインに失敗しました。ユーザー名またはパスワードが正しくありません。')
      }

      const meRes = await authFetch('/me', {
        headers: {
          'Content-Type': 'application/json',
          'x-subdomain': subdomain,
        },
        credentials: 'include',
      })

      if (!meRes.ok) {
        throw new Error('ユーザー情報の取得に失敗しました')
      }

      const me = await meRes.json()
      setUser({
        id: me.id,
        name: me.username,
        verified_at: me.verified_at,
        organizations: me.organizations,
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
