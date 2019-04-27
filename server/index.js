const express = require('express')
const bodyParser = require('body-parser')

const log = require('./lib/log')
const Database = require('./lib/Database')
const RequestHandler = require('./lib/RequestHandler')

module.exports = class Server {

  /**
   * Create a server.
   * @param {Database} database 
   * @param {RequestHandler} requestHandler 
   * @param {Object} config 
   */
  constructor (database, requestHandler, config) {
    this.database = database
    this.requestHandler = requestHandler
    this.config = config

    this.app = express()
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json({limit: '5mb'}))
    this.app.set('port', (process.env.PORT || 3000))
  }

  /**
   * Open up the port for incoming requests.
   */
  listen () {
    this.app.listen(this.app.get('port'), () => {
      const port = this.app.get('port')
      log(`> Listening at http://localhost:${port}`)
    })
  }

  /**
   * Configure the routing for requests.
   */
  initRouting () {
    this.app.get('/', (req, res) => {
      res.sendFile('index.html', { root: this.config.server.public })
    })

    this.app.get('/*', (req, res) => {
      var path = req.params[0];
      res.sendFile(path, { root: this.config.server.public })
    })

    this.app.post('/api', (req, res) => {
      this.requestHandler.queueRequest(req, res)
    })
  }

  /**
   * Start the server.
   */
  async start () {
    this.initRouting()
    if (await this.database.start()) {
      this.listen(this.app)
    } else {
      log('Could not start DB.')
    }
  }
}
