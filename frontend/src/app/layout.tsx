import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../styles/globals.css'

const hauss = localFont({
  src: [
    {
      path: '../../public/assets/fonts/ALSHauss-Light.woff2',
      weight: '300',
    },
    {
      path: '../../public/assets/fonts/ALSHauss-Light.woff',
      weight: '300',
    }
  ],
  variable: '--font-hauss'
})

export const metadata: Metadata = {
  title: 'Snaply',
  description: 'Created by MAI',
  icons: {
    icon: [
      { url: '/assets/images/logos/logosy.svg', type: 'image/svg+xml' }
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={hauss.variable}>
      <body>{children}</body>
    </html>
  )
}
