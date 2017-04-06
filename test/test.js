/* global describe:false */
const assert = require('chai').assert;
const visibleasync = require('../lib/index.js');

const functionConfigs = require('../lib/functionConfigs.js');

const multiSymbol = Symbol('multipleArgs');
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-depth */

let async;

const nonce = 'test';
function getRand(max = 100) {
  return Math.floor(Math.random() * max);
}

function getTestString() {
  return nonce + getRand();
}

let logBuffer = [];
function logFunction(...logs) {
  logBuffer.push(logs);
}

function getLogs() {
  const logs = logBuffer;
  logBuffer = [];
  return logs;
}

function findPermutations(obj) {
  // If an argument type has multiple possibilities, it will return a function.
  // With those functions, we generate additional argument sets.
  let perms = {};

  // Find the permutors and get their permutations.
  Object.keys(obj).forEach(key => {
    if( 'multiSymbol' in obj[key] && obj[key].multiSymbol === multiSymbol ) {
      perms[key] = obj[key];
      delete obj[key];
      delete perms[key].multiSymbol;
    }
  });

  if( Object.keys(perms).length === 0 ) {
    return [obj];
  }

  const permute = (keys) => {
    const key = keys.shift();
    const mySet = perms[key].map(p => ({[key]: p}));

    if( keys.length === 0 ) {
      return mySet;
    }

    const myResults = [];
    permute(keys).forEach(set => mySet.forEach(mine => myResults.push(Object.assign({}, mine, set))));
    return myResults;
  };

  return permute(Object.keys(perms)).map(subSet => Object.assign(subSet, obj));
}

function createAllTests(funcName, providedParts, providedFuncs) {
  let tests = [];
  functionConfigs[funcName].forEach(sig => {
    let argSet = Object.assign({}, providedParts);

    // Provide a default if the argument type doesn't exist in our parts.
    sig.wrap.forEach(argType => {
      if( !(argType in argSet) ) {
        if( /^(autoTasks|tasks|collection)$/.test(argType) ) {
          // We can just use a common name for all these "object of the function" types.
          if( 'object' in argSet ) {
            argSet[argType] = argSet.object; return;
          } else if( 'collection' in argSet ) {
            argSet[argType] = argSet.collection; return;
          }
          throw new Error('Required argument type not specified: ' + argType);
        } else if ( /^iteratee\w*$/.test(argType) ) {
          // If we have a special iteratee, we can also use the plain name for it.
          if( !('mutate' in argSet) ) {
            throw new Error('Mutator required');
          }
          argSet[argType] = [
            (...args) => {const cb = args.pop(); cb(null, argSet.mutate(args));},
            (...args) => {const cb = args.pop(); cb(argSet.mutate(args));},
            () => {console.log('I am a problem function')}
          ];
          argSet[argType].multiSymbol = multiSymbol;
          return;
        }

        let replacement;
        switch(argType) {
        default: throw new Error('Required argument type: ' + argType);

        // Memo isn't easily replaced. Just let the iteratee specify.
        case 'memo': replacement = null; break;

        // Generate multiple tests for each possible retryOption.
        case 'retryOptions': replacement = [1, 5, {}, {times: 1, interval: 0}, {times: 5, interval: 0}, {times: 1, interval: 100}, {times: 5, interval: 100}]; replacement.multiSymbol = multiSymbol; break;

        // Generate a couple of limit cases.
        case 'limit': replacement = [1, 5, getRand(10) + 1, getRand(10) + 1, getRand(10) + 1]; replacement.multiSymbol = multiSymbol; break;

        // Generate a couple of timesCount cases.
        case 'timesCount': replacement = [1, 5, getRand(10) + 1, getRand(10) + 1, getRand(10) + 1]; replacement.multiSymbol = multiSymbol; break;

        // Fill in several callbacks for each type of test.
        case 'callback':
          if( !('successCallback' in argSet) ) {
            if( !('successTest' in argSet) ) {
              throw new Error('No successCallback specified, and no successTest given.');
            }

            argSet.successCallback = (err, results) => {
              assert.isNull(err);
              argSet.successTest(results);
            };
          }

          if( !('errorCallback' in argSet) ) {
            if( !('errorTest' in argSet) ) {
              throw new Error('No errorCallback specified, and no errorTest given.');
            }

            argSet.errorCallback = (err, results) => {
              assert.isNotNull(err);
              if( 'errorString' in argSet ) {
                assert.equal(err, argSet.errorString);
              }
              argSet.errorTest(results);
            };
          }

          if( !('throwCallback' in argSet) ) {
            argSet.throwCallback = () => assert.fail(0, 1, 'should not reach this code.');
          }
          break;
        }

        if( replacement ) {
          argSet[argType] = replacement;
        }
      }
    });

    tests = tests.concat(findPermutations(argSet));
  });

  return tests;
}

function fullTestFunction(funcName, parts, funcs) {
  // Get all of our argument sets
  const argSets = createAllTests(funcName, parts, funcs);
  console.log(`Running ${argSets.length} tests for ${funcName}`);
  let i = 1;

  argSets.forEach(argSet => {
    const func = async[funcName];
    functionConfigs[funcName].forEach(sig => {
      const args = [];
      let hasCallback = false;
      sig.wrap.forEach(argType => {
        if( argType !== 'callback' ) {
          if( !(argType in argSet) ) {
            console.error(argType, argSet);
            throw new Error('No ' + argType + ' in argSet despite going through createAllTests');
          }
          args.push(argSet[argType]);
        } else {
          hasCallback = true;
        }
      });

      if( hasCallback ) {
        // Provide a generic callback that we'll use to determine whether we should test success or failure.
        describe(`# ${funcName} ${i}/${argSets.length}`, function () {
          console.log(...args, console.log );
          func(...args, console.log);
          console.log(JSON.stringify(getLogs(), null, '\t'));
        });
      } else {
        describe(`# ${funcName} ${i}/${argSets.length}`, function () {
          console.log(...args);
          func(...args);
          console.log(JSON.stringify(getLogs(), null, '\t'));
        });
      }

      i++;
    });
  });
}

describe('Basic', function () {
  let a;
  describe('Object Creation', function () {
    assert.doesNotThrow(function () {
      a = visibleasync(() => {});
    }, Error);
  });

  describe('Function Wrapping', function () {
    Object.keys(functionConfigs).forEach(funcName => {
      assert.property(a, funcName, `has ${funcName}`);
      assert.isNotNull(a[funcName], `has content in ${funcName}`);
      assert.isFunction(a[funcName], `${funcName} is a function`);
    });
  });
});

async = visibleasync(logFunction);
describe('Iterator Functions', function () {
  const testArray = Array.from(Array(getRand(10)), getTestString);

  describe('Concat', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutate = x => ['1', '2', '3'].map(y => x + y);

    const successResults = testArray.reduce((acc, x) => acc.concat(mutate(x)), []);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = mutate(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('concat', {object: testArray, mutate, successTest, errorTest});
    fullTestFunction('concatSeries', {object: testArray, mutate, successTest, errorTest});
  });

  describe('Detect', function () {
    // Pick a random one and let's try to find it.
    const successResults = testArray[Math.floor(Math.random() * testArray.length)];
    const iteratee = x => x === successResults;

    const successTest = results => assert.equal(results, successResults);

    const errorTest = results => assert.isUndefined(results);

    fullTestFunction('detect', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('detectLimit', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('detectSeries', {object: testArray, iteratee, successTest, errorTest});
  });
  return;
  describe('Each', function () {
    // Doesn't matter what we do here.
    const iteratee = x => x + 1;

    const successTest = results => assert.isUndefined(results);

    const errorTest = results => assert.isUndefined(results);

    fullTestFunction('each', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('eachLimit', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('eachSeries', {object: testArray, iteratee, successTest, errorTest});
  });

  describe('Each Of', function () {
    // Doesn't matter what we do here.
    const iteratee = x => x + 1;

    const successTest = results => assert.isUndefined(results);

    const errorTest = results => assert.isUndefined(results);

    fullTestFunction('eachOf', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('eachOfLimit', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('eachOfSeries', {object: testArray, iteratee, successTest, errorTest});
  });

  describe('Every', function () {
    // Check that everything is not null.
    const iteratee = x => x !== null;

    const successTest = results => assert.equal(results, true);

    const errorTest = results => assert.equal(results, false);

    fullTestFunction('every', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('everyLimit', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('everySeries', {object: testArray, iteratee, successTest, errorTest});
  });

  describe('Filter', function () {
    // Find everything that has a 5 in it.
    const iteratee = x => /5/.test(x);

    const successResults = testArray.filter(iteratee);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = iteratee(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('filter', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('filterLimit', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('filterSeries', {object: testArray, iteratee, successTest, errorTest});
  });
  return;
  describe('Group By', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const iteratee = x => ['1', '2', '3'].map(y => x + y);

    const successResults = testArray.reduce((acc, x) => acc.concat(iteratee(x)), []);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = iteratee(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('groupBy', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('groupByLimit', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('groupBySeries', {object: testArray, iteratee, successTest, errorTest});
  });

  describe('Map', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const iteratee = x => ['1', '2', '3'].map(y => x + y);

    const successResults = testArray.reduce((acc, x) => acc.concat(iteratee(x)), []);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = iteratee(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('map', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('mapLimit', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('mapSeries', {object: testArray, iteratee, successTest, errorTest});
  });

  describe('Map Values', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const iteratee = x => ['1', '2', '3'].map(y => x + y);

    const successResults = testArray.reduce((acc, x) => acc.concat(iteratee(x)), []);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = iteratee(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('mapValues', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('mapValuesLimit', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('mapValuesSeries', {object: testArray, iteratee, successTest, errorTest});
  });

  describe('Reduce', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const iteratee = x => ['1', '2', '3'].map(y => x + y);

    const successResults = testArray.reduce((acc, x) => acc.concat(iteratee(x)), []);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = iteratee(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('reduce', {object: testArray, iteratee, successTest, errorTest});
  });

  describe('Reduce Right', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const iteratee = x => ['1', '2', '3'].map(y => x + y);

    const successResults = testArray.reduce((acc, x) => acc.concat(iteratee(x)), []);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = iteratee(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('reduceRight', {object: testArray, iteratee, successTest, errorTest});
  });

  describe('Reject', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const iteratee = x => ['1', '2', '3'].map(y => x + y);

    const successResults = testArray.reduce((acc, x) => acc.concat(iteratee(x)), []);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = iteratee(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('reject', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('rejectLimit', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('rejectSeries', {object: testArray, iteratee, successTest, errorTest});
  });

  describe('Some', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const iteratee = x => ['1', '2', '3'].map(y => x + y);

    const successResults = testArray.reduce((acc, x) => acc.concat(iteratee(x)), []);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = iteratee(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('some', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('someLimit', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('someSeries', {object: testArray, iteratee, successTest, errorTest});
  });

  describe('Sort By', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const iteratee = x => ['1', '2', '3'].map(y => x + y);

    const successResults = testArray.reduce((acc, x) => acc.concat(iteratee(x)), []);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = iteratee(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('sortBy', {object: testArray, iteratee, successTest, errorTest});
  });

  describe('Transform', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const iteratee = x => ['1', '2', '3'].map(y => x + y);

    const successResults = testArray.reduce((acc, x) => acc.concat(iteratee(x)), []);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = iteratee(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('transform', {object: testArray, iteratee, successTest, errorTest});
  });
});

describe('Control Flow Functions', function () {
  describe('Auto', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const iteratee = x => ['1', '2', '3'].map(y => x + y);

    const successResults = testArray.reduce((acc, x) => acc.concat(iteratee(x)), []);
    const successTest = results => assert.includeMembers(results, successResults);

    const errorResults = iteratee(testArray[0]);
    const errorTest = results => assert.includeMembers(results, errorResults);

    fullTestFunction('auto', {object: testArray, iteratee, successTest, errorTest});
    fullTestFunction('autoInject', {object: testArray, iteratee, successTest, errorTest});
  });
});

//       // Control flow functions
//       // applyEach
//       // applyEachSeries
//       auto: autoTasks,
//       autoInject: autoTasks,
//       cargo: worker,
//       // 'compose'
//       doDuring: doLoop,
//       doUntil: doLoop,
//       doWhilst: doLoop,
//       during: loop,
//       forever: forever,
//       parallel: taskList,
//       parallelLimit: taskList,
//       priorityQueue: worker,
//       queue: worker,
//       race: taskList,
//       retry: retry,
//       retryable: retry,
//       // seq
//       series: taskList,
//       times: times,
//       timesLimit: times,
//       timesSeries: times,
//       until: loop,
//       waterfall: taskList,
//       whilst: loop
//     };
