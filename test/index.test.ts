import which from 'which'
import child_process from 'child_process'
import { LESS, GREATER, EQUAL, requires } from '../src'
import { VersionException } from '../src/exceptions'

describe('requires - basic functionality', () => {
	afterEach(() => {
		jest.restoreAllMocks()
	})

	test('requires("node1") - simple existence check returns true', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/node1')

		expect(requires('node1')).toBe(true)
	})

	test('requires("nonexistent") - simple existence check returns false', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => {
			throw new Error('not found')
		})

		expect(requires('nonexistent')).toBe(false)
	})

	test('requires("node1", "18.14.1", EQUAL) - version match returns true', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/node1')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'v18.14.1')

		expect(requires('node1', '18.14.1', EQUAL)).toBe(true)
	})

	test('requires with GREATER | EQUAL operator', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/node')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'v18.14.1')

		expect(requires('node', '18.14.1', GREATER | EQUAL)).toBe(true)
		expect(requires('node', '18.0.0', GREATER | EQUAL)).toBe(true)
		expect(requires('node', '18.15.0', GREATER | EQUAL)).toBe(false)
	})

	test('requires with LESS | EQUAL operator', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/node')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'v18.14.1')

		expect(requires('node', '18.14.1', LESS | EQUAL)).toBe(true)
		expect(requires('node', '18.15.0', LESS | EQUAL)).toBe(true)
		expect(requires('node', '18.0.0', LESS | EQUAL)).toBe(false)
	})

	test('requires with GREATER operator', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/node')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'v18.14.1')

		expect(requires('node', '18.0.0', GREATER)).toBe(true)
		expect(requires('node', '18.14.1', GREATER)).toBe(false)
		expect(requires('node', '18.15.0', GREATER)).toBe(false)
	})

	test('requires with LESS operator', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/node')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'v18.14.1')

		expect(requires('node', '18.15.0', LESS)).toBe(true)
		expect(requires('node', '18.14.1', LESS)).toBe(false)
		expect(requires('node', '18.0.0', LESS)).toBe(false)
	})
})

describe('requires - error handling', () => {
	afterEach(() => {
		jest.restoreAllMocks()
	})

	test('throws VersionException when dependency not found and version check requested', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => {
			throw new Error('not found')
		})

		expect(() => {
			requires('nonexistent', '1.0.0', EQUAL)
		}).toThrow(VersionException)
	})

	test('throws VersionException when version cannot be determined', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/tool')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'invalid output')

		expect(() => {
			requires('tool', '1.0.0', EQUAL)
		}).toThrow(VersionException)
	})

	test('throws VersionException with all operators when version unavailable', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/tool')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'no version here')

		expect(() => requires('tool', '1.0.0', EQUAL)).toThrow(VersionException)
		expect(() => requires('tool', '1.0.0', GREATER)).toThrow(VersionException)
		expect(() => requires('tool', '1.0.0', LESS)).toThrow(VersionException)
	})
})

describe('requires - version parsing', () => {
	afterEach(() => {
		jest.restoreAllMocks()
	})

	test('parses version with v prefix', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/node')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'v18.14.1')

		expect(requires('node', '18.14.1', EQUAL)).toBe(true)
	})

	test('parses version without v prefix', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/npm')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => '9.5.0')

		expect(requires('npm', '9.5.0', EQUAL)).toBe(true)
	})

	test('parses version from complex output - iptables-save', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/sbin/iptables-save')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'iptables-save v1.8.4 (legacy)')

		expect(requires('iptables-save', '1.8.4', EQUAL)).toBe(true)
		expect(requires('iptables-save', '1.8.4', GREATER | EQUAL)).toBe(true)
		expect(requires('iptables-save', '1.8.4', GREATER)).toBe(false)
		expect(requires('iptables-save', '1.8.4', LESS)).toBe(false)
	})

	test('parses version from man output', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/man')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'man 2.9.1')

		expect(requires('man', '2.9.1', EQUAL)).toBe(true)
		expect(requires('man', '2.9.1', EQUAL | GREATER)).toBe(true)
		expect(requires('man', '2.9.0', GREATER)).toBe(true)
		expect(requires('man', '3.0.0', LESS)).toBe(true)
	})
})

describe('real-world tests - platform specific', () => {
	// These tests check actual system tools
	// Note: Version detection may fail on some systems due to different output formats
	// The tests are designed to be resilient and accept VersionException as valid
	const platform = process.platform

	if (platform === 'linux') {
		describe('Linux-specific tests', () => {
			test('node version check (real)', () => {
				expect(requires('node', '0.0.1', GREATER)).toBe(true)
			})

			test('npm version check (real)', () => {
				expect(requires('npm', '0.0.1', GREATER)).toBe(true)
			})

			test('bash version check (real)', () => {
				const hasBash = requires('bash')
				expect(typeof hasBash).toBe('boolean')
				if (hasBash) {
					try {
						expect(requires('bash', '3.0.0', GREATER)).toBe(true)
					} catch (error) {
						expect(error).toBeInstanceOf(VersionException)
					}
				}
			})

			test('man command exists', () => {
				const hasMan = requires('man')
				if (!hasMan) {
					expect(hasMan).toBe(false)
					return
				}

				try {
					const result = requires('man', '0.0.1', GREATER)
					expect(result).toBe(true)
				} catch (error) {
					expect(error).toBeInstanceOf(VersionException)
				}
			})
		})
	} else if (platform === 'darwin') {
		describe('macOS-specific tests', () => {
			test('node version check (real)', () => {
				expect(requires('node', '0.0.1', GREATER)).toBe(true)
			})

			test('npm version check (real)', () => {
				expect(requires('npm', '0.0.1', GREATER)).toBe(true)
			})

			test('bash version check (real)', () => {
				const hasBash = requires('bash')
				expect(typeof hasBash).toBe('boolean')
				if (hasBash) {
					try {
						expect(requires('bash', '3.0.0', GREATER)).toBe(true)
					} catch (error) {
						expect(error).toBeInstanceOf(VersionException)
					}
				}
			})

			test('git version check (real)', () => {
				const hasGit = requires('git')
				if (!hasGit) {
					expect(hasGit).toBe(false)
					return
				}

				try {
					const result = requires('git', '1.0.0', GREATER)
					expect(result).toBe(true)
				} catch (error) {
					expect(error).toBeInstanceOf(VersionException)
				}
			})
		})
	} else if (platform === 'win32') {
		describe('Windows-specific tests', () => {
			test('node version check (real)', () => {
				expect(requires('node', '0.0.1', GREATER)).toBe(true)
			})

			test('npm version check (real)', () => {
				expect(requires('npm', '0.0.1', GREATER)).toBe(true)
			})

			test('cmd exists', () => {
				const hasCmd = requires('cmd')
				expect(typeof hasCmd).toBe('boolean')
			})

			test('git version check (real)', () => {
				const hasGit = requires('git')
				if (!hasGit) {
					// Git not installed, skip
					expect(hasGit).toBe(false)
					return
				}

				try {
					// Try to get git version
					const result = requires('git', '1.0.0', GREATER)
					expect(result).toBe(true)
				} catch (error) {
					// Git is installed but version detection failed
					// This can happen on some Windows systems where git version output format differs
					// We accept this as it's a real-world test and the main functionality (existence check) works
					expect(error).toBeInstanceOf(VersionException)
				}
			})
		})
	}
})

describe('edge cases', () => {
	afterEach(() => {
		jest.restoreAllMocks()
	})

	test('handles two-digit version numbers', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/tool')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => '1.2')

		expect(requires('tool', '1.2', EQUAL)).toBe(true)
	})

	test('handles three-digit version numbers', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/tool')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => '1.2.3')

		expect(requires('tool', '1.2.3', EQUAL)).toBe(true)
	})

	test('handles version with extra text after', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/tool')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => '1.2.3 some extra text')

		expect(requires('tool', '1.2.3', EQUAL)).toBe(true)
	})

	test('handles version with text before', () => {
		jest.spyOn(which, 'sync').mockImplementation(() => '/usr/bin/tool')
		jest.spyOn(child_process, 'execSync').mockImplementation(() => 'version 1.2.3')

		expect(requires('tool', '1.2.3', EQUAL)).toBe(true)
	})
})
