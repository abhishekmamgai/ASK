'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClientLayout } from '@/components/client-layout'
import { supabase } from '@/lib/supabase'
import { FileText, Download, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ClientFilesPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [files, setFiles] = useState<any[]>([])

    useEffect(() => {
        const stored = sessionStorage.getItem('user')
        if (!stored) { router.push('/login'); return }
        const userData = JSON.parse(stored)
        setUser(userData)

        loadFiles(userData.id)
    }, [router])

    async function loadFiles(userId: string) {
        // Get project IDs for this client
        const { data: projs } = await supabase.from('projects').select('id').eq('client_id', userId)
        const projectIds = projs?.map(p => p.id) || []

        if (projectIds.length > 0) {
            const { data } = await supabase
                .from('files')
                .select('*, projects(name)')
                .in('project_id', projectIds)
                .order('created_at', { ascending: false })
            setFiles(data || [])
        }
        setMounted(true)
    }

    if (!mounted || !user) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" /></div>

    return (
        <ClientLayout userName={user.name} userEmail={user.email}>
            <div className="p-6 lg:p-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Files</h1>
                    <p className="text-muted-foreground text-sm mt-1">{files.length} documents shared with you</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {files.map((file) => (
                        <div key={file.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{file.projects?.name}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                                <span>{file.size} · {file.type}</span>
                                <a href={file.url} className="px-3 py-1 bg-primary/10 text-primary rounded-lg font-bold">Download</a>
                            </div>
                        </div>
                    ))}
                    {files.length === 0 && (
                        <div className="col-span-full py-16 text-center text-muted-foreground">
                            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            No files have been shared yet.
                        </div>
                    )}
                </div>
            </div>
        </ClientLayout>
    )
}
