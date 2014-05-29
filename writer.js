var pull = require('pull-core');
var skyportal = require('skyportal');

/**
  ### write(p)

  Send a chunk of bytes to the portal (`p`).

  <<< examples/color-randomizer.js

**/
module.exports = pull.Sink(function(read, p) {
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
