# Diretrizes de Design & Sistema Visual (DESIGN.md)

> **Projeto:** Sistema de Avaliação e Catálogo de Filmes (RocketFilms / Letterboxd Inspired)  
> **Padrão Estético:** *Cinematic Modern Dark / Retrô-Futurista*  
> **Fundação:** Tailwind CSS v4, shadcn/ui, Aceternity UI, Radix Primitives & Framer Motion  

---

## 1. Visão Geral e Filosofia Visual

O design do **RocketFilms** é concebido para oferecer uma experiência imersiva de "cinema digital", combinando a sofisticação limpa do **Letterboxd** com microinterações de ponta promovidas por **shadcn/ui** e **Aceternity UI**.

### Pilares de Design
1. **Atmosfera Cinematográfica Escura (Dark-first by Design):** Contrastes profundos com negros carvão (`#0e0f12`, `oklch(0.145 0 0)`), tons ardósia grafite para superfícies elevadas e destaques neon suaves (âmbar cinematográfico, violeta e esmeralda).
2. **Profundidade Óptica e Vidro Fosco (Glassmorphism & Optical Depth):** Uso de camadas translúcidas (`backdrop-blur-xl`, bordas sutis com opacidade `10%` a `15%` de branco) simulando painéis de exibição e projeções.
3. **Fluidez e Motion com Propósito:** Animações com molas físicas reais (`framer-motion`), flip de textos, expansão orgânica de cards e transições de rotas suaves. Zero movimentos desnecessários que gerem fadiga.
4. **Densidade de Informação Flexível:** Capacidade de alternar instantaneamente entre navegação visual (Posters Grid) e modo de análise e curadoria rápida (List View com métricas e metadata densa).

---

## 2. Tipografia e Escalas

A tipografia utiliza a família **Geist** (`Geist Variable` e `Geist Mono`), oferecendo proporções geométricas limpas, neutralidade para títulos e legibilidade de dados numéricos.

### Famílias Tipográficas
- **Display & Heading:** `var(--font-heading)` / `'Geist Variable', sans-serif`  
  - *Weights:* 500 (Medium), 600 (Semibold), 700 (Bold)  
  - *Tracking:* `-0.03em` para títulos grandes, `-0.015em` para subtítulos.
- **Body & Content:** `var(--font-sans)` / `'Geist Variable', sans-serif`  
  - *Weights:* 400 (Regular), 500 (Medium)  
  - *Line Height:* `145%` a `160%` para textos de resenhas.
- **Data & Monospace:** `var(--font-mono)` / `ui-monospace, 'Geist Mono', Consolas, monospace`  
  - *Uso:* Notas, durações, anos de lançamento, timestamps e badges de status.

### Escala de Tamanhos
| Token | Tamanho / Line Height | Tracking | Aplicação Principal |
| :--- | :--- | :--- | :--- |
| `display-hero` | 56px / 1.1 | `-0.035em` | Título de boas-vindas / Hero Section |
| `h1` | 36px - 40px / 1.2 | `-0.025em` | Título do filme na página de detalhes |
| `h2` | 24px - 28px / 1.25 | `-0.02em` | Títulos de seções ("Em Alta", "Histórico de Críticas") |
| `h3` | 18px - 20px / 1.3 | `-0.01em` | Cabeçalhos de cards, títulos de modais |
| `body-lg` | 16px / 1.5 | `normal` | Textos em destaque, introduções de resenha |
| `body` | 14px / 1.5 | `normal` | Sinopses, corpo de resenhas, inputs |
| `caption` | 12px / 1.4 | `0.01em` | Metadados (diretor, estúdio, data), labels auxiliares |
| `mono-xs` | 11px / 1.2 | `0.02em` | Chips de tags, badges numéricos, atalhos de teclado |

---

## 3. Paleta de Cores e Tokens Semânticos

A paleta respeita o padrão de tokens semânticos do Tailwind CSS v4 e shadcn/ui, garantindo que o tema escuro seja a identidade primária da aplicação.

### Tokens de Superfície e Contraste
```css
:root {
  /* Fundo principal e elevações */
  --background: oklch(0.12 0.01 260);      /* #111217 fundo imersivo profundo */
  --foreground: oklch(0.98 0 0);           /* Branco puro para textos principais */
  --card: oklch(0.16 0.01 260);            /* Cartões elevados com sutil tom frio */
  --card-foreground: oklch(0.96 0 0);
  --popover: oklch(0.14 0.01 260);         /* Modais, menus e command palette */
  --popover-foreground: oklch(0.98 0 0);

  /* Acentos de Marca (Cine-Gold & Retrô Violet) */
  --primary: oklch(0.78 0.16 75);          /* Âmbar Dourado / Estrelas (#f59e0b refinado) */
  --primary-foreground: oklch(0.14 0 0);   /* Texto escuro de alto contraste sobre dourado */
  
  --secondary: oklch(0.24 0.02 260);        /* Superfícies secundárias neutras */
  --secondary-foreground: oklch(0.92 0 0);

  --muted: oklch(0.20 0.015 260);          /* Fundos inativos, inputs desativados */
  --muted-foreground: oklch(0.65 0.02 260);/* Textos secundários, sinopses truncadas */

  --accent: oklch(0.28 0.06 280);          /* Púrpura sutil para hovers interativos */
  --accent-foreground: oklch(0.98 0 0);

  --destructive: oklch(0.60 0.22 25);      /* Vermelho escarlate para exclusões */
  
  /* Bordas e Contornos */
  --border: oklch(1 0 0 / 12%);            /* Linhas de vidro ultrafinas */
  --input: oklch(1 0 0 / 14%);
  --ring: oklch(0.78 0.16 75 / 60%);       /* Anel de foco dourado com transparência */

  --radius: 0.75rem;                       /* 12px padrão para modernidade orgânica */
}
```

### Paleta Funcional de Cinema & Dados Analíticos
- **Star Rating Gold:** `rgb(245, 158, 11)` / `oklch(0.78 0.16 75)` — Avaliações de 1 a 5 estrelas / notas de usuários.
- **Popularity Fire / Trending:** `oklch(0.70 0.22 45)` (Laranja Chama) — Índice de popularidade do filme.
- **Box Office Emerald / Profit:** `oklch(0.72 0.18 150)` (Verde Esmeralda Financeiro) — Receita, lucro em USD e BRL.
- **Loss / Deficit:** `oklch(0.65 0.22 25)` (Coral Avermelhado) — Filmes com prejuízo operacional.
- **External Ratings (TMDb / IMDb):**
  - **TMDb Blue/Turquoise:** `oklch(0.65 0.18 200)` — Selo oficial com nota e quantidade de votos TMDb.
  - **IMDb Gold:** `oklch(0.82 0.18 85)` — Badge amarelo com nota e quantidade de votos IMDb.
- **Fresh Tomato / High Rating:** `oklch(0.68 0.20 145)` (Verde Neon Letterboxd) para médias $\ge 4.0$ (ou $\ge 8.0/10$).
- **Average Rating:** `oklch(0.75 0.15 80)` (Âmbar suave) para médias entre $2.5$ e $3.9$.
- **Low Rating:** `oklch(0.62 0.20 28)` (Coral) para médias $< 2.5$.
- **Gêneros em Badges:** Efeito *glass capsule* com borda `border-white/10` e fundo translúcido `bg-white/5 hover:bg-white/10`.
- **People / Cast Badges:** Chips para Diretores (destaque púrpura/ouro), Atores e Roteiristas.

---

## 4. Sistema de Espaçamento, Grid e Elevação

### Sistema de Espaçamento Base (Módulo 4px)
- `space-1` (4px), `space-2` (8px), `space-3` (12px), `space-4` (16px), `space-6` (24px), `space-8` (32px), `space-12` (48px).

### Layout & Containers
- **Largura Máxima do App:** `max-w-7xl` (1280px) ou `1440px` fluido com padding lateral dinâmico `px-4 sm:px-6 lg:px-8`.
- **Grid de Pôsteres (Catálogo):**
  - Mobile: 2 colunas (`grid-cols-2 gap-3`)
  - Tablet: 3 a 4 colunas (`grid-cols-3 sm:grid-cols-4 gap-4`)
  - Desktop: 5 a 6 colunas (`grid-cols-5 xl:grid-cols-6 gap-6`)
  - Aspect Ratio padrão dos pôsteres: `aspect-[2/3]` com cantos `rounded-lg` ou `rounded-xl`.
- **List View (Catálogo Linear):**
  - Linhas com altura confortável (`py-3 px-4`), thumbnail 48x72px (`aspect-[2/3]`), colunas alinhadas: Pôster + Título/Ano + Gêneros + Diretor + Média de Estrelas + Ações Rápidas.

---

## 5. Diretrizes para Componentes Genéricos e Primitives

### 5.1 Botões (`Button`)
- **Variant `default`:** Fundo dourado/âmbar `bg-primary text-primary-foreground font-medium hover:brightness-110 shadow-sm active:scale-98 transition-all`.
- **Variant `outline`:** Borda sutil de vidro `border border-white/15 bg-white/5 hover:bg-white/10 text-foreground`.
- **Variant `ghost`:** Transparente, ganha fundo `bg-white/5` no hover.
- **Variant `destructive`:** `bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25`.

### 5.2 Campos de Formulário e Indicador Obrigatório (`Required Fields`)
- **Barra de Destaque Vertical:** Todo campo obrigatório exibe uma sutil barra vertical de status na lateral esquerda (`border-l-4 border-l-amber-500/80`).
- **Asterisco e Tooltip "Required field":**
  - No label ou junto ao input, exibe-se um ícone/badge com `*`.
  - Ao passar o mouse sobre o marcador de obrigatoriedade, dispara um Aceternity `TooltipCard`
- **Feedback de Validação (TanStack Form + Zod):**
  - Mensagens de erro surgem com animação `animate-in fade-in slide-in-from-top-1` com tipografia `text-xs text-red-400 font-medium`.

### 5.3 Alternador de Exibição Grid / List (`Toggle View`)
Seguindo estritamente a referência `references/sort-by-block-and-list.png`:
- Contêiner arredondado pílula/cápsula com fundo escuro `bg-black/40 border border-white/10 p-1 flex items-center gap-1`.
- Dois botões de ícone: `LayoutGrid` (blocos de 4 quadrados) e `List` (linhas com marcadores).
- O botão ativo ganha fundo elevado `bg-white/15 text-white shadow-xs rounded-md`.
- O botão inativo permanece com opacidade reduzida `text-white/40 hover:text-white/80`.
- A alternância sincroniza instantaneamente na URL via parâmetro `?view=grid` ou `?view=list`.

### 5.4 Command Palette Global (`cmdk` / shadcn Command)
Requisitos específicos atendidos:
1. **Backdrop Blur Intenso:** `DialogOverlay` configurado com `backdrop-blur-xl bg-black/70 fixed inset-0 z-50 transition-all duration-200`. O fundo da página fica fortemente embaçado, destacando o centro cinematográfico.
2. **Animação de Entrada e Saída:**
   - Entrada: Escala suave de `zoom-in-95` com `fade-in-0`, descendo sutilmente (`slide-in-from-top-4`).
   - Saída: `zoom-out-95 fade-out-0`.
3. **Feedback Visual:**
   - Itens no estado hover ou teclado selecionado recebem realce imediato `data-selected:bg-primary/15 data-selected:text-primary-foreground border-l-2 border-primary pl-3 transition-colors`.
   - Pequenos badges com atalhos de teclado (ex: `↵ Enter`, `ESC`, `⌘K`).
   - Grupos semânticos: *Ações Rápidas*, *Filmes em Destaque*, *Filtrar por Gênero*, *Painel Administrativo*.

---

## 6. Diretrizes de Microinterações e Efeitos Especiais

1. **Hover em Pôsteres:**
   - Efeito de elevação `hover:-translate-y-1.5 transition-all duration-300 ease-out`.
   - Brilho de borda translúcido com sombra profunda (`hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] hover:border-white/30`).
2. **Avaliação por Estrelas Interativa:**
   - Ícones de estrela preenchida com gradiente dourado, com suporte a microanimação de "bounce" suave ao clicar para selecionar nota de 1 a 5.
3. **Skeleton Loading:**
   - Efeito shimmer suave cinza escuro (`bg-white/5 via-white/10 to-white/5 animate-pulse rounded-lg`) mantendo exatamente o aspect-ratio dos pôsteres durante o cache do TanStack Query.
