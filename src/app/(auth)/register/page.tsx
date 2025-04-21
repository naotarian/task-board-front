'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Eye, EyeOff } from 'lucide-react'
import { Container } from '@/components/ui/container'

export default function RegisterPage() {
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const isPasswordValid = /^[a-zA-Z0-9]{8,}$/.test(password)

  const handleRegister = async () => {
    setError('')
    setSuccess('')
    setFieldErrors({})

    if (password !== confirmPassword) {
      setError('パスワードが一致しません。')
      return
    }

    if (!isPasswordValid) {
      setError('パスワードは半角英数字で8文字以上にしてください。')
      return
    }

    const res = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  }

  return (
    <Container>
      <Card className="w-full max-w-xl mx-auto mt-12">
        <CardHeader>
          <CardTitle>ユーザー登録</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
              <AlertTitle>成功</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-1">
            <Label htmlFor="username">ユーザー名 *</Label>
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="focus-visible:ring-1 focus-visible:ring-ring border border-input"
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="email">メールアドレス *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="focus-visible:ring-1 focus-visible:ring-ring border border-input"
            />
            {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email[0]}</p>}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="password">パスワード *（半角英数字8文字以上）</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`focus-visible:ring-1 focus-visible:ring-ring border border-input ${
                  !!password && !isPasswordValid ? 'border-red-500' : ''
                }`}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {fieldErrors.password && (
              <p className="text-sm text-red-500">{fieldErrors.password[0]}</p>
            )}
            {!!password && !isPasswordValid && !fieldErrors.password && (
              <p className="text-sm text-red-500">半角英数字で8文字以上にしてください</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="confirmPassword">パスワード（確認用） *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`focus-visible:ring-1 focus-visible:ring-ring border border-input ${
                  !!confirmPassword && password !== confirmPassword ? 'border-red-500' : ''
                }`}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {fieldErrors.password_confirm && (
              <p className="text-sm text-red-500">{fieldErrors.password_confirm[0]}</p>
            )}
            {!!confirmPassword && password !== confirmPassword && !fieldErrors.password_confirm && (
              <p className="text-sm text-red-500">パスワードが一致しません</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="lastName">姓（任意）</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="focus-visible:ring-1 focus-visible:ring-ring border border-input"
            />
            {fieldErrors.last_name && (
              <p className="text-sm text-red-500">{fieldErrors.last_name[0]}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="firstName">名（任意）</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="focus-visible:ring-1 focus-visible:ring-ring border border-input"
            />
            {fieldErrors.first_name && (
              <p className="text-sm text-red-500">{fieldErrors.first_name[0]}</p>
            )}
          </div>

          <Button
            onClick={handleRegister}
            disabled={
              !username ||
              !email ||
              !password ||
              !confirmPassword ||
              password !== confirmPassword ||
              !isPasswordValid
            }
          >
            登録する
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
}
