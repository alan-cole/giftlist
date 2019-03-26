const express = require('express')
const bodyParser = require('body-parser')
const db_api = require('./lib/api/api')
const db_auth = require('./lib/auth/auth')
const db_setup = require('./lib/db/setup')

module.exports = {
  listen (app) {
    app.listen(app.get('port'), () => {
      const port = app.get('port')
      console.log('> Listening at http://localhost:%s', port)
    })
  },

  initRouting (app, config) {
    app.get('/', function(req, res) {
      res.sendFile('index.html', {root: 'build'})
    })

    app.get('/*', function(req, res) {
      var path = req.params[0];
      res.sendFile(path, {root: 'build'})
    })
    
    app.post('/api', function(req, res) {
      api.handleRequest(req, res)
    })
    
    app.post('/login', async (req, res) => {
      const result = await auth.authenticateRequest(req)
      res.json(result)
    })
    
    app.post('/setpassword', async (req, res) => {
      const result = await auth.setPasswordRequest(req)
      res.json(result)
    })
  },

  async start (config) {
    const app = express()

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json({limit: '5mb'}))
    app.set('port', (process.env.PORT || 3000))

    this.initRouting(app, config)

    // Connect to DB.
    const username = config.database.username
    const password = config.database.password
    const host     = config.database.host
    const url      = `mongodb://${username}:${password}@${host}`
    const MongoClient = require('mongodb').MongoClient
    let db = null

    try {
      db = await MongoClient.connect(url)
    } catch (err) {
      console.log('! Failed to connect to DB')
    }

    // Check for existing content.
    const items = await db.listCollections().toArray()
    if (items.length === 0) {
      console.log('> Initialising db')
      await db_setup.start(db, config)
    }
    console.log('> Connected to db')
    db_auth.init(db, config)
    db_api.init(db, config)
    this.listen(app)
  }
}
