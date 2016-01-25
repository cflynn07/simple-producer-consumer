/**
 * Generates random arithmetic operations and makes requests to evaluator
 * @module src/generator
 */
'use strict'

const Promise = require('bluebird')
const TCA = require('tailable-capped-array')
const clear = require('cli-clear')
const randomItem = require('random-item')

const Output = require('./output')
const Socket = require('./socket')

class Generator extends Socket {
  constructor () {
    super()
    this._index = 0

    this._expressions = new TCA(10)
    this._output = new Output(this._expressions)

    this._expressions.createReadStream().on('data', () => {
      this._output.refresh()
    })

    this._initWebsocketClient()
    this._initGenerator()
  }

  /**
   * Initialize interval with logic to generate and send expressions
   */
  _initGenerator () {
    this.interval = this.interval || setInterval(() => {
      const expression = this._generateExpression()
      Promise.coroutine(function *() {
        const result = yield this._sendExpression(expression)
        this._updateExpressionCompleted(expression, result)
        this._output.refresh()
      }.bind(this))()
    }, 150)
  }

  /**
   * Generate and place arithmetic expressions object
   * @returns object
   *   - operandA
   *   - operation
   *   - operandB
   */
  _generateExpression () {
    const operandMin = -1000
    const operandMax = 1000
    const expression = {
      index: this._index++,
      operandA: Math.floor(Math.random() * (operandMax - operandMin + 1)) + operandMin,
      operation: randomItem(this._operations),
      operandB: Math.floor(Math.random() * (operandMax - operandMin + 1)) + operandMin,
      created: new Date(),
      completed: false,
      result: ''
    }
    this._expressions.push(expression)
    return expression
  }

  /**
   * Send formatted expressions to evaluator
   */
  _sendExpression (expression) {
    return Promise.fromCallback((cb) => {
      this.ws.emit('expression', expression, (data) => {
        if (data.error) {
          return cb(new Error(data.error))
        }
        cb(null, data)
      })
    })
  }

  /**
   *
   */
  _updateExpressionCompleted (expression, response) {
    expression.completed = new Date()
    expression.result = (response.error) ? response.error : response.result
  }
}

module.exports = new Generator()
