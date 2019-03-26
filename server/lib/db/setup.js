const Message = require('../msg/msg.js')

module.exports = {
  start: async (db, config) => {
    try {
      config.models.forEach(async (model) => {
        await db.createCollection(model.name)
      })
      return Message.success(`Database ready`, null, `Initialized ${config.models.length} collections`)
    } catch (err) {
      return Message.error(`Error initializing the database`, err.message)
    }
  }
}
