module.exports = {
  root: true,
  extends: ['@antfu', '@vue/eslint-config-prettier'],
  rules: {
    'no-console': 'warn',
    'antfu/if-newline': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'n/prefer-global/process': 'off',
  },
  ignorePatterns: ['package.json', 'pnpm-lock.yaml'],
}
