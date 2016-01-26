/**
 * @module src/evaluator_test
 */
'use strict'

const test = require('unit.js')

const Base = require('./base')
const Evaluator = require('./evaluator')

const sinon = test.sinon

describe('src/evaluator', () => {
  var evaluator
  var wsServerStub
  var wsSocketStub

  beforeEach(() => {
    wsSocketStub = {
      on: sinon.stub()
    }
    wsServerStub = {
      on: sinon.stub().yields(wsSocketStub)
    }
    test.stub(Base.prototype, '_initWebsocketServer').returns(wsServerStub)
    evaluator = new Evaluator()
  })

  afterEach(() => {
    Base.prototype._initWebsocketServer.restore()
  })

  it('load', () => {
    test.function(Evaluator).hasName('Evaluator')
    test.object(evaluator).isInstanceOf(Evaluator)
  })

  describe('Evaluator constructor', () => {
    it('should initialize websocket server and bind to events', () => {
      sinon.assert.calledOnce(Base.prototype._initWebsocketServer)
      sinon.assert.calledOnce(wsServerStub.on)
      sinon.assert.calledWith(wsServerStub.on, 'connection')
      sinon.assert.calledWith(
        wsSocketStub.on,
        'expression',
        sinon.match.func
      )
    })
  })

  describe('Evaluator.prototype._evaluateExpression', () => {
    it('should respond with validation error if Expression invalid', () => {
      const stub = sinon.stub()
      evaluator._evaluateExpression({ invalid: 'invalid' }, stub)
      sinon.assert.calledOnce(stub)
      sinon.assert.calledWith(
        stub,
        sinon.match.has('error', sinon.match.has('message', '"invalid" is not allowed'))
      )
    })

    it('should respond with math.js error if throws', () => {
      const stub = sinon.stub()
      evaluator._evaluateExpression({
        index: 555,
        operands: [9999, -4],
        operations: ['%'],
        created: new Date(),
        completed: false,
        result: ''
      }, stub)
      sinon.assert.calledOnce(stub)
      sinon.assert.calledWith(stub, {
        error: false,
        result: 'Cannot calculate mod for a negative divisor'
      })
    })

    it('should instantiate an Expression, evaluate, and respond', () => {
      const stub = sinon.stub()
      evaluator._evaluateExpression({
        index: 555,
        operands: [5, 10],
        operations: ['*'],
        created: new Date(),
        completed: false,
        result: ''
      }, stub)
      sinon.assert.calledOnce(stub)
      sinon.assert.calledWith(stub, {
        error: false,
        result: 50
      })
    })
  })
})
