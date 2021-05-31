const whois = require('whois')


exports.lookup = (addr, done) => {
  whois.lookup(addr, {follow: 1, timeout: 5000}, (err, data) => {
    if (err) {
      done(err)
      return
    }

    done(null, [{data: data}])
  })
}
