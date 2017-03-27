// Common argument configurations, broken down by function signature.
const typical = [{
  match: ['collection', 'function', 'function'],
  wrap: ['collection', 'iteratee', 'callback']
}, {
  match: ['collection', 'function'],
  wrap: ['collection', 'iteratee']
}];
const typicalLimited = [{
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

const auto = [{
  match: ['object', 'number', 'function'],
  wrap: ['autoTasks', 'limit', 'callback']
}, {
  match: ['object', 'function'],
  wrap: ['autoTasks', 'callback']
}, {
  match: ['object'],
  wrap: ['autoTasks']
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
  wrap: ['iterateeOnlyCallback', 'callback'],
}, {
  match: ['function'],
  wrap: ['iterateeOnlyCallback']
}];



module.exports = {
  // Collections functions.
  'concat': typical,
  'concatSeries': typical,

  'detect': truthy,
  'detectLimit': truthyLimited,
  'detectSeries': truthy,

  'each': noReturn,
  'eachLimit': noReturnLimited,
  'eachSeries': noReturn,
  'eachOf': noReturn,
  'eachOfLimit': noReturnLimited,
  'eachOfSeries': noReturn,

  'every': truthy,
  'everyLimit': truthyLimited,
  'everySeries': truthy,

  'filter': typical,
  'filterLimit': typicalLimited,
  'filterSeries': typical,

  'groupBy': typical,
  'groupByLimit': typicalLimited,
  'groupBySeries': typical,

  'map': mutates,
  'mapLimit': mutatesLimited,
  'mapSeries': mutates,
  'mapValues': mutates,
  'mapValuesLimit': mutatesLimited,
  'mapValuesSeries': mutates,

  'reduce': transforms,
  'reduceRight': transforms,

  'reject': typical,
  'rejectLimit': typicalLimited,
  'rejectSeries': typical,

  'some': typical,
  'someLimit': typicalLimited,
  'someSeries': typical,

  'sortBy': typical,
  'transform': transforms,

  // Control flow functions
  // applyEach: typical,
  // applyEachSeries: typical,
  'auto': auto,
  'autoInject': auto,
  'cargo': worker,
  // 'compose': typical,
  'doDuring': doLoop,
  'doUntil': doLoop,
  'doWhilst': doLoop,
  'during': loop,
  'forever': forever,
  'parallel': typical,
  'parallelLimit': typical,
  'priorityQueue': typical,
  'queue': worker,
  'race': typical,
  'retry': typical,
  'retryable': typical,
  'seq': typical,
  'series': typical,
  'times': typical,
  'timesLimit': typical,
  'timesSeries': typical,
  'until': loop,
  'waterfall': typical,
  'whilst': loop
};
