var EventEmitter = require('events').EventEmitter;
var pull = require('pull-core');

/**
  ### tags()

  Create a tag state monitor for the portal. This is the module in the
  `pull-portal` package that does most of the legwork for determining
  how to read data from a tag and monitor when a tag is in range of the
  reader.

  By calling the `.monitor()` function of the created tags `EventEmitter`
  you can create a pull-stream `Through` stream which performs a
  transformation on incoming data that has been read from the portal
  and generates data that should be written to the data.

  At present it should be used in conjunction with a `pull.filter()`
  through stream to prevent attempting to write empty data to the
  portal.

  <<< examples/data-reader.js

**/
module.exports = function() {
  var tags = new EventEmitter();
  var knownTags = [];

  function createQueryCommand(state, previousState) {
    var command;
    var ii = 0;
    var tagVal;
    var tagOn;
    var previousOn;

    while (ii < 12) {
      tagVal = Math.pow(2, ii * 2);
      tagOn = (state & tagVal) == tagVal;
      previousOn = (previousState & tagVal) == tagVal;

      if (tagOn && tagOn !== previousOn) {
        command = [0x51, 0x20 + ii, 0];
        knownTags[ii] = true;

        break;
      }

      ii += 1;
    }

    return command;
  }

  function findActiveTags(tagStat, currentState) {
    var newState = [];
    var tagIdx = 0;

    while (tagStat > 0) {
      newState[tagIdx] = ((tagStat & 1) == 1);
      if (currentState && newState[tagIdx] != currentState[tagIdx]) {
        tags.emit('tag:change', tagIdx, newState[tagIdx]);
      }

      tagStat = tagStat >> 2;
      tagIdx += 1;
    }

    while (newState.length < 12) {
      newState.push(false);
    }

    return newState;
  }

  function readBlock(data) {
    var tagIdx = data[1];
    var blockIdx = data[2];
    var encoded = (data[1] & 0x10) == 0x10;

    if (encoded) {
      tagIdx ^= 0x10;
    }

    console.log('read block data, tag: ' + tagIdx + ', block: ' + blockIdx, data);
    if (encoded && blockIdx < 63) {
      return [0x51, data[1], blockIdx + 1];
    }
  }

  function monitor(read) {
    var active = findActiveTags(0);
    var lastTagStat;

    function updateStatus(data) {
      var tagStat = (data[3] << 16) + (data[2] << 8) + data[1];
      var command = null;

      if (tagStat !== lastTagStat) {
        active = findActiveTags(tagStat, active);
        command = createQueryCommand(tagStat, lastTagStat);
      }

      lastTagStat = tagStat;
      return command;
    }

    return function(end, cb) {
      if (end) {
        return cb(end);
      }

      read(null, function(end, data) {
        if (end) {
          return cb(end);
        }

        switch (data[0]) {
          case 0x53: {
            data = updateStatus(data);
            break;
          }

          case 0x51: {
            data = readBlock(data);
            break;
          }

          default: {
            console.log('received: ', data);
            data = null;
          }
        }

        cb(end, data);
      });
    };
  }

  tags.monitor = pull.Through(monitor);

  return tags;
};
