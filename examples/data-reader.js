var portal = require('../');
var pull = require('pull-stream');
var tags = portal.tags();

// read a stream of status updates from the portal
pull(
  portal.reader(),
  tags.monitor(),
  pull.filter(),
  pull.map(function(data) {
    console.log('sending data: ', data);
    return data;
  }),
  portal.writer()
);

tags.on('tag:change', function(idx, active) {
  console.log('tag ' + idx + ' changed, active = ' + active);
});
