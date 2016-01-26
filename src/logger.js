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
 * Exports a function that will return a new child instance of bunyan w/ a relative path for
 * the module name
 * @param {String} modulePath
 * @return Object
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
