'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'
import CrumbCard from '@/components/CrumbCard'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import { getRecentCrumbs } from '@/lib/mockData'
import styles from './feed.module.css'

export default function FeedPage() {
  const crumbs = getRecentCrumbs()

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Your Feed</h1>
            <p className={styles.subtitle}>Recent crumbs from your trails</p>
          </div>
          <Link href="/trail/create">
            <Button>Drop a crumb</Button>
          </Link>
        </div>

        {crumbs.length > 0 ? (
          <div className={styles.feed}>
            {crumbs.map((crumb) => (
              <CrumbCard key={crumb.id} crumb={crumb} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🍞"
            title="No crumbs yet"
            description="Start dropping crumbs or follow trails to see them here"
            action={
              <Link href="/trail/create">
                <Button>Drop your first crumb</Button>
              </Link>
            }
          />
        )}
      </div>
    </>
  )
}
