const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const Message = require('./msg')

module.exports = class Database {

  constructor (config) {
    this.db = null
    this.config = config
  }

  /**
   * Start the database.
   */
  async start () {
    if (this.db == null) {
      const { username, password, host, database } = this.config.database
      const url = `mongodb://${username}:${password}@${host}/${database}`

      try {
        const client = new MongoClient(url)
        await client.connect()
        this.db = client.db(database)
        // Check for existing content.
        const items = await this.db.listCollections().toArray()
        if (items.length === 0) {
          await this.create()
        }
        return Message.success(`Database ready`)
      } catch (err) {
        return Message.error(`Failed to connect to database`, err.message)
      }
    } else {
      return Message.error(`Database already initialized`)
    }
  }

  /**
   * Create the collections based on config.models.
   */
  async create () {
    try {
      this.config.models.forEach(async (model) => {
        await this.db.createCollection(model.name)
      })
      return Message.success(`Database ready`, null, `Initialized ${this.config.models.length} collections`)
    } catch (err) {
      return Message.error(`Error initializing the database`, err.message)
    }
  }

  /**
   * Destroy the collections based on config.models.
   */
  async destroy () {
    try {
      this.config.models.forEach(async (model) => {
        await this.db.collection(model.name).remove()
      })
      return Message.success(`Database destroyed`, null, `Destroyed ${this.config.models.length} collections`)
    } catch (err) {
      return Message.error(`Error destroying the database`, err.message)
    }
  }

  /**
   * Add an item to a collection.
   * @param {String} collection Name of collection
   * @param {Object} item Prepared item (filters already applied)
   */
  async add (collection, item) {
    try {
      await this.db.collection(collection).insertOne(item)
      return Message.success(`Added ${collection}`)
    } catch (err) {
      return Message.error(`Could not add ${collection}`, err.message)
    }
  }

  /**
   * Delete from a collection.
   * @param {String} collection Name of collection
   * @param {String} id ID of item to delete
   */
  async delete (collection, id) {
    try {
      await this.db.collection(collection).deleteOne({ _id: { $eq: ObjectId(id) } })
      return Message.success(`Deleted ${collection}`)
    } catch (err) {
      return Message.error(`Could not delete ${collection}`, err.message)
    }
  }

  /**
   * Get an item from a collection.
   * @param {String} collection Name of collection
   * @param {String} id ID of item to delete
   */
  async get (collection, id) {
    try {
      const results = await this.db.collection(collection).find({ _id: { $eq: ObjectId(id) } }).toArray()
      return Message.success(`Got ${collection}`, results)
    } catch (err) {
      return Message.error(`Could not get ${collection}`, err.message)
    }
  }

  /**
   * Find all items from a query.
   * @param {String} collection Name of collection
   * @param {Array} ids Array of ids
   */
  async getAll (collection, ids) {
    try {
      const results = await this.db.collection(collection).find({ _id: { $in: ids.map(id => ObjectId(id)) }}).toArray()
      return Message.success(`Found ${collection}`, results)
    } catch (err) {
      return Message.error(`Could not find ${collection}`, err.message)
    }
  }

  /**
   * Find an item from a query.
   * @param {String} collection Name of collection
   * @param {Object} query Criteria for finding items
   */
  async find (collection, query) {
    try {
      const results = await this.db.collection(collection).find(query).toArray()
      return Message.success(`Found ${collection}`, results)
    } catch (err) {
      return Message.error(`Could not find ${collection}`, err.message)
    }
  }

  /**
   * Update an existing item.
   * @param {String} collection Name of collection
   * @param {String} id ID of item to update
   * @param {Object} fields { field: value }
   */
  async update (collection, id, fields) {
    try {
      await this.db.collection(collection).update({ _id: { $eq: ObjectId(id) } }, { $set: fields })
      return Message.success(`Updated ${collection}`)
    } catch (err) {
      return Message.error(`Could not update ${collection}`, err.message)
    }
  }
}
