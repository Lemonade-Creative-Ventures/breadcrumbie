import Link from 'next/link'
import Button from '@/components/Button'
import Input from '@/components/Input'
import styles from './signup.module.css'

export default function SignUpPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          🍞 Breadcrumbie
        </Link>
        <h1 className={styles.title}>Start your trail</h1>
        <p className={styles.subtitle}>Create an account to save and share your discoveries</p>

        <form className={styles.form}>
          <Input type="text" label="Name" placeholder="Your name" required />
          <Input type="email" label="Email" placeholder="you@example.com" required />
          <Input type="password" label="Password" placeholder="Create a password" required />
          
          <Button type="submit" size="large" style={{ width: '100%' }}>
            Sign Up
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account?{' '}
            <Link href="/signin" className={styles.link}>
              Sign in
            </Link>
          </p>
        </div>

        <div className={styles.note}>
          <p>⚠️ This is a placeholder. Authentication is not implemented yet.</p>
        </div>
      </div>
    </div>
  )
}
