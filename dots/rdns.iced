dns = require 'native-dns'


exports.lookup = (addr, done) ->
  await dns.reverse addr, defer err, addresses
  if err
    done err
    return

  records = []
  for address in addresses
    records.push address: address

  done null, records