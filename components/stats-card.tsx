'use client'

import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
    label: string
    value: string | number
    icon: LucideIcon
    trend?: number
    trendLabel?: string
    colorClass?: string
    gradientFrom?: string
    gradientTo?: string
}

export function StatsCard({
    label,
    value,
    icon: Icon,
    trend,
    trendLabel,
    colorClass = 'text-primary',
    gradientFrom = 'from-primary/20',
    gradientTo = 'to-primary/5',
}: StatsCardProps) {
    const isPositive = trend !== undefined && trend >= 0

    return (
        <div className="relative bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group overflow-hidden">
            {/* Background gradient blob */}
            <div
                className={cn(
                    'absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl',
                    gradientFrom.replace('from-', 'bg-')
                )}
            />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                    <p className={cn('text-3xl font-bold', colorClass)}>{value}</p>
                    {trend !== undefined && (
                        <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', isPositive ? 'text-emerald-500' : 'text-red-500')}>
                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span>{isPositive ? '+' : ''}{trend}%</span>
                            {trendLabel && <span className="text-muted-foreground font-normal">{trendLabel}</span>}
                        </div>
                    )}
                </div>
                <div className={cn('p-3 rounded-xl bg-gradient-to-br', gradientFrom, gradientTo)}>
                    <Icon className={cn('w-5 h-5', colorClass)} />
                </div>
            </div>
        </div>
    )
}
