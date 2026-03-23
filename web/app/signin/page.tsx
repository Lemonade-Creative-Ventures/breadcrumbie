import Link from 'next/link'
import Button from '@/components/Button'
import Input from '@/components/Input'
import styles from './signin.module.css'

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          🍞 Breadcrumbie
        </Link>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to continue to your trails</p>

        <form className={styles.form}>
          <Input type="email" label="Email" placeholder="you@example.com" required />
          <Input type="password" label="Password" placeholder="Enter your password" required />
          
          <Button type="submit" size="large" style={{ width: '100%' }}>
            Sign In
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className={styles.link}>
              Sign up
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
