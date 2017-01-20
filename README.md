# visibleAsync.js

This is a very simple module to enhance the wonderful (async module)[https://caolan.github.io/async/], by Caolan McMahon.

It will invoke a function of your choosing when the callback function of most functions in the async library have been called. Supply the function when you require this module.

## Quick Examples
```javascript
const debug = require('debug')('myScript');
const async = require('visibleAsync')(debug);

async.map([1, 2, 3], (item, cb) => cb(null, item ** 2), (err, results) => {
  console.log('normal callback');
});

// Console:
// normal callback
//   myScript map finished, callback arguments: +0ms null [ 1, 4, 9 ]

async.waterfall([
  (cb) => {
    cb(null, 1);
  }, (last, cb) => {
    cb(null, last + 2);
  }, (last, cb) => {
    cb(null, last + 3);
  }
], (err, results) => {
  console.log('normal callback');
});

// Console:
// normal callback
//   myScript waterfall finished, callback arguments: +6ms null 6

```

Essentially, if you know how to use Async, you know how to use this. If a function has not been patched, it will work as normal.

**However**, please note that because this is a dirty monkey patch, it only works when you specify an end callback of a function.

So, the following will not work:

```javascript
async.map([1, 2, 3], (item, cb) => cb(null, item ** 2));
```
