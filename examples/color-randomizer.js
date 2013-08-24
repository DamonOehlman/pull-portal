var skyportal = require('skyportal');
var portal = require('../');
var pull = require('pull-stream');

// open the portal (may require admin privileges)
skyportal.open(skyportal.find(), function(err, p) {

  // read a stream of status updates from the portal
  pull(
    pull.infinite(function() {
      var r = (Math.random() * 255) | 0;
      var g = (Math.random() * 255) | 0;
      var b = (Math.random() * 255) | 0;

      return [0x43, r, g, b];
    }),

    // throttle updates
    pull.asyncMap(function(data, cb) {
      setTimeout(function() {
        cb(null, data);
      }, 100);
    }),

    // send the data
    portal.send(p)
  );

});

