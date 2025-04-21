'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const menuItems = [
  { label: 'プロフィール', href: '/settings/profile' },
  { label: 'パスワード', href: '/settings/password' },
  { label: '通知設定', href: '/settings/notifications' },
  { label: '表示設定', href: '/settings/display' },
  { label: 'セキュリティ', href: '/settings/security' },
  { label: '支払い情報', href: '/settings/billing' },
  { label: '接続サービス', href: '/settings/integrations' },
  { label: 'アカウント削除', href: '/settings/delete-account' },
]

export const SettingsSidebar = () => {
  useAuthGuard('/login')
  const pathname = usePathname()
  const activeRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [])

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-muted/30">
      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible p-4 gap-2 text-sm font-medium whitespace-nowrap">
        {menuItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              ref={isActive ? activeRef : null}
              className={cn(
                'px-4 py-2 rounded-md min-w-max transition-colors',
                isActive
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-accent'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
