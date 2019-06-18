const multifeed = require('multifeed')
const hypercore = require('hypercore')
const thunky = require('thunky')
const { EventEmitter } = require('events')

const Swarm = require('./swarm')

module.exports = class Connection extends EventEmitter {
  constructor (storage, key, opts) {
    super()
    this.storage = storage
    this.key = key || null
    this.multifeed = thunky(this.multifeed.bind(this))
    this.feed = thunky(this.feed.bind(this))
    this.encoding.bind(this)
    this.swarm = this.swarm.bind(this)
    this.getKey = this.getKey.bind(this)

    this._addConnection = this._addConnection.bind(this)
    this._removeConnection = this._removeConnection.bind(this)
  }

  feed (callback) {
    var self = this
    self.multifeed((multifeed) => {
      multifeed.writer('local', (err, feed) => {
        if (!self.key) self.key = feed.key.toString('hex')
        callback(feed)
      })
    })
  }

  multifeed (callback) {
    const multi =  multifeed(hypercore, this.storage, this.encoding())
    multi.ready(() => callback(multi))
  }

  encoding () {
    return { valueEncoding: 'json' }
  }

  swarm (callback) {
    Swarm(this, callback)
  }

  getKey (callback) {
    if (!callback) return

    this.feed((feed) => {
      callback(null, feed.key.toString('hex'))
    })
  }

  _addConnection (key) {
    console.info(`${key} connected`)
  }

  _removeConnection (key) {
    console.log(`${key} dropped`)
  }
}
