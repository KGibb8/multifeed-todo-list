const path = require('path')
const os = require('os')

const APP_NAME = require('./package.json').name
const APP_ROOT = path.join(os.homedir(), `.${APP_NAME}`)
const MultiList = require('./index')

const alicesList = new MultiList(APP_ROOT)
const bobsList = new MultiList(APP_ROOT)

alicesList.feed(console.log)
bobsList.feed(console.log)

// alicesList.add({ name: "Alice published this" }, callback)
// bobsList.add({ name: "Bob published this" }, callback)

alicesList.list(callback)
// bobsList.list(callback)

function callback (err, res) {
  if (err) throw err
  console.log(res)
}

function noop () {}
