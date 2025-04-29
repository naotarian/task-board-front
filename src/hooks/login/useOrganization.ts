'use client'

import { useEffect, useState } from 'react'
import { publicFetch } from '@/lib/fetcher'

export const useOrganization = () => {
  const [organization, setOrganization] = useState({ name: '', logo: '' })

  useEffect(() => {
    const fetchOrganization = async (subdomain: string) => {
      const organizationRes = await publicFetch('/organizations', {
        headers: {
          'x-subdomain': subdomain,
        },
      })
      const data = await organizationRes.json()
      setOrganization(data)
    }

    const host = window.location.host
    const subdomain = host.replace(`${process.env.NEXT_PUBLIC_SUB_REPLACE}`, '')

    if (subdomain && subdomain !== process.env.NEXT_PUBLIC_SUB_REPLACE) {
      fetchOrganization(subdomain)
    } else {
      setOrganization(prev => ({
        ...prev,
        name: 'task-board',
      }))
    }
  }, [])

  return {
    organization,
  }
}
