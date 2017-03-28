// Common argument configurations, broken down by function signature.
module.exports = {
  iterate: [{
    match: ['collection', 'function', 'function'],
    wrap: ['collection', 'iteratee', 'callback']
  }, {
    match: ['collection', 'function'],
    wrap: ['collection', 'iteratee']
  }],
  iterateLimited: [{
    match: ['collection', 'number', 'function', 'function'],
    wrap: ['collection', 'limit', 'iteratee', 'callback']
  }, {
    match: ['collection', 'number', 'function'],
    wrap: ['collection', 'limit', 'iteratee']
  }],

  truthy: [{
    match: ['collection', 'function', 'function'],
    wrap: ['collection', 'iterateeReturnsTruth', 'callback']
  }, {
    match: ['collection', 'function'],
    wrap: ['collection', 'iterateeReturnsTruth']
  }],
  truthyLimited: [{
    match: ['collection', 'number', 'function', 'function'],
    wrap: ['collection', 'limit', 'iterateeReturnsTruth', 'callback']
  }, {
    match: ['collection', 'number', 'function'],
    wrap: ['collection', 'limit', 'iterateeReturnsTruth']
  }],

  noReturn: [{
    match: ['collection', 'function', 'function'],
    wrap: ['collection', 'iterateeReturnsTruth', 'callback']
  }, {
    match: ['collection', 'function'],
    wrap: ['collection', 'iterateeReturnsTruth']
  }],
  noReturnLimited: [{
    match: ['collection', 'number', 'function', 'function'],
    wrap: ['collection', 'limit', 'iterateeNoReturn', 'callback']
  }, {
    match: ['collection', 'number', 'function'],
    wrap: ['collection', 'limit', 'iterateeNoReturn']
  }],

  mutates: [{
    match: ['collection', 'function', 'function'],
    wrap: ['collection', 'iterateeReturnsTruth', 'callback']
  }, {
    match: ['collection', 'function'],
    wrap: ['collection', 'iterateeReturnsTruth']
  }],
  mutatesLimited: [{
    match: ['collection', 'any', 'function', 'function'],
    wrap: ['collection', 'limit', 'iterateeTransformsValue', 'callback']
  }, {
    match: ['collection', 'any', 'function'],
    wrap: ['collection', 'limit', 'iterateeTransformsValue']
  }],

  transforms: [{
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
  }],

  taskList: [{
    match: ['object', 'number', 'function'],
    wrap: ['tasks', 'limit', 'callback']
  }, {
    match: ['object', 'function'],
    wrap: ['tasks', 'callback']
  }, {
    match: ['object'],
    wrap: ['tasks']
  }],

  autoTasks: [{
    match: ['any', 'number', 'function'],
    wrap: ['autoTasks', 'limit', 'callback']
  }, {
    match: ['any', 'function'],
    wrap: ['autoTasks', 'callback']
  }, {
    match: ['any', 'number'],
    wrap: ['autoTasks', 'limit']
  }, {
    match: ['any'],
    wrap: ['autoTasks']
  }],

  worker: [{
    match: ['function', 'number'],
    wrap: ['worker', 'limit']
  }, {
    match: ['function'],
    wrap: ['worker']
  }],

  doLoop: [{
    match: ['function', 'function', 'function'],
    wrap: ['iterateeOnlyCallback', 'iterateeReturnsTruth', 'callback']
  }, {
    match: ['function', 'function'],
    wrap: ['iterateeOnlyCallback', 'iterateeReturnsTruth']
  }],

  loop: [{
    match: ['function', 'function', 'function'],
    wrap: ['iterateeReturnsTruth', 'iterateeOnlyCallback', 'callback']
  }, {
    match: ['function', 'function'],
    wrap: ['iterateeReturnsTruth', 'iterateeOnlyCallback']
  }],

  forever: [{
    match: ['function', 'function'],
    wrap: ['iterateeOnlyCallback', 'callback']
  }, {
    match: ['function'],
    wrap: ['iterateeOnlyCallback']
  }],

  retry: [{
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
  }],

  times: [{
    match: ['number', 'function', 'function'],
    wrap: ['timesCount', 'iteratee', 'callback']
  }]
};
