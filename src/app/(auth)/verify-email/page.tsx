'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useVerifyEmail } from '@/hooks/verifyEmail/useVerifyEmail'
import { FullScreenLoader } from '@/components/common/FullScreenLoader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const uid = searchParams.get('uid')
  const token = searchParams.get('token')
  const router = useRouter()

  const { status, errorMessage } = useVerifyEmail(uid, token)

  if (status === 'loading') {
    return <FullScreenLoader message="メール認証中です..." />
  }
  return (
    <div className="flex min-h-[calc(100svh-60px)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'success' ? '認証完了 🎉' : '認証エラー'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'success' ? (
            <>
              <Typography as="p" className="text-center text-muted-foreground">
                メールアドレスの認証が完了しました！
              </Typography>
              <Button className="w-full" onClick={() => router.push('/login')}>
                TOP
              </Button>
            </>
          ) : (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
