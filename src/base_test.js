/**
 * @module src/base_test
 */
'use strict'

const test = require('unit.js')

const Base = require('./base')

const sinon = test.sinon

describe('src/base', () => {
  var base

  beforeEach(() => {
    base = new Base()
  })

  it('load', () => {
    test.function(Base).hasName('Base')
    test.object(base).isInstanceOf(Base)
    test.function(Base._ioClient)
    test.function(Base._ioServer)
  })

  describe('Base.prototype._initWebsocketClient', () => {
    beforeEach(() => {
      sinon.stub(Base, '_ioClient').returns({})
    })

    afterEach(() => {
      Base._ioClient.restore()
    })

    it('should instantiate and return a singleton websocket client', () => {
      base._initWebsocketClient()
      base._initWebsocketClient()
      base._initWebsocketClient()

      sinon.assert.calledOnce(Base._ioClient)
      sinon.assert.calledWith(Base._ioClient, 'ws://localhost:' + process.env.SPC_SERVER_PORT)
      test.value(base._ws).is({})
    })
  })

  describe('Base.prototype._initWebsocketServer', () => {
    beforeEach(() => {
      sinon.stub(Base, '_ioServer').returns({})
    })

    afterEach(() => {
      Base._ioServer.restore()
    })

    it('should instantiate and return a singleton websocket server', () => {
      base._initWebsocketServer()
      base._initWebsocketServer()
      base._initWebsocketServer()

      sinon.assert.calledOnce(Base._ioServer)
      sinon.assert.calledWith(Base._ioServer, process.env.SPC_SERVER_PORT)
      test.value(base._wss).is({})
    })
  })
})
