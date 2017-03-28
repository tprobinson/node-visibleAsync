/**
 * A function to wrap a callback-based function. Accounts for polymorphic arguments as well as it can.
 * @throws Error
 * @param   {string} type             A description of this iteratee
 * @param   {string} funcName         A category for the messages
 * @param   {function} logFunc
 * @param   {function} originalFunction The original function. Any errors thrown are re-thrown.
 * @returns {function}                  The wrapped function.
 */
const _iteratee = (type, funcName, logFunc, originalFunction) => (...args) => {
  const originalCallback = args.pop();

  const wrappedCallback = (err, returned) => {
    // Process what the iteratee returned.
    // If we only have a callback, the iteratee wasn't given a value to change.
    if( err ) {
      if( args.length > 0 ) {
        logFunc(`${funcName}: ${type} returned an error:`, err, returned);
      }
      logFunc(`${funcName}: ${type} returned an error when processing:`, ...args, 'Error:', err, returned);
    } else {
      if( args.length > 0 ) {
        logFunc(`${funcName}: ${type}:`, returned);
      }
      logFunc(`${funcName}: ${type}:`, ...args, '→', returned);
    }

    originalCallback(err, returned);
  };

  // Assemble args to pass to the real iteratee to execute it.
  const newArgs = [...args, wrappedCallback];

  // Execute it in a try/catch.
  try {
    originalFunction(...newArgs);
  } catch(e) {
    if( args.length > 0 ) {
      logFunc(`${funcName}: ${type} threw an error:`, e );
    }
    logFunc(`${funcName}: ${type} threw an error when processing:`, ...args, 'Error:', e);
    throw e;
  }
};

module.exports = {
  /**
   * Displays the collection passed in.
   * @param   {string} funcName         A category for the messages
   * @param   {function} logFunc
   * @param   {any} originalCollection The original iterable object.
   * @returns {any}
   */
  collection: (funcName, logFunc, originalCollection) => {
    logFunc(`${funcName}: Collection of type ${originalCollection.constructor.name} provided:`, originalCollection);
    return originalCollection;
  },

  /**
   * Displays a concurrency limit.
   * @param   {string} funcName         A category for the messages
   * @param   {function} logFunc
   * @param   {number} originalLimit The original limit.
   * @returns {number}
   */
  limit: (funcName, logFunc, originalLimit) => {
    logFunc(`${funcName}: Limit provided:`, originalLimit);
    return originalLimit;
  },

  /**
   * Displays a memo/accumulator.
   * @param   {string} funcName         A category for the messages
   * @param   {function} logFunc
   * @param   {any} originalMemo The original memo/accumulator.
   * @returns {any}
   */
  memo: (funcName, logFunc, originalMemo) => {
    logFunc(`${funcName}: iteration beginning with:`, originalMemo);
    return originalMemo;
  },

  /**
   * Displays an iteration count.
   * @param   {string} funcName         A category for the messages
   * @param   {function} logFunc
   * @param   {number} originalTimes The original number.
   * @returns {number}
   */
  timesCount: (funcName, logFunc, originalTimes) => {
    logFunc(`${funcName}: times to execute iteratee: ${originalTimes}`);
    return originalTimes;
  },

  /**
   * [retryOptions description]
   * @param   {string} funcName         A category for the messages
   * @param   {function} logFunc
   * @param   {number|object} originalOptions Either a number, or a retry options object.
   * @returns {number|object}
   */
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
          logFunc(`${funcName}: error filter invoked with:`, err, 'returned:', returned);
          return returned;
        };
      }
    }
    return originalOptions;
  },

  /**
   * The most generic iteratee type.
   * @param   {array} args Passed to {@link _iteratee}
   */
  iteratee: (...args) => _iteratee('iteratee', ...args),

  /**
   * An iteratee that only takes a callback.
   * @param   {array} args Passed to {@link _iteratee}
   */
  iterateeOnlyCallback: (...args) => _iteratee('iteratee(Callback Only)', ...args),

  /**
   * An iteratee that only returns true/false
   * @param   {array} args Passed to {@link _iteratee}
   */
  iterateeReturnsTruth: (...args) => _iteratee('iteratee(Truth Test)', ...args),

  /**
   * An iteratee that mutates a value somehow
   * @param   {array} args Passed to {@link _iteratee}
   */
  iterateeTransformsValue: (...args) => _iteratee('iteratee(Transform)', ...args),

  /**
   * An iteratee that's a queue worker or something like it.
   * @param   {array} args Passed to {@link _iteratee}
   */
  worker: (...args) => _iteratee('iteratee(Worker)', ...args),

  /**
   * Wraps {@link _iteratee} by processing the auto function structure,
   * @param   {string} funcName         A category for the messages
   * @param   {function} logFunc
   * @param   {object} originalTasks The auto object of tasks.
   * @returns {object}
   */
  autoTasks: (funcName, logFunc, originalTasks) => {
    Object.keys(originalTasks).forEach(taskName => {
      if( Array.isArray(originalTasks[taskName]) ) {
        // Might do something more with dependencies here later.
        // Wrap the function at the end.
        originalTasks[taskName][originalTasks[taskName].length - 1] = _iteratee(
          `(${originalTasks[taskName].length - 2} deps) → auto:${taskName}`,
          funcName,
          logFunc,
          originalTasks[taskName][originalTasks[taskName].length - 1]
        );
      } else {
        // Wrap the function.
        originalTasks[taskName] = _iteratee(
          `auto:${taskName}`,
          funcName,
          logFunc,
          originalTasks[taskName]
        );
      }
    });

    return originalTasks;
  },

  /**
   * Wraps {@link _iteratee} to wrap every function in an array.
   * @param   {string} funcName         A category for the messages
   * @param   {function} logFunc
   * @param   {array} originalTasks The tasks to wrap.
   * @returns {array}
   */
  tasks: (funcName, logFunc, originalTasks) => originalTasks.map(task => _iteratee('task', funcName, logFunc, task)),

  /**
   * Wraps a callback to present the final results of an async.
   * @param   {string} funcName         A category for the messages
   * @param   {function} logFunc
   * @param   {function} originalCallback
   * @returns {function}
   */
  callback: (funcName, logFunc, originalCallback) => (...cbargs) => {
    logFunc(`${funcName}: Callback called. Arguments:`, ...cbargs);
    return originalCallback(...cbargs);
  }
};
