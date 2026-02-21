import { usersDB, sessionsDB } from '@/lib/schema'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = usersDB.get(email)

    if (!user || user.password !== password) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Create session
    const sessionId = Math.random().toString(36).substr(2, 9)
    sessionsDB.set(sessionId, {
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })

    console.log('[v0] Login successful for:', email)

    return Response.json(
      {
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        sessionId,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `sessionId=${sessionId}; Path=/; Max-Age=86400; SameSite=Lax`,
        },
      }
    )
  } catch (error) {
    console.error('[v0] Login error:', error)
    return Response.json({ error: 'Login failed' }, { status: 500 })
  }
}
