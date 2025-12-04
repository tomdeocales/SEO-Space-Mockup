import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ToastProvider } from "@/components/ui/toast-banner"
import { AuthProvider } from "@/components/auth-provider"
import { CompetitorProvider } from "@/components/competitor-provider"
import { FeatureAssignmentsProvider } from "@/components/feature-assignments-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SEO Space - Competitor Parity Dashboard",
  description: "Track and compare SEO features against competitors",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <CompetitorProvider>
              <FeatureAssignmentsProvider>{children}</FeatureAssignmentsProvider>
            </CompetitorProvider>
          </ToastProvider>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
