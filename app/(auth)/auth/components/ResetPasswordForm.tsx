'use client'

import { useState } from 'react'
import { z } from 'zod'
import { AuthLayout } from '@/components/ui/AuthLayout'
import formStyles from '@/components/ui/Form.module.css'
import { PasswordStrength } from '@/components/ui/PasswordStrength'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const resetSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <AuthLayout title="Choose new password" subtitle="Create a strong new password for your account">
        <div className={formStyles.alertError}>
          Invalid or missing reset token. Please request a new password reset link.
        </div>
      </AuthLayout>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      resetSchema.parse({ password, confirmPassword })
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        err.errors.forEach(e => {
          if (e.path[0]) newErrors[e.path[0] as string] = e.message
        })
        setErrors(newErrors)
        setIsLoading(false)
        return
      }
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ server: data.error || 'Something went wrong' })
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/auth?mode=login'), 3000)
      }
    } catch (err) {
      setErrors({ server: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title="Choose new password" subtitle="Create a strong new password for your account">
        <div className={formStyles.alertSuccess} style={{ textAlign: 'center' }}>
          Password reset successfully! Redirecting to login...
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Choose new password" subtitle="Create a strong new password for your account">
      {errors.server && (
        <div className={formStyles.alertError}>
          {errors.server}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={formStyles.formGroup}>
          <label htmlFor="password" className={formStyles.label}>New Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${formStyles.input} ${errors.password ? formStyles.inputError : ''}`}
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.password && <div className={formStyles.errorText}>{errors.password}</div>}
          <PasswordStrength password={password} />
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="confirmPassword" className={formStyles.label}>Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${formStyles.input} ${errors.confirmPassword ? formStyles.inputError : ''}`}
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.confirmPassword && <div className={formStyles.errorText}>{errors.confirmPassword}</div>}
        </div>

        <button type="submit" className={formStyles.button} disabled={isLoading}>
          {isLoading ? <div className={formStyles.spinner} /> : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  )
}
