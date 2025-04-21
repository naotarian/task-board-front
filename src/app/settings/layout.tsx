'use client'

import { SettingsSidebar } from '@/app/settings/SettingsSidebar'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-muted/50">
      <SettingsSidebar />
      <main className="flex-1 p-6 w-full">{children}</main>
    </div>
  )
}
