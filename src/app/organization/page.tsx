import { Container } from '@/components/ui/container'
import { OrganizationDetailClient } from '@/app/organization/components/OrganizationDetailClient'

type Props = {
  params: {
    id: string
  }
}

export default function OrganizationDetailPage({ params }: Props) {
  return (
    <Container className="py-10">
      <OrganizationDetailClient organizationId={params.id} />
    </Container>
  )
}
