const log = require('./log')

module.exports = {
  /**
   * Return an error.
   * @param {String} message
   * @param {String} privateMessage
   */
  error (message, privateMessage) {
    log(`⚠ ${privateMessage || message}`)
    return {
      error: true,
      message: message
    }
  },

  /**
   * Return a success message.
   * @param {String} message
   * @param {Object} data
   * @param {String} privateMessage
   */
  success (message, data, privateMessage) {
    log(`✓ ${privateMessage || message}`)
    let rtn = {
      error: false,
      message: message
    }
    if (data) {
      rtn['result'] = data
    }
    return rtn
  },

  /**
   * Return a conflict.
   * @param {String} message
   * @param {Object} item
   * @param {String} collection
   * @param {String} privateMessage
   */
  conflict (message, item, collection, privateMessage) {
    log(`⚠ ${privateMessage || message}`)
    return {
      error: true,
      message: message,
      conflict: true,
      collection: collection,
      remote: item
    }
  },
}
