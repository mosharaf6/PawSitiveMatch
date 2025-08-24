// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from '@/components/layout/bottom-nav';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Use fallback fonts for build environment
const alegreya = {
  variable: '--font-serif',
  className: '',
};

const inter = {
  variable: '--font-sans',
  className: '',
};

export const metadata: Metadata = {
  title: 'PawsitiveMatch | Find Your Perfect Pet Companion',
  description: 'An intelligent, beautiful pet adoption platform that uses AI to match you with your forever friend. Browse dogs, cats, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className={cn('font-sans antialiased bg-background text-foreground min-h-screen flex flex-col', inter.variable, alegreya.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col flex-1">
            <Header />
              <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <BottomNav />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
