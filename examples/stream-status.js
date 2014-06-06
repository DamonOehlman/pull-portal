var portal = require('../');
var pull = require('pull-stream');

// read a stream of status updates from the portal
pull(
  portal.reader(),
  pull.drain(console.log)
);
