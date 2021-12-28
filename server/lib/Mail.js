const nodemailer = require('nodemailer')
const Message = require('./msg')

module.exports = class Mail {

  constructor (config) {
    this.config = config
    console.log(this.config)
    this.transporter = nodemailer.createTransport(this.config.mail)
  }

  /**
   * Send an email.
   * @param {String} message
   * @param {String} email
   */
  async send (email, subject, message) {
    try {
      const info = await this.transporter.sendMail({
        from: this.config.mail.from,
        to: email,
        subject: subject,
        text: message
      })
      return Message.success(`Email sent to: ${email}`, info)
    }
    catch (e) {
      console.log(e)
      return Message.error('Access denied')
    }
  }
}
