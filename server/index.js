const express = require('express')
const bodyParser = require('body-parser')

const log = require('./lib/log')
const Database = require('./lib/database')
const Authentication = require('./lib/auth')
const RequestHandler = require('./lib/request')

module.exports = {

  auth: null,
  requestHandler: null,

  listen (app) {
    app.listen(app.get('port'), () => {
      const port = app.get('port')
      log(`> Listening at http://localhost:${port}`)
    })
  },

  initRouting (app, config) {
    app.get('/', function(req, res) {
      res.sendFile('index.html', { root: config.server.public })
    })

    app.get('/*', function(req, res) {
      var path = req.params[0];
      res.sendFile(path, { root: config.server.public })
    })
    
    app.post('/login', async (req, res) => {
      const result = await this.auth.login(req)
      res.json(result)
    })
    
    app.post('/changepassword', async (req, res) => {
      const result = await this.auth.changePassword(req)
      res.json(result)
    })

    app.post('/api', function(req, res) {
      this.requestHandler.queueRequest(req, res)
    })
  },

  async start (config) {
    const app = express()

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json({limit: '5mb'}))
    app.set('port', (process.env.PORT || 3000))

    this.initRouting(app, config)

    const database = new Database(config)

    if (await database.start()) {
      this.auth = new Authentication(database, config)
      this.requestHandler = new RequestHandler(database, config)
      this.listen(app)
    } else {
      log('Could not start DB.')
    }
  }
}
