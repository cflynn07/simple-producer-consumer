/**
 * Processes requests with specified arithmetic operations. Computes the result of each operation
 * and responds
 * @module src/consumer
 */
'use strict'

// Load environment variables from configs/, attach to process.env
import loadenv from 'loadenv'
loadenv()

import {Server} from 'ws'

const wss = new Server({
  port: process.env.SERVER_PORT
})

wss.on('connection', () => {
  console.log('connection')
})
