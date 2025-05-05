'use client'

import { useUser } from '@/context/UserContext'
import { publicFetch } from '@/lib/fetcher'
export const useLogout = () => {
  const { setUser } = useUser()

  const logout = async (onAfterLogout?: () => void) => {
    try {
      setUser(null)
      const host = window.location.host
      const subdomain = host.replace(process.env.NEXT_PUBLIC_SUB_REPLACE!, '')
      const res = await publicFetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-subdomain': subdomain,
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      if (!res.ok) {
        console.error('ログアウトAPI呼び出し失敗', res.status)
        return
      }
    } catch (err) {
      console.error('ログアウトAPI呼び出し失敗', err)
    }

    setUser(null)
    if (onAfterLogout) onAfterLogout()

    // 必要ならリダイレクト
    window.location.href = '/login'
  }

  return logout
}
