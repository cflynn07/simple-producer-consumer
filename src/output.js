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
      expression.operandA,
      expression.operation,
      expression.operandB,
      expression.result,
      duration
    ]
    const defaultNumFormat = '0,0.00'
    for (let index of [1, 3]) {
      row[index] = this._colorizeValueBySign(
        numeral(row[index]).format(defaultNumFormat)
      )
    }
    row[4] = (expression.completed) ?
      ((/^[-]?[0-9\.]+$/.test(expression.result)) ?
        /* numeric */
        row[4] = this._colorizeValueBySign(
          numeral(row[4]).format(defaultNumFormat)
        ) :
        /* non-numeric */
        expression.result) :
     '' // placeholder
    return row
  }

  /**
   * @param {String} numericStringVal
   * @return String
   */
  _colorizeValueBySign (numericStringVal) {
    return (numericStringVal[0] === '-') ?
      clc.red(numericStringVal) :
      clc.green(numericStringVal)
  }
}

module.exports = Output
