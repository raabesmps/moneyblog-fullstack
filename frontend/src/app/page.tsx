import { Suspense } from 'react';
import { getMarketNewsPaginated, getCategoryBySlug } from '@/lib/api';
import { NewsCard, CategoryFilter, FeaturedSkeleton, NewsCardSkeleton, InfiniteNewsList } from '@/components';

// Força renderização dinâmica para garantir dados atualizados na navegação
export const dynamic = 'force-dynamic';

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

async function NewsContent({ category }: { category?: string }) {
  // Carrega 10 notícias: 1 destaque + 9 no grid (múltiplo de 3 para layout)
  const GRID_SIZE = 9;
  const result = await getMarketNewsPaginated(category, 1, GRID_SIZE + 1); // +1 para o destaque
  const currentCategory = category ? await getCategoryBySlug(category) : null;

  const featuredNews = result.news[0];
  const otherNews = result.news.slice(1); // Pega todos exceto o destaque

  // Calcula se há mais notícias além das exibidas
  // Para "all" (sem categoria): total 36, carrega 10 → hasMore = true
  // Para categorias específicas: total 9, carrega 9 → hasMore = false
  const hasMoreNews = result.totalResults > result.news.length;

  return (
    <>
      {/* Category Filter */}
      <section className="container mx-auto px-4 mb-8">
        <Suspense fallback={<div className="h-10 bg-dark-800 rounded-full w-96 animate-pulse" />}>
          <CategoryFilter />
        </Suspense>
      </section>

      {/* Featured News */}
      {featuredNews && (
        <section key={`featured-${category || 'all'}`} className="container mx-auto px-4 mb-12">
          <NewsCard news={featuredNews} featured fromCategory={category} />
        </section>
      )}

      {/* News Grid with Infinite Scroll */}
      {otherNews.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-gold-500 rounded-full" />
            {currentCategory && currentCategory.slug !== 'all' ? `Notícias de ${currentCategory.name}` : 'Últimas Notícias do Mercado'}
          </h2>
          <InfiniteNewsList 
            key={category || 'all'}
            initialNews={otherNews} 
            category={category}
            hasMoreInitial={hasMoreNews}
            pageSize={GRID_SIZE}
            initialOffset={GRID_SIZE + 1}
          />
        </section>
      )}

      {result.news.length === 0 && (
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="w-24 h-24 mx-auto text-dark-700 mb-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
            </svg>
            <h3 className="font-display text-xl font-semibold text-white mb-2">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-dark-400">
              Não encontramos notícias para esta categoria. Tente outra categoria ou volte mais tarde.
            </p>
          </div>
        </section>
      )}
    </>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <section className="container mx-auto px-4 mb-8">
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-dark-800 rounded-full animate-pulse" />
          ))}
        </div>
      </section>
      <section className="container mx-auto px-4 mb-12">
        <FeaturedSkeleton />
      </section>
      <section className="container mx-auto px-4 pb-16">
        <div className="h-8 w-48 bg-dark-800 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const category = params.category;

  return (
    <div className="bg-grid-pattern min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-600/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl animate-slide-up">
            <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium mb-4 border border-gold-500/30">
              💰 Bem-vindo ao MoneyBlog
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Notícias do{' '}
              <span className="text-gold-gradient">
                Mercado Financeiro
              </span>
            </h1>
            <p className="text-lg md:text-xl text-dark-300 max-w-2xl">
              Acompanhe as principais notícias sobre ações, criptomoedas, 
              economia e tudo que move o mundo dos investimentos.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingSkeleton />}>
        <NewsContent category={category} />
      </Suspense>
    </div>
  );
}
