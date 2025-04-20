'use client'

import { Typography, Container, Button } from '@mui/material'
import { authFetch } from '@/lib/fetcher'
import { useUser } from '@/context/UserContext'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function Home() {
  const { loading, shouldRender } = useAuthGuard('/login')
  const { setUser } = useUser()
  const userFetch = async () => {
    try {
      const res = await authFetch('/me')
      if (!res.ok) {
        throw new Error('ユーザー情報の取得に失敗しました')
      }
      const me = await res.json()
      setUser({
        id: me.id,
        name: me.username,
        verified_at: me.verified_at,
      })
    } catch (err) {
      console.error(err)
    }
  }
  if (loading || !shouldRender) return null
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">タスク管理アプリてきなやつ作るンゴ</Typography>
      <Typography sx={{ mt: 2 }}>んごんごんごんごんごんごんごんごんごんごんごんごぉぉぉ</Typography>
      <Button onClick={userFetch}>ユーザー情報取得</Button>
    </Container>
  )
}
