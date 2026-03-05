import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNewsBySlug, getMarketNewsPaginated } from '@/lib/api';
import { CategoryBadge, ShareButton, BackButton, NewsImage, RelatedNewsPaginated } from '@/components';
import { formatDate } from '@/lib/utils';

interface NewsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const news = await getNewsBySlug(slug);
    
    if (!news) {
      return { title: 'Notícia não encontrada' };
    }

    return {
      title: news.title,
      description: news.summary,
      openGraph: {
        title: news.title,
        description: news.summary,
        type: 'article',
        publishedTime: news.published_at,
        images: news.image ? [{ url: news.image, width: 1200, height: 630 }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: news.title,
        description: news.summary,
        images: news.image ? [news.image] : [],
      },
    };
  } catch {
    return {
      title: 'Notícia não encontrada',
    };
  }
}

export default async function NewsPage({ params, searchParams }: NewsPageProps) {
  const { slug } = await params;
  const { from } = await searchParams;

  const news = await getNewsBySlug(slug);
  
  if (!news) {
    notFound();
  }

  // Determina qual categoria usar para notícias relacionadas
  // Se veio de "all" (Todas), busca de todas as categorias
  // Se veio de uma categoria específica, busca só dessa categoria
  const relatedCategory = from === 'all' ? 'all' : news.category;
  const isFromAll = from === 'all' || !from;

  // Fetch related news (12 notícias para paginação de 3 por página = 4 páginas)
  let relatedNews;
  try {
    const result = await getMarketNewsPaginated(relatedCategory, 1, 13);
    // Remove a notícia atual da lista de relacionadas
    relatedNews = result.news.filter(n => n.id !== news.id).slice(0, 12);
  } catch {
    relatedNews = [];
  }

  // Título da seção de relacionadas
  // Usa o categoryName direto da notícia (já vem da API)
  const relatedTitle = isFromAll ? 'Mais Notícias' : `Mais Notícias de ${news.categoryName}`;

  return (
    <div className="bg-grid-pattern min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
        <NewsImage
          src={news.image}
          alt={news.title}
          priority
          className="object-cover"
          fallbackSize="lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />
      </div>

      <article className="container mx-auto px-4 py-8 md:py-12">
        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8 animate-fade-in flex-wrap">
          <BackButton />
          <div className="flex items-center gap-3">
            <span className="text-dark-400 text-sm hidden sm:inline">Compartilhar:</span>
            <ShareButton 
              title={news.title} 
              sourceUrl={news.url}
            />
          </div>
        </div>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto mb-10 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <CategoryBadge 
              categoryName={news.categoryName} 
              categorySlug={news.category} 
              categoryColor={news.categoryColor} 
              size="lg" 
            />
            <span className="text-dark-400 text-sm">
              Fonte: {news.source}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {news.title}
          </h1>

          <p className="text-xl text-dark-300 mb-6 leading-relaxed">
            {news.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-dark-400 border-t border-b border-dark-800 py-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: news.categoryColor }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">{news.source}</p>
                <p className="text-sm text-dark-500">Fonte</p>
              </div>
            </div>

            <div className="h-10 w-px bg-dark-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(news.published_at)}</span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div 
          className="max-w-4xl mx-auto article-content text-lg animate-slide-up"
          style={{ animationDelay: '100ms' }}
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* Link para fonte original */}
        <div className="max-w-4xl mx-auto mt-8">
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-dark-950 font-semibold rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ler notícia completa na fonte
          </a>
        </div>

        {/* Share Section */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-dark-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-dark-900/50 rounded-xl p-6 border border-dark-800">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Gostou desta notícia?
              </h3>
              <p className="text-dark-400">
                Compartilhe com seus amigos e colegas investidores
              </p>
            </div>
            <ShareButton 
              title={news.title}
              sourceUrl={news.url}
            />
          </div>
        </div>

        {/* Related News with Pagination */}
        <RelatedNewsPaginated 
          news={relatedNews} 
          categoryName={relatedTitle}
          itemsPerPage={3}
        />
      </article>
    </div>
  );
}
