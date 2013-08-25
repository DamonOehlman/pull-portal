var skyportal = require('skyportal');
var portal = require('../');
var pull = require('pull-stream');

// open the portal (may require admin privileges)
skyportal.open(skyportal.find(), function(err, p) {
  if (err) {
    return console.err(err);
  }

  // read a stream of status updates from the portal
  pull(
    portal.status(p),
    pull.drain(console.log)
  );
});

