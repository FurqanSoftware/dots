const _ = require('underscore')
const dns = require('native-dns')


const SERVERS = process.env.NAMESERVERS.split(',')


exports.lookup = (type, addr, done) => {
  const req = new dns.Request({
    question: new dns.Question({
      type,
      name: addr
    }),
    server: _.sample(SERVERS),
    timeout: 5000
  })

  const timedout = false
  const errored = false

  req.on('timeout', () => {
    timedout = true
    req.cancel()
    done(dns.TIMEOUT)
  })

  req.on('end', () => {
    if (errored || timedout) return
    done(null, records)
  })

  // accumulate records
  const records = []
  req.on('message', (err, message) => {
    if (err) {
      errored = true
      req.cancel()
      done(err)
      return
    }

    for (const record of message.answer) {
      delete record['name']
      delete record['type']
      delete record['class']
      records.push(record)
    }
  })

  req.send()
}
