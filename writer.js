var pull = require('pull-core');
var skyportal = require('skyportal');

/**
  ### writer(opts?)

  A pull-stream `Sink` that will send data to the portal.

  <<< examples/color-randomizer.js

**/
module.exports = pull.Sink(function(read, opts) {
  var portal;

  function send(data) {
    // ensure we have an array of bytes to work with
    skyportal.send([].concat(data), portal, function(err) {
      // if we've hit an error tell the reader we are ending
      if (err) {
        return read(err);
      }

      // otherwise, read the next chunk
      read(null, next);
    });
  }

  function next(end, data) {
    // if the stream has ended, simply return
    if (end) {
      return;
    }

    if (portal) {
      return send(data);
    }

    portal = skyportal.init(opts, function(err) {
      if (err) {
        return read(err);
      }

      send(data);
    });
  }

  read(null, next);
});
