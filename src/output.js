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
      head: ['ID', 'OperandA', 'Operation', 'OperandB', 'Duration (ms)']
    })
    for (let i = Math.max(this._expressions.length - 11, 0),
         len = this._expressions.length; i < len; i++) {
      table.push(this._getRowFromExpression(this._expressions[i]))
    }
    clear()
    console.log(table.toString())
  }

  /**
   * @param {Object} expression
   * @returns String[]
   */
  _getRowFromExpression (expression) {
    const duration = (!expression.completed) ? '%s' :
      (expression.completed - expression.created)
    return [
      expression.index,
      expression.operandA,
      expression.operation,
      expression.operandB,
      duration
    ]
  }
}

module.exports = Output
