'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClientLayout } from '@/components/client-layout'
import { StatsCard } from '@/components/stats-card'
import { IssueCard } from '@/components/issue-card'
import { getProjects, getIssues, supabase } from '@/lib/database'
import { FolderOpen, Bug, MessageSquare, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ClientDashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [issues, setIssues] = useState<any[]>([])
  const [latestMessages, setLatestMessages] = useState<any[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (!stored) { router.push('/login'); return }
    const userData = JSON.parse(stored)
    if (userData.role === 'admin') { router.push('/admin/dashboard'); return }
    setUser(userData)

    loadClientData(userData.id)
  }, [router])

  async function loadClientData(userId: string) {
    try {
      const [projs, iss] = await Promise.all([
        getProjects('client', userId),
        getIssues('client', userId)
      ])
      setProjects(projs || [])
      setIssues(iss || [])

      // Load latest messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .limit(3)
      setLatestMessages(msgs || [])

    } catch (err: any) {
      console.error('Error loading client data:', err.message || err)
    } finally {
      setMounted(true)
    }
  }

  if (!mounted || !user) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" /></div>

  const activeProjects = projects.filter((p) => p.status === 'in-progress').length
  const openIssues = issues.filter((i) => i.status === 'open' || i.status === 'in-progress').length

  const statusColors: Record<string, string> = {
    'in-progress': 'from-blue-500 to-violet-500',
    'completed': 'from-emerald-400 to-teal-500',
    'not-started': 'from-slate-300 to-slate-400',
    'on-hold': 'from-amber-400 to-orange-400',
  }

  return (
    <ClientLayout userName={user.name} userEmail={user.email}>
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's a real-time overview of your projects</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard label="My Projects" value={projects.length} icon={FolderOpen} colorClass="text-blue-600" gradientFrom="from-blue-500/20" />
          <StatsCard label="Active" value={activeProjects} icon={CheckSquare} colorClass="text-emerald-600" gradientFrom="from-emerald-500/20" />
          <StatsCard label="Open Issues" value={openIssues} icon={Bug} colorClass="text-red-500" gradientFrom="from-red-500/20" />
          <StatsCard label="Unread" value={latestMessages.filter(m => !m.is_read).length} icon={MessageSquare} colorClass="text-violet-600" gradientFrom="from-violet-500/20" />
        </div>

        {/* Real Projects Progress */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-semibold mb-5">Project Progress</h2>
          <div className="space-y-5">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-bold">{p.name}</span>
                  <span>{p.progress_percentage}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn('h-full bg-gradient-to-r', statusColors[p.status] || 'from-slate-400 to-slate-500')}
                    style={{ width: `${p.progress_percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-center text-muted-foreground py-8">No active projects found</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Client Issues */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold mb-4">My Open Issues</h2>
            <div className="space-y-2">
              {issues.slice(0, 3).map(i => {
                const proj = Array.isArray(i.projects) ? i.projects[0] : i.projects
                return (
                  <IssueCard
                    key={i.id}
                    issue={{
                      id: i.id, title: i.title, description: i.description,
                      priority: i.priority, status: i.status, projectName: proj?.name || 'Loading...',
                      replies: []
                    } as any}
                    compact
                  />
                )
              })}
              {issues.length === 0 && <p className="text-center py-4 text-xs text-muted-foreground">No issues reported</p>}
            </div>
          </div>

          {/* Latest Messages */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Agency Updates</h2>
            <div className="space-y-3">
              {latestMessages.map(m => (
                <div key={m.id} className="p-3 rounded-xl bg-muted/30 text-xs">
                  <p className="font-bold mb-1">ASK Team</p>
                  <p className="text-muted-foreground">{m.content}</p>
                </div>
              ))}
              {latestMessages.length === 0 && <p className="text-center py-4 text-xs text-muted-foreground">No messages yet</p>}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}