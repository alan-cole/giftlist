const GenericFilter = require('./GenericFilter')

module.exports = class UserFullFilter extends GenericFilter {
  /**
   * Outgoing = From the Server to the Database.
   * @param {Object} result
   */
  outgoing (result) {
    delete result['changepassword']
    return super.outgoing(result)
  }
}
