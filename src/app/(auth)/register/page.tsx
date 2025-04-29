'use client'

import { useRegisterForm } from '@/hooks/UserRegister/useRegisterForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { FullScreenLoader } from '@/components/common/FullScreenLoader'

export default function RegisterPage() {
  const {
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
  } = useRegisterForm()

  if (success) {
    return <FullScreenLoader message="登録が完了しました。認証メールを送信しました..." />
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
            <Alert variant="success">
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
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="email">メールアドレス *</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
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
                className={!!password && !isPasswordValid ? 'border-red-500' : ''}
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
                className={
                  !!confirmPassword && password !== confirmPassword ? 'border-red-500' : ''
                }
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
            <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
            {fieldErrors.last_name && (
              <p className="text-sm text-red-500">{fieldErrors.last_name[0]}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="firstName">名（任意）</Label>
            <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
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
              !isPasswordValid ||
              loading
            }
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : '登録する'}
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
}
