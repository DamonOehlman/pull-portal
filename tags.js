var EventEmitter = require('events').EventEmitter;
var pull = require('pull-core');

module.exports = function() {
  var tags = new EventEmitter();

  function monitor(read) {
    return function(end, cb) {
      if (end) {
        return cb(end);
      }

      read(null, function(end, data) {
        var flags;

        if ((! end) && (data[0] == 0x53)) {
          flags = (data[3] << 16) + (data[2] << 8) + data[1];
          console.log(flags.toString(2), data);
        }

        cb(end, data);
      });
    };
  }

  tags.monitor = pull.Through(monitor);

  return tags;
};
