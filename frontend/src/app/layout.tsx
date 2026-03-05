import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header, Footer } from '@/components';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MoneyBlog - Notícias do Mercado Financeiro',
    template: '%s | MoneyBlog',
  },
  description: 'Sua fonte de notícias do mercado financeiro. Acompanhe as últimas novidades sobre forex, criptomoedas, fusões e economia global.',
  keywords: ['mercado financeiro', 'forex', 'criptomoedas', 'economia', 'investimentos', 'notícias financeiras'],
  authors: [{ name: 'MoneyBlog' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://moneyblog.com.br',
    siteName: 'MoneyBlog',
    title: 'MoneyBlog - Notícias do Mercado Financeiro',
    description: 'Sua fonte de notícias do mercado financeiro.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoneyBlog - Notícias do Mercado Financeiro',
    description: 'Sua fonte de notícias do mercado financeiro.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
