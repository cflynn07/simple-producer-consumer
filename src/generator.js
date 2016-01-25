/**
 * Generates random arithmetic operations and makes requests to evaluator
 * @module src/generator
 */
'use strict'

const clear = require('cli-clear')

const Output = require('./output')
const Socket = require('./socket')

class Generator extends Socket {
  constructor () {
    super()
    const expressions = []
    this._expressions = expressions
    this._output = new Output(expressions)

    this._initWebsocketClient()
    this._initGenerator()
  }

  /**
   * Initialize interval with logic to generate and send expressions
   */
  _initGenerator () {
    this.interval = this.interval || setInterval(() => {
      const expression = this._generateExpression()
      this._output.refresh()
      this._sendExpression(expression, () => {
        expression.completed = new Date()
        this._output.refresh()
      })
    }, 1000)
  }

  /**
   * Generate and place arithmetic expressions object
   * @returns object
   *   - operandA
   *   - operation
   *   - operandB
   */
  _generateExpression () {
    const expression = {
      index: this._expressions.length,
      operandA: 1,
      operation: '/',
      operandB: 2,
      created: new Date(),
      completed: false
    }
    this._expressions.push(expression)
    return expression
  }

  /**
   * Send formatted expressions to evaluator
   */
  _sendExpression (expression, cb) {
    this.ws.emit('expression', expression, cb)
  }
}

module.exports = new Generator()
