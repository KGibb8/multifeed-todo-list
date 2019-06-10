const AddItem = require('./actions/add-item')
const RemoveItem = require('./actions/remove-item')
const { EventEmitter } = require('events')

module.exports = class Controller extends EventEmitter {
  constructor (connection) {
    super()
    this.connection = connection

    this.on('add', this._onAdd.bind(this))
    this.on('all', this._onAll.bind(this))
  }

  add (params, callback) {
    assert(isFunction(callback), 'callback required')
    assert(validate(params), 'valid parameters required')

    this.connection.feed((feed) => {
      var item = new AddItem(params)
      feed.append(item.toString(), function (err) {
        this.emit('add', item)
        callback(err, err ? null : item)
      })
    })
  }

  remove (params, callback) {

  }

  all (callback) {
    if (!callback) callback = () => {}

    this.connection.multifeed((multi) => {
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
	  this.emit('all', items)
          callback(null, items)
        })
      })
    })
  }

  // hooks
  _onAdd (item) {
    console.log(item)
  }

  _onAll (items) {
    console.log(items)
  }
}
