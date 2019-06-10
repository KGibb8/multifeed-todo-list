const crypto = require('crypto')
const assert = require('../lib/assert')

module.exports = class Action {
  constructor (props) {
    this.id = props.id || crypto.randomBytes(32).toString('hex')
    this.type = props.type
    this.createdAt = props.createdAt || Date.now()
    this._attrs = []

    this._validate = this._validate.bind(this)
    this.toString = this.toString.bind(this)
    this.attributes = this.attributes.bind(this)
  }

  _validate (validators = []) {
    assert(Array.isArray(validators), 'bad validators')
    validators.forEach((validator) => {
      var attribute = this[validator.param] 
      if (!attribute) throw new Error(`${validator.param} missing`)
      if (typeof attribute !== validator.type) throw new Error(`bad type: ${validatir.type}`)
      this._attrs.push(validator.param)
    })
  }

  attributes () {
    return Object.assign({
      id: this.id,
      createdAt: this.createdAt,
      type: this.type
    }, this._attrs.reduce((acc, attr) => (
      Object.assign(acc, { [attr]: this[attr] })
    ), {}))
  }

  toString () {
    return JSON.stringify(this.attributes(), null, 2)
  }
}
