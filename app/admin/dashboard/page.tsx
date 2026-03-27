'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { StatsCard } from '@/components/stats-card'
import { ActivityTimeline } from '@/components/activity-timeline'
import { IssueCard } from '@/components/issue-card'
import { getProjects, getIssues } from '@/lib/database'
import { supabase } from '@/lib/supabase'
import {
  Users,
  FolderKanban,
  Bug,
  CheckSquare,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    openIssues: 0,
    completedTasks: 0
  })
  const [projects, setProjects] = useState<any[]>([])
  const [issues, setIssues] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [issueChartData, setIssueChartData] = useState<any[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (!stored) { router.push('/login'); return }
    const user = JSON.parse(stored)
    if (user.role !== 'admin') { router.push('/client/dashboard'); return }

    async function loadData() {
      try {
        const [projs, iss] = await Promise.all([
          getProjects('admin'),
          getIssues('admin')
        ])

        setProjects(projs || [])
        setIssues(iss || [])

        // Calculate counts
        const { count: clientsCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client')
        const { count: completedCount } = await supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'done')

        setStats({
          totalClients: clientsCount || 0,
          activeProjects: (projs || []).filter(p => p.status === 'in-progress').length,
          openIssues: (iss || []).filter(i => i.status === 'open' || i.status === 'in-progress').length,
          completedTasks: completedCount || 0
        })

        // Chart Data
        const statusMap = {
          open: { name: 'Open', color: '#3b82f6', value: 0 },
          'in-progress': { name: 'In Progress', color: '#f59e0b', value: 0 },
          resolved: { name: 'Resolved', color: '#10b981', value: 0 },
          closed: { name: 'Closed', color: '#94a3b8', value: 0 },
        }
        iss?.forEach(i => {
          if (statusMap[i.status as keyof typeof statusMap]) statusMap[i.status as keyof typeof statusMap].value++
        })
        setIssueChartData(Object.values(statusMap))

      } catch (err: any) {
        console.error('Error loading dashboard data:', err.message || err)
        setError(err.message || 'Failed to load dashboard data. Check database connection.')
      } finally {
        setMounted(true)
      }
    }

    loadData()
  }, [router])

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const projectProgressData = projects.slice(0, 5).map((p) => ({
    name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name,
    progress: p.progress_percentage,
  }))

  const recentIssues = issues.filter((i) => i.status === 'open' || i.status === 'in-progress').slice(0, 3)

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome back, Admin · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            label="Total Clients"
            value={stats.totalClients}
            icon={Users}
            colorClass="text-violet-600 dark:text-violet-400"
            gradientFrom="from-violet-500/20"
            gradientTo="to-violet-500/5"
          />
          <StatsCard
            label="Active Projects"
            value={stats.activeProjects}
            icon={FolderKanban}
            colorClass="text-blue-600 dark:text-blue-400"
            gradientFrom="from-blue-500/20"
            gradientTo="to-blue-500/5"
          />
          <StatsCard
            label="Open Issues"
            value={stats.openIssues}
            icon={Bug}
            colorClass="text-red-500 dark:text-red-400"
            gradientFrom="from-red-500/20"
            gradientTo="to-red-500/5"
          />
          <StatsCard
            label="Completed Tasks"
            value={stats.completedTasks}
            icon={CheckSquare}
            colorClass="text-emerald-600 dark:text-emerald-400"
            gradientFrom="from-emerald-500/20"
            gradientTo="to-emerald-500/5"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Progress Bar Chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Project Progress</h2>
            </div>
            {projectProgressData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={projectProgressData} barSize={28}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                    contentStyle={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      color: 'var(--foreground)',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`${value}%`, 'Progress']}
                  />
                  <Bar dataKey="progress" radius={[6, 6, 0, 0]} fill="url(#barGradient)" />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No project data yet</div>
            )}
          </div>

          {/* Issue Status Pie */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Bug className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Issue Status</h2>
            </div>
            {issues.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={issueChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {issueChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        fontSize: '12px',
                        color: 'var(--foreground)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {issueChartData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-xs text-muted-foreground">{d.name}</span>
                      <span className="text-xs font-bold text-foreground ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[140px] flex items-center justify-center text-muted-foreground text-sm">No issues yet</div>
            )}
          </div>
        </div>

        {/* Bottom Row: Recent Issues + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Issues */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Open Issues</h2>
              <button
                onClick={() => router.push('/admin/issues')}
                className="text-xs text-primary hover:underline font-medium"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {recentIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} compact />
              ))}
              {recentIssues.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No open issues 🎉</p>
              )}
            </div>
          </div>

          {/* Activity Timeline (Placeholder until activity table is added) */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="text-center py-12 text-muted-foreground text-sm italic">Coming soon...</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}