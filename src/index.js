import path from 'path'
import os from 'os'
import { name: APP_NAME } from './package.json'

import CLI from './bin'
import Connection from './connection'
import Controller from './controller'

class App {
  constructor (name) {
    this.APP_NAME = name
    this.APP_ROOT = path.join(os.homedir(), `.${APP_NAME}`) 
    this.connection = new Connection(APP_ROOT)
    this.controller = new Controller(this.connection)
  }

  start () {
    this.controller.feed(CLI)
  }
}

const app = new App()
app.start()
