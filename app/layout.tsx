import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Linus Elvius - Frilansande utvecklare',
    template: '%s | Linus Elvius',
  },
  description:
    'Hej! Jag är Linus Elvius, en frilansande utvecklare och säkerhetsentusiast. Jag hjälper företag att bygga säkra och effektiva digitala lösningar.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="person-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Linus Elvius',
            url: 'https://www.linuselvius.com/',
            image: 'https://www.linuselvius.com/images/profile-real.png',
            sameAs: [
              'https://www.linkedin.com/in/linus-elvius-52b098266',
              'https://github.com/linx02',
            ],
            jobTitle: 'Software Developer',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Stockholm',
              addressCountry: 'Sweden',
            },
          })}
        </Script>
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            url: 'https://www.linuselvius.com/',
            name: 'Linus Elvius - Frilansande utvecklare',
          })}
        </Script>

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-98V68XZVDM"
        ></Script>
        <Script id="gtag-init" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-98V68XZVDM');
        `}
        </Script>

        <Script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/4c5099f6d73194c729e1513b/script.js"
        ></Script>
      </head>
      <body className={`bg-white tracking-tight antialiased dark:bg-[#111111]`}>
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
