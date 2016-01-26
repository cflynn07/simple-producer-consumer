/**
 * @module src/generator_test
 */
'use strict'

const test = require('unit.js')

const Base = require('./base')
const Expression = require('./models/expression')
const Generator = require('./generator')

const sinon = test.sinon

describe('src/generator', () => {
  var generator

  beforeEach(() => {
    test.stub(Base.prototype, '_initWebsocketClient')
    test.stub(Generator.prototype, '_initGenerator')
    generator = new Generator()
  })

  afterEach(() => {
    Base.prototype._initWebsocketClient.restore()
    if (Generator.prototype._initGenerator.restore) {
      Generator.prototype._initGenerator.restore()
    }
  })

  it('load', () => {
    test.function(Generator).hasName('Generator')
    test.object(generator).isInstanceOf(Generator)
  })

  describe('Generator constructor', () => {
    it('should initialize websocket client and invoke _initGenerator', () => {
      sinon.assert.calledOnce(Base.prototype._initWebsocketClient)
      sinon.assert.calledOnce(Generator.prototype._initGenerator)
    })
  })

  describe('Generator.prototype._initGenerator', () => {
    var clock
    var mockExpression
    var promiseResolveFn

    beforeEach(() => {
      clock = sinon.useFakeTimers()
      Generator.prototype._initGenerator.restore()
      mockExpression = {
        updateWithResponse: sinon.stub()
      }
      const sendPromise = new Promise((resolve) => {
        promiseResolveFn = resolve
      })
      test.stub(generator, '_generateExpression').returns(mockExpression)
      test.stub(generator, '_sendExpression').returns(sendPromise)
      test.stub(generator._output, 'refresh')
    })

    afterEach(() => {
      clock.restore()
      generator._generateExpression.restore()
      generator._sendExpression.restore()
      generator._output.refresh()
    })

    it('should initialize an interval to create and send an expression', () => {
      test.value(generator.interval).is(undefined)
      generator._initGenerator()
      test.object(generator.interval).match({
        id: 1
      })

      clock.tick(200)
      promiseResolveFn({})
      sinon.assert.calledOnce(generator._generateExpression)
      sinon.assert.calledOnce(generator._sendExpression)
      sinon.assert.calledOnce(generator._output.refresh)
      test.array(generator._expressions.toArray()).hasLength(1)
    })
  })

  describe('Generator.prototype._generateExpression', () => {
    it('should instantiate a new Expression with random values', () => {
      const expression = generator._generateExpression()
      test.object(expression).isInstanceOf(Expression)
      test.number(expression._attrs.index).is(0)
    })
  })

  describe('Generator.prototype._sendExpression', () => {
    it('should return a promise that resolves when socket message response is received', () => {
      generator._ws = {
        emit: sinon.stub().yields({})
      }
      const expression = {}
      const promise = generator._sendExpression(expression)
      sinon.assert.calledOnce(generator._ws.emit)
      sinon.assert.calledWith(generator._ws.emit, 'expression', expression, sinon.match.func)
      test.object(promise).match({
        isFulfilled: true,
        isRejected: false
      })
    })

    it('should resolve with error if response indicates error', () => {
      generator._ws = {
        emit: sinon.stub().yields({
          error: true
        })
      }
      const expression = {}
      const catchStub = sinon.stub()
      const promise = generator._sendExpression(expression)
        .catch(() => {})
      sinon.assert.calledOnce(generator._ws.emit)
      sinon.assert.calledWith(generator._ws.emit, 'expression', expression, sinon.match.func)
      test.object(promise).match({
        isFulfilled: true,
        isRejected: true
      })
    })
  })
})
