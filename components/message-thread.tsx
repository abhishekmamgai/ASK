'use client'

import { useState } from 'react'
import { Message } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Send } from 'lucide-react'

interface MessageThreadProps {
    messages: Message[]
    currentUserId: string
    onSend?: (message: string) => void
    placeholder?: string
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function MessageThread({ messages, currentUserId, onSend, placeholder = 'Type a message...' }: MessageThreadProps) {
    const [input, setInput] = useState('')

    const handleSend = () => {
        if (!input.trim() || !onSend) return
        onSend(input.trim())
        setInput('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // Group messages by date
    const grouped: { date: string; messages: Message[] }[] = []
    messages.forEach((msg) => {
        const date = formatDate(msg.createdAt)
        const existing = grouped.find((g) => g.date === date)
        if (existing) {
            existing.messages.push(msg)
        } else {
            grouped.push({ date, messages: [msg] })
        }
    })

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {grouped.map((group) => (
                    <div key={group.date}>
                        {/* Date separator */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full flex-shrink-0">{group.date}</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* Messages for this date */}
                        <div className="space-y-3">
                            {group.messages.map((msg) => {
                                const isSelf = msg.senderId === currentUserId
                                return (
                                    <div
                                        key={msg.id}
                                        className={cn('flex gap-2', isSelf ? 'flex-row-reverse' : 'flex-row')}
                                    >
                                        {/* Avatar */}
                                        <div
                                            className={cn(
                                                'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold self-end',
                                                isSelf
                                                    ? 'bg-gradient-to-br from-violet-600 to-blue-500'
                                                    : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                            )}
                                        >
                                            {msg.senderName.slice(0, 2).toUpperCase()}
                                        </div>

                                        {/* Bubble */}
                                        <div className={cn('flex flex-col gap-1 max-w-[75%]', isSelf ? 'items-end' : 'items-start')}>
                                            <span className="text-xs text-muted-foreground px-1">{msg.senderName}</span>
                                            <div
                                                className={cn(
                                                    'px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm',
                                                    isSelf
                                                        ? 'bg-primary text-primary-foreground rounded-br-md'
                                                        : 'bg-card border border-border text-foreground rounded-bl-md'
                                                )}
                                            >
                                                {msg.content}
                                            </div>
                                            <span className="text-xs text-muted-foreground/60 px-1">{formatTime(msg.createdAt)}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
                    </div>
                )}
            </div>

            {/* Input */}
            {onSend && (
                <div className="border-t border-border p-3">
                    <div className="flex items-end gap-2 bg-muted/50 rounded-xl p-2 border border-border">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            rows={1}
                            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none leading-relaxed py-1 px-2"
                            style={{ maxHeight: '120px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">Press Enter to send · Shift+Enter for new line</p>
                </div>
            )}
        </div>
    )
}
