# pull-portal

[Pull streams](https://github.com/dominictarr/pull-stream) for
[skyportal](https://github.com/DamonOehlman/skyportal).


[![NPM](https://nodei.co/npm/pull-portal.png)](https://nodei.co/npm/pull-portal/)

[![experimental](https://img.shields.io/badge/stability-experimental-red.svg)](https://github.com/badges/stability-badges) 

## Reference

### reader(p)

A [pull-stream Source](https://npmdox.appspot.com/pull-stream/sources) that
will read data from portal `p`

```js
var skyportal = require('skyportal');
var portal = require('pull-portal');
var pull = require('pull-stream');

// open the portal (may require admin privileges)
skyportal.open(skyportal.find(), function(err, p) {
  if (err) {
    return console.error(err);
  }

  // read a stream of status updates from the portal
  pull(
    portal.reader(p),
    pull.drain(console.log)
  );
});


```

### writer(p)

A [pull-stream Sink](https://npmdox.appspot.com/pull-stream/sinks) that
will send data to portal `p`

```js
var skyportal = require('skyportal');
var commands = require('skyportal/commands');
var portal = require('pull-portal');
var pull = require('pull-stream');

// open the portal (may require admin privileges)
skyportal.open(skyportal.find(), function(err, p) {
  if (err) {
    return console.error(err);
  }

  pull(
    // generate random rgb colors
    pull.infinite(function() {
      var r = (Math.random() * 255) | 0;
      var g = (Math.random() * 255) | 0;
      var b = (Math.random() * 255) | 0;

      return [r, g, b];
    }),

    // convert to a color command
    pull.map(commands.color),

    // throttle updates to prevent your eyes hurting
    pull.asyncMap(function(data, cb) {
      setTimeout(function() {
        cb(null, data);
      }, 100);
    }),

    // send the data
    portal.writer(p)
  );
});


```

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
