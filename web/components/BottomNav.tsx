'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './BottomNav.module.css'

export default function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className={styles.bottomNav}>
      <Link href="/feed" className={`${styles.navItem} ${isActive('/feed') ? styles.active : ''}`}>
        <span className={styles.icon}>🏠</span>
        <span className={styles.label}>Feed</span>
      </Link>
      <Link href="/trails" className={`${styles.navItem} ${isActive('/trails') ? styles.active : ''}`}>
        <span className={styles.icon}>🥾</span>
        <span className={styles.label}>Trails</span>
      </Link>
      <Link href="/profile" className={`${styles.navItem} ${isActive('/profile') ? styles.active : ''}`}>
        <span className={styles.icon}>👤</span>
        <span className={styles.label}>Profile</span>
      </Link>
    </nav>
  )
}
