'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Container } from '@/components/ui/container'

export default function NotificationSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

  return (
    <Container>
      <Card className="max-w-xl mx-auto mt-12">
        <CardHeader>
          <CardTitle>通知設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">メール通知</Label>
              <p className="text-sm text-muted-foreground">
                新しいプロジェクトや更新があった際にメールで通知を受け取ります。
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">プッシュ通知</Label>
              <p className="text-sm text-muted-foreground">
                ブラウザでリアルタイム通知を受け取ります。
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}
