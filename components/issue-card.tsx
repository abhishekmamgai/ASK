'use client'

import { Issue, IssueStatus, IssuePriority } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { AlertCircle, Clock, CheckCircle, XCircle, User } from 'lucide-react'

const priorityConfig: Record<IssuePriority, { label: string; class: string }> = {
    low: { label: 'Low', class: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
    medium: { label: 'Medium', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
    high: { label: 'High', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' },
    critical: { label: 'Critical', class: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
}

const statusConfig: Record<IssueStatus, { label: string; icon: typeof AlertCircle; class: string }> = {
    open: { label: 'Open', icon: AlertCircle, class: 'text-blue-500' },
    'in-progress': { label: 'In Progress', icon: Clock, class: 'text-amber-500' },
    resolved: { label: 'Resolved', icon: CheckCircle, class: 'text-emerald-500' },
    closed: { label: 'Closed', icon: XCircle, class: 'text-slate-400' },
}

interface IssueCardProps {
    issue: Issue
    onClick?: () => void
    compact?: boolean
}

export function IssueCard({ issue, onClick, compact = false }: IssueCardProps) {
    const priority = priorityConfig[issue.priority]
    const status = statusConfig[issue.status]
    const StatusIcon = status.icon

    return (
        <div
            onClick={onClick}
            className={cn(
                'bg-card border border-border rounded-xl transition-all duration-200 hover:shadow-md',
                onClick && 'cursor-pointer hover:-translate-y-0.5',
                compact ? 'p-3' : 'p-4'
            )}
        >
            <div className="flex items-start gap-3">
                <StatusIcon className={cn('flex-shrink-0 mt-0.5', status.class, compact ? 'w-4 h-4' : 'w-5 h-5')} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className={cn('font-medium text-foreground leading-tight', compact ? 'text-sm' : 'text-base')}>
                            {issue.title}
                        </h4>
                        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', priority.class)}>
                            {priority.label}
                        </span>
                    </div>

                    {!compact && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{issue.description}</p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                        <span className={cn('font-medium', status.class)}>{status.label}</span>
                        <span>•</span>
                        <span>{issue.projectName}</span>
                        {issue.assignedTo && (
                            <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{issue.assignedTo}</span>
                                </div>
                            </>
                        )}
                        <span>•</span>
                        <span>{new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
