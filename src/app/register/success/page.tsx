'use client'

import { Container, Paper, Typography, Box, Button, Alert } from '@mui/material'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLogout } from '@/hooks/useLogout'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { authFetch } from '@/lib/fetcher'

export default function RegisterSuccessPage() {
  const { loading, shouldRender } = useAuthGuard('/login')
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''

  const [resentLoading, setResentLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const logout = useLogout()

  const handleResend = async () => {
    setResentLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await authFetch('/resend-verification/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('再送信しました！メールをご確認ください。')
      } else {
        setError(data.error || '再送信に失敗しました。')
      }
    } catch {
      setError('サーバーに接続できませんでした。')
    } finally {
      setResentLoading(false)
    }
  }
  if (loading || !shouldRender) return null
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          メールアドレス確認のお願い ✉️
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          登録したメールアドレス宛に確認メールを送信しました。
          <br />
          認証リンクをクリックして登録を完了してください。
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" onClick={handleResend} disabled={resentLoading}>
            認証メールを再送する
          </Button>
          <Button onClick={() => logout()}>ログアウト</Button>
        </Box>
      </Paper>
    </Container>
  )
}
