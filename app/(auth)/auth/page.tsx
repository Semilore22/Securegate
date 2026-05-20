'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { LoginForm } from './components/LoginForm'
import { SignupForm } from './components/SignupForm'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'
import { ResetPasswordForm } from './components/ResetPasswordForm'
import { VerifyEmailForm } from './components/VerifyEmailForm'
import formStyles from '@/components/ui/Form.module.css'

function AuthPageContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'login'

  switch (mode) {
    case 'signup':
      return <SignupForm />
    case 'forgot-password':
      return <ForgotPasswordForm />
    case 'reset-password':
      return <ResetPasswordForm />
    case 'verify-email':
      return <VerifyEmailForm />
    case 'login':
    default:
      return <LoginForm />
  }
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className={formStyles.spinner} style={{ margin: '0 auto' }} />}>
      <AuthPageContent />
    </Suspense>
  )
}
