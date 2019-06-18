const crypto = require('crypto')
const Action = require('./action')

module.exports = class RemoveItem extends Action {
  constructor (props) {
    var self = Object.assign({ type: 'list/remove-item' }, props)

    super(self)

    this.name = props.itemId
    this._validate([
      { param: 'itemId', type: 'string' }
    ])
  }
}
