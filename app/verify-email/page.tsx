'use client'

import { useEffect, useState, Suspense } from 'react'
import { AuthLayout } from '@/components/ui/AuthLayout'
import formStyles from '@/components/ui/Form.module.css'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [resendEmail, setResendEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('Verification token is missing')
      return
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('/api/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        
        const data = await res.json()

        if (!res.ok) {
          setStatus('error')
          setErrorMessage(data.error || 'Verification failed')
        } else {
          setStatus('success')
          setTimeout(() => router.push('/login'), 3000)
        }
      } catch (err) {
        setStatus('error')
        setErrorMessage('An unexpected error occurred')
      }
    }

    verifyToken()
  }, [token, router])

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsResending(true)
    setResendSuccess(false)

    try {
      const res = await fetch('/api/verify-email/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      })
      
      if (res.ok) {
        setResendSuccess(true)
      } else {
        const data = await res.json()
        setErrorMessage(data.error || 'Failed to resend')
      }
    } catch (err) {
      setErrorMessage('Failed to resend')
    } finally {
      setIsResending(false)
    }
  }

  const alertMessage = status === 'success' ? (
    <div className={formStyles.alertSuccess} style={{ textAlign: 'center' }}>
      Your email has been successfully verified! Redirecting to login...
    </div>
  ) : status === 'error' && errorMessage ? (
    <div className={formStyles.alertError} style={{ textAlign: 'center' }}>
      {errorMessage}
    </div>
  ) : null

  return (
    <AuthLayout 
      title="Email Verification" 
      subtitle="We're verifying your account"
      alert={alertMessage}
    >
      {status === 'loading' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className={formStyles.spinner} style={{ borderColor: 'var(--primary-color)', borderTopColor: 'transparent' }} />
          <p>Verifying your email...</p>
        </div>
      )}

      {status === 'error' && (errorMessage.includes('expired') || errorMessage.includes('Invalid')) && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Need a new verification link?</h3>
          {resendSuccess ? (
            <div className={formStyles.alertSuccess} style={{ textAlign: 'center' }}>
              A new verification link has been sent to your email.
            </div>
          ) : (
            <form onSubmit={handleResend}>
              <div className={formStyles.formGroup}>
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className={formStyles.input}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <button type="submit" className={formStyles.button} disabled={isResending}>
                {isResending ? <div className={formStyles.spinner} /> : 'Resend Verification Email'}
              </button>
            </form>
          )}
        </div>
      )}
      
      <div className={formStyles.footer}>
        <Link href="/login" className={formStyles.link}>Return to login</Link>
      </div>
    </AuthLayout>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className={formStyles.spinner} style={{ margin: '0 auto' }} />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
