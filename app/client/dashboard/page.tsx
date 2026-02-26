'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserFromSession } from '@/lib/auth'

export default function ClientDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getUserFromSession()

    if (!user) {
      router.push('/login')
    }
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Client Dashboard</h1>
      <p>Welcome! You are logged in.</p>
    </div>
  )
}