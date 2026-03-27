import { Metadata } from 'next'
import { LoginClient } from '@/components/login-client'

export const metadata: Metadata = {
  title: 'Login - ASK Project Tracking',
  description: 'Login to your ASK project dashboard',
}

export default function LoginPage() {
  return <div suppressHydrationWarning><LoginClient /></div>
}
