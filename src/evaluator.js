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
      ws.on('expression', (expression, cb) => {
        this._evaluateExpression(expression)
        cb('hello')
      })
    })
  }

  /**
   *
   */
  _evaluateExpression ({ operation=false }) {
    console.log(arguments)
    if (!operation) {
      console.log('error')
    }
    switch (operator) {
      case '%':
        break;
      case '*':
        break;
      case '+':
        break;
      case '-':
        break;
    }
  }
}

module.exports = new Evaluator()
