'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import Image from 'next/image'
import Link from 'next/link'

type Project = {
  id: string
  name: string
  thumbnail: string | null
}

type Props = {
  projects: Project[]
}

export const OrganizationProjects = ({ projects }: Props) => {
  return (
    <div className="space-y-2">
      <Typography as="p" className="text-sm text-muted-foreground font-medium">
        プロジェクト一覧
      </Typography>
      <div className="space-y-2">
        {projects.map(project => (
          <Card key={project.id} className="rounded-sm py-2">
            <CardHeader className="flex flex-row items-center gap-3">
              {project.thumbnail ? (
                <Image
                  src={project.thumbnail}
                  alt="thumbnail"
                  width={32}
                  height={32}
                  className="rounded-sm object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-muted flex items-center justify-center text-xs font-bold text-primary rounded-sm">
                  {project.name.charAt(0)}
                </div>
              )}
              <CardTitle className="text-sm">
                <Link
                  href={`/projects/${project.id}`}
                  className="underline text-primary hover:opacity-80"
                >
                  {project.name}
                </Link>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
