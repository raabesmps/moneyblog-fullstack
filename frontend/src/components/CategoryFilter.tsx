'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Category } from '@/types';
import { getCategories } from '@/lib/api';

// Categorias estáticas como fallback
const STATIC_CATEGORIES: Category[] = [
  { id: 'all', name: 'Todas', slug: 'all', color: '#f7c600' },
  { id: 'mercado', name: 'Mercado', slug: 'mercado', color: '#10B981' },
  { id: 'cripto', name: 'Cripto', slug: 'cripto', color: '#8B5CF6' },
  { id: 'economia', name: 'Economia', slug: 'economia', color: '#3B82F6' },
  { id: 'empresas', name: 'Empresas', slug: 'empresas', color: '#EC4899' },
];

export function CategoryFilter() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const [categories, setCategories] = useState<Category[]>(STATIC_CATEGORIES);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        // Mantém as categorias estáticas como fallback
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const isActive = category.slug === 'all' 
          ? !currentCategory 
          : currentCategory === category.slug;
        
        return (
          <Link
            key={category.id}
            href={category.slug === 'all' ? '/' : `/?category=${category.slug}`}
            className={`
              shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200
              ${
                isActive
                  ? 'shadow-lg'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
              }
            `}
            style={
              isActive
                ? {
                    backgroundColor: category.color,
                    color: category.slug === 'all' ? '#0a0a0a' : 'white',
                    boxShadow: `0 10px 25px -5px ${category.color}40`,
                  }
                : {}
            }
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
