'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Card from '@/components/Card'
import TrailCard from '@/components/TrailCard'
import { currentUser, mockTrails } from '@/lib/mockData'
import styles from './profile.module.css'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const myTrails = mockTrails.filter(trail => trail.ownerId === currentUser.id)

  return (
    <>
      <Navigation />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Profile & Settings</h1>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <Card>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Personal Information</h2>
                {!isEditing && (
                  <Button variant="ghost" size="small" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <form className={styles.form}>
                  <Input
                    type="text"
                    label="Name"
                    defaultValue={currentUser.name}
                  />
                  <Input
                    type="email"
                    label="Email"
                    defaultValue={currentUser.email}
                  />
                  <div className={styles.formActions}>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      alert('Profile updated! (This is mock functionality)')
                      setIsEditing(false)
                    }}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className={styles.info}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Name</span>
                    <span className={styles.infoValue}>{currentUser.name}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{currentUser.email}</span>
                  </div>
                </div>
              )}
            </Card>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Trails ({myTrails.length})</h2>
            {myTrails.length > 0 ? (
              <div className={styles.grid}>
                {myTrails.map((trail) => (
                  <TrailCard key={trail.id} trail={trail} />
                ))}
              </div>
            ) : (
              <Card>
                <p className={styles.emptyText}>You haven't created any trails yet.</p>
              </Card>
            )}
          </section>

          <section className={styles.section}>
            <Card>
              <h2 className={styles.sectionTitle}>Account Actions</h2>
              <div className={styles.actions}>
                <Button variant="secondary">Change Password</Button>
                <Button variant="ghost" style={{ color: '#ef4444' }}>
                  Sign Out
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </>
  )
}
