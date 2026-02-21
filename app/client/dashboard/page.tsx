import { Metadata } from 'next'
import { ClientDashboard } from '@/components/client-dashboard'

export const metadata: Metadata = {
  title: 'Client Dashboard - ASK Projects',
  description: 'View your project progress and updates',
}

export default function ClientDashboardPage() {
  return <ClientDashboard />
}
