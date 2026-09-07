import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/dist/**', '**/node_modules/**'],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // NestJS backend files (adjust paths to your repo layout)
    files: ['apps/**/src/**/*.ts', 'libs/**/src/**/*.ts'],
    // Allow type-only imports ONLY for pure type files
    ignores: ['**/*.dto.ts', '**/*.types.ts', '**/*.interface.ts'],
    rules: {
      // Disable type-only enforcement so DI works at runtime
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
  {
    ignores: ['**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*'],
  },
];
