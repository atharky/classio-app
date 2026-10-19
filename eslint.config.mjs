import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', 'api/node_modules/', 'playwright-report/', 'test-results/'] },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.browser, ...globals.node } },
    rules: {
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      'no-irregular-whitespace': ['error', { skipStrings: true, skipTemplates: true, skipRegExps: true }],
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  { files: ['sw.js'], languageOptions: { globals: { ...globals.serviceworker } } },
];
