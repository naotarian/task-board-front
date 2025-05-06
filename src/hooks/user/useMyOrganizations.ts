'use client'

import { useEffect, useState } from 'react'
import { authFetch } from '@/lib/fetcher'

export type Organization = {
  id: string
  name: string
  subdomain: string
  logo: string | null
  thumbnail: string | null
}

export const useMyOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await authFetch('/organizations')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || '取得に失敗しました')
        console.log(data.organizations)
        setOrganizations(data.organizations)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrgs()
  }, [])

  return { organizations, loading, error }
}
