'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { ProjectCard } from '@/components/project-card'
import { getProjects, createProject } from '@/lib/database'
import { supabase } from '@/lib/supabase'
import { Plus, Search, Filter, X, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS_FILTERS: { label: string; value: string | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Not Started', value: 'not-started' },
    { label: 'Completed', value: 'completed' },
    { label: 'On Hold', value: 'all' }, // Use all as fallback if needed or fix value
]

export default function AdminProjectsPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [projects, setProjects] = useState<any[]>([])
    const [clients, setClients] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string | 'all'>('all')
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        name: '', description: '', client_id: '',
        status: 'not-started', deadline: '', budget: '', team_size: 3,
    })

    useEffect(() => {
        const stored = sessionStorage.getItem('user')
        if (!stored) { router.push('/login'); return }
        const user = JSON.parse(stored)
        if (user.role !== 'admin') { router.push('/client/dashboard'); return }

        loadData()
    }, [router])

    async function loadData() {
        setLoading(true)
        setError(null)
        try {
            const [projs, cls] = await Promise.all([
                getProjects('admin'),
                supabase.from('profiles').select('*').eq('role', 'client')
            ])
            setProjects(projs || [])
            setClients(cls.data || [])
        } catch (err: any) {
            console.error('Error loading projects:', err.message || err)
            setError(err.message || 'Failed to load projects. Ensure database schema is applied.')
        } finally {
            setLoading(false)
            setMounted(true)
        }
    }

    if (!mounted) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

    const filtered = projects.filter((p) => {
        const clientName = Array.isArray(p.profiles) ? p.profiles[0]?.name : p.profiles?.name
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            (clientName && clientName.toLowerCase().includes(search.toLowerCase()))
        const matchStatus = statusFilter === 'all' || p.status === statusFilter
        return matchSearch && matchStatus
    })

    const handleAdd = async () => {
        if (!form.name || !form.client_id) return
        try {
            const newProj = await createProject({
                name: form.name,
                description: form.description,
                client_id: form.client_id,
                status: form.status as any,
                deadline: form.deadline,
                budget: form.budget,
                team_size: form.team_size,
                tags: [],
                progress_percentage: 0
            })
            setProjects([newProj, ...projects])
            setShowModal(false)
            setForm({ name: '', description: '', client_id: '', status: 'not-started', deadline: '', budget: '', team_size: 3 })
        } catch (err: any) {
            alert('Error: ' + err.message)
        }
    }

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
                        <p className="text-muted-foreground text-sm mt-1">{projects.length} total projects</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> New Project
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                        <button onClick={loadData} className="ml-auto underline decoration-2 underline-offset-4">Retry</button>
                    </div>
                )}

                {/* Search + Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects or clients..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        {STATUS_FILTERS.map((f) => (
                            <button
                                key={f.label}
                                onClick={() => setStatusFilter(f.value)}
                                className={cn(
                                    'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                                    statusFilter === f.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                )}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((p) => {
                        const prof = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles
                        return (
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
                                    clientName: prof?.name || 'Unknown Client',
                                    clientEmail: prof?.email || '',
                                    clientId: p.client_id,
                                    createdAt: p.created_at,
                                    budget: p.budget || '₹0'
                                }}
                                showClient
                            />
                        )
                    })}
                </div>

                {filtered.length === 0 && !loading && !error && (
                    <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
                        <p className="text-muted-foreground">No projects match your filters</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm overflow-y-auto py-8">
                    <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl mx-4">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-foreground">New Project</h3>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px]"
                            />

                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Assign to Client</label>
                                <select
                                    value={form.client_id}
                                    onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <option value="">Select a client...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.company_name || 'Individual'})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Budget (e.g. ₹2.5L)"
                                    value={form.budget}
                                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                <input
                                    type="number"
                                    placeholder="Team Size"
                                    value={form.team_size}
                                    onChange={(e) => setForm({ ...form, team_size: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Deadline</label>
                                    <input
                                        type="date"
                                        value={form.deadline}
                                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                                    >
                                        <option value="not-started">Not Started</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="on-hold">On Hold</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                            <button onClick={handleAdd} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                                <Check className="w-4 h-4" /> Create Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
