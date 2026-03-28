'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import {
  LogOut,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
} from 'lucide-react'

interface Project {
  id: string
  name: string
  clientName: string
  clientEmail: string
  status: 'not-started' | 'in-progress' | 'completed'
  progressPercentage: number
  deadline: string
  description: string
}

const statusColors = {
  'not-started': { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertCircle },
  'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
  'completed': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
}

export function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // ================= SESSION CHECK =================
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      const userData = session.user
      setUser(userData)

      // Load demo projects (localStorage for now)
      const stored = localStorage.getItem('projects')
      if (stored) {
        const allProjects = JSON.parse(stored)

        const clientProjects = allProjects.filter(
          (p: Project) =>
            p.clientEmail.toLowerCase() === userData.email?.toLowerCase()
        )

        setProjects(clientProjects.length > 0 ? clientProjects : [])
      }
    }

    checkSession()
  }, [router])

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    )
  }

  const completedProjects = projects.filter((p) => p.status === 'completed').length
  const inProgressProjects = projects.filter((p) => p.status === 'in-progress').length
  const notStartedProjects = projects.filter((p) => p.status === 'not-started').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      {/* Header */}
      <div className="bg-card border-b border-border p-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
            <p className="text-muted-foreground mt-1">
              Welcome, {user.email}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Total Projects</p>
            <p className="text-3xl font-bold text-foreground">{projects.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{inProgressProjects}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedProjects}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Not Started</p>
            <p className="text-3xl font-bold text-gray-600">{notStartedProjects}</p>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Your Projects</h2>
          </div>

          {projects.map((project) => {
            const statusColor = statusColors[project.status]
            const StatusIcon = statusColor.icon

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="p-6 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{project.name}</h3>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusColor.bg}`}>
                    <StatusIcon size={16} className={statusColor.text} />
                    <span className={statusColor.text}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          {projects.length === 0 && (
            <div className="p-10 text-center text-muted-foreground">
              No projects assigned yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}