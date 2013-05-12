dns = require './dns'
geo = require './geo'
rdns = require './rdns'
whois = require './whois'


module.exports = exports = (kind, addr, done) ->
  switch kind
    when 'a', 'aaaa', 'cname', 'mx', 'naptr', 'ns', 'ptr', 'soa', 'srv', 'txt'
      dns.lookup kind, addr, done

    when 'rdns'
      rdns.lookup addr, done

    when 'geo'
      geo.locate addr, done

    when 'whois'
      whois.lookup addr, done

    else
      err = new Error 'query: invalid kind'
      err.code = 'BADQUERY'
      done err