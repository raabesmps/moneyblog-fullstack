import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-grid-pattern">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold-500/20 mb-8">
          <svg
            className="w-12 h-12 text-gold-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
          </svg>
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
          404
        </h1>

        <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mb-4">
          Página não encontrada
        </h2>

        <p className="text-dark-400 text-lg max-w-md mx-auto mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-dark-950 font-medium rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
