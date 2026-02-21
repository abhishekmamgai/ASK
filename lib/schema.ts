// Database schema and types for the project tracking system

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: 'admin' | 'client'
  companyName?: string
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  description: string
  clientId: string
  clientName: string
  clientEmail: string
  status: 'not-started' | 'in-progress' | 'completed'
  progressPercentage: number
  deadline: Date
  createdAt: Date
  updatedAt: Date
  notes?: string
}

// In-memory database for demo (replace with real DB later)
export const usersDB: Map<string, User> = new Map([
  [
    'infoasktechbusiness@gmail.com',
    {
      id: 'admin-001',
      email: 'infoasktechbusiness@gmail.com',
      password: 'abhishekshivakartik@ask', // Will be hashed in production
      name: 'Admin',
      role: 'admin',
      createdAt: new Date(),
    },
  ],
])

export const projectsDB: Map<string, Project> = new Map()

export const sessionsDB: Map<string, { userId: string; expiresAt: Date }> = new Map()
