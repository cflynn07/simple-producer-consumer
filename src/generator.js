/**
 * Generates random arithmetic operations and makes requests to evaluator
 * @module src/generator
 */
'use strict'

const Promise = require('bluebird')
const TCA = require('tailable-capped-array')
const randomItem = require('random-item')
const times = require('times-loop')

const Base = require('./base')
const Expression = require('./models/expression')
const Output = require('./output')

class Generator extends Base {
  constructor () {
    super()
    this._index = 0

    this._expressions = new TCA(process.env.SPC_EXPRESSION_DISPLAY_COUNT)
    this._output = new Output(this._expressions)

    this._initWebsocketClient()
    this._initGenerator()
  }

  /**
   * Initialize interval with logic to generate and send expressions
   */
  _initGenerator () {
    this.interval = this.interval || setInterval(() => {
      const expression = this._generateExpression()
      this._expressions.push(expression)
      Promise.coroutine(function *() {
        const response = yield this._sendExpression(expression)
        expression.updateWithResponse(response)
        this._output.refresh()
      }.bind(this))()
    }, process.env.SPC_GENERATOR_INTERVAL)
  }

  /**
   * Generate and place arithmetic expressions object
   * @returns object
   *   - operandA
   *   - operation
   *   - operandB
   */
  _generateExpression () {
    const operandMin = -99999
    const operandMax = 99999

    const opts = {
      index: this._index++,
      operands: [],
      operations: [],
      created: new Date(),
      completed: false,
      result: ''
    }

    const n = Math.floor((Math.random() * 3)) + 2 // [2..5]
    times(n, () => {
      opts.operands.push(
        Math.floor(Math.random() * (operandMax - operandMin + 1)) + operandMin
      )
    })
    times(n - 1, () => {
      opts.operations.push(randomItem(Expression.operations))
    })
    return new Expression(opts)
  }

  /**
   * Send formatted expressions to evaluator
   */
  _sendExpression (expression) {
    return Promise.fromCallback((cb) => {
      this._ws.emit('expression', expression, (data) => {
        if (data.error) {
          return cb(new Error(data.error))
        }
        cb(null, data)
      })
    })
  }
}

module.exports = Generator
