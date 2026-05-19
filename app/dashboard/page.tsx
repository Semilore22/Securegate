'use client'

import { signOut, useSession } from 'next-auth/react'
import styles from './dashboard.module.css'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.title}>SecureGate Dashboard</div>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })} 
          className={styles.logoutButton}
        >
          Sign out
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          <h1 className={styles.welcomeTitle}>Welcome back!</h1>
          <p className={styles.welcomeText}>You are logged in as {session.user?.email}</p>
          <div className={styles.badge}>
            ✓ Verified Account
          </div>
        </div>
      </main>
    </div>
  )
}
