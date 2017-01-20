'use strict';

const wrappedFunctions = [
  // Collections functions.
'concat',
'concatSeries',
'detect',
'detectLimit',
'detectSeries',
'each',
'eachLimit',
'eachOf',
'eachOfLimit',
'eachOfSeries',
'eachSeries',
'every',
'everyLimit',
'everySeries',
'filter',
'filterLimit',
'filterSeries',
'map',
'mapLimit',
'mapSeries',
'mapValues',
'mapValuesLimit',
'mapValuesSeries',
'reduce',
'reduceRight',
'reject',
'rejectLimit',
'rejectSeries',
'some',
'someLimit',
'someSeries',
'sortBy',
'transform',

// Control flow functions
'applyEachSeries',
'auto',
'autoInject',
'cargo',
'compose',
'doDuring',
'doUntil',
'doWhilst',
'during',
'forever',
'parallel',
'parallelLimit',
'priorityQueue',
'queue',
'race',
'retry',
'retryable',
'seq',
'series',
'times',
'timesLimit',
'timesSeries',
'until',
'waterfall',
'whilst'
];

const async = require('async');
module.exports = (logFunc) => {
  // Necessary to assign to a blank object here... as for some reason, it globally modifies 'async' otherwise.
  return Object.assign({}, async, wrappedFunctions.reduce((newFuncs, funcName) => {
    newFuncs[funcName] = (...args) => {
      const callback = args.pop();
      return async[funcName](...args, (...cbargs) => {
        callback(...cbargs);
        logFunc(`${funcName} finished, callback arguments:`, ...cbargs);
      });
    };
    return newFuncs;
  }, {}));
};
