import yargs from 'yargs'

export default function CLI (controller) {
  return yargs
    .command('swarm', 'swarm to share your list', (argv) => {
      controller.swarm((err, swarm) => callback(err, swarm))
    })

    .command('add', 'add an item to your list', (yargs) => {
      yargs.option('name', {
        demandOption: true,
        type: 'string'
      })
    }, (argv) => {
      const { name } = argv
      controller.add({ name }, callback)
    })

    .command('remove', 'remove an item from your list', (yargs) => {
      yargs.option('id', {
        demandOption: true,
        type: 'string'
      })
    }, (argv) => {
      const { id } = argv
      controller.remove({ itemId: id }, callback)
    })

    .command('list', 'display your entire list', () => {
      controller.list(callback)
    })

    .argv
  }
}

function callback (err, res) {
  if (err) throw err
  console.log(res)
}
