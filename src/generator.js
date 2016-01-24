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

    this.ws.emit('event1', 'some data', (data) => {
      console.log('event1 response', data)
    })
  }
}

module.exports = new Generator()
