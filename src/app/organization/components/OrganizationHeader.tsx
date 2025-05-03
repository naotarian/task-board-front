'use client'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'

export const OrganizationHeader = ({
  organization,
}: {
  organization: { id: string; name: string }
}) => {
  return (
    <div className="flex items-center justify-between">
      <Typography as="h4">{organization.name}</Typography>
      <Button>組織を編集</Button>
    </div>
  )
}
