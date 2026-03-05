'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { News } from '@/types';
import { NewsCard } from './NewsCard';

interface InfiniteNewsListProps {
  initialNews: News[];
  category?: string;
  hasMoreInitial: boolean;
  pageSize?: number;
  initialOffset?: number;
}

export function InfiniteNewsList({ 
  initialNews, 
  category, 
  hasMoreInitial,
  pageSize = 9,
  initialOffset = 10
}: InfiniteNewsListProps) {
  const [news, setNews] = useState<News[]>(initialNews);
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: pageSize.toString(),
      });
      
      if (category) {
        params.set('category', category);
      }

      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();

      if (data.news && data.news.length > 0) {
        setNews(prev => [...prev, ...data.news]);
        setOffset(offset + data.news.length);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more news:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [offset, loading, hasMore, category, pageSize]);

  // Intersection Observer para infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loading, loadMore]);

  // Reset quando categoria muda
  useEffect(() => {
    setNews(initialNews);
    setOffset(initialOffset);
    setHasMore(hasMoreInitial);
  }, [initialNews, hasMoreInitial, category, initialOffset]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <NewsCard key={`${item.slug}-${index}`} news={item} index={index} />
        ))}
      </div>

      {/* Loading indicator / Observer target */}
      <div ref={observerRef} className="mt-8 flex justify-center">
        {loading && (
          <div className="flex items-center gap-3 text-dark-400">
            <svg className="animate-spin h-6 w-6 text-gold-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Carregando mais notícias...</span>
          </div>
        )}
        
        {!hasMore && news.length > 0 && (
          <p className="text-dark-500 text-sm py-4">
            ✓ Você viu todas as {news.length} notícias disponíveis
          </p>
        )}
      </div>
    </>
  );
}
