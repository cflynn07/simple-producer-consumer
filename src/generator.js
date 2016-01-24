/**
 * Generates random arithmetic operations and makes requests to evaluator
 * @module src/generator
 */
'use strict'

const Socket = require('./socket')

class Generator extends Socket {
  constructor () {
    super()

    this._initWebsocketClient()

    this.ws.on('open', () => {
      console.log('open!')
      this.ws.send('sent message')
    })

    this.ws.on('close', () => {
      console.log('close!')
    })

    this.ws.on('message', () => {
      console.log('message!')
    })
  }
}

module.exports = new Generator()
