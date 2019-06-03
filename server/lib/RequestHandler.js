const Message = require('./msg')
const log = require('./log')

module.exports = class RequestHandler {

  /**
   * Create a new request handler.
   */
  constructor () {
    this.queue = []
    this.digesting = false
  }

  /**
   * Add a new request to the queue and process.
   * @param {Object} req Request
   * @param {Object} res Resolve
   */
  queueRequest (req, res) {
    log("✉ Adding request to queue")
    this.queue.push({req: req, res: res})
    if (!this.digesting) {
      log("⚙ Trigger Digest")
      this.digestRequestQueue()
    }
  }

  /**
   * Will process the queue. Does not need to be invoked manually.
   */
  async digestRequestQueue() {
    this.digesting = (this.queue.length > 0)

    if (this.digesting) {
      const { req, res } = this.queue.shift()

      try {
        res.json(await this.processRequest(req.body))
        log("✓ Completed Request")
      } catch (err) {
        console.log(err)
        res.json(Message.error('Error', '⚠ An error occurred', err.message))
      }

      this.digestRequestQueue()
    }
  }

  /**
   * Perform request. This should be extended.
   * @param {Object} requestBody
   */
  async processRequest (requestBody) {
    return { message: 'Default RequestHandler response.' }
  }
}
