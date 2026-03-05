<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NewsApiService;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    protected NewsApiService $newsApiService;

    public function __construct(NewsApiService $newsApiService)
    {
        $this->newsApiService = $newsApiService;
    }

    /**
     * Display a listing of the categories.
     * 
     * GET /api/categories
     */
    public function index(): JsonResponse
    {
        $categories = $this->newsApiService->getCategories();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Display the specified category.
     * 
     * GET /api/categories/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $category = $this->newsApiService->getCategoryBySlug($slug);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoria não encontrada.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }
}
