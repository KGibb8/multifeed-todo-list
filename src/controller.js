import AddItem from '../actions/add-item'
import RemoveItem from '../actions/remove-item'

export default class Controller {
  constructor (connection) {
    this.connection = connection
  }

  add (params, callback) {
    if (!callback) callback = () => {}
    if (!params) return callback(new Error('You must pass a set of parameters to create a new item'))

    this.connection.feed((feed) => {
      var item = new AddItem(params)
      feed.append(item.toString(), function (err) {
        callback(err, err ? null : item)
      })
    })
  }

  remove (params, callback) {

  }

  all (callback) {
    if (!callback) callback = () => {}
    console.log(multi.feeds().length)

    this.connection.multi((multi) => {
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
}
