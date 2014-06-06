var skyportal = require('skyportal');
var pull = require('pull-core');

/**
  ### reader(p)

  A [pull-stream Source](https://npmdox.appspot.com/pull-stream/sources) that
  will read data from portal `p`

  <<< examples/stream-status.js

**/
module.exports = pull.Source(function(p) {
  var portal;

  return function(end, cb) {
    if (end) {
      return cb && cb(end);
    }

    if (portal) {
      return skyportal.read(portal, cb);
    }

    portal = skyportal.init(function(err) {
      if (err) {
        return cb(err);
      }

      skyportal.read(portal, cb);
    });
  };
});
