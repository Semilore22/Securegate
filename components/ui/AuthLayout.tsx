import React from 'react'
import styles from './AuthLayout.module.css'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  alert?: React.ReactNode
}

export function AuthLayout({ children, title, subtitle, alert }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {alert && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', width: '100%' }}>
            {alert}
          </div>
        )}
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
