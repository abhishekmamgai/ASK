export function getUserFromSession() {
  if (typeof window === 'undefined') return null

  const user = sessionStorage.getItem('user')
  if (!user) return null

  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}