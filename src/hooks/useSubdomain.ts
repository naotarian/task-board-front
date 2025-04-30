'use client'

import { useEffect, useState } from 'react'

export const useSubdomain = (): string | null => {
  const [subdomain, setSubdomain] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const hostname = window.location.hostname
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost'

    // localhost（サブドメインなし）の場合
    if (hostname === baseDomain) {
      setSubdomain('')
      return
    }

    // baseDomain が含まれていなければ不正扱い
    if (!hostname.endsWith(baseDomain)) {
      setSubdomain(null)
      return
    }

    const possibleSubdomain = hostname.replace(`.${baseDomain}`, '')

    // www や空はサブドメインなし扱い（null でなく '' にする）
    if (!possibleSubdomain || possibleSubdomain === 'www') {
      setSubdomain('')
    } else {
      setSubdomain(possibleSubdomain)
    }
  }, [])

  return subdomain
}
