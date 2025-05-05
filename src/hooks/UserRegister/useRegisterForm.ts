// hooks/useRegisterForm.ts
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { publicFetch } from '@/lib/fetcher'

export const useRegisterForm = () => {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const isPasswordValid = /^[a-zA-Z0-9]{8,}$/.test(password)

  const handleRegister = async () => {
    setError('')
    setSuccess('')
    setFieldErrors({})
    setLoading(true)

    if (password !== confirmPassword) {
      setError('パスワードが一致しません。')
      setLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError('パスワードは半角英数字で8文字以上にしてください。')
      setLoading(false)
      return
    }
    const host = window.location.host
    const subdomain = host.replace(process.env.NEXT_PUBLIC_SUB_REPLACE!, '')
    const res = await publicFetch('/register', {
      method: 'POST',
      headers: {
        'x-subdomain': subdomain,
      },
      body: JSON.stringify({
        username,
        email,
        password,
        password_confirm: confirmPassword,
        first_name: firstName,
        last_name: lastName,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess('登録が完了しました。認証メールを送信しました。')
      setTimeout(() => router.push(`/register/success?username=${username}`), 3000)
    } else {
      setFieldErrors(data)
      setError('入力内容に誤りがあります。')
    }

    setLoading(false)
  }

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isPasswordValid,
    error,
    success,
    loading,
    fieldErrors,
    handleRegister,
  }
}
