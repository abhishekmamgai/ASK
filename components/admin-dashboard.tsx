'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import {
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  client_name: string
  client_email: string
  status: 'not-started' | 'in-progress' | 'completed'
  progress_percentage: number
  deadline: string
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
    client_name: '',
    client_email: '',
    status: 'not-started' as const,
    progress_percentage: 0,
    deadline: '',
  })

  // ================= LOAD PROJECTS =================
  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProjects(data)
    }
  }

  // ================= SESSION CHECK =================
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
    loadProjects()
  }, [router])

  // ================= CREATE / UPDATE =================
  const handleSaveProject = async () => {
    if (editingId) {
      await supabase
        .from('projects')
        .update(formData)
        .eq('id', editingId)

      setEditingId(null)
    } else {
      await supabase.from('projects').insert([formData])
    }

    setShowForm(false)
    setFormData({
      name: '',
      description: '',
      client_name: '',
      client_email: '',
      status: 'not-started',
      progress_percentage: 0,
      deadline: '',
    })

    loadProjects()
  }

  // ================= DELETE =================
  const handleDeleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    loadProjects()
  }

  const handleEditProject = (project: Project) => {
    setFormData(project)
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client_email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      {/* Header */}
      <div className="bg-card border-b p-6">
        <div className="max-w-7xl mx-auto flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all projects</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">

        {/* Add Button */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search project or client email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus size={18} /> New Project
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card border rounded-lg p-6 mb-6 space-y-3">
            <Input
              placeholder="Project name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Input
              placeholder="Client email"
              value={formData.client_email}
              onChange={(e) =>
                setFormData({ ...formData, client_email: e.target.value })
              }
            />
            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Progress %"
              value={formData.progress_percentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  progress_percentage: Number(e.target.value),
                })
              }
            />
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
            />

            <div className="flex gap-2">
              <Button onClick={handleSaveProject}>
                {editingId ? 'Update' : 'Create'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-card border rounded-lg overflow-hidden">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-4 border-b flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{project.name}</p>
                <p className="text-sm text-muted-foreground">
                  {project.client_email}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditProject(project)}
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              No projects found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}