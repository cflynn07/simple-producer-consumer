/**
 * @module src/socket
 */
'use strict'

require('babel-polyfill')
// Load environment variables from configs/, attach to process.env
require('loadenv')()

const Joi = require('joi')
const Promise = require('bluebird')

const ioClient = require('socket.io-client')
const ioServer = require('socket.io')

class Socket {
  constructor () {
    this._operations = [
      '%',
      '*',
      '+',
      '-',
      '/'
    ]
    this._schemaExpression = Joi.object().keys({
      index: Joi.number().integer(),
      operandA: Joi.number().integer(),
      operation: Joi.any().valid(this._operations),
      operandB: Joi.number().integer(),
      created: Joi.date(),
      completed: Joi.any(),
      result: Joi.any()
    })
    Object.freeze(this._operations)
    Object.freeze(this._schemaExpression)
  }

  /**
   *
   */
  _validateExpression (expression) {
    return Joi.validate(expression, this._schemaExpression)
  }

  /**
   *
   */
  _initWebsocketClient () {
    this.ws = this.ws || ioClient('ws://localhost:' + process.env.SERVER_PORT)
  }

  /**
   *
   */
  _initWebsocketServer () {
    this.wss = this.wss || ioServer(process.env.SERVER_PORT)
  }
}

module.exports = Socket
