'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { useLogout } from '@/hooks/useLogout'

export const useAuthGuard = (redirectTo = '/login') => {
  const { user, loading, statusCode } = useUser()
  const logout = useLogout()
  const router = useRouter()

  useEffect(() => {
    if (statusCode === 403) {
      logout()
      const toppage = process.env.NEXT_PUBLIC_SERVICE_TOP_PAGE_URL!
      router.push(toppage + '/login')
    } else {
      if (!loading && !user) {
        router.replace(redirectTo)
      }
    }
  }, [user, loading, redirectTo, router, statusCode, logout])

  return { loading, shouldRender: user !== null && !loading }
}
