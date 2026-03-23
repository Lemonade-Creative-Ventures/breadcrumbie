import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navigation.module.css'

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          🍞 Breadcrumbie
        </Link>
        <div className={styles.links}>
          <Link href="/feed" className={styles.link}>
            Feed
          </Link>
          <Link href="/trails" className={styles.link}>
            Trails
          </Link>
          <Link href="/profile" className={styles.link}>
            Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}
