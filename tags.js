var EventEmitter = require('events').EventEmitter;
var pull = require('pull-core');

module.exports = function() {
  var tags = new EventEmitter();

  function findActiveTags(tagStat, currentState) {
    var newState = [];
    var tagIdx = 0;

    while (tagStat > 0) {
      newState[tagIdx] = ((tagStat & 1) == 1);
      if (currentState && newState[tagIdx] != currentState[tagIdx]) {
        tag.emit('tag:change', tagIdx, newState[tagIdx] == 1);
      }

      tagStat = tagStat >> 2;
      tagIdx += 1;
    }

    while (newState.length < 12) {
      newState.push(0);
    }

    return newState;
  }

  function monitor(read) {
    var active = findActiveTags(0);
    var lastTagStat;

    return function(end, cb) {
      if (end) {
        return cb(end);
      }

      read(null, function(end, data) {
        var tagStat;

        if ((! end) && (data[0] == 0x53)) {
          tagStat = (data[3] << 16) + (data[2] << 8) + data[1];
          if (tagStat !== lastTagStat) {
            active = findActiveTags(tagStat, active);
          }

          lastTagStat = tagStat;
        }

        cb(end, data);
      });
    };
  }

  tags.monitor = pull.Through(monitor);

  return tags;
};
