import multifeed from 'multifeed'
import hypercore from 'hypercore'
import thunky from 'thunky'
import events from 'events'

import Swarm from './swarm'

export default class Connection extends events.EventsEmitter {
  constructor (storage, key, opts) {
    this.key = key || null

    this.multifeed = thunky(this.multifeed).bind(this)
    this.feed = thunky(this.feed).bind(this)
    this.encoding.bind(this)
    this.swarm = this.swarm.bind(this)
    this.getKey = this.getKey.bind(this)
    this._addConnection = this._addConnection.bind(this)
    this._removeConnection = this._removeConnection.bind(this)

    this.on('peer-added', (key) => console.info(`${key} connected`))
    this.on('peer-dropped', (key) => console.log(`${key} dropped`))
  }

  feed (callback) {
    var self = this
    self.multilist((multilist) => {
      multilist.writer('local', (err, feed) => {
        if (!self.key) self.key = feed.key.toString('hex')
        callback(feed)
      })
    })
  }

  multifeed (callback) {
    const multi =  multifeed(hypercore, storage, encoding())
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
    this.emit('peer-added', key)
  }

  _removeConnection (key) {
    this.emit('peer-dropped', key)
  }
}
