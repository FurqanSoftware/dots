const dns = require('./dns')
const geo = require('./geo')
const rdns = require('./rdns')
const whois = require('./whois')


module.exports = exports = (kind, addr, done) => {
  switch (kind) {
    case 'a':
    case 'aaaa':
    case 'cname':
    case 'mx':
    case 'naptr':
    case 'ns':
    case 'ptr':
    case 'soa':
    case 'srv':
    case 'txt':
      dns.lookup(kind, addr, done)
      break

    case 'rdns':
      rdns.lookup(addr, done)
      break

    case 'geo':
      geo.locate(addr, done)
      break

    case 'whois':
      whois.lookup(addr, done)
      break

    default:
      const err = new Error('query: invalid kind')
      err.code = 'BADQUERY'
      done(err)
      break
  }
}
