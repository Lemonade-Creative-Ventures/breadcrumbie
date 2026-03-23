import React from 'react'
import Link from 'next/link'
import { Trail } from '@/lib/mockData'
import Card from './Card'
import styles from './TrailCard.module.css'

interface TrailCardProps {
  trail: Trail
}

export default function TrailCard({ trail }: TrailCardProps) {
  return (
    <Link href={`/trail/${trail.id}`}>
      <Card className={styles.trailCard}>
        <div className={styles.header}>
          <h3 className={styles.title}>{trail.name}</h3>
          <div className={styles.badges}>
            {trail.isPublic && <span className={styles.badge}>Public trail</span>}
            {!trail.isPublic && <span className={`${styles.badge} ${styles.private}`}>Private trail</span>}
            {trail.isAnonymous && <span className={`${styles.badge} ${styles.anonymous}`}>Anonymous trail</span>}
          </div>
        </div>
        <div className={styles.meta}>
          <span className={styles.owner}>by {trail.ownerName}</span>
          <span className={styles.count}>{trail.crumbCount} crumbs</span>
        </div>
      </Card>
    </Link>
  )
}
