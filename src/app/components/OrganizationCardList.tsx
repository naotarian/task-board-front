'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { useMyOrganizations } from '@/hooks/user/useMyOrganizations'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'

export const OrganizationCardList = () => {
  const { organizations, loading } = useMyOrganizations()
  const router = useRouter()

  const handleOrgClick = (org: { id: string; name: string; subdomain: string }) => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      alert('トークンが見つかりません。再ログインしてください。')
      return
    }

    const targetUrl = new URL(`http://${org.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`)
    targetUrl.searchParams.set('token', token)

    // ページ遷移（サブドメインへ）
    window.location.href = targetUrl.toString()
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground font-medium">所属組織</p>

      {loading &&
        Array.from({ length: 1 }).map((_, i) => (
          <Card key={i} className="py-2 rounded-none">
            <CardHeader className="pb-1 flex flex-row items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-sm" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-40" />
              </div>
            </CardHeader>
          </Card>
        ))}

      {!loading && organizations.length === 0 && (
        <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          <p className="font-medium text-base mb-1">所属組織はありません</p>
          <p className="text-xs text-muted-foreground">管理者からの招待をお待ちください。</p>
        </div>
      )}

      {organizations.map(org => (
        <Card
          key={org.id}
          className="h-16 py-2 hover:shadow-sm transition rounded-none cursor-pointer"
          onClick={() => handleOrgClick(org)}
        >
          <CardHeader className="pb-1 flex flex-row items-center gap-3">
            {org.thumbnail ? (
              <Image
                src={org.thumbnail}
                alt="org Thumbnail"
                width={48}
                height={48}
                className="rounded-sm object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-sm bg-muted flex items-center justify-center text-md font-bold text-primary">
                {org.name.charAt(0)}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-base leading-tight underline text-primary hover:opacity-80">
                {org.name}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
