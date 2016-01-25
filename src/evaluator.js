/**
 * Processes requests with specified arithmetic operations. Computes the result of each operation
 * and responds
 * @module src/evaluator
 */
'use strict'

const math = require('mathjs')

const Base = require('./base')
const Expression = require('./models/expression')
const log = require('./logger')(__filename)

class Evaluator extends Base {
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
  _evaluateExpression (data, cb) {
    const expression = new Expression(data)
    const {error, value} = expression.validate()
    if (error) {
      log.error({
        err: error
      }, '_evaluateExpression validate error')
      return cb({ error: error })
    }
    var evalResult
    try {
      evalResult = math.eval(expression.getExpressionString(false))
    } catch (e) {
      evalResult = e.message
    }
    log.trace({
      evalResult: evalResult
    }, 'evalResult')
    cb({
      error: false,
      result: evalResult
    })
  }
}

module.exports = new Evaluator()
