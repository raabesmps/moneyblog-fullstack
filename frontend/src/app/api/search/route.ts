import { NextRequest, NextResponse } from 'next/server';
import { searchNews } from '@/lib/api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    const result = await searchNews(query, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { news: [], query, total: 0, error: 'Failed to search news' },
      { status: 500 }
    );
  }
}
