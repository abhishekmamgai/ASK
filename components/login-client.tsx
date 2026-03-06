'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getProfile } from '@/lib/database'
import { Eye, EyeOff, Zap, ArrowRight, Shield, Layers, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const ADMIN_EMAIL = 'infoasktechbusiness@gmail.com'
const ADMIN_PASSWORD = 'abhishekshivakartik@ask'

const features = [
  { icon: Layers, title: 'Project Tracking', desc: 'Monitor progress in real-time' },
  { icon: MessageCircle, title: 'Direct Communication', desc: 'Message your team instantly' },
  { icon: Shield, title: 'Secure Portal', desc: 'Your data, always protected' },
]

export function LoginClient() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Regular Supabase login
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        // Special handle for our hardcoded admin for demo/initial setup
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const adminData = {
            id: '00000000-0000-0000-0000-000000000000',
            email: ADMIN_EMAIL,
            role: 'admin' as const,
            name: 'Admin'
          }

          // Seed admin into DB if it doesn't exist
          await supabase.from('profiles').upsert([adminData], { onConflict: 'id' })

          sessionStorage.setItem('user', JSON.stringify(adminData))
          router.push('/admin/dashboard')
          return
        }
        setError(authError.message)
        setLoading(false)
        return
      }

      // Sync profile with DB to ensure foreign keys work (especially after DB reset)
      // First, try to fetch existing profile to get the correct name if metadata is missing
      const { data: existingProfile } = await supabase.from('profiles').select('name, role').eq('id', data.user.id).single()

      const profileData = {
        id: data.user.id,
        name: existingProfile?.name || data.user.user_metadata?.full_name || name || 'Client User',
        email: data.user.email!,
        role: existingProfile?.role || ((email === ADMIN_EMAIL) ? 'admin' : 'client')
      }

      const { error: syncErr } = await supabase.from('profiles').upsert([profileData], { onConflict: 'id' })
      if (syncErr) console.warn('Profile sync warning:', syncErr.message)

      sessionStorage.setItem('user', JSON.stringify(profileData))

      if (profileData.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/client/dashboard')
      }
    } catch (err: any) {
      console.error('Login error detail:', err.message || err, err)
      const errMsg = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err))

      if (errMsg.includes('public.profiles')) {
        setError('Database error: The "profiles" table was not found. Please run the SQL script in DATABASE_FIX.md.')
      } else {
        setError('Login failed: ' + errMsg)
      }
    }
    setLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      })

      if (authError) { setError(authError.message); setLoading(false); return }

      if (data.user) {
        // Create profile record
        const { error: profError } = await supabase.from('profiles').insert([
          { id: data.user.id, name: name, email: email, role: 'client' }
        ])
        if (profError) {
          console.error('Profile creation error:', profError)
          if (profError.message?.includes('profiles')) {
            throw new Error('Database error: Could not create profile. The "profiles" table is missing. Please run the SQL schema in Supabase.')
          }
          throw profError
        }
      }

      setError('')
      alert('Account created! Please check your email to confirm.')
      setIsLogin(true)
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Signup failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left: Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-[#0a0a14]">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-600/30 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize: '40px 40px' }}
          />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">ASK Tech</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Your Project Portal,<br />
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Reimagined.
              </span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Track progress, communicate with the team, report issues, and manage everything — all in one place.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{f.title}</p>
                    <p className="text-white/50 text-xs">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-white/30 text-xs">© 2026 ASK Tech · Abhishek · Shiva · Kartik</p>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">ASK Tech</span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isLogin ? 'Sign in to your project portal' : 'Join the ASK client portal'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 shadow-sm"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Admin hint */}
          <div className="px-4 py-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-semibold text-foreground">Admin?</span> Use your agency credentials to access the admin portal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}