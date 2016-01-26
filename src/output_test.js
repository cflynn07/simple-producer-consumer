/**
 * @module src/output_test
 */
'use strict'

const test = require('unit.js')
const TCA = require('tailable-capped-array')

const Output = require('./output')

const sinon = test.sinon

describe('src/output', () => {
  var output
  var expressions

  beforeEach(() => {
    expressions = new TCA(10)
    sinon.stub(expressions, 'createReadStream').returns({
      on: sinon.stub().yields()
    })
    sinon.stub(Output.prototype, 'refresh')
    output = new Output(expressions)
  })

  afterEach(() => {
    if (Output.prototype.refresh.restore) {
      Output.prototype.refresh.restore()
    }
  })

  it('load', () => {
    test.function(Output).hasName('Output')
    test.object(output).isInstanceOf(Output)
    test.function(Output._clear)
  })

  describe('Generator constructor', () => {
    it('should set protected member properties on instance', () => {
      test.array(output._expressions.toArray())
      sinon.assert.calledOnce(expressions.createReadStream)
      sinon.assert.calledOnce(Output.prototype.refresh)
    })
  })

  describe('Output.prototype.refresh', () => {
    beforeEach(() => {
      Output.prototype.refresh.restore()
      sinon.stub(Output, '_clear')
      sinon.stub(console, 'log')
    })

    afterEach(() => {
      Output._clear.restore()
      console.log.restore()
    })

    it('should clear terminal and output table', () => {
      output.refresh()
      sinon.assert.calledOnce(Output._clear)
      sinon.assert.calledOnce(console.log, sinon.match.string)
    })
  })
})
