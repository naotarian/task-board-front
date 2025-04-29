'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { publicFetch } from '@/lib/fetcher'

export const useResetPasswordForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const uid = searchParams.get('uid')
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [resetCompleted, setResetCompleted] = useState(false)

  const isValidPassword = /^[a-zA-Z0-9]{8,}$/.test(password)

  const handleSubmit = async () => {
    setSuccessMessage('')
    setErrorMessage('')
    setShowLoader(true)

    if (password !== confirmPassword) {
      setShowLoader(false)
      setErrorMessage('パスワードが一致しません')
      return
    }

    if (!isValidPassword) {
      setShowLoader(false)
      setErrorMessage('パスワードの形式が正しくありません')
      return
    }

    try {
      const res = await publicFetch('/password-reset-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          token,
          new_password: password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setResetCompleted(true)
        setSuccessMessage('パスワードをリセットしました。ログイン画面へ移動します。')
        setTimeout(() => router.push('/login'), 3000)
      } else {
        setErrorMessage(data.error || 'パスワードのリセットに失敗しました。')
      }
    } catch (err) {
      console.error(err)
      setErrorMessage('システムエラーが発生しました。')
    } finally {
      setShowLoader(false)
    }
  }

  return {
    uid,
    token,
    password,
    confirmPassword,
    showLoader,
    successMessage,
    errorMessage,
    resetCompleted,
    isValidPassword,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  }
}
