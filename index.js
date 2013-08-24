var pull = require('pull-core');
var skyportal = require('skyportal');

/**
  # pull-portal

  Pull streams for [skyportal](https://github.com/DamonOehlman/skyportal).

  ## Example Usage

  <<< examples/stream-status.js

  ## Reference

  ### source(portal)

  Read a stream of data from an open portal.

**/
exports.status = pull.Source(function(portal) {
  return function(end, cb) {
    if (end) {
      return cb && cb(end);
    }

    skyportal.read(portal, cb);
  };
});