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
    this.ws = this.ws || ioClient('ws://localhost:' + process.env.SERVER_PORT)
  }

  /**
   *
   */
  _initWebsocketServer () {
    this.wss = this.wss || ioServer(process.env.SERVER_PORT)
  }
}

module.exports = Base
