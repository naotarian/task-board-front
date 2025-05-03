'use client'

import { useState } from 'react'
import { authFetch } from '@/lib/fetcher'

type Role = 'admin' | 'member' | 'owner'

export const useUpdateMemberRole = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateRole = async (orgId: string, userId: string, role: Role) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authFetch(`/organizations/${orgId}/members/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error('更新に失敗しました')
      return true
    } catch (err) {
      setError('更新に失敗しました')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { updateRole, loading, error }
}
