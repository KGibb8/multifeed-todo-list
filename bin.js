const path = require('path')
const os = require('os')
const yargs = require('yargs')

const APP_NAME = require('./package.json').name
const APP_ROOT = path.join(os.homedir(), `.${APP_NAME}`)
const MultiList = require('./index')

function App () {
  const MultiList = require('./index')

  const multilist = new MultiList(APP_ROOT)

  multilist.feed((feed) => Command(feed))

  multilist.getKey(console.log)

  multilist.on('peer-added', (key) => {
    console.info(`${key} connected`)
  })

  multilist.on('peer-dropped', (key) => {
    console.log(`${key} dropped`)
  })

  function Command (feed) {
    return yargs
      .command('swarm', 'swarm to share your list', (argv) => {
        multilist.swarm((err, swarm) => callback(err, swarm))
      })

      .command('add', 'add an item to your list', (yargs) => {
        yargs.option('name', {
          demandOption: true,
          type: 'string'
        })
      }, (argv) => {
        const { name } = argv
        multilist.add({ name }, callback)
      })

      .command('remove', 'remove an item from your list', (yargs) => {
        yargs.option('id', {
          demandOption: true,
          type: 'string'
        })
      }, (argv) => {
        const { id } = argv
        multilist.remove({ itemId: id }, callback)
      })

      .command('list', 'display your entire list', () => {
        multilist.list(callback)
      })

      .argv
  }

  function callback (err, res) {
    if (err) throw err
    console.log(res)
  }
}

App()
