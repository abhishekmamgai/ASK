import { usersDB } from '@/lib/schema'

export async function POST(req: Request) {
  try {
    const { email, password, name, companyName } = await req.json()

    if (!email || !password || !name) {
      return Response.json({ error: 'Email, password, and name required' }, { status: 400 })
    }

    if (usersDB.has(email)) {
      return Response.json({ error: 'User already exists' }, { status: 409 })
    }

    const userId = Math.random().toString(36).substr(2, 9)
    const newUser = {
      id: userId,
      email,
      password,
      name,
      role: 'client' as const,
      companyName: companyName || undefined,
      createdAt: new Date(),
    }

    usersDB.set(email, newUser)

    console.log('[v0] New user registered:', email)

    return Response.json(
      {
        success: true,
        user: { id: userId, email, name, role: 'client' },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Signup error:', error)
    return Response.json({ error: 'Signup failed' }, { status: 500 })
  }
}
