const sig = require('./functionSignatures');
// Assigning function signature groupings to functions.
module.exports = {
  // Collections functions.
  concat: sig.iterate,
  concatSeries: sig.iterate,

  detect: sig.truthy,
  detectLimit: sig.truthyLimited,
  detectSeries: sig.truthy,

  each: sig.noReturn,
  eachLimit: sig.noReturnLimited,
  eachSeries: sig.noReturn,
  eachOf: sig.noReturn,
  eachOfLimit: sig.noReturnLimited,
  eachOfSeries: sig.noReturn,

  every: sig.truthy,
  everyLimit: sig.truthyLimited,
  everySeries: sig.truthy,

  filter: sig.iterate,
  filterLimit: sig.iterateLimited,
  filterSeries: sig.iterate,

  groupBy: sig.iterate,
  groupByLimit: sig.iterateLimited,
  groupBySeries: sig.iterate,

  map: sig.mutates,
  mapLimit: sig.mutatesLimited,
  mapSeries: sig.mutates,
  mapValues: sig.mutates,
  mapValuesLimit: sig.mutatesLimited,
  mapValuesSeries: sig.mutates,

  reduce: sig.transforms,
  reduceRight: sig.transforms,

  reject: sig.iterate,
  rejectLimit: sig.iterateLimited,
  rejectSeries: sig.iterate,

  some: sig.iterate,
  someLimit: sig.iterateLimited,
  someSeries: sig.iterate,

  sortBy: sig.iterate,
  transform: sig.transforms,

  // Control flow functions
  // applyEach: sig.iterate,
  // applyEachSeries: sig.iterate,
  auto: sig.autoTasks,
  autoInject: sig.autoTasks,
  cargo: sig.worker,
  // 'compose': sig.iterate,
  doDuring: sig.doLoop,
  doUntil: sig.doLoop,
  doWhilst: sig.doLoop,
  during: sig.loop,
  forever: sig.forever,
  parallel: sig.taskList,
  parallelLimit: sig.taskList,
  priorityQueue: sig.worker,
  queue: sig.worker,
  race: sig.taskList,
  retry: sig.retry,
  retryable: sig.retry,
  // seq: sig.iterate,
  series: sig.taskList,
  times: sig.times,
  timesLimit: sig.times,
  timesSeries: sig.times,
  until: sig.loop,
  waterfall: sig.taskList,
  whilst: sig.loop
};
