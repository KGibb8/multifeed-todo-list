const path = require('path')
const os = require('os')
const { name: APP_NAME } = require('../package.json')

const CLI = require('./bin')
const Connection = require('./config/connection')
const Controller = require('./controller')

class App {
  constructor (name) {
    this.APP_NAME = name
    this.APP_ROOT = path.join(os.homedir(), `.${APP_NAME}`) 
    this.connection = new Connection(this.APP_ROOT)
    this.controller = new Controller(this.connection)
  }

  init () {
    CLI(this.controller)
  }
}

const app = new App()
app.init()
