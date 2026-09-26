# Guia Prático de Resolução de Linter (ESLint 9 + shadcn/lint + React Compiler)

Este documento reúne os padrões, armadilhas comuns e soluções definitivas para as regras de linter adotadas neste repositório (`frontend/eslint.config.js`). O objetivo é evitar tentativas e erros recorrentes, aplicando correções assertivas de primeira.

---

## 1. Comandos de Diagnóstico e Resolução Rápida

Ao desenvolver ou alterar arquivos, **não tente rodar o linter no projeto inteiro de início** (pois arquivos legados podem poluir a saída). Siga este fluxo:

```bash
# 1. Verificar apenas o arquivo ou pasta em que você trabalhou (com warnings e erros):
bunx eslint src/features/sua-feature/

# 2. Filtrar APENAS os erros que quebram o build (ignora warnings):
bunx eslint --quiet src/features/sua-feature/

# 3. Aplicar correções automáticas (resolve estilo, aspas, ponto-e-vírgula e ordem de Tailwind):
bunx eslint --fix src/features/sua-feature/
```

> [!TIP]
> O comando `--fix` resolve automaticamente:
> - Ponto-e-vírgula sobrando (`@stylistic/semi`)
> - Aspas duplas (`quotes`)
> - Espaçamentos de chave/objeto (`@stylistic/object-curly-spacing`)
> - Ordem das classes Tailwind (`tailwindcss/classnames-order`)

---

## 2. A Grande Armadilha: `shadcn/no-restyle`

Esta é a regra mais estrita do projeto. Ela proíbe sobrescrever estilos fundamentais de componentes de `src/components/ui/`.

### O que o linter proíbe:
Os componentes do design system (como `<Button>`, `<DialogContent>`, `<Input>`, `<Badge>`) possuem **propriedade exclusiva** sobre:
- **Cores** (`bg-*`, `text-*`, `border-*`, `hover:bg-*`, `hover:text-*`)
- **Espaçamento interno** (`p-*`, `px-*`, `py-*`, `gap-*`)
- **Forma / Bordas** (`rounded-*`, `backdrop-blur-*`)
- **Tipografia** (`text-xs`, `text-sm`, `font-semibold`)

### ❌ O que NÃO fazer:
```tsx
// ERRADO: O Button é quem define sua cor, padding e tipografia
<Button className="gap-2 text-xs bg-primary/20 text-primary hover:bg-primary/30">
  <Plus className="size-4" />
  Novo Item
</Button>

// ERRADO: O DialogContent é quem define cor de fundo, blur, padding e borda
<DialogContent className="max-w-md border-white/10 bg-card/95 p-6 backdrop-blur-xl sm:rounded-2xl">
  ...
</DialogContent>
```

### ✅ Padrões Efetivos de Correção:

#### Padrão A: Para Ícones e `gap` em `<Button>`
Em vez de colocar `gap-2` no `<Button>`, envolva o conteúdo em um `<span>` utilitário interno:
```tsx
<Button variant="ghost" size="sm" onClick={handleClick}>
  <span className="flex items-center gap-2">
    <Plus className="size-4" />
    <span>Novo Item</span>
  </span>
</Button>
```

#### Padrão B: Para Cores e Variantes de Botão
Nunca passe classes de cor (`text-destructive`, `text-primary`, `hover:bg-...`). Use a propriedade `variant` correspondente já existente em `src/components/ui/button.tsx`:
- Ação destrutiva: `variant="destructive"` (já traz fundo avermelhado suave e borda correta).
- Ação secundária neutra: `variant="outline"` ou `variant="ghost"`.
- Ação em pílula: `variant="pill"` com `size="pill"`.
- Seleção de nota: `variant="rating"` ou `variant="rating-selected"`.

Se um novo visual recorrente for realmente necessário, **adicione uma variante ao CVA em `src/components/ui/button.tsx`**, em vez de estilizar com `className`.

#### Padrão C: Para `<DialogContent>`
Passe apenas classes estruturais de largura máxima (ex: `className="max-w-md"` ou `className="max-w-xl"`). Deixe todo o resto por conta do `dialog.tsx`:
```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-md">
    <DialogHeader>...</DialogHeader>
    <DialogFooter>...</DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 3. React 19 & React Compiler: Pureza e Efeitos

O projeto utiliza os plugins `eslint-plugin-react-hooks` (regras modernas do React 19) e `eslint-plugin-react-x`.

### 3.1. Proibição de `setState` Síncrono em `useEffect`
**Regra:** `react-hooks/set-state-in-effect` / `react-x/set-state-in-effect`

#### ❌ O que NÃO fazer:
Tentar "resetar" estado ao mudar uma prop ou URL:
```tsx
// ERRADO: Dispara renderizações em cascata e viola o modelo de pureza
const [imageError, setImageError] = React.useState(false)

React.useEffect(() => {
  setImageError(false)
}, [url])
```

#### ✅ Solução Efetiva: Estado Derivado por Identificador
Armazene o valor que falhou ou compute o estado diretamente no ciclo de render:
```tsx
// CORRETO: Sem useEffect!
const [failedUrl, setFailedUrl] = React.useState<string | null>(null)
const trimmedUrl = url?.trim()

// O erro só existe se a URL atual for exatamente a que falhou
const isImageFailed = Boolean(trimmedUrl && failedUrl === trimmedUrl)
const hasValidUrl = Boolean(trimmedUrl && !isImageFailed)

return (
  <img
    src={trimmedUrl}
    onError={() => setFailedUrl(trimmedUrl ?? null)}
  />
)
```
*Alternativa:* Se o componente filho precisa reiniciar completamente seu estado ao mudar um identificador, utilize `key={url}` no componente pai.

### 3.2. Impureza em Render (`new Date()` ou `Math.random()`)
**Regra:** `react-x/purity`

#### ❌ O que NÃO fazer:
```tsx
export const Card = () => {
  // ERRADO: Chamar new Date() no corpo do componente quebra pureza e memoização
  const year = new Date().getFullYear()
  return <span>{year}</span>
}
```

#### ✅ Solução Efetiva:
Mova a constante para o escopo do módulo fora da função do componente:
```tsx
// CORRETO: Declarado uma vez no módulo
const CURRENT_YEAR = new Date().getFullYear()

export const Card = () => {
  return <span>{CURRENT_YEAR}</span>
}
```

### 3.3. Preservação de Memoização (`react-hooks/preserve-manual-memoization`)
O React Compiler analisa as dependências de `useMemo` e `useCallback`.
- Não misture propriedades opcionais encadeadas (`user?.nome`) com o objeto pai (`user`) no array de dependências.
- Liste exatamente os valores acessados ou passe o objeto completo.

---

## 4. Sintaxe e Elementos Nativos Proibidos (`no-restricted-syntax`)

Para assegurar acessibilidade, foco semântico e aderência ao Design System, elementos nativos HTML de formulário são restritos no código da aplicação:

| Elemento Nativo Proibido | Substituto Obrigatório |
| :--- | :--- |
| `<button ...>` | `<Button variant="..." size="...">` de `@/components/ui/button` |
| `<input ...>` | `<Input ...>` de `@/components/ui/input` |
| `<textarea ...>` | `<Textarea ...>` de `@/components/ui/textarea` |

---

## 5. Imports Absolutos Obrigatórios (`no-restricted-imports`)

Nunca utilize caminhos relativos que subam diretórios (`../` ou `../../`).

- ❌ `import { Button } from '../../components/ui/button'`
- ❌ `import { api } from '../api/client'`
- ✅ `import { Button } from '@/components/ui/button'`
- ✅ `import { api } from '@/lib/api-client'`

---

## 6. Checklist Mental Antes de Salvar o Código

1. **Imports:** Todos começam com `@/`?
2. **Componentes base:** Usei `<Button>`, `<Input>`, `<Textarea>` em vez de tags HTML nativas?
3. **Restyle:** Removi classes de cor, padding e tipografia das tags de componentes shadcn?
4. **Efeitos:** Consegui eliminar o `useEffect` usando estado derivado?
5. **Autofix:** Executei `bunx eslint --fix <arquivo>` antes de rodar os testes?
