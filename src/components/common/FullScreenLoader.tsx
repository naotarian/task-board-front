'use client'

import { Loader2 } from 'lucide-react'

type FullScreenLoaderProps = {
  message?: string
}

export const FullScreenLoader = ({ message = '読み込み中です...' }: FullScreenLoaderProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-lg font-semibold text-primary">{message}</p>
    </div>
  )
}
