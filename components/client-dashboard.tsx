'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, CheckCircle, Clock, AlertCircle, FileText, Calendar } from 'lucide-react'

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

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(storedUser)
    if (userData.role === 'admin') {
      router.push('/admin/dashboard')
      return
    }

    setUser(userData)

    // Load projects from localStorage (demo - show all projects for now)
    const stored = localStorage.getItem('projects')
    if (stored) {
      const allProjects = JSON.parse(stored)
      // Filter projects for this client
      const clientProjects = allProjects.filter(
        (p: Project) => p.clientEmail.toLowerCase() === userData.email.toLowerCase()
      )
      setProjects(clientProjects.length > 0 ? clientProjects : allProjects)
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
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
            <p className="text-muted-foreground mt-1">Welcome, {user.name}</p>
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Your Projects</h2>
              </div>
              <div className="divide-y divide-border">
                {projects.map((project) => {
                  const statusColor = statusColors[project.status]
                  const StatusIcon = statusColor.icon

                  return (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="p-6 hover:bg-muted/50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-primary"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-foreground mb-1">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusColor.bg}`}>
                          <StatusIcon size={16} className={statusColor.text} />
                          <span className={`text-sm font-medium ${statusColor.text}`}>
                            {project.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-foreground">Progress</span>
                            <span className="text-sm font-bold text-primary">{project.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                              style={{ width: `${project.progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar size={16} />
                          <span>Deadline: {project.deadline}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {projects.length === 0 && (
                <div className="p-12 text-center">
                  <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No projects assigned yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div>
            {selectedProject ? (
              <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Project Details</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Project Name</p>
                    <p className="font-semibold text-foreground">{selectedProject.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-foreground">{selectedProject.description}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusColors[selectedProject.status].bg}`}>
                      {(() => {
                        const StatusIcon = statusColors[selectedProject.status].icon
                        return (
                          <>
                            <StatusIcon size={16} className={statusColors[selectedProject.status].text} />
                            <span className={`text-sm font-medium ${statusColors[selectedProject.status].text}`}>
                              {selectedProject.status.replace('-', ' ')}
                            </span>
                          </>
                        )
                      })()}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                          style={{ width: `${selectedProject.progressPercentage}%` }}
                        />
                      </div>
                      <span className="font-bold text-primary">{selectedProject.progressPercentage}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                    <p className="font-semibold text-foreground">{selectedProject.deadline}</p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Note</p>
                      <p className="text-sm text-foreground">
                        This is a read-only view. You can track progress and updates here. Contact your account manager for questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-6 sticky top-6 text-center text-muted-foreground">
                <FileText size={48} className="mx-auto mb-3 opacity-50" />
                <p>Select a project to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
