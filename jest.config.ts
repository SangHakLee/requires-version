/** @type {import('jest').Config} */
export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/test'],
	testMatch: ['**/*.spec.ts', '**/*.test.ts'],
	testPathIgnorePatterns: ['/node_modules/'],
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	collectCoverageFrom: ['src/**/*.ts', 'index.ts', '!**/*.d.ts', '!**/node_modules/**'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 85,
			lines: 85,
			statements: 85
		}
	},
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.test.json'
			}
		]
	},
	verbose: true
}
