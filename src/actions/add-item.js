const Action = require('./action')

module.exports = class AddItem extends Action {
  constructor (props) {
    var self = Object.assign({ type: 'list/add-item' }, props) 

    super(self)

    this.name = props.name
    this._validate([
      { param: 'name', type: 'string' }
    ])
  }
}
