const fs = require('fs')
const Server = require('apiserver')
const GiftListDatabase = require('./server_custom/GiftListDatabase')
const GiftListRequestHandler = require('./server_custom/GiftListRequestHandler')

// Load Local Settings.
var data = fs.readFileSync('./config.json', 'utf-8')
config = JSON.parse(data)

// Use environment variables if available.
if (process.env.GL_PROD == 1) {
  console.log('Using environment variables')
  config.database.username = process.env.GL_USERNAME
  config.database.password = process.env.GL_PASSWORD
  config.database.host = process.env.GL_HOST
  config.database.database = process.env.GL_DATABASE
  config.authentication.secret = process.env.GL_AUTH_SECRET
}

// Initialize DB / Request Handler
const database = new GiftListDatabase(config)
const requestHandler = new GiftListRequestHandler(database, config)

// Start Server
const server = new Server(database, requestHandler, config)
server.start()
