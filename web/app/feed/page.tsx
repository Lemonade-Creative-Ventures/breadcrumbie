'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'
import BottomNav from '@/components/BottomNav'
import InstagramEmbed from '@/components/InstagramEmbed'
import TrailStory from '@/components/TrailStory'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import { getRecentCrumbs, mockTrails, getTrailById } from '@/lib/mockData'
import styles from './feed.module.css'

export default function FeedPage() {
  const crumbs = getRecentCrumbs()
  // Get the trails that have Instagram crumbs
  const featuredTrails = mockTrails.filter(trail => 
    ['5', '6', '7'].includes(trail.id)
  )

  // Helper to check if URL is Instagram
  const isInstagramUrl = (url: string) => {
    return url.includes('instagram.com')
  }

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        {/* Trails section - like Instagram stories */}
        {featuredTrails.length > 0 && (
          <div className={styles.trailsSection}>
            <div className={styles.trailsScroll}>
              {featuredTrails.map((trail) => (
                <TrailStory key={trail.id} trail={trail} />
              ))}
            </div>
          </div>
        )}

        {/* Feed header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Trail Mix</h1>
            <p className={styles.subtitle}>Discover crumbs from your trails</p>
          </div>
        </div>

        {/* Feed content */}
        {crumbs.length > 0 ? (
          <div className={styles.feed}>
            {crumbs.map((crumb) => {
              const trail = getTrailById(crumb.trailId)
              if (isInstagramUrl(crumb.url)) {
                return (
                  <InstagramEmbed 
                    key={crumb.id} 
                    url={crumb.url}
                    trailName={trail?.name}
                  />
                )
              }
              return null
            })}
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
      <BottomNav />
    </>
  )
}
