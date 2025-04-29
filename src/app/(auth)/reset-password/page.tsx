'use client'

import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

import { FullScreenLoader } from '@/components/common/FullScreenLoader'
import { useResetPasswordForm } from '@/hooks/passwordReset/useResetPasswordForm'

export default function ResetPasswordPage() {
  const { loading, shouldRender } = useRedirectIfAuthenticated('/')
  const {
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
  } = useResetPasswordForm()

  if (!uid || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Alert variant="destructive">
          <AlertDescription>不正なURLです。</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading || !shouldRender) return null

  if (resetCompleted) {
    return <FullScreenLoader message="パスワードをリセットしました。ログイン画面へ移動します..." />
  }

  return (
    <div className="flex min-h-[calc(100svh-60px)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">新しいパスワードを設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="新しいパスワード"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={!!password && !isValidPassword ? 'border-red-500' : ''}
          />
          {password && !isValidPassword && (
            <p className="text-sm text-red-500">半角英数字8文字以上で入力してください</p>
          )}

          <Input
            placeholder="確認用パスワード"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className={!!confirmPassword && password !== confirmPassword ? 'border-red-500' : ''}
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-red-500">パスワードが一致しません</p>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={
              !password ||
              !confirmPassword ||
              password !== confirmPassword ||
              !isValidPassword ||
              showLoader
            }
          >
            {showLoader ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'パスワードを変更する'
            )}
          </Button>

          {successMessage && (
            <Alert variant="default">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
