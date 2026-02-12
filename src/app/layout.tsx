import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MainNav } from '@/components/navigation/MainNav'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mystica - Tu Portal al Mundo Místico',
  description: 'Explora el tarot, runas, astrología, calendario lunar y más en tu camino místico.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mystica'
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: 'website',
    siteName: 'Mystica',
    title: 'Mystica - Tu Portal al Mundo Místico',
    description: 'Explora el tarot, runas, astrología, calendario lunar y más.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mystica',
    description: 'Tu Portal al Mundo Místico'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#8b5cf6'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} bg-mystica-dark-300 text-foreground antialiased overscroll-none`}>
        <MainNav />
        <main className="pt-16 min-h-screen safe-area-inset">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
