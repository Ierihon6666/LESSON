import globals from 'globals';
import pluginJs from '@eslint/js';//Новые порты для использования стандартного js

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],//только js
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    languageOptions: {
      globals: globals.node,//глобальные переменные для Node.js
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',//выдает предупреждение всместо ошибки
      'eqeqeq': ['error', 'always'], // требует использовать строгое равенство
      'camelcase': ['warn', { properties: 'always' }], // выдает предупреждение, если название переменной не в camelCase
    },
  },
];
