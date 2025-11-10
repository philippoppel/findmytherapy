module.exports = {
  extends: ['@mental-health/eslint-config'],
  root: true,
  rules: {
    // Disable rule that's incompatible with ESLint 9
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
  },
}
