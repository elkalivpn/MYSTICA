import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MainNav } from '@/components/navigation/MainNav'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mystica - Tu Portal al Mundo Místico',
  description: 'Explora el tarot, runas, astrología, calendario lunar y más en tu camino místico.',
  manifest: '/manifest.json',
  themeColor: '#8b5cf6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-mystica-dark-300 text-foreground antialiased`}>
        <MainNav />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
