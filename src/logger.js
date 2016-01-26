/**
 * @module src/logger
 */
'use strict'

const bunyan = require('bunyan')
const path = require('path')

const streams = [{
  level: process.env.SPC_LOG_LEVEL_STDOUT,
  stream: process.stdout
}]

/**
 *
 */
module.exports = (modulePath) => {
  return bunyan.createLogger({
    name: 'simple-producer-consumer',
    streams: streams,
    serializers: bunyan.stdSerializers
  }).child({
    module: path.relative(process.cwd(), modulePath)
  })
}
