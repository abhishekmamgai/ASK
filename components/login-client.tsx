'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react'

export function LoginClient() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
  })

  // Real admin credentials
  const ADMIN_EMAIL = 'infoasktechbusiness@gmail.com'
  const ADMIN_PASSWORD = 'abhishekshivakartik@ask'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Check if admin login
      if (loginData.email === ADMIN_EMAIL && loginData.password === ADMIN_PASSWORD) {
        console.log('[v0] Admin login successful')
        sessionStorage.setItem('user', JSON.stringify({
          id: 'admin-001',
          email: ADMIN_EMAIL,
          name: 'Admin',
          role: 'admin'
        }))
        sessionStorage.setItem('sessionId', 'admin-session-' + Date.now())
        router.push('/admin/dashboard')
        return
      }

      // Regular client login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid email or password')
        console.log('[v0] Login failed:', data.error)
        return
      }

      console.log('[v0] Client login successful')
      sessionStorage.setItem('user', JSON.stringify(data.user))
      sessionStorage.setItem('sessionId', data.sessionId)
      router.push('/client/dashboard')
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('[v0] Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate password
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Signup failed')
        console.log('[v0] Signup error:', data.error)
        return
      }

      console.log('[v0] Signup successful')
      setSignupData({ email: '', password: '', name: '', companyName: '' })
      alert('Account created successfully! Please login.')
      setIsLogin(true)
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('[v0] Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4" suppressHydrationWarning>
      <div className="w-full max-w-md" suppressHydrationWarning>
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8" suppressHydrationWarning>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">ASK Projects</h1>
            <p className="text-muted-foreground">Manage your projects efficiently</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                isLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                !isLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Signup
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    type="email"
                    placeholder="admin@ask.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className={`pl-10 ${loginData.password ? 'pr-10' : ''}`}
                    required
                  />
                  {loginData.password && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                New user? <button onClick={() => setIsLogin(false)} className="text-primary hover:underline font-semibold">Create an account</button>
              </p>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    type={showSignupPassword ? 'text' : 'password'}
                    placeholder="Create a password (min 6 chars)"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className={`pl-10 ${signupData.password ? 'pr-10' : ''}`}
                    required
                  />
                  {signupData.password && (
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showSignupPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company Name (Optional)</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    type="text"
                    placeholder="Your company"
                    value={signupData.companyName}
                    onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account? <button onClick={() => setIsLogin(true)} className="text-primary hover:underline font-semibold">Login here</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
