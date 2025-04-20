'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

export const useRequireVerified = () => {
  const { user, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  const [shouldRender, setShouldRender] = useState(false)

  const isPublicPage =
    pathname.startsWith('/register/success') || pathname.startsWith('/verify-email')

  useEffect(() => {
    if (loading) return

    if (user && !user.verified_at && !isPublicPage) {
      router.push(`/register/success?username=${user.name}`)
    } else {
      setShouldRender(true)
    }
  }, [loading, user, isPublicPage, router])

  return { loading, shouldRender }
}
