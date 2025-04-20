import { authFetch } from '@/lib/fetcher'

export type Project = {
  id: string
  name: string
  description: string | null
  thumbnail: string | null
  created_at: string
  updated_at: string
}

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await authFetch('/projects')

  if (!res.ok) {
    throw new Error('プロジェクト一覧の取得に失敗しました')
  }

  return await res.json()
}
