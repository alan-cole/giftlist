const GenericFilter = require('./GenericFilter')
const moment = require('moment-timezone')

module.exports = class EventFilter extends GenericFilter {
  /**
   * Outgoing = From the Server to the Database.
   * @param {Object} result
   */
  outgoing (result) {
    this.date_outgoing(result)
    return super.outgoing(result)
  }

  /**
   * Add a start and end date to an item.
   * @param {Object} item
   */
  date_outgoing (item) {
    item['start'] = moment(item['start']).toDate()
    item['end'] = moment(item['end']).toDate()
    return item
  }
}
