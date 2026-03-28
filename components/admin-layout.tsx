'use client'

import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    const handleLogout = () => {
        sessionStorage.clear()
        router.push('/login')
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
