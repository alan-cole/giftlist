const fs = require('fs')
const Server = require('apiserver')
const GiftListDatabase = require('./server_custom/GiftListDatabase')
const GiftListRequestHandler = require('./server_custom/GiftListRequestHandler')

// Load Local Settings.
var data = fs.readFileSync('./server-config.json', 'utf-8')
config = JSON.parse(data)

// Use environment variables if available.
if (process.env.GL_PROD == 1) {
  console.log('Using environment variables')
  config.database.connection = process.env.GL_DB_CONNECTION
  config.database.database = process.env.GL_DB_DATABASE
  config.authentication.secret = process.env.GL_AUTH_SECRET
  config.register.code = process.env.GL_REGISTER_CODE
  config.environment = 'prod'
}

// Initialize DB / Request Handler
const database = new GiftListDatabase(config)
const requestHandler = new GiftListRequestHandler(database, config)

// Start Server
const server = new Server(database, requestHandler, config)
server.start()
