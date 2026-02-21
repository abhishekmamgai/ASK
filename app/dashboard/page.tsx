import { Metadata } from 'next'
import { DashboardClient } from '@/components/dashboard-client'

export const metadata: Metadata = {
  title: 'Dashboard - ASK',
  description: 'Your personal ASK dashboard. Manage projects, collaborate, and track progress.',
}

export default function DashboardPage() {
  return <DashboardClient />
}
