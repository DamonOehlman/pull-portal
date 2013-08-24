var pull = require('pull-core');
var skyportal = require('skyportal');

/**
  # pull-portal

  [Pull streams](https://github.com/dominictarr/pull-stream) for
  [skyportal](https://github.com/DamonOehlman/skyportal).

  ## Reference
**/

/**
  ### status(p)

  Read a stream of data from an open portal (`p`).

  <<< examples/stream-status.js

**/
exports.status = pull.Source(function(p) {
  return function(end, cb) {
    if (end) {
      return cb && cb(end);
    }

    skyportal.read(p, cb);
  };
});

/**
  ### send(p)

  Send a chunk of bytes to the portal (`p`).

  <<< examples/color-randomizer.js

**/ 
exports.send = pull.Sink(function(read, p) {
  read(null, function next(end, data) {
    // if the stream has ended, simply return
    if (end) {
      return;
    }

    // ensure we have an array of bytes to work with
    skyportal.send([].concat(data), p, function(err) {
      // if we've hit an error tell the reader we are ending
      if (err) {
        return read(err);
      }

      // otherwise, read the next chunk
      read(null, next);
    });
  });
});