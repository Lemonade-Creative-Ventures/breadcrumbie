import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Breadcrumbie - Save and Share Your Trail',
  description: 'Drop crumbs into trails and share your discoveries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
