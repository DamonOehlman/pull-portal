var portal = require('../');
var pull = require('pull-stream');

pull(
  // generate random rgb colors
  pull.infinite(function() {
    var r = (Math.random() * 255) | 0;
    var g = (Math.random() * 255) | 0;
    var b = (Math.random() * 255) | 0;

    return [r, g, b];
  }),

  // convert to a color command
  pull.map(portal.commands.color),

  // throttle updates to prevent your eyes hurting
  pull.asyncMap(function(data, cb) {
    setTimeout(function() {
      cb(null, data);
    }, 100);
  }),

  // send the data
  portal.writer()
);
