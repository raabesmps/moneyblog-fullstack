'use client';

import { useState } from 'react';
import { News } from '@/types';
import { NewsCard } from './NewsCard';

interface RelatedNewsPaginatedProps {
  news: News[];
  categoryName: string;
  itemsPerPage?: number;
}

export function RelatedNewsPaginated({ 
  news, 
  categoryName,
  itemsPerPage = 3 
}: RelatedNewsPaginatedProps) {
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentNews = news.slice(startIndex, startIndex + itemsPerPage);

  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  if (news.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-1 h-8 bg-gold-500 rounded-full" />
          {categoryName}
        </h2>
        
        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-dark-400 text-sm mr-2">
              {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={goToPrevious}
              disabled={currentPage === 0}
              className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Página anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Próxima página"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentNews.map((item, index) => (
          <NewsCard key={item.id} news={item} index={index} />
        ))}
      </div>

      {/* Indicadores de página (dots) */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentPage 
                  ? 'bg-gold-500 w-6' 
                  : 'bg-dark-700 hover:bg-dark-600'
              }`}
              aria-label={`Ir para página ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
