'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'

const testActivities = [
  { id: 1, message: '山田さんがタスクを完了しました', timestamp: '3分前' },
  { id: 2, message: '佐藤さんがコメントを追加しました', timestamp: '1時間前' },
]

export const ActivityLog = ({ organizationId }: { organizationId: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近のアクティビティ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {testActivities.map(activity => (
          <div key={activity.id} className="border rounded-sm p-3 bg-muted">
            <Typography className="text-sm">{activity.message}</Typography>
            <Typography muted className="text-xs mt-1">
              {activity.timestamp}
            </Typography>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
