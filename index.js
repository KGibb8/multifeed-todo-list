const multifeed = require('multifeed')
const hypercore = require('hypercore')
const thunky = require('thunky')
const events = require('events')
const inherits = require('inherits')

const swarm = require('./swarm')
const AddItem = require('./actions/add-item')
const RemoveItem = require('./actions/remove-item')

module.exports = MultiList

function MultiList (storage, key, opts = {}) {
  if (!(this instanceof MultiList)) return new MultiList(storage, key, opts)
  if (!opts) opts = {}

  events.EventEmitter.call(this)

  this.key = key || null

  this.on('peer-added', (key) => console.info(`${key} connected`))
  this.on('peer-dropped', (key) => console.log(`${key} dropped`))

  var self = this

  this.multi = thunky(function (callback) {
    const multi =  multifeed(hypercore, storage, { valueEncoding: 'json' })
    multi.ready(() => callback(multi))
  })

  this.feed = thunky(function (callback) {
    self.multi((multi) => {
      multi.writer('local', (err, feed) => {
        if (!self.key) self.key = feed.key.toString('hex')
        callback(feed)
      })
    })
  })
}

inherits(MultiList, events.EventEmitter)

MultiList.prototype.add = function (params, callback) {
  if (!callback) callback = noop
  if (!params) return callback(new Error('You must pass a set of parameters to create a new item'))

  this.feed((feed) => {
    var item = new AddItem(params)
    feed.append(item.toString(), function (err) {
      callback(err, err ? null : item)
    })
  })
}

MultiList.prototype.remove = function (params, callback) {

}

MultiList.prototype.list = function (callback) {
  if (!callback) callback = noop

  this.multi((multi) => {
    console.log(multi.feeds().length)
    multi.feeds().forEach((feed) => {
      var stream = feed.createReadStream({ start: 0, end: feed.length  })
      const items = []
      stream.on('data', (chunk) => {
        const data = JSON.parse(chunk.toString())
        switch (data.type) {
          case AddItem.toString:
            items.push(new AddItem(data))
          case RemoveItem.toString:
            const index = items.map(item => item.id).indexOf(data.itemId)
            if (index !== -1) items.splice(index, 1)
        }
      }).on('end', () => {
        callback(null, items)
      })
    })
  })
}

MultiList.prototype.swarm = function (callback) {
  swarm(this, callback)
}

MultiList.prototype.getKey = function (callback) {
  if (!callback) return

  this.feed((feed) => {
    callback(null, feed.key.toString('hex'))
  })
}

MultiList.prototype._addConnection = function (key) {
  this.emit('peer-added', key)
}

MultiList.prototype._removeConnection = function (key) {
  this.emit('peer-dropped', key)
}
