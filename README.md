# 💰 MoneyBlog - Notícias do Mercado Financeiro

Uma aplicação full-stack de notícias financeiras com **Laravel** no backend e **Next.js** no frontend.

![Laravel](https://img.shields.io/badge/Laravel-10-FF2D20?style=flat-square&logo=laravel)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

--- 
<p align="center">
  <img src="screenshots/live.gif" alt="MoneyBlog Demo" />
</p> 

---

## 🎯 Sobre o Projeto

MoneyBlog é uma aplicação de notícias focada no **mercado financeiro** que demonstra conhecimentos em:

- 🔧 **Backend com Laravel**: API RESTful com dados estruturados
- ⚛️ **Frontend com Next.js**: SSR, rotas dinâmicas, infinite scroll
- 🔗 **Integração full-stack**: Frontend consumindo API própria
- 📱 **Design responsivo**: Tema escuro com dourado usando Tailwind CSS
- 🔄 **Compartilhamento social**: Facebook, LinkedIn, WhatsApp

---

## 🏗 Arquitetura

```
┌─────────────────┐     ┌─────────────────┐
│     Frontend    │────▶│     Backend     │
│    (Next.js)    │     │    (Laravel)    │
└─────────────────┘     └─────────────────┘
        │                       │
        │   GET /api/news       │   Dados Mockados
        │   GET /api/categories │   (36 notícias)
        ▼                       ▼
   ┌─────────┐            ┌──────────────┐
   │  React  │            │  Service     │
   │   UI    │            │  Layer       │
   └─────────┘            └──────────────┘
```

**Fluxo de dados:**
1. **Next.js** (frontend) faz requisição para **Laravel** (backend)
2. **Laravel** processa a requisição no `NewsApiService`
3. **Laravel** retorna os dados formatados com paginação
4. **Next.js** renderiza os componentes React

---

## ✨ Funcionalidades

### Backend (Laravel)
| Feature | Status |
|---------|--------|
| API RESTful com endpoints para categories e news | ✅ |
| Endpoint de busca por termo (`/api/news/search`) | ✅ |
| Service layer organizado (`NewsApiService`) | ✅ |
| 36 notícias completas do mercado financeiro | ✅ |
| Paginação de resultados | ✅ |
| Filtro por categoria | ✅ |
| Busca por slug da notícia | ✅ |
| CORS configurado | ✅ |
| Sem dependência de banco de dados | ✅ |

### Frontend (Next.js)
| Feature | Status |
|---------|--------|
| Consumo da API Laravel | ✅ |
| Busca de notícias com destaque do termo | ✅ |
| Infinite Scroll com Intersection Observer | ✅ |
| Filtro por categorias (Todas, Mercado, Cripto, Economia, Empresas) | ✅ |
| Notícia em destaque (featured) | ✅ |
| Paginação tradicional nas notícias relacionadas | ✅ |
| Imagem placeholder quando não há foto | ✅ |
| Compartilhamento funcional (Facebook, LinkedIn, WhatsApp, Copiar) | ✅ |
| Design responsivo | ✅ |
| SEO otimizado com meta tags dinâmicas | ✅ |
| Loading states (skeletons) | ✅ |
| Toast notification ao copiar link | ✅ |

---

## 🛠 Tecnologias Utilizadas

### Backend
| Tecnologia | Uso |
|------------|-----|
| **Laravel 10** | Framework PHP |
| **Service Layer** | Padrão de arquitetura |

### Frontend
| Tecnologia | Uso |
|------------|-----|
| **Next.js 14** | Framework React com App Router e SSR |
| **React 18** | Biblioteca de UI |
| **TypeScript** | Tipagem estática |
| **Tailwind CSS** | Framework de estilos utilitários |
| **Intersection Observer** | Infinite scroll |

---

## 📦 Pré-requisitos

- PHP 8.1+
- Composer
- Node.js 18+
- npm ou yarn

---

## 🚀 Instalação e Execução

### 1. Clonar o repositório 

### 2. Configurar o Backend (Laravel)

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências PHP
composer install

# Criar arquivo de ambiente
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Iniciar o servidor Laravel
php artisan serve
```

✅ Backend rodando na porta indicada após o retorno do `php artisan serve`.

### 3. Configurar o Frontend (Next.js)

```bash
# Em outro terminal, entrar na pasta do frontend
cd frontend

# Instalar dependências
npm install

# Configurar URL da API (ajuste a porta se necessário)
# O arquivo .env.local deve ter:
# NEXT_PUBLIC_API_URL=http://localhost:[porta do backend]/api

# Iniciar o servidor Next.js
npm run dev
```

✅ Frontend rodando na porta indicada após o retorno do `npm run dev`.

---

## 📡 Endpoints da API

### Categorias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categories` | Lista todas as categorias |
| GET | `/api/categories/{slug}` | Detalhes de uma categoria |

**Exemplo de resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "mercado",
      "name": "Mercado",
      "slug": "mercado",
      "color": "#10B981"
    }
  ]
}
```

### Notícias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/news` | Lista notícias (paginado) |
| GET | `/api/news/search` | Busca notícias por termo |
| GET | `/api/news/{slug}` | Detalhes de uma notícia |

**Parâmetros de query:**
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `category` | string | - | Filtrar por categoria |
| `page` | int | 1 | Número da página |
| `per_page` | int | 12 | Itens por página |

**Exemplo de requisição:**
```
GET /api/news?category=cripto&page=1&per_page=12
```

**Exemplo de resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Bitcoin Atinge Nova Máxima Histórica...",
      "slug": "bitcoin-atinge-nova-maxima-historica-supera-100000",
      "summary": "A maior criptomoeda do mundo...",
      "content": "<p>Conteúdo HTML completo...</p>",
      "image": "https://images.unsplash.com/...",
      "source": "CryptoNews Brasil",
      "url": "https://www.coindesk.com/...",
      "category": "cripto",
      "category_name": "Cripto",
      "category_color": "#8B5CF6",
      "published_at": "2026-03-05T10:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 12,
    "total": 36,
    "last_page": 3,
    "has_more": true
  }
}
```

---

## 📬 Collection do Postman

Para facilitar os testes da API, incluí uma Collection do Postman com todos os endpoints configurados.

### Como importar

1. Abra o Postman
2. Clique em Import (canto superior esquerdo)
3. Selecione o arquivo `MoneyBlog_API.postman_collection.json`
4. A collection será importada automaticamente

### Endpoints incluídos

| Pasta | Requisição | Endpoint |
|-------|------------|----------|
| Categories | List All Categories | `GET /api/categories` |
| Categories | Get Category by Slug | `GET /api/categories/{slug}` |
| News | List All News | `GET /api/news` |
| News | List News with Pagination | `GET /api/news?page=1&per_page=6` |
| News | List News by Category | `GET /api/news?category=cripto` |
| News | Search News | `GET /api/news/search?q=bitcoin` |
| News | Get News by Slug | `GET /api/news/{slug}` |

> **Obs.:** A variável `{{base_url}}` está configurada para `http://localhost:8000/api`. Ajuste se necessário.

---

## 💡 Decisões Técnicas

### Arquitetura Backend-Frontend Separada
- **Separação de responsabilidades**: Backend cuida da lógica de negócio
- **Reutilizável**: API pode ser consumida por outras aplicações (mobile, etc.)
- **Escalável**: Cada parte pode ser deployada independentemente

### Sem Banco de Dados
O projeto foi desenvolvido sem dependência de banco de dados:
- Dados mockados diretamente no Service Layer
- 36 notícias completas com conteúdo do mercado financeiro
- Elimina necessidade de migrations, seeders e configuração de DB 
- Facilita a instalação e execução do projeto

### Service Layer no Laravel
O `NewsApiService` encapsula toda a lógica de dados:
```php
class NewsApiService
{
    public function getNews(string $category, int $page, int $pageSize): array
    public function getNewsByOffset(string $category, int $offset, int $limit): array
    public function searchNews(string $query, int $limit): array  // Busca
    public function getNewsBySlug(string $slug): ?array
    public function getCategories(): array
    protected function getMockNews(): array // 36 notícias
}
```

### Categorias do Mercado Financeiro
| Categoria | Assuntos |
|-----------|----------|
| **Mercado** | Bolsas, índices (S&P 500, Ibovespa) |
| **Cripto** | Bitcoin, Ethereum, NFTs, DeFi |
| **Economia** | Fed, juros, inflação, PIB |
| **Empresas** | Apple, Tesla, Microsoft, Nvidia |

### Infinite Scroll no Frontend
Implementado com Intersection Observer:
- Carrega 9 notícias por vez
- Total de 36 notícias disponíveis
- Loading indicator automático

### Busca de Notícias
Funcionalidade completa de busca:
- **Backend**: Endpoint `/api/news/search` busca em título, resumo e conteúdo
- **Frontend**: Barra de busca no header com dropdown de sugestões (debounce 300ms)
- **Página de resultados**: Destaque do termo buscado com "marca-texto" dourado
- Busca case-insensitive em português

### Compartilhamento com URL Real
O compartilhamento usa links reais de fontes conhecidas:
- Preview de acordo com o link no Facebook/LinkedIn
- Imagem e título carregados automaticamente

---

## 📁 Estrutura do Projeto

```
moneyblog-fullstack/
├── backend/                       # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── CategoryController.php
│   │   │   └── NewsController.php
│   │   └── Services/
│   │       └── NewsApiService.php    # 36 notícias mockadas + busca
│   ├── config/
│   │   └── cors.php                  # Configuração CORS
│   ├── routes/
│   │   ├── api.php                   # Rotas da API
│   │   └── web.php
│   ├── composer.json
│   └── .env.example
│
├── frontend/                      # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Home (infinite scroll)
│   │   │   ├── busca/page.tsx        # Página de busca
│   │   │   ├── noticias/[slug]/      # Detalhes da notícia
│   │   │   ├── api/                  # API Routes (proxy)
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── loading.tsx
│   │   ├── components/               # 14 componentes reutilizáveis
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   ├── InfiniteNewsList.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── api.ts                # Funções de consumo da API
│   │   │   └── utils.ts
│   │   └── types/
│   │       └── index.ts              # TypeScript interfaces
│   ├── package.json
│   └── .env.local
│
├── screenshots/                   # Demo
│   └── live.gif                     # GIF demonstrando a aplicação
│
├── MoneyBlog_API.postman_collection.json
├── .gitignore
└── README.md
```

---

## ⚠️ Troubleshooting

### "CORS Error"
1. Verifique se o backend Laravel está rodando
2. Confirme que `config/cors.php` tem `'allowed_origins' => ['*']`

### "Connection refused"
1. Confirme que o backend está rodando na porta correta
2. Verifique o `NEXT_PUBLIC_API_URL` no frontend (`.env.local`)
3. Reinicie o Next.js após alterar variáveis de ambiente

### "Nenhuma notícia encontrada"
1. Verifique se o backend Laravel está rodando
2. Teste a API diretamente: `http://localhost:[porta do backend]/api/news`

---

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.

---

## 👤 Autor

Desenvolvido com ❤️ para demonstrar habilidades em desenvolvimento full-stack com Laravel e Next.js.
