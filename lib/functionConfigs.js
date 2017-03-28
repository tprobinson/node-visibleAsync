// Common argument configurations, broken down by function signature.
const iterate = [{
  match: ['collection', 'function', 'function'],
  wrap: ['collection', 'iteratee', 'callback']
}, {
  match: ['collection', 'function'],
  wrap: ['collection', 'iteratee']
}];
const iterateLimited = [{
  match: ['collection', 'number', 'function', 'function'],
  wrap: ['collection', 'limit', 'iteratee', 'callback']
}, {
  match: ['collection', 'number', 'function'],
  wrap: ['collection', 'limit', 'iteratee']
}];

const truthy = [{
  match: ['collection', 'function', 'function'],
  wrap: ['collection', 'iterateeReturnsTruth', 'callback']
}, {
  match: ['collection', 'function'],
  wrap: ['collection', 'iterateeReturnsTruth']
}];
const truthyLimited = [{
  match: ['collection', 'number', 'function', 'function'],
  wrap: ['collection', 'limit', 'iterateeReturnsTruth', 'callback']
}, {
  match: ['collection', 'number', 'function'],
  wrap: ['collection', 'limit', 'iterateeReturnsTruth']
}];

const noReturn = [{
  match: ['collection', 'function', 'function'],
  wrap: ['collection', 'iterateeReturnsTruth', 'callback']
}, {
  match: ['collection', 'function'],
  wrap: ['collection', 'iterateeReturnsTruth']
}];
const noReturnLimited = [{
  match: ['collection', 'number', 'function', 'function'],
  wrap: ['collection', 'limit', 'iterateeNoReturn', 'callback']
}, {
  match: ['collection', 'number', 'function'],
  wrap: ['collection', 'limit', 'iterateeNoReturn']
}];

const mutates = [{
  match: ['collection', 'function', 'function'],
  wrap: ['collection', 'iterateeReturnsTruth', 'callback']
}, {
  match: ['collection', 'function'],
  wrap: ['collection', 'iterateeReturnsTruth']
}];
const mutatesLimited = [{
  match: ['collection', 'any', 'function', 'function'],
  wrap: ['collection', 'limit', 'iterateeTransformsValue', 'callback']
}, {
  match: ['collection', 'any', 'function'],
  wrap: ['collection', 'limit', 'iterateeTransformsValue']
}];

const transforms = [{
  match: ['collection', 'any', 'function', 'function'],
  wrap: ['collection', 'memo', 'iterateeTransformsValue', 'callback']
}, {
  match: ['collection', 'any', 'function'],
  wrap: ['collection', 'memo', 'iterateeTransformsValue']
}, {
  match: ['collection', 'function', 'function'],
  wrap: ['collection', 'iterateeTransformsValue', 'callback']
}, {
  match: ['collection', 'function'],
  wrap: ['collection', 'iterateeTransformsValue']
}];

const taskList = [{
  match: ['object', 'number', 'function'],
  wrap: ['tasks', 'limit', 'callback']
}, {
  match: ['object', 'function'],
  wrap: ['tasks', 'callback']
}, {
  match: ['object'],
  wrap: ['tasks']
}];

const worker = [{
  match: ['function', 'number'],
  wrap: ['worker', 'limit']
}, {
  match: ['function'],
  wrap: ['worker']
}];

const doLoop = [{
  match: ['function', 'function', 'function'],
  wrap: ['iterateeOnlyCallback', 'iterateeReturnsTruth', 'callback']
}, {
  match: ['function', 'function'],
  wrap: ['iterateeOnlyCallback', 'iterateeReturnsTruth']
}];

const loop = [{
  match: ['function', 'function', 'function'],
  wrap: ['iterateeReturnsTruth', 'iterateeOnlyCallback', 'callback']
}, {
  match: ['function', 'function'],
  wrap: ['iterateeReturnsTruth', 'iterateeOnlyCallback']
}];

const forever = [{
  match: ['function', 'function'],
  wrap: ['iterateeOnlyCallback', 'callback']
}, {
  match: ['function'],
  wrap: ['iterateeOnlyCallback']
}];

const retry = [{
  match: ['any', 'function', 'function'],
  wrap: ['retryOptions', 'iteratee', 'callback']
}, {
  match: ['any', 'function'],
  wrap: ['retryOptions', 'iteratee']
}, {
  match: ['function', 'function'],
  wrap: ['iteratee', 'callback']
}, {
  match: ['function'],
  wrap: ['iteratee']
}];

const times = [{
  match: ['number', 'function', 'function'],
  wrap: ['timesCount', 'iteratee', 'callback']
}];


module.exports = {
  // Collections functions.
  concat: iterate,
  concatSeries: iterate,

  detect: truthy,
  detectLimit: truthyLimited,
  detectSeries: truthy,

  each: noReturn,
  eachLimit: noReturnLimited,
  eachSeries: noReturn,
  eachOf: noReturn,
  eachOfLimit: noReturnLimited,
  eachOfSeries: noReturn,

  every: truthy,
  everyLimit: truthyLimited,
  everySeries: truthy,

  filter: iterate,
  filterLimit: iterateLimited,
  filterSeries: iterate,

  groupBy: iterate,
  groupByLimit: iterateLimited,
  groupBySeries: iterate,

  map: mutates,
  mapLimit: mutatesLimited,
  mapSeries: mutates,
  mapValues: mutates,
  mapValuesLimit: mutatesLimited,
  mapValuesSeries: mutates,

  reduce: transforms,
  reduceRight: transforms,

  reject: iterate,
  rejectLimit: iterateLimited,
  rejectSeries: iterate,

  some: iterate,
  someLimit: iterateLimited,
  someSeries: iterate,

  sortBy: iterate,
  transform: transforms,

  // Control flow functions
  // applyEach: iterate,
  // applyEachSeries: iterate,
  auto: taskList,
  autoInject: taskList,
  cargo: worker,
  // 'compose': iterate,
  doDuring: doLoop,
  doUntil: doLoop,
  doWhilst: doLoop,
  during: loop,
  forever: forever,
  parallel: taskList,
  parallelLimit: taskList,
  priorityQueue: worker,
  queue: worker,
  race: taskList,
  retry: retry,
  retryable: retry,
  // seq: iterate,
  series: taskList,
  times: times,
  timesLimit: times,
  timesSeries: times,
  until: loop,
  waterfall: taskList,
  whilst: loop
};
