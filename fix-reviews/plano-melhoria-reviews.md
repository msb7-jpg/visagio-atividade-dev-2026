# Plano de Melhoria da Experiência de Avaliações (Letterboxd-like)

> **Documento de Especificação Técnica e UX**  
> **Status:** Aprovado para Execução  
> **Referência:** `fix-reviews/fix-reviews.md`, imagens de referência do Letterboxd e feedback de usabilidade.

---

## 1. Visão Geral e Princípios de Design

A implementação inicial de avaliações adotou um modelo estruturado como um **formulário de cadastro corporativo**, gerando alto estresse visual, fricção e sensação artificial.

O objetivo deste plano é transformar o fluxo em uma **experiência fluida de diário cinematográfico (padrão Letterboxd)**, focada em:
1. **Fricção Zero:** Avaliação rápida (Quick Rating) de 1 clique diretamente pelo catálogo na Home.
2. **Pôster como Arte:** Limpeza do card no catálogo em repouso, valorizando a arte visual do filme sem sobrecarregar com badges pesados no topo.
3. **Escala Intuitiva:** 5 estrelas clássicas com precisão de meia-estrela (0.5 a 5.0), abandonando a grade dura de 10 botões com emojis.
4. **Identificação Transparente:** Aproveitar o contexto de autenticação (`useAuth()`), eliminando o campo de texto manual de "Nome" para usuários logados.
5. **Elegância Visual:** Paleta em ardósia profunda (`slate-900`/`zinc-900`) e toques âmbar/dourado suave, eliminando halos neon e faixas amarelas grossas.

---

## 2. Diagnóstico da Arquitetura Atual vs. Alvo

| Elemento | Estado Atual | Novo Padrão (Letterboxd / Cineclube) |
| :--- | :--- | :--- |
| **Card no Catálogo (Repouso)** | 2 badges pesados sobrepostos no topo (Nota e Popularidade) | **Pôster 100% limpo**. Nota, ano e duração integrados de forma sutil no rodapé textual. |
| **Card no Catálogo (Hover)** | Sem ações interativas de avaliação rápida | **Pílula translúcida flutuante** com botão `···` (e slots reservados para Watchlist/Like). |
| **Gatilho de Menu Rápido** | Inexistente na Home | **Dual Trigger Shadcn**: Clique nos `···` (DropdownMenu) E clique com botão direito no pôster (ContextMenu). |
| **Quick Rating (1 clique)** | Inexistente; exige abrir modal e preencher texto | **5 estrelas no topo do menu de contexto** para registrar a nota em 1 clique sem sair da Home. |
| **Escala de Nota** | 10 botões numéricos com emojis e textos literais | **5 estrelas interativas com meia-estrela (0.5 a 5.0)** e exibição discreta (ex: `3.5 ★`). |
| **Comentário / Resenha** | Obrigatório com mínimo de 10 caracteres | **Opcional no backend**: permite dar apenas nota pelo Quick Rating ou resenhar pelo Modal. |
| **Identificação do Autor** | Input manual de texto "Seu nome ou apelido" com borda amarela | **Automático**: recuperado via `useAuth()` para usuários logados; fallback anônimo discreto. |
| **Modal de Resenha** | Cabeçalho pesado com sparkles, inputs apertados e contraste agressivo | Modal espaçoso, textarea orgânica sem bordas duras, botão Cancelar sutil e botão Publicar em ouro suave. |

---

## 3. Arquitetura de Interação na Home: Quick Actions & Context Menu

```
[ Pôster do Filme no Catálogo ]
   │
   ├─► Repouso: Pôster limpo + Rodapé com Ano · Duração · ★ Nota
   │
   ├─► Hover: Pílula flutuante translúcida com botão [ ··· ]
   │
   ├─► Clique esquerdo em [ ··· ]  ──► Abre Menu de Ações Rápidas (DropdownMenu Shadcn)
   │
   └─► Clique direito no Pôster    ──► Abre ContextMenu Shadcn (Ação Power-User)
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │  ★ ★ ★ ★ ★  (5 estrelas interativas / 0.5)    │
                      │  ───────────────────────────────────────────  │
                      │  ✍️  Avaliar ou escrever resenha...           │
                      │  🎬  Ver detalhes do filme                    │
                      │  👁️  Marcar como visto (em breve)             │
                      │  ❤️  Favoritar (em breve)                     │
                      └───────────────────────────────────────────────┘
                                              │
                     [1 Clique na Estrela] ───┴───► [Clique em Escrever Resenha]
                               │                                │
                     Salva nota instantaneamente        Abre Modal de Resenha
                     (Optimistic UI + Toast sutil)      (Textarea focada e limpa)
```

### 3.1. Estratégia dos Componentes Shadcn (`ContextMenu` + `DropdownMenu`)
Para garantir a melhor ergonomia sem conflito de eventos:
1. **`ContextMenu` (Radix / Shadcn)**: Envolve o container do pôster (`<ContextMenuTrigger>`), permitindo que cinéfilos em desktop usem o botão direito em qualquer ponto do card para acessar as ações.
2. **`DropdownMenu` (Radix / Shadcn)**: Conectado ao botão de 3 pontinhos (`···`) na pílula flutuante visível no hover.
3. **Subcomponente de Conteúdo Unificado (`MovieQuickActionsMenuContent`)**:
   - Um único componente reutilizável renderiza os itens tanto para o `DropdownMenuContent` quanto para o `ContextMenuContent`, garantindo consistência visual de 100%.

### 3.2. Mecânica do Quick Rating (1 Clique)
- No topo do menu de contexto, é exibida a barra de 5 estrelas.
- Ao passar o mouse sobre a barra, as estrelas acendem até a posição do cursor (suportando incrementos de 0.5).
- Ao clicar em uma nota (ex: `4.0 ★`):
  1. A mutação do TanStack Query dispara a criação/atualização da nota imediatamente.
  2. A interface atualiza optimisticamente a nota média do filme no card.
  3. Um feedback sutil é exibido (estrelas coloridas com tom âmbar suave e toast discreto: *"Avaliação de 4.0 registrada"*).
  4. O menu se fecha suavemente sem recarregar a tela e sem abrir diálogos invasivos.

---

## 4. Componente de Estrelas Cineclubista (`StarRatingInput`)

Substituição da grade de 10 botões por um componente de 5 estrelas:
- **Resolução de 0.5 (Meia-estrela):**
  - Cada estrela possui detecção de posição do cursor (`e.nativeEvent.offsetX < width / 2`).
  - Metade esquerda ativa fração `.5`; metade direita ativa número inteiro `.0`.
- **Paleta Suave:**
  - Estrelas inativas: `text-white/20` (cinza escuro discreto).
  - Estrelas ativas / hover: `text-amber-400 fill-amber-400` (ouro clássico, tom Letterboxd).
- **Feedback Numérico Mínimo:**
  - Apenas o número legível (ex: `4.5 ★`), sem carinhas ou rótulos óbvios como "Regular / Razoável".

---

## 5. Redesenho do Modal de Resenha (`NewReviewModalView`)

1. **Eliminação do Ruído Promocional:**
   - Remoção do badge e ícone de sparkles `"ROCKETFILMS REVIEW"`.
   - Título limpo: `"Avaliar " + filme` com subtítulo neutro.
2. **Eliminação do Input de Nome:**
   - Para usuários autenticados (`useAuth().user`): o nome e o avatar são vinculados automaticamente, exibindo apenas um chip sutil no canto superior: `Avaliando como [Nome]`.
   - Nenhum formulário manual pedindo nome/apelido.
3. **Textarea Orgânica:**
   - Fundo escuro com leve transparência (`bg-white/[0.03]`), borda ultrafina quase invisível (`border-white/10`).
   - Respiro confortável com altura inicial de `rows={5}`.
   - Placeholder inspirador: *"O que você achou da direção, atuações, ritmo e atmosfera do filme?..."*
4. **Hierarquia dos Botões de Ação:**
   - Botão **Cancelar**: estilo `ghost` ou texto cinza neutro que clareia no hover.
   - Botão **Publicar**: cantos `rounded-lg` (6–8px), tom âmbar/ouro fosco com tipografia semi-bold e estado de loading elegante.

---

## 6. Ajustes de Backend e Contratos de Dados

1. **`ReviewCreateDTO` (`backend/app/features/reviews/schemas.py`):**
   - Alterar o campo `comentario` para opcional:
     ```python
     comentario: str | None = Field(
         default=None,
         max_length=4000,
         description="Comentário opcional da avaliação",
     )
     ```
2. **`ReviewsService.create_review` (`backend/app/features/reviews/service.py`):**
   - Suportar salvamento com `comentario=None` ou string vazia.
   - Garantir recálculo atômico de `nota_media_usuarios` e `qtd_avaliacoes_usuarios` na tabela `dim_reviews`.
3. **Normalização da Nota:**
   - Suporte transparente a escala de 0.5 a 5.0 (ou mapeamento proporcional para base de 10 conforme preferência da entidade de dados).

---

## 7. Fases de Execução e Checklist de Implementação

- [ ] **Fase 1: Backend & Contratos**
  - [ ] Tornar `comentario` opcional no schema Pydantic e modelo de banco.
  - [ ] Atualizar testes de backend em `backend/tests/test_reviews.py` garantindo suporte a reviews apenas com nota (Quick Rating).
  - [ ] Validar suíte do backend com `pytest`.

- [ ] **Fase 2: Instalação & Setup de Componentes Shadcn**
  - [ ] Garantir disponibilidade de `ContextMenu` e `DropdownMenu` do Shadcn em `frontend/src/components/ui/`.
  - [ ] Criar o componente `StarRatingInput.tsx` (5 estrelas com suporte a meia-estrela).
  - [ ] Adicionar testes unitários para `StarRatingInput` em `__tests__/StarRatingInput.test.tsx`.

- [ ] **Fase 3: Refatoração do Modal de Resenha**
  - [ ] Atualizar `NewReviewModalView.tsx`: incorporar `StarRatingInput`, remover input de nome, despoluir header e estilizar textarea.
  - [ ] Conectar com `useAuth()` para autor automático.
  - [ ] Atualizar testes em `ReviewsSection.test.tsx`.

## 8. Diagnóstico e Resolução do Menu Travado (`context-menu-stuck.png`)

### 8.1. Causa Raiz
No componente `src/components/ui/dropdown-menu.tsx`, a classe:
```tsx
className={cn("... w-(--radix-dropdown-menu-trigger-width) min-w-32 ...", className)}
```
forçava a largura do menu a ser calculada a partir do elemento que disparou o menu (`DropdownMenuTrigger`), que é o botão `···` com largura de apenas `28px` (`size-7`).
Como resultado, a largura caía no fallback `min-w-32` (`128px`), esmagando e cortando o texto e a barra de 5 estrelas. O `ContextMenu` funcionava corretamente porque não possuía essa restrição de largura baseada em trigger.

### 8.2. Solução Técnica
1. Remover `w-(--radix-dropdown-menu-trigger-width)` de `DropdownMenuContent`.
2. Adotar largura intrínseca confortável: `min-w-56 w-60 max-w-xs`.
3. Adicionar `collisionPadding={12}` para garantir que em cards perto das bordas da tela o menu se reposicione suavemente sem cortar.

---

## 9. Suporte a Edição de Review e Herança de Estrelas

### 9.1. Lógica do Usuário Logado
1. **Identificação da Review Prévia:**
   - Ao abrir o catálogo ou detalhes, o sistema consulta se o usuário atual (`user.nome`) já possui avaliação para o filme.
2. **Estrelas no Menu de Contexto:**
   - Se o usuário já avaliou, as estrelas mostram **a nota dele** (ex: `4.5 ★`).
   - Clicar em outra estrela altera imediatamente a nota dele via mutação de atualização (`PUT`), recalculando a média em tempo real.
3. **Opções no Menu:**
   - `✏️ Editar minha resenha`: Abre o modal preenchido com a nota e o comentário anterior.
   - `➕ Adicionar nova resenha`: Abre o modal para um novo registro, **pré-carregando a nota de estrelas da sua última avaliação**.
   - Se ainda não avaliou: exibe `"✍️ Escrever resenha..."`.

### 9.2. Tratamento para Usuário Anônimo
1. O navegador armazena a avaliação anônima no `localStorage` sob a chave `rocketfilms_anon_review_${movieId}` (`{ reviewId, nota, comentario }`).
2. Se o visitante já avaliou o filme neste navegador, as estrelas no menu aparecem preenchidas com a nota dele, e as opções de editar ou adicionar nova resenha ficam ativas.
3. No modal, exibe sutilmente: *"Avaliando como Visitante (salvo neste navegador) • Fazer login para sincronizar no seu perfil"*.

### 9.3. Backend: Endpoint de Edição
- Endpoint: `PUT /api/v1/movies/{movie_id}/reviews/{review_id}`
- Recebe `ReviewCreateDTO` (nota e comentário opcional).
- Atualiza os campos e recalcula a média e contagem em `dim_reviews`.

