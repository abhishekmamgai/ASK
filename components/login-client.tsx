'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function LoginClient() {
  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')

  // Admin credentials
  const ADMIN_EMAIL = 'infoasktechbusiness@gmail.com'
  const ADMIN_PASSWORD = 'abhishekshivakartik@ask'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Admin login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        sessionStorage.setItem(
          'user',
          JSON.stringify({
            email: ADMIN_EMAIL,
            role: 'admin',
            name: 'Admin',
          })
        )
        router.push('/admin/dashboard')
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      sessionStorage.setItem('user', JSON.stringify(data.user))
      router.push('/client/dashboard')
    } catch {
      setError('Login failed')
    }

    setLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      alert('Account created! Please check your email.')
      setIsLogin(true)
    } catch {
      setError('Signup failed')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE (Brand / Design) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-green-500 text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">ASK TECH</h1>
          <p className="text-lg mb-4">
            Build the future with modern technology.
          </p>
          <ul className="space-y-2 text-sm opacity-90">
            <li>• Track your project progress</li>
            <li>• Real-time updates</li>
            <li>• Secure client dashboard</li>
            <li>• Professional project management</li>
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            {isLogin ? 'Login' : 'Create Account'}
          </h2>
          <p className="text-center text-gray-500 mb-6">
            ASK Project Portal
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <form
            onSubmit={isLogin ? handleLogin : handleSignup}
            className="space-y-4"
          >
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border p-3 rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Company (optional)"
                  className="w-full border p-3 rounded-lg"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </>
            )}

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white p-3 rounded-lg font-semibold"
            >
              {loading
                ? 'Please wait...'
                : isLogin
                ? 'Login'
                : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            {isLogin ? 'New user?' : 'Already have an account?'}{' '}
            <button
              className="text-blue-600 font-semibold"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
            >
              {isLogin ? 'Signup' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}