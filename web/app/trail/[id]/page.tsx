'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import CrumbCard from '@/components/CrumbCard'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import { getTrailById, getCrumbsByTrailId } from '@/lib/mockData'
import styles from './trail.module.css'

export default function TrailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const trail = getTrailById(id)
  
  if (!trail) {
    notFound()
  }

  const crumbs = getCrumbsByTrailId(id)

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.info}>
            <div className={styles.badges}>
              {trail.isPublic && <span className={styles.badge}>Public trail</span>}
              {!trail.isPublic && <span className={`${styles.badge} ${styles.private}`}>Private trail</span>}
              {trail.isAnonymous && <span className={`${styles.badge} ${styles.anonymous}`}>Anonymous trail</span>}
            </div>
            <h1 className={styles.title}>{trail.name}</h1>
            <p className={styles.meta}>
              by {trail.ownerName} · {trail.crumbCount} crumbs
            </p>
          </div>
          <div className={styles.actions}>
            <Button>Drop a crumb</Button>
          </div>
        </div>

        {crumbs.length > 0 ? (
          <div className={styles.crumbs}>
            {crumbs.map((crumb) => (
              <CrumbCard key={crumb.id} crumb={crumb} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🍞"
            title="No crumbs in this trail yet"
            description="Be the first to drop a crumb"
            action={<Button>Drop a crumb</Button>}
          />
        )}
      </div>
    </>
  )
}
