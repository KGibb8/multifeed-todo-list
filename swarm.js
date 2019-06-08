const Discovery = require('hyperdiscovery')
const pull = require('pull-stream')

module.exports = function swarm (multilist, callback) {
  callback = callback || noop

  multilist.getKey((err, key) => {
    if (err) return callbackk(err)

    multilist.feed((feed) => {
      const swarm = Discovery(feed, key)

      swarm.on('connection', (peer, type) => {
        var remoteKey = peer.id.toString('hex')

        // replicate all feeds?
        // multilist.feed((feed) => feed.replicate())
        // pull(
        //   pull.values(multilist.feeds())
        //   pull.drain(feed => feed.replicate())
        // )
        multilist._addConnection(remoteKey)

        peer.on('close', function () {
          multilist._removeConnection(remoteKey)
        })
      })

      callback(null, swarm)
    })
  })
}

function noop () {}

