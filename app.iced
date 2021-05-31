_ = require 'underscore'
path = require 'path'
dots = require './dots'
express = require 'express'
stylus = require 'stylus'


app = express()

app.set 'view engine', 'pug'
app.disable 'x-powered-by'

_.extend app.locals, _.pick process.env, [
  'GOSQUARED_KEY'
]

app.use (require 'morgan')()

app.use (require 'body-parser')()

app.use stylus.middleware
  src: path.join __dirname, 'public'
  compress: on

app.use express.static path.join __dirname, 'public'


app.route('/*')
.get((req, res) ->
  if req.path == '/' and req.query.addr
    res.redirect "/#{req.query.addr}"
    return

  res.render 'index'
)


app.route('/')
.post((req, res, next) ->
  if not req.xhr
    res.send 403
    return

  {type, addr} = req.body

  await dots type, addr, defer err, records
  if not err
    res.json
      records: records
    return

  switch err.code
    when 'ENOTFOUND'
       , 'TIMEOUT'
      res.json
        records: []

    when 'BADQUERY'
      res.json 400

    else
      next err
)


app.listen (port = process.env.PORT), ->
  console.log "Listening on #{port}"
