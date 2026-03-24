'use client'

import React, { useEffect } from 'react'
import styles from './InstagramEmbed.module.css'

interface InstagramEmbedProps {
  url: string
  trailName?: string
}

export default function InstagramEmbed({ url, trailName }: InstagramEmbedProps) {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    document.body.appendChild(script)

    // Process embeds after script loads
    if (window.instgrm) {
      window.instgrm.Embeds.process()
    }

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [url])

  // Convert URL to embed format if needed
  const getEmbedUrl = (url: string) => {
    // Remove query parameters and convert to embed URL
    const cleanUrl = url.split('?')[0]
    return cleanUrl.endsWith('/') ? `${cleanUrl}embed` : `${cleanUrl}/embed`
  }

  return (
    <div className={styles.embedContainer}>
      {trailName && (
        <div className={styles.trailLabel}>
          <span className={styles.trailIcon}>🥾</span>
          <span className={styles.trailName}>{trailName}</span>
        </div>
      )}
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: '0',
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '0',
          maxWidth: '540px',
          minWidth: '326px',
          padding: '0',
          width: 'calc(100% - 2px)',
        }}
      >
        <div style={{ padding: '16px' }}>
          <a
            href={url}
            style={{
              background: '#FFFFFF',
              lineHeight: '0',
              padding: '0 0',
              textAlign: 'center',
              textDecoration: 'none',
              width: '100%',
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View this post on Instagram
          </a>
        </div>
      </blockquote>
    </div>
  )
}

// Extend Window interface for Instagram embed script
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void
      }
    }
  }
}
