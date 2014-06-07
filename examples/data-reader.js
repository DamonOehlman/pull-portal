var portal = require('../');
var pull = require('pull-stream');
var tags = portal.tags();

pull(
  // read a stream of status updates from the portal
  portal.reader(),

  // monitor the incoming data and generate appropriate responses
  // by default a null response will be created
  tags.monitor(),

  // filter out the null responses
  pull.filter(),

  // write some debug output to help us see what is being sent to the portal
  pull.map(function(data) {
    console.log('sending data: ', data);
    return data;
  }),

  // write the data to the portal
  portal.writer()
);

tags.on('tag:change', function(idx, active) {
  console.log('tag ' + idx + ' changed, active = ' + active);
});
