/* jshint node:true, indent:2, white:true, laxcomma:true, undef:true, strict:true, unused:true, eqnull:true, camelcase: false, trailing: true */
'use strict';

var bytes = require('bytes')
  , express = require('express')
  , http = require('http')
  , path = require('path')
  , parted = require('parted')
  , flash = require('connect-flash')
  , nano = require('nano')(process.env.DATABASE_URL || 'http://localhost:5984/youform')
  , redis = require('redis')
  , jsonify = require('redis-jsonify')
  , RedisStore = require('connect-redis')(express)
  , coolog = require('coolog')
  , logger = coolog.logger('app.js')
  ;

require('sugar');

var app = express()
  , redis_client
  , cookieParser = express.cookieParser(process.env.SITE_SECRET)
  , sessionStore
  , rtg
  ;


if (process.env.REDISTOGO_URL) {
  // @TODO: test this
  rtg = require('url').parse(process.env.REDISTOGO_URL);
  redis_client = redis.createClient(rtg.port, rtg.hostname);
  redis_client.auth(rtg.auth.split(':')[1]);

  // redis as session store
  sessionStore = new RedisStore({
    host: process.env.REDISTOGO_URL.split(':')[0],
    port: 6379,
    pass: process.env.REDISTOGO_URL
  });

} else {
  throw new Error('Missing Redis URL: REDISTOGO_URL');
}

redis_client = jsonify(redis_client);
redis_client.on('error', function (err) {
  logger.error('redis error', err);
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(cookieParser);
// limit request size
app.use(express.limit('2mb'));

// multipart
app.use(function (req, res, next) {
  var type = '';
  if (req.headers['content-type'] !== undefined) {
    type = req.headers['content-type'].split(';')[0].trim().toLowerCase();
  }

  if (/^\/api\/form\/*/.test(req.url) && type === 'multipart/form-data') {
    parted({
      // custom file path
      path: __dirname + '/uploads',
      // memory usage limit per request
      limit: 30 * 1024,
      // disk usage limit per request
      diskLimit: 30 * 1024 * 1024,
      // enable streaming for json/qs
      stream: true
    })(req, res, next);
  } else {
    process.nextTick(next);
  }
});
app.use(express.json());
app.use(express.urlencoded());
app.use(express.session());
app.use(flash());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes/site')(app, nano, '');
require('./routes/api')(app, nano, redis_client, '/api');

http.createServer(app).listen(app.get('port'), function () {
  logger.ok('Express server listening on port ' + app.get('port'));
});
