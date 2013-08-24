var skyportal = require('skyportal');
var pullportal = require('../');
var pull = require('pull-stream');

// open the portal (may require admin privileges)
skyportal.open(skyportal.find(), function(err, portal) {

  // read a stream of status updates from the portal
  pull(
    pullportal.status(portal),
    pull.drain(console.log)
  );
  
});

