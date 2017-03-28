const _iteratee = (type, funcName, logFunc, originalFunction) => (...args) => {
  const originalCallback = args.pop();

  const wrappedCallback = (err, returned) => {
    // Process what the iteratee returned.
    // If we only have a callback, the iteratee wasn't given a value to change.
    if( err ) {
      if( args.length > 0 ) {
        logFunc(`${funcName}: iteratee${type} returned an error:`, err, returned);
      }
      logFunc(`${funcName}: iteratee${type} returned an error when processing:`, ...args, ' Error:', err, returned);
    } else {
      if( args.length > 0 ) {
        logFunc(`${funcName}: iteration${type}:`, returned);
      }
      logFunc(`${funcName}: iteration${type}:`, ...args, ' → ', returned);
    }

    originalCallback(err, returned);
  };

  // Assemble args to pass to the real iteratee to execute it.
  const newArgs = [];
  if( args.length > 0 ) {
    newArgs.push(...args);
  }
  newArgs.push(wrappedCallback);

  // Execute it in a try/catch.
  try {
    originalFunction(...newArgs);
  } catch(e) {
    if( args.length > 0 ) {
      logFunc(`${funcName}: iteratee${type} threw an error:`, e );
    }
    logFunc(`${funcName}: iteratee${type} threw an error when processing:`, ...args, 'Error:', e);
    throw e;
  }
};

module.exports = {
  collection: (funcName, logFunc, originalCollection) => {
    logFunc(`${funcName}: Collection of type ${originalCollection.constructor.name} provided:`, originalCollection);
    return originalCollection;
  },

  limit: (funcName, logFunc, originalLimit) => {
    logFunc(`${funcName}: Limit provided:`, originalLimit);
    return originalLimit;
  },

  memo: (funcName, logFunc, originalMemo) => {
    logFunc(`${funcName}: iteration beginning with:`, originalMemo);
    return originalMemo;
  },

  timesCount: (funcName, logFunc, originalTimes) => {
    logFunc(`${funcName}: times to execute iteratee: ${originalTimes}`);
    return originalTimes;
  },

  retryOptions: (funcName, logFunc, originalOptions) => {
    if( typeof originalOptions === 'number' ) {
      logFunc(`${funcName}: max tries for iteratee: ${originalOptions}`);
    } else {
      logFunc(`${funcName}: max tries for iteratee: ${originalOptions.times} with interval of ${originalOptions.interval}`);
      // Wrap the error filter if given one.
      if( 'errorFilter' in originalOptions ) {
        const originalFilter = originalOptions.errorFilter;
        originalOptions.errorFilter = (err) => {
          const returned = originalFilter(err);
          logFunc(`${funcName}: error filter invoked with:`, err, ' returned:', returned);
          return returned;
        };
      }
    }
    return originalOptions;
  },

  iteratee: (...args) => _iteratee('', ...args),

  iterateeOnlyCallback: (...args) => _iteratee('(Callback Only)', ...args),

  iterateeReturnsTruth: (...args) => _iteratee('(Truth Test)', ...args),

  iterateeTransformsValue: (...args) => _iteratee('(Transform)', ...args),

  worker: (...args) => _iteratee('(Worker)', ...args),

  tasks: (funcName, logFunc, originalTasks) => {
    if( Array.isArray(originalTasks) ) {

    }

    return originalTasks;
  },

  callback: (funcName, logFunc, originalCallback) => (...cbargs) => {
    logFunc(`${funcName}: Callback called. Arguments:`, ...cbargs);
    return originalCallback(...cbargs);
  }
};
