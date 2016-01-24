/**
 * @module src/socket
 */
'use strict'

// Load environment variables from configs/, attach to process.env
require('loadenv')()

const ioClient = require('socket.io-client')
const ioServer = require('socket.io')

class Socket {
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

module.exports = Socket
