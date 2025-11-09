# requires-version

[![npm version](https://badge.fury.io/js/requires-version.svg)](https://badge.fury.io/js/requires-version)
[![CI](https://github.com/SangHakLee/requires-version/actions/workflows/node.js.yml/badge.svg)](https://github.com/SangHakLee/requires-version/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/SangHakLee/requires-version/branch/master/graph/badge.svg)](https://codecov.io/gh/SangHakLee/requires-version)
[![semantic-release: conventionalcommits](https://img.shields.io/badge/semantic--release-conventionalcommits-1890ff?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

[![NPM](https://nodei.co/npm/requires-version.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/requires-version/)

A TypeScript library for checking system dependency versions. Verify that required command-line tools exist and meet minimum version requirements in your Node.js projects.

## Features

- ✅ **Simple Existence Checks** - Verify if a command-line tool is installed
- 🔍 **Version Validation** - Compare installed versions against requirements
- 🎯 **Flexible Operators** - Use `<`, `>`, `=`, `<=`, `>=` for version comparisons
- 🚀 **TypeScript First** - Full type safety with TypeScript
- 🌐 **Cross-Platform** - Works on Linux, macOS, and Windows
- 📦 **Zero Dependencies** (runtime)
- 🧪 **Well Tested** - 96%+ test coverage

## Installation

```bash
npm install requires-version --save-dev
```

## Usage

### Basic Existence Check

Check if a command-line tool is installed:

```typescript
import { requires } from 'requires-version'

// Check if Node.js is installed
if (requires('node')) {
	console.log('Node.js is installed')
} else {
	console.log('Node.js is not installed')
}
```

### Version Comparison

Verify that a tool meets version requirements:

```typescript
import { requires, GREATER, EQUAL } from 'requires-version'

// Check if Node.js version is >= 18.0.0
if (requires('node', '18.0.0', GREATER | EQUAL)) {
	console.log('Node.js version is 18.0.0 or higher')
}

// Check if npm version is exactly 9.5.0
if (requires('npm', '9.5.0', EQUAL)) {
	console.log('npm version is 9.5.0')
}
```

### All Comparison Operators

```typescript
import { requires, LESS, GREATER, EQUAL } from 'requires-version'

// Greater than
requires('node', '16.0.0', GREATER) // version > 16.0.0

// Less than
requires('node', '20.0.0', LESS) // version < 20.0.0

// Equal to
requires('node', '18.14.1', EQUAL) // version === 18.14.1

// Greater than or equal to
requires('node', '18.0.0', GREATER | EQUAL) // version >= 18.0.0

// Less than or equal to
requires('node', '20.0.0', LESS | EQUAL) // version <= 20.0.0
```

### Error Handling

When a version check fails, a `VersionException` is thrown:

```typescript
import { requires, GREATER, EQUAL, VersionException } from 'requires-version'

try {
	requires('nonexistent-tool', '1.0.0', GREATER | EQUAL)
} catch (error) {
	if (error instanceof VersionException) {
		console.error('Version check failed:', error.message)
		// Possible messages:
		// - "nonexistent-tool" not found.
		// - "nonexistent-tool" version not found.
	}
}
```

### Practical Examples

#### Pre-flight Checks

Validate your development environment before running tasks:

```typescript
import { requires, GREATER, EQUAL } from 'requires-version'

function checkDevelopmentEnvironment() {
	const checks = [
		{ name: 'node', version: '18.0.0' },
		{ name: 'npm', version: '9.0.0' },
		{ name: 'git', version: '2.0.0' }
	]

	for (const { name, version } of checks) {
		if (!requires(name, version, GREATER | EQUAL)) {
			throw new Error(`${name} >= ${version} is required`)
		}
	}

	console.log('✅ All dependencies satisfied')
}
```

#### Build Script Validation

```typescript
import { requires, GREATER, EQUAL } from 'requires-version'

// Ensure required build tools are available
if (!requires('docker')) {
	throw new Error('Docker is required for building')
}

if (!requires('node', '18.0.0', GREATER | EQUAL)) {
	throw new Error('Node.js 18.0.0 or higher is required')
}

// Proceed with build...
```

## API

### `requires(dependencyName: string): boolean`

Check if a command exists in the system PATH.

**Parameters:**
- `dependencyName` - Name of the command-line tool to check

**Returns:**
- `true` if the tool exists, `false` otherwise

**Example:**
```typescript
requires('node') // true or false
```

---

### `requires(dependencyName: string, version: string, op: Operator): boolean`

Check if a command exists and satisfies a version requirement.

**Parameters:**
- `dependencyName` - Name of the command-line tool to check
- `version` - Version string to compare against (e.g., "18.14.1")
- `op` - Comparison operator (LESS, GREATER, EQUAL, or combinations)

**Returns:**
- `true` if the version requirement is satisfied

**Throws:**
- `VersionException` if the tool is not found or version cannot be determined

**Example:**
```typescript
requires('node', '18.0.0', GREATER | EQUAL) // true or false
```

---

### Operators

```typescript
export const LESS: number    // 0x02 - Less than operator
export const GREATER: number // 0x04 - Greater than operator
export const EQUAL: number   // 0x08 - Equal to operator
```

Operators can be combined using bitwise OR (`|`):
- `GREATER | EQUAL` → `>=`
- `LESS | EQUAL` → `<=`

---

### `VersionException`

Custom error class thrown when version checks fail.

**Example:**
```typescript
import { VersionException } from 'requires-version'

try {
	requires('tool', '1.0.0', EQUAL)
} catch (error) {
	if (error instanceof VersionException) {
		console.error(error.message)
	}
}
```

## How It Works

1. **Tool Detection**: Uses the `which` package to locate executables in the system PATH
2. **Version Extraction**: Attempts multiple common version flags (`-v`, `--version`, etc.)
3. **Version Parsing**: Extracts version numbers using regex patterns
4. **Comparison**: Uses semantic versioning comparison via `compare-versions` package

## Platform Support

Tested on:
- ✅ **Linux** (Ubuntu, Debian, etc.)
- ✅ **macOS** (Darwin)
- ✅ **Windows** (Win32)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run coverage

# Build
npm run build

# Lint
npm run lint

# Lint and fix
npm run lint:fix
```

## Testing

The library includes comprehensive tests covering:
- Basic functionality (existence checks, version comparisons)
- Error handling (missing dependencies, invalid versions)
- Version parsing (various formats, prefixes)
- Real-world platform tests (Linux, macOS, Windows)
- Edge cases (version format variations)

See [test/index.spec.ts](test/index.spec.ts) for all test cases.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:
- Setting up the development environment
- Code style and conventions
- Commit message format
- Pull request process

## License

MIT © [sanghaklee](https://github.com/SangHakLee)

## Related Projects

- [which](https://github.com/npm/node-which) - Cross-platform implementation of Unix `which`
- [compare-versions](https://github.com/omichelsen/compare-versions) - Semantic version comparison
- [semver](https://github.com/npm/node-semver) - Semantic versioning for Node.js

## Support

- 📝 [Documentation](https://sanghaklee.github.io/requires-version/)
- 🐛 [Issue Tracker](https://github.com/SangHakLee/requires-version/issues)
- 💖 [Sponsor](https://github.com/sponsors/SangHakLee)
