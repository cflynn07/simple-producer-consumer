/**
 * @module src/logger_test
 */
'use strict'

const test = require('unit.js')

const logger = require('./logger')

const sinon = test.sinon

describe('src/logger', () => {
  it('load', () => {
    test.function(logger)
  })

  describe('logger function', () => {
    it('should return a child bunyan logger', () => {
      const log = logger(__filename)
      test.object(log).match({
        info: sinon.match.func
      })
    })
  })
})
