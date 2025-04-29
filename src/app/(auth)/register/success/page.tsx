'use client'

import { useRegisterSuccess } from '@/hooks/userRegisterSuccess/useRegisterSuccess'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Container } from '@/components/ui/container'
import { Loader2 } from 'lucide-react'

export default function RegisterSuccessPage() {
  const { loading, shouldRender, message, error, resentLoading, handleResend, handleLogout } =
    useRegisterSuccess()

  if (loading || !shouldRender) return null

  return (
    <Container>
      <Card className="w-full max-w-lg mx-auto mt-12">
        <CardHeader>
          <CardTitle className="text-center">メールアドレス確認のお願い ✉️</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            登録したメールアドレス宛に確認メールを送信しました。
            <br />
            認証リンクをクリックして登録を完了してください。
          </p>

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

          <div className="flex justify-center gap-2">
            <Button onClick={handleResend} disabled={resentLoading}>
              {resentLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                '認証メールを再送する'
              )}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              ログアウト
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}
