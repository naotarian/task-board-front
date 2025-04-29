'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

export const useRedirectIfAuthenticated = (redirectTo = '/') => {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      if (!user.verified_at) {
        router.replace(`/register/success?username=${user.name}`)
      } else {
        router.replace(redirectTo)
      }
    }
  }, [user, loading, redirectTo, router])

  return { loading, shouldRender: !user && !loading }
}
