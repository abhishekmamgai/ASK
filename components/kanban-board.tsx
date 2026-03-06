'use client'

import { useState } from 'react'
import { Task, TaskStatus, IssuePriority } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { GripVertical, User, Calendar } from 'lucide-react'

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'todo', label: '🗒️ To Do', color: 'border-t-slate-400' },
    { id: 'in-progress', label: '⚡ In Progress', color: 'border-t-blue-500' },
    { id: 'done', label: '✅ Done', color: 'border-t-emerald-500' },
]

const priorityColors: Record<IssuePriority, string> = {
    low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

interface KanbanBoardProps {
    tasks: Task[]
    onStatusChange?: (taskId: string, newStatus: TaskStatus) => void
}

function TaskCard({ task, onMove }: { task: Task; onMove?: (newStatus: TaskStatus) => void }) {
    return (
        <div className="bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug mb-2">{task.title}</p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', (priorityColors as any)[task.priority] || 'bg-muted')}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{task.assignedTo || 'Unassigned'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground pb-2 border-b border-border/50">
                        <Calendar className="w-3 h-3" />
                        <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'No date'}</span>
                        <span className="ml-auto text-xs opacity-60">{(task.projectName || 'No Project').slice(0, 15)}...</span>
                    </div>

                    {/* Move controls */}
                    <div className="flex items-center gap-1 mt-2 overflow-x-auto no-scrollbar">
                        {COLUMNS.map(col => (
                            task.status !== col.id && (
                                <button
                                    key={col.id}
                                    onClick={() => onMove?.(col.id)}
                                    className="text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                                >
                                    Move to {col.id.replace('-', ' ')}
                                </button>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function KanbanBoard({ tasks, onStatusChange }: KanbanBoardProps) {
    const getColumnTasks = (status: TaskStatus) => tasks.filter((t) => t.status === status)

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMNS.map((col) => {
                const colTasks = getColumnTasks(col.id)
                return (
                    <div key={col.id} className={cn('bg-muted/40 rounded-2xl border border-border border-t-4 flex flex-col', col.color)}>
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <h3 className="font-semibold text-sm text-foreground">{col.label}</h3>
                            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {colTasks.length}
                            </span>
                        </div>
                        <div className="flex-1 p-3 space-y-2 min-h-[200px]">
                            {colTasks.map((task) => (
                                <TaskCard key={task.id} task={task} onMove={(newStatus) => onStatusChange?.(task.id, newStatus)} />
                            ))}
                            {colTasks.length === 0 && (
                                <div className="flex items-center justify-center h-24 border-2 border-dashed border-border rounded-xl">
                                    <p className="text-xs text-muted-foreground">No tasks</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
