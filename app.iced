_ = require 'underscore'
airbrake = require 'airbrake'
path = require 'path'
dots = require './dots'
express = require 'express'
stylus = require 'stylus'


app = express()

app.configure ->
  app.set 'port', process.env.PORT || 3000
  app.set 'views', path.join __dirname, 'views'
  app.set 'view engine', 'jade'
  app.disable 'x-powered-by'

  _.extend app.locals, _.pick process.env, [
    'GOSQUARED_KEY'
  ]

  app.use express.logger 'dev'

  app.use express.timeout 30000
  app.use express.limit '64kb'

  app.use express.bodyParser()

  app.use stylus.middleware
    src: path.join __dirname, 'public'
    compress: on

  app.use express.static path.join __dirname, 'public'

  app.use app.router

  if process.env.AIRBRAKE_KEY
    airbrake = airbrake.createClient(process.env.AIRBRAKE_KEY)
    airbrake.handleExceptions()

    app.use (err, req, res, next) ->
      airbrake.notify err, ->
        next err

app.configure 'development', ->
  app.locals.pretty = on

  app.use express.errorHandler()

app.get /.*/, (req, res) ->
  if req.path == '/' and req.query.addr
    res.redirect "/#{req.query.addr}"
    return

  res.render 'index'


app.post '/', (req, res, next) ->
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


app.listen app.get('port'), ->
  console.log "Listening on #{app.get 'port'}"