# Guia de Engenharia: Soluções e Boas Práticas para Animações na UI

Este documento reúne o diagnóstico aprofundado, os experimentos realizados (o que funcionou e o que não funcionou) e as soluções definitivas para os desafios de animação encontrados na aplicação (**Tearing em Hover de Cards**, **Jumping em Paginação com Framer Motion** e **Deslocamento de Scroll em Listas Dinâmicas**).

---

## 1. Problema: Tearing / Linha Branca no Hover do Card de Filme

### 1.1 Sintoma Visual
Ao passar o mouse (`hover`) sobre os cards de filmes no catálogo (especialmente em filmes com pôsteres claros, como *Strays* ou *One Piece*), surgia um risco/traço claro intermitente na costura entre a parte inferior da imagem do pôster e o topo do bloco de texto (área do título). O traço piscava e desaparecia ao final da animação.

### 1.2 Diagnóstico Técnico (Causa Raiz)
O problema decorre de **Sub-pixel Rasterization / Texture Bleeding** na GPU do navegador:
1. **Interpolação de Frações de Pixel:** O card possui `hover:-translate-y-1.5` (deslocamento de `-6px`). Durante os 300ms da transição, a GPU calcula posições com coordenadas decimais (ex: `-2.34px`, `-4.71px`).
2. **Arredondamento de Aspect Ratio (`aspect-2/3`):** Elementos com proporção calculada dinamicamente frequentemente resultam em alturas fracionárias (ex: `285.33px`).
3. **Lacuna na Costura Flexbox:** Entre o contêiner superior do pôster e o contêiner inferior de texto (`flex flex-col`), esse arredondamento gerava um micro-espaço (gap) de 0.5px a 1px durante a movimentação, revelando os pixels da borda inferior da imagem ou o fundo do contêiner.

### 1.3 O que Tentamos e O que Não Deu Certo
- **Tentativa 1: Aceleração por GPU (`[transform:translateZ(0)]` e `[backface-visibility:hidden]`):**
  - *Hipótese:* Forçar o navegador a criar uma camada de composição de GPU separada evitaria a re-rasterização quadro a quadro.
  - *Resultado:* Melhorou o frame-rate da animação, mas **não eliminou o traço**, pois o gap geométrico fracionário ainda ocorria entre as duas camadas.
- **Tentativa 2: Isolar o `group-hover:scale-105` da imagem:**
  - *Hipótese:* A escala interna da imagem com `overflow: hidden` estaria vazando pela borda.
  - *Resultado:* Descartada pelo teste de isolamento (*fencing*). Mesmo sem a escala da imagem (com ela estática), a linha continuava surgindo, provando que o problema estava na **costura entre os contêineres** e não na ampliação da imagem.

### 1.4 A Solução Definitiva
A solução definitiva é baseada em **Sobreposição Geométrica (Overlap) e Vedação**:
1. **Margem Negativa de Sub-pixel (`-mb-px`):**
   - O contêiner do pôster recebeu `-mb-px` (`margin-bottom: -1px`), fazendo com que ele se sobreponha em exatamente 1 pixel contra a caixa de texto inferior.
2. **Faixa de Vedação Absoluta (`h-1 bg-card`):**
   - Uma camada física imperceptível de vedação foi adicionada na base interna do pôster:
     ```tsx
     <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-card" />
     ```
   - Essa faixa tem a mesma cor de fundo do cartão (`bg-card`), bloqueando qualquer pixel residual ou margem branca nativa da imagem externa.
3. **Elevação do Bloco Inferior (`relative z-10 bg-card`):**
   - A área de texto foi explicitamente elevada com `z-10 bg-card`, garantindo que ela sempre se sobreponha de forma limpa sobre a costura.

---

## 2. Problema: Paginação Instável e Indicador Deslocado ("Moving Target")

### 2.1 Sintoma Visual
Ao clicar em um número de página na paginação (por exemplo, na página `3985`), o número clicado não permanecia sob o cursor do mouse e o indicador dourado (`layoutId="activePageIndicator"`) parecia "pular para o centro", dando a impressão de um clique fantasma e desorientação visual.

### 2.2 Diagnóstico Técnico (Causa Raiz)
- **Janela Deslizante Centrada (`currentPage ± delta`):** O cálculo anterior reposicionava toda a lista para manter a página ativa sempre no meio. Ao clicar em um número à direita, a lista inteira deslocava 1 posição para a esquerda, mudando os números de todos os botões imediatamente.
- **Conflito com o `layoutId` do Framer Motion:** O Framer Motion tentava interpolar a transição entre botões que já haviam mudado de valor numérico, criando uma trajetória caótica.

### 2.3 A Solução Definitiva (Blocos Estáveis)
Substituímos a janela flutuante centrada por **Paginação por Blocos Fixos/Estáveis** (`blockSize = 5`) em `pagination-helper.ts`:
- **Comportamento:** As páginas são divididas em blocos consistentes (ex: `1..5`, `6..10`, `3981..3985`).
- **Resultado:** Enquanto o usuário navega dentro do bloco atual, **os botões ficam 100% parados**. O indicador dourado desliza suavemente e com precisão exatamente para a posição onde o mouse acabou de clicar.
- **Transição de Tamanho Fluida:** O contêiner recebeu `layout` do Framer Motion com molas (`spring, bounce: 0.15, duration: 0.4`), expandindo suavemente apenas quando elipses (`...`) aparecem ou desaparecem.

---

## 3. Problema: Deslocamento de Scroll e Sensação de Ficar "Preso" no Meio da Tela

### 3.1 Sintoma Visual
Ao navegar de uma página com poucos filmes (como a última página `3986`, que possui apenas 1 ou 2 filmes) de volta para a página `1` (que tem 24 filmes), a altura do catálogo expandia bruscamente, jogando o usuário para o meio da página ou deixando-o preso no rodapé.

### 3.2 Diagnóstico Técnico (Causa Raiz)
O navegador mantém o valor numérico absoluto do scroll (`window.scrollY`). Se o usuário clica na paginação no rodapé de uma página curta, ao carregar a nova lista de 24 itens, a altura da página quadruplica instantaneamente e empurra a paginação para baixo, afastando o usuário do início do conteúdo.

### 3.3 A Solução Definitiva
1. **Scroll Automático Suave para o Início do Catálogo:**
   - Em `CatalogContainer.tsx`, a troca de página dispara:
     ```ts
     const navHeight = 70 // Compensação da barra superior
     const elementPosition = catalogRef.current.getBoundingClientRect().top
     const offsetPosition = elementPosition + window.pageYOffset - navHeight

     window.scrollTo({
       top: Math.max(0, offsetPosition),
       behavior: 'smooth'
     })
     ```
   - O usuário é levado suavemente ao topo dos novos filmes carregados.
2. **Altura Mínima Consistente (`min-h-140`):**
   - O contêiner `MovieListView` agora define `min-h-140` (560px), impedindo que páginas com poucos filmes sofram variações extremas de altura.

---

## 4. Checklist para Futuras Animações no App

Quando for criar novas animações em componentes da aplicação, siga estas regras de ouro:

1. **Evite `transition-all` quando houver transformações 2D/3D:**
   - Prefira propriedades específicas: `transition-transform`, `transition-opacity` ou `transition-colors`. `transition-all` recalcula layout, cores e sombras simultaneamente, aumentando as chances de gargalos ou tearing.
2. **Para elementos adjacentes que se movem, use Overlap (`-mb-px` ou `-mt-px`):**
   - Em contêineres verticais ou horizontais que usam `aspect-ratio` ou transformações, sempre use 1px de sobreposição para prevenir frestas de sub-pixel causadas por densidades de tela fracionárias.
3. **Layout Animations (`layoutId`) precisam de elementos de destino com chaves (`key`) estáveis:**
   - Se os itens mudarem de posição e de valor simultaneamente a cada clique, a animação parecerá quebrada. Agrupe em blocos estáveis antes de animar indicadores com `layoutId`.
4. **Cores de Hover em Modais Escuros:**
   - Ao estilizar itens selecionáveis sobre fundos quase pretos (como o Command Palette), prefira fundos translúcidos brancos (`bg-white/10`, `bg-white/15`) com texto branco em vez de acentos opacos com texto escuro, garantindo alto contraste e elegância.
5. **Sempre combine animações de lista com controle de Scroll e `min-height`:**
   - Em qualquer interface paginada ou filtrada, garanta que a troca de estado preserve ou reposicione o scroll do usuário no local de interesse.
