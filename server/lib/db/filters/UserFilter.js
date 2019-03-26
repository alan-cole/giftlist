const GenericFilter = require('./GenericFilter')

module.exports = class UserFilter extends GenericFilter {
  /**
   * Incoming = From the database to the Server.
   * @param {Object} result
   */
  incoming (result) {
    delete result['password']
    return super.incoming(result)
  }

  /**
   * Outgoing = From the Server to the Database.
   * @param {Object} result
   */
  outgoing (result) {
    delete result['changepassword']
    return super.outgoing(result)
  }
}
