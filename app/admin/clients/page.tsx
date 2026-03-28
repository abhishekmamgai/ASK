'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { supabase } from '@/lib/supabase'
import { Users, Plus, Search, Mail, Phone, Building2, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminClientsPage() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [form, setForm] = useState({
        name: '', email: '', company_name: '', phone: '', role: 'client'
    })

    useEffect(() => {
        const stored = sessionStorage.getItem('user')
        if (!stored) { router.push('/login'); return }
        const user = JSON.parse(stored)
        if (user.role !== 'admin') { router.push('/client/dashboard'); return }

        loadClients()
    }, [router])

    async function loadClients() {
        setLoading(true)
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'client').order('created_at', { ascending: false })
        if (!error) setClients(data || [])
        setLoading(false)
        setMounted(true)
    }

    if (!mounted) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

    const filtered = clients.filter(
        (c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company_name && c.company_name.toLowerCase().includes(search.toLowerCase()))
    )

    const handleAdd = async () => {
        if (!form.name || !form.email) return
        // Note: In real app, you'd create a user in Auth too. 
        // For demo/simplicity, we insert into profiles (assuming RLS allows or using Service Role)
        // IMPORTANT: Users usually need to Sign Up themselves via Login page to get an Auth ID.
        // Here we just insert a record.
        const { data, error } = await supabase.from('profiles').insert([form]).select()
        if (!error && data) {
            setClients([data[0], ...clients])
            setForm({ name: '', email: '', company_name: '', phone: '', role: 'client' })
            setShowModal(false)
        } else {
            alert('Error: ' + error?.message)
        }
    }

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Clients</h1>
                        <p className="text-muted-foreground text-sm mt-1">{clients.length} total clients</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Client
                    </button>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search clients..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                    />
                </div>

                {/* Client Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((client) => (
                        <div key={client.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                            {/* Top row */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {client.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground leading-snug">{client.name}</p>
                                        <p className="text-xs text-muted-foreground">{client.company_name || 'Individual'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate">{client.email}</span>
                                </div>
                                {client.phone && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span>{client.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>Joined {new Date(client.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && !loading && (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center">
                        <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-muted-foreground">No clients found</p>
                    </div>
                )}
            </div>

            {/* Add Client Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl mx-4">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-foreground">Add New Client</h3>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { key: 'name', placeholder: 'Full Name', type: 'text' },
                                { key: 'email', placeholder: 'Email Address', type: 'email' },
                                { key: 'company_name', placeholder: 'Company Name', type: 'text' },
                                { key: 'phone', placeholder: 'Phone Number', type: 'tel' },
                            ].map((field) => (
                                <input
                                    key={field.key}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={(form as any)[field.key]}
                                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                                />
                            ))}
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                <Check className="w-4 h-4" /> Add Client
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
