'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    FolderKanban,
    Bug,
    CheckSquare,
    MessageSquare,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Zap,
    Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getUnreadCount } from '@/lib/database'
import { supabase } from '@/lib/supabase'

interface SidebarItem {
    href: string
    icon: any
    label: string
    badge?: number
}

const navItemsList: SidebarItem[] = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/clients', icon: Users, label: 'Clients' },
    { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
    { href: '/admin/issues', icon: Bug, label: 'Issues' },
    { href: '/admin/tasks', icon: CheckSquare, label: 'Tasks' },
    { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
]

interface AdminSidebarProps {
    onLogout?: () => void
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        const stored = sessionStorage.getItem('user')
        if (!stored) return
        const user = JSON.parse(stored)
        if (user.role !== 'admin') return

        const fetchUnread = async () => {
            if (!user.id || !user.id.includes('-')) return // Skip if not a valid UUID-ish string
            try {
                const count = await getUnreadCount(user.id)
                setUnreadCount(count)
            } catch (err: any) {
                console.error('Error fetching unread count:', err.message || err)
            }
        }

        fetchUnread()

        // Real-time subscription for new messages
        const channel = supabase
            .channel('admin-unread-sidebar')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                },
                () => {
                    fetchUnread()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <aside
            className={cn(
                'relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg">
                    <Zap className="w-4 h-4 text-white" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-sidebar-foreground truncate">ASK Tech</p>
                        <p className="text-xs text-sidebar-foreground/50 truncate">Admin Portal</p>
                    </div>
                )}
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-14 z-10 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors shadow-sm"
            >
                {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {!collapsed && (
                    <p className="px-3 mb-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
                        Main Menu
                    </p>
                )}
                {navItemsList.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    const badgeValue = item.href === '/admin/messages' ? unreadCount : undefined

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                                isActive
                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                            )}
                        >
                            <Icon className="flex-shrink-0 w-4 h-4" />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                            {(badgeValue || 0) > 0 && !collapsed && (
                                <span className="ml-auto flex-shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                                    {badgeValue}
                                </span>
                            )}
                            {(badgeValue || 0) > 0 && collapsed && (
                                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                                    {badgeValue}
                                </span>
                            )}
                            {/* Tooltip for collapsed */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 border border-border">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="border-t border-sidebar-border p-3 space-y-1">
                {!collapsed && (
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-accent/50 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            AD
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-sidebar-foreground truncate">Admin</p>
                            <p className="text-xs text-sidebar-foreground/50 truncate">infoask@gmail.com</p>
                        </div>
                        <button className="ml-auto text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors">
                            <Bell className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <button
                    onClick={onLogout}
                    className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200',
                        collapsed && 'justify-center'
                    )}
                >
                    <LogOut className="flex-shrink-0 w-4 h-4" />
                    {!collapsed && 'Logout'}
                </button>
            </div>
        </aside>
    )
}
