import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-950 border-t border-dark-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-dark-950"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                </svg>
              </div>
              <span className="font-display text-xl font-bold text-white">
                Money<span className="text-gold-500">Blog</span>
              </span>
            </Link>
            <p className="text-dark-400 max-w-sm">
              Sua fonte de notícias do mercado financeiro. Acompanhe as últimas novidades sobre
              ações, criptomoedas, economia e muito mais.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/?category=mercado" className="text-dark-400 hover:text-gold-500 transition-colors">
                  Mercado
                </Link>
              </li>
              <li>
                <Link href="/?category=cripto" className="text-dark-400 hover:text-gold-500 transition-colors">
                  Criptomoedas
                </Link>
              </li>
              <li>
                <Link href="/?category=economia" className="text-dark-400 hover:text-gold-500 transition-colors">
                  Economia
                </Link>
              </li>
              <li>
                <Link href="/?category=empresas" className="text-dark-400 hover:text-gold-500 transition-colors">
                  Empresas
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-dark-400 hover:text-gold-500 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <span className="text-dark-500 cursor-not-allowed">Sobre</span>
              </li>
              <li>
                <span className="text-dark-500 cursor-not-allowed">Contato</span>
              </li>
              <li>
                <span className="text-dark-500 cursor-not-allowed">Privacidade</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-sm">
            © {currentYear} MoneyBlog. Todos os direitos reservados.
          </p>
          <p className="text-dark-600 text-xs">
            Dados de demonstração para fins educacionais
          </p>
        </div>
      </div>
    </footer>
  );
}
