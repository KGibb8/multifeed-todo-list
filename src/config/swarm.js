const Discovery = require('hyperdiscovery')
const isFunction = require('../lib/is-function')
const assert = require('../lib/assert')

module.exports = function Swarm (connection, callback) {
  assert(isFunction(callback), 'provide a callback function')

  connection.getKey((err, key) => {
    if (err) return callback(err)

    connection.feed((feed) => {
      const swarm = Discovery(feed, key)

      swarm.on('connection', (peer, type) => {
        var remoteKey = peer.id.toString('hex')

        connection._addConnection(remoteKey)

        peer.on('close', () => {
          connection._removeConnection(remoteKey)
        })
      })

      callback(null, swarm)
    })
  })
}
