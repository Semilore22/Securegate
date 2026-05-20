'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { AuthLayout } from '@/components/ui/AuthLayout'
import formStyles from '@/components/ui/Form.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (!res) {
        setError('Unable to sign in. Please try again.')
        return
      }

      if (res.error) {
        const errorMap: Record<string, string> = {
          CredentialsSignin: 'Email or password is incorrect.',
          SessionRequired: 'Please sign in to continue.',
          AccessDenied: 'Access denied. Please check your credentials.',
        }

        setError(errorMap[res.error] || res.error)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your account">
      {error && (
        <div className={formStyles.alertError}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={formStyles.formGroup}>
          <label htmlFor="email" className={formStyles.label}>Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={formStyles.input}
            placeholder="you@example.com"
            disabled={isLoading}
            required
          />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="password" className={formStyles.label}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={formStyles.input}
              placeholder="••••••••"
              disabled={isLoading}
              style={password.length > 0 ? { paddingRight: '2.5rem' } : undefined}
              required
            />
            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            )}
          </div>
          <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
            <Link href="/forgot-password" className={formStyles.link}>Forgot password?</Link>
          </div>
        </div>

        <button type="submit" className={formStyles.button} disabled={isLoading}>
          {isLoading ? <div className={formStyles.spinner} /> : 'Log in'}
        </button>
      </form>

      <div className={formStyles.footer}>
        Don't have an account? <Link href="/signup" className={formStyles.link}>Sign up</Link>
      </div>
    </AuthLayout>
  )
}
