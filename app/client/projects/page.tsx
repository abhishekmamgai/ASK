'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClientLayout } from '@/components/client-layout'
import { ProjectCard } from '@/components/project-card'
import { getProjects } from '@/lib/database'
import { AlertCircle } from 'lucide-react'

export default function ClientProjectsPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const stored = sessionStorage.getItem('user')
        if (!stored) { router.push('/login'); return }
        const userData = JSON.parse(stored)
        if (userData.role === 'admin') { router.push('/admin/dashboard'); return }
        setUser(userData)

        loadProjects(userData.id)
    }, [router])

    async function loadProjects(userId: string) {
        setLoading(true)
        setError(null)
        try {
            const data = await getProjects('client', userId)
            setProjects(data || [])
        } catch (err: any) {
            console.error('Error loading client projects:', err.message || err)
            setError(err.message || 'Failed to load projects.')
        } finally {
            setLoading(false)
            setMounted(true)
        }
    }

    if (!mounted || !user) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" /></div>

    return (
        <ClientLayout userName={user.name} userEmail={user.email}>
            <div className="p-6 lg:p-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">My Projects</h1>
                    <p className="text-muted-foreground text-sm mt-1">{projects.length} projects in progress</p>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                        <button onClick={() => loadProjects(user.id)} className="ml-auto underline">Retry</button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {projects.map((p) => (
                        <ProjectCard
                            key={p.id}
                            project={{
                                id: p.id,
                                name: p.name,
                                description: p.description || '',
                                status: p.status as any,
                                progress: p.progress_percentage || 0,
                                deadline: p.deadline || '',
                                tags: p.tags || [],
                                teamSize: p.team_size || 1,
                                clientId: p.client_id,
                                clientName: 'Me',
                                clientEmail: user.email,
                                createdAt: p.created_at,
                                budget: p.budget || '₹0'
                            }}
                        />
                    ))}
                </div>

                {projects.length === 0 && !loading && !error && (
                    <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center text-muted-foreground">
                        No projects assigned yet.
                    </div>
                )}
            </div>
        </ClientLayout>
    )
}
