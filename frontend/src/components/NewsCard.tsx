'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { News } from '@/types';
import { CategoryBadge } from './CategoryBadge';
import { NewsImage } from './NewsImage';
import { formatDateShort, truncate } from '@/lib/utils';

interface NewsCardProps {
  news: News;
  featured?: boolean;
  index?: number;
}

export function NewsCard({ news, featured = false, index = 0 }: NewsCardProps) {
  const delay = index * 100;
  const searchParams = useSearchParams();
  
  // Pega a categoria atual da URL para passar como "from" na página de detalhes
  const currentCategory = searchParams.get('category') || 'all';
  const newsUrl = `/noticias/${news.slug}?from=${currentCategory}`;

  if (featured) {
    return (
      <article
        className="group relative overflow-hidden rounded-2xl bg-dark-900 animate-slide-up"
        style={{ animationDelay: `${delay}ms` }}
      >
        <Link href={newsUrl} className="block">
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <NewsImage
              src={news.image}
              alt={news.title}
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              fallbackSize="lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <CategoryBadge 
                categoryName={news.categoryName} 
                categorySlug={news.category} 
                categoryColor={news.categoryColor} 
                size="md" 
                clickable={false} 
              />
              <span className="text-dark-400 text-sm">
                {formatDateShort(news.published_at)}
              </span>
              <span className="text-dark-500">•</span>
              <span className="text-dark-400 text-sm">
                {news.source}
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors line-clamp-2">
              {news.title}
            </h2>

            <p className="text-dark-300 text-base md:text-lg line-clamp-2 max-w-3xl">
              {truncate(news.summary, 200)}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className="group bg-dark-900/50 rounded-xl overflow-hidden border border-dark-800 hover:border-gold-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link href={newsUrl} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <NewsImage
            src={news.image}
            alt={news.title}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fallbackSize="md"
          />
          <div className="absolute top-3 left-3 z-10">
            <CategoryBadge 
              categoryName={news.categoryName} 
              categorySlug={news.category} 
              categoryColor={news.categoryColor} 
              size="sm" 
              clickable={false} 
            />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 text-sm text-dark-400 mb-3">
            <span>{formatDateShort(news.published_at)}</span>
            <span className="text-dark-600">•</span>
            <span>{news.source}</span>
          </div>

          <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
            {news.title}
          </h3>

          <p className="text-dark-400 text-sm line-clamp-2 mb-4">
            {truncate(news.summary, 120)}
          </p>

          <div className="flex items-center justify-end">
            <span className="text-gold-500 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Ler mais
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
