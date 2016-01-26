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
    const wss = this._initWebsocketServer()
    wss.on('connection', (ws) => {
      ws.on('expression', this._evaluateExpression.bind(this))
    })
  }

  /**
   *
   */
  _evaluateExpression (data, cb) {
    const expression = new Expression(data)
    // TODO: Patch istanbul to recognize ES6 destructuring assignment
    // const {error} = expression.validate()
    const validateResult = expression.validate()
    if (validateResult.error) {
      log.error({
        err: validateResult.error
      }, '_evaluateExpression validate error')
      return cb({ error: validateResult.error })
    }
    const expressionString = expression.getExpressionString(false)
    var evalResult
    try {
      evalResult = math.eval(expressionString)
    } catch (e) {
      evalResult = e.message
    }
    log.trace({
      evalResult: evalResult,
      expressionString: expressionString
    }, 'evalResult')
    cb({
      error: false,
      result: evalResult
    })
  }
}

module.exports = Evaluator
