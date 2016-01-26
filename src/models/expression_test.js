/**
 * @module src/models/expression_test
 */
'use strict'

const clc = require('cli-color')
const test = require('unit.js')

const Expression = require('./expression')

const sinon = test.sinon

describe('src/models/expression', () => {
  var expression

  beforeEach(() => {
    expression = new Expression({
      index: 555,
      operands: [1, 2, 3],
      operations: ['%', '%'],
      created: new Date(),
      completed: false,
      result: ''
    })
  })

  it('load', () => {
    test.function(Expression).hasName('Expression')
    test.object(expression).isInstanceOf(Expression)
    test.array(Expression.operations).hasLength(5)
    test.array(Expression.operations).hasValues([
      '%',
      '*',
      '+',
      '-',
      '/'
    ])
  })

  describe('Expression.prototype.validate', () => {
    const validExpression = new Expression({
      index: 555,
      operands: [1, 2, 3],
      operations: ['%', '%'],
      created: new Date(),
      completed: false,
      result: ''
    })
    const invalidExpression = new Expression({
      index: 555,
      operands: [1, 2, 3],
      operations: ['%', '%', '*'], // too many
      created: new Date(),
      completed: false,
      result: ''
    })
    const validResult = validExpression.validate()
    const invalidResult = invalidExpression.validate()
    test.object(validResult).match({
      valid: true
    })
    test.object(invalidResult).match({
      valid: false
    })
  })

  describe('Expression.prototype.getExpressionString', () => {
    beforeEach(() => {
      sinon.stub(expression, '_colorizeValueBySign').returns('-stub string-')
    })

    afterEach(() => {
      expression._colorizeValueBySign.restore()
    })

    it('should return non-colorized string by default', () => {
      const string = expression.getExpressionString()
      sinon.assert.notCalled(expression._colorizeValueBySign)
      test.string(string).is('1 % 2 % 3')
    })

    it('should return colorized string if passed true', () => {
      const string = expression.getExpressionString(true)
      sinon.assert.calledThrice(expression._colorizeValueBySign)
      sinon.assert.calledWith(expression._colorizeValueBySign, 1)
      sinon.assert.calledWith(expression._colorizeValueBySign, 2)
      sinon.assert.calledWith(expression._colorizeValueBySign, 3)
      test.string(string).is([
        '-stub string-',
        '-stub string-',
        '-stub string-'
      ].join(' % '))
    })
  })

  describe('Expression.prototype.toJSON', () => {
    it('should return _attrs', () => {
      test.object(expression.toJSON()).is(expression._attrs)
    })
  })

  describe('Expression.prototype.updateWithResponse', () => {
    beforeEach(() => {
      sinon.stub(expression, '_colorizeValueBySign').returns('-stub string-')
    })

    afterEach(() => {
      expression._colorizeValueBySign.restore()
    })

    it('should update with error', () => {
      expression.updateWithResponse({
        error: 'some error'
      })
      test.object(expression.toJSON().completed).isInstanceOf(Date)
      test.string(expression.toJSON().result).is('some error')
      sinon.assert.notCalled(expression._colorizeValueBySign)
    })

    it('should update with non-error, numeric response', () => {
      expression._colorizeValueBySign.returns('55')
      expression.updateWithResponse({
        error: false,
        result: '55'
      })
      test.object(expression.toJSON().completed).isInstanceOf(Date)
      test.string(expression.toJSON().result).is('55')
      sinon.assert.calledOnce(expression._colorizeValueBySign, '55')
    })

    it('should update with non-error, non-numeric response', () => {
      expression.updateWithResponse({
        error: false,
        result: 'some non-numeric response'
      })
      test.object(expression.toJSON().completed).isInstanceOf(Date)
      test.string(expression.toJSON().result).is('some non-numeric response')
      sinon.assert.notCalled(expression._colorizeValueBySign)
    })
  })

  describe('Expression.prototype.getOutputRow', () => {
    beforeEach(() => {
      sinon.stub(Expression.prototype, 'getExpressionString').returns('-stubbed method-')
    })

    afterEach(() => {
      Expression.prototype.getExpressionString.restore()
    })

    it('should return an array', () => {
      const completedExpression = new Expression({
        index: 5,
        result: '123',
        created: new Date(0),
        completed: new Date(1000)
      })
      const completedResult = completedExpression.getOutputRow()
      test.array(completedResult).hasValues([
        5,
        '-stubbed method-',
        '123',
        1000
      ])

      const notCompletedExpression = new Expression({
        index: 5,
        result: '',
        created: new Date(0),
        completed: false
      })
      const notCompletedResult = notCompletedExpression.getOutputRow()
      test.array(notCompletedResult).hasValues([
        5,
        '-stubbed method-',
        '',
        '...'
      ])
    })
  })

  describe('Expression.prototype._colorizeValueBySign', () => {
    it('should colorize negative number red', () => {
      const result = expression._colorizeValueBySign(-5)
      test.string(result).is(clc.red('-5'))
    })

    it('should colorize positive number green', () => {
      const result = expression._colorizeValueBySign(5)
      test.string(result).is(clc.green('5'))
    })
  })
})
