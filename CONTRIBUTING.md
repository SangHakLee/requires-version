# Contributing to requires-version

Thank you for your interest in contributing to requires-version! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful and constructive in your interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/requires-version.git
   cd requires-version
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/SangHakLee/requires-version.git
   ```

## Development Setup

### Prerequisites

- **Node.js**: >= 18.18.0
- **npm**: >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Install git hooks
npm run prepare
```

### Verify Setup

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build project
npm run build
```

All commands should complete without errors.

## Project Structure

```
requires-version/
├── .github/          # GitHub Actions workflows
├── .husky/           # Git hooks (Husky)
├── src/              # Source code
│   ├── index.ts      # Main library code
│   └── exceptions.ts # Custom exceptions
├── test/             # Test files
│   └── index.spec.ts # Test suite
├── dist/             # Compiled output (generated)
├── docs/             # Generated documentation (generated)
└── coverage/         # Test coverage reports (generated)
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write code following our [coding standards](#coding-standards)
- Add tests for new functionality
- Update documentation if needed

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run coverage
```

### 4. Run Linter

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### 5. Build Project

```bash
npm run build
```

Ensure the build completes without errors.

### 6. Commit Your Changes

Follow the [commit message guidelines](#commit-message-guidelines):

```bash
git add .
git commit -m "feat: add new feature"
```

### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 8. Create Pull Request

Go to the repository on GitHub and create a Pull Request from your feature branch.

## Coding Standards

### TypeScript

- Use **TypeScript** for all new code
- Enable `strict` mode
- Avoid using `any` type
- Provide proper type annotations
- Use interfaces for object shapes

### Code Style

The project uses **ESLint** and **Prettier** for code formatting:

- **Indentation**: Tabs (not spaces)
- **Quotes**: Single quotes
- **Semicolons**: Not required (semicolon-free style)
- **Line width**: 100 characters

**Example:**

```typescript
// ✅ Good
const checkVersion = (name: string, version: string): boolean => {
	return requires(name, version, GREATER | EQUAL)
}

// ❌ Bad
const checkVersion = (name, version) => {
  return requires(name, version, GREATER | EQUAL);
};
```

### File Organization

- One main export per file
- Group related functionality
- Use barrel exports in `index.ts`
- Keep functions focused and small

### Naming Conventions

- **Variables/Functions**: `camelCase`
- **Classes/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private fields**: Prefix with `_` if needed

**Example:**

```typescript
// ✅ Good
const versionRegExp = /regex/
class VersionException extends Error {}
export const GREATER = 0x04

// ❌ Bad
const VersionRegExp = /regex/
class versionException extends Error {}
export const greater = 0x04
```

## Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring (neither fixes a bug nor adds a feature)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration files
- **chore**: Other changes that don't modify src or test files

### Scope (Optional)

The scope specifies the area of the codebase affected:

- `core`: Core functionality
- `cli`: Command-line interface
- `deps`: Dependencies
- `tests`: Testing

### Examples

```bash
# New feature
git commit -m "feat: add support for wildcard version matching"

# Bug fix
git commit -m "fix: handle edge case in version parsing"

# Documentation
git commit -m "docs: update API documentation for EQUAL operator"

# Refactoring
git commit -m "refactor: simplify version comparison logic"

# Breaking change
git commit -m "feat!: change API to return Promise

BREAKING CHANGE: requires() now returns a Promise instead of boolean"
```

### Commit Message Rules

- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Maximum 72 characters for subject line
- Separate subject from body with a blank line
- Wrap body at 72 characters

## Testing Guidelines

### Test Structure

Tests are located in `test/index.spec.ts` and organized into describe blocks:

```typescript
describe('feature name', () => {
	test('should do something specific', () => {
		// Arrange
		const input = 'test'

		// Act
		const result = requires(input)

		// Assert
		expect(result).toBe(true)
	})
})
```

### Writing Tests

1. **Test one thing at a time** - Each test should validate a single behavior
2. **Use descriptive names** - Test names should clearly describe what is being tested
3. **Follow AAA pattern** - Arrange, Act, Assert
4. **Mock external dependencies** - Use Jest mocks for `which` and `execSync`
5. **Include edge cases** - Test boundary conditions and error cases

### Test Categories

- **Unit tests**: Test individual functions in isolation with mocks
- **Integration tests**: Test multiple components together
- **Platform tests**: Real-world tests on actual system tools
  - **Important**: These tests are designed to be resilient
  - They accept both successful version checks and VersionException
  - This accounts for different tool output formats across platforms
  - Ensures tests pass on Linux, macOS, and Windows CI
- **Error tests**: Test error handling and exceptions

### Example Test

```typescript
describe('requires - version comparison', () => {
	afterEach(() => {
		jest.restoreAllMocks()
	})

	test('should return true when version matches exactly', () => {
		// Arrange
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/node')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'v18.14.1')

		// Act
		const result = requires('node', '18.14.1', EQUAL)

		// Assert
		expect(result).toBe(true)
	})
})
```

### Coverage Requirements

- **Branches**: ≥ 80%
- **Functions**: ≥ 85%
- **Lines**: ≥ 85%
- **Statements**: ≥ 85%

Run coverage report:

```bash
npm run coverage
```

## Pull Request Process

### Before Submitting

1. ✅ All tests pass (`npm test`)
2. ✅ Linting passes (`npm run lint`)
3. ✅ Build succeeds (`npm run build`)
4. ✅ Coverage thresholds met
5. ✅ Documentation updated (if applicable)
6. ✅ CHANGELOG.md updated (for significant changes)

### PR Title Format

Use the same format as commit messages:

```
feat: add new feature
fix: resolve issue with version parsing
docs: improve README examples
```

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them

## Checklist
- [ ] My code follows the code style of this project
- [ ] I have added tests that prove my fix/feature works
- [ ] All new and existing tests pass
- [ ] I have updated the documentation accordingly
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be included in the next release

### After Your PR is Merged

1. Delete your feature branch:
   ```bash
   git branch -d feature/your-feature-name
   ```
2. Update your local main branch:
   ```bash
   git checkout main
   git pull upstream main
   ```

## Release Process

Releases are automated using **semantic-release**:

1. Commits are analyzed to determine version bump
2. CHANGELOG.md is automatically generated
3. Version is bumped in package.json
4. Git tag is created
5. GitHub release is created
6. Package is published to npm

### Version Bumping

Based on commit messages:

- `fix:` → Patch release (1.0.0 → 1.0.1)
- `feat:` → Minor release (1.0.0 → 1.1.0)
- `BREAKING CHANGE:` → Major release (1.0.0 → 2.0.0)

## Questions?

If you have questions or need help:

- 💬 [GitHub Discussions](https://github.com/SangHakLee/requires-version/discussions)
- 🐛 [Issue Tracker](https://github.com/SangHakLee/requires-version/issues)

## License

By contributing to requires-version, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to requires-version! 🎉
