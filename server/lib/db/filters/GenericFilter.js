const moment = require('moment-timezone')

module.exports = class GenericFilter {
  constructor (database, setTimestamp) {
    this._database = database
    this._setTimestamp = setTimestamp
  }

  /**
   * Incoming = From the database to the Server.
   * @param {Object} result
   */
  incoming (result) {
    return this.id_incoming(result)
  }

  /**
   * Outgoing = From the Server to the Database.
   * @param {Object} result
   */
  outgoing (result) {
    this.stripHashkey(result)
    this.id_outgoing(result)
    return this.stamp(result)
  }

  /**
   * Remove underscored variables from item.
   * @param {Object} item
   */
  stripHashkey (item) {
    for (let key in item) {
      if (key[0] === '_') {
        delete item[key]
      }
      else if (key === '$$hashKey') {
        delete item[key]
      }
      if (typeof item[key] === 'object') {
        this.stripHashkey(item[key])
      }
    }
    return item
  }

  /**
   * Swap naming of id (app) to _id (database).
   * @param {Object} item
   */
  id_outgoing (item) {
    if (item['id'] !== undefined) {
      item['_id'] = item['id']
      delete item['id']
    }
    return item
  }

  /**
   * Swap naming of _id (database) to id (app).
   * @param {Object} item
   */
  id_incoming (item) {
    item['id'] = item['_id'].toString()
    delete item['_id']
    return item
  }

  /**
   * Add a modified stamp to an item.
   * @param {Object} item
   */
  stamp (item) {
    if (this._setTimestamp) {
      item['modified'] = moment().toDate()
    }
    return item
  }
}
