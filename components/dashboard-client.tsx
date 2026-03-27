'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, Plus, Users, FileText, Calendar, MessageSquare, Settings, Home } from 'lucide-react'
import Link from 'next/link'

export function DashboardClient() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Active Projects', value: 3, icon: FileText, color: 'from-primary' },
    { label: 'Team Members', value: 5, icon: Users, color: 'from-secondary' },
    { label: 'Tasks Completed', value: 24, icon: Calendar, color: 'from-accent' },
    { label: 'Messages', value: 12, icon: MessageSquare, color: 'from-primary' },
  ]

  const projects = [
    {
      name: 'E-Commerce Platform',
      status: 'In Progress',
      progress: 65,
      team: 3,
      dueDate: '2025-03-15',
    },
    {
      name: 'Mobile App Redesign',
      status: 'In Progress',
      progress: 40,
      team: 2,
      dueDate: '2025-04-20',
    },
    {
      name: 'AI Integration',
      status: 'Planning',
      progress: 20,
      team: 4,
      dueDate: '2025-05-10',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-bold text-2xl hover:opacity-90 transition">
              ASK
            </Link>
            <span className="text-sm text-primary-foreground/70">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition">
              <Home size={18} />
              Home
            </Link>
            <Button
              onClick={() => {
                alert('Logged out successfully!')
                window.location.href = '/'
              }}
              variant="outline"
              className="border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground">Here's your project overview and collaboration hub</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className={`inline-block p-3 rounded-lg bg-gradient-to-br ${stat.color} to-secondary/20 mb-4`}>
                  <Icon size={24} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {['overview', 'projects', 'team', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Projects Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Your Projects</h2>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground flex items-center gap-2">
                  <Plus size={18} />
                  New Project
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.name} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{project.status}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Progress</span>
                        <span className="text-xs font-bold text-primary">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{project.team} members</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{project.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Plus, label: 'Create Project', color: 'from-primary' },
                  { icon: Users, label: 'Invite Team', color: 'from-secondary' },
                  { icon: MessageSquare, label: 'Start Chat', color: 'from-accent' },
                  { icon: Settings, label: 'Settings', color: 'from-primary' },
                ].map((action) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.label}
                      className="p-4 bg-card border border-border rounded-xl hover:shadow-lg transition-all flex flex-col items-center justify-center gap-3"
                    >
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} to-secondary/20`}>
                        <Icon size={24} className="text-primary" />
                      </div>
                      <p className="font-medium text-foreground text-sm">{action.label}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <p className="text-foreground text-lg mb-6">Manage and track all your projects in one place.</p>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.name} className="bg-card border border-border rounded-xl p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{project.status} • Due {project.dueDate}</p>
                  </div>
                  <Button className="bg-primary hover:opacity-90 text-primary-foreground">View Details</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div>
            <p className="text-foreground text-lg mb-6">Collaborate with your team members.</p>
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <Users size={48} className="text-primary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Team Management</h3>
              <p className="text-muted-foreground mb-6">Invite team members and manage permissions</p>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
                <Plus size={18} className="mr-2" />
                Add Team Member
              </Button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <p className="text-foreground text-lg mb-6">Manage your account and preferences.</p>
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="pb-6 border-b border-border">
                <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
                <p className="text-sm text-muted-foreground mb-4">Update your profile and account details</p>
                <Button variant="outline">Edit Account</Button>
              </div>
              <div className="pb-6 border-b border-border">
                <h3 className="font-semibold text-foreground mb-2">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground mb-4">Manage your security settings and preferences</p>
                <Button variant="outline">Security Settings</Button>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Notifications</h3>
                <p className="text-sm text-muted-foreground mb-4">Control how you receive notifications</p>
                <Button variant="outline">Notification Preferences</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
