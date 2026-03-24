'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from './InstagramEmbed.module.css'

interface InstagramEmbedProps {
  url: string
  trailName?: string
}

export default function InstagramEmbed({ url, trailName }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [embedLoaded, setEmbedLoaded] = useState(false)

  useEffect(() => {
    // Load Instagram embed script
    const loadInstagramScript = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process()
        setEmbedLoaded(true)
        return
      }

      const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://www.instagram.com/embed.js'
        script.async = true
        script.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process()
            setEmbedLoaded(true)
          }
        }
        script.onerror = () => {
          // Script failed to load (blocked by ad blocker, etc.)
          setEmbedLoaded(false)
        }
        document.body.appendChild(script)
      } else {
        // Script already exists, try to process
        setTimeout(() => {
          if (window.instgrm) {
            window.instgrm.Embeds.process()
            setEmbedLoaded(true)
          }
        }, 500)
      }
    }

    // Small delay to ensure DOM is ready
    setTimeout(loadInstagramScript, 100)
  }, [url])

  // Clean URL - remove query parameters
  const cleanUrl = url.split('?')[0]
  
  // Extract post type from URL
  const isReel = cleanUrl.includes('/reel/')

  return (
    <div className={styles.embedContainer} ref={containerRef}>
      {trailName && (
        <div className={styles.trailLabel}>
          <span className={styles.trailIcon}>🥾</span>
          <span className={styles.trailName}>{trailName}</span>
        </div>
      )}
      <div className={styles.embedWrapper}>
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={cleanUrl}
          data-instgrm-version="14"
          style={{
            background: '#FFF',
            border: '0',
            borderRadius: '0',
            boxShadow: 'none',
            margin: '0 auto',
            maxWidth: '640px',
            minWidth: '326px',
            padding: '0',
            width: '100%',
          }}
        >
          <div style={{ padding: '16px' }}>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '20px',
              background: '#fafafa',
              borderRadius: '8px'
            }}>
              <div style={{
                fontSize: '24px',
                textAlign: 'center',
                marginBottom: '8px'
              }}>
                {isReel ? '🎥' : '📸'}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#262626',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Instagram {isReel ? 'Reel' : 'Post'}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#8e8e8e',
                textAlign: 'center',
                lineHeight: '1.5'
              }}>
                {embedLoaded === false && 'Instagram embeds are being blocked. '}
                This content will display fully in production.
              </div>
              <a
                href={cleanUrl}
                style={{
                  background: '#0095f6',
                  color: '#FFFFFF',
                  lineHeight: '1',
                  padding: '12px 24px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  width: '100%',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  display: 'block',
                  marginTop: '8px'
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Instagram
              </a>
            </div>
          </div>
        </blockquote>
      </div>
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
