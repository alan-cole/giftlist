const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = class Authentication {

  constructor (config) {
    this.config = config
  }

  /**
   * Convert a password into a secured hash.
   * @param {String} password
   */
  async generateHash (password) {
    const hash = await bcrypt.hash(password, this.config.authentication.rounds)
    return hash
  }

  /**
   * Check a password against a secured hash.
   * @param {String} password
   * @param {String} hash
   */
  async verifyPassword (password, hash) {
    const result = await bcrypt.compare(password, hash)
    return result
  }

  /**
   * Create a token.
   * @param {Object} payload
   */
  generateToken (payload) {
    return jwt.sign(payload, this.config.authentication.secret)
  }

  /**
   * Verify token.
   * @param {String} token
   */
  async verifyToken (token) {
    const result = await jwt.verify(token, this.config.authentication.secret)
    return result
  }
}
