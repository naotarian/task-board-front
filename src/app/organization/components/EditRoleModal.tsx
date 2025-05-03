// app/(your-path)/components/EditRoleModal.tsx

'use client'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Member } from '@/hooks/organizationDetail/useOrganizationDetail'
import { useUpdateMemberRole } from '@/hooks/organization/useUpdateMemberRole'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
type Props = {
  organizationId: string
  members: Member[]
}
type Role = 'member' | 'admin' | 'owner'
export const EditRoleModal = ({ members, organizationId }: Props) => {
  const searchParams = useSearchParams()
  const { updateRole, loading: submitting, error } = useUpdateMemberRole()
  const router = useRouter()

  const userId = searchParams.get('editRole')
  const isOpen = !!userId

  const close = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('editRole')
    router.replace(`?${params.toString()}`, { scroll: false })
  }
  const [selectedRole, setSelectedRole] = useState<Role>('member')

  useEffect(() => {
    if (!userId) return

    const target = members.find(m => m.id === userId)
    if (target) {
      setSelectedRole(target.role)
    }
  }, [userId, members])

  const handleSave = async () => {
    if (!organizationId || !userId) return
    const success = await updateRole(organizationId, userId, selectedRole)
    if (success) {
      close()
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>権限を変更</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>権限</Label>
            <Select value={selectedRole} onValueChange={val => setSelectedRole(val as Role)}>
              <SelectTrigger>
                <SelectValue placeholder="権限を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">オーナー</SelectItem>
                <SelectItem value="member">メンバー</SelectItem>
                <SelectItem value="admin">管理者</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={close} disabled={submitting}>
              キャンセル
            </Button>
            <Button onClick={handleSave} disabled={submitting}>
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
