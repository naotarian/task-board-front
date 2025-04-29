'use client'

import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'
import { useLoginForm } from '@/hooks/login/useLoginForm'
import { useOrganization } from '@/hooks/login/useOrganization'
export default function LoginPage() {
  const { loading, shouldRender } = useRedirectIfAuthenticated('/')
  const { organization } = useOrganization()
  const { username, setUsername, password, setPassword, error, handleLogin } = useLoginForm()

  if (loading || !shouldRender) return null
  const forgotPasswordPage = process.env.NEXT_PUBLIC_APP_URL + '/forgot-password'
  const registerPage = process.env.NEXT_PUBLIC_APP_URL + '/register'

  return (
    <div className="flex min-h-[calc(100svh-60px)] flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          {organization.logo && (
            <Image
              src={organization.logo}
              alt="Organization Logo"
              fill
              className="object-cover"
              sizes="64px"
            />
          )}
        </div>
      </a>
      <p className="text-gray-500">{organization?.name?.toUpperCase()}</p>

      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        {/* --- ログインカード --- */}
        <Card className="w-full px-0 md:p-6">
          <CardContent className=" space-y-6">
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
                className="mb-2"
              />
              <p className="text-right">
                <a
                  href={forgotPasswordPage}
                  className="text-primary text-sm underline hover:opacity-80"
                >
                  パスワードをお忘れですか？
                </a>
              </p>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleLogin}
                className="w-full hover:bg-white hover:text-primary hover:border hover:border-primary"
              >
                ログイン
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full text-primary hover:bg-primary hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    fill="currentColor"
                  />
                </svg>
                Login with Apple
              </Button>
              <Button
                variant="outline"
                className="w-full text-primary hover:bg-primary hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>

              <Typography as="p" muted className="text-center">
                <a href={registerPage} className="text-primary underline hover:opacity-80">
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
