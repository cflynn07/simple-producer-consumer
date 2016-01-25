/**
 * Generates random arithmetic operations and makes requests to evaluator
 * @module src/generator
 */
'use strict'

const TCA = require('tailable-capped-array')
const clear = require('cli-clear')
const randomItem = require('random-item')

const Output = require('./output')
const Socket = require('./socket')

class Generator extends Socket {
  constructor () {
    super()

    this._index = 0
    this._operations = [
      '%',
      '*',
      '+',
      '-',
      '%'
    ]

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
      this._sendExpression(expression, () => {
        expression.completed = new Date()
        this._output.refresh()
      })
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
    const expression = {
      index: this._index++,
      operandA: Math.floor(Math.random() * 1000),
      operation: randomItem(this._operations),
      operandB: Math.floor(Math.random() * 1000),
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
