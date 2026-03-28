'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClientLayout } from '@/components/client-layout'
import { MessageThread } from '@/components/message-thread'
import { supabase } from '@/lib/supabase'
import { sendMessage, getMessages, markMessagesAsRead } from '@/lib/database'
import { MessageSquare } from 'lucide-react'

export default function ClientMessagesPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [adminProfile, setAdminProfile] = useState<any>(null)

    useEffect(() => {
        const stored = sessionStorage.getItem('user')
        if (!stored) { router.push('/login'); return }
        const userData = JSON.parse(stored)
        if (userData.role === 'admin') { router.push('/admin/messages'); return }
        setUser(userData)

        loadData(userData.id)
    }, [router])

    async function loadData(userId: string) {
        try {
            // 1. Fetch Admin Profile
            const { data: admins, error: admErr } = await supabase.from('profiles').select('*').eq('role', 'admin').limit(1)

            if (admErr) console.error('Error fetching admin for chat:', admErr.message || admErr)

            const admin = (admins && admins[0]) ? admins[0] : {
                id: '00000000-0000-0000-0000-000000000000',
                name: 'ASK Tech (Admin)',
                role: 'admin'
            }
            setAdminProfile(admin)

            // 2. Load Messages (Will return [] if table missing)
            const msgs = await getMessages(userId, admin.id)
            setMessages(msgs || [])

            // 3. Subscription (Setup only if admin found or fallback active)
            const channel = supabase
                .channel(`chat:client_${userId}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `recipient_id=eq.${userId}`
                }, (payload: any) => {
                    setMessages(prev => [...prev, payload.new])
                    markMessagesAsRead(userId, admin.id).catch(() => { })
                })
                .subscribe()

        } catch (err: any) {
            console.error('Fatal chat load error:', err.message || err)
        } finally {
            setMounted(true)
        }
    }

    const handleSend = async (content: string) => {
        if (!user || !adminProfile) return
        try {
            const newMsg = await sendMessage(user.id, adminProfile.id, content)
            if (newMsg) {
                setMessages(prev => [...prev, newMsg])
            }
        } catch (err: any) {
            console.error('Chat send error:', err.message || err)
            alert('Failed to send message: ' + (err.message || 'Unknown error'))
        }
    }

    if (!mounted || !user) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" /></div>

    return (
        <ClientLayout userName={user.name} userEmail={user.email}>
            <div className="flex flex-col h-screen overflow-hidden">
                <div className="p-4 border-b bg-card flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        ASK
                    </div>
                    <div>
                        <h1 className="font-bold text-sm">ASK Tech Team</h1>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Always online
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    {adminProfile ? (
                        <MessageThread
                            messages={messages.map(m => ({
                                id: m.id,
                                senderId: m.sender_id,
                                senderName: m.sender_id === user.id ? user.name : 'Admin',
                                senderRole: m.sender_id === user.id ? 'client' : 'admin',
                                recipientId: m.recipient_id,
                                recipientName: m.recipient_id === user.id ? user.name : 'Admin',
                                content: m.content,
                                createdAt: m.created_at,
                                read: m.is_read
                            }))}
                            currentUserId={user.id}
                            onSend={handleSend}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Initializing chat...
                        </div>
                    )}
                </div>
            </div>
        </ClientLayout>
    )
}
