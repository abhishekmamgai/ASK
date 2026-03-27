'use client'

import { ActivityItem } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
    FolderKanban,
    Bug,
    CheckCircle,
    MessageSquare,
    UserPlus,
    RefreshCw,
} from 'lucide-react'

const activityIcons: Record<ActivityItem['type'], typeof FolderKanban> = {
    project_created: FolderKanban,
    issue_submitted: Bug,
    issue_resolved: CheckCircle,
    message_sent: MessageSquare,
    task_completed: CheckCircle,
    client_added: UserPlus,
    project_updated: RefreshCw,
}

const activityColors: Record<ActivityItem['type'], string> = {
    project_created: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
    issue_submitted: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
    issue_resolved: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
    message_sent: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    task_completed: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
    client_added: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400',
    project_updated: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
}

function timeAgo(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
}

interface ActivityTimelineProps {
    activities: ActivityItem[]
    maxItems?: number
}

export function ActivityTimeline({ activities, maxItems = 8 }: ActivityTimelineProps) {
    const displayed = activities.slice(0, maxItems)

    return (
        <div className="space-y-0">
            {displayed.map((activity, index) => {
                const Icon = activityIcons[activity.type]
                const colorClass = activityColors[activity.type]
                const isLast = index === displayed.length - 1

                return (
                    <div key={activity.id} className="flex gap-3 group">
                        {/* Timeline line + icon */}
                        <div className="flex flex-col items-center">
                            <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', colorClass)}>
                                <Icon className="w-3.5 h-3.5" />
                            </div>
                            {!isLast && <div className="w-px flex-1 bg-border mt-1 mb-1 min-h-[16px]" />}
                        </div>

                        {/* Content */}
                        <div className={cn('flex-1 pb-4', isLast && 'pb-0')}>
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-medium text-foreground leading-snug">{activity.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{activity.description}</p>
                                </div>
                                <span className="text-xs text-muted-foreground flex-shrink-0 mt-0.5">
                                    {timeAgo(activity.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
