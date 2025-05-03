'use client'

import { useOrganizationDetail } from '@/hooks/organizationDetail/useOrganizationDetail'
import { OrganizationMembers } from '@/app/organization/components/OrganizationMembers'
import { OrganizationProjects } from '@/app/organization/components/OrganizationProjects'
import { Typography } from '@/components/ui/typography'
import { FullScreenLoader } from '@/components/common/FullScreenLoader'

export const OrganizationDetailClient = () => {
  const { organization, loading, error } = useOrganizationDetail()

  if (loading) return <FullScreenLoader />

  if (error || !organization) {
    return (
      <Typography as="h4" className="text-center text-destructive">
        組織情報の取得に失敗しました。
      </Typography>
    )
  }

  return (
    <div className="space-y-6">
      <Typography as="h4" className="mb-4">
        {organization.name}
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrganizationProjects projects={organization.projects} />
        <OrganizationMembers members={organization.members} organizationId={organization.id} />
      </div>
    </div>
  )
}
