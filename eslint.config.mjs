import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'

export default [
	{
		files: ['src/**/*.ts', 'index.ts'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				project: './tsconfig.json',
				ecmaVersion: 2020,
				sourceType: 'module'
			}
		},
		plugins: {
			'@typescript-eslint': typescriptPlugin
		},
		rules: {
			'@typescript-eslint/explicit-function-return-type': ['error', {
				allowExpressions: true
			}],
			'indent': ['error', 'tab'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'never'],
			'no-console': 'warn',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': ['error', {
				argsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_'
			}],
			'comma-dangle': ['error', 'never'],
			'object-curly-spacing': ['error', 'always']
		}
	},
	{
		files: ['test/**/*.ts', 'test/**/*.spec.ts'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module'
			}
		},
		plugins: {
			'@typescript-eslint': typescriptPlugin
		},
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'off',
			'no-console': 'off',
			'@typescript-eslint/no-explicit-any': 'off'
		}
	},
	{
		ignores: ['build/**', 'dist/**', 'coverage/**', 'docs/**', 'node_modules/**', '*.js', '*.mjs', '*.cjs']
	}
]
