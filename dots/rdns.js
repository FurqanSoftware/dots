const dns = require('native-dns')


exports.lookup = (addr, done) => {
  dns.reverse(addr, (err, addresses) => {
    if (err) {
      done(err)
      return
    }

    done(null, addresses.map(a => ({address: a})))
  })
}
