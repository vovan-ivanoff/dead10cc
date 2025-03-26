import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const hauss = localFont({
  src: [
    {
      path: '../../public/fonts/ALSHauss-Light.woff2',
      weight: '300',
    },
    {
      path: '../../public/fonts/ALSHauss-Light.woff',
      weight: '300',
    }
  ],
  variable: '--font-hauss'
})

export const metadata: Metadata = {
  title: 'Wildberries',
  description: 'Created by MAI',
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
