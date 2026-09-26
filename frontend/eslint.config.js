/**
 * Configuração ESLint 9+ (Flat Config)
 *
 * 📖 GUIA RÁPIDO DE RESOLUÇÃO DE ERROS E PADRÕES:
 * Consulte o arquivo `frontend/LINT_GUIDE.md` para um resumo prático de padrões efetivos,
 * armadilhas comuns (como shadcn/no-restyle e pureza do React Compiler) e comandos rápidos:
 * - Diagnóstico rápido: `bunx eslint --quiet src/features/...`
 * - Correção automática: `bunx eslint --fix src/features/...`
 */

import js from '@eslint/js'
import shadcn from '@shadcn/lint'
import stylistic from '@stylistic/eslint-plugin'
import reactDom from 'eslint-plugin-react-dom'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactX from 'eslint-plugin-react-x'
import tailwind from 'eslint-plugin-tailwindcss'
import tsdoc from 'eslint-plugin-tsdoc'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const plugins = {
  '@stylistic': stylistic,
  '@typescript-eslint': tseslint.plugin,
  tsdoc,
  shadcn,
  tailwindcss: tailwind
}

const rules = {
  ...tseslint.configs.recommended.rules,

  // React Refresh
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

  // Core ESLint rules
  // camelcase: ['warn', {
  //   allow: []
  // }],
  'no-restricted-imports': ['error', {
    patterns: [{
      group: ['../*', '../../*'],
      message: 'Please use absolute imports with "@"'
    }]
  }],
  'no-self-compare': 'error',
  'no-unmodified-loop-condition': 'warn',
  'no-unreachable-loop': 'error',
  'prefer-const': 'error',
  quotes: ['error', 'single', { avoidEscape: true }],
  'key-spacing': ['error', {
    beforeColon: false,
    afterColon: true
  }],

  // Stylistic / formatting
  '@stylistic/comma-dangle': ['error', 'never'],
  '@stylistic/eol-last': ['error', 'always'],
  '@stylistic/indent': ['error', 2],
  '@stylistic/no-multi-spaces': 'error',
  '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
  '@stylistic/no-trailing-spaces': 'error',
  '@stylistic/object-curly-spacing': ['error', 'always'],
  '@stylistic/semi': ['error', 'never'],
  '@stylistic/space-before-blocks': ['error', 'always'],
  '@stylistic/space-infix-ops': 'error',
  '@stylistic/type-annotation-spacing': ['error', {
    before: false,
    after: true,
    overrides: {
      arrow: 'ignore'
    }
  }],
  '@stylistic/arrow-spacing': ['error', {
    before: true,
    after: true
  }],

  // TypeScript rules
  '@typescript-eslint/no-unused-vars': ['warn', {
    args: 'all',
    argsIgnorePattern: '^_',
    caughtErrors: 'all',
    caughtErrorsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    ignoreRestSiblings: true,
    varsIgnorePattern: '^_'
  }],

  // TSDoc rules
  'tsdoc/syntax': 'warn',

  // Tailwind rules
  'tailwindcss/classnames-order': 'warn',
  'tailwindcss/no-custom-classname': 'off',

  // Shadcn rules
  // NOTA: 'shadcn/no-restyle' proíbe sobrescrever cores, tipografia, bordas e padding
  // diretamente em componentes shadcn. Veja detalhes e padrões no arquivo LINT_GUIDE.md.
  // Padrão para ícones com gap: use <span className="flex items-center gap-2"> dentro do <Button>.
  'shadcn/no-raw-colors': 'warn',
  'shadcn/no-inline-styles': 'warn',
  'shadcn/no-restyle': ['error', {
    allow: ['layout'],
    contracts: [
      {
        pattern: 'Badge',
        allow: ['layout', 'spacing']
      },
      {
        pattern: 'CommandDialog',
        allow: ['layout', 'spacing', 'color', 'shape', 'effects']
      },
      {
        pattern: 'InputGroup',
        allow: ['layout', 'spacing', 'shape', 'color', 'motion']
      },
      {
        pattern: 'StatefulButton',
        allow: ['layout', 'spacing', 'typography', 'shape', 'color']
      }
    ]
  }]
}

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '.tmp', 'src/components/ui/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname
      }
    },
    settings: {
      tailwindcss: {
        cssConfigPath: 'src/index.css'
      },
      shadcn: {
        note: 'Consulte DESIGN.md e README.md. Adicione variantes ou tamanhos em src/components/ui em vez de sobrescrever estilos.'
      }
    },
    plugins,
    rules
  },
  {
    files: ['src/routes/**/*.{ts,tsx}', 'src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off'
    }
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/ui/**'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: "JSXOpeningElement[name.name='input']",
          message: 'Evite utilizar elementos nativos <input>. Utilize os componentes de UI padronizados do shadcn (@/components/ui/input ou @/components/ui/input-group).'
        },
        {
          selector: "JSXOpeningElement[name.name='button']",
          message: 'Evite utilizar elementos nativos <button>. Utilize os componentes de UI padronizados do shadcn (@/components/ui/button ou @/components/ui/input-group).'
        },
        {
          selector: "JSXOpeningElement[name.name='textarea']",
          message: 'Evite utilizar elementos nativos <textarea>. Utilize os componentes de UI padronizados do shadcn (@/components/ui/textarea ou @/components/ui/input-group).'
        }
      ]
    }
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off'
    }
  }
])
