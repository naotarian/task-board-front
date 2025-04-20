'use client'

import { Container, Paper, Typography, Box, Alert } from '@mui/material'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/components/forms/ProjectForm'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function ProjectCreatePage() {
  const { loading, shouldRender } = useAuthGuard('/login')
  const router = useRouter()
  const [error, setError] = useState('')

  const handleSubmit = async (formData: {
    name: string
    description: string
    thumbnail: File | null
  }): Promise<Record<string, string[]> | null> => {
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      if (formData.thumbnail) data.append('thumbnail', formData.thumbnail)

      const res = await fetch('http://localhost:8000/api/projects/create/', {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })

      if (!res.ok) {
        const body = await res.json()
        if (body && typeof body === 'object') {
          return body // ← フィールドエラー返す
        }
        throw new Error('プロジェクト作成に失敗しました。')
      }

      const project = await res.json()
      router.push(`/projects/${project.id}`)
      return null
    } catch (err: any) {
      setError(err.message)
      return null
    }
  }

  if (loading || !shouldRender) return null

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          プロジェクト作成
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box>
          <ProjectForm onSubmit={handleSubmit} />
        </Box>
      </Paper>
    </Container>
  )
}
