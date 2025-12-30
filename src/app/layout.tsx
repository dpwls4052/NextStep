import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from './providers/AuthProvider'
import ReactQueryProviders from './providers/ReactQueryProviders'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Next Step',
  description: 'AI-based learning roadmap service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    const theme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (theme === 'dark' || (!theme && systemDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (_) {}
})();
            `,
          }}
        />
      </head>

      <body>
        <ReactQueryProviders>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ReactQueryProviders>
      </body>
    </html>
  )
}
