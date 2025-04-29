'use client'

import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Typography } from '@/components/ui/typography'
import { useForgotPasswordForm } from '@/hooks/forgotPassword/useForgotPasswordForm'
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { loading: authLoading, shouldRender } = useRedirectIfAuthenticated('/')
  const { identifier, setIdentifier, message, error, loading, handleSubmit } =
    useForgotPasswordForm()

  if (authLoading || !shouldRender) return null

  return (
    <div className="flex min-h-[calc(100svh-60px)] items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-md">
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <Typography as="p" muted className="font-bold">
                パスワードを忘れた方
              </Typography>
              <Typography as="p" muted>
                登録済みのメールアドレスまたはユーザー名を入力してください。
              </Typography>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="メールアドレスまたはユーザー名"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
              />

              <Button className="w-full" onClick={handleSubmit} disabled={!identifier || loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : '送信する'}
              </Button>

              {message && (
                <Alert variant="success">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
