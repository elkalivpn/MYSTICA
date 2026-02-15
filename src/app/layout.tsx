import type { Metadata, Viewport } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import './globals.css'
import { MainNav } from '@/components/navigation/MainNav'
import { Toaster } from '@/components/ui/sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { PWAProvider } from '@/components/PWAProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cinzel = Cinzel({ 
  subsets: ['latin'], 
  variable: '--font-cinzel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mystica - Tu Portal al Mundo Mistico',
  description: 'Explora el tarot, runas, astrologia, calendario lunar y mas en tu camino mistico.',
  manifest: '/manifest.json',
  applicationName: 'Mystica',
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
    title: 'Mystica - Tu Portal al Mundo Mistico',
    description: 'Explora el tarot, runas, astrologia, calendario lunar y mas.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mystica',
    description: 'Tu Portal al Mundo Mistico'
  },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/logo.svg',
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f7ff' },
    { media: '(prefers-color-scheme: dark)', color: '#8b5cf6' }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/icons/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/icons/icon-512.png" sizes="512x512" type="image/png" />
        
        {/* Apple PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mystica" />
        
        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
        
        {/* Microsoft tiles */}
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* PWA theme colors */}
        <meta name="theme-color" content="#8b5cf6" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f8f7ff" media="(prefers-color-scheme: light)" />
        
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Theme hydration script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('mystica-theme') || 'system';
                  var resolved = theme;
                  if (theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(resolved);
                } catch (e) {}
              })();
            `,
          }}
        />
        
        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js', { scope: '/' })
                      .then(function(registration) {
                        console.log('SW registered:', registration.scope);
                        
                        // Check for updates periodically
                        setInterval(function() {
                          registration.update();
                        }, 60 * 60 * 1000); // Check every hour
                        
                        // Handle updates
                        registration.addEventListener('updatefound', function() {
                          var newWorker = registration.installing;
                          if (newWorker) {
                            newWorker.addEventListener('statechange', function() {
                              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available - notify the app
                                window.dispatchEvent(new CustomEvent('sw-update-available'));
                              }
                            });
                          }
                        });
                      })
                      .catch(function(error) {
                        console.log('SW registration failed:', error);
                      });
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${cinzel.variable} ${inter.className} bg-background text-foreground antialiased overscroll-none`}>
        <ThemeProvider>
          <PWAProvider>
            <MainNav />
            <main className="pt-14 min-h-screen safe-area-inset pb-20 lg:pb-0">
              {children}
            </main>
            <Toaster />
            <SpeedInsights />
          </PWAProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
