const fs = require('fs')
const Server = require('apiserver')
const GiftListDatabase = require('./server_custom/GiftListDatabase')
const GiftListRequestHandler = require('./server_custom/GiftListRequestHandler')

// Load Local Settings.
var data = fs.readFileSync('./config.json', 'utf-8')
config = JSON.parse(data)

// Initialize DB / Request Handler
const database = new GiftListDatabase(config)
const requestHandler = new GiftListRequestHandler(database, config)

// Start Server
const server = new Server(database, requestHandler, config)
server.start()
