# 📚 Documentação Técnica — CineFlow

Este diretório centraliza toda a documentação, padrões arquiteturais, especificações e planos de engenharia do projeto.

---

## 📁 Estrutura de Diretórios

```text
docs/
├── architecture/         # Decisões e padrões de arquitetura (Vertical Slices, Linguagem Onipresente)
│   ├── ARQUITETURA.md    # Guia completo da arquitetura e estrutura de pastas
│   └── clean-backend.md  # Padrões para isolamento de documentação e endpoints limpos
│
├── design/               # Design System, tokens semânticos, microinterações e telas
│   ├── DESIGN.md         # Filosofia visual, paleta escura cinematográfica e tipografia Geist
│   ├── DESIGN-IMPLEMENTATION.md # Especificações de telas, componentes e comportamentos
│   ├── shadcn-design-systems.md # Guia de design systems e boas práticas shadcn
│   └── shadcn-readme.md  # Referência técnica de componentes shadcn/ui
│
├── engineering/          # Diretrizes de código, requisitos não-funcionais e qualidade
│   ├── GUIDELINES.md     # Boas práticas de React 19, hooks, TanStack Query e anti-patterns
│   ├── requisitos-nao-funcionais.md # Padrões de código, linters, testes e performance
│   └── common-animation-bugs.md     # Armadilhas comuns de animação e layout
│
├── planning/             # Documentos vivos de execução, notas e rastreabilidade
│   ├── plano-execucao.md # Documento mestre de etapas com status e critérios de aceite
│   ├── plano-temporario-favoritos-watchlist.md # Proposta do slice de biblioteca
│   ├── notes.md          # Anotações e pendências de refinamento de UX/UI
│   └── plan.md           # Rascunho inicial de ideias e bibliotecas
│
└── specs/                # Especificação oficial e requisitos de negócio
    └── atividade-dev.md  # Requisitos funcionais originais do projeto
```

---

## 📌 Guia Rápido de Referência

- **Para entender a estrutura do código e contratos de dados:** Consulte [`docs/architecture/ARQUITETURA.md`](architecture/ARQUITETURA.md).
- **Para consultar a paleta de cores, tipografia e diretrizes de UI:** Consulte [`docs/design/DESIGN.md`](design/DESIGN.md).
- **Para boas práticas de engenharia de software e hooks React:** Consulte [`docs/engineering/GUIDELINES.md`](engineering/GUIDELINES.md).
- **Para acompanhar o progresso de cada etapa implementada:** Consulte [`docs/planning/plano-execucao.md`](planning/plano-execucao.md).
