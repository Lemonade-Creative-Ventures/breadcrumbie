import React from 'react'
import { Crumb, formatDate, extractDomain } from '@/lib/mockData'
import Card from './Card'
import styles from './CrumbCard.module.css'

interface CrumbCardProps {
  crumb: Crumb
}

export default function CrumbCard({ crumb }: CrumbCardProps) {
  return (
    <Card className={styles.crumbCard}>
      <div className={styles.header}>
        <span className={styles.userName}>{crumb.userName}</span>
        <span className={styles.time}>{formatDate(crumb.createdAt)}</span>
      </div>
      <a href={crumb.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        <div className={styles.urlContainer}>
          <span className={styles.domain}>{extractDomain(crumb.url)}</span>
          <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </div>
      </a>
      {crumb.note && <p className={styles.note}>{crumb.note}</p>}
    </Card>
  )
}
