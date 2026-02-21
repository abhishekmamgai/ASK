'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogOut, Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react'

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

export function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientName: '',
    clientEmail: '',
    status: 'not-started' as const,
    progressPercentage: 0,
    deadline: '',
  })

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    const userData = JSON.parse(storedUser)
    if (userData.role !== 'admin') {
      router.push('/client/dashboard')
      return
    }

    setUser(userData)

    // Load projects from localStorage (demo)
    const stored = localStorage.getItem('projects')
    if (stored) {
      setProjects(JSON.parse(stored))
    }
  }, [router])

  const handleSaveProject = () => {
    let updated: Project[]

    if (editingId) {
      updated = projects.map((p) => (p.id === editingId ? { ...formData, id: p.id } : p))
      setEditingId(null)
    } else {
      updated = [
        ...projects,
        {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
        },
      ]
    }

    setProjects(updated)
    localStorage.setItem('projects', JSON.stringify(updated))
    setFormData({
      name: '',
      description: '',
      clientName: '',
      clientEmail: '',
      status: 'not-started',
      progressPercentage: 0,
      deadline: '',
    })
    setShowForm(false)
  }

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id)
    setProjects(updated)
    localStorage.setItem('projects', JSON.stringify(updated))
  }

  const handleEditProject = (project: Project) => {
    setFormData(project)
    setEditingId(project.id)
    setShowForm(true)
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.status.includes(searchTerm.toLowerCase())
  )

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      {/* Header */}
      <div className="bg-card border-b border-border p-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
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
            <p className="text-3xl font-bold text-blue-600">{projects.filter((p) => p.status === 'in-progress').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-600">{projects.filter((p) => p.status === 'completed').length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Not Started</p>
            <p className="text-3xl font-bold text-gray-600">{projects.filter((p) => p.status === 'not-started').length}</p>
          </div>
        </div>

        {/* Add Project Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Project' : 'Create New Project'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="Client Name"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
              <Input
                placeholder="Client Email"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <Input
                type="number"
                placeholder="Progress %"
                min="0"
                max="100"
                value={formData.progressPercentage}
                onChange={(e) =>
                  setFormData({ ...formData, progressPercentage: parseInt(e.target.value) })
                }
              />
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
              <div className="flex gap-2 md:col-span-2">
                <Button onClick={handleSaveProject} className="flex-1 bg-primary">
                  {editingId ? 'Update' : 'Create'} Project
                </Button>
                <Button
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({
                      name: '',
                      description: '',
                      clientName: '',
                      clientEmail: '',
                      status: 'not-started',
                      progressPercentage: 0,
                      deadline: '',
                    })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Add Button */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-primary to-secondary gap-2"
          >
            <Plus size={20} />
            New Project
          </Button>
        </div>

        {/* Projects Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Project</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Client</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Progress</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Deadline</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const statusColor = statusColors[project.status]
                  const StatusIcon = statusColor.icon

                  return (
                    <tr key={project.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{project.name}</p>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{project.clientName}</p>
                        <p className="text-sm text-muted-foreground">{project.clientEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusColor.bg}`}>
                          <StatusIcon size={16} className={statusColor.text} />
                          <span className={`text-sm font-medium ${statusColor.text}`}>
                            {project.status.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${project.progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-foreground whitespace-nowrap">
                            {project.progressPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{project.deadline}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            onClick={() => handleEditProject(project)}
                            size="sm"
                            variant="outline"
                            className="gap-1"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            onClick={() => handleDeleteProject(project.id)}
                            size="sm"
                            variant="outline"
                            className="gap-1 text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p>No projects found. Create your first project to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
