import React from 'react'
import styles from './PasswordStrength.module.css'

interface PasswordStrengthProps {
  password?: string
}

export function PasswordStrength({ password = '' }: PasswordStrengthProps) {
  const getStrength = () => {
    let score = 0
    if (!password) return { score: 0, label: '' }
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1

    if (score === 1) return { score, label: 'Weak', class: styles.labelWeak, barClass: styles.barWeak }
    if (score === 2) return { score, label: 'Fair', class: styles.labelFair, barClass: styles.barFair }
    if (score >= 3) return { score, label: 'Strong', class: styles.labelStrong, barClass: styles.barStrong }
    return { score: 0, label: '' }
  }

  const { score, label, class: labelClass, barClass } = getStrength()

  return (
    <div className={styles.container}>
      <div className={styles.bars}>
        <div className={`${styles.bar} ${score >= 1 ? barClass : ''}`} />
        <div className={`${styles.bar} ${score >= 2 ? barClass : ''}`} />
        <div className={`${styles.bar} ${score >= 3 ? barClass : ''}`} />
      </div>
      <div className={styles.text}>
        <span>Password strength</span>
        {label && <span className={labelClass}>{label}</span>}
      </div>
    </div>
  )
}
