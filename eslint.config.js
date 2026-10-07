const js = require('@eslint/js');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      '.agents/**',
      '.claude/**',
      '.cursor/**',
      '.devin/**'
    ]
  },

  js.configs.recommended,

  {
    files: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        console: 'readonly'
      }
    }
  },

  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        URL: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { args: 'none' }]
    }
  },

  {
    files: ['src/prisma/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly'
      }
    }
  },

  {
    files: ['public/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        document: 'readonly',
        fetch: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        URL: 'readonly'
      }
    }
  },

  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        afterAll: 'readonly'
      }
    }
  }
];
