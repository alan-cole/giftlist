const Database = require('apiserver/lib/Database')
const Message = require('apiserver/lib/msg')

module.exports = class GiftListDatabase extends Database {

  constructor (config) {
    super(config)
  }

  /**
   * Add an item to a collection for a specific user.
   * Collection must have user field.
   * @param {String} collection Name of collection
   * @param {Object} item Prepared item (filters already applied)
   */
  async addForUser (collection, userId, item) {
    try {
      const preparedItem = Object.assign(item, { user: userId })
      await this.db.collection(collection).insertOne(preparedItem)
      return Message.success(`Added ${collection}`)
    } catch (err) {
      return Message.error(`Could not add ${collection}`, err.message)
    }
  }

  /**
   * Delete from a collection for a specific user.
   * Collection must have user field.
   * @param {String} collection Name of collection
   * @param {String} id ID of item to delete
   * @param {String} userId ID of user
   */
  async deleteForUser (collection, id, userId) {
    try {
      await this.db.collection(collection).deleteOne({ _id: { $eq: this.getId(id) }, user: userId })
      return Message.success(`Deleted ${collection}`)
    } catch (err) {
      return Message.error(`Could not delete ${collection}`, err.message)
    }
  }

  /**
   * Delete all items from a collection for a specific user.
   * Collection must have user field.
   * @param {String} collection Name of collection
   * @param {String} userId ID of user
   */
  async deleteAllForUser (collection, userId) {
    try {
      await this.db.collection(collection).deleteMany({ user: userId })
      return Message.success(`Deleted many on ${collection} for user`)
    } catch (err) {
      return Message.error(`Could not delete many on ${collection}`, err.message)
    }
  }

  /**
   * Delete all items from a collection based on a query.
   * Collection must have user field.
   * @param {String} collection Name of collection
   * @param {String} query Rules to delete on
   */
  async deleteAllByQuery (collection, query) {
    try {
      await this.db.collection(collection).deleteMany(query)
      return Message.success(`Deleted many on ${collection}`)
    } catch (err) {
      return Message.error(`Could not delete many on ${collection}`, err.message)
    }
  }

  /**
   * Update an existing item for a specific user.
   * Collection must have user field.
   * @param {String} collection Name of collection
   * @param {String} id ID of item to update
   * @param {String} userId ID of user
   * @param {Object} fields { field: value }
   */
  async updateForUser (collection, id, userId, fields) {
    try {
      await this.db.collection(collection).updateOne({ _id: { $eq: this.getId(id) }, user: userId }, { $set: fields })
      return Message.success(`Updated ${collection}`)
    } catch (err) {
      return Message.error(`Could not update ${collection}`, err.message)
    }
  }

  /**
   * Find an item from a query for a specific user.
   * Collection must have user field.
   * @param {String} collection Name of collection
   * @param {String} userId ID of user
   * @param {Object} query Criteria for finding items
   */
  async findForUser (collection, userId, query) {
    try {
      const preparedQuery = query ? Object.assign(query, { user: userId }) : { user: userId }
      const results = await this.db.collection(collection).find(preparedQuery).toArray()
      return Message.success(`Found ${collection}`, results)
    } catch (err) {
      return Message.error(`Could not find ${collection}`, err.message)
    }
  }
}
