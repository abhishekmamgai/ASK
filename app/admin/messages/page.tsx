'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { MessageThread } from '@/components/message-thread'
import { supabase } from '@/lib/supabase'
import { sendMessage, getMessages, markMessagesAsRead } from '@/lib/database'
import { MessageSquare, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminMessagesPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [clients, setClients] = useState<any[]>([])
    const [selectedClient, setSelectedClient] = useState<any | null>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [adminId, setAdminId] = useState<string>('')

    useEffect(() => {
        const stored = sessionStorage.getItem('user')
        if (!stored) { router.push('/login'); return }
        const user = JSON.parse(stored)
        if (user.role !== 'admin') { router.push('/client/dashboard'); return }
        setAdminId(user.id || '00000000-0000-0000-0000-000000000000') // user.id from session

        loadClients()
    }, [router])

    async function loadClients() {
        const { data } = await supabase.from('profiles').select('*').eq('role', 'client')
        setClients(data || [])
        if (data && data.length > 0) setSelectedClient(data[0])
        setMounted(true)
    }

    // Handle selected client changes
    useEffect(() => {
        if (selectedClient && adminId) {
            loadMessages()
            markMessagesAsRead(adminId, selectedClient.id).catch(console.error)

            // Real-time subscription
            const channel = supabase
                .channel(`chat:${selectedClient.id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `recipient_id=eq.${adminId}`
                }, (payload) => {
                    if (payload.new.sender_id === selectedClient.id) {
                        setMessages(prev => [...prev, payload.new])
                        markMessagesAsRead(adminId, selectedClient.id).catch(console.error)
                    }
                })
                .subscribe()

            return () => { supabase.removeChannel(channel) }
        }
    }, [selectedClient, adminId])

    async function loadMessages() {
        if (!selectedClient || !adminId) return
        const data = await getMessages(adminId, selectedClient.id)
        setMessages(data || [])
    }

    const handleSend = async (content: string) => {
        if (!selectedClient || !adminId) return
        const newMsg = await sendMessage(adminId, selectedClient.id, content)
        setMessages(prev => [...prev, newMsg])
    }

    if (!mounted) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <AdminLayout>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <div className="w-72 border-r border-border bg-card flex flex-col">
                    <div className="p-4 border-b border-border">
                        <h2 className="font-bold mb-3">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                placeholder="Search clients..."
                                className="w-full pl-9 pr-4 py-2 bg-background border rounded-lg text-sm"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredClients.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedClient(c)}
                                className={cn('w-full p-4 flex gap-3 border-b hover:bg-muted/50 transition-colors text-left', selectedClient?.id === c.id && 'bg-primary/5 border-l-4 border-l-primary')}
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                    {c.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{c.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{c.company_name || 'Individual'}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Thread */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {selectedClient ? (
                        <>
                            <div className="p-4 border-b bg-card flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                    {selectedClient.name.slice(0, 2)}
                                </div>
                                <p className="font-bold text-sm">{selectedClient.name}</p>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <MessageThread
                                    messages={messages.map(m => ({
                                        id: m.id,
                                        senderId: m.sender_id,
                                        senderName: m.sender_id === adminId ? 'Admin' : selectedClient.name,
                                        senderRole: m.sender_id === adminId ? 'admin' : 'client',
                                        recipientId: m.recipient_id,
                                        recipientName: m.recipient_id === adminId ? 'Admin' : selectedClient.name,
                                        content: m.content,
                                        createdAt: m.created_at,
                                        read: m.is_read
                                    }))}
                                    currentUserId={adminId}
                                    onSend={handleSend}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-muted-foreground">Select a client to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
