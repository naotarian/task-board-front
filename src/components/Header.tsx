'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { useLogout } from '@/hooks/useLogout'
import Link from 'next/link'
import { LogInIcon } from 'lucide-react'
import { PopoverContent } from '@/components/ui/popover'
import { PopoverTrigger } from '@/components/ui/popover'
import { Popover } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
export const Header = () => {
  const { user, loading } = useUser()
  const logout = useLogout()
  const router = useRouter()
  const [popoverOpen, setPopoverOpen] = useState(false)

  if (loading) return null

  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="mx-auto px-4 py-3 flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold">
          <Link href="/">TaskBoard</Link>
        </h1>

        <div className="flex items-center gap-4">
          {user ? (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer w-8 h-8 border border-white/40 bg-muted text-white">
                  <AvatarFallback className="w-full h-full flex items-center justify-center rounded-full bg-zinc-700 text-white font-semibold text-sm leading-none">
                    {user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent
                className="w-64 animate-in fade-in zoom-in-95 duration-200 shadow-md"
                sideOffset={8}
              >
                <div className="p-4 border-b">
                  <p className="text-sm text-muted-foreground">ログイン中</p>
                  <p className="text-sm font-medium truncate">{user.name}</p>
                </div>

                <div className="p-2 flex flex-col gap-1">
                  {/* 今後メニューを追加する箇所 */}
                  <Button
                    variant="ghost"
                    className="justify-start w-full border-none focus-visible:ring-0 hover:bg-accent"
                    onClick={() => router.push('/dashboard')}
                  >
                    ダッシュボード
                  </Button>

                  <Button
                    variant="ghost"
                    className="justify-start w-full border-none focus-visible:ring-0 hover:bg-accent"
                    onClick={() => router.push('/settings')}
                  >
                    設定
                  </Button>

                  <div className="border-t pt-2">
                    <Button variant="outline" className="w-full" onClick={() => logout()}>
                      ログアウト
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Button variant="ghost" onClick={() => router.push('/login')} size="icon">
              <LogInIcon className="w-6 h-6" />
              <span className="sr-only">ログイン</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
