# Especificação Completa de Telas & Implementação (DESIGN-IMPLEMENTATION.md)

> **Documento:** Guia Executivo de Implementação de Telas, Interações e Componentes  
> **Público:** Engenheiros Frontend, Agentes Autônomos de Código e Revisores  
> **Tecnologias:** React 19, React Router v7, TanStack Query v5, TanStack Form, Tailwind CSS v4, shadcn/ui, Aceternity UI, Framer Motion  

---

## 1. Visão Geral da Arquitetura de Telas e Rotas

A aplicação SPA adota o **React Router v7** com gerenciamento de estado na URL via `useSearchParams`. Toda navegação preserva filtros, busca, paginação e modalidade de visualização.

### Árvore de Rotas
```text
/                      -> Landing / Catálogo de Filmes (Grid e List View)
/login                 -> Autenticação de Administrador (Layout Text Flip + Glass Card)
/filmes/:id            -> Detalhes do Filme, Histórico de Reviews (Expandable Cards), Ações Admin
/admin/filmes/novo     -> Cadastro de Filme (Formulário com validação Zod + Indicadores Obrigatórios)
/admin/filmes/:id/editar -> Edição de Filme existente
```

### Layout Base Global (`src/components/layout/AppLayout.tsx`)
- **Header Flutuante (Glass Navbar):**
  - Logo do **RocketFilms** com ícone de bobina cinematográfica/foguete.
  - Gatilho visual da **Command Palette** exibindo um botão de busca estilizado com `⌘K` ou `Ctrl+K`.
  - Botão de alternância de tema / Modo Cinema.
  - Indicador de status de autenticação (Avatar do Administrador ou botão "Entrar").
- **Command Palette Global (`<CommandDialog />`):**
  - Acessível de qualquer ponto via `Cmd+K` / `Ctrl+K`.
- **Área Central Dinâmica (`<Outlet />`):** Com contenção de largura `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6`.
- **Footer:** Informações de copyright, links de dados analíticos (Diamond Layer) e créditos.

---

## 2. Detalhamento de Cada Tela do Sistema

---

### 2.1 Tela Principal: Catálogo de Filmes (`/`)

#### Objetivo
Permitir a navegação fluida em um catálogo paginado com pesquisa instantânea, filtros por gênero e ordenação, além de alternância de layout (Grid vs List).

#### Componentes & Efeitos Visuais
1. **Hero Section com Aceternity `WavyBackground`:**
   - **Localização:** Topo da página inicial.
   - **Efeito:** Ondas senoidais animadas e sutis no fundo (`wavy-background`), com gradientes escuros (`#0b0c10`, `#1f242d`, `#16171d`), criando uma sensação de projeção de luz no cinema.
   - **Conteúdo em Primeiro Plano:** Título de impacto (*"Explore o Universo Cinematográfico"*), subtítulo dinâmico e barra de pesquisa hero com prefetch ativado.

2. **Seções Analíticas Curadas (Data-Driven Highlights):**
   Aproveitando as tabelas `fact_movies_performance`, `dim_companies` e `dim_people`:
   - **Carrossel "Em Alta / Maior Popularidade" (Trending Movies):**
     - Alimentado pela métrica `FactMoviePerformance.popularidade`.
     - Cards horizontais ou grid com badge estilizado `🔥 Popularidade: {popularidade.toFixed(1)}`.
     - Exibe os top 10 filmes mais comentados e procurados no momento.
   - **Carrossel / Grid "Campeões de Bilheteria" (Top Box Office & Lucro):**
     - Alimentado por `receita_usd`, `receita_brl` e `lucro_usd`.
     - Badge financeiro esmeralda: `💰 US$ {receita_usd_formatada}` / `R$ {receita_brl_formatada}` e indicador de ROI positivo.
   - **Filtro Rápido por Estúdios / Produtoras (`DimCompany`):**
     - Seletor de marcas icônicas (ex: *Warner Bros.*, *Universal Pictures*, *A24*, *Paramount*), filtrando o catálogo com 1 clique.

3. **Barra de Controle de Catálogo Geral (Filtros & Ordenação):**
   - **Search Input:** Input com debounce de 300ms, limpável via botão `✕`.
   - **Filtro de Gêneros (`DimGenre`):** Chips selecionáveis em estilo pílula (ex: *Ficção Científica*, *Drama*, *Ação*, *Comédia*). Permite seleção múltipla sincronizada na URL (`?genre=Action&genre=Drama`).
   - **Seletor de Ordenação Ampliado:** Select do shadcn com opções:
     - *Mais Populares* (ordena por `popularidade` decrescente)
     - *Maior Nota dos Usuários* (ordena por `nota_media_usuarios`)
     - *Maior Bilheteria / Receita* (ordena por `receita_usd`)
     - *Maior Nota TMDb / IMDb* (ordena por notas externas de referência)
     - *Lançamentos Mais Recentes* (ordena por `ano_lancamento` / `data_lancamento`)
     - *Título (A-Z)*
   - **Toggle Grid / List (Referência `sort-by-block-and-list.png`):**
     - Alternador tipo pílula com ícones `LayoutGrid` e `List`.
     - Atualiza instantaneamente a URL com `?view=grid` ou `?view=list`.

4. **Exibição dos Filmes no Catálogo Geral:**
   - **Modo Grid (Pôsteres com `CardSpotlight`):**
     - Cards em grade responsiva (2 a 6 colunas).
     - Poster em alta proporção `aspect-[2/3]` com cantos arredondados e borda sutil `border-white/10`.
     - Efeito hover: elevação suave `-translate-y-1.5` com zoom sutil da imagem e sombra difusa dourada/âmbar.
     - **Badges sobrepostos no pôster:**
       - Canto superior esquerdo: Média dos usuários (ex: `★ 4.8` ou `★ 9.2/10`).
       - Canto superior direito: Badge de Popularidade `🔥 85.4`.
     - Rodapé do card: Título em negrito truncado em 1 linha, ano de lançamento, diretor (`DimPerson.nome_pessoa`) e chips de gênero.
     - Prefetch TanStack Query no evento `onMouseEnter`.
   - **Modo List (Tabela Interativa / Linhas de Curadoria Densas):**
     - Linhas compactas com thumbnail 48x72px, título completo, ano, produtoras (`DimCompany`), elenco principal (`DimPerson`), popularidade, bilheteria convertida (USD/BRL), média de avaliações em estrelas e botão de atalho para detalhes.

5. **Paginação Inteligente:**
   - Componente shadcn `Pagination` com botões *Anterior*, *Próximo* e números de página.
   - Totalmente atrelado ao query param `?page=X`.

---

### 2.2 Tela de Autenticação / Login (`/login`)

#### Objetivo
Acesso administrativo seguro para gerenciar filmes e moderação de avaliações.

#### Componentes & Efeitos Visuais
1. **Aceternity `LayoutTextFlip` (Flipping Text):**
   - **Localização:** No painel lateral ou acima do formulário de login.
   - **Texto:** *"Entre para avaliar filmes de [Gênero Rotativo]"*, alternando suavemente palavras com animação 3D de flip vertical:  
     `Ficção Científica` $\rightarrow$ `Cinema Noir` $\rightarrow$ `Clássicos Cult` $\rightarrow$ `Animação` $\rightarrow$ `Suspense`.
2. **Glassmorphism Auth Card:**
   - Cartão com fundo escuro translúcido `bg-card/80 backdrop-blur-xl border border-white/10 shadow-2xl p-8 rounded-2xl max-w-md w-full`.
3. **Formulário com TanStack Form + Zod:**
   - Campos: E-mail e Senha.
   - Indicadores obrigatórios conforme especificação visual (`*` com tooltip "Required field").
   - Botão de submit com estado de loading ("Entrando no Sistema...").
   - Redirecionamento automático pós-login para a página anterior ou painel admin.
4. **Gerenciamento de Sessão e Decodificação JWT (`jwt-decode`):**
   - Na recepção do token, decodifica claims (`sub`, `role`, `exp`) de forma síncrona sem roundtrips adicionais à rede.
   - Detecção proativa de expiração de token (`isTokenExpired`) para invalidação e logout limpo sem estado quebrado ou telas em branco.
   - Hidratação imediata do estado de autenticação em recarregamentos de página (F5).

---

### 2.3 Tela de Detalhes do Filme & Avaliações (`/filmes/:id`)

#### Objetivo
Exibir a ficha técnica completa do filme, métricas analíticas consolidadas, galeria de reviews e ações de administração (editar e excluir).

#### Componentes & Efeitos Visuais
1. **Backdrop Hero:**
   - Imagem de fundo panorâmica desfocada com máscara de gradiente fade-to-black na base.
2. **Cabeçalho de Ficha Técnica & Metadados Cinematográficos:**
   - Pôster em destaque com cantos `rounded-2xl` e iluminação volumétrica.
   - Título oficial, ano de lançamento, status (`status_filme`), duração em minutos formatada (`duracao_minutos` $\rightarrow$ "2h 49m"), produtoras (`dim_companies`).
   - **Elenco e Equipe Técnica (`DimPerson`):**
     - Seção dedicada listando: **Diretor(es)**, **Roteirista(s)** e **Atores principais** com avatares estilizados e badges de papel no filme.
   - **Aceternity `TooltipCard` (ou Rich Tooltip):**
     - Ao passar o mouse sobre o Diretor, Produtora ou Média de Notas, abre-se um cartão rico com dados complementares (ex: outros filmes dirigidos, total de votos apurados, distribuição de notas 1-5 estrelas em mini gráfico).
   - **Painel Comparativo de Scores (Consolidado `DimReview` & `FactMoviePerformance`):**
     - **Média Geral RocketFilms (Usuários):** Nota média em estrelas e base 10 (ex: `★ 8.8 / 10`), com contagem total de resenhas (`qtd_avaliacoes_usuarios`).
     - **Badge Oficial TMDb:** Nota e contagem de votos (`nota_tmdb` / `qtd_tmdb`).
     - **Badge Oficial IMDb:** Nota e contagem de votos (`nota_imdb` / `qtd_imdb`).
   - **Sinopse Oficial:** Tipografia relaxada e legível.

3. **Painel de Desempenho Financeiro & Performance (`FactMoviePerformance`):**
   - Mini dashboard elegante em cartões translúcidos (Glassmorphism):
     - **Popularidade:** Indicador termômetro visual (`🔥 {popularidade}`).
     - **Orçamento (Budget):** `orcamento_usd` e `orcamento_brl`.
     - **Bilheteria (Box Office / Receita Global):** `receita_usd` e `receita_brl`.
     - **Lucro / ROI:** `lucro_usd` e `lucro_brl`, destacado em verde esmeralda com percentual de retorno sobre o investimento, ou alerta em caso de prejuízo.

4. **Ações do Administrador (quando autenticado):**
   - Botões no topo: *Editar Filme* (abre modal ou navega para rota de edição) e *Excluir Filme* (dispara `AlertDialog` do shadcn com aviso irreversível).

5. **Histórico de Avaliações & Resenhas (Reviews Section - `MovieReview`):**
   - Botão em destaque: **"Escrever Avaliação"** (abre o modal de nova resenha).
   - **Aceternity `ExpandableCard` para Avaliações:**
     - Cada review é renderizado como um card elegante contendo: autor (`nome`), data (`created_at`), nota (`nota`, 0 a 10 ou  correspondente) e as primeiras 3 linhas do comentário (`comentario`).
     - **Ao clicar na resenha:** O card expande organicamente no centro da tela (`framer-motion layoutId`), revelando o texto completo, data/hora formatada e avatar do autor sem recarregar a página. O fundo recebe blur sutil.
     - Botão `✕` ou clique fora fecha a expansão com animação reversa fluida.

6. **Modal "Nova Avaliação" (`<Dialog />`):**
   - **Identificação do Autor:** Campo de nome do avaliador.
   - **Seletor de Estrelas / Nota (0 a 10):** Seletor interativo com escala de notas compatível com o modelo (`nota >= 0 AND nota <= 10`).
   - **Textarea de Resenha:** Validação de tamanho mínimo e limite de 4000 caracteres.
   - Indicador de campo obrigatório (tooltip + barra de destaque).
   - Mutação via TanStack Query invalidando a query `['movie-reviews', id]` e `['movie-details', id]`.

---

### 2.4 Telas de Cadastro & Edição de Filmes (`/admin/filmes/novo` e `/admin/filmes/:id/editar`)

#### Objetivo
Permitir ao administrador cadastrar e editar filmes com validação completa.

#### Componentes & Regras de Formulário
- **Formulário Construído com TanStack Form + Zod Schema:**
  - `title`: string obrigatória ($\ge 2$ caracteres).
  - `director`: string obrigatória ($\ge 2$ caracteres).
  - `release_year`: número inteiro entre 1888 e 2030.
  - `genres`: seleção múltipla de gêneros existentes ou criação de novos chips.
  - `synopsis`: texto livre com contagem de caracteres.
  - `poster_url`: link da imagem com preview instantâneo ao lado.
- **Implementação do Padrão Visual de Campos Obrigatórios com Aceternity `TooltipCard`:**
  - Barra de destaque lateral colorida no campo (`border-l-4 border-l-amber-500`).
  - Marcador `*` que dispara um **Tooltip dark** com ponta triangular exibindo `"Required field"`.
- **Ações:**
  - Botão *Salvar Filme* (com feedback visual e toast de notificação).
  - Botão *Cancelar* (retorna à rota anterior).

---

## 3. Especificação Detalhada da Command Palette Global (`cmdk` / shadcn)

A Command Palette é o coração de produtividade do RocketFilms.

### Comportamento & Ativação
- **Atalho de Teclado:** `Ctrl + K` (Windows/Linux) ou `Cmd + K` (macOS).
- Também acionável clicando no botão de busca da navbar superior.

### Efeitos Visuais & Cenografia
1. **Backdrop Blur Intenso:**
   ```tsx
   <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xl transition-all duration-300" />
   ```
   O restante da tela perde nitidez completamente, criando um foco total no painel de comando.
2. **Animação de Entrada e Saída:**
   - **Entrada:** `animate-in fade-in-0 zoom-in-95 slide-in-from-top-4 duration-200 ease-out`.
   - **Saída:** `animate-out fade-out-0 zoom-out-95 slide-out-to-top-4 duration-150 ease-in`.
3. **Feedback Visual ao Navegar e Fazer Hover:**
   - Cada `<CommandItem>` reage imediatamente:
     - Borda de destaque na lateral esquerda: `border-l-2 border-primary`.
     - Fundo suave iluminado: `bg-primary/10 text-foreground`.
     - Ícone da esquerda ganha cor dourada neon: `text-primary`.
     - Ao teclar `Enter` ou clicar: executa a ação e fecha a paleta instantaneamente.

### Estrutura de Grupos da Paleta
- **Grupo 1: Navegação Rápida & Modos de Visualização**
  - "Ir para Catálogo Geral"
  - "Alternar para Modo Grade (Grid View)"
  - "Alternar para Modo Lista (List View)"
- **Grupo 2: Curadoria Analítica (Insights dos Modelos)**
  - "🔥 Ver Filmes Em Alta (Top Popularidade)"
  - "💰 Ver Campeões de Bilheteria (Maior Receita Global)"
  - "⭐ Ver Mais Bem Avaliados pelos Usuários"
- **Grupo 3: Gêneros Cinematográficos (`DimGenre`)**
  - Atalhos diretos para filtrar por *Ficção Científica*, *Terror*, *Drama*, *Ação*, etc.
- **Grupo 4: Estúdios e Produtoras (`DimCompany`)**
  - Atalhos diretos para catálogo de grandes estúdios: *A24*, *Warner Bros.*, *Universal Pictures*, *Paramount*.
- **Grupo 5: Busca Dinâmica de Filmes & Elenco (`DimMovie` + `DimPerson`)**
  - Enquanto o usuário digita na busca, busca em tempo real via TanStack Query e lista os filmes com thumbnail, ano, diretor e score.
- **Grupo 6: Painel do Administrador**
  - "Cadastrar Novo Filme"
  - "Gerenciar Sessão / Sair"

---

## 4. Sugestões de Componentes Adicionais Aceternity UI que Enriquecem a Aplicação

Para elevar o projeto ao nível mais alto de sofisticação e criatividade permitido no desafio:

1. **Card Spotlight (`card-spotlight`)**  
   - *Onde usar:* Nos cards de filmes no catálogo (Modo Grid).  
   - *Por que cai bem:* Ao passar o mouse pelo card, uma luz radial suave segue o cursor sobre a moldura do card, dando sensação de tela de cinema iluminada por projetor.  
   - *Referência:* `https://ui.aceternity.com/components/card-spotlight`

2. **Background Beams (`background-beams` ou `background-gradient`)**  
   - *Onde usar:* Na tela de Login e no rodapé do app.  
   - *Por que cai bem:* Feixes de luz suaves e elegantes que transitam sutilmente em gradientes escuros, sem pesar no processamento do navegador.  
   - *Referência:* `https://ui.aceternity.com/components/background-beams`

3. **Text Generate Effect (`text-generate-effect`)**  
   - *Onde usar:* Na exibição da sinopse na página de detalhes do filme (`/filmes/:id`).  
   - *Por que cai bem:* As palavras da sinopse surgem com um fade-in sequencial dinâmico, simulando o efeito de teaser de cinema ao abrir a página do filme.  
   - *Referência:* `https://ui.aceternity.com/components/text-generate-effect`


---


### Checklist de Qualidade para Execução
- [ ] Todos os formulários usam `@tanstack/react-form` acoplado ao `zod`.
- [ ] Todas as mutações e buscas de dados usam `@tanstack/react-query`.
- [ ] O código adere estritamente às regras de lint do `@shadcn/lint` e ESLint 9 Flat Config.
- [ ] Sem caminhos relativos longos: todos os imports utilizam `@/*`.
- [ ] Nenhum componente possui estilos inline desnecessários ou cores cruas fora dos tokens do Tailwind v4.
