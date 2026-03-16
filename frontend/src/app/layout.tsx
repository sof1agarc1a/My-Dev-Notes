import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'

const nunitoSans = Nunito_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'My Dev Wiki',
  description: 'Personal notes and learnings',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <body className="antialiased">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-scroll">{children}</main>
        </div>
      </body>
    </html>
  )
}
