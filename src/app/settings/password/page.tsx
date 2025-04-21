'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isValidPassword = /^[a-zA-Z0-9]{8,}$/.test(newPassword)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません。')
      return
    }

    if (!isValidPassword) {
      setError('新しいパスワードは半角英数字で8文字以上にしてください。')
      return
    }

    // 🔐 本来はAPI呼び出し
    setSuccess('パスワードが正常に変更されました。')
    setNewPassword('')
    setConfirmPassword('')
    setCurrentPassword('')
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <Card className="max-w-xl mx-auto mt-12">
      <CardHeader>
        <CardTitle>パスワードの変更</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <div className="space-y-1">
            <Label htmlFor="current">現在のパスワード</Label>
            <Input
              id="current"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="new">新しいパスワード（半角英数字8文字以上）</Label>
            <div className="relative">
              <Input
                id="new"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className={isValidPassword || !newPassword ? '' : 'border-red-500'}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowNewPassword(prev => !prev)}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirm">新しいパスワード（確認）</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={
                  confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : ''
                }
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={!currentPassword || !newPassword || !confirmPassword}>
            保存
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
