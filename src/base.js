/**
 * @module src/base
 */
'use strict'

require('babel-polyfill')
// Load environment variables from configs/, attach to process.env
require('loadenv')()

const ioClient = require('socket.io-client')
const ioServer = require('socket.io')

class Base {
  constructor () {}

  /**
   *
   */
  _initWebsocketClient () {
    this._ws = this._ws || Base._ioClient('ws://localhost:' + process.env.SPC_SERVER_PORT)
    return this._ws
  }

  /**
   *
   */
  _initWebsocketServer () {
    this._wss = this._wss || Base._ioServer(process.env.SPC_SERVER_PORT)
    return this._wss
  }
}

// For unit tests
Base._ioClient = ioClient
Base._ioServer = ioServer

module.exports = Base
