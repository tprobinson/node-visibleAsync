module.exports = {
  collection: (funcName, logFunc, originalCollection) => {
    logFunc(`Collection(${originalCollection.constructor.name}) for ${funcName}:`, originalCollection);
    return originalCollection;
  },

  limit: (funcName, logFunc, originalLimit) => {
    logFunc(`Limit provided for ${funcName}: `, originalLimit);
    return originalLimit;
  },

  iteratee: (funcName, logFunc, originalFunction) => (...args) => {
    logFunc(`Iterating in ${funcName}. Arguments:`, ...args);
    return originalFunction(...args);
  },

  memo: (funcName, logFunc, originalMemo) => {
    logFunc(`${funcName} iteration beginning with:`, originalMemo);
    return originalMemo;
  },

  iterateeTransformsValue: (funcName, logFunc, originalFunction) => (...args) => {
    const originalCallback = args.pop();
    try {
      originalFunction((err, transformed) => {
        if( err ) {
          logFunc('Iteratee returned an error when processing:', ...args, ' Error:', err, transformed);
        } else {
          logFunc(`${funcName} iteration:`, ...args, ' → ', transformed);
        }

        originalCallback(err, transformed);
      });
    } catch(e) {
      logFunc(`Iteratee for ${funcName} threw an error when processing:`, value, 'Error:', e);
      throw e;
    }
  },

  callback: (funcName, logFunc, originalCallback) => (...cbargs) => {
    logFunc(`Callback for ${funcName} called. Arguments:`, ...cbargs);
    return originalCallback(...cbargs);
  }
};
