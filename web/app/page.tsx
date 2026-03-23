import Link from 'next/link'
import Button from '@/components/Button'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>🍞 Breadcrumbie</div>
        <div className={styles.headerActions}>
          <Link href="/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Drop crumbs,
            <br />
            build your trail
          </h1>
          <p className={styles.subtitle}>
            Save and share the links, articles, and discoveries that matter to you.
            Organize them into trails and share with others.
          </p>
          <div className={styles.cta}>
            <Link href="/signup">
              <Button size="large">Get Started</Button>
            </Link>
            <Link href="/feed">
              <Button variant="secondary" size="large">
                Explore Trails
              </Button>
            </Link>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🍞</div>
            <h3 className={styles.featureTitle}>Drop a crumb</h3>
            <p className={styles.featureDescription}>
              Save links instantly from anywhere with our iOS Share Extension or web app
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🛤️</div>
            <h3 className={styles.featureTitle}>Build trails</h3>
            <p className={styles.featureDescription}>
              Organize your discoveries into public, private, or anonymous trails
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🤝</div>
            <h3 className={styles.featureTitle}>Share & discover</h3>
            <p className={styles.featureDescription}>
              Follow public trails and invite others to your private collections
            </p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2024 Breadcrumbie. Made with ❤️</p>
      </footer>
    </div>
  )
}
