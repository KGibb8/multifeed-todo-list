import Discovery from 'hyperdiscovery'

export default function Swarm (connection, callback) {
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

class AssertionError extends Error {
  constructor (message) {
    super(message)
  }
}

function assert (ok, message) {
  if (!ok) throw new AssertionError(message)
  else return true
}

function isFunction (variable) {
  return typeof variable === 'function'
}
