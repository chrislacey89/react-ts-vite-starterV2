module.exports = {
  plugins: ['prettier'],
  extends: [
    'kentcdodds',
    'kentcdodds/import',
    'kentcdodds/react',
    'kentcdodds/jsx-a11y',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-unused-private-class-members': 'off',
    'react/iframe-missing-sandbox': 'warn',
    'prefer-object-has-own': 'off',
  },
}
