* maybe in the main section and we show waves in the background?
-> https://ui.aceternity.com/components/wavy-background

* maybe when the user is in the login page and it shows the possible genres, flipping the current one active
-> https://ui.aceternity.com/components/layout-text-flip

* definetely when the user clicks into a review
-> https://ui.aceternity.com/components/expandable-card

* quando formos usar tooltips
https://ui.aceternity.com/components/tooltip-card

* como usar com shadcn com aceternity
https://ui.aceternity.com/shadcn-blocks

* tanstack form implementation
https://ui.shadcn.com/docs/forms/tanstack-form

* alguns requisitos definidos por nos
- vou querer uma command pallete utilizando Command do shadcn/ui
    - Quando a paleta abrir, deve ter uma animação de entrada e quando sairmos. 
    - O fundo do site deve ficar intensamente desfocado.
    - O usuário deve ter feedback visual ao fazer um hoover ou selecionar um filme

nososs icones via lucid-react

Read https://github.com/shadcn-ui/lint/blob/main/SETUP.md
and set up @shadcn/lint in this project.

vamos utilizar tailwind css para estilização

vamos utilizar regras de eslint para o sistema

use cases do sistema -> @Atividade de Dev.pdf

Requisitos adicionais 
- documentação com storybook
- testes  automatizados
- autenticação
- filtros
- responsividade
- caching de consultas


┌──────────────────────────────────────────────────────────────┐
│                    STACK RECOMENDADA                         │
├──────────────────────────────────────────────────────────────┤
│ 1. Routing & URL State  ➔  React Router (v7)                 │
│ 2. Server State & Cache ➔  TanStack Query                    │
│ 3. Form Management      ➔  TanStack Form                     │
│ 4. Validation           ➔  Zod (compartilhado por todos)     │
│ 5. Component Doc        ➔  Storybook                         │
│ 6. Testing              ➔  Vitest + Testing Library + MSW    │
│ 7. Build Tool           ➔  Vite                              │
└──────────────────────────────────────────────────────────────┘