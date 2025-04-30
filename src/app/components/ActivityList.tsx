'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'

type Props = {
  projects: Array<{
    id: string
    name: string
  }>
  activities: Array<{
    projectId: string
    message: string
    timestamp: string
  }>
}
const projects = [
  {
    id: 'p1',
    name: 'タスク管理プロジェクトA',
    thumbnail: null,
    organization: {
      id: 'o1',
      name: '株式会社Alpha',
      subdomain: 'alpha',
    },
  },
  {
    id: 'p2',
    name: '顧客管理プロジェクトB',
    thumbnail: null,
    organization: {
      id: 'o2',
      name: '株式会社Beta',
      subdomain: 'beta',
    },
  },
]

const activities = [
  {
    projectId: 'p1',
    message: '山田さんが「プロジェクトA」のタスクを完了しました',
    timestamp: '3分前',
  },
  {
    projectId: 'p2',
    message: '佐藤さんが「プロジェクトB」のステータスを変更しました',
    timestamp: '1時間前',
  },
  { projectId: 'p1', message: '鈴木さんがコメントを追加しました', timestamp: '2時間前' },
]
export const ActivityList = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground font-medium">最近のアクティビティ</p>
      {projects.map(project => (
        <Card key={project.id} className="bg-muted">
          <CardHeader>
            <CardTitle className="text-sm">{project.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activities
              .filter(activity => activity.projectId === project.id)
              .map((activity, index) => (
                <div key={index} className="border rounded-md p-3 bg-white shadow-sm">
                  <Typography className="text-sm">{activity.message}</Typography>
                  <Typography muted className="text-xs mt-1">
                    {activity.timestamp}
                  </Typography>
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
