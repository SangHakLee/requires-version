import { requires, LESS, GREATER, EQUAL } from './src'
import { VersionException } from './src/exceptions'

// ES Module exports
export { requires, LESS, GREATER, EQUAL, VersionException }
export default requires

// CommonJS compatibility
module.exports = requires
module.exports.requires = requires
module.exports.LESS = LESS
module.exports.GREATER = GREATER
module.exports.EQUAL = EQUAL
module.exports.VersionException = VersionException
module.exports.default = requires
