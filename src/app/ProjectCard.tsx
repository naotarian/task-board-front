'use client'
import { Project } from '@/lib/api/projects'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  project: Project
}

export const ProjectCard = ({ project }: Props) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative w-full aspect-[4/3] bg-muted">
        {project.thumbnail && (
          <Image
            src={project.thumbnail}
            alt="Project Thumbnail"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 300px, 100vw"
            priority
          />
        )}
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-semibold line-clamp-1">{project.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description || '説明はありません。'}
        </p>
        <p className="text-xs text-zinc-400 mt-2">
          作成日: {new Date(project.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}
