'use client'

import { useState } from 'react'
import { publicFetch } from '@/lib/fetcher'

export const useForgotPasswordForm = () => {
  const [identifier, setIdentifier] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const res = await publicFetch('/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier }),
      })

      if (res.ok) {
        setMessage('パスワードリセット用のメールを送信しました。')
        setIdentifier('')
      } else {
        const data = await res.json()
        setError(data.error || '送信に失敗しました')
      }
    } catch (err) {
      console.error(err)
      setError('システムエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return {
    identifier,
    setIdentifier,
    message,
    error,
    loading,
    handleSubmit,
  }
}
