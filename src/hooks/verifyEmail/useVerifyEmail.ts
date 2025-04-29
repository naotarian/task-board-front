'use client'

import { useEffect, useState } from 'react'
import { publicFetch } from '@/lib/fetcher'
import { useUser } from '@/context/UserContext'

type Status = 'loading' | 'success' | 'error'

export const useVerifyEmail = (uid: string | null, token: string | null) => {
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const { user, setUser } = useUser()

  useEffect(() => {
    if (!uid || !token) {
      setStatus('error')
      setErrorMessage('URLが無効です。')
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await publicFetch(`/verify-email/?uid=${uid}&token=${token}`)
        const data = await res.json()

        if (res.ok) {
          if (data.user?.verified_at && user) {
            setUser({
              ...user,
              verified_at: data.user.verified_at,
            })
          }
          setStatus('success')
        } else {
          const data = await res.json()
          setStatus('error')
          setErrorMessage(data.error || '認証に失敗しました。')
        }
      } catch {
        setStatus('error')
        setErrorMessage('サーバーへの接続に失敗しました。')
      }
    }

    verifyEmail()
  }, [uid, token, user, setUser])

  return { status, errorMessage }
}
