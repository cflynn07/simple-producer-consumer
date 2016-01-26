/**
 *
 * @module src/models/expression
 */
'use strict'

const Joi = require('joi')
const clc = require('cli-color')
const keypather = require('keypather')()
const numeral = require('numeral')

class Expression {
  constructor (attrs) {
    this._attrs = attrs
    const operandsLength = keypather.get(attrs, 'operands.length') || 1
    this._schema = Joi.object().keys({
      index: Joi.number().integer(),
      operands: Joi
        .array()
        .items(Joi.number().integer())
        .length(operandsLength),
      operations: Joi
        .array()
        .items(Joi.any().valid(Expression.operations))
        .length(operandsLength - 1),
      created: Joi.date(),
      completed: Joi.any(),
      result: Joi.any()
    })
    Object.freeze(this._schema)
  }

  /**
   *
   */
  validate () {
    return Joi.validate(this._attrs, this._schema)
  }

  /**
   * Produce an expression string from this object's data
   * Optionally format to colorize
   * @param {Boolean} colorize
   * @return String
   */
  getExpressionString (colorize) {
    const expressionStringArray = []
    for (let i = 0, len = this._attrs.operands.length; i < len; i++) {
      expressionStringArray.push(
        (colorize) ? this._colorizeValueBySign(this._attrs.operands[i]) : this._attrs.operands[i]
      )
      if (this._attrs.operations[i]) {
        expressionStringArray.push(this._attrs.operations[i])
      }
    }
    return expressionStringArray.join(' ')
  }

  /**
   * return _attrs
   * @return Object
   */
  toJSON () {
    return this._attrs
  }

  /**
   * Update instance data with response
   * @param {Object} response
   */
  updateWithResponse (response) {
    this._attrs.completed = new Date()
    this._attrs.result = (response.error)
      ? response.error
      : (/^[-]?[0-9\.]+$/.test(response.result))
        ? this._colorizeValueBySign(response.result) // numeric
        : response.result // non-numeric
  }

  /**
   * Returns array representing this Expression in a table
   * @returns {Array}
   */
  getOutputRow () {
    const duration = (this._attrs.completed)
      ? (this._attrs.completed - this._attrs.created)
      : '...'
    const row = [
      this._attrs.index,
      this.getExpressionString(),
      this._attrs.result,
      duration
    ]
    return row
  }

  /**
   * @param {Number} num
   * @return String
   */
  _colorizeValueBySign (num) {
    const numString = numeral(num).format('0,0')
    return (numString [0] === '-')
      ? clc.red(numString)
      : clc.green(numString)
  }
}

Expression.operations = [
  '%',
  '*',
  '+',
  '-',
  '/'
]

module.exports = Expression
