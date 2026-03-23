'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'
import TrailCard from '@/components/TrailCard'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import { mockTrails } from '@/lib/mockData'
import styles from './trails.module.css'

export default function TrailsPage() {
  const myTrails = mockTrails.filter(trail => trail.ownerId === '1')
  const publicTrails = mockTrails.filter(trail => trail.isPublic && trail.ownerId !== '1')

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Your Trails</h1>
            <p className={styles.subtitle}>Manage and explore your collections</p>
          </div>
          <div className={styles.actions}>
            <Link href="/trail/join">
              <Button variant="secondary">Join Private Trail</Button>
            </Link>
            <Link href="/trail/create">
              <Button>Create Trail</Button>
            </Link>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>My Trails</h2>
          {myTrails.length > 0 ? (
            <div className={styles.grid}>
              {myTrails.map((trail) => (
                <TrailCard key={trail.id} trail={trail} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🛤️"
              title="No trails yet"
              description="Create your first trail to start organizing your crumbs"
              action={
                <Link href="/trail/create">
                  <Button>Create Trail</Button>
                </Link>
              }
            />
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Public Trails</h2>
          {publicTrails.length > 0 ? (
            <div className={styles.grid}>
              {publicTrails.map((trail) => (
                <TrailCard key={trail.id} trail={trail} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🌍"
              title="No public trails"
              description="Public trails from other users will appear here"
            />
          )}
        </section>
      </div>
    </>
  )
}
