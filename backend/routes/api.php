<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\NewsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Endpoints RESTful para o MoneyBlog
|
| GET /api/categories          - Lista todas as categorias
| GET /api/categories/{slug}   - Detalhes de uma categoria
| GET /api/news                - Lista notícias (com paginação e filtro)
| GET /api/news/{slug}         - Detalhes de uma notícia
|
*/

// Categories Routes
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{slug}', [CategoryController::class, 'show']);

// News Routes
Route::get('news/search', [NewsController::class, 'search']);
Route::get('news', [NewsController::class, 'index']);
Route::get('news/{slug}', [NewsController::class, 'show']);
