'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { KanbanBoard } from '@/components/kanban-board'
import { supabase } from '@/lib/supabase'
import { createTask, updateTaskStatus, getTasks } from '@/lib/database'
import { Plus, X, Check, AlertCircle } from 'lucide-react'

export default function AdminTasksPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [tasks, setTasks] = useState<any[]>([])
    const [projects, setProjects] = useState<any[]>([])
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        title: '', description: '', assigned_to: '', project_id: '',
        priority: 'medium', due_date: '', status: 'todo'
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
            const [tData, pData] = await Promise.all([
                getTasks(),
                supabase.from('projects').select('id, name')
            ])

            setTasks(tData || [])
            setProjects(pData.data || [])
            if (pData.error) console.warn('Projects fetch warning:', pData.error.message)
        } catch (err: any) {
            console.error('Error loading tasks page:', err)
            setError(err.message || 'Failed to load tasks. Check database configuration.')
        } finally {
            setLoading(false)
            setMounted(true)
        }
    }

    const handleAdd = async () => {
        if (!form.title || !form.project_id) return
        setLoading(true)
        try {
            const newTask = await createTask({
                ...form,
                status: 'todo'
            })
            setTasks([newTask, ...tasks])
            setShowModal(false)
            setForm({ title: '', description: '', assigned_to: '', project_id: '', priority: 'medium', due_date: '', status: 'todo' })
        } catch (err: any) {
            alert('Error creating task: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (taskId: string, newStatus: any) => {
        try {
            await updateTaskStatus(taskId, newStatus)
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
        } catch (err: any) {
            alert('Error updating status: ' + err.message)
        }
    }

    if (!mounted) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Project Tasks</h1>
                        <p className="text-muted-foreground text-sm">{tasks.length} tasks tracked</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> New Task
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                        <button onClick={loadData} className="ml-auto underline">Retry</button>
                    </div>
                )}

                <KanbanBoard
                    tasks={tasks.map(t => {
                        const proj = Array.isArray(t.projects) ? t.projects[0] : t.projects
                        return {
                            id: t.id,
                            title: t.title,
                            description: t.description || '',
                            status: t.status as any,
                            priority: (t.priority || 'medium') as any,
                            assignedTo: t.assigned_to || 'Unassigned',
                            projectName: proj?.name || 'No Project',
                            projectId: t.project_id,
                            dueDate: t.due_date || new Date().toISOString(),
                            createdAt: t.created_at || new Date().toISOString()
                        }
                    })}
                    onStatusChange={handleStatusUpdate}
                />
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-lg">Create New Task</h3>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold mb-1.5 block">Task Title</label>
                                <input
                                    placeholder="e.g. Implement login API"
                                    className="w-full px-4 py-2 border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary/20"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold mb-1.5 block">Project</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-xl bg-background outline-none"
                                    value={form.project_id}
                                    onChange={e => setForm({ ...form, project_id: e.target.value })}
                                >
                                    <option value="">Select Project</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block">Assign To</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-xl bg-background outline-none"
                                        value={form.assigned_to}
                                        onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                                    >
                                        <option value="">Select Developer</option>
                                        <option value="Abhishek">Abhishek</option>
                                        <option value="Shiva">Shiva</option>
                                        <option value="Kartik">Kartik</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold mb-1.5 block">Priority</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-xl bg-background outline-none"
                                        value={form.priority}
                                        onChange={e => setForm({ ...form, priority: e.target.value as any })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold mb-1.5 block">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border rounded-xl bg-background outline-none"
                                    value={form.due_date}
                                    onChange={e => setForm({ ...form, due_date: e.target.value })}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            disabled={loading || !form.title || !form.project_id}
                            className="w-full mt-6 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
                        >
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
