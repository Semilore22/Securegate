'use client'

import { useState } from 'react'
import { z } from 'zod'
import { AuthLayout } from '@/components/ui/AuthLayout'
import formStyles from '@/components/ui/Form.module.css'
import { PasswordStrength } from '@/components/ui/PasswordStrength'
import Link from 'next/link'

import { Eye, EyeOff } from 'lucide-react'

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Please enter your password')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character')
    .min(8, 'Password must be at least 8 characters')
})

type ValidationErrors = {
  email?: string
  password?: string
  server?: string
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess(false)

    try {
      signupSchema.parse({ email, password })
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: ValidationErrors = {}
        err.errors.forEach(e => {
          if (e.path[0] === 'email') newErrors.email = e.message
          if (e.path[0] === 'password') newErrors.password = e.message
        })
        setErrors(newErrors)
        return
      }
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors({ server: data.error || 'Something went wrong' })
        return
      }

      setSuccess(true)
    } catch (error) {
      setErrors({ server: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Enter your details to get started"
      alert={
        success ? (
          <div className={formStyles.alertSuccess} style={{ textAlign: 'center' }}>
            Account created successfully! Please check your email to verify your account.
          </div>
        ) : errors.server ? (
          <div className={formStyles.alertError} style={{ textAlign: 'center' }}>
            {errors.server}
          </div>
        ) : null
      }
    >
      <form onSubmit={handleSubmit}>
        <div className={formStyles.formGroup}>
          <label htmlFor="email" className={formStyles.label}>Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              const newEmail = e.target.value
              setEmail(newEmail)
              if (errors.email) {
                const result = z.string().email().safeParse(newEmail)
                if (result.success) {
                  setErrors(prev => ({ ...prev, email: undefined }))
                }
              }
            }}
            className={`${formStyles.input} ${errors.email ? formStyles.inputError : ''}`}
            placeholder="you@example.com"
            disabled={isLoading || success}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <div id="email-error" className={formStyles.errorText}>{errors.email}</div>}
        </div>

        <div className={formStyles.formGroup}>
          <label htmlFor="password" className={formStyles.label}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                const newPassword = e.target.value
                setPassword(newPassword)
                if (errors.password !== undefined || newPassword.length > 0) {
                  const result = signupSchema.shape.password.safeParse(newPassword)
                  if (result.success) {
                    setErrors(prev => ({ ...prev, password: undefined }))
                  } else {
                    setErrors(prev => ({ ...prev, password: result.error.errors[0].message }))
                  }
                }
              }}
              className={`${formStyles.input} ${errors.password ? formStyles.inputError : ''}`}
              placeholder="••••••••"
              disabled={isLoading || success}
              style={password.length > 0 ? { paddingRight: '2.5rem' } : undefined}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
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
          {errors.password && <div id="password-error" className={formStyles.errorText}>{errors.password}</div>}
          <PasswordStrength password={password} />
        </div>

        <button type="submit" className={formStyles.button} disabled={isLoading || success}>
          {isLoading ? <div className={formStyles.spinner} /> : 'Sign up'}
        </button>
      </form>

      <div className={formStyles.footer}>
        Already have an account? <Link href="/login" className={formStyles.link}>Log in</Link>
      </div>
    </AuthLayout>
  )
}
