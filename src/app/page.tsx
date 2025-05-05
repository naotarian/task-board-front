'use client'

import { useAuthGuard } from '@/hooks/useAuthGuard'
import { Container } from '@/components/ui/container'
import { OrganizationCardList } from '@/app/components/OrganizationCardList'
import { ProjectCardList } from '@/app/components/ProjectCardList'
import { ActivityList } from '@/app/components/ActivityList'
import { FullScreenLoader } from '@/components/common/FullScreenLoader'
import { useSubdomain } from '@/hooks/useSubdomain'

export default function ProjectSelectionPage() {
  const { loading, shouldRender } = useAuthGuard('/login')
  const subdomain = useSubdomain()
  const hasSubdomain = !!subdomain

  if (loading || !shouldRender) return <FullScreenLoader />

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {!hasSubdomain && <OrganizationCardList />}
          <ProjectCardList />
        </div>
        <ActivityList />
      </div>
    </Container>
  )
}
