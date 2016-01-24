/**
 * @module src/socket
 */
'use strict'

// Load environment variables from configs/, attach to process.env
require('loadenv')()

const Websocket = require('ws')
const Server = Websocket.Server

class Socket {
  constructor () {}

  /**
   *
   */
  _initWebsocketClient () {
    this.ws = this.ws || new Websocket('ws://localhost:' + process.env.SERVER_PORT)
  }

  /**
   *
   */
  _initWebsocketServer () {
    this.wss = this.wss || new Server({ port: process.env.SERVER_PORT })
  }
}

module.exports = Socket
