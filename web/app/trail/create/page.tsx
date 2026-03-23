'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Card from '@/components/Card'
import styles from './create.module.css'

export default function CreateTrailPage() {
  const router = useRouter()
  const [trailType, setTrailType] = useState<'public' | 'private' | 'anonymous'>('public')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock: In a real app, this would create the trail
    alert('Trail created! (This is mock functionality)')
    router.push('/trails')
  }

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Create a Trail</h1>
            <p className={styles.subtitle}>Start organizing your discoveries</p>
          </div>

          <Card>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                type="text"
                label="Trail Name"
                placeholder="e.g., Design Inspiration, Weekend Recipes"
                required
              />

              <div className={styles.field}>
                <label className={styles.label}>Trail Type</label>
                <div className={styles.options}>
                  <label className={styles.option}>
                    <input
                      type="radio"
                      name="trailType"
                      value="public"
                      checked={trailType === 'public'}
                      onChange={(e) => setTrailType(e.target.value as any)}
                    />
                    <div className={styles.optionContent}>
                      <div className={styles.optionTitle}>🌍 Public trail</div>
                      <div className={styles.optionDescription}>
                        Anyone can discover and follow this trail
                      </div>
                    </div>
                  </label>

                  <label className={styles.option}>
                    <input
                      type="radio"
                      name="trailType"
                      value="private"
                      checked={trailType === 'private'}
                      onChange={(e) => setTrailType(e.target.value as any)}
                    />
                    <div className={styles.optionContent}>
                      <div className={styles.optionTitle}>🔒 Private trail</div>
                      <div className={styles.optionDescription}>
                        Only people with an invite code can join
                      </div>
                    </div>
                  </label>

                  <label className={styles.option}>
                    <input
                      type="radio"
                      name="trailType"
                      value="anonymous"
                      checked={trailType === 'anonymous'}
                      onChange={(e) => setTrailType(e.target.value as any)}
                    />
                    <div className={styles.optionContent}>
                      <div className={styles.optionTitle}>👤 Anonymous trail</div>
                      <div className={styles.optionDescription}>
                        Public trail where contributors remain anonymous
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className={styles.actions}>
                <Button type="button" variant="secondary" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">Create Trail</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}
