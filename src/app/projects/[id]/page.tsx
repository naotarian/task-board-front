'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Box, Container, Typography, CircularProgress, Alert, Paper } from '@mui/material'
import Image from 'next/image'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function ProjectDetailPage() {
  useAuthGuard('/login')
  const { id } = useParams()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/projects/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'プロジェクトの取得に失敗しました。')
        }

        const data = await res.json()
        setProject(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          bgcolor: '#fff',
        }}
      >
        {/* サムネイル + タイトル 横並び */}
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          {project.thumbnail && (
            <Box
              sx={{
                width: 100,
                height: 60,
                overflow: 'hidden',
                borderRadius: 2,
                border: '1px solid #eee',
                flexShrink: 0,
              }}
            >
              <Image
                src={project.thumbnail}
                alt="Thumbnail"
                width={100}
                height={60}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </Box>
          )}

          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {project.name}
          </Typography>
        </Box>

        {/* 説明 */}
        <Typography variant="body1" color="text.secondary">
          {project.description || '説明なし'}
        </Typography>
      </Paper>
    </Container>
  )
}
