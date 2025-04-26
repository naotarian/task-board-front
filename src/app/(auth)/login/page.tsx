'use client'

import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'
import { useUser } from '@/context/UserContext'
import { publicFetch, authFetch } from '@/lib/fetcher'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'

export default function LoginPage() {
  const { loading, shouldRender } = useRedirectIfAuthenticated('/')
  const { setUser } = useUser()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [organization, setOrganization] = useState({ name: '', logo: '' })

  useEffect(() => {
    const fetchOrganization = async (subdomain: string) => {
      const organizationRes = await publicFetch('/organizations/', {
        headers: {
          'x-subdomain': subdomain,
        },
      })
      const data = await organizationRes.json()
      setOrganization(data)
    }

    const host = window.location.host
    const subdomain = host.replace(`.${process.env.NEXT_PUBLIC_DOMAIN}`, '')
    console.log(subdomain)
    if (subdomain && subdomain !== process.env.NEXT_PUBLIC_DOMAIN) {
      fetchOrganization(subdomain)
    } else {
      setOrganization(prev => ({
        ...prev,
        name: 'task-board',
      }))
    }
  }, [])

  const handleLogin = async () => {
    setError('')

    try {
      const host = window.location.host
      const subdomain = host.replace('.localhost:3000', '')
      const tokenRes = await publicFetch('/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-subdomain': subdomain,
        },
        body: JSON.stringify({ username, password }),
      })

      if (!tokenRes.ok) {
        const data = await tokenRes.json()
        console.error('Login failed:', data)
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
    <div className="flex justify-center items-center min-h-screen mt-[-60px] p-4">
      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        {/* --- ログインカード --- */}
        <Card className="w-full p-6">
          <CardContent className="flex items-center gap-4">
            {organization.logo && (
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src={organization.logo}
                  alt="Organization Logo"
                  width={64}
                  height={64}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  className="rounded-full object-cover border border-gray-300"
                />
              </div>
            )}
            <div className="flex flex-col justify-center">
              <Typography as="p" muted className="text-lg text-gray-500">
                {organization.name.toUpperCase()}
              </Typography>
            </div>
          </CardContent>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="ユーザー名"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

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
    </div>
  )
}
