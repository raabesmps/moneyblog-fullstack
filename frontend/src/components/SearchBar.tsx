'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { News } from '@/types';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<News[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce search
  const searchNews = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      setResults(data.news || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchNews(query.trim());
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchNews]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  // Handle result click
  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  // Highlight matching text
  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-gold-500/30 text-gold-400 rounded px-0.5">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder="Buscar notícias..."
          className="w-full sm:w-64 lg:w-80 px-4 py-2 pl-10 bg-dark-800 border border-dark-700 rounded-full text-white placeholder-dark-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-sm"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-gold-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </form>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-dark-900 border border-dark-700 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          <div className="p-2">
            {results.map((news) => (
              <Link
                key={news.id}
                href={`/noticias/${news.slug}`}
                onClick={handleResultClick}
                className="block p-3 hover:bg-dark-800 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: news.categoryColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium line-clamp-1">
                      {highlightMatch(news.title, query)}
                    </h4>
                    <p className="text-dark-400 text-xs line-clamp-1 mt-1">
                      {highlightMatch(news.summary, query)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="border-t border-dark-700 p-2">
            <button
              onClick={handleSubmit}
              className="w-full py-2 text-sm text-gold-500 hover:text-gold-400 hover:bg-dark-800 rounded-lg transition-colors"
            >
              Ver todos os resultados para &quot;{query}&quot;
            </button>
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-dark-900 border border-dark-700 rounded-xl shadow-2xl p-4 z-50"
        >
          <p className="text-dark-400 text-sm text-center">
            Nenhuma notícia encontrada para &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
