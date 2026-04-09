import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles
import SmoothScrolling from '@/components/SmoothScrolling';
import { AuthProvider } from '@/hooks/use-auth';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'NyayAI - Legal Documents Made Simple',
  description: 'Understand Legal Documents in Seconds. AI explanation in simple English & Hindi.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        <AuthProvider>
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </AuthProvider>
      </body>
    </html>
  );
}
