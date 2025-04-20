'use client'

import { useEffect, useState } from 'react'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { fetchProjects, Project } from '@/lib/api/projects'
import { ProjectCard } from '@/app/ProjectCard'
import { Container } from '@/components/ui/container'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const { loading: authLoading, shouldRender } = useAuthGuard('/login')
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects()
        setProjects(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  if (authLoading || !shouldRender) return null

  return (
    <Container className="mt-10">
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <p className="text-muted-foreground">プロジェクトがありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </Container>
  )
}
