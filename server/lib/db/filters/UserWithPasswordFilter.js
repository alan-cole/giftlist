const UserFilter = require('./UserFilter')

module.exports = class UserWithPasswordFilter extends UserFilter {
  constructor (database, setTimestamp) {
    super(database, setTimestamp)
    this._database = database
  }

  /**
   * Outgoing = From the Server to the Database.
   * @param {Object} result
   */
  async outgoing (result) {
    await this.outgoingUserPasswordFilter(result)
    return super.outgoing(result)
  }

  /**
   * Set a user's existing password on a user
   * @param {Object} result a user item
   */
  async outgoingUserPasswordFilter (result) {
    // Get existing password.
    const currentUser = await this._database.collection('users').findOne({_id: result._id})
    if (currentUser !== null) {
      result['password'] = currentUser['password']
      result['password_last_updated'] = new Date().getTime()
    }
    if (result.changepassword) {
      result['password'] = result.changepassword
      result['password_last_updated'] = new Date().getTime()
    }
  }
}
