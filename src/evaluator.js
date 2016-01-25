/**
 * Processes requests with specified arithmetic operations. Computes the result of each operation
 * and responds
 * @module src/evaluator
 */
'use strict'

const Socket = require('./socket')

class Evaluator extends Socket {
  constructor () {
    super()

    this._initWebsocketServer()

    this.wss.on('connection', (ws) => {
      console.log('connection')
      ws.on('expression', (data, cb) => {
        console.log('data', data)
        cb('hello')
      })
    })
  }

}

module.exports = new Evaluator()
