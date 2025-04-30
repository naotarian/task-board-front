'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import Link from 'next/link'
import Image from 'next/image'
import { useMyProjects } from '@/hooks/user/useMyProjects'
import { Skeleton } from '@/components/ui/skeleton'
import { FolderOpen } from 'lucide-react'

type Project = {
  id: string
  name: string
  thumbnail: string | null
  organization: {
    id: string
    name: string
    subdomain: string
  }
}

export const ProjectCardList = () => {
  const { projects, loading, error } = useMyProjects()

  const getProjectUrl = (project: Project) => {
    return `https://${project.organization.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}/projects/${project.id}`
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground font-medium">参加プロジェクト</p>

      {loading &&
        Array.from({ length: 1 }).map((_, idx) => (
          <Card key={idx} className="py-2 rounded-none">
            <CardHeader className="pb-1 flex flex-row items-baseline gap-3">
              <Skeleton className="w-8 h-8 rounded-sm" />
              <div className="flex flex-col gap-1 flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </CardHeader>
          </Card>
        ))}

      {!loading && projects.length === 0 && (
        <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          <FolderOpen className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
          <p className="font-medium text-base mb-1">参加しているプロジェクトはありません</p>
          <p className="text-xs text-muted-foreground">管理者からの招待をお待ちください。</p>
        </div>
      )}

      {!loading &&
        projects.map(project => (
          <Card key={project.id} className="h-16 hover:shadow-sm transition py-2 rounded-none">
            <CardHeader className="pb-1 flex flex-row items-start gap-3">
              {project.thumbnail ? (
                <Image
                  src={project.thumbnail}
                  alt="Project Thumbnail"
                  width={48}
                  height={48}
                  className="rounded-sm object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-sm bg-muted flex items-center justify-center text-xs font-bold text-primary">
                  {project.name.charAt(0)}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-base leading-tight">
                  <Link
                    href={getProjectUrl(project)}
                    className="underline text-primary hover:opacity-80"
                  >
                    {project.name}
                  </Link>
                </CardTitle>
                <Typography muted className="text-xs !mt-0">
                  所属組織：{project.organization.name}（{project.organization.subdomain}）
                </Typography>
              </div>
            </CardHeader>
          </Card>
        ))}
    </div>
  )
}
