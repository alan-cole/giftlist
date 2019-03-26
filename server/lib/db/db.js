const GenericFilter = require('./filters/GenericFilter')
const UserFilter = require('./filters/UserFilter')
const UserWithPasswordFilter = require('./filters/UserWithPasswordFilter')
const UserFullFilter = require('./filters/UserFullFilter')
const EventFilter = require('./filters/EventFilter')

module.exports = function () {
  const MongoClient = require('mongodb').MongoClient
  const moment      = require('moment-timezone')
  const Message     = require('../msg/msg.js')
  let url           = ''
  let db            = null
  let timezone      = 'Australia/Melbourne'
  let set_timestamp = false

  const collectionFilters = {
    client: GenericFilter,
    user: UserFilter,
    user_with_password: UserWithPasswordFilter,
    user_full: UserFullFilter,
    profile: GenericFilter,
    event: EventFilter
  }

  // Mapping of Get / Add action types to collections and data filters.
  const actions = {
    client: {
      collection: 'clients',
      filter: 'client'
    },
    event: {
      collection: 'events',
      filter: 'event'
    },
    user: {
      collection: 'users',
      filter: 'user_with_password'
    },
    profile: {
      collection: 'profiles',
      filter: 'profile'
    }
  }

  /**
   * Filter a data item or array
   * @param {Object} results array / object. Returns array if array, object if object
   * @param {String} filterName name of filter from collectionFilters map
   * @param {String} func filter function to call. 'incoming' or 'outgoing'.
   */
  async function filterResults (results, filterName, func) {
    const filter = new collectionFilters[filterName](db, set_timestamp)
    const filteredResults = []
    let filterableResults = results

    if (!Array.isArray(results)) {
      filterableResults = [results]
    }

    for (let i = 0; i < filterableResults.length; i++) {
      const item = filterableResults[i]
      const filteredResult = await filter[func](item)
      filteredResults.push(filteredResult)
    }

    return Array.isArray(results) ? filteredResults : filteredResults[0]
  }

  /**
   * Perform a deep copy of an object using JSON parse / stringify.
   * @param {Object} item
   */
  function deepCopy (item) {
    return JSON.parse(JSON.stringify(item))
  }

  /**
   * Create a copy and filter a collection dataset.
   * @param {Object} collection
   * @param {Function} filter
   */
  async function cleanCollection (collection, action, func) {
    const collectionCopy = deepCopy(collection)
    const filteredResults = await filterResults(collectionCopy, action, func)
    return filteredResults
  }

  /**
   * Check database has been initialized.
   */
  function isValid () {
    return (db !== null)
  }

  /**
   * Get all clients.
   * @param {Array} bounds not implemented
   */
  async function getClientsAsync (bounds) {
    const results = await db.collection('clients').find().toArray()
    return await filterResults(results, 'client', 'incoming')
  }

  /**
   * Get all profiles.
   * @param {Array} bounds not implemented
   */
  async function getProfilesAsync (bounds) {
    const results = await db.collection('profiles').find().toArray()
    return await filterResults(results, 'profile', 'incoming')
  }

  /**
   * Get all users.
   * @param {Array} bounds not implemented
   */
  async function getUsersAsync (bounds) {
    const results = await db.collection('users').find().toArray()
    return await filterResults(results, 'user', 'incoming')
  }

  /**
   * Get an event in a date range.
   * @param {String} start start date
   * @param {String} end end date
   * @param {String} uid_filter user id to filter by (the user assigned)
   * @param {Array} bounds not implemented
   */
  async function getEventsFromRangeAsync (start, end, uid_filter, bounds) {
    var query = {
      start: {
        $gte: moment(start).toDate(),
        $lte: moment(end).toDate()
      }
    }
    if (uid_filter !== null) {
      query['user_id'] = { $eq: uid_filter }
    }
    const results = await db.collection('events').find(query).toArray()
    return await filterResults(results, 'event', 'incoming')
  }

  /**
   * Enable timstamps.
   * @param {Boolean} val enable / disable.
   */
  this.setTimestamp = (val) => {
    set_timestamp = val
  }

  /**
   * Set the timezone for timestamps.
   * @param {String} val timezone to use
   */
  this.setTimezone = (val) => {
    timezone = val
  }

  /**
   * Open database. Must be done before calling other functions.
   * @param {String} username the database username
   * @param {String} password the database password
   * @param {String} host the database host
   */
  this.initAsync = async (username, password, host) => {
    if (username && password && host) {
      url = `mongodb://${username}:${password}@${host}`
      moment.tz.setDefault(timezone)
      try {
        db = await MongoClient.connect(url)
        console.log("> Connected to server. Zone: " + timezone + ' Time: ' + moment().format())
        const items = await db.listCollections().toArray()
        if (items.length === 0) {
          await db.createCollection("clients")
          await db.createCollection("events")
          await db.createCollection("users")
          await db.createCollection("profiles")
          return Message.success("Database ready", null, "Initialized collections")
        } else {
          return Message.success("Database ready", null, "Collections exist")
        }
      } catch (err) {
        return Message.error('Error initializing the database', err.message)
      }
    } else {
      return Message.error('Credentials not set')
    }
  }

  /**
   * Close databse.
   */
  this.endAsync = async () => {
    if (isValid()) {
      try {
        await db.close(true)
        return Message.success("Ended remote connection")
      } catch (err) {
        return Message.error('Error closing the database', err.message)
      }
    }
  }

  /**
   * Get all data.
   * @param {Object} options { last_update, event_uid_filter, event_start, event_end }
   */
  this.syncAsync = async (options) => {
    if (isValid()) {
      // Get Bounds
      const bounds = {
        lower_bound: (options.last_update === null) ? moment(0).toDate() : moment(options.last_update).toDate(),
        upper_bound: moment().toDate()
      }
      const return_obj = {
        last_update: bounds.upper_bound
      }
      const event_uid_filter = options.event_uid_filter || null

      try {
        return_obj['clients'] = await getClientsAsync(bounds)
        return_obj['events'] = await getEventsFromRangeAsync(options.event_start, options.event_end, event_uid_filter, bounds)
        return_obj['users'] = await getUsersAsync(bounds)
        return_obj['profiles'] = await getProfilesAsync(bounds)
        return Message.success('Synced', return_obj)
      } catch (err) {
        return Message.error('Could not sync', err.message)
      }
    }
  }

  /**
   * Adding an item to a collection
   * @param {String} type colletion name
   * @param {object} item item data
   */
  this.addAsync = async (type, item) => {
    if (isValid()) {
      try {
        const collection = actions[type].collection
        const preparedItem = await filterResults(deepCopy(item), actions[type].filter, 'outgoing')
        await db.collection(collection).save(preparedItem)
        return Message.success(`Added ${type}`)
      } catch (err) {
        return Message.error(`Could not add ${type}`, err.message)
      }
    }
  }

  /**
   * Delete from a collection.
   * @param {String} type colletion name
   * @param {String} id item id
   * @param {String} options for event uid filter
   */
  this.deleteAsync = async (type, id, options) => {
    if (isValid()) {
      try {
        const collection = actions[type].collection
        let query = { _id: { $eq: id } }
        // TODO - event specific - this could be neater.
        if (type === 'event' && options.uidFilter) {
          query['user_id'] = { $eq: uid_filter }
        }
        await db.collection(collection).remove(query)
        return Message.success(`Deleted ${type}`)
      } catch (err) {
        return Message.error(`Could not delete ${type}`, err.message)
      }
    }
  }

  /**
   * Get an item from a collection.
   * @param {String} type colletion name
   * @param {String} id item id
   * @param {Array} bounds not implemented
   */
  this.getAsync = async (type, id, bounds) => {
    if (isValid()) {
      try {
        const collection = actions[type].collection
        const results = await db.collection(collection).find({_id:{$eq:id}}).toArray()
        return Message.success(`Got ${type}`, await filterResults(results, actions[type].filter, 'incoming'))
      } catch (err) {
        return Message.error(`Could not get ${type}`, err.message)
      }
    }
  }

  /**
   * Get user from an email address.
   * Caution using as it returns passwords.
   * @param {String} email user email address
   * @param {Array} bounds not implemented
   */
  this.getUserFromEmailAsync = async (email, bounds) => {
    if (isValid()) {
      try {
        const results = await db.collection('users').find({email: email}).toArray()
        return Message.success('Got users', await filterResults(results, 'user_full', 'incoming'))
      } catch (err) {
        return Message.error('Could not get users', err.message)
      }
    }
  }

  /**
   * Set a user password.
   * @param {String} id user id
   * @param {String} password
   */
  this.setUserPassword = async (id, password) => {
    if (isValid()) {
      try {
        await db.collection('users').update({_id: id}, {$set: {password: password}})
        return Message.success('Set password')
      } catch (err) {
        return Message.error('Could not set password', err.message)
      }
    }
  }

  /**
   * Import database.
   * @param {Object} data include { clients, events, users, profiles }
   * @param {Object} options include boolean for { clear_data, import_clients, import_events, import_users, import_profiles }
   */
  this.importAsync = async (data, options) => {
    if (options == null) {
      options = { clear_data: true, import_clients: true, import_events: true, import_users: true, import_profiles: true }
    }
    if (isValid()) {
      try {
        if (options.clear_data) {
          await this.clearAsync()
        }
        if (options.import_clients && data.clients) {
          await db.collection('clients').insert(await cleanCollection(data.clients, 'client', 'outgoing'))
        }
        if (options.import_events && data.events) {
          await db.collection('events').insert(await cleanCollection(data.events, 'event', 'outgoing'))
        }
        if (options.import_users && data.users) {
          await db.collection('users').insert(await cleanCollection(data.users, 'user', 'outgoing'))
        }
        if (options.import_profiles && data.profiles) {
          await db.collection('profiles').insert(await cleanCollection(data.profiles, 'profile', 'outgoing'))
        }
        return Message.success('Imported data')
      } catch (err) {
        return Message.error('Could not import data', err.message)
      }
    }
  }

  /**
   * Export database.
   * @param {Boolean} full include passwords.
   */
  this.exportAsync = async (full) => {
    if (isValid()) {
      try {
        const clients = await db.collection('clients').find().toArray()
        const users = await db.collection('users').find().toArray()
        const events = await db.collection('events').find().toArray()
        const profiles = await db.collection('profiles').find().toArray()
        return Message.success('Exported data', {
          'exported': moment().toDate(),
          'clients': await cleanCollection(clients, 'client', 'incoming'),
          'users': await cleanCollection(users, (full ? 'user_full' : 'user'), 'incoming'),
          'events': await cleanCollection(events, 'event', 'incoming'),
          'profiles': await cleanCollection(profiles, 'profile', 'incoming'),
        })
      } catch (err) {
        return Message.error('Could not export data', err.message)
      }
    }
  }

  /**
   * Clear all databases.
   */
  this.clearAsync = async () => {
    if (isValid()) {
      try {
        await db.collection('clients').remove()
        await db.collection('events').remove()
        await db.collection('users').remove()
        await db.collection('profiles').remove()
        return Message.success('Cleared clients, events, users, profiles collections')
      } catch (err) {
        return Message.error('Could not clear data', err.message)
      }
    }
  }
}
