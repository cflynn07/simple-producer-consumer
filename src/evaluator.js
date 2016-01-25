/**
 * Processes requests with specified arithmetic operations. Computes the result of each operation
 * and responds
 * @module src/evaluator
 */
'use strict'

const math = require('mathjs')

const Socket = require('./socket')

class Evaluator extends Socket {
  constructor () {
    super()
    this._initWebsocketServer()
    this.wss.on('connection', (ws) => {
      ws.on('expression', this._evaluateExpression.bind(this))
    })
  }

  /**
   *
   */
  _evaluateExpression (expression, cb) {
    const {error, value} = this._validateExpression(expression)
    if (error) { return cb({ error: error }) }
    const evalString = [
      value.operandA,
      value.operandB
    ].join(' ' + value.operation + ' ') // Prevent ex: 500--500
    var evalResult
    try {
      evalResult = math.eval(evalString)
    } catch (e) {
      evalResult = e.message
    }
    cb({
      error: false,
      result: evalResult
    })
  }
}

module.exports = new Evaluator()
