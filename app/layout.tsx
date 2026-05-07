import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ChatSocketProvider } from "@/context/socket-io-provider";
import { QueryProvider } from "@/context/query-provider";
import { NotificationProvider } from "@/context/notification-provider";
import { getToken } from "@/lib/auth";
import ReduxProvider from "@/context/redux-provider";
import { ThemeProvider } from "@/context/theme-provider";
import Script from "next/script";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Luxestate — Luxury real estate listings",
    template: "%s | Luxestate",
  },
  description:
    "Discover and list premium properties. Search, chat, and manage listings — built for buyers, sellers, and admins.",
  keywords: [
    "real estate",
    "property listings",
    "luxury homes",
    "buy property",
    "rent property",
    "Luxestate",
  ],
  authors: [{ name: "Luxestate" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Luxestate",
    title: "Luxestate — Luxury real estate listings",
    description:
      "Discover and list premium properties. Search, chat, and manage listings.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxestate",
    description:
      "Discover and list premium properties. Search, chat, and manage listings.",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1220" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EQYK1KK2MZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-EQYK1KK2MZ');
  `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <QueryProvider>
              <ChatSocketProvider token={token}>
                <NotificationProvider accessToken={token || null}>
                  <main className="min-h-screen">{children}</main>
                  <Toaster richColors position="top-center" />
                </NotificationProvider>
              </ChatSocketProvider>
            </QueryProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
