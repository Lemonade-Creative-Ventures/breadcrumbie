'use client'

import React from 'react'
import styles from './InstagramEmbed.module.css'

interface InstagramEmbedProps {
  url: string
  trailName?: string
}

export default function InstagramEmbed({ url, trailName }: InstagramEmbedProps) {
  // Clean URL - remove query parameters
  const cleanUrl = url.split('?')[0]
  
  // Convert to embed URL format
  // From: https://www.instagram.com/p/DV95F7YiQLv/ or https://www.instagram.com/reel/DQb0AgyiMOy/
  // To: https://www.instagram.com/p/DV95F7YiQLv/embed/ or https://www.instagram.com/reel/DQb0AgyiMOy/embed/
  const embedUrl = cleanUrl.endsWith('/') ? `${cleanUrl}embed/` : `${cleanUrl}/embed/`

  return (
    <div className={styles.embedContainer}>
      {trailName && (
        <div className={styles.trailLabel}>
          <span className={styles.trailIcon}>🥾</span>
          <span className={styles.trailName}>{trailName}</span>
        </div>
      )}
      <div className={styles.embedWrapper}>
        <iframe
          src={embedUrl}
          className={styles.embedIframe}
          frameBorder="0"
          scrolling="no"
          allow="encrypted-media"
          title={`Instagram post from ${trailName || 'trail'}`}
        />
      </div>
    </div>
  )
}
