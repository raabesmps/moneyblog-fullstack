<?php

namespace App\Services;

use Illuminate\Support\Str;

class NewsApiService
{
    // Categorias do mercado financeiro
    protected array $categories = [
        'all' => [
            'id' => 'all',
            'name' => 'Todas',
            'slug' => 'all',
            'color' => '#f7c600',
        ],
        'mercado' => [
            'id' => 'mercado',
            'name' => 'Mercado',
            'slug' => 'mercado',
            'color' => '#10B981',
        ],
        'cripto' => [
            'id' => 'cripto',
            'name' => 'Cripto',
            'slug' => 'cripto',
            'color' => '#8B5CF6',
        ],
        'economia' => [
            'id' => 'economia',
            'name' => 'Economia',
            'slug' => 'economia',
            'color' => '#3B82F6',
        ],
        'empresas' => [
            'id' => 'empresas',
            'name' => 'Empresas',
            'slug' => 'empresas',
            'color' => '#EC4899',
        ],
    ];

    /**
     * Retorna todas as categorias disponíveis
     */
    public function getCategories(): array
    {
        return $this->categories;
    }

    /**
     * Busca categoria pelo slug
     */
    public function getCategoryBySlug(string $slug): ?array
    {
        return $this->categories[$slug] ?? null;
    }

    /**
     * Busca notícias (dados mockados) - paginação tradicional
     */
    public function getNews(string $categorySlug = 'all', int $page = 1, int $pageSize = 12): array
    {
        $allNews = $this->getMockNews();

        // Filtra por categoria (exceto 'all' que traz tudo)
        if ($categorySlug !== 'all') {
            $allNews = array_filter($allNews, fn($news) => $news['category'] === $categorySlug);
            $allNews = array_values($allNews);
        }

        $total = count($allNews);
        $lastPage = (int) ceil($total / $pageSize);
        $offset = ($page - 1) * $pageSize;

        $paginatedNews = array_slice($allNews, $offset, $pageSize);

        return [
            'success' => true,
            'data' => $paginatedNews,
            'meta' => [
                'current_page' => $page,
                'last_page' => $lastPage,
                'per_page' => $pageSize,
                'total' => $total,
                'has_more' => $page < $lastPage,
            ],
        ];
    }

    /**
     * Busca notícias por termo de pesquisa
     */
    public function searchNews(string $query, int $limit = 20): array
    {
        $allNews = $this->getMockNews();
        $query = mb_strtolower(trim($query));
        
        if (empty($query)) {
            return [
                'success' => true,
                'data' => [],
                'meta' => [
                    'query' => $query,
                    'total' => 0,
                ],
            ];
        }

        // Busca em título, resumo e conteúdo
        $results = array_filter($allNews, function($news) use ($query) {
            $title = mb_strtolower($news['title']);
            $summary = mb_strtolower($news['summary']);
            $content = mb_strtolower(strip_tags($news['content']));
            
            return str_contains($title, $query) || 
                   str_contains($summary, $query) || 
                   str_contains($content, $query);
        });

        $results = array_values($results);
        $total = count($results);
        $results = array_slice($results, 0, $limit);

        return [
            'success' => true,
            'data' => $results,
            'meta' => [
                'query' => $query,
                'total' => $total,
                'returned' => count($results),
            ],
        ];
    }

    /**
     * Busca notícias por offset (para infinite scroll)
     */
    public function getNewsByOffset(string $categorySlug = 'all', int $offset = 0, int $limit = 9): array
    {
        $allNews = $this->getMockNews();

        // Filtra por categoria (exceto 'all' que traz tudo)
        if ($categorySlug !== 'all') {
            $allNews = array_filter($allNews, fn($news) => $news['category'] === $categorySlug);
            $allNews = array_values($allNews);
        }

        $total = count($allNews);
        $paginatedNews = array_slice($allNews, $offset, $limit);
        $hasMore = ($offset + $limit) < $total;

        return [
            'success' => true,
            'data' => $paginatedNews,
            'meta' => [
                'offset' => $offset,
                'limit' => $limit,
                'total' => $total,
                'has_more' => $hasMore,
            ],
        ];
    }

    /**
     * Busca uma notícia pelo slug
     */
    public function getNewsBySlug(string $slug): ?array
    {
        $allNews = $this->getMockNews();

        foreach ($allNews as $news) {
            if ($news['slug'] === $slug) {
                return $news;
            }
        }

        return null;
    }

    /**
     * Dados mockados - 36 notícias do mercado financeiro (9 por categoria)
     */
    protected function getMockNews(): array
    {
        return [
            // === CRIPTO (9 notícias) ===
            [
                'id' => 1,
                'title' => 'Bitcoin Atinge Nova Máxima Histórica e Supera US$ 100.000',
                'slug' => 'bitcoin-atinge-nova-maxima-historica-supera-100000',
                'summary' => 'A maior criptomoeda do mundo quebrou a barreira dos seis dígitos pela primeira vez na história, impulsionada pela aprovação de ETFs nos Estados Unidos.',
                'content' => '
                    <p>O Bitcoin atingiu um marco histórico ao ultrapassar a marca de US$ 100.000 pela primeira vez em sua história de 15 anos. A criptomoeda subiu mais de 15% nos últimos sete dias, consolidando uma alta impressionante que começou após a aprovação dos ETFs de Bitcoin à vista nos Estados Unidos.</p>
                    
                    <p>Entre os principais catalisadores para essa valorização estão a aprovação dos ETFs de Bitcoin à vista pela SEC (Securities and Exchange Commission) e o crescente interesse institucional. Grandes fundos de investimento, como BlackRock e Fidelity, já acumularam bilhões de dólares em Bitcoin através de seus produtos.</p>
                    
                    <p>"Estamos testemunhando uma mudança de paradigma no mercado financeiro global", afirmou Michael Saylor, presidente executivo da MicroStrategy, empresa que detém mais de 150.000 bitcoins em seu balanço. "O Bitcoin está se consolidando como uma classe de ativos legítima e uma reserva de valor digital."</p>
                    
                    <p>Analistas do mercado cripto apontam que a escassez do ativo, com apenas 21 milhões de unidades que serão mineradas, combinada com o halving previsto para abril de 2024, deve continuar impulsionando os preços. O halving reduz pela metade a recompensa dos mineradores, diminuindo a oferta de novos bitcoins no mercado.</p>
                    
                    <p>O volume de negociação nas principais exchanges superou US$ 50 bilhões nas últimas 24 horas, indicando forte participação tanto de investidores de varejo quanto institucionais. A capitalização de mercado do Bitcoin agora supera US$ 2 trilhões.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=450&fit=crop',
                'source' => 'CryptoNews Brasil',
                'category' => 'cripto',
                'category_name' => 'Cripto',
                'category_color' => '#8B5CF6',
                'url' => 'https://www.coindesk.com/price/bitcoin/',
                'published_at' => now()->subHours(2)->toISOString(),
            ],
            [
                'id' => 2,
                'title' => 'Ethereum 2.0 Reduz Consumo de Energia em 99,95%',
                'slug' => 'ethereum-2-0-reduz-consumo-energia-99-95',
                'summary' => 'A segunda maior criptomoeda do mundo concluiu com sucesso sua transição para Proof of Stake, tornando-se uma das redes blockchain mais sustentáveis.',
                'content' => '
                    <p>A rede Ethereum completou com sucesso sua maior atualização técnica da história, conhecida como "The Merge". A transição do mecanismo de consenso Proof of Work (PoW) para Proof of Stake (PoS) resultou em uma redução de aproximadamente 99,95% no consumo de energia da rede.</p>
                    
                    <p>Antes da atualização, a rede Ethereum consumia cerca de 112 terawatt-horas de eletricidade por ano, equivalente ao consumo de países como Holanda. Com a mudança para PoS, esse consumo caiu para aproximadamente 0,01 terawatt-hora.</p>
                    
                    <p>Vitalik Buterin, cofundador do Ethereum, celebrou o sucesso da atualização: "Este é um momento histórico para o Ethereum e para todo o ecossistema cripto. Provamos que é possível ter uma blockchain descentralizada, segura e ambientalmente sustentável."</p>
                    
                    <p>O preço do Ether valorizou 12% após a conclusão bem-sucedida da atualização, e analistas projetam que a redução na emissão de novos tokens pode tornar o ETH deflacionário em períodos de alta atividade na rede.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&h=450&fit=crop',
                'source' => 'CoinDesk Brasil',
                'category' => 'cripto',
                'category_name' => 'Cripto',
                'category_color' => '#8B5CF6',
                'url' => 'https://www.coindesk.com/price/ethereum/',
                'published_at' => now()->subHours(6)->toISOString(),
            ],
            [
                'id' => 3,
                'title' => 'Solana Processa 65.000 Transações por Segundo e Bate Recorde',
                'slug' => 'solana-processa-65000-transacoes-segundo-bate-recorde',
                'summary' => 'A blockchain de alta performance demonstrou capacidade técnica superior ao processar mais de 65.000 TPS durante pico de demanda.',
                'content' => '
                    <p>A blockchain Solana estabeleceu um novo recorde ao processar mais de 65.000 transações por segundo (TPS) durante um período de pico de demanda, consolidando sua posição como uma das redes mais rápidas do ecossistema cripto.</p>
                    
                    <p>O recorde foi alcançado durante o lançamento de uma popular coleção de NFTs, que gerou milhões de transações em questão de minutos. Diferentemente de outras blockchains que enfrentam congestionamento em situações similares, a Solana manteve taxas de transação abaixo de US$ 0,01.</p>
                    
                    <p>Anatoly Yakovenko, cofundador da Solana Labs, destacou a importância do marco: "Este teste em condições reais prova que a Solana pode escalar para atender demandas de nível empresarial."</p>
                    
                    <p>Com essa demonstração de capacidade, grandes empresas começam a considerar a Solana para suas aplicações blockchain, incluindo sistemas de pagamento e plataformas de jogos.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop',
                'source' => 'Crypto Times',
                'category' => 'cripto',
                'category_name' => 'Cripto',
                'category_color' => '#8B5CF6',
                'url' => 'https://solana.com/news',
                'published_at' => now()->subHours(12)->toISOString(),
            ],
            [
                'id' => 4,
                'title' => 'Binance Lança Cartão de Débito Cripto no Brasil',
                'slug' => 'binance-lanca-cartao-debito-cripto-brasil',
                'summary' => 'A maior exchange do mundo expande seus serviços no país com cartão que permite gastos diretos em criptomoedas.',
                'content' => '
                    <p>A Binance, maior exchange de criptomoedas do mundo por volume de negociação, anunciou o lançamento de seu cartão de débito no Brasil. O produto permite que usuários gastem suas criptomoedas diretamente em estabelecimentos comerciais.</p>
                    
                    <p>O cartão, emitido em parceria com a Mastercard, aceita pagamentos em mais de 90 milhões de estabelecimentos globalmente. Os usuários podem vincular suas carteiras de Bitcoin, Ethereum, BNB e outras criptomoedas.</p>
                    
                    <p>"O Brasil é um mercado estratégico para a Binance. Com mais de 10 milhões de usuários no país, era natural oferecer mais formas de utilizar criptomoedas no dia a dia", afirmou Guilherme Nazar, diretor regional.</p>
                    
                    <p>O cartão oferece cashback de até 8% em BNB dependendo do nível do usuário na plataforma.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=450&fit=crop',
                'source' => 'InfoMoney',
                'category' => 'cripto',
                'category_name' => 'Cripto',
                'category_color' => '#8B5CF6',
                'url' => 'https://www.infomoney.com.br/mercados/criptomoedas/',
                'published_at' => now()->subHours(18)->toISOString(),
            ],
            [
                'id' => 5,
                'title' => 'Cardano Implementa Smart Contracts e Volume de DeFi Explode',
                'slug' => 'cardano-implementa-smart-contracts-volume-defi-explode',
                'summary' => 'Após anos de desenvolvimento, a blockchain fundada por Charles Hoskinson finalmente suporta contratos inteligentes.',
                'content' => '
                    <p>A blockchain Cardano atingiu um marco crucial com a implementação completa de smart contracts através da atualização Alonzo. Em menos de um mês após o lançamento, o valor total bloqueado (TVL) em protocolos DeFi na rede ultrapassou US$ 5 bilhões.</p>
                    
                    <p>Charles Hoskinson, fundador da Cardano, celebrou o momento: "Construímos a Cardano com uma abordagem acadêmica rigorosa, baseada em pesquisas revisadas por pares."</p>
                    
                    <p>Os primeiros protocolos DeFi a serem lançados na Cardano incluem exchanges descentralizadas (DEXs), plataformas de empréstimo e yield farming.</p>
                    
                    <p>O token ADA valorizou 35% com as notícias, e a capitalização de mercado da Cardano agora supera US$ 50 bilhões.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=450&fit=crop',
                'source' => 'Cointelegraph',
                'category' => 'cripto',
                'category_name' => 'Cripto',
                'category_color' => '#8B5CF6',
                'url' => 'https://cointelegraph.com.br/tags/cardano',
                'published_at' => now()->subDays(1)->toISOString(),
            ],
            [
                'id' => 6,
                'title' => 'Ripple Vence Processo Contra SEC e XRP Dispara 80%',
                'slug' => 'ripple-vence-processo-sec-xrp-dispara-80',
                'summary' => 'Após três anos de batalha judicial, tribunal decide que XRP não é um valor mobiliário quando vendido a investidores de varejo.',
                'content' => '
                    <p>Em uma decisão histórica para o mercado de criptomoedas, o tribunal federal de Nova York decidiu parcialmente a favor da Ripple Labs em seu processo contra a SEC. O juiz determinou que o token XRP não constitui um valor mobiliário quando vendido a investidores de varejo.</p>
                    
                    <p>A decisão fez o preço do XRP disparar mais de 80% em questão de horas, passando de US$ 0,47 para US$ 0,85. O volume de negociação ultrapassou US$ 10 bilhões.</p>
                    
                    <p>Brad Garlinghouse, CEO da Ripple, celebrou: "Esta decisão é uma vitória não apenas para a Ripple, mas para toda a indústria cripto americana."</p>
                    
                    <p>Exchanges americanas como Coinbase e Kraken anunciaram a relistagem do XRP imediatamente após a decisão.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=450&fit=crop',
                'source' => 'Reuters',
                'category' => 'cripto',
                'category_name' => 'Cripto',
                'category_color' => '#8B5CF6',
                'url' => 'https://www.reuters.com/technology/cryptocurrency/',
                'published_at' => now()->subDays(1)->subHours(6)->toISOString(),
            ],
            [
                'id' => 7,
                'title' => 'NFTs de Arte Digital Batem Recorde de US$ 69 Milhões em Leilão',
                'slug' => 'nfts-arte-digital-batem-recorde-69-milhoes-leilao',
                'summary' => 'Obra digital do artista Beeple foi vendida pela Christie\'s, estabelecendo novo marco para arte tokenizada.',
                'content' => '
                    <p>O mercado de NFTs atingiu um marco histórico com a venda da obra "Everydays: The First 5000 Days" do artista digital Beeple por impressionantes US$ 69,3 milhões na Christie\'s.</p>
                    
                    <p>A obra consiste em uma colagem de 5.000 imagens digitais criadas pelo artista ao longo de 13 anos de trabalho diário. O comprador pagou em Ethereum.</p>
                    
                    <p>"Esta venda representa um momento de virada para a arte digital", afirmou Noah Davis, especialista da Christie\'s.</p>
                    
                    <p>O sucesso impulsionou o mercado de NFTs como um todo, com plataformas como OpenSea registrando volumes recordes.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1645731504104-a9dee0e00ccb?w=800&h=450&fit=crop',
                'source' => 'The Art Newspaper',
                'category' => 'cripto',
                'category_name' => 'Cripto',
                'category_color' => '#8B5CF6',
                'url' => 'https://www.theartnewspaper.com/keywords/nft',
                'published_at' => now()->subDays(2)->toISOString(),
            ],
            [
                'id' => 8,
                'title' => 'Stablecoins Ultrapassam US$ 150 Bilhões em Capitalização',
                'slug' => 'stablecoins-ultrapassam-150-bilhoes-capitalizacao',
                'summary' => 'Moedas digitais pareadas ao dólar ganham força como meio de pagamento e proteção contra volatilidade.',
                'content' => '
                    <p>O mercado de stablecoins atingiu um novo recorde com capitalização total superior a US$ 150 bilhões. O Tether (USDT) lidera com mais de US$ 80 bilhões, seguido pelo USD Coin (USDC) com US$ 45 bilhões.</p>
                    
                    <p>As stablecoins tornaram-se peças fundamentais no ecossistema cripto, servindo como porto seguro durante períodos de volatilidade.</p>
                    
                    <p>Paolo Ardoino, CTO da Tether, destacou: "Em países com moedas instáveis, as stablecoins oferecem acesso a uma reserva de valor atrelada ao dólar."</p>
                    
                    <p>Reguladores em todo o mundo estão prestando mais atenção ao segmento, com o Tesouro americano recomendando regulamentação específica.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=800&h=450&fit=crop',
                'source' => 'Bloomberg',
                'category' => 'cripto',
                'category_name' => 'Cripto',
                'category_color' => '#8B5CF6',
                'url' => 'https://www.bloomberg.com/crypto',
                'published_at' => now()->subDays(2)->subHours(8)->toISOString(),
            ],
            [
                'id' => 9,
                'title' => 'DeFi Atinge US$ 100 Bilhões em Valor Total Bloqueado',
                'slug' => 'defi-atinge-100-bilhoes-valor-total-bloqueado',
                'summary' => 'As finanças descentralizadas consolidam-se como alternativa ao sistema financeiro tradicional com crescimento exponencial.',
                'content' => '
                    <p>O ecossistema de Finanças Descentralizadas (DeFi) alcançou a marca histórica de US$ 100 bilhões em valor total bloqueado (TVL), consolidando-se como uma alternativa real ao sistema financeiro tradicional.</p>
                    
                    <p>Protocolos como Aave, Compound e MakerDAO lideram o mercado, oferecendo serviços de empréstimo, rendimento e derivativos sem intermediários.</p>
                    
                    <p>"O DeFi está democratizando o acesso a serviços financeiros", afirmou Stani Kulechov, fundador da Aave. "Qualquer pessoa com internet pode participar."</p>
                    
                    <p>O crescimento atraiu atenção de bancos tradicionais, com JP Morgan e Goldman Sachs explorando aplicações em blockchain.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=450&fit=crop',
                'source' => 'DeFi Pulse',
                'category' => 'cripto',
                'category_name' => 'Cripto',
                'category_color' => '#8B5CF6',
                'url' => 'https://www.defipulse.com/',
                'published_at' => now()->subDays(3)->toISOString(),
            ],

            // === MERCADO (9 notícias) ===
            [
                'id' => 10,
                'title' => 'S&P 500 Fecha em Alta com Otimismo sobre Corte de Juros',
                'slug' => 'sp-500-fecha-alta-otimismo-corte-juros',
                'summary' => 'O principal índice da bolsa americana subiu 1,8% nesta sessão, impulsionado por expectativas de flexibilização monetária.',
                'content' => '
                    <p>O S&P 500 encerrou o pregão em alta de 1,8%, marcando seu melhor desempenho diário em dois meses. O índice foi impulsionado pela crescente expectativa de que o Federal Reserve iniciará um ciclo de cortes nas taxas de juros.</p>
                    
                    <p>As ações do setor de tecnologia lideraram os ganhos, com Apple subindo 3,2%, Microsoft avançando 2,8% e Nvidia disparando 5,4%.</p>
                    
                    <p>Os dados de inflação divulgados pela manhã mostraram desaceleração nos preços ao consumidor, fortalecendo a tese de que o Fed pode começar a reduzir os juros.</p>
                    
                    <p>"O mercado está precificando pelo menos três cortes de juros até o final do ano", avaliou Sarah Matthews, estrategista-chefe do Goldman Sachs.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
                'source' => 'MarketWatch',
                'category' => 'mercado',
                'category_name' => 'Mercado',
                'category_color' => '#10B981',
                'url' => 'https://www.marketwatch.com/investing/index/spx',
                'published_at' => now()->subHours(4)->toISOString(),
            ],
            [
                'id' => 11,
                'title' => 'Ibovespa Rompe os 140 Mil Pontos pela Primeira Vez',
                'slug' => 'ibovespa-rompe-140-mil-pontos-primeira-vez',
                'summary' => 'O principal índice da bolsa brasileira alcança marca histórica impulsionado por fluxo estrangeiro.',
                'content' => '
                    <p>O Ibovespa ultrapassou a marca histórica de 140 mil pontos pela primeira vez, em um pregão marcado por forte entrada de capital estrangeiro. O índice fechou com alta de 2,4%, aos 141.230 pontos.</p>
                    
                    <p>O fluxo de investidores estrangeiros foi determinante. Na sessão, foram registradas compras líquidas de R$ 3,2 bilhões por investidores internacionais.</p>
                    
                    <p>As ações da Petrobras lideraram as altas, subindo 4,5% após anúncio de dividendos extraordinários. Vale avançou 3,2% com a recuperação do minério de ferro.</p>
                    
                    <p>"O Brasil está voltando ao radar dos investidores globais", afirmou Luis Stuhlberger, gestor do fundo Verde.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop',
                'source' => 'Valor Econômico',
                'category' => 'mercado',
                'category_name' => 'Mercado',
                'category_color' => '#10B981',
                'url' => 'https://valor.globo.com/financas/',
                'published_at' => now()->subHours(8)->toISOString(),
            ],
            [
                'id' => 12,
                'title' => 'Dólar Cai para R$ 4,70 com Fluxo de Investidores Estrangeiros',
                'slug' => 'dolar-cai-4-70-fluxo-investidores-estrangeiros',
                'summary' => 'A moeda americana registra menor cotação em 18 meses, beneficiada pela entrada de capital externo.',
                'content' => '
                    <p>O dólar comercial fechou em queda de 1,2%, cotado a R$ 4,70, menor valor desde agosto de 2022. A moeda americana acumula desvalorização de 8% no ano.</p>
                    
                    <p>O movimento foi impulsionado pela entrada de US$ 5 bilhões em investimentos estrangeiros na última semana.</p>
                    
                    <p>Roberto Campos Neto, presidente do Banco Central, comentou: "O real está se fortalecendo de forma sustentável, refletindo fundamentos macroeconômicos sólidos."</p>
                    
                    <p>Analistas projetam que o dólar pode buscar R$ 4,50 caso o cenário internacional permaneça favorável.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&h=450&fit=crop',
                'source' => 'Financial Times',
                'category' => 'mercado',
                'category_name' => 'Mercado',
                'category_color' => '#10B981',
                'url' => 'https://www.ft.com/currencies',
                'published_at' => now()->subHours(14)->toISOString(),
            ],
            [
                'id' => 13,
                'title' => 'Nasdaq Atinge Máxima Histórica com Rally de Tecnologia',
                'slug' => 'nasdaq-atinge-maxima-historica-rally-tecnologia',
                'summary' => 'O índice de tecnologia supera a marca de 20.000 pontos pela primeira vez, liderado por empresas de IA.',
                'content' => '
                    <p>O Nasdaq Composite ultrapassou os 20.000 pontos pela primeira vez na história, consolidando um rally impressionante liderado por empresas de inteligência artificial.</p>
                    
                    <p>A Nvidia foi a grande estrela do pregão, subindo 8% após anunciar resultados trimestrais acima das expectativas.</p>
                    
                    <p>"Estamos apenas no início da revolução da IA", afirmou Jensen Huang, CEO da Nvidia.</p>
                    
                    <p>Outras big techs também tiveram desempenho forte: Microsoft subiu 3,5%, Meta avançou 4,2% e Alphabet ganhou 2,8%.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=450&fit=crop',
                'source' => 'CNBC',
                'category' => 'mercado',
                'category_name' => 'Mercado',
                'category_color' => '#10B981',
                'url' => 'https://www.cnbc.com/quotes/.IXIC',
                'published_at' => now()->subDays(1)->subHours(2)->toISOString(),
            ],
            [
                'id' => 14,
                'title' => 'Petróleo Sobe 5% com Tensões no Oriente Médio',
                'slug' => 'petroleo-sobe-5-tensoes-oriente-medio',
                'summary' => 'Barril do Brent ultrapassa US$ 90 com preocupações sobre fornecimento global.',
                'content' => '
                    <p>Os preços do petróleo dispararam 5% nesta sessão, com o barril do Brent ultrapassando US$ 90 pela primeira vez em seis meses.</p>
                    
                    <p>Ataques a instalações petrolíferas e navios-tanque na região aumentaram os riscos de interrupção no suprimento.</p>
                    
                    <p>A OPEP+ manteve seus cortes de produção, reforçando a pressão sobre os preços.</p>
                    
                    <p>"O mercado de petróleo está equilibrado de forma muito frágil", avaliou Fatih Birol, diretor executivo da Agência Internacional de Energia.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=450&fit=crop',
                'source' => 'Reuters',
                'category' => 'mercado',
                'category_name' => 'Mercado',
                'category_color' => '#10B981',
                'url' => 'https://www.reuters.com/business/energy/',
                'published_at' => now()->subDays(1)->subHours(8)->toISOString(),
            ],
            [
                'id' => 15,
                'title' => 'Ouro Bate Recorde a US$ 2.400 com Busca por Segurança',
                'slug' => 'ouro-bate-recorde-2400-busca-seguranca',
                'summary' => 'Metal precioso atinge máxima histórica enquanto investidores buscam proteção.',
                'content' => '
                    <p>O ouro atingiu nova máxima histórica ao ser negociado a US$ 2.400 por onça, refletindo a busca dos investidores por ativos de segurança.</p>
                    
                    <p>Bancos centrais em todo o mundo estão aumentando suas reservas de ouro, com compras recordes lideradas por China, Rússia e Índia.</p>
                    
                    <p>"O ouro está cumprindo seu papel histórico de reserva de valor", afirmou Peter Schiff, CEO da Euro Pacific Capital.</p>
                    
                    <p>ETFs de ouro registraram entradas líquidas de US$ 3 bilhões na última semana.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=450&fit=crop',
                'source' => 'Bloomberg',
                'category' => 'mercado',
                'category_name' => 'Mercado',
                'category_color' => '#10B981',
                'url' => 'https://www.bloomberg.com/markets/commodities',
                'published_at' => now()->subDays(2)->subHours(4)->toISOString(),
            ],
            [
                'id' => 16,
                'title' => 'IPO da Arm Holdings Movimenta US$ 5 Bilhões na Nasdaq',
                'slug' => 'ipo-arm-holdings-movimenta-5-bilhoes-nasdaq',
                'summary' => 'A designer de chips britânica retorna ao mercado público em uma das maiores ofertas do ano.',
                'content' => '
                    <p>A Arm Holdings, designer de chips cujas tecnologias estão presentes em 99% dos smartphones do mundo, realizou um dos maiores IPOs do ano ao levantar US$ 5 bilhões na Nasdaq.</p>
                    
                    <p>As ações começaram a ser negociadas a US$ 56,10, 10% acima do preço da oferta. O IPO avaliou a empresa em US$ 60 bilhões.</p>
                    
                    <p>Rene Haas, CEO da Arm, celebrou: "A Arm está no coração da revolução computacional."</p>
                    
                    <p>Grandes investidores como Apple, Google, Nvidia e Samsung participaram como investidores âncora.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop',
                'source' => 'The Wall Street Journal',
                'category' => 'mercado',
                'category_name' => 'Mercado',
                'category_color' => '#10B981',
                'url' => 'https://www.wsj.com/market-data/stocks',
                'published_at' => now()->subDays(3)->toISOString(),
            ],
            [
                'id' => 17,
                'title' => 'Mercados Asiáticos Sobem com Estímulos da China',
                'slug' => 'mercados-asiaticos-sobem-estimulos-china',
                'summary' => 'Bolsas da região avançam após Pequim anunciar pacote de medidas para impulsionar a economia.',
                'content' => '
                    <p>Os mercados asiáticos fecharam em forte alta após o governo chinês anunciar um amplo pacote de estímulos econômicos. O Shanghai Composite subiu 3,5%, enquanto o Hang Seng avançou 4,2%.</p>
                    
                    <p>As medidas incluem redução nas taxas de juros para hipotecas, flexibilização de restrições à compra de imóveis e injeção de liquidez.</p>
                    
                    <p>"Estas medidas indicam que o governo está levando a sério a desaceleração", avaliou Ray Dalio, da Bridgewater.</p>
                    
                    <p>O Japão e a Coreia do Sul também se beneficiaram, com o Nikkei subindo 2,1% e o Kospi avançando 1,8%.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=800&h=450&fit=crop',
                'source' => 'Nikkei Asia',
                'category' => 'mercado',
                'category_name' => 'Mercado',
                'category_color' => '#10B981',
                'url' => 'https://asia.nikkei.com/Business/Markets',
                'published_at' => now()->subDays(3)->subHours(12)->toISOString(),
            ],
            [
                'id' => 18,
                'title' => 'Fundos de Investimento Captam R$ 50 Bilhões em Março',
                'slug' => 'fundos-investimento-captam-50-bilhoes-marco',
                'summary' => 'Indústria de fundos brasileira registra melhor mês desde 2021, com destaque para renda fixa.',
                'content' => '
                    <p>A indústria de fundos de investimento brasileira captou R$ 50 bilhões em março, o melhor resultado mensal desde 2021. Os fundos de renda fixa lideraram as captações.</p>
                    
                    <p>O cenário de juros em queda tem atraído investidores de volta para a renda fixa, que oferece retornos atrativos com baixo risco.</p>
                    
                    <p>Fundos multimercado também tiveram desempenho positivo, captando R$ 8 bilhões no mês.</p>
                    
                    <p>A Anbima projeta que o setor pode atingir R$ 8 trilhões em patrimônio até o final do ano.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
                'source' => 'Anbima',
                'category' => 'mercado',
                'category_name' => 'Mercado',
                'category_color' => '#10B981',
                'url' => 'https://www.anbima.com.br/pt_br/noticias/',
                'published_at' => now()->subDays(4)->toISOString(),
            ],

            // === ECONOMIA (9 notícias) ===
            [
                'id' => 19,
                'title' => 'Federal Reserve Mantém Juros e Sinaliza Possível Corte',
                'slug' => 'federal-reserve-mantem-juros-sinaliza-corte',
                'summary' => 'O Fed decidiu manter a taxa de juros inalterada, mas comunicado indica que ciclo de afrouxamento pode começar em breve.',
                'content' => '
                    <p>O Federal Reserve manteve a taxa de juros na faixa de 5,25% a 5,50%, conforme esperado. No entanto, o comunicado pós-reunião trouxe sinais mais dovish.</p>
                    
                    <p>Jerome Powell destacou que a inflação americana tem mostrado "progresso considerável" em direção à meta de 2%.</p>
                    
                    <p>"Chegará o momento em que será apropriado reduzir as taxas de juros", afirmou Powell.</p>
                    
                    <p>Os mercados passaram a precificar três cortes de 0,25 ponto percentual até dezembro, começando em setembro.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop',
                'source' => 'The Wall Street Journal',
                'category' => 'economia',
                'category_name' => 'Economia',
                'category_color' => '#3B82F6',
                'url' => 'https://www.wsj.com/economy/central-banking',
                'published_at' => now()->subHours(5)->toISOString(),
            ],
            [
                'id' => 20,
                'title' => 'PIB dos EUA Cresce 2,8% e Supera Expectativas do Mercado',
                'slug' => 'pib-eua-cresce-2-8-supera-expectativas',
                'summary' => 'A economia americana surpreendeu positivamente, com crescimento acima do previsto pelos analistas.',
                'content' => '
                    <p>O PIB dos Estados Unidos cresceu 2,8% no segundo trimestre em base anualizada, superando a expectativa de 2,0% dos economistas.</p>
                    
                    <p>O consumo pessoal, que representa cerca de 70% do PIB americano, avançou 2,3%, impulsionado por gastos com serviços.</p>
                    
                    <p>Janet Yellen, Secretária do Tesouro, celebrou: "A economia americana está demonstrando força e resiliência excepcionais."</p>
                    
                    <p>O mercado de trabalho permanece robusto, com a taxa de desemprego em 3,7%.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
                'source' => 'Bloomberg Economics',
                'category' => 'economia',
                'category_name' => 'Economia',
                'category_color' => '#3B82F6',
                'url' => 'https://www.bloomberg.com/economics',
                'published_at' => now()->subHours(16)->toISOString(),
            ],
            [
                'id' => 21,
                'title' => 'Banco Central Reduz Selic para 10,75% ao Ano',
                'slug' => 'banco-central-reduz-selic-10-75-ao-ano',
                'summary' => 'O Copom cortou a taxa básica de juros em 0,50 ponto percentual, dando continuidade ao ciclo de afrouxamento.',
                'content' => '
                    <p>O Comitê de Política Monetária (Copom) reduziu a taxa Selic em 0,50 ponto percentual, para 10,75% ao ano. A decisão foi unânime.</p>
                    
                    <p>No comunicado, o Copom avaliou que o processo de desinflação está evoluindo conforme o esperado.</p>
                    
                    <p>"O cenário prospectivo de inflação segue benigno", destacou o comunicado.</p>
                    
                    <p>O mercado projeta que a Selic termine o ano em 9,25%, com possibilidade de novos cortes em 2025.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=800&h=450&fit=crop',
                'source' => 'Banco Central do Brasil',
                'category' => 'economia',
                'category_name' => 'Economia',
                'category_color' => '#3B82F6',
                'url' => 'https://valor.globo.com/brasil/',
                'published_at' => now()->subDays(1)->toISOString(),
            ],
            [
                'id' => 22,
                'title' => 'Inflação na Zona do Euro Recua para 2,4%',
                'slug' => 'inflacao-zona-euro-recua-2-4',
                'summary' => 'O índice de preços ao consumidor desacelerou mais que o esperado, abrindo espaço para cortes de juros pelo BCE.',
                'content' => '
                    <p>A inflação na Zona do Euro desacelerou para 2,4% em base anual, o menor nível desde janeiro de 2022 e abaixo da expectativa de 2,6%.</p>
                    
                    <p>O núcleo da inflação também recuou para 2,9%, indicando que as pressões inflacionárias estão cedendo.</p>
                    
                    <p>Christine Lagarde, presidente do BCE, comentou: "Estamos no caminho certo para atingir nossa meta de 2%."</p>
                    
                    <p>Os mercados agora precificam probabilidade de 80% de um corte de juros na reunião de junho do BCE.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&h=450&fit=crop',
                'source' => 'European Central Bank',
                'category' => 'economia',
                'category_name' => 'Economia',
                'category_color' => '#3B82F6',
                'url' => 'https://www.reuters.com/markets/europe/',
                'published_at' => now()->subDays(1)->subHours(10)->toISOString(),
            ],
            [
                'id' => 23,
                'title' => 'Desemprego no Brasil Cai para 7,4%, Menor Nível em 10 Anos',
                'slug' => 'desemprego-brasil-cai-7-4-menor-nivel-10-anos',
                'summary' => 'A taxa de desocupação recuou mais que o esperado, refletindo a recuperação do mercado de trabalho formal.',
                'content' => '
                    <p>A taxa de desemprego no Brasil caiu para 7,4% no trimestre encerrado em março, o menor nível desde 2014.</p>
                    
                    <p>O número de ocupados atingiu 100,7 milhões de pessoas, recorde da série histórica.</p>
                    
                    <p>Fernando Haddad, Ministro da Fazenda, destacou: "O mercado de trabalho brasileiro está aquecido, com geração de empregos formais."</p>
                    
                    <p>O rendimento médio real do trabalhador avançou 1,8%, alcançando R$ 3.018.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=450&fit=crop',
                'source' => 'IBGE',
                'category' => 'economia',
                'category_name' => 'Economia',
                'category_color' => '#3B82F6',
                'url' => 'https://g1.globo.com/economia/',
                'published_at' => now()->subDays(2)->toISOString(),
            ],
            [
                'id' => 24,
                'title' => 'China Cresce 5,3% no 1º Trimestre Mas Preocupa Analistas',
                'slug' => 'china-cresce-5-3-primeiro-trimestre-preocupa-analistas',
                'summary' => 'O PIB chinês superou expectativas, mas dados subjacentes revelam fragilidades no setor imobiliário.',
                'content' => '
                    <p>A economia da China cresceu 5,3% no primeiro trimestre em base anual, superando a meta oficial de 5%. No entanto, analistas alertam para fragilidades.</p>
                    
                    <p>O setor imobiliário continua em crise, com investimentos em propriedades caindo 9,5%.</p>
                    
                    <p>"O crescimento parece forte na superfície, mas a composição é preocupante", avaliou Michael Pettis.</p>
                    
                    <p>O governo chinês prometeu medidas adicionais de estímulo para atingir a meta de crescimento no ano.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&h=450&fit=crop',
                'source' => 'South China Morning Post',
                'category' => 'economia',
                'category_name' => 'Economia',
                'category_color' => '#3B82F6',
                'url' => 'https://www.scmp.com/economy/china-economy',
                'published_at' => now()->subDays(3)->toISOString(),
            ],
            [
                'id' => 25,
                'title' => 'FMI Eleva Projeção de Crescimento Global para 3,2%',
                'slug' => 'fmi-eleva-projecao-crescimento-global-3-2',
                'summary' => 'O Fundo Monetário Internacional revisou para cima suas estimativas, citando resiliência da economia americana.',
                'content' => '
                    <p>O FMI elevou sua projeção para o crescimento da economia global em 2024 para 3,2%, ante 3,0% estimados anteriormente.</p>
                    
                    <p>Kristalina Georgieva apresentou as novas projeções: "A economia global está demonstrando notável resiliência."</p>
                    
                    <p>Os Estados Unidos tiveram a maior revisão positiva, com crescimento agora projetado em 2,7%.</p>
                    
                    <p>O Brasil também foi contemplado com revisão positiva, com crescimento esperado de 2,2%.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop',
                'source' => 'IMF',
                'category' => 'economia',
                'category_name' => 'Economia',
                'category_color' => '#3B82F6',
                'url' => 'https://www.imf.org/en/News',
                'published_at' => now()->subDays(4)->toISOString(),
            ],
            [
                'id' => 26,
                'title' => 'Balança Comercial Brasileira Bate Recorde com Superávit de US$ 10 Bi',
                'slug' => 'balanca-comercial-brasileira-bate-recorde-superavit-10-bi',
                'summary' => 'As exportações brasileiras atingem novo patamar, impulsionadas por commodities agrícolas e minerais.',
                'content' => '
                    <p>A balança comercial brasileira registrou superávit recorde de US$ 10 bilhões em março, impulsionada pelas exportações de soja, minério de ferro e petróleo.</p>
                    
                    <p>As exportações totalizaram US$ 35 bilhões no mês, enquanto as importações somaram US$ 25 bilhões.</p>
                    
                    <p>A China continua sendo o principal destino das exportações brasileiras, respondendo por 30% do total.</p>
                    
                    <p>O superávit acumulado no ano já ultrapassa US$ 25 bilhões, indicando ano recorde para o comércio exterior.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=450&fit=crop',
                'source' => 'MDIC',
                'category' => 'economia',
                'category_name' => 'Economia',
                'category_color' => '#3B82F6',
                'url' => 'https://www.infomoney.com.br/economia/',
                'published_at' => now()->subDays(4)->subHours(8)->toISOString(),
            ],
            [
                'id' => 27,
                'title' => 'Reforma Tributária Avança no Congresso com Apoio Amplo',
                'slug' => 'reforma-tributaria-avanca-congresso-apoio-amplo',
                'summary' => 'Proposta de simplificação do sistema tributário brasileiro ganha força e deve ser votada em breve.',
                'content' => '
                    <p>A reforma tributária brasileira avançou significativamente no Congresso, com apoio de partidos da base e da oposição. A proposta prevê a unificação de impostos sobre consumo.</p>
                    
                    <p>O novo sistema criará o IBS (Imposto sobre Bens e Serviços) e a CBS (Contribuição sobre Bens e Serviços), substituindo cinco tributos atuais.</p>
                    
                    <p>"Esta é a reforma mais importante em décadas", afirmou o ministro da Fazenda, Fernando Haddad.</p>
                    
                    <p>Empresários apoiam a medida, que deve reduzir a complexidade e os custos de conformidade tributária.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop',
                'source' => 'Agência Brasil',
                'category' => 'economia',
                'category_name' => 'Economia',
                'category_color' => '#3B82F6',
                'url' => 'https://www.camara.leg.br/noticias/',
                'published_at' => now()->subDays(5)->toISOString(),
            ],

            // === EMPRESAS (9 notícias) ===
            [
                'id' => 28,
                'title' => 'Apple Atinge Valor de Mercado de US$ 4 Trilhões',
                'slug' => 'apple-atinge-valor-mercado-4-trilhoes',
                'summary' => 'A gigante de tecnologia se torna a primeira empresa da história a atingir a marca histórica de capitalização.',
                'content' => '
                    <p>A Apple fez história ao se tornar a primeira empresa do mundo a atingir US$ 4 trilhões em valor de mercado. As ações subiram 2,5% no pregão.</p>
                    
                    <p>O marco foi alcançado pouco mais de um ano após a Apple ter se tornado a primeira empresa a valer US$ 3 trilhões.</p>
                    
                    <p>Tim Cook celebrou: "Este marco reflete a confiança dos investidores na nossa capacidade de inovação."</p>
                    
                    <p>O segmento de Serviços da Apple já representa mais de 20% da receita total da empresa.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=450&fit=crop',
                'source' => 'CNBC',
                'category' => 'empresas',
                'category_name' => 'Empresas',
                'category_color' => '#EC4899',
                'url' => 'https://www.cnbc.com/quotes/AAPL',
                'published_at' => now()->subHours(3)->toISOString(),
            ],
            [
                'id' => 29,
                'title' => 'Tesla Anuncia Novo Modelo de Veículo Elétrico Acessível',
                'slug' => 'tesla-anuncia-novo-modelo-veiculo-eletrico-acessivel',
                'summary' => 'A montadora de Elon Musk revelou planos para um carro elétrico com preço abaixo de US$ 30.000.',
                'content' => '
                    <p>A Tesla anunciou o desenvolvimento de um novo veículo elétrico com preço abaixo de US$ 30.000. O modelo deve chegar ao mercado até 2025.</p>
                    
                    <p>Elon Musk destacou avanços na tecnologia de baterias que permitirão reduzir custos de produção em 50%.</p>
                    
                    <p>"Nosso objetivo sempre foi acelerar a transição para energia sustentável", afirmou Musk.</p>
                    
                    <p>As ações da Tesla subiram 8% com o anúncio, e a empresa planeja investir US$ 10 bilhões em novas fábricas.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=450&fit=crop',
                'source' => 'TechCrunch',
                'category' => 'empresas',
                'category_name' => 'Empresas',
                'category_color' => '#EC4899',
                'url' => 'https://techcrunch.com/tag/tesla/',
                'published_at' => now()->subHours(10)->toISOString(),
            ],
            [
                'id' => 30,
                'title' => 'Microsoft Investe US$ 10 Bilhões na OpenAI',
                'slug' => 'microsoft-investe-10-bilhoes-openai',
                'summary' => 'A gigante de software amplia parceria estratégica com criadora do ChatGPT em aposta histórica na IA.',
                'content' => '
                    <p>A Microsoft anunciou um investimento adicional de US$ 10 bilhões na OpenAI, expandindo uma parceria que pode redefinir o futuro da computação.</p>
                    
                    <p>A Microsoft integrará a tecnologia GPT-4 em seus principais produtos, incluindo Office, Bing e Azure.</p>
                    
                    <p>Satya Nadella destacou: "Esta é a próxima grande plataforma tecnológica."</p>
                    
                    <p>Analistas avaliam que a parceria posiciona a Microsoft à frente de rivais como Google e Amazon na corrida pela IA.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&h=450&fit=crop',
                'source' => 'The Verge',
                'category' => 'empresas',
                'category_name' => 'Empresas',
                'category_color' => '#EC4899',
                'url' => 'https://www.theverge.com/microsoft',
                'published_at' => now()->subDays(1)->subHours(4)->toISOString(),
            ],
            [
                'id' => 31,
                'title' => 'Amazon Abre 150 Novas Lojas Físicas nos Estados Unidos',
                'slug' => 'amazon-abre-150-novas-lojas-fisicas-estados-unidos',
                'summary' => 'A gigante do e-commerce acelera expansão no varejo físico com supermercados e lojas de conveniência.',
                'content' => '
                    <p>A Amazon anunciou planos de abrir 150 novas lojas físicas nos Estados Unidos até 2025. A empresa investirá US$ 8 bilhões na expansão.</p>
                    
                    <p>As lojas Amazon Go, com tecnologia de checkout sem caixa, serão o foco principal com 80 novas unidades.</p>
                    
                    <p>Andy Jassy explicou: "O varejo físico e o digital são complementares, não concorrentes."</p>
                    
                    <p>A expansão marca uma mudança estratégica para a Amazon no varejo físico transformado pela tecnologia.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&h=450&fit=crop',
                'source' => 'Retail Dive',
                'category' => 'empresas',
                'category_name' => 'Empresas',
                'category_color' => '#EC4899',
                'url' => 'https://www.cnbc.com/quotes/AMZN',
                'published_at' => now()->subDays(1)->subHours(12)->toISOString(),
            ],
            [
                'id' => 32,
                'title' => 'Nvidia Ultrapassa US$ 2 Trilhões em Valor de Mercado',
                'slug' => 'nvidia-ultrapassa-2-trilhoes-valor-mercado',
                'summary' => 'A fabricante de chips para IA alcança capitalização histórica, tornando-se a terceira empresa mais valiosa.',
                'content' => '
                    <p>A Nvidia ultrapassou US$ 2 trilhões em valor de mercado, tornando-se a terceira empresa mais valiosa do mundo. As ações subiram 16% em uma única sessão.</p>
                    
                    <p>A receita do trimestre atingiu US$ 22 bilhões, crescimento de 265% em relação ao ano anterior.</p>
                    
                    <p>Jensen Huang celebrou: "Estamos no centro de uma transformação tecnológica sem precedentes."</p>
                    
                    <p>Os chips H100 e A100 da Nvidia dominam mais de 80% do mercado de GPUs para data centers.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1591238372338-22d30c883a86?w=800&h=450&fit=crop',
                'source' => 'Bloomberg Technology',
                'category' => 'empresas',
                'category_name' => 'Empresas',
                'category_color' => '#EC4899',
                'url' => 'https://www.cnbc.com/quotes/NVDA',
                'published_at' => now()->subDays(2)->subHours(6)->toISOString(),
            ],
            [
                'id' => 33,
                'title' => 'Petrobras Anuncia Dividendos Extraordinários de R$ 30 Bilhões',
                'slug' => 'petrobras-anuncia-dividendos-extraordinarios-30-bilhoes',
                'summary' => 'A estatal brasileira surpreende o mercado com distribuição recorde aos acionistas.',
                'content' => '
                    <p>A Petrobras anunciou a distribuição de R$ 30 bilhões em dividendos extraordinários, surpreendendo positivamente o mercado.</p>
                    
                    <p>O dividend yield anualizado da empresa supera 20%, tornando-a uma das com maior retorno do mundo.</p>
                    
                    <p>Jean Paul Prates explicou: "A empresa está em excelente situação financeira, com dívida controlada."</p>
                    
                    <p>As ações da Petrobras dispararam 7% com o anúncio.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=450&fit=crop',
                'source' => 'Valor Investe',
                'category' => 'empresas',
                'category_name' => 'Empresas',
                'category_color' => '#EC4899',
                'url' => 'https://www.infomoney.com.br/cotacoes/b3/acao/petrobras-petr4/',
                'published_at' => now()->subDays(2)->subHours(14)->toISOString(),
            ],
            [
                'id' => 34,
                'title' => 'Google Lança Gemini, Seu Modelo de IA Mais Avançado',
                'slug' => 'google-lanca-gemini-modelo-ia-mais-avancado',
                'summary' => 'A Alphabet apresenta seu novo modelo multimodal que promete superar o GPT-4.',
                'content' => '
                    <p>O Google lançou oficialmente o Gemini, seu modelo de inteligência artificial mais avançado, em tentativa de recuperar terreno na corrida pela IA.</p>
                    
                    <p>O Gemini é multimodal, capaz de processar e gerar texto, imagens, áudio e vídeo. Em testes, superou o GPT-4 em 30 dos 32 benchmarks.</p>
                    
                    <p>Sundar Pichai apresentou o modelo: "O Gemini representa o culminar de décadas de pesquisa em IA."</p>
                    
                    <p>As ações da Alphabet subiram 5% após o anúncio.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&h=450&fit=crop',
                'source' => 'TechCrunch',
                'category' => 'empresas',
                'category_name' => 'Empresas',
                'category_color' => '#EC4899',
                'url' => 'https://techcrunch.com/tag/google/',
                'published_at' => now()->subDays(3)->subHours(8)->toISOString(),
            ],
            [
                'id' => 35,
                'title' => 'Magazine Luiza Registra Lucro Recorde no Trimestre',
                'slug' => 'magazine-luiza-registra-lucro-recorde-trimestre',
                'summary' => 'A varejista brasileira surpreende com resultado positivo após período de dificuldades.',
                'content' => '
                    <p>O Magazine Luiza registrou lucro líquido de R$ 500 milhões no trimestre, revertendo prejuízos anteriores e surpreendendo o mercado.</p>
                    
                    <p>A melhoria reflete a estratégia de redução de custos e foco em produtos de maior margem.</p>
                    
                    <p>Fred Trajano, CEO, comemorou: "Provamos que nosso modelo de negócios é resiliente."</p>
                    
                    <p>As ações da empresa dispararam 25% após a divulgação dos resultados.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop',
                'source' => 'Valor Econômico',
                'category' => 'empresas',
                'category_name' => 'Empresas',
                'category_color' => '#EC4899',
                'url' => 'https://www.infomoney.com.br/cotacoes/b3/acao/magazine-luiza-mglu3/',
                'published_at' => now()->subDays(4)->toISOString(),
            ],
            [
                'id' => 36,
                'title' => 'Nubank Atinge 100 Milhões de Clientes na América Latina',
                'slug' => 'nubank-atinge-100-milhoes-clientes-america-latina',
                'summary' => 'O banco digital brasileiro consolida liderança regional com crescimento acelerado no México e Colômbia.',
                'content' => '
                    <p>O Nubank atingiu a marca de 100 milhões de clientes na América Latina, consolidando sua posição como maior banco digital do mundo fora da Ásia.</p>
                    
                    <p>O Brasil continua sendo o principal mercado com 80 milhões de clientes, mas México e Colômbia crescem rapidamente.</p>
                    
                    <p>David Vélez, CEO, celebrou: "Estamos apenas começando nossa missão de democratizar os serviços financeiros na região."</p>
                    
                    <p>A empresa registrou lucro pelo terceiro trimestre consecutivo, com rentabilidade de 20% sobre o patrimônio.</p>
                ',
                'image' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop',
                'source' => 'Exame',
                'category' => 'empresas',
                'category_name' => 'Empresas',
                'category_color' => '#EC4899',
                'url' => 'https://www.infomoney.com.br/cotacoes/b3/bdr/nu-holdings-nubr33/',
                'published_at' => now()->subDays(5)->toISOString(),
            ],
        ];
    }
}
