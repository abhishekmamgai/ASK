'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserFromSession } from '@/lib/auth'

export default function AdminDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getUserFromSession()

    if (!user || user.role !== 'admin') {
      router.push('/login')
    }
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Admin access granted.</p>
    </div>
  )
}