'use client'

import { Project } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Calendar, Users, Tag } from 'lucide-react'

const statusConfig = {
    'not-started': { label: 'Not Started', class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
    'in-progress': { label: 'In Progress', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
    'completed': { label: 'Completed', class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
    'on-hold': { label: 'On Hold', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
}

const progressBarColor = {
    'not-started': 'from-slate-400 to-slate-500',
    'in-progress': 'from-blue-500 to-violet-500',
    'completed': 'from-emerald-400 to-teal-500',
    'on-hold': 'from-amber-400 to-orange-500',
}

interface ProjectCardProps {
    project: Project
    onClick?: () => void
    showClient?: boolean
}

export function ProjectCard({ project, onClick, showClient = false }: ProjectCardProps) {
    const status = (statusConfig as any)[project.status] || { label: project.status, class: 'bg-muted' }
    const barColor = (progressBarColor as any)[project.status] || 'from-slate-400 to-slate-500'

    return (
        <div
            onClick={onClick}
            className={cn(
                'bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5',
                onClick && 'cursor-pointer'
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3 gap-2">
                <h3 className="font-semibold text-foreground leading-tight line-clamp-1 flex-1">{project.name}</h3>
                <span className={cn('text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap', status.class)}>
                    {status.label}
                </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            <Tag className="w-2.5 h-2.5" />{tag}
                        </span>
                    ))}
                    {project.tags.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                            +{project.tags.length - 3}
                        </span>
                    )}
                </div>
            )}


            {/* Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-bold text-foreground">{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', barColor)}
                        style={{ width: `${project.progress}%` }}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{project.teamSize} members</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(project.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>

            {showClient && (
                <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
                    Client: <span className="font-medium text-foreground">{project.clientName}</span>
                </div>
            )}
        </div>
    )
}
