# pull-portal

[Pull streams](https://github.com/dominictarr/pull-stream) for
[skyportal](https://github.com/DamonOehlman/skyportal).


[![NPM](https://nodei.co/npm/pull-portal.png)](https://nodei.co/npm/pull-portal/)

[![experimental](https://img.shields.io/badge/stability-experimental-red.svg)](https://github.com/badges/stability-badges) 

## Reference

### reader(opts?)

A pull-stream `Source` that will read data from the portal.

```js
var portal = require('pull-portal');
var pull = require('pull-stream');

// read a stream of status updates from the portal
pull(
  portal.reader(),
  pull.drain(console.log)
);

```

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

```js
var portal = require('pull-portal');
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

```

### writer(opts?)

A pull-stream `Sink` that will send data to the portal.

```js
var portal = require('pull-portal');
var pull = require('pull-stream');

pull(
  // generate random rgb colors
  pull.infinite(function() {
    var r = (Math.random() * 255) | 0;
    var g = (Math.random() * 255) | 0;
    var b = (Math.random() * 255) | 0;

    return [r, g, b];
  }),

  // convert to a color command
  pull.map(portal.commands.color),

  // throttle updates to prevent your eyes hurting
  pull.asyncMap(function(data, cb) {
    setTimeout(function() {
      cb(null, data);
    }, 100);
  }),

  // send the data
  portal.writer()
);

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
