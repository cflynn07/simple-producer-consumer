/**
 * CLI output logic
 * @module src/output
 */
'use strict'

const Table = require('cli-table')
const clear = require('cli-clear')

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
    table.push(...this._expressions.toArray().map(this._getRowFromExpression))
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
    return [
      expression.index,
      expression.operandA,
      expression.operation,
      expression.operandB,
      expression.result,
      duration
    ]
  }
}

module.exports = Output
