'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLogout } from '@/hooks/useLogout'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { authFetch } from '@/lib/fetcher'

export const useRegisterSuccess = () => {
  const { loading, shouldRender } = useAuthGuard('/login')
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''

  const [resentLoading, setResentLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const logout = useLogout()

  const handleResend = async () => {
    setResentLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await authFetch('/email/verification-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('再送信しました！メールをご確認ください。')
      } else {
        if (data.alreadyVerified) {
          window.location.href = '/login'
          return
        } else {
          setError(data.message || '再送信に失敗しました。')
        }
      }
    } catch {
      setError('サーバーに接続できませんでした。')
    } finally {
      setResentLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  return {
    loading,
    shouldRender,
    message,
    error,
    resentLoading,
    handleResend,
    handleLogout,
  }
}
