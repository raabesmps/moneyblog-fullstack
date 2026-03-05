import { News, Category } from '@/types';

// URL base da API Laravel
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Tipos de resposta da API Laravel
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    has_more: boolean;
  };
  message?: string;
}

export interface PaginatedNews {
  news: News[];
  totalResults: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SearchResult {
  news: News[];
  query: string;
  total: number;
}

/**
 * Busca todas as categorias da API Laravel
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      next: { revalidate: 3600 }, // Cache por 1 hora (categorias mudam pouco)
    });

    if (!response.ok) {
      console.error('API Error:', response.status);
      return getStaticCategories();
    }

    const data: ApiResponse<Category[]> = await response.json();
    return data.data || getStaticCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return getStaticCategories();
  }
}

/**
 * Busca uma categoria pelo slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return getStaticCategories().find(c => c.slug === slug) || getStaticCategories()[0];
    }

    const data: ApiResponse<Category> = await response.json();
    return data.data || getStaticCategories()[0];
  } catch (error) {
    console.error('Error fetching category:', error);
    return getStaticCategories().find(c => c.slug === slug) || getStaticCategories()[0];
  }
}

/**
 * Busca notícias da API Laravel
 */
export async function getMarketNews(categorySlug?: string, page: number = 1, pageSize: number = 12): Promise<News[]> {
  const result = await getMarketNewsPaginated(categorySlug, page, pageSize);
  return result.news;
}

/**
 * Busca notícias com paginação da API Laravel
 */
export async function getMarketNewsPaginated(
  categorySlug?: string, 
  page: number = 1, 
  pageSize: number = 12
): Promise<PaginatedNews> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: pageSize.toString(),
    });

    if (categorySlug && categorySlug !== 'all') {
      params.set('category', categorySlug);
    }

    const response = await fetch(`${API_BASE_URL}/news?${params}`, {
      cache: 'no-store', // Sem cache para garantir dados atualizados
    });

    if (!response.ok) {
      console.error('API Error:', response.status);
      return getMockNewsPaginated(categorySlug, page, pageSize);
    }

    const data: ApiResponse<News[]> = await response.json();

    // Mapeia os dados para garantir compatibilidade
    const news = (data.data || []).map(article => ({
      ...article,
      categoryName: article.category_name || article.categoryName || 'Geral',
      categoryColor: article.category_color || article.categoryColor || '#f7c600',
    }));

    return {
      news,
      totalResults: data.meta?.total || news.length,
      page: data.meta?.current_page || page,
      pageSize: data.meta?.per_page || pageSize,
      hasMore: data.meta?.has_more || false,
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return getMockNewsPaginated(categorySlug, page, pageSize);
  }
}

/**
 * Busca notícias com offset (para infinite scroll)
 */
export async function getMarketNewsByOffset(
  categorySlug?: string,
  offset: number = 0,
  limit: number = 9
): Promise<PaginatedNews> {
  try {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    });

    if (categorySlug && categorySlug !== 'all') {
      params.set('category', categorySlug);
    }

    const response = await fetch(`${API_BASE_URL}/news?${params}`, {
      cache: 'no-store', // Sem cache para infinite scroll
    });

    if (!response.ok) {
      console.error('API Error:', response.status);
      return getMockNewsByOffset(categorySlug, offset, limit);
    }

    const data: ApiResponse<News[]> = await response.json();

    // Mapeia os dados para garantir compatibilidade
    const news = (data.data || []).map(article => ({
      ...article,
      categoryName: article.category_name || article.categoryName || 'Geral',
      categoryColor: article.category_color || article.categoryColor || '#f7c600',
    }));

    return {
      news,
      totalResults: data.meta?.total || 0,
      page: 1,
      pageSize: limit,
      hasMore: data.meta?.has_more || false,
    };
  } catch (error) {
    console.error('Error fetching news by offset:', error);
    return getMockNewsByOffset(categorySlug, offset, limit);
  }
}

/**
 * Fallback: busca notícias com offset de dados mockados
 */
function getMockNewsByOffset(categorySlug?: string, offset: number = 0, limit: number = 9): PaginatedNews {
  const allMock = getMockNewsPaginated(categorySlug, 1, 100);
  const sliced = allMock.news.slice(offset, offset + limit);
  
  return {
    news: sliced,
    totalResults: allMock.totalResults,
    page: 1,
    pageSize: limit,
    hasMore: offset + limit < allMock.totalResults,
  };
}

/**
 * Busca notícias por termo de pesquisa
 */
export async function searchNews(query: string, limit: number = 20): Promise<SearchResult> {
  try {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/news/search?${params}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Search API Error:', response.status);
      return { news: [], query, total: 0 };
    }

    const data = await response.json();

    // Mapeia os dados para garantir compatibilidade
    const news = (data.data || []).map((article: News) => ({
      ...article,
      categoryName: article.category_name || article.categoryName || 'Geral',
      categoryColor: article.category_color || article.categoryColor || '#f7c600',
    }));

    return {
      news,
      query: data.meta?.query || query,
      total: data.meta?.total || news.length,
    };
  } catch (error) {
    console.error('Error searching news:', error);
    return { news: [], query, total: 0 };
  }
}

/**
 * Busca uma notícia pelo slug
 */
export async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/news/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      // Fallback: busca em todas as categorias localmente
      return getNewsBySlugFallback(slug);
    }

    const data: ApiResponse<News> = await response.json();
    
    if (!data.data) {
      return null;
    }

    // Mapeia para garantir compatibilidade
    return {
      ...data.data,
      categoryName: data.data.category_name || data.data.categoryName || 'Geral',
      categoryColor: data.data.category_color || data.data.categoryColor || '#f7c600',
    };
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    return getNewsBySlugFallback(slug);
  }
}

/**
 * Fallback: busca notícia pelo slug em todas as categorias
 */
async function getNewsBySlugFallback(slug: string): Promise<News | null> {
  const categories = getStaticCategories();
  
  for (const category of categories) {
    const result = await getMarketNewsPaginated(category.slug, 1, 50);
    const found = result.news.find(n => n.slug === slug);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * Categorias estáticas (fallback)
 */
function getStaticCategories(): Category[] {
  return [
    { id: 'all', name: 'Todas', slug: 'all', color: '#f7c600', query: '' },
    { id: 'mercado', name: 'Mercado', slug: 'mercado', color: '#10B981', query: '' },
    { id: 'cripto', name: 'Cripto', slug: 'cripto', color: '#8B5CF6', query: '' },
    { id: 'economia', name: 'Economia', slug: 'economia', color: '#3B82F6', query: '' },
    { id: 'empresas', name: 'Empresas', slug: 'empresas', color: '#EC4899', query: '' },
  ];
}

/**
 * Dados de demonstração (fallback quando API não responde)
 */
function getMockNewsPaginated(categorySlug?: string, page: number = 1, pageSize: number = 12): PaginatedNews {
  const mockNews: News[] = [
    {
      id: 1,
      title: 'Bitcoin Atinge Nova Máxima Histórica e Supera US$ 100.000',
      slug: 'bitcoin-atinge-nova-maxima-historica-supera-100000-1',
      summary: 'A maior criptomoeda do mundo quebrou a barreira dos seis dígitos pela primeira vez na história.',
      content: '<p>O Bitcoin atingiu um marco histórico ao ultrapassar US$ 100.000.</p>',
      image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
      source: 'CryptoNews',
      category: 'cripto',
      categoryName: 'Cripto',
      categoryColor: '#8B5CF6',
      url: 'https://example.com/bitcoin-news',
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 2,
      title: 'S&P 500 Fecha em Alta com Otimismo sobre Política Monetária',
      slug: 'sp-500-fecha-alta-otimismo-politica-monetaria-2',
      summary: 'O principal índice da bolsa americana subiu 1,8% nesta sessão.',
      content: '<p>O S&P 500 encerrou o pregão em alta de 1,8%.</p>',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      source: 'MarketWatch',
      category: 'mercado',
      categoryName: 'Mercado',
      categoryColor: '#10B981',
      url: 'https://example.com/sp500-news',
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 3,
      title: 'Federal Reserve Mantém Juros e Sinaliza Possível Corte',
      slug: 'federal-reserve-mantem-juros-sinaliza-corte-3',
      summary: 'O Fed decidiu manter a taxa de juros inalterada.',
      content: '<p>O Federal Reserve manteve a taxa de juros na faixa atual.</p>',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
      source: 'Reuters',
      category: 'economia',
      categoryName: 'Economia',
      categoryColor: '#3B82F6',
      url: 'https://example.com/fed-news',
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      id: 4,
      title: 'Tesla Anuncia Novo Modelo de Veículo Elétrico Acessível',
      slug: 'tesla-anuncia-novo-modelo-veiculo-eletrico-acessivel-4',
      summary: 'A montadora revelou planos para um carro abaixo de US$ 30.000.',
      content: '<p>A Tesla anunciou o desenvolvimento de um novo veículo elétrico.</p>',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
      source: 'TechCrunch',
      category: 'empresas',
      categoryName: 'Empresas',
      categoryColor: '#EC4899',
      url: 'https://example.com/tesla-news',
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
  ];

  // Filtra por categoria
  const filtered = categorySlug && categorySlug !== 'all'
    ? mockNews.filter(n => n.category === categorySlug)
    : mockNews;

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return {
    news: paginated,
    totalResults: filtered.length,
    page,
    pageSize,
    hasMore: start + pageSize < filtered.length,
  };
}
