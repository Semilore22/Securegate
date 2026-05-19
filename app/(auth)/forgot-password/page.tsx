'use client'

import { useState } from 'react'
import { AuthLayout } from '@/components/ui/AuthLayout'
import formStyles from '@/components/ui/Form.module.css'
import Link from 'next/link'
import { z } from 'zod'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    const result = z.string().email().safeParse(email)
    if (!result.success) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setError('Too many requests. Please try again later.')
        } else {
          setError(data.error || 'Something went wrong')
        }
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link">
      {success ? (
        <div className={formStyles.alertSuccess} style={{ textAlign: 'center' }}>
          <p>If an account exists with that email, we've sent a password reset link.</p>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/login" className={formStyles.link}>Return to log in</Link>
          </div>
        </div>
      ) : (
        <>
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

            <button type="submit" className={formStyles.button} disabled={isLoading}>
              {isLoading ? <div className={formStyles.spinner} /> : 'Send reset link'}
            </button>
          </form>

          <div className={formStyles.footer}>
            Remember your password? <Link href="/login" className={formStyles.link}>Log in</Link>
          </div>
        </>
      )}
    </AuthLayout>
  )
}
