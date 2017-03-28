/* global describe:false */
const assert = require('chai').assert;
const visibleasync = require('../lib/index.js');

const functionConfigs = require('../lib/functionConfigs.js');
const functionSignatures = require('../lib/functionSignatures.js');
/* eslint-disable max-nested-callbacks */

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

function shouldSucceed(func, start, mutation, resultsTest) {
  describe('# Should Succeed', function () {
    func(start, (x, cb) => cb(null, mutation(x)), (err, results) => {
      assert.isNull(err);
      resultsTest(results);
    });
  });
}

function shouldError(func, start, mutation, resultsTest) {
  const errorString = getTestString();
  describe('# Should Fail', function () {
    func(start, (x, cb) => cb(errorString, mutation(x)), (err, results) => {
      assert.isNotNull(err);
      assert.equal(err, errorString);
      resultsTest(results);
    });
  });
}

function shouldThrow(func, start, expectedError) {
  describe('# Should Throw', function () {
    assert.throws(function () {
      func(start, () => {throw new Error(expectedError);}, () => assert.fail(0, 1, 'should not reach this code.'));
    }, Error, expectedError);
  });
}

function fullTestFunction(funcName, testObject, mutation, expectedTest, errorTest) {
  const func = async[funcName];
  shouldSucceed(func, testObject, mutation, expectedTest);
  console.log(JSON.stringify(getLogs(), null, '\t'));
  shouldError(func, testObject, mutation, errorTest);
  console.log(JSON.stringify(getLogs(), null, '\t'));
  shouldThrow(func, testObject, mutation);
  console.log(JSON.stringify(getLogs(), null, '\t'));
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
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('concat', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('concatSeries', testArray, mutation, expectedTest, errorTest);
  });

  describe('Detect', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('detect', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('detectLimit', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('detectSeries', testArray, mutation, expectedTest, errorTest);
  });

  describe('Each', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('each', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('eachLimit', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('eachSeries', testArray, mutation, expectedTest, errorTest);
  });

  describe('Each Of', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('eachOf', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('eachOfLimit', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('eachOfSeries', testArray, mutation, expectedTest, errorTest);
  });

  describe('Every', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('every', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('everyLimit', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('everySeries', testArray, mutation, expectedTest, errorTest);
  });

  describe('Filter', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('filter', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('filterLimit', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('filterSeries', testArray, mutation, expectedTest, errorTest);
  });

  describe('Group By', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('groupBy', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('groupByLimit', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('groupBySeries', testArray, mutation, expectedTest, errorTest);
  });

  describe('Map', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('map', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('mapLimit', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('mapSeries', testArray, mutation, expectedTest, errorTest);
  });

  describe('Map Values', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('mapValues', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('mapValuesLimit', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('mapValuesSeries', testArray, mutation, expectedTest, errorTest);
  });

  describe('Reduce', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('reduce', testArray, mutation, expectedTest, errorTest);
  });

  describe('Reduce Right', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('reduceRight', testArray, mutation, expectedTest, errorTest);
  });

  describe('Reject', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('reject', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('rejectLimit', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('rejectSeries', testArray, mutation, expectedTest, errorTest);
  });

  describe('Some', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('some', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('someLimit', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('someSeries', testArray, mutation, expectedTest, errorTest);
  });

  describe('Sort By', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('sortBy', testArray, mutation, expectedTest, errorTest);
  });

  describe('Transform', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('transform', testArray, mutation, expectedTest, errorTest);
  });
});

describe('Control Flow Functions', function () {
  describe('Auto', function () {
    // Create three entries for every entry, which are the originals with 1, 2, 3 added in.
    const mutation = (x) => ['1', '2', '3'].map(y => x + y);

    const expectedResults = testArray.reduce((acc, x) => acc.concat(mutation(x)), []);
    const expectedTest = (results) => assert.includeMembers(results, expectedResults);

    const errorResults = mutation(testArray[0]);
    const errorTest = (results) => assert.includeMembers(results, errorResults);

    fullTestFunction('auto', testArray, mutation, expectedTest, errorTest);
    fullTestFunction('autoInject', testArray, mutation, expectedTest, errorTest);
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
