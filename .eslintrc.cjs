module.exports = {
  root: true,
  extends: ['@antfu', '@vue/eslint-config-prettier'],
  rules: {
    'no-console': 'warn',
    'antfu/if-newline': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'n/prefer-global/process': 'off',
    '@stylistic/ts/brace-style': 'off',
  },
  ignorePatterns: ['package.json', 'pnpm-lock.yaml'],
}
