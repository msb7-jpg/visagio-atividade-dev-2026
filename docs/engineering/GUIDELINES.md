# Engineering Guidelines & Best Practices

Lean, scannable, and developer-friendly rules for React, TanStack Query, and TanStack Form.

---

## 1. 📖 Using `useCallback` Effectively

The `useCallback` hook is one of the most misunderstood features in React. It is frequently applied defensively under the assumption that it "makes code faster." In reality, it adds performance overhead and often fails silently when paired with dynamic hooks.

### 🚫 The Golden Rule
> **Do not use `useCallback` unless you can prove that breaking referential stability causes a measurable performance issue or broken application logic.**
>
> Creating an inline function in JavaScript is extremely cheap ($O(1)$). Wrapping a function in `useCallback` forces React to create the function anyway, instantiate an array, and perform shallow dependency comparisons on every single render ($O(n)$).

### ❌ When NOT to use `useCallback`

1. **On Native HTML Elements**  
   Native DOM components (like `<button>`, `<input>`, `<div>`) do not care about referential stability. They will always re-render when their parent re-renders.
   ```tsx
   // 🚫 BAD: Total waste of performance tracking
   const handleClick = useCallback(() => {
     doSomething()
   }, [])
   return <button onClick={handleClick}>Submit</button>
   ```

2. **Wrapping Functions with Frequently Changing Dependencies**  
   If a dependency changes on almost every render, `useCallback` will constantly re-run and regenerate the function reference anyway.
   ```tsx
   // 🚫 BAD: Fails silently because `mutation` changes references constantly
   const logout = useCallback(() => {
     logoutMutation.mutate()
   }, [logoutMutation]) // `logoutMutation` changes on almost every render cycle
   ```

3. **Simple Handlers Passed to Unmemoized Components**  
   Passing functions down to components that are not wrapped in `React.memo` gains zero performance benefit.

---

### ✅ When `useCallback` IS Required

You only need referential stability in two specific scenarios:

1. **Passing Callbacks to Child Components Wrapped in `React.memo`**  
   If a heavy child component is explicitly optimized with `React.memo`, passing a fresh function reference on every render breaks that memoization.
   ```tsx
   // ✅ GOOD: Keeps <HeavyComponent /> from re-rendering unnecessarily
   const handleSelect = useCallback((id: string) => {
     setSelectedId(id)
   }, [])
   return <HeavyComponent onSelect={handleSelect} />
   ```

2. **The Function is Used as a Dependency in Another Hook**  
   If your function is included in the dependency array of a `useEffect`, `useMemo`, or a custom hook, it must be stable to prevent infinite loops or accidental triggers.
   ```tsx
   // ✅ GOOD: Prevents the useEffect from executing on every single render
   const fetchData = useCallback(() => {
     api.get(`/data/${id}`)
   }, [id])

   useEffect(() => {
     fetchData()
   }, [fetchData])
   ```

---

### 💡 Alternative Patterns (How to Avoid `useCallback`)

- **A. Extract to Stable References Outside the Component**  
  If a function doesn't depend on component state or props, move it completely outside the component. It will be instantiated exactly once for the lifecycle of the application.
  ```tsx
  // ✅ BEST: No hooks needed, perfectly stable reference
  const formatData = (raw: string) => raw.trim().toLowerCase()
  export function MyComponent() {
    return <input onChange={(e) => formatData(e.target.value)} />
  }
  ```

- **B. Leverage Stable Library Utilities**  
  Libraries like TanStack Query provide functions (`mutate`, `mutateAsync`) that are already guaranteed to be referentially stable. Use them directly instead of wrapping them.
  ```tsx
  // ✅ BETTER: Alias the stable function directly. No useCallback required.
  const logout = logoutMutation.mutate
  ```

- **C. Type-Matching in Context Providers**  
  When creating wrapper functions inside a Context Provider (which is already a dynamic object changing on state updates), use regular arrow functions. If TypeScript requires strict type alignment, align the types in the wrapper without overhead:
  ```tsx
  return (
    <AuthContext
      value={{
        // ✅ CLEAN: Simple arrow function to satisfy types. No overhead.
        login: async (credentials) => {
          await loginMutation.mutateAsync(credentials)
        },
        logout: logoutMutation.mutate
      }}
    >
      {children}
    </AuthContext>
  )
  ```

---

## 2. 📝 TanStack Form: State Subscription (`useSelector` vs `useStore`)

### 🚫 The Rule
> **`useStore` is deprecated in `@tanstack/react-form` in favor of `useSelector`.** Always import and use `useSelector`.

```tsx
// 🚫 DEPRECATED:
import { useForm, useStore } from '@tanstack/react-form'
const formValues = useStore(form.store, (s) => s.values)

// ✅ PREFERRED:
import { useForm, useSelector } from '@tanstack/react-form'
const formValues = useSelector(form.store, (s) => s.values)
const formErrors = useSelector(form.store, (s) => s.errorMap)
const isSubmitting = useSelector(form.store, (s) => s.isSubmitting)
```

---

## 3. 🔄 TanStack Query: Single Source of Truth for Mutations

### 🚫 The Rule
> **Never repeat `useMutation` or create nested mutations when an upstream hook or provider already owns the mutation lifecycle.**

If an application context or domain hook (such as `useAuth`) already manages the mutation (`loginMutation`, `logoutMutation`, token persistence, cache invalidation, and session state):
- **Do NOT** wrap `login()` in another `useMutation` inside form hooks or components.
- **Consume the existing mutation directly** (e.g., `await login(values)` inside form `onSubmit`).
- Handle UI navigation and local feedback directly at the call-site or via declarative `MutationCache` meta options.

```tsx
// 🚫 BAD: Nested mutation - declaring useMutation around an existing useMutation!
const { login } = useAuth()
const loginMutation = useMutation({
  mutationFn: (credentials) => login(credentials) // Duplicate cache & state!
})

// ✅ GOOD: Single source of truth. Invoke the provider's mutation directly in onSubmit
const { login, isLoading } = useAuth()
const form = useForm({
  onSubmit: async ({ value }) => {
    try {
      await login(value)
      navigateApp('/dashboard', { replace: true })
    } catch (err) {
      setServerError(getLoginErrorMessage(err))
    }
  }
})
```

---

## 4. 🧭 Type-Safe Routing & Command Palette Actions (Template Literal Types)

### 🚫 The Rule
> **Never work with routes or command palette actions as untyped magic strings.**
> Use **Template Literal Types** for route safety, provide centralized route builders, and use strongly-typed unions or constants for command palette actions.

### Why Magic Strings Hurt
1. **Silent Runtime 404s**: Typos like `navigate('filmes/123')` or `navigate('/loginn')` pass compile-time checks without error.
2. **Brittle Refactoring**: Changing a path requires finding and replacing scattered plain string literals across the codebase.
3. **Ambiguous Action Dispatchers**: Passing raw `string` to action handlers leaves callers unsure whether a string represents a route, an event ID, or a system command.

### ✅ Route Typing with Template Literal Types

Define strict application route types in `src/routes/routes.types.ts`:

```ts
/** Rotas estáticas */
export type StaticRoute = '/' | '/login'

/** Rotas dinâmicas parametrizadas via Template Literal Type */
export type DynamicMovieRoute = `/filmes/${string | number}`

/** Rotas com query string via Template Literal Type */
export type FilteredCatalogRoute = `/?genre=${string}` | `/?${string}`

/** União mestra de todas as rotas válidas */
export type AppRoute = StaticRoute | DynamicMovieRoute | FilteredCatalogRoute

/** Construtores centralizados de rota (zero strings mágicas no código do componente) */
export const routes = {
  home: () => '/' as const,
  login: () => '/login' as const,
  movieDetail: (id: string | number): DynamicMovieRoute => `/filmes/${id}`,
  catalogGenre: (genre: string): FilteredCatalogRoute => `/?genre=${encodeURIComponent(genre)}`,
} as const
```

### ⚡ Strongly Typed Command Palette Actions

Distinguish between route navigation and system commands without magic strings:

```ts
import type { AppRoute } from '@/routes/routes.types'

/** Ações do sistema (operações não-navegacionais) */
export type CommandSystemAction = 'logout'

/** Ações de navegação estritas */
export type CommandRouteAction = AppRoute

/** União completa de ações da Command Palette */
export type CommandPaletteAction = CommandRouteAction | CommandSystemAction

/** Constantes tipadas para consumo em views */
export const COMMAND_ACTIONS = {
  NAVIGATE_HOME: '/' as const,
  NAVIGATE_LOGIN: '/login' as const,
  LOGOUT: 'logout' as const,
} as const
```

**Usage in components:**
```tsx
// ✅ CLEAN: Compile-time checked, no raw magic strings
<CommandItem onSelect={() => onSelectAction(COMMAND_ACTIONS.NAVIGATE_HOME)}>
  Explorar Catálogo
</CommandItem>
<CommandItem onSelect={() => onSelectAction(COMMAND_ACTIONS.LOGOUT)}>
  Encerrar Sessão
</CommandItem>
```

---

## 5. 📦 Single Source of Truth para Tipos (Evitar Re-exportações Vazadas)

### 🚫 The Rule
> **Não re-exporte tipos que pertencem a outros domínios ou módulos de infraestrutura.**
> Módulos de feature (como `command-palette`) devem exportar **apenas** o que produzem e pertencem ao seu próprio domínio.

### Por que re-exportar tipos externos é prejudicial?
1. **Quebra a Única Fonte da Verdade (SSOT)**: Se `AppRoute` puder ser importado tanto de `@/routes/routes.types` quanto de `@/features/command-palette/types/command-palette.types`, a base de código perde padronização e previsibilidade.
2. **Vazamento de Fronteiras (Leaky Abstractions)**: Uma feature passa a atuar acidentalmente como proxy de tipos globais de roteamento.
3. **Refatorações confusas**: Ao mover ou refatorar uma feature, outros arquivos que importavam tipos globais através dela quebram desnecessariamente.

```ts
// 🚫 BAD: Re-exportar tipos de roteamento dentro do módulo de command-palette
import type { AppRoute } from '@/routes/routes.types'
export type CommandRouteAction = AppRoute
export type { AppRoute } // Anti-padrão: poluindo a API pública da feature

// ✅ GOOD: Apenas consuma o tipo e exporte os tipos do domínio da feature
import type { AppRoute } from '@/routes/routes.types'
export type CommandRouteAction = AppRoute
```


