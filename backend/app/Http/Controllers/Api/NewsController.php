<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NewsApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    protected NewsApiService $newsApiService;

    public function __construct(NewsApiService $newsApiService)
    {
        $this->newsApiService = $newsApiService;
    }

    /**
     * Display a listing of news.
     * 
     * GET /api/news
     * 
     * Query Parameters:
     * - category: string (slug da categoria, ex: "mercado", "cripto")
     * - page: int (número da página, default: 1)
     * - per_page: int (itens por página, default: 12)
     * - offset: int (deslocamento para infinite scroll)
     * - limit: int (limite de itens para infinite scroll)
     */
    public function index(Request $request): JsonResponse
    {
        $category = $request->get('category', 'all');
        
        // Verifica se está usando offset/limit (infinite scroll) ou page/per_page (paginação tradicional)
        if ($request->has('offset')) {
            $offset = (int) $request->get('offset', 0);
            $limit = (int) $request->get('limit', 9);
            $limit = max(1, min(48, $limit));
            
            $result = $this->newsApiService->getNewsByOffset($category, $offset, $limit);
        } else {
            $page = (int) $request->get('page', 1);
            $perPage = (int) $request->get('per_page', 12);
            $perPage = max(1, min(48, $perPage));
            
            $result = $this->newsApiService->getNews($category, $page, $perPage);
        }

        return response()->json($result);
    }

    /**
     * Search news by query term.
     * 
     * GET /api/news/search?q=bitcoin
     * 
     * Query Parameters:
     * - q: string (termo de busca)
     * - limit: int (limite de resultados, default: 20)
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        $limit = (int) $request->get('limit', 20);
        $limit = max(1, min(50, $limit));

        $result = $this->newsApiService->searchNews($query, $limit);

        return response()->json($result);
    }

    /**
     * Display the specified news by slug.
     * 
     * GET /api/news/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $news = $this->newsApiService->getNewsBySlug($slug);

        if (!$news) {
            return response()->json([
                'success' => false,
                'message' => 'Notícia não encontrada.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $news,
        ]);
    }
}
