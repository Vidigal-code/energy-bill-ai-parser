import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SessionInitializer } from '@/features/session/init-session';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Energy Bill Platform',
  description: 'Frontend enterprise para o parser de faturas de energia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem('ebill-theme');var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=stored||(prefersDark?'dark':'light');var root=document.documentElement;root.classList.remove('theme-light','theme-dark');root.classList.add(theme==='dark'?'theme-dark':'theme-light');}catch(_e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <SessionInitializer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
