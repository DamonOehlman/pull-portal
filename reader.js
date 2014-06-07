var skyportal = require('skyportal');
var pull = require('pull-core');

/**
  ### reader(opts?)

  A pull-stream `Source` that will read data from the portal.

  <<< examples/stream-status.js

**/
module.exports = pull.Source(function(opts) {
  var portal;

  return function(end, cb) {
    if (end) {
      return cb && cb(end);
    }

    if (portal) {
      return skyportal.read(portal, cb);
    }

    portal = skyportal.init(opts, function(err) {
      if (err) {
        return cb(err);
      }

      skyportal.read(portal, cb);
    });
  };
});
