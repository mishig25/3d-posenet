// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({23:[function(require,module,exports) {
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],33:[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],22:[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],14:[function(require,module,exports) {
var global = (1,eval)("this");
var process = require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};

// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function (fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;
exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = undefined || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }
  return debugs[set];
};

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};

  array.forEach(function (val, idx) {
    hash[val] = true;
  });

  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) &&
  // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect &&
  // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
},{"./support/isBuffer":23,"inherits":33,"process":22}],11:[function(require,module,exports) {
// Released under MIT license
// Copyright (c) 2009-2010 Dominic Baggott
// Copyright (c) 2009-2010 Ash Berlin
// Copyright (c) 2011 Christoph Dorn <christoph@christophdorn.com> (http://www.christophdorn.com)

/*jshint browser:true, devel:true */

(function( expose ) {

/**
 *  class Markdown
 *
 *  Markdown processing in Javascript done right. We have very particular views
 *  on what constitutes 'right' which include:
 *
 *  - produces well-formed HTML (this means that em and strong nesting is
 *    important)
 *
 *  - has an intermediate representation to allow processing of parsed data (We
 *    in fact have two, both as [JsonML]: a markdown tree and an HTML tree).
 *
 *  - is easily extensible to add new dialects without having to rewrite the
 *    entire parsing mechanics
 *
 *  - has a good test suite
 *
 *  This implementation fulfills all of these (except that the test suite could
 *  do with expanding to automatically run all the fixtures from other Markdown
 *  implementations.)
 *
 *  ##### Intermediate Representation
 *
 *  *TODO* Talk about this :) Its JsonML, but document the node names we use.
 *
 *  [JsonML]: http://jsonml.org/ "JSON Markup Language"
 **/
var Markdown = expose.Markdown = function(dialect) {
  switch (typeof dialect) {
    case "undefined":
      this.dialect = Markdown.dialects.Gruber;
      break;
    case "object":
      this.dialect = dialect;
      break;
    default:
      if ( dialect in Markdown.dialects ) {
        this.dialect = Markdown.dialects[dialect];
      }
      else {
        throw new Error("Unknown Markdown dialect '" + String(dialect) + "'");
      }
      break;
  }
  this.em_state = [];
  this.strong_state = [];
  this.debug_indent = "";
};

/**
 *  parse( markdown, [dialect] ) -> JsonML
 *  - markdown (String): markdown string to parse
 *  - dialect (String | Dialect): the dialect to use, defaults to gruber
 *
 *  Parse `markdown` and return a markdown document as a Markdown.JsonML tree.
 **/
expose.parse = function( source, dialect ) {
  // dialect will default if undefined
  var md = new Markdown( dialect );
  return md.toTree( source );
};

/**
 *  toHTML( markdown, [dialect]  ) -> String
 *  toHTML( md_tree ) -> String
 *  - markdown (String): markdown string to parse
 *  - md_tree (Markdown.JsonML): parsed markdown tree
 *
 *  Take markdown (either as a string or as a JsonML tree) and run it through
 *  [[toHTMLTree]] then turn it into a well-formated HTML fragment.
 **/
expose.toHTML = function toHTML( source , dialect , options ) {
  var input = expose.toHTMLTree( source , dialect , options );

  return expose.renderJsonML( input );
};

/**
 *  toHTMLTree( markdown, [dialect] ) -> JsonML
 *  toHTMLTree( md_tree ) -> JsonML
 *  - markdown (String): markdown string to parse
 *  - dialect (String | Dialect): the dialect to use, defaults to gruber
 *  - md_tree (Markdown.JsonML): parsed markdown tree
 *
 *  Turn markdown into HTML, represented as a JsonML tree. If a string is given
 *  to this function, it is first parsed into a markdown tree by calling
 *  [[parse]].
 **/
expose.toHTMLTree = function toHTMLTree( input, dialect , options ) {
  // convert string input to an MD tree
  if ( typeof input ==="string" ) input = this.parse( input, dialect );

  // Now convert the MD tree to an HTML tree

  // remove references from the tree
  var attrs = extract_attr( input ),
      refs = {};

  if ( attrs && attrs.references ) {
    refs = attrs.references;
  }

  var html = convert_tree_to_html( input, refs , options );
  merge_text_nodes( html );
  return html;
};

// For Spidermonkey based engines
function mk_block_toSource() {
  return "Markdown.mk_block( " +
          uneval(this.toString()) +
          ", " +
          uneval(this.trailing) +
          ", " +
          uneval(this.lineNumber) +
          " )";
}

// node
function mk_block_inspect() {
  var util = require("util");
  return "Markdown.mk_block( " +
          util.inspect(this.toString()) +
          ", " +
          util.inspect(this.trailing) +
          ", " +
          util.inspect(this.lineNumber) +
          " )";

}

var mk_block = Markdown.mk_block = function(block, trail, line) {
  // Be helpful for default case in tests.
  if ( arguments.length == 1 ) trail = "\n\n";

  var s = new String(block);
  s.trailing = trail;
  // To make it clear its not just a string
  s.inspect = mk_block_inspect;
  s.toSource = mk_block_toSource;

  if ( line != undefined )
    s.lineNumber = line;

  return s;
};

function count_lines( str ) {
  var n = 0, i = -1;
  while ( ( i = str.indexOf("\n", i + 1) ) !== -1 ) n++;
  return n;
}

// Internal - split source into rough blocks
Markdown.prototype.split_blocks = function splitBlocks( input, startLine ) {
  input = input.replace(/(\r\n|\n|\r)/g, "\n");
  // [\s\S] matches _anything_ (newline or space)
  // [^] is equivalent but doesn't work in IEs.
  var re = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,
      blocks = [],
      m;

  var line_no = 1;

  if ( ( m = /^(\s*\n)/.exec(input) ) != null ) {
    // skip (but count) leading blank lines
    line_no += count_lines( m[0] );
    re.lastIndex = m[0].length;
  }

  while ( ( m = re.exec(input) ) !== null ) {
    if (m[2] == "\n#") {
      m[2] = "\n";
      re.lastIndex--;
    }
    blocks.push( mk_block( m[1], m[2], line_no ) );
    line_no += count_lines( m[0] );
  }

  return blocks;
};

/**
 *  Markdown#processBlock( block, next ) -> undefined | [ JsonML, ... ]
 *  - block (String): the block to process
 *  - next (Array): the following blocks
 *
 * Process `block` and return an array of JsonML nodes representing `block`.
 *
 * It does this by asking each block level function in the dialect to process
 * the block until one can. Succesful handling is indicated by returning an
 * array (with zero or more JsonML nodes), failure by a false value.
 *
 * Blocks handlers are responsible for calling [[Markdown#processInline]]
 * themselves as appropriate.
 *
 * If the blocks were split incorrectly or adjacent blocks need collapsing you
 * can adjust `next` in place using shift/splice etc.
 *
 * If any of this default behaviour is not right for the dialect, you can
 * define a `__call__` method on the dialect that will get invoked to handle
 * the block processing.
 */
Markdown.prototype.processBlock = function processBlock( block, next ) {
  var cbs = this.dialect.block,
      ord = cbs.__order__;

  if ( "__call__" in cbs ) {
    return cbs.__call__.call(this, block, next);
  }

  for ( var i = 0; i < ord.length; i++ ) {
    //D:this.debug( "Testing", ord[i] );
    var res = cbs[ ord[i] ].call( this, block, next );
    if ( res ) {
      //D:this.debug("  matched");
      if ( !isArray(res) || ( res.length > 0 && !( isArray(res[0]) ) ) )
        this.debug(ord[i], "didn't return a proper array");
      //D:this.debug( "" );
      return res;
    }
  }

  // Uhoh! no match! Should we throw an error?
  return [];
};

Markdown.prototype.processInline = function processInline( block ) {
  return this.dialect.inline.__call__.call( this, String( block ) );
};

/**
 *  Markdown#toTree( source ) -> JsonML
 *  - source (String): markdown source to parse
 *
 *  Parse `source` into a JsonML tree representing the markdown document.
 **/
// custom_tree means set this.tree to `custom_tree` and restore old value on return
Markdown.prototype.toTree = function toTree( source, custom_root ) {
  var blocks = source instanceof Array ? source : this.split_blocks( source );

  // Make tree a member variable so its easier to mess with in extensions
  var old_tree = this.tree;
  try {
    this.tree = custom_root || this.tree || [ "markdown" ];

    blocks:
    while ( blocks.length ) {
      var b = this.processBlock( blocks.shift(), blocks );

      // Reference blocks and the like won't return any content
      if ( !b.length ) continue blocks;

      this.tree.push.apply( this.tree, b );
    }
    return this.tree;
  }
  finally {
    if ( custom_root ) {
      this.tree = old_tree;
    }
  }
};

// Noop by default
Markdown.prototype.debug = function () {
  var args = Array.prototype.slice.call( arguments);
  args.unshift(this.debug_indent);
  if ( typeof print !== "undefined" )
      print.apply( print, args );
  if ( typeof console !== "undefined" && typeof console.log !== "undefined" )
      console.log.apply( null, args );
}

Markdown.prototype.loop_re_over_block = function( re, block, cb ) {
  // Dont use /g regexps with this
  var m,
      b = block.valueOf();

  while ( b.length && (m = re.exec(b) ) != null ) {
    b = b.substr( m[0].length );
    cb.call(this, m);
  }
  return b;
};

/**
 * Markdown.dialects
 *
 * Namespace of built-in dialects.
 **/
Markdown.dialects = {};

/**
 * Markdown.dialects.Gruber
 *
 * The default dialect that follows the rules set out by John Gruber's
 * markdown.pl as closely as possible. Well actually we follow the behaviour of
 * that script which in some places is not exactly what the syntax web page
 * says.
 **/
Markdown.dialects.Gruber = {
  block: {
    atxHeader: function atxHeader( block, next ) {
      var m = block.match( /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/ );

      if ( !m ) return undefined;

      var header = [ "header", { level: m[ 1 ].length } ];
      Array.prototype.push.apply(header, this.processInline(m[ 2 ]));

      if ( m[0].length < block.length )
        next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

      return [ header ];
    },

    setextHeader: function setextHeader( block, next ) {
      var m = block.match( /^(.*)\n([-=])\2\2+(?:\n|$)/ );

      if ( !m ) return undefined;

      var level = ( m[ 2 ] === "=" ) ? 1 : 2;
      var header = [ "header", { level : level }, m[ 1 ] ];

      if ( m[0].length < block.length )
        next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

      return [ header ];
    },

    code: function code( block, next ) {
      // |    Foo
      // |bar
      // should be a code block followed by a paragraph. Fun
      //
      // There might also be adjacent code block to merge.

      var ret = [],
          re = /^(?: {0,3}\t| {4})(.*)\n?/,
          lines;

      // 4 spaces + content
      if ( !block.match( re ) ) return undefined;

      block_search:
      do {
        // Now pull out the rest of the lines
        var b = this.loop_re_over_block(
                  re, block.valueOf(), function( m ) { ret.push( m[1] ); } );

        if ( b.length ) {
          // Case alluded to in first comment. push it back on as a new block
          next.unshift( mk_block(b, block.trailing) );
          break block_search;
        }
        else if ( next.length ) {
          // Check the next block - it might be code too
          if ( !next[0].match( re ) ) break block_search;

          // Pull how how many blanks lines follow - minus two to account for .join
          ret.push ( block.trailing.replace(/[^\n]/g, "").substring(2) );

          block = next.shift();
        }
        else {
          break block_search;
        }
      } while ( true );

      return [ [ "code_block", ret.join("\n") ] ];
    },

    horizRule: function horizRule( block, next ) {
      // this needs to find any hr in the block to handle abutting blocks
      var m = block.match( /^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/ );

      if ( !m ) {
        return undefined;
      }

      var jsonml = [ [ "hr" ] ];

      // if there's a leading abutting block, process it
      if ( m[ 1 ] ) {
        jsonml.unshift.apply( jsonml, this.processBlock( m[ 1 ], [] ) );
      }

      // if there's a trailing abutting block, stick it into next
      if ( m[ 3 ] ) {
        next.unshift( mk_block( m[ 3 ] ) );
      }

      return jsonml;
    },

    // There are two types of lists. Tight and loose. Tight lists have no whitespace
    // between the items (and result in text just in the <li>) and loose lists,
    // which have an empty line between list items, resulting in (one or more)
    // paragraphs inside the <li>.
    //
    // There are all sorts weird edge cases about the original markdown.pl's
    // handling of lists:
    //
    // * Nested lists are supposed to be indented by four chars per level. But
    //   if they aren't, you can get a nested list by indenting by less than
    //   four so long as the indent doesn't match an indent of an existing list
    //   item in the 'nest stack'.
    //
    // * The type of the list (bullet or number) is controlled just by the
    //    first item at the indent. Subsequent changes are ignored unless they
    //    are for nested lists
    //
    lists: (function( ) {
      // Use a closure to hide a few variables.
      var any_list = "[*+-]|\\d+\\.",
          bullet_list = /[*+-]/,
          number_list = /\d+\./,
          // Capture leading indent as it matters for determining nested lists.
          is_list_re = new RegExp( "^( {0,3})(" + any_list + ")[ \t]+" ),
          indent_re = "(?: {0,3}\\t| {4})";

      // TODO: Cache this regexp for certain depths.
      // Create a regexp suitable for matching an li for a given stack depth
      function regex_for_depth( depth ) {

        return new RegExp(
          // m[1] = indent, m[2] = list_type
          "(?:^(" + indent_re + "{0," + depth + "} {0,3})(" + any_list + ")\\s+)|" +
          // m[3] = cont
          "(^" + indent_re + "{0," + (depth-1) + "}[ ]{0,4})"
        );
      }
      function expand_tab( input ) {
        return input.replace( / {0,3}\t/g, "    " );
      }

      // Add inline content `inline` to `li`. inline comes from processInline
      // so is an array of content
      function add(li, loose, inline, nl) {
        if ( loose ) {
          li.push( [ "para" ].concat(inline) );
          return;
        }
        // Hmmm, should this be any block level element or just paras?
        var add_to = li[li.length -1] instanceof Array && li[li.length - 1][0] == "para"
                   ? li[li.length -1]
                   : li;

        // If there is already some content in this list, add the new line in
        if ( nl && li.length > 1 ) inline.unshift(nl);

        for ( var i = 0; i < inline.length; i++ ) {
          var what = inline[i],
              is_str = typeof what == "string";
          if ( is_str && add_to.length > 1 && typeof add_to[add_to.length-1] == "string" ) {
            add_to[ add_to.length-1 ] += what;
          }
          else {
            add_to.push( what );
          }
        }
      }

      // contained means have an indent greater than the current one. On
      // *every* line in the block
      function get_contained_blocks( depth, blocks ) {

        var re = new RegExp( "^(" + indent_re + "{" + depth + "}.*?\\n?)*$" ),
            replace = new RegExp("^" + indent_re + "{" + depth + "}", "gm"),
            ret = [];

        while ( blocks.length > 0 ) {
          if ( re.exec( blocks[0] ) ) {
            var b = blocks.shift(),
                // Now remove that indent
                x = b.replace( replace, "");

            ret.push( mk_block( x, b.trailing, b.lineNumber ) );
          }
          else {
            break;
          }
        }
        return ret;
      }

      // passed to stack.forEach to turn list items up the stack into paras
      function paragraphify(s, i, stack) {
        var list = s.list;
        var last_li = list[list.length-1];

        if ( last_li[1] instanceof Array && last_li[1][0] == "para" ) {
          return;
        }
        if ( i + 1 == stack.length ) {
          // Last stack frame
          // Keep the same array, but replace the contents
          last_li.push( ["para"].concat( last_li.splice(1, last_li.length - 1) ) );
        }
        else {
          var sublist = last_li.pop();
          last_li.push( ["para"].concat( last_li.splice(1, last_li.length - 1) ), sublist );
        }
      }

      // The matcher function
      return function( block, next ) {
        var m = block.match( is_list_re );
        if ( !m ) return undefined;

        function make_list( m ) {
          var list = bullet_list.exec( m[2] )
                   ? ["bulletlist"]
                   : ["numberlist"];

          stack.push( { list: list, indent: m[1] } );
          return list;
        }


        var stack = [], // Stack of lists for nesting.
            list = make_list( m ),
            last_li,
            loose = false,
            ret = [ stack[0].list ],
            i;

        // Loop to search over block looking for inner block elements and loose lists
        loose_search:
        while ( true ) {
          // Split into lines preserving new lines at end of line
          var lines = block.split( /(?=\n)/ );

          // We have to grab all lines for a li and call processInline on them
          // once as there are some inline things that can span lines.
          var li_accumulate = "";

          // Loop over the lines in this block looking for tight lists.
          tight_search:
          for ( var line_no = 0; line_no < lines.length; line_no++ ) {
            var nl = "",
                l = lines[line_no].replace(/^\n/, function(n) { nl = n; return ""; });

            // TODO: really should cache this
            var line_re = regex_for_depth( stack.length );

            m = l.match( line_re );
            //print( "line:", uneval(l), "\nline match:", uneval(m) );

            // We have a list item
            if ( m[1] !== undefined ) {
              // Process the previous list item, if any
              if ( li_accumulate.length ) {
                add( last_li, loose, this.processInline( li_accumulate ), nl );
                // Loose mode will have been dealt with. Reset it
                loose = false;
                li_accumulate = "";
              }

              m[1] = expand_tab( m[1] );
              var wanted_depth = Math.floor(m[1].length/4)+1;
              //print( "want:", wanted_depth, "stack:", stack.length);
              if ( wanted_depth > stack.length ) {
                // Deep enough for a nested list outright
                //print ( "new nested list" );
                list = make_list( m );
                last_li.push( list );
                last_li = list[1] = [ "listitem" ];
              }
              else {
                // We aren't deep enough to be strictly a new level. This is
                // where Md.pl goes nuts. If the indent matches a level in the
                // stack, put it there, else put it one deeper then the
                // wanted_depth deserves.
                var found = false;
                for ( i = 0; i < stack.length; i++ ) {
                  if ( stack[ i ].indent != m[1] ) continue;
                  list = stack[ i ].list;
                  stack.splice( i+1, stack.length - (i+1) );
                  found = true;
                  break;
                }

                if (!found) {
                  //print("not found. l:", uneval(l));
                  wanted_depth++;
                  if ( wanted_depth <= stack.length ) {
                    stack.splice(wanted_depth, stack.length - wanted_depth);
                    //print("Desired depth now", wanted_depth, "stack:", stack.length);
                    list = stack[wanted_depth-1].list;
                    //print("list:", uneval(list) );
                  }
                  else {
                    //print ("made new stack for messy indent");
                    list = make_list(m);
                    last_li.push(list);
                  }
                }

                //print( uneval(list), "last", list === stack[stack.length-1].list );
                last_li = [ "listitem" ];
                list.push(last_li);
              } // end depth of shenegains
              nl = "";
            }

            // Add content
            if ( l.length > m[0].length ) {
              li_accumulate += nl + l.substr( m[0].length );
            }
          } // tight_search

          if ( li_accumulate.length ) {
            add( last_li, loose, this.processInline( li_accumulate ), nl );
            // Loose mode will have been dealt with. Reset it
            loose = false;
            li_accumulate = "";
          }

          // Look at the next block - we might have a loose list. Or an extra
          // paragraph for the current li
          var contained = get_contained_blocks( stack.length, next );

          // Deal with code blocks or properly nested lists
          if ( contained.length > 0 ) {
            // Make sure all listitems up the stack are paragraphs
            forEach( stack, paragraphify, this);

            last_li.push.apply( last_li, this.toTree( contained, [] ) );
          }

          var next_block = next[0] && next[0].valueOf() || "";

          if ( next_block.match(is_list_re) || next_block.match( /^ / ) ) {
            block = next.shift();

            // Check for an HR following a list: features/lists/hr_abutting
            var hr = this.dialect.block.horizRule( block, next );

            if ( hr ) {
              ret.push.apply(ret, hr);
              break;
            }

            // Make sure all listitems up the stack are paragraphs
            forEach( stack, paragraphify, this);

            loose = true;
            continue loose_search;
          }
          break;
        } // loose_search

        return ret;
      };
    })(),

    blockquote: function blockquote( block, next ) {
      if ( !block.match( /^>/m ) )
        return undefined;

      var jsonml = [];

      // separate out the leading abutting block, if any. I.e. in this case:
      //
      //  a
      //  > b
      //
      if ( block[ 0 ] != ">" ) {
        var lines = block.split( /\n/ ),
            prev = [],
            line_no = block.lineNumber;

        // keep shifting lines until you find a crotchet
        while ( lines.length && lines[ 0 ][ 0 ] != ">" ) {
            prev.push( lines.shift() );
            line_no++;
        }

        var abutting = mk_block( prev.join( "\n" ), "\n", block.lineNumber );
        jsonml.push.apply( jsonml, this.processBlock( abutting, [] ) );
        // reassemble new block of just block quotes!
        block = mk_block( lines.join( "\n" ), block.trailing, line_no );
      }


      // if the next block is also a blockquote merge it in
      while ( next.length && next[ 0 ][ 0 ] == ">" ) {
        var b = next.shift();
        block = mk_block( block + block.trailing + b, b.trailing, block.lineNumber );
      }

      // Strip off the leading "> " and re-process as a block.
      var input = block.replace( /^> ?/gm, "" ),
          old_tree = this.tree,
          processedBlock = this.toTree( input, [ "blockquote" ] ),
          attr = extract_attr( processedBlock );

      // If any link references were found get rid of them
      if ( attr && attr.references ) {
        delete attr.references;
        // And then remove the attribute object if it's empty
        if ( isEmpty( attr ) ) {
          processedBlock.splice( 1, 1 );
        }
      }

      jsonml.push( processedBlock );
      return jsonml;
    },

    referenceDefn: function referenceDefn( block, next) {
      var re = /^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/;
      // interesting matches are [ , ref_id, url, , title, title ]

      if ( !block.match(re) )
        return undefined;

      // make an attribute node if it doesn't exist
      if ( !extract_attr( this.tree ) ) {
        this.tree.splice( 1, 0, {} );
      }

      var attrs = extract_attr( this.tree );

      // make a references hash if it doesn't exist
      if ( attrs.references === undefined ) {
        attrs.references = {};
      }

      var b = this.loop_re_over_block(re, block, function( m ) {

        if ( m[2] && m[2][0] == "<" && m[2][m[2].length-1] == ">" )
          m[2] = m[2].substring( 1, m[2].length - 1 );

        var ref = attrs.references[ m[1].toLowerCase() ] = {
          href: m[2]
        };

        if ( m[4] !== undefined )
          ref.title = m[4];
        else if ( m[5] !== undefined )
          ref.title = m[5];

      } );

      if ( b.length )
        next.unshift( mk_block( b, block.trailing ) );

      return [];
    },

    para: function para( block, next ) {
      // everything's a para!
      return [ ["para"].concat( this.processInline( block ) ) ];
    }
  }
};

Markdown.dialects.Gruber.inline = {

    __oneElement__: function oneElement( text, patterns_or_re, previous_nodes ) {
      var m,
          res,
          lastIndex = 0;

      patterns_or_re = patterns_or_re || this.dialect.inline.__patterns__;
      var re = new RegExp( "([\\s\\S]*?)(" + (patterns_or_re.source || patterns_or_re) + ")" );

      m = re.exec( text );
      if (!m) {
        // Just boring text
        return [ text.length, text ];
      }
      else if ( m[1] ) {
        // Some un-interesting text matched. Return that first
        return [ m[1].length, m[1] ];
      }

      var res;
      if ( m[2] in this.dialect.inline ) {
        res = this.dialect.inline[ m[2] ].call(
                  this,
                  text.substr( m.index ), m, previous_nodes || [] );
      }
      // Default for now to make dev easier. just slurp special and output it.
      res = res || [ m[2].length, m[2] ];
      return res;
    },

    __call__: function inline( text, patterns ) {

      var out = [],
          res;

      function add(x) {
        //D:self.debug("  adding output", uneval(x));
        if ( typeof x == "string" && typeof out[out.length-1] == "string" )
          out[ out.length-1 ] += x;
        else
          out.push(x);
      }

      while ( text.length > 0 ) {
        res = this.dialect.inline.__oneElement__.call(this, text, patterns, out );
        text = text.substr( res.shift() );
        forEach(res, add )
      }

      return out;
    },

    // These characters are intersting elsewhere, so have rules for them so that
    // chunks of plain text blocks don't include them
    "]": function () {},
    "}": function () {},

    __escape__ : /^\\[\\`\*_{}\[\]()#\+.!\-]/,

    "\\": function escaped( text ) {
      // [ length of input processed, node/children to add... ]
      // Only esacape: \ ` * _ { } [ ] ( ) # * + - . !
      if ( this.dialect.inline.__escape__.exec( text ) )
        return [ 2, text.charAt( 1 ) ];
      else
        // Not an esacpe
        return [ 1, "\\" ];
    },

    "![": function image( text ) {

      // Unlike images, alt text is plain text only. no other elements are
      // allowed in there

      // ![Alt text](/path/to/img.jpg "Optional title")
      //      1          2            3       4         <--- captures
      var m = text.match( /^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/ );

      if ( m ) {
        if ( m[2] && m[2][0] == "<" && m[2][m[2].length-1] == ">" )
          m[2] = m[2].substring( 1, m[2].length - 1 );

        m[2] = this.dialect.inline.__call__.call( this, m[2], /\\/ )[0];

        var attrs = { alt: m[1], href: m[2] || "" };
        if ( m[4] !== undefined)
          attrs.title = m[4];

        return [ m[0].length, [ "img", attrs ] ];
      }

      // ![Alt text][id]
      m = text.match( /^!\[(.*?)\][ \t]*\[(.*?)\]/ );

      if ( m ) {
        // We can't check if the reference is known here as it likely wont be
        // found till after. Check it in md tree->hmtl tree conversion
        return [ m[0].length, [ "img_ref", { alt: m[1], ref: m[2].toLowerCase(), original: m[0] } ] ];
      }

      // Just consume the '!['
      return [ 2, "![" ];
    },

    "[": function link( text ) {

      var orig = String(text);
      // Inline content is possible inside `link text`
      var res = Markdown.DialectHelpers.inline_until_char.call( this, text.substr(1), "]" );

      // No closing ']' found. Just consume the [
      if ( !res ) return [ 1, "[" ];

      var consumed = 1 + res[ 0 ],
          children = res[ 1 ],
          link,
          attrs;

      // At this point the first [...] has been parsed. See what follows to find
      // out which kind of link we are (reference or direct url)
      text = text.substr( consumed );

      // [link text](/path/to/img.jpg "Optional title")
      //                 1            2       3         <--- captures
      // This will capture up to the last paren in the block. We then pull
      // back based on if there a matching ones in the url
      //    ([here](/url/(test))
      // The parens have to be balanced
      var m = text.match( /^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/ );
      if ( m ) {
        var url = m[1];
        consumed += m[0].length;

        if ( url && url[0] == "<" && url[url.length-1] == ">" )
          url = url.substring( 1, url.length - 1 );

        // If there is a title we don't have to worry about parens in the url
        if ( !m[3] ) {
          var open_parens = 1; // One open that isn't in the capture
          for ( var len = 0; len < url.length; len++ ) {
            switch ( url[len] ) {
            case "(":
              open_parens++;
              break;
            case ")":
              if ( --open_parens == 0) {
                consumed -= url.length - len;
                url = url.substring(0, len);
              }
              break;
            }
          }
        }

        // Process escapes only
        url = this.dialect.inline.__call__.call( this, url, /\\/ )[0];

        attrs = { href: url || "" };
        if ( m[3] !== undefined)
          attrs.title = m[3];

        link = [ "link", attrs ].concat( children );
        return [ consumed, link ];
      }

      // [Alt text][id]
      // [Alt text] [id]
      m = text.match( /^\s*\[(.*?)\]/ );

      if ( m ) {

        consumed += m[ 0 ].length;

        // [links][] uses links as its reference
        attrs = { ref: ( m[ 1 ] || String(children) ).toLowerCase(),  original: orig.substr( 0, consumed ) };

        link = [ "link_ref", attrs ].concat( children );

        // We can't check if the reference is known here as it likely wont be
        // found till after. Check it in md tree->hmtl tree conversion.
        // Store the original so that conversion can revert if the ref isn't found.
        return [ consumed, link ];
      }

      // [id]
      // Only if id is plain (no formatting.)
      if ( children.length == 1 && typeof children[0] == "string" ) {

        attrs = { ref: children[0].toLowerCase(),  original: orig.substr( 0, consumed ) };
        link = [ "link_ref", attrs, children[0] ];
        return [ consumed, link ];
      }

      // Just consume the "["
      return [ 1, "[" ];
    },


    "<": function autoLink( text ) {
      var m;

      if ( ( m = text.match( /^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/ ) ) != null ) {
        if ( m[3] ) {
          return [ m[0].length, [ "link", { href: "mailto:" + m[3] }, m[3] ] ];

        }
        else if ( m[2] == "mailto" ) {
          return [ m[0].length, [ "link", { href: m[1] }, m[1].substr("mailto:".length ) ] ];
        }
        else
          return [ m[0].length, [ "link", { href: m[1] }, m[1] ] ];
      }

      return [ 1, "<" ];
    },

    "`": function inlineCode( text ) {
      // Inline code block. as many backticks as you like to start it
      // Always skip over the opening ticks.
      var m = text.match( /(`+)(([\s\S]*?)\1)/ );

      if ( m && m[2] )
        return [ m[1].length + m[2].length, [ "inlinecode", m[3] ] ];
      else {
        // TODO: No matching end code found - warn!
        return [ 1, "`" ];
      }
    },

    "  \n": function lineBreak( text ) {
      return [ 3, [ "linebreak" ] ];
    }

};

// Meta Helper/generator method for em and strong handling
function strong_em( tag, md ) {

  var state_slot = tag + "_state",
      other_slot = tag == "strong" ? "em_state" : "strong_state";

  function CloseTag(len) {
    this.len_after = len;
    this.name = "close_" + md;
  }

  return function ( text, orig_match ) {

    if ( this[state_slot][0] == md ) {
      // Most recent em is of this type
      //D:this.debug("closing", md);
      this[state_slot].shift();

      // "Consume" everything to go back to the recrusion in the else-block below
      return[ text.length, new CloseTag(text.length-md.length) ];
    }
    else {
      // Store a clone of the em/strong states
      var other = this[other_slot].slice(),
          state = this[state_slot].slice();

      this[state_slot].unshift(md);

      //D:this.debug_indent += "  ";

      // Recurse
      var res = this.processInline( text.substr( md.length ) );
      //D:this.debug_indent = this.debug_indent.substr(2);

      var last = res[res.length - 1];

      //D:this.debug("processInline from", tag + ": ", uneval( res ) );

      var check = this[state_slot].shift();
      if ( last instanceof CloseTag ) {
        res.pop();
        // We matched! Huzzah.
        var consumed = text.length - last.len_after;
        return [ consumed, [ tag ].concat(res) ];
      }
      else {
        // Restore the state of the other kind. We might have mistakenly closed it.
        this[other_slot] = other;
        this[state_slot] = state;

        // We can't reuse the processed result as it could have wrong parsing contexts in it.
        return [ md.length, md ];
      }
    }
  }; // End returned function
}

Markdown.dialects.Gruber.inline["**"] = strong_em("strong", "**");
Markdown.dialects.Gruber.inline["__"] = strong_em("strong", "__");
Markdown.dialects.Gruber.inline["*"]  = strong_em("em", "*");
Markdown.dialects.Gruber.inline["_"]  = strong_em("em", "_");


// Build default order from insertion order.
Markdown.buildBlockOrder = function(d) {
  var ord = [];
  for ( var i in d ) {
    if ( i == "__order__" || i == "__call__" ) continue;
    ord.push( i );
  }
  d.__order__ = ord;
};

// Build patterns for inline matcher
Markdown.buildInlinePatterns = function(d) {
  var patterns = [];

  for ( var i in d ) {
    // __foo__ is reserved and not a pattern
    if ( i.match( /^__.*__$/) ) continue;
    var l = i.replace( /([\\.*+?|()\[\]{}])/g, "\\$1" )
             .replace( /\n/, "\\n" );
    patterns.push( i.length == 1 ? l : "(?:" + l + ")" );
  }

  patterns = patterns.join("|");
  d.__patterns__ = patterns;
  //print("patterns:", uneval( patterns ) );

  var fn = d.__call__;
  d.__call__ = function(text, pattern) {
    if ( pattern != undefined ) {
      return fn.call(this, text, pattern);
    }
    else
    {
      return fn.call(this, text, patterns);
    }
  };
};

Markdown.DialectHelpers = {};
Markdown.DialectHelpers.inline_until_char = function( text, want ) {
  var consumed = 0,
      nodes = [];

  while ( true ) {
    if ( text.charAt( consumed ) == want ) {
      // Found the character we were looking for
      consumed++;
      return [ consumed, nodes ];
    }

    if ( consumed >= text.length ) {
      // No closing char found. Abort.
      return null;
    }

    var res = this.dialect.inline.__oneElement__.call(this, text.substr( consumed ) );
    consumed += res[ 0 ];
    // Add any returned nodes.
    nodes.push.apply( nodes, res.slice( 1 ) );
  }
}

// Helper function to make sub-classing a dialect easier
Markdown.subclassDialect = function( d ) {
  function Block() {}
  Block.prototype = d.block;
  function Inline() {}
  Inline.prototype = d.inline;

  return { block: new Block(), inline: new Inline() };
};

Markdown.buildBlockOrder ( Markdown.dialects.Gruber.block );
Markdown.buildInlinePatterns( Markdown.dialects.Gruber.inline );

Markdown.dialects.Maruku = Markdown.subclassDialect( Markdown.dialects.Gruber );

Markdown.dialects.Maruku.processMetaHash = function processMetaHash( meta_string ) {
  var meta = split_meta_hash( meta_string ),
      attr = {};

  for ( var i = 0; i < meta.length; ++i ) {
    // id: #foo
    if ( /^#/.test( meta[ i ] ) ) {
      attr.id = meta[ i ].substring( 1 );
    }
    // class: .foo
    else if ( /^\./.test( meta[ i ] ) ) {
      // if class already exists, append the new one
      if ( attr["class"] ) {
        attr["class"] = attr["class"] + meta[ i ].replace( /./, " " );
      }
      else {
        attr["class"] = meta[ i ].substring( 1 );
      }
    }
    // attribute: foo=bar
    else if ( /\=/.test( meta[ i ] ) ) {
      var s = meta[ i ].split( /\=/ );
      attr[ s[ 0 ] ] = s[ 1 ];
    }
  }

  return attr;
}

function split_meta_hash( meta_string ) {
  var meta = meta_string.split( "" ),
      parts = [ "" ],
      in_quotes = false;

  while ( meta.length ) {
    var letter = meta.shift();
    switch ( letter ) {
      case " " :
        // if we're in a quoted section, keep it
        if ( in_quotes ) {
          parts[ parts.length - 1 ] += letter;
        }
        // otherwise make a new part
        else {
          parts.push( "" );
        }
        break;
      case "'" :
      case '"' :
        // reverse the quotes and move straight on
        in_quotes = !in_quotes;
        break;
      case "\\" :
        // shift off the next letter to be used straight away.
        // it was escaped so we'll keep it whatever it is
        letter = meta.shift();
      default :
        parts[ parts.length - 1 ] += letter;
        break;
    }
  }

  return parts;
}

Markdown.dialects.Maruku.block.document_meta = function document_meta( block, next ) {
  // we're only interested in the first block
  if ( block.lineNumber > 1 ) return undefined;

  // document_meta blocks consist of one or more lines of `Key: Value\n`
  if ( ! block.match( /^(?:\w+:.*\n)*\w+:.*$/ ) ) return undefined;

  // make an attribute node if it doesn't exist
  if ( !extract_attr( this.tree ) ) {
    this.tree.splice( 1, 0, {} );
  }

  var pairs = block.split( /\n/ );
  for ( p in pairs ) {
    var m = pairs[ p ].match( /(\w+):\s*(.*)$/ ),
        key = m[ 1 ].toLowerCase(),
        value = m[ 2 ];

    this.tree[ 1 ][ key ] = value;
  }

  // document_meta produces no content!
  return [];
};

Markdown.dialects.Maruku.block.block_meta = function block_meta( block, next ) {
  // check if the last line of the block is an meta hash
  var m = block.match( /(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/ );
  if ( !m ) return undefined;

  // process the meta hash
  var attr = this.dialect.processMetaHash( m[ 2 ] );

  var hash;

  // if we matched ^ then we need to apply meta to the previous block
  if ( m[ 1 ] === "" ) {
    var node = this.tree[ this.tree.length - 1 ];
    hash = extract_attr( node );

    // if the node is a string (rather than JsonML), bail
    if ( typeof node === "string" ) return undefined;

    // create the attribute hash if it doesn't exist
    if ( !hash ) {
      hash = {};
      node.splice( 1, 0, hash );
    }

    // add the attributes in
    for ( a in attr ) {
      hash[ a ] = attr[ a ];
    }

    // return nothing so the meta hash is removed
    return [];
  }

  // pull the meta hash off the block and process what's left
  var b = block.replace( /\n.*$/, "" ),
      result = this.processBlock( b, [] );

  // get or make the attributes hash
  hash = extract_attr( result[ 0 ] );
  if ( !hash ) {
    hash = {};
    result[ 0 ].splice( 1, 0, hash );
  }

  // attach the attributes to the block
  for ( a in attr ) {
    hash[ a ] = attr[ a ];
  }

  return result;
};

Markdown.dialects.Maruku.block.definition_list = function definition_list( block, next ) {
  // one or more terms followed by one or more definitions, in a single block
  var tight = /^((?:[^\s:].*\n)+):\s+([\s\S]+)$/,
      list = [ "dl" ],
      i, m;

  // see if we're dealing with a tight or loose block
  if ( ( m = block.match( tight ) ) ) {
    // pull subsequent tight DL blocks out of `next`
    var blocks = [ block ];
    while ( next.length && tight.exec( next[ 0 ] ) ) {
      blocks.push( next.shift() );
    }

    for ( var b = 0; b < blocks.length; ++b ) {
      var m = blocks[ b ].match( tight ),
          terms = m[ 1 ].replace( /\n$/, "" ).split( /\n/ ),
          defns = m[ 2 ].split( /\n:\s+/ );

      // print( uneval( m ) );

      for ( i = 0; i < terms.length; ++i ) {
        list.push( [ "dt", terms[ i ] ] );
      }

      for ( i = 0; i < defns.length; ++i ) {
        // run inline processing over the definition
        list.push( [ "dd" ].concat( this.processInline( defns[ i ].replace( /(\n)\s+/, "$1" ) ) ) );
      }
    }
  }
  else {
    return undefined;
  }

  return [ list ];
};

// splits on unescaped instances of @ch. If @ch is not a character the result
// can be unpredictable

Markdown.dialects.Maruku.block.table = function table (block, next) {

    var _split_on_unescaped = function(s, ch) {
        ch = ch || '\\s';
        if (ch.match(/^[\\|\[\]{}?*.+^$]$/)) { ch = '\\' + ch; }
        var res = [ ],
            r = new RegExp('^((?:\\\\.|[^\\\\' + ch + '])*)' + ch + '(.*)'),
            m;
        while(m = s.match(r)) {
            res.push(m[1]);
            s = m[2];
        }
        res.push(s);
        return res;
    }

    var leading_pipe = /^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,
        // find at least an unescaped pipe in each line
        no_leading_pipe = /^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/,
        i, m;
    if (m = block.match(leading_pipe)) {
        // remove leading pipes in contents
        // (header and horizontal rule already have the leading pipe left out)
        m[3] = m[3].replace(/^\s*\|/gm, '');
    } else if (! ( m = block.match(no_leading_pipe))) {
        return undefined;
    }

    var table = [ "table", [ "thead", [ "tr" ] ], [ "tbody" ] ];

    // remove trailing pipes, then split on pipes
    // (no escaped pipes are allowed in horizontal rule)
    m[2] = m[2].replace(/\|\s*$/, '').split('|');

    // process alignment
    var html_attrs = [ ];
    forEach (m[2], function (s) {
        if (s.match(/^\s*-+:\s*$/))       html_attrs.push({align: "right"});
        else if (s.match(/^\s*:-+\s*$/))  html_attrs.push({align: "left"});
        else if (s.match(/^\s*:-+:\s*$/)) html_attrs.push({align: "center"});
        else                              html_attrs.push({});
    });

    // now for the header, avoid escaped pipes
    m[1] = _split_on_unescaped(m[1].replace(/\|\s*$/, ''), '|');
    for (i = 0; i < m[1].length; i++) {
        table[1][1].push(['th', html_attrs[i] || {}].concat(
            this.processInline(m[1][i].trim())));
    }

    // now for body contents
    forEach (m[3].replace(/\|\s*$/mg, '').split('\n'), function (row) {
        var html_row = ['tr'];
        row = _split_on_unescaped(row, '|');
        for (i = 0; i < row.length; i++) {
            html_row.push(['td', html_attrs[i] || {}].concat(this.processInline(row[i].trim())));
        }
        table[2].push(html_row);
    }, this);

    return [table];
}

Markdown.dialects.Maruku.inline[ "{:" ] = function inline_meta( text, matches, out ) {
  if ( !out.length ) {
    return [ 2, "{:" ];
  }

  // get the preceeding element
  var before = out[ out.length - 1 ];

  if ( typeof before === "string" ) {
    return [ 2, "{:" ];
  }

  // match a meta hash
  var m = text.match( /^\{:\s*((?:\\\}|[^\}])*)\s*\}/ );

  // no match, false alarm
  if ( !m ) {
    return [ 2, "{:" ];
  }

  // attach the attributes to the preceeding element
  var meta = this.dialect.processMetaHash( m[ 1 ] ),
      attr = extract_attr( before );

  if ( !attr ) {
    attr = {};
    before.splice( 1, 0, attr );
  }

  for ( var k in meta ) {
    attr[ k ] = meta[ k ];
  }

  // cut out the string and replace it with nothing
  return [ m[ 0 ].length, "" ];
};

Markdown.dialects.Maruku.inline.__escape__ = /^\\[\\`\*_{}\[\]()#\+.!\-|:]/;

Markdown.buildBlockOrder ( Markdown.dialects.Maruku.block );
Markdown.buildInlinePatterns( Markdown.dialects.Maruku.inline );

var isArray = Array.isArray || function(obj) {
  return Object.prototype.toString.call(obj) == "[object Array]";
};

var forEach;
// Don't mess with Array.prototype. Its not friendly
if ( Array.prototype.forEach ) {
  forEach = function( arr, cb, thisp ) {
    return arr.forEach( cb, thisp );
  };
}
else {
  forEach = function(arr, cb, thisp) {
    for (var i = 0; i < arr.length; i++) {
      cb.call(thisp || arr, arr[i], i, arr);
    }
  }
}

var isEmpty = function( obj ) {
  for ( var key in obj ) {
    if ( hasOwnProperty.call( obj, key ) ) {
      return false;
    }
  }

  return true;
}

function extract_attr( jsonml ) {
  return isArray(jsonml)
      && jsonml.length > 1
      && typeof jsonml[ 1 ] === "object"
      && !( isArray(jsonml[ 1 ]) )
      ? jsonml[ 1 ]
      : undefined;
}



/**
 *  renderJsonML( jsonml[, options] ) -> String
 *  - jsonml (Array): JsonML array to render to XML
 *  - options (Object): options
 *
 *  Converts the given JsonML into well-formed XML.
 *
 *  The options currently understood are:
 *
 *  - root (Boolean): wether or not the root node should be included in the
 *    output, or just its children. The default `false` is to not include the
 *    root itself.
 */
expose.renderJsonML = function( jsonml, options ) {
  options = options || {};
  // include the root element in the rendered output?
  options.root = options.root || false;

  var content = [];

  if ( options.root ) {
    content.push( render_tree( jsonml ) );
  }
  else {
    jsonml.shift(); // get rid of the tag
    if ( jsonml.length && typeof jsonml[ 0 ] === "object" && !( jsonml[ 0 ] instanceof Array ) ) {
      jsonml.shift(); // get rid of the attributes
    }

    while ( jsonml.length ) {
      content.push( render_tree( jsonml.shift() ) );
    }
  }

  return content.join( "\n\n" );
};

function escapeHTML( text ) {
  return text.replace( /&/g, "&amp;" )
             .replace( /</g, "&lt;" )
             .replace( />/g, "&gt;" )
             .replace( /"/g, "&quot;" )
             .replace( /'/g, "&#39;" );
}

function render_tree( jsonml ) {
  // basic case
  if ( typeof jsonml === "string" ) {
    return escapeHTML( jsonml );
  }

  var tag = jsonml.shift(),
      attributes = {},
      content = [];

  if ( jsonml.length && typeof jsonml[ 0 ] === "object" && !( jsonml[ 0 ] instanceof Array ) ) {
    attributes = jsonml.shift();
  }

  while ( jsonml.length ) {
    content.push( render_tree( jsonml.shift() ) );
  }

  var tag_attrs = "";
  for ( var a in attributes ) {
    tag_attrs += " " + a + '="' + escapeHTML( attributes[ a ] ) + '"';
  }

  // be careful about adding whitespace here for inline elements
  if ( tag == "img" || tag == "br" || tag == "hr" ) {
    return "<"+ tag + tag_attrs + "/>";
  }
  else {
    return "<"+ tag + tag_attrs + ">" + content.join( "" ) + "</" + tag + ">";
  }
}

function convert_tree_to_html( tree, references, options ) {
  var i;
  options = options || {};

  // shallow clone
  var jsonml = tree.slice( 0 );

  if ( typeof options.preprocessTreeNode === "function" ) {
      jsonml = options.preprocessTreeNode(jsonml, references);
  }

  // Clone attributes if they exist
  var attrs = extract_attr( jsonml );
  if ( attrs ) {
    jsonml[ 1 ] = {};
    for ( i in attrs ) {
      jsonml[ 1 ][ i ] = attrs[ i ];
    }
    attrs = jsonml[ 1 ];
  }

  // basic case
  if ( typeof jsonml === "string" ) {
    return jsonml;
  }

  // convert this node
  switch ( jsonml[ 0 ] ) {
    case "header":
      jsonml[ 0 ] = "h" + jsonml[ 1 ].level;
      delete jsonml[ 1 ].level;
      break;
    case "bulletlist":
      jsonml[ 0 ] = "ul";
      break;
    case "numberlist":
      jsonml[ 0 ] = "ol";
      break;
    case "listitem":
      jsonml[ 0 ] = "li";
      break;
    case "para":
      jsonml[ 0 ] = "p";
      break;
    case "markdown":
      jsonml[ 0 ] = "html";
      if ( attrs ) delete attrs.references;
      break;
    case "code_block":
      jsonml[ 0 ] = "pre";
      i = attrs ? 2 : 1;
      var code = [ "code" ];
      code.push.apply( code, jsonml.splice( i, jsonml.length - i ) );
      jsonml[ i ] = code;
      break;
    case "inlinecode":
      jsonml[ 0 ] = "code";
      break;
    case "img":
      jsonml[ 1 ].src = jsonml[ 1 ].href;
      delete jsonml[ 1 ].href;
      break;
    case "linebreak":
      jsonml[ 0 ] = "br";
    break;
    case "link":
      jsonml[ 0 ] = "a";
      break;
    case "link_ref":
      jsonml[ 0 ] = "a";

      // grab this ref and clean up the attribute node
      var ref = references[ attrs.ref ];

      // if the reference exists, make the link
      if ( ref ) {
        delete attrs.ref;

        // add in the href and title, if present
        attrs.href = ref.href;
        if ( ref.title ) {
          attrs.title = ref.title;
        }

        // get rid of the unneeded original text
        delete attrs.original;
      }
      // the reference doesn't exist, so revert to plain text
      else {
        return attrs.original;
      }
      break;
    case "img_ref":
      jsonml[ 0 ] = "img";

      // grab this ref and clean up the attribute node
      var ref = references[ attrs.ref ];

      // if the reference exists, make the link
      if ( ref ) {
        delete attrs.ref;

        // add in the href and title, if present
        attrs.src = ref.href;
        if ( ref.title ) {
          attrs.title = ref.title;
        }

        // get rid of the unneeded original text
        delete attrs.original;
      }
      // the reference doesn't exist, so revert to plain text
      else {
        return attrs.original;
      }
      break;
  }

  // convert all the children
  i = 1;

  // deal with the attribute node, if it exists
  if ( attrs ) {
    // if there are keys, skip over it
    for ( var key in jsonml[ 1 ] ) {
        i = 2;
        break;
    }
    // if there aren't, remove it
    if ( i === 1 ) {
      jsonml.splice( i, 1 );
    }
  }

  for ( ; i < jsonml.length; ++i ) {
    jsonml[ i ] = convert_tree_to_html( jsonml[ i ], references, options );
  }

  return jsonml;
}


// merges adjacent text nodes into a single node
function merge_text_nodes( jsonml ) {
  // skip the tag name and attribute hash
  var i = extract_attr( jsonml ) ? 2 : 1;

  while ( i < jsonml.length ) {
    // if it's a string check the next item too
    if ( typeof jsonml[ i ] === "string" ) {
      if ( i + 1 < jsonml.length && typeof jsonml[ i + 1 ] === "string" ) {
        // merge the second string into the first and remove it
        jsonml[ i ] += jsonml.splice( i + 1, 1 )[ 0 ];
      }
      else {
        ++i;
      }
    }
    // if it's not a string recurse
    else {
      merge_text_nodes( jsonml[ i ] );
      ++i;
    }
  }
}

} )( (function() {
  if ( typeof exports === "undefined" ) {
    window.markdown = {};
    return window.markdown;
  }
  else {
    return exports;
  }
} )() );

},{"util":14}],10:[function(require,module,exports) {
// super simple module for the most common nodejs use case.
exports.markdown = require("./markdown");
exports.parse = exports.markdown.toHTML;

},{"./markdown":11}],4:[function(require,module,exports) {

},{}],2:[function(require,module,exports) {
'use strict';

var _markdown = require('markdown');

const fs = require("fs");

const description = document.getElementById('description');
var descriptionMarkdown = 'This web app is an experiment to combine Machine Learning and Computer Graphics through [TensorFlow.js](https://js.tensorflow.org/) and [BabylonJS](https://www.babylonjs.com/).\n\nFlow of the app:\n\n1. Get webcam input\n2. Estimate human pose through TensorFlow.js. Click [here](https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5) to read more about it.\n3. Apply human pose predictions on a rigged 3D character through BabylonJS.\n\nSource code is available at: [https://github.com/mishig25/3d-posenet](https://github.com/mishig25/3d-posenet)';
var desc = document.createElement('div');
desc.innerHTML = _markdown.markdown.toHTML(descriptionMarkdown);
description.appendChild(desc);
},{"markdown":10,"fs":4}]},{},[2])
//# sourceMappingURL=/dist/42a5e6d83755d04f780d720f06bc6b06.map