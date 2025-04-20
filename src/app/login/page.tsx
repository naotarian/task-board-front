'use client'

import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'
import { useUser } from '@/context/UserContext'
import { publicFetch, authFetch } from '@/lib/fetcher'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const { loading, shouldRender } = useRedirectIfAuthenticated('/')
  const { setUser } = useUser()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')

    try {
      const tokenRes = await publicFetch('/token', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })

      if (!tokenRes.ok) {
        throw new Error('ログインに失敗しました。ユーザー名またはパスワードが正しくありません。')
      }

      const tokenData = await tokenRes.json()
      localStorage.setItem('access_token', tokenData.access)
      localStorage.setItem('refresh_token', tokenData.refresh)

      const meRes = await authFetch('/me', {
        headers: {
          Authorization: `Bearer ${tokenData.access}`,
        },
      })

      if (!meRes.ok) {
        throw new Error('ユーザー情報の取得に失敗しました')
      }

      const me = await meRes.json()
      setUser({
        id: me.id,
        name: me.username,
        verified_at: me.verified_at,
      })

      window.location.href = '/'
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('不明なエラーが発生しました')
        console.error('Unexpected error:', err)
      }
    }
  }

  if (loading || !shouldRender) return null

  return (
    <div className="flex justify-center items-center min-h-screen mt-[-60px]">
      <Card className="w-full max-w-md p-6">
        <CardContent className="space-y-6">
          <Typography as="h2" className="text-center">
            ログイン
          </Typography>

          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="ユーザー名"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleLogin} className="w-full">
              ログイン
            </Button>

            <Typography as="p" muted className="text-center">
              <a href="/forgot-password" className="text-primary underline hover:opacity-80">
                パスワードをお忘れですか？
              </a>
            </Typography>

            <Typography as="p" muted className="text-center">
              <a href="/register" className="text-primary underline hover:opacity-80">
                アカウントをお持ちでない方はこちら
              </a>
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
