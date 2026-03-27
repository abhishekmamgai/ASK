'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { IssueCard } from '@/components/issue-card'
import { getIssues, updateIssue, supabase } from '@/lib/database'
import { Bug, Search, X, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS: string[] = ['open', 'in-progress', 'resolved', 'closed']

const priorityColors: Record<string, string> = {
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

export default function AdminIssuesPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [issues, setIssues] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string | 'all'>('all')
    const [selected, setSelected] = useState<any | null>(null)
    const [reply, setReply] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = sessionStorage.getItem('user')
        if (!stored) { router.push('/login'); return }
        const user = JSON.parse(stored)
        if (user.role !== 'admin') { router.push('/client/dashboard'); return }

        loadIssues()
    }, [router])

    async function loadIssues() {
        setLoading(true)
        try {
            const data = await getIssues('admin')
            setIssues(data || [])
        } finally {
            setLoading(false)
            setMounted(true)
        }
    }

    if (!mounted) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

    const filtered = issues.filter((i) => {
        const matchSearch = i.title.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === 'all' || i.status === statusFilter
        return matchSearch && matchStatus
    })

    const handleStatusChange = async (issueId: string, status: string) => {
        await updateIssue(issueId, { status: status as any })
        setIssues(issues.map((i) => i.id === issueId ? { ...i, status } : i))
        if (selected?.id === issueId) setSelected({ ...selected, status })
    }

    const handleAssign = async (issueId: string, assigned_to: string) => {
        await updateIssue(issueId, { assigned_to })
        setIssues(issues.map((i) => i.id === issueId ? { ...i, assigned_to } : i))
        if (selected?.id === issueId) setSelected({ ...selected, assigned_to })
    }

    const handleReply = () => {
        // Note: Messaging is handled separately in Messages table, 
        // but for issue comments, we'd need a separate table.
        // For now, this is UI only or we could log it.
        setReply('')
    }

    const counts = {
        open: issues.filter((i) => i.status === 'open').length,
        'in-progress': issues.filter((i) => i.status === 'in-progress').length,
        resolved: issues.filter((i) => i.status === 'resolved').length,
    }

    return (
        <AdminLayout>
            <div className="flex h-[calc(100vh-0px)]">
                {/* Left Panel: List */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-border space-y-4">
                        <h1 className="text-2xl font-bold text-foreground">Issues</h1>
                        <div className="flex gap-2">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-500">Open: {counts.open}</span>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-600">Active: {counts['in-progress']}</span>
                        </div>
                        <div className="flex gap-3">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search issues..."
                                className="flex-1 px-4 py-2 rounded-xl border border-border bg-card text-sm"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 rounded-xl border border-border bg-card text-sm"
                            >
                                <option value="all">All</option>
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {filtered.map((issue) => (
                            <div
                                key={issue.id}
                                onClick={() => setSelected(issue)}
                                className={cn('cursor-pointer rounded-xl transition-all', selected?.id === issue.id && 'ring-2 ring-primary')}
                            >
                                <IssueCard
                                    issue={{
                                        id: issue.id,
                                        title: issue.title,
                                        description: issue.description,
                                        priority: issue.priority,
                                        status: issue.status,
                                        projectId: issue.project_id,
                                        projectName: issue.projects?.name || 'Unknown',
                                        clientId: issue.reporter_id,
                                        clientName: 'Reporter', // Could join profiles further
                                        assignedTo: issue.assigned_to,
                                        createdAt: issue.created_at,
                                        replies: []
                                    }}
                                    compact
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Detail */}
                {selected ? (
                    <div className="w-96 border-l border-border bg-card flex flex-col p-4 space-y-4">
                        <div className="flex justify-between items-start">
                            <h2 className="font-bold">{selected.title}</h2>
                            <button onClick={() => setSelected(null)}><X className="w-4 h-4" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Priority</label>
                                <span className={cn('px-2 py-1 rounded text-xs font-bold uppercase', priorityColors[selected.priority])}>
                                    {selected.priority}
                                </span>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Status</label>
                                <select
                                    value={selected.status}
                                    onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                                    className="w-full p-2 rounded border text-sm"
                                >
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Assign to</label>
                                <select
                                    value={selected.assigned_to || ''}
                                    onChange={(e) => handleAssign(selected.id, e.target.value)}
                                    className="w-full p-2 rounded border text-sm"
                                >
                                    <option value="">Unassigned</option>
                                    <option value="Abhishek">Abhishek</option>
                                    <option value="Shiva">Shiva</option>
                                    <option value="Kartik">Kartik</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground block mb-1">Description</label>
                                <p className="text-sm text-foreground">{selected.description}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-96 border-l border-border flex items-center justify-center text-muted-foreground text-sm">
                        Select an issue to view details
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
