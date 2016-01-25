/**
 * CLI output logic
 * @module src/output
 */
'use strict'

const Table = require('cli-table')
const clc = require('cli-color')
const clear = require('cli-clear')
const numeral = require('numeral')

class Output {
  constructor (expressions) {
    this._expressions = expressions
  }

  /**
   * Clear previous terminal output and output tabular information
   */
  refresh () {
    const table = new Table({
      head: ['ID', 'OperandA', 'Operation', 'OperandB', 'Result', 'Duration (ms)']
    })
    table.push(...this._expressions.toArray().map(this._getRowFromExpression.bind(this)))
    clear()
    console.log([
      'Generating expressions... (showing last 10)',
      table.toString()
    ].join('\n'))
  }

  /**
   * @param {Object} expression
   * @returns String[]
   */
  _getRowFromExpression (expression) {
    const duration = (expression.completed) ?
      (expression.completed - expression.created) :
      '...'
    const row = [
      expression.index,
      numeral(expression.operandA).format('0,0'),
      expression.operation,
      numeral(expression.operandB).format('0,0'),
      numeral(expression.result).format('0,0'),
      duration
    ]
    row[1] = this._colorizeValueBySign(row[1])
    row[3] = this._colorizeValueBySign(row[3])
    row[4] = this._colorizeValueBySign(row[4])
    return row
  }

  /**
   *
   */
  _colorizeValueBySign (numericStringVal) {
    return (numericStringVal[0] === '-') ?
      clc.red(numericStringVal) :
      clc.green(numericStringVal)
  }
}

module.exports = Output
