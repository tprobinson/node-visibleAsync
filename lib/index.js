'use strict';
const async = require('async');

const functionConfigs = require('./functionConfigs');
const wrapFunctions = require('./wrapFunctions');

function fuzzyMatch(matchKey, item) {
  switch(matchKey) {
  default: return matchKey === typeof item;
  case 'any': return true;
  case 'collection': return Symbol.iterator in item || item.constructor.name === 'Object';
  }
}

/**
 * Produce a new function that wraps its arguments appropriately.
 * @method composeNewAsyncFunction
 * @param  {function} originalFunction
 * @param  {string}   funcName
 * @param  {function} logFunction
 * @param  {array}    argOrder An array of keys that correspond to function names in {@link wrapFunctions}
 * @return {function} A wrapped function
 */
function composeNewAsyncFunction(originalFunction, funcName, logFunction, argOrder) {
  return (...args) => {
    const functionConfig = functionConfigs[funcName];

    // Find the first "signature" that the arguments match.
    functionConfig = functionConfig.find(conf => {
      if( conf.match.length !== args.length ) { return false; }
      for( let i = 0; i < conf.match.length; i++ ) {
        if( !fuzzyMatch(conf.match[i], args[i]) ) {
          return false;
        }
      }
      return true;
    }).wrap;

    // Create a new set of arguments, wrapped by whatever functionConfig says.
    const newArgs = [];
    for( let i = 0; i < functionConfig.wrap.length; i++ ) {
      newArgs.push(
        wrapFunctions[functionConfig.wrap[i]]( funcName, logFunction, args[i] )
      );
    }

    return originalFunction(...newArgs);
  };
}

/**
 * Initialize the module with a logging function, it will give you a new set of wrapped functions.
 * @method exports
 * @param  {function} [logFunc=console.log] A logging function. Defaults to console.log if none is provided.
 * @return {object} A monkeypatched version of async.
 */
module.exports = (logFunc = console.log) => {
  // For each function we can wrap, apply a specific type of wrapping per type of argument.
  const wrappedFunctions = Object.keys(functionConfigs).reduce((newFuncs, funcName) => {
    if( funcName in async ) {
      newFuncs[funcName] = composeNewAsyncFunction(async[funcName], funcName, logFunc);
    }
  }, {});

  // The final monkeypatch.
  return Object.assign({}, async, wrappedFunctions);
};
