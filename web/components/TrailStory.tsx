import React from 'react'
import Link from 'next/link'
import { Trail } from '@/lib/mockData'
import styles from './TrailStory.module.css'

interface TrailStoryProps {
  trail: Trail
}

export default function TrailStory({ trail }: TrailStoryProps) {
  return (
    <Link href={`/trail/${trail.id}`} className={styles.trailStory}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>🥾</div>
      </div>
      <span className={styles.trailName}>{trail.name}</span>
    </Link>
  )
}
