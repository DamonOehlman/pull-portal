var skyportal = require('skyportal');
var pull = require('pull-core');

/**
  ### read(p)

  Read a stream of data from an open portal (`p`).

  <<< examples/stream-status.js

**/
module.exports = pull.Source(function(p) {
  return function(end, cb) {
    if (end) {
      return cb && cb(end);
    }

    skyportal.read(p, cb);
  };
});
