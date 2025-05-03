'use client'

import { useEffect, useState } from 'react'
import { useSubdomain } from '@/hooks/useSubdomain'
import { useRouter } from 'next/navigation'
import { authFetch } from '@/lib/fetcher'
import { useUser } from '@/context/UserContext'

export type Member = {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
}

export type OrganizationDetail = {
  id: string
  name: string
  subdomain: string
  thumbnail: string | null
  projects: Array<{
    id: string
    name: string
    thumbnail: string | null
  }>
  members: Member[]
  myRole: 'owner' | 'admin' | 'member'
}

export const useOrganizationDetail = () => {
  const { user } = useUser()
  const subdomain = useSubdomain()
  const router = useRouter()

  const [organization, setOrganization] = useState<OrganizationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!subdomain || !user) return

    const fetchData = async () => {
      try {
        const res = await authFetch(`/organizations/${subdomain}`)
        if (res.status === 404) {
          router.replace('/404')
          return
        }
        if (!res.ok) throw new Error()

        const data = await res.json()

        const myMember = data.members.find((member: Member) => member.email === user.email)
        const myRole: OrganizationDetail['myRole'] = myMember?.role || 'member'

        setOrganization({ ...data, myRole })
      } catch {
        setError('組織情報の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [subdomain, user, router])

  return { organization, loading, error }
}
