import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to SecureGate</h1>
        <p className={styles.subtitle}>
          A standalone authentication app with enterprise-grade security. 
          Featuring full form validation, password strength indicators, 
          email verification, and rate-limited forgot password flows.
        </p>
        <div className={styles.actions}>
          <Link href="/login" className={styles.primaryButton}>
            Sign In
          </Link>
          <Link href="/signup" className={styles.secondaryButton}>
            Create Account
          </Link>
        </div>
      </div>
    </main>
  )
}
