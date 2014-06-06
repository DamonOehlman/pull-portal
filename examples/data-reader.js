var portal = require('../');
var pull = require('pull-stream');
var tags = portal.tags();

// read a stream of status updates from the portal
pull(
  portal.reader(),
  tags.monitor(),
  pull.drain()
);
