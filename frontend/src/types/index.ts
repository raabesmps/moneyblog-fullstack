// Tipos internos da aplicação
export interface News {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string | null;
  source: string;
  category: string;
  categoryName: string;
  categoryColor: string;
  url: string;
  published_at: string;
  // Campos alternativos vindos da API Laravel (snake_case)
  category_name?: string;
  category_color?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  query?: string;
}
