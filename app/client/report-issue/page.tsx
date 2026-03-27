'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClientLayout } from '@/components/client-layout'
import { getProjects, createIssue } from '@/lib/database'
import { AlertCircle, Paperclip, Send, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low', color: 'border-slate-300 bg-slate-50 text-slate-600', selected: 'bg-slate-500 text-white' },
    { value: 'medium', label: 'Medium', color: 'border-amber-300 bg-amber-50 text-amber-700', selected: 'bg-amber-500 text-white' },
    { value: 'high', label: 'High', color: 'border-orange-300 bg-orange-50 text-orange-700', selected: 'bg-orange-500 text-white' },
    { value: 'critical', label: 'Critical', color: 'border-red-300 bg-red-50 text-red-700', selected: 'bg-red-500 text-white' },
]

export default function ClientReportIssuePage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [projects, setProjects] = useState<any[]>([])
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'medium',
        project_id: '',
    })

    useEffect(() => {
        const stored = sessionStorage.getItem('user')
        if (!stored) { router.push('/login'); return }
        const userData = JSON.parse(stored)
        setUser(userData)

        loadProjects(userData.id)
    }, [router])

    async function loadProjects(userId: string) {
        const data = await getProjects('client', userId)
        setProjects(data || [])
        setMounted(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title || !form.description || !form.project_id) return
        setLoading(true)
        try {
            await createIssue({
                ...form,
                reporter_id: user.id,
                status: 'open',
                priority: form.priority as any
            })
            setSubmitted(true)
        } finally {
            setLoading(false)
        }
    }

    if (!mounted || !user) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" /></div>

    if (submitted) {
        return (
            <ClientLayout userName={user.name} userEmail={user.email}>
                <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Issue Reported!</h2>
                    <p className="text-muted-foreground mb-6">Our team has been notified. We'll look into it ASAP.</p>
                    <button
                        onClick={() => router.push('/client/dashboard')}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </ClientLayout>
        )
    }

    return (
        <ClientLayout userName={user.name} userEmail={user.email}>
            <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold">Report an Issue</h1>
                    <p className="text-muted-foreground text-sm">Submit a bug or improvement request directly to our team</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        placeholder="Issue Title"
                        className="w-full p-4 border rounded-xl"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        required
                    />
                    <select
                        className="w-full p-4 border rounded-xl"
                        value={form.project_id}
                        onChange={e => setForm({ ...form, project_id: e.target.value })}
                        required
                    >
                        <option value="">Select Related Project</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PRIORITY_OPTIONS.map((p) => (
                            <button
                                key={p.value}
                                type="button"
                                onClick={() => setForm({ ...form, priority: p.value })}
                                className={cn(
                                    'py-2 rounded-xl border-2 text-xs font-bold transition-all',
                                    form.priority === p.value ? p.selected : p.color
                                )}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    <textarea
                        placeholder="Describe the issue in detail..."
                        className="w-full p-4 border rounded-xl min-h-[150px]"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-4 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                        {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Issue</>}
                    </button>
                </form>
            </div>
        </ClientLayout>
    )
}
