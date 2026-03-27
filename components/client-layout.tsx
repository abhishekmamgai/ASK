'use client'

import { useRouter } from 'next/navigation'
import { ClientSidebar } from '@/components/client-sidebar'

interface ClientLayoutProps {
    children: React.ReactNode
    userName?: string
    userEmail?: string
}

export function ClientLayout({ children, userName, userEmail }: ClientLayoutProps) {
    const router = useRouter()

    const handleLogout = () => {
        sessionStorage.clear()
        router.push('/login')
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <ClientSidebar userName={userName} userEmail={userEmail} onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
