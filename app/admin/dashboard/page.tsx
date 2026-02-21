import { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin-dashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard - ASK Projects',
  description: 'Manage all projects and clients',
}

export default function AdminDashboardPage() {
  return <AdminDashboard />
}
