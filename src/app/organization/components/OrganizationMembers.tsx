'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { EditRoleModal } from '@/app/organization/components/EditRoleModal'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import type { Member } from '@/hooks/organizationDetail/useOrganizationDetail'

const roles = {
  owner: 'オーナー',
  admin: '管理者',
  member: 'メンバー',
}

export const OrganizationMembers = (props: { members: Member[]; organizationId: string }) => {
  const { members, organizationId } = props
  const router = useRouter()

  return (
    <div className="space-y-2">
      <Typography as="p" className="text-sm text-muted-foreground font-medium">
        メンバー一覧
      </Typography>
      <div className="space-y-2">
        {members.map(member => (
          <Card key={member.id} className="rounded-sm py-2">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-sm">{member.name}</CardTitle>
                <Typography muted className="text-xs !mt-0">
                  {member.email}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.role === 'admin' ? 'default' : 'outline'}>
                  {roles[member.role]}
                </Badge>

                {/* ドロップダウンメニュー */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        const params = new URLSearchParams(window.location.search)
                        params.set('editRole', member.id) // 各ユーザーのID
                        router.push(`?${params.toString()}`, { scroll: false })
                      }}
                      className="cursor-pointer hover:bg-muted"
                    >
                      権限を変更
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => console.log('ユーザーを削除')}
                      className="cursor-pointer"
                    >
                      ユーザーを削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
          </Card>
        ))}
        <EditRoleModal organizationId={organizationId} members={members} />
      </div>
    </div>
  )
}
