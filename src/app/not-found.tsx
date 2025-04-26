import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 Not Found',
}

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md text-center p-8 shadow-2xl rounded-2xl">
        <CardContent className="flex flex-col items-center gap-4">
          <div className="text-6xl font-bold text-primary">404</div>
          <div className="text-xl font-semibold">ページが見つかりません</div>
          <div className="text-muted-foreground mb-4 text-sm">
            お探しのページは存在しないか、移動された可能性があります。
          </div>
          <Button asChild>
            <Link href="/">ホームに戻る</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
