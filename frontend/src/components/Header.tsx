'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SearchBar } from './SearchBar';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-dark-950/95 backdrop-blur-md border-b border-dark-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/40 transition-shadow">
              <svg
                className="w-6 h-6 text-dark-950"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
              </svg>
            </div>
            <span className="font-display text-xl md:text-2xl font-bold text-white tracking-tight">
              Money<span className="text-gold-500">Blog</span>
            </span>
          </Link>

          {/* Desktop Navigation + Search */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-dark-300 hover:text-gold-400 transition-colors font-medium"
              >
                Início
              </Link>
              <Link
                href="/?category=mercado"
                className="text-dark-300 hover:text-gold-400 transition-colors font-medium"
              >
                Mercado
              </Link>
              <Link
                href="/?category=cripto"
                className="text-dark-300 hover:text-gold-400 transition-colors font-medium"
              >
                Cripto
              </Link>
              <Link
                href="/?category=economia"
                className="text-dark-300 hover:text-gold-400 transition-colors font-medium"
              >
                Economia
              </Link>
            </nav>
            
            {/* Search Bar */}
            <SearchBar />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-dark-300 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-dark-800 animate-fade-in">
            {/* Mobile Search */}
            <div className="px-4 pb-4">
              <SearchBar className="w-full" />
            </div>
            
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-dark-300 hover:text-gold-400 hover:bg-dark-800/50 rounded-lg transition-colors font-medium"
              >
                Início
              </Link>
              <Link
                href="/?category=mercado"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-dark-300 hover:text-gold-400 hover:bg-dark-800/50 rounded-lg transition-colors font-medium"
              >
                Mercado
              </Link>
              <Link
                href="/?category=cripto"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-dark-300 hover:text-gold-400 hover:bg-dark-800/50 rounded-lg transition-colors font-medium"
              >
                Cripto
              </Link>
              <Link
                href="/?category=economia"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-dark-300 hover:text-gold-400 hover:bg-dark-800/50 rounded-lg transition-colors font-medium"
              >
                Economia
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
