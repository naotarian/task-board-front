'use client'

import { useEffect, useState } from 'react'
import { authFetch } from '@/lib/fetcher'
import { useSubdomain } from '@/hooks/useSubdomain'

export type Project = {
  id: string
  name: string
  thumbnail: string | null
  organization: {
    id: string
    name: string
    subdomain: string
  }
}

export const useMyProjects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subdomain = useSubdomain()

  useEffect(() => {
    // サブドメインがまだ判定されていないときは処理をスキップ
    if (subdomain === null) return

    const fetchProjects = async () => {
      try {
        const res = await authFetch('/user/projects', {
          headers: {
            'x-subdomain': subdomain,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data = await res.json()
        setProjects(data)
      } catch {
        setError('プロジェクトの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [subdomain])

  return { projects, loading, error }
}
