import { Metadata } from 'next';
import Link from 'next/link';
import { searchNews } from '@/lib/api';
import { NewsImage, CategoryBadge } from '@/components';
import { formatDate } from '@/lib/utils';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  
  return {
    title: q ? `Busca: "${q}" - MoneyBlog` : 'Buscar - MoneyBlog',
    description: q 
      ? `Resultados de busca para "${q}" no MoneyBlog` 
      : 'Busque notícias do mercado financeiro',
  };
}

// Função para destacar o termo buscado
function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark 
        key={index} 
        className="bg-gold-500/40 text-gold-300 px-1 rounded"
      >
        {part}
      </mark>
    ) : part
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';
  
  // Busca notícias se tiver query
  const result = query ? await searchNews(query, 50) : { news: [], total: 0, query: '' };

  return (
    <div className="bg-grid-pattern min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header da página */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-dark-400 hover:text-gold-400 transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para o início
          </Link>
          
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            {query ? (
              <>
                Resultados para &quot;<span className="text-gold-500">{query}</span>&quot;
              </>
            ) : (
              'Buscar notícias'
            )}
          </h1>
          
          {query && (
            <p className="text-dark-400">
              {result.total === 0 
                ? 'Nenhuma notícia encontrada' 
                : `${result.total} notícia${result.total > 1 ? 's' : ''} encontrada${result.total > 1 ? 's' : ''}`
              }
            </p>
          )}
        </div>

        {/* Sem query */}
        {!query && (
          <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-12 text-center">
            <svg 
              className="w-16 h-16 mx-auto text-dark-600 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">
              O que você está procurando?
            </h2>
            <p className="text-dark-400">
              Use a barra de busca no menu para encontrar notícias
            </p>
          </div>
        )}

        {/* Sem resultados */}
        {query && result.total === 0 && (
          <div className="bg-dark-900/50 border border-dark-800 rounded-2xl p-12 text-center">
            <svg 
              className="w-16 h-16 mx-auto text-dark-600 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">
              Nenhum resultado encontrado
            </h2>
            <p className="text-dark-400 mb-6">
              Não encontramos notícias para &quot;{query}&quot;
            </p>
            <div className="text-sm text-dark-500">
              <p className="mb-2">Sugestões:</p>
              <ul className="space-y-1">
                <li>• Verifique a ortografia</li>
                <li>• Tente usar termos mais genéricos</li>
                <li>• Use palavras-chave como: Bitcoin, S&P 500, Tesla, Fed</li>
              </ul>
            </div>
          </div>
        )}

        {/* Resultados */}
        {result.news.length > 0 && (
          <div className="space-y-4">
            {result.news.map((news, index) => (
              <Link
                key={news.id}
                href={`/noticias/${news.slug}`}
                className="block bg-dark-900/50 border border-dark-800 rounded-xl overflow-hidden hover:border-dark-700 hover:bg-dark-900 transition-all group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Imagem */}
                  <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0">
                    <NewsImage
                      src={news.image}
                      alt={news.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CategoryBadge
                        categoryName={news.categoryName}
                        categorySlug={news.category}
                        categoryColor={news.categoryColor}
                        size="sm"
                      />
                      <span className="text-dark-500 text-sm">
                        {formatDate(news.published_at)}
                      </span>
                    </div>

                    <h2 className="font-display text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
                      {highlightText(news.title, query)}
                    </h2>

                    <p className="text-dark-400 line-clamp-2 mb-4">
                      {highlightText(news.summary, query)}
                    </p>

                    <div className="flex items-center gap-2 text-gold-500 text-sm font-medium">
                      Ler notícia completa
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
