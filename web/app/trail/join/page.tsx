'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Card from '@/components/Card'
import styles from './join.module.css'

export default function JoinTrailPage() {
  const router = useRouter()
  const [inviteCode, setInviteCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock: In a real app, this would validate the code and join the trail
    if (inviteCode.toUpperCase() === 'RECIPE2024') {
      alert('Joined trail successfully! (This is mock functionality)')
      router.push('/trail/2')
    } else {
      alert('Invalid invite code. Try "RECIPE2024" for the demo.')
    }
  }

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Join a Private Trail</h1>
            <p className={styles.subtitle}>Enter an invite code to access a private trail</p>
          </div>

          <Card>
            <form className={styles.form} onSubmit={handleSubmit}>
              <Input
                type="text"
                label="Invite Code"
                placeholder="e.g., RECIPE2024"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />

              <div className={styles.hint}>
                <p>
                  💡 <strong>Tip:</strong> The trail owner will share the invite code with you.
                  For demo purposes, try using "RECIPE2024".
                </p>
              </div>

              <div className={styles.actions}>
                <Button type="button" variant="secondary" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">Join Trail</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}
