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
  config.sitename = process.env.GL_SITENAME
  config.origin = process.env.GL_ORIGIN
  config.database.connection = process.env.GL_DB_CONNECTION
  config.database.database = process.env.GL_DB_DATABASE
  config.authentication.secret = process.env.GL_AUTH_SECRET
  config.register.code = process.env.GL_REGISTER_CODE
  config.mail.host = process.env.GL_MAIL_HOST
  config.mail.port = process.env.GL_MAIL_PORT
  config.mail.secure = (process.env.GL_MAIL_SECURE === '1')
  config.mail.auth.user = process.env.GL_MAIL_AUTH_USER
  config.mail.auth.pass = process.env.GL_MAIL_AUTH_PASS
  config.mail.from = process.env.GL_MAIL_FROM
  config.environment = 'prod'
}

// Initialize DB / Request Handler
const database = new GiftListDatabase(config)
const requestHandler = new GiftListRequestHandler(database, config)

// Start Server
const server = new Server(database, requestHandler, config)
server.start()
