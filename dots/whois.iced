whois = require 'node-whois'


exports.lookup = (addr, done) ->
  await whois.lookup addr, { follow: 1, timeout: 5000 }, defer err, data
  if err
    done err
    return

  done null, [ data: data ]