import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { User } from '@/context/UserContext'

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN

export default function OrganizationLinks({ user }: { user: User }) {
  const router = useRouter()

  if (!user?.organizations) {
    return <p className="text-sm text-muted-foreground">組織に参加していません</p>
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-2">組織</p>
      <div className="space-y-2">
        {user.organizations.map(org => {
          const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
          const url = `${protocol}://${org.subdomain}.${BASE_DOMAIN}`

          return (
            <Button
              key={org.id}
              variant="ghost"
              className="justify-start w-full border-none focus-visible:ring-0 hover:bg-accent"
              onClick={() => router.push(url)}
            >
              {org.name}
            </Button>
          )
        })}
      </div>
    </>
  )
}
