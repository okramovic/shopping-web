// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

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

      var module = cache[name] = new newRequire.Module;

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

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({13:[function(require,module,exports) {
var REQUEST_CONSTANTS = {
  RPC: 'rpc',
  DOWNLOAD: 'download',
  UPLOAD: 'upload'
};

module.exports = REQUEST_CONSTANTS;

},{}],14:[function(require,module,exports) {
// Polyfill object.assign for legacy browsers
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      var output;
      var index;
      var source;
      var nextKey;
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      output = Object(target);
      for (index = 1; index < arguments.length; index++) {
        source = arguments[index];
        if (source !== undefined && source !== null) {
          for (nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  }());
}

},{}],27:[function(require,module,exports) {

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],23:[function(require,module,exports) {
'use strict';

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;

},{}],26:[function(require,module,exports) {
'use strict';

/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = require('./is-object');

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for(var option in options) {
    switch(option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @param {Function} [fn]
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count, fn){
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  this._retryCallback = fn;
  return this;
};

var ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'EADDRINFO',
  'ESOCKETTIMEDOUT'
];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
RequestBase.prototype._shouldRetry = function(err, res) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
    return false;
  }
  if (this._retryCallback) {
    try {
      var override = this._retryCallback(err, res);
      if (override === true) return true;
      if (override === false) return false;
      // undefined falls back to defaults
    } catch(e) {
      console.error(e);
    }
  }
  if (res && res.status && res.status >= 500 && res.status != 501) return true;
  if (err) {
    if (err.code && ~ERROR_CODES.indexOf(err.code)) return true;
    // Superagent timeout
    if (err.timeout && err.code == 'ECONNABORTED') return true;
    if (err.crossDomain) return true;
  }
  return false;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function() {

  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject) {
      self.end(function(err, res) {
        if (err) innerReject(err);
        else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
};

RequestBase.prototype.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
};

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};

/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {
  // name should be either a string or an object.
  if (null === name || undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

RequestBase.prototype._auth = function(user, pass, options, base64Encoder) {
  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + base64Encoder(user + ':' + pass));
      break;

    case 'auto':
      this.username = user;
      this.password = pass;
      break;

    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
      break;
  }
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(on) {
  // This is browser-only functionality. Node side is no-op.
  if (on == undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
 * Default 200MB.
 *
 * @param {Number} n
 * @return {Request} for chaining
 */
RequestBase.prototype.maxResponseSize = function(n){
  if ('number' !== typeof n) {
    throw TypeError("Invalid argument");
  }
  this._maxResponseSize = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function() {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header,
  };
};

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};

/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */
RequestBase.prototype._finalizeQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }
  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if ('function' === typeof this._sort) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

// For backwards compat only
RequestBase.prototype._appendQueryString = function() {console.trace("Unsupported");}

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout, errno){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
};

},{"./is-object":23}],28:[function(require,module,exports) {
'use strict';

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, changesOrigin){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  // secuirty
  if (changesOrigin) {
    delete header['authorization'];
    delete header['cookie'];
  }
  return header;
};

},{}],24:[function(require,module,exports) {
'use strict';

/**
 * Module dependencies.
 */

var utils = require('./utils');

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field) {
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
};

},{"./utils":28}],25:[function(require,module,exports) {
function Agent() {
  this._defaults = [];
}

["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects",
 "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert"].forEach(function(fn) {
  /** Default setting for all requests from this agent */
  Agent.prototype[fn] = function(/*varargs*/) {
    this._defaults.push({fn:fn, arguments:arguments});
    return this;
  }
});

Agent.prototype._setDefaults = function(req) {
    this._defaults.forEach(function(def) {
      req[def.fn].apply(req, def.arguments);
    });
};

module.exports = Agent;

},{}],20:[function(require,module,exports) {
/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = require('component-emitter');
var RequestBase = require('./request-base');
var isObject = require('./is-object');
var ResponseBase = require('./response-base');
var Agent = require('./agent-base');

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only version of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

request.serializeObject = serialize;

/**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

request.serialize = {
  'application/x-www-form-urlencoded': serialize,
  'application/json': JSON.stringify,
};

/**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse,
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    if (index === -1) { // could be empty line, just skip it
      continue;
    }
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  // should match /json or +json
  // but not /json-seq
  return /[\/+]json($|[^-\w])/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str) {
  var parse = request.parse[this.type];
  if (this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
      }
    } catch(custom_err) {
      new_err = custom_err; // ok() callback can throw
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      new_err.original = err;
      new_err.response = res;
      new_err.status = res.status;
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (1 === arguments.length) pass = '';
  if (typeof pass === 'object' && pass !== null) { // pass is optional and can be replaced with options
    options = pass;
    pass = '';
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    };
  }

  var encoder = function(string) {
    if ('function' === typeof btoa) {
      return btoa(string);
    }
    throw new Error('Cannot use basic auth, btoa is not a function');
  };

  return this._auth(user, pass, options, encoder);
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  if (this._shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._finalizeQueryString();

  return this._end();
};

Request.prototype._end = function() {
  var self = this;
  var xhr = (this.xhr = request.getXHR());
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;

    if (this.header.hasOwnProperty(field))
      xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

request.agent = function() {
  return new Agent();
};

["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function(method) {
  Agent.prototype[method.toLowerCase()] = function(url, fn) {
    var req = new request.Request(method, url);
    this._setDefaults(req);
    if (fn) {
      req.end(fn);
    }
    return req;
  };
});

Agent.prototype.del = Agent.prototype['delete'];

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn) {
  var req = request('GET', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn) {
  var req = request('HEAD', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn) {
  var req = request('OPTIONS', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn) {
  var req = request('DELETE', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
}

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn) {
  var req = request('PATCH', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn) {
  var req = request('POST', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn) {
  var req = request('PUT', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"component-emitter":27,"./request-base":26,"./is-object":23,"./response-base":24,"./agent-base":25}],22:[function(require,module,exports) {

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

},{}],21:[function(require,module,exports) {
var global = (1,eval)("this");
var process = require("process");
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.2+97478eb6
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === GET_THEN_ERROR) {
      reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = void 0,
      failed = void 0;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    return promise.then(function (value) {
      return constructor.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return constructor.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
    var local = void 0;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));



//# sourceMappingURL=es6-promise.map

},{"process":22}],18:[function(require,module,exports) {
function getBaseURL(host) {
  return 'https://' + host + '.dropboxapi.com/2/';
}

module.exports = getBaseURL;

},{}],15:[function(require,module,exports) {
var request = require('superagent');
var Promise = require('es6-promise').Promise;
var getBaseURL = require('./get-base-url');

// This doesn't match what was spec'd in paper doc yet
var buildCustomError = function (error, response) {
  var err;
  if (response) {
    try {
      err = JSON.parse(response.text);
    } catch (e) {
      err = response.text;
    }
  }
  return {
    status: error.status,
    error: err || error,
    response: response
  };
};

var rpcRequest = function (path, body, auth, host, accessToken, selectUser) {
  var promiseFunction = function (resolve, reject) {
    var apiRequest;

    function success(data) {
      if (resolve) {
        resolve(data);
      }
    }

    function failure(error) {
      if (reject) {
        reject(error);
      }
    }

    function responseHandler(error, response) {
      if (error) {
        failure(buildCustomError(error, response));
      } else {
        success(response.body);
      }
    }

    // The API expects null to be passed for endpoints that dont accept any
    // parameters
    if (!body) {
      body = null;
    }

    apiRequest = request.post(getBaseURL(host) + path)
      .type('application/json');

    switch (auth) {
      case 'team':
      case 'user':
        apiRequest.set('Authorization', 'Bearer ' + accessToken);
        break;
      case 'noauth':
        break;
      default:
        throw new Error('Unhandled auth type: ' + auth);
    }

    if (selectUser) {
      apiRequest = apiRequest.set('Dropbox-API-Select-User', selectUser);
    }

    apiRequest.send(body)
      .end(responseHandler);
  };

  return new Promise(promiseFunction);
};

module.exports = rpcRequest;

},{"superagent":20,"es6-promise":21,"./get-base-url":18}],19:[function(require,module,exports) {
// source https://www.dropboxforum.com/t5/API-support/HTTP-header-quot-Dropbox-API-Arg-quot-could-not-decode-input-as/m-p/173823/highlight/true#M6786
var charsToEncode = /[\u007f-\uffff]/g;

function httpHeaderSafeJson(args) {
  return JSON.stringify(args).replace(charsToEncode, function (c) {
    return '\\u' + ('000' + c.charCodeAt(0).toString(16)).slice(-4);
  });
}

module.exports = httpHeaderSafeJson;

},{}],16:[function(require,module,exports) {
var request = require('superagent');
var Promise = require('es6-promise').Promise;
var getBaseURL = require('./get-base-url');
var httpHeaderSafeJson = require('./http-header-safe-json');

var buildCustomError;
var downloadRequest;
var nodeBinaryParser;

// Register a handler that will instruct superagent how to parse the response
request.parse['application/octect-stream'] = function (obj) {
  return obj;
};

// This doesn't match what was spec'd in paper doc yet
buildCustomError = function (error, response) {
  return {
    status: error.status,
    error: (response ? response.text : null) || error.toString(),
    response: response
  };
};

nodeBinaryParser = function (res, done) {
  res.text = '';
  res.setEncoding('binary');
  res.on('data', function (chunk) { res.text += chunk; });
  res.on('end', function () {
    done();
  });
};

downloadRequest = function (path, args, auth, host, accessToken, selectUser) {
  if (auth !== 'user') {
    throw new Error('Unexpected auth type: ' + auth);
  }

  var promiseFunction = function (resolve, reject) {
    var apiRequest;

    function success(data) {
      if (resolve) {
        resolve(data);
      }
    }

    function failure(error) {
      if (reject) {
        reject(error);
      }
    }

    function responseHandler(error, response) {
      var data;
      if (error) {
        failure(buildCustomError(error, response));
      } else {
        // In the browser, the file is passed as a blob and in node the file is
        // passed as a string of binary data.
        data = JSON.parse(response.headers['dropbox-api-result']);
        if (response.xhr) {
          data.fileBlob = response.xhr.response;
        } else {
          data.fileBinary = response.res.text;
        }
        success(data);
      }
    }

    apiRequest = request.post(getBaseURL(host) + path)
      .set('Authorization', 'Bearer ' + accessToken)
      .set('Dropbox-API-Arg', httpHeaderSafeJson(args))
      .on('request', function () {
        if (this.xhr) {
          this.xhr.responseType = 'blob';
        }
      });

    if (selectUser) {
      apiRequest = apiRequest.set('Dropbox-API-Select-User', selectUser);
    }

    // Apply the node binary parser to the response if executing in node
    if (typeof window === 'undefined') {
      apiRequest
        .buffer(true)
        .parse(nodeBinaryParser)
        .end(responseHandler);
    } else {
      apiRequest.end(responseHandler);
    }
  };

  return new Promise(promiseFunction);
};

module.exports = downloadRequest;

},{"superagent":20,"es6-promise":21,"./get-base-url":18,"./http-header-safe-json":19}],17:[function(require,module,exports) {
var request = require('superagent');
var Promise = require('es6-promise').Promise;
var getBaseURL = require('./get-base-url');
var httpHeaderSafeJson = require('./http-header-safe-json');

// This doesn't match what was spec'd in paper doc yet
var buildCustomError = function (error, response) {
  return {
    status: error.status,
    error: (response ? response.text : null) || error.toString(),
    response: response
  };
};

var uploadRequest = function (path, args, auth, host, accessToken, selectUser) {
  if (auth !== 'user') {
    throw new Error('Unexpected auth type: ' + auth);
  }

  var promiseFunction = function (resolve, reject) {
    var apiRequest;

    // Since args.contents is sent as the body of the request and not added to
    // the url, it needs to be remove it from args.
    var contents = args.contents;
    delete args.contents;

    function success(data) {
      if (resolve) {
        resolve(data);
      }
    }

    function failure(error) {
      if (reject) {
        reject(error);
      }
    }

    function responseHandler(error, response) {
      if (error) {
        failure(buildCustomError(error, response));
      } else {
        success(response.body);
      }
    }

    apiRequest = request.post(getBaseURL(host) + path)
      .type('application/octet-stream')
      .set('Authorization', 'Bearer ' + accessToken)
      .set('Dropbox-API-Arg', httpHeaderSafeJson(args));

    if (selectUser) {
      apiRequest = apiRequest.set('Dropbox-API-Select-User', selectUser);
    }

    apiRequest
      .send(contents)
      .end(responseHandler);
  };

  return new Promise(promiseFunction);
};

module.exports = uploadRequest;

},{"superagent":20,"es6-promise":21,"./get-base-url":18,"./http-header-safe-json":19}],11:[function(require,module,exports) {
var REQUEST_CONSTANTS = require('./request-constants');
var DropboxBase;

// Polyfill Object.assign() for older browsers
require('./object-assign-polyfill');

/**
 * @private
 * @class DropboxBase
 * @classdesc The main Dropbox SDK class. This contains the methods that are
 * shared between Dropbox and DropboxTeam classes. It is marked as private so
 * that it doesn't show up in the docs because it is never used directly.
 * @arg {Object} options
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {String} [options.clientId] - The client id fo ryour app. Used to create
 * authentication URL.
 * @arg {Number} [options.selectUser] - User is the team access token would like
 * to act as.
 */
DropboxBase = function (options) {
  options = options || {};
  this.accessToken = options.accessToken;
  this.clientId = options.clientId;
  this.selectUser = options.selectUser;
};

/**
 * Set the access token used to authenticate requests to the API.
 * @arg {String} accessToken - An access token
 * @returns {undefined}
 */
DropboxBase.prototype.setAccessToken = function (accessToken) {
  this.accessToken = accessToken;
};

/**
 * Get the access token
 * @returns {String} Access token
 */
DropboxBase.prototype.getAccessToken = function () {
  return this.accessToken;
};

/**
 * Set the client id, which is used to help gain an access token.
 * @arg {String} clientId - Your apps client id
 * @returns {undefined}
 */
DropboxBase.prototype.setClientId = function (clientId) {
  this.clientId = clientId;
};

/**
 * Get the client id
 * @returns {String} Client id
 */
DropboxBase.prototype.getClientId = function () {
  return this.clientId;
};

/**
 * Get a URL that can be used to authenticate users for the Dropbox API.
 * @arg {String} redirectUri - A URL to redirect the user to after
 * authenticating. This must be added to your app through the admin interface.
 * @arg {String} [state] - State that will be returned in the redirect URL to help
 * prevent cross site scripting attacks.
 * @returns {String} Url to send user to for Dropbox API authentication
 */
DropboxBase.prototype.getAuthenticationUrl = function (redirectUri, state) {
  var AUTH_BASE_URL = 'https://www.dropbox.com/oauth2/authorize';
  var clientId = this.getClientId();
  var authUrl;
  if (!clientId) {
    throw new Error('A client id is required. You can set the client id using .setClientId().');
  }
  if (!redirectUri) {
    throw new Error('A redirect uri is required.');
  }

  authUrl = AUTH_BASE_URL + '?response_type=token&client_id=' + clientId;
  if (redirectUri) {
    authUrl = authUrl + '&redirect_uri=' + redirectUri;
  }
  if (state) {
    authUrl = authUrl + '&state=' + state;
  }
  return authUrl;
};

/**
 * Called when the authentication succeed
 * @callback successCallback
 * @param {string} access_token The application's access token
 */

/**
 * Called when the authentication failed.
 * @callback errorCallback
 */

/**
 * An authentication process that works with cordova applications.
 * @param {successCallback} successCallback
 * @param {errorCallback} errorCallback 
 */
DropboxBase.prototype.authenticateWithCordova = function (successCallback, errorCallback)
{
  var redirect_url = 'https://www.dropbox.com/1/oauth2/redirect_receiver';
  var url = this.getAuthenticationUrl(redirect_url);
  var browser = window.open(url, '_blank');
  var removed = false;

  var onLoadError = function(event) {
    // Try to avoid a browser crash on browser.close().
    window.setTimeout(function() { browser.close() }, 10);
    errorCallback();
  }

  var onLoadStop = function(event) {
    var error_label = '&error=';
    var error_index = event.url.indexOf(error_label);

    if (error_index > -1) {
      // Try to avoid a browser crash on browser.close().
      window.setTimeout(function() { browser.close() }, 10);
      errorCallback();
    } else { 
      var access_token_label = '#access_token=';
      var access_token_index = event.url.indexOf(access_token_label);
      var token_type_index = event.url.indexOf('&token_type=');
      if (access_token_index > -1) {
        access_token_index += access_token_label.length;
        // Try to avoid a browser crash on browser.close().
        window.setTimeout(function() { browser.close() }, 10);

        var access_token = event.url.substring(access_token_index, token_type_index);
        successCallback(access_token);
      }
    }
  };

  var onExit = function(event) {
    if(removed) {
      return 
    }
    browser.removeEventListener('loaderror', onLoadError);
    browser.removeEventListener('loadstop', onLoadStop);
    browser.removeEventListener('exit', onExit);
    removed = true
  };
  
  browser.addEventListener('loaderror', onLoadError);
  browser.addEventListener('loadstop', onLoadStop);
  browser.addEventListener('exit', onExit)
}

DropboxBase.prototype.request = function (path, args, auth, host, style) {
  var request = null;
  switch (style) {
    case REQUEST_CONSTANTS.RPC:
      request = this.getRpcRequest();
      break;
    case REQUEST_CONSTANTS.DOWNLOAD:
      request = this.getDownloadRequest();
      break;
    case REQUEST_CONSTANTS.UPLOAD:
      request = this.getUploadRequest();
      break;
    default:
      throw new Error('Invalid request style: ' + style);
  }

  return request(path, args, auth, host, this.getAccessToken(), this.selectUser);
};

DropboxBase.prototype.setRpcRequest = function (newRpcRequest) {
  DropboxBase.prototype.rpcRequest = newRpcRequest;
};

DropboxBase.prototype.getRpcRequest = function () {
  if (DropboxBase.prototype.rpcRequest === undefined) {
    DropboxBase.prototype.rpcRequest = require('./rpc-request');
  }

  return DropboxBase.prototype.rpcRequest;
};

DropboxBase.prototype.setDownloadRequest = function (newDownloadRequest) {
  DropboxBase.prototype.downloadRequest = newDownloadRequest;
};

DropboxBase.prototype.getDownloadRequest = function () {
  if (DropboxBase.prototype.downloadRequest === undefined) {
    DropboxBase.prototype.downloadRequest = require('./download-request');
  }

  return DropboxBase.prototype.downloadRequest;
};

DropboxBase.prototype.setUploadRequest = function (newUploadRequest) {
  DropboxBase.prototype.uploadRequest = newUploadRequest;
};

DropboxBase.prototype.getUploadRequest = function () {
  if (DropboxBase.prototype.uploadRequest === undefined) {
    DropboxBase.prototype.uploadRequest = require('./upload-request');
  }

  return DropboxBase.prototype.uploadRequest;
};

module.exports = DropboxBase;

},{"./request-constants":13,"./object-assign-polyfill":14,"./rpc-request":15,"./download-request":16,"./upload-request":17}],12:[function(require,module,exports) {
// Auto-generated by Stone, do not modify.
var routes = {};

/**
 * Creates an OAuth 2.0 access token from the supplied OAuth 1.0 access token.
 * @function Dropbox#authTokenFromOauth1
 * @arg {AuthTokenFromOAuth1Arg} arg - The request parameters.
 * @returns {Promise.<AuthTokenFromOAuth1Result, Error.<AuthTokenFromOAuth1Error>>}
 */
routes.authTokenFromOauth1 = function (arg) {
  return this.request('auth/token/from_oauth1', arg, 'app', 'api', 'rpc');
};

/**
 * Disables the access token used to authenticate the call.
 * @function Dropbox#authTokenRevoke
 * @arg {void} arg - The request parameters.
 * @returns {Promise.<void, Error.<void>>}
 */
routes.authTokenRevoke = function (arg) {
  return this.request('auth/token/revoke', arg, 'user', 'api', 'rpc');
};

/**
 * Add property groups to a Dropbox file. See templates/add_for_user or
 * templates/add_for_team to create new templates.
 * @function Dropbox#filePropertiesPropertiesAdd
 * @arg {FilePropertiesAddPropertiesArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilePropertiesAddPropertiesError>>}
 */
routes.filePropertiesPropertiesAdd = function (arg) {
  return this.request('file_properties/properties/add', arg, 'user', 'api', 'rpc');
};

/**
 * Overwrite property groups associated with a file. This endpoint should be
 * used instead of properties/update when property groups are being updated via
 * a "snapshot" instead of via a "delta". In other words, this endpoint will
 * delete all omitted fields from a property group, whereas properties/update
 * will only delete fields that are explicitly marked for deletion.
 * @function Dropbox#filePropertiesPropertiesOverwrite
 * @arg {FilePropertiesOverwritePropertyGroupArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilePropertiesInvalidPropertyGroupError>>}
 */
routes.filePropertiesPropertiesOverwrite = function (arg) {
  return this.request('file_properties/properties/overwrite', arg, 'user', 'api', 'rpc');
};

/**
 * Permanently removes the specified property group from the file. To remove
 * specific property field key value pairs, see properties/update. To update a
 * template, see templates/update_for_user or templates/update_for_team.
 * Templates can't be removed once created.
 * @function Dropbox#filePropertiesPropertiesRemove
 * @arg {FilePropertiesRemovePropertiesArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilePropertiesRemovePropertiesError>>}
 */
routes.filePropertiesPropertiesRemove = function (arg) {
  return this.request('file_properties/properties/remove', arg, 'user', 'api', 'rpc');
};

/**
 * Search across property templates for particular property field values.
 * @function Dropbox#filePropertiesPropertiesSearch
 * @arg {FilePropertiesPropertiesSearchArg} arg - The request parameters.
 * @returns {Promise.<FilePropertiesPropertiesSearchResult, Error.<FilePropertiesPropertiesSearchError>>}
 */
routes.filePropertiesPropertiesSearch = function (arg) {
  return this.request('file_properties/properties/search', arg, 'user', 'api', 'rpc');
};

/**
 * Once a cursor has been retrieved from properties/search, use this to paginate
 * through all search results.
 * @function Dropbox#filePropertiesPropertiesSearchContinue
 * @arg {FilePropertiesPropertiesSearchContinueArg} arg - The request parameters.
 * @returns {Promise.<FilePropertiesPropertiesSearchResult, Error.<FilePropertiesPropertiesSearchContinueError>>}
 */
routes.filePropertiesPropertiesSearchContinue = function (arg) {
  return this.request('file_properties/properties/search/continue', arg, 'user', 'api', 'rpc');
};

/**
 * Add, update or remove properties associated with the supplied file and
 * templates. This endpoint should be used instead of properties/overwrite when
 * property groups are being updated via a "delta" instead of via a "snapshot" .
 * In other words, this endpoint will not delete any omitted fields from a
 * property group, whereas properties/overwrite will delete any fields that are
 * omitted from a property group.
 * @function Dropbox#filePropertiesPropertiesUpdate
 * @arg {FilePropertiesUpdatePropertiesArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilePropertiesUpdatePropertiesError>>}
 */
routes.filePropertiesPropertiesUpdate = function (arg) {
  return this.request('file_properties/properties/update', arg, 'user', 'api', 'rpc');
};

/**
 * Add a template associated with a team. See properties/add to add properties
 * to a file or folder. Note: this endpoint will create team-owned templates.
 * @function Dropbox#filePropertiesTemplatesAddForTeam
 * @arg {FilePropertiesAddTemplateArg} arg - The request parameters.
 * @returns {Promise.<FilePropertiesAddTemplateResult, Error.<FilePropertiesModifyTemplateError>>}
 */
routes.filePropertiesTemplatesAddForTeam = function (arg) {
  return this.request('file_properties/templates/add_for_team', arg, 'team', 'api', 'rpc');
};

/**
 * Add a template associated with a user. See properties/add to add properties
 * to a file. This endpoint can't be called on a team member or admin's behalf.
 * @function Dropbox#filePropertiesTemplatesAddForUser
 * @arg {FilePropertiesAddTemplateArg} arg - The request parameters.
 * @returns {Promise.<FilePropertiesAddTemplateResult, Error.<FilePropertiesModifyTemplateError>>}
 */
routes.filePropertiesTemplatesAddForUser = function (arg) {
  return this.request('file_properties/templates/add_for_user', arg, 'user', 'api', 'rpc');
};

/**
 * Get the schema for a specified template.
 * @function Dropbox#filePropertiesTemplatesGetForTeam
 * @arg {FilePropertiesGetTemplateArg} arg - The request parameters.
 * @returns {Promise.<FilePropertiesGetTemplateResult, Error.<FilePropertiesTemplateError>>}
 */
routes.filePropertiesTemplatesGetForTeam = function (arg) {
  return this.request('file_properties/templates/get_for_team', arg, 'team', 'api', 'rpc');
};

/**
 * Get the schema for a specified template. This endpoint can't be called on a
 * team member or admin's behalf.
 * @function Dropbox#filePropertiesTemplatesGetForUser
 * @arg {FilePropertiesGetTemplateArg} arg - The request parameters.
 * @returns {Promise.<FilePropertiesGetTemplateResult, Error.<FilePropertiesTemplateError>>}
 */
routes.filePropertiesTemplatesGetForUser = function (arg) {
  return this.request('file_properties/templates/get_for_user', arg, 'user', 'api', 'rpc');
};

/**
 * Get the template identifiers for a team. To get the schema of each template
 * use templates/get_for_team.
 * @function Dropbox#filePropertiesTemplatesListForTeam
 * @arg {void} arg - The request parameters.
 * @returns {Promise.<FilePropertiesListTemplateResult, Error.<FilePropertiesTemplateError>>}
 */
routes.filePropertiesTemplatesListForTeam = function (arg) {
  return this.request('file_properties/templates/list_for_team', arg, 'team', 'api', 'rpc');
};

/**
 * Get the template identifiers for a team. To get the schema of each template
 * use templates/get_for_user. This endpoint can't be called on a team member or
 * admin's behalf.
 * @function Dropbox#filePropertiesTemplatesListForUser
 * @arg {void} arg - The request parameters.
 * @returns {Promise.<FilePropertiesListTemplateResult, Error.<FilePropertiesTemplateError>>}
 */
routes.filePropertiesTemplatesListForUser = function (arg) {
  return this.request('file_properties/templates/list_for_user', arg, 'user', 'api', 'rpc');
};

/**
 * Permanently removes the specified template created from
 * templates/add_for_user. All properties associated with the template will also
 * be removed. This action cannot be undone.
 * @function Dropbox#filePropertiesTemplatesRemoveForTeam
 * @arg {FilePropertiesRemoveTemplateArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilePropertiesTemplateError>>}
 */
routes.filePropertiesTemplatesRemoveForTeam = function (arg) {
  return this.request('file_properties/templates/remove_for_team', arg, 'team', 'api', 'rpc');
};

/**
 * Permanently removes the specified template created from
 * templates/add_for_user. All properties associated with the template will also
 * be removed. This action cannot be undone.
 * @function Dropbox#filePropertiesTemplatesRemoveForUser
 * @arg {FilePropertiesRemoveTemplateArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilePropertiesTemplateError>>}
 */
routes.filePropertiesTemplatesRemoveForUser = function (arg) {
  return this.request('file_properties/templates/remove_for_user', arg, 'user', 'api', 'rpc');
};

/**
 * Update a template associated with a team. This route can update the template
 * name, the template description and add optional properties to templates.
 * @function Dropbox#filePropertiesTemplatesUpdateForTeam
 * @arg {FilePropertiesUpdateTemplateArg} arg - The request parameters.
 * @returns {Promise.<FilePropertiesUpdateTemplateResult, Error.<FilePropertiesModifyTemplateError>>}
 */
routes.filePropertiesTemplatesUpdateForTeam = function (arg) {
  return this.request('file_properties/templates/update_for_team', arg, 'team', 'api', 'rpc');
};

/**
 * Update a template associated with a user. This route can update the template
 * name, the template description and add optional properties to templates. This
 * endpoint can't be called on a team member or admin's behalf.
 * @function Dropbox#filePropertiesTemplatesUpdateForUser
 * @arg {FilePropertiesUpdateTemplateArg} arg - The request parameters.
 * @returns {Promise.<FilePropertiesUpdateTemplateResult, Error.<FilePropertiesModifyTemplateError>>}
 */
routes.filePropertiesTemplatesUpdateForUser = function (arg) {
  return this.request('file_properties/templates/update_for_user', arg, 'user', 'api', 'rpc');
};

/**
 * Creates a file request for this user.
 * @function Dropbox#fileRequestsCreate
 * @arg {FileRequestsCreateFileRequestArgs} arg - The request parameters.
 * @returns {Promise.<FileRequestsFileRequest, Error.<FileRequestsCreateFileRequestError>>}
 */
routes.fileRequestsCreate = function (arg) {
  return this.request('file_requests/create', arg, 'user', 'api', 'rpc');
};

/**
 * Returns the specified file request.
 * @function Dropbox#fileRequestsGet
 * @arg {FileRequestsGetFileRequestArgs} arg - The request parameters.
 * @returns {Promise.<FileRequestsFileRequest, Error.<FileRequestsGetFileRequestError>>}
 */
routes.fileRequestsGet = function (arg) {
  return this.request('file_requests/get', arg, 'user', 'api', 'rpc');
};

/**
 * Returns a list of file requests owned by this user. For apps with the app
 * folder permission, this will only return file requests with destinations in
 * the app folder.
 * @function Dropbox#fileRequestsList
 * @arg {void} arg - The request parameters.
 * @returns {Promise.<FileRequestsListFileRequestsResult, Error.<FileRequestsListFileRequestsError>>}
 */
routes.fileRequestsList = function (arg) {
  return this.request('file_requests/list', arg, 'user', 'api', 'rpc');
};

/**
 * Update a file request.
 * @function Dropbox#fileRequestsUpdate
 * @arg {FileRequestsUpdateFileRequestArgs} arg - The request parameters.
 * @returns {Promise.<FileRequestsFileRequest, Error.<FileRequestsUpdateFileRequestError>>}
 */
routes.fileRequestsUpdate = function (arg) {
  return this.request('file_requests/update', arg, 'user', 'api', 'rpc');
};

/**
 * Returns the metadata for a file or folder. This is an alpha endpoint
 * compatible with the properties API. Note: Metadata for the root folder is
 * unsupported.
 * @function Dropbox#filesAlphaGetMetadata
 * @deprecated
 * @arg {FilesAlphaGetMetadataArg} arg - The request parameters.
 * @returns {Promise.<(FilesFileMetadata|FilesFolderMetadata|FilesDeletedMetadata), Error.<FilesAlphaGetMetadataError>>}
 */
routes.filesAlphaGetMetadata = function (arg) {
  return this.request('files/alpha/get_metadata', arg, 'user', 'api', 'rpc');
};

/**
 * Create a new file with the contents provided in the request. Note that this
 * endpoint is part of the properties API alpha and is slightly different from
 * upload. Do not use this to upload a file larger than 150 MB. Instead, create
 * an upload session with upload_session/start.
 * @function Dropbox#filesAlphaUpload
 * @deprecated
 * @arg {FilesCommitInfoWithProperties} arg - The request parameters.
 * @returns {Promise.<FilesFileMetadata, Error.<FilesUploadErrorWithProperties>>}
 */
routes.filesAlphaUpload = function (arg) {
  return this.request('files/alpha/upload', arg, 'user', 'content', 'upload');
};

/**
 * Copy a file or folder to a different location in the user's Dropbox. If the
 * source path is a folder all its contents will be copied.
 * @function Dropbox#filesCopy
 * @deprecated
 * @arg {FilesRelocationArg} arg - The request parameters.
 * @returns {Promise.<(FilesFileMetadata|FilesFolderMetadata|FilesDeletedMetadata), Error.<FilesRelocationError>>}
 */
routes.filesCopy = function (arg) {
  return this.request('files/copy', arg, 'user', 'api', 'rpc');
};

/**
 * Copy multiple files or folders to different locations at once in the user's
 * Dropbox. If RelocationBatchArg.allow_shared_folder is false, this route is
 * atomic. If on entry failes, the whole transaction will abort. If
 * RelocationBatchArg.allow_shared_folder is true, not atomicity is guaranteed,
 * but you will be able to copy the contents of shared folders to new locations.
 * This route will return job ID immediately and do the async copy job in
 * background. Please use copy_batch/check to check the job status.
 * @function Dropbox#filesCopyBatch
 * @arg {FilesRelocationBatchArg} arg - The request parameters.
 * @returns {Promise.<FilesRelocationBatchLaunch, Error.<void>>}
 */
routes.filesCopyBatch = function (arg) {
  return this.request('files/copy_batch', arg, 'user', 'api', 'rpc');
};

/**
 * Returns the status of an asynchronous job for copy_batch. If success, it
 * returns list of results for each entry.
 * @function Dropbox#filesCopyBatchCheck
 * @arg {AsyncPollArg} arg - The request parameters.
 * @returns {Promise.<FilesRelocationBatchJobStatus, Error.<AsyncPollError>>}
 */
routes.filesCopyBatchCheck = function (arg) {
  return this.request('files/copy_batch/check', arg, 'user', 'api', 'rpc');
};

/**
 * Get a copy reference to a file or folder. This reference string can be used
 * to save that file or folder to another user's Dropbox by passing it to
 * copy_reference/save.
 * @function Dropbox#filesCopyReferenceGet
 * @arg {FilesGetCopyReferenceArg} arg - The request parameters.
 * @returns {Promise.<FilesGetCopyReferenceResult, Error.<FilesGetCopyReferenceError>>}
 */
routes.filesCopyReferenceGet = function (arg) {
  return this.request('files/copy_reference/get', arg, 'user', 'api', 'rpc');
};

/**
 * Save a copy reference returned by copy_reference/get to the user's Dropbox.
 * @function Dropbox#filesCopyReferenceSave
 * @arg {FilesSaveCopyReferenceArg} arg - The request parameters.
 * @returns {Promise.<FilesSaveCopyReferenceResult, Error.<FilesSaveCopyReferenceError>>}
 */
routes.filesCopyReferenceSave = function (arg) {
  return this.request('files/copy_reference/save', arg, 'user', 'api', 'rpc');
};

/**
 * Copy a file or folder to a different location in the user's Dropbox. If the
 * source path is a folder all its contents will be copied.
 * @function Dropbox#filesCopyV2
 * @arg {FilesRelocationArg} arg - The request parameters.
 * @returns {Promise.<FilesRelocationResult, Error.<FilesRelocationError>>}
 */
routes.filesCopyV2 = function (arg) {
  return this.request('files/copy_v2', arg, 'user', 'api', 'rpc');
};

/**
 * Create a folder at a given path.
 * @function Dropbox#filesCreateFolder
 * @deprecated
 * @arg {FilesCreateFolderArg} arg - The request parameters.
 * @returns {Promise.<FilesFolderMetadata, Error.<FilesCreateFolderError>>}
 */
routes.filesCreateFolder = function (arg) {
  return this.request('files/create_folder', arg, 'user', 'api', 'rpc');
};

/**
 * Create a folder at a given path.
 * @function Dropbox#filesCreateFolderV2
 * @arg {FilesCreateFolderArg} arg - The request parameters.
 * @returns {Promise.<FilesCreateFolderResult, Error.<FilesCreateFolderError>>}
 */
routes.filesCreateFolderV2 = function (arg) {
  return this.request('files/create_folder_v2', arg, 'user', 'api', 'rpc');
};

/**
 * Delete the file or folder at a given path. If the path is a folder, all its
 * contents will be deleted too. A successful response indicates that the file
 * or folder was deleted. The returned metadata will be the corresponding
 * FileMetadata or FolderMetadata for the item at time of deletion, and not a
 * DeletedMetadata object.
 * @function Dropbox#filesDelete
 * @deprecated
 * @arg {FilesDeleteArg} arg - The request parameters.
 * @returns {Promise.<(FilesFileMetadata|FilesFolderMetadata|FilesDeletedMetadata), Error.<FilesDeleteError>>}
 */
routes.filesDelete = function (arg) {
  return this.request('files/delete', arg, 'user', 'api', 'rpc');
};

/**
 * Delete multiple files/folders at once. This route is asynchronous, which
 * returns a job ID immediately and runs the delete batch asynchronously. Use
 * delete_batch/check to check the job status.
 * @function Dropbox#filesDeleteBatch
 * @arg {FilesDeleteBatchArg} arg - The request parameters.
 * @returns {Promise.<FilesDeleteBatchLaunch, Error.<void>>}
 */
routes.filesDeleteBatch = function (arg) {
  return this.request('files/delete_batch', arg, 'user', 'api', 'rpc');
};

/**
 * Returns the status of an asynchronous job for delete_batch. If success, it
 * returns list of result for each entry.
 * @function Dropbox#filesDeleteBatchCheck
 * @arg {AsyncPollArg} arg - The request parameters.
 * @returns {Promise.<FilesDeleteBatchJobStatus, Error.<AsyncPollError>>}
 */
routes.filesDeleteBatchCheck = function (arg) {
  return this.request('files/delete_batch/check', arg, 'user', 'api', 'rpc');
};

/**
 * Delete the file or folder at a given path. If the path is a folder, all its
 * contents will be deleted too. A successful response indicates that the file
 * or folder was deleted. The returned metadata will be the corresponding
 * FileMetadata or FolderMetadata for the item at time of deletion, and not a
 * DeletedMetadata object.
 * @function Dropbox#filesDeleteV2
 * @arg {FilesDeleteArg} arg - The request parameters.
 * @returns {Promise.<FilesDeleteResult, Error.<FilesDeleteError>>}
 */
routes.filesDeleteV2 = function (arg) {
  return this.request('files/delete_v2', arg, 'user', 'api', 'rpc');
};

/**
 * Download a file from a user's Dropbox.
 * @function Dropbox#filesDownload
 * @arg {FilesDownloadArg} arg - The request parameters.
 * @returns {Promise.<FilesFileMetadata, Error.<FilesDownloadError>>}
 */
routes.filesDownload = function (arg) {
  return this.request('files/download', arg, 'user', 'content', 'download');
};

/**
 * Download a folder from the user's Dropbox, as a zip file. The folder must be
 * less than 1 GB in size and have fewer than 10,000 total files. The input
 * cannot be a single file.
 * @function Dropbox#filesDownloadZip
 * @arg {FilesDownloadZipArg} arg - The request parameters.
 * @returns {Promise.<FilesDownloadZipResult, Error.<FilesDownloadZipError>>}
 */
routes.filesDownloadZip = function (arg) {
  return this.request('files/download_zip', arg, 'user', 'content', 'download');
};

/**
 * Returns the metadata for a file or folder. Note: Metadata for the root folder
 * is unsupported.
 * @function Dropbox#filesGetMetadata
 * @arg {FilesGetMetadataArg} arg - The request parameters.
 * @returns {Promise.<(FilesFileMetadata|FilesFolderMetadata|FilesDeletedMetadata), Error.<FilesGetMetadataError>>}
 */
routes.filesGetMetadata = function (arg) {
  return this.request('files/get_metadata', arg, 'user', 'api', 'rpc');
};

/**
 * Get a preview for a file. Currently, PDF previews are generated for files
 * with the following extensions: .ai, .doc, .docm, .docx, .eps, .odp, .odt,
 * .pps, .ppsm, .ppsx, .ppt, .pptm, .pptx, .rtf. HTML previews are generated for
 * files with the following extensions: .csv, .ods, .xls, .xlsm, .xlsx. Other
 * formats will return an unsupported extension error.
 * @function Dropbox#filesGetPreview
 * @arg {FilesPreviewArg} arg - The request parameters.
 * @returns {Promise.<FilesFileMetadata, Error.<FilesPreviewError>>}
 */
routes.filesGetPreview = function (arg) {
  return this.request('files/get_preview', arg, 'user', 'content', 'download');
};

/**
 * Get a temporary link to stream content of a file. This link will expire in
 * four hours and afterwards you will get 410 Gone. Content-Type of the link is
 * determined automatically by the file's mime type.
 * @function Dropbox#filesGetTemporaryLink
 * @arg {FilesGetTemporaryLinkArg} arg - The request parameters.
 * @returns {Promise.<FilesGetTemporaryLinkResult, Error.<FilesGetTemporaryLinkError>>}
 */
routes.filesGetTemporaryLink = function (arg) {
  return this.request('files/get_temporary_link', arg, 'user', 'api', 'rpc');
};

/**
 * Get a thumbnail for an image. This method currently supports files with the
 * following file extensions: jpg, jpeg, png, tiff, tif, gif and bmp. Photos
 * that are larger than 20MB in size won't be converted to a thumbnail.
 * @function Dropbox#filesGetThumbnail
 * @arg {FilesThumbnailArg} arg - The request parameters.
 * @returns {Promise.<FilesFileMetadata, Error.<FilesThumbnailError>>}
 */
routes.filesGetThumbnail = function (arg) {
  return this.request('files/get_thumbnail', arg, 'user', 'content', 'download');
};

/**
 * Get thumbnails for a list of images. We allow up to 25 thumbnails in a single
 * batch. This method currently supports files with the following file
 * extensions: jpg, jpeg, png, tiff, tif, gif and bmp. Photos that are larger
 * than 20MB in size won't be converted to a thumbnail.
 * @function Dropbox#filesGetThumbnailBatch
 * @arg {FilesGetThumbnailBatchArg} arg - The request parameters.
 * @returns {Promise.<FilesGetThumbnailBatchResult, Error.<FilesGetThumbnailBatchError>>}
 */
routes.filesGetThumbnailBatch = function (arg) {
  return this.request('files/get_thumbnail_batch', arg, 'user', 'content', 'rpc');
};

/**
 * Starts returning the contents of a folder. If the result's
 * ListFolderResult.has_more field is true, call list_folder/continue with the
 * returned ListFolderResult.cursor to retrieve more entries. If you're using
 * ListFolderArg.recursive set to true to keep a local cache of the contents of
 * a Dropbox account, iterate through each entry in order and process them as
 * follows to keep your local state in sync: For each FileMetadata, store the
 * new entry at the given path in your local state. If the required parent
 * folders don't exist yet, create them. If there's already something else at
 * the given path, replace it and remove all its children. For each
 * FolderMetadata, store the new entry at the given path in your local state. If
 * the required parent folders don't exist yet, create them. If there's already
 * something else at the given path, replace it but leave the children as they
 * are. Check the new entry's FolderSharingInfo.read_only and set all its
 * children's read-only statuses to match. For each DeletedMetadata, if your
 * local state has something at the given path, remove it and all its children.
 * If there's nothing at the given path, ignore this entry. Note:
 * auth.RateLimitError may be returned if multiple list_folder or
 * list_folder/continue calls with same parameters are made simultaneously by
 * same API app for same user. If your app implements retry logic, please hold
 * off the retry until the previous request finishes.
 * @function Dropbox#filesListFolder
 * @arg {FilesListFolderArg} arg - The request parameters.
 * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderError>>}
 */
routes.filesListFolder = function (arg) {
  return this.request('files/list_folder', arg, 'user', 'api', 'rpc');
};

/**
 * Once a cursor has been retrieved from list_folder, use this to paginate
 * through all files and retrieve updates to the folder, following the same
 * rules as documented for list_folder.
 * @function Dropbox#filesListFolderContinue
 * @arg {FilesListFolderContinueArg} arg - The request parameters.
 * @returns {Promise.<FilesListFolderResult, Error.<FilesListFolderContinueError>>}
 */
routes.filesListFolderContinue = function (arg) {
  return this.request('files/list_folder/continue', arg, 'user', 'api', 'rpc');
};

/**
 * A way to quickly get a cursor for the folder's state. Unlike list_folder,
 * list_folder/get_latest_cursor doesn't return any entries. This endpoint is
 * for app which only needs to know about new files and modifications and
 * doesn't need to know about files that already exist in Dropbox.
 * @function Dropbox#filesListFolderGetLatestCursor
 * @arg {FilesListFolderArg} arg - The request parameters.
 * @returns {Promise.<FilesListFolderGetLatestCursorResult, Error.<FilesListFolderError>>}
 */
routes.filesListFolderGetLatestCursor = function (arg) {
  return this.request('files/list_folder/get_latest_cursor', arg, 'user', 'api', 'rpc');
};

/**
 * A longpoll endpoint to wait for changes on an account. In conjunction with
 * list_folder/continue, this call gives you a low-latency way to monitor an
 * account for file changes. The connection will block until there are changes
 * available or a timeout occurs. This endpoint is useful mostly for client-side
 * apps. If you're looking for server-side notifications, check out our webhooks
 * documentation https://www.dropbox.com/developers/reference/webhooks.
 * @function Dropbox#filesListFolderLongpoll
 * @arg {FilesListFolderLongpollArg} arg - The request parameters.
 * @returns {Promise.<FilesListFolderLongpollResult, Error.<FilesListFolderLongpollError>>}
 */
routes.filesListFolderLongpoll = function (arg) {
  return this.request('files/list_folder/longpoll', arg, 'noauth', 'notify', 'rpc');
};

/**
 * Returns revisions for files based on a file path or a file id. The file path
 * or file id is identified from the latest file entry at the given file path or
 * id. This end point allows your app to query either by file path or file id by
 * setting the mode parameter appropriately. In the ListRevisionsMode.path
 * (default) mode, all revisions at the same file path as the latest file entry
 * are returned. If revisions with the same file id are desired, then mode must
 * be set to ListRevisionsMode.id. The ListRevisionsMode.id mode is useful to
 * retrieve revisions for a given file across moves or renames.
 * @function Dropbox#filesListRevisions
 * @arg {FilesListRevisionsArg} arg - The request parameters.
 * @returns {Promise.<FilesListRevisionsResult, Error.<FilesListRevisionsError>>}
 */
routes.filesListRevisions = function (arg) {
  return this.request('files/list_revisions', arg, 'user', 'api', 'rpc');
};

/**
 * Move a file or folder to a different location in the user's Dropbox. If the
 * source path is a folder all its contents will be moved.
 * @function Dropbox#filesMove
 * @deprecated
 * @arg {FilesRelocationArg} arg - The request parameters.
 * @returns {Promise.<(FilesFileMetadata|FilesFolderMetadata|FilesDeletedMetadata), Error.<FilesRelocationError>>}
 */
routes.filesMove = function (arg) {
  return this.request('files/move', arg, 'user', 'api', 'rpc');
};

/**
 * Move multiple files or folders to different locations at once in the user's
 * Dropbox. This route is 'all or nothing', which means if one entry fails, the
 * whole transaction will abort. This route will return job ID immediately and
 * do the async moving job in background. Please use move_batch/check to check
 * the job status.
 * @function Dropbox#filesMoveBatch
 * @arg {FilesRelocationBatchArg} arg - The request parameters.
 * @returns {Promise.<FilesRelocationBatchLaunch, Error.<void>>}
 */
routes.filesMoveBatch = function (arg) {
  return this.request('files/move_batch', arg, 'user', 'api', 'rpc');
};

/**
 * Returns the status of an asynchronous job for move_batch. If success, it
 * returns list of results for each entry.
 * @function Dropbox#filesMoveBatchCheck
 * @arg {AsyncPollArg} arg - The request parameters.
 * @returns {Promise.<FilesRelocationBatchJobStatus, Error.<AsyncPollError>>}
 */
routes.filesMoveBatchCheck = function (arg) {
  return this.request('files/move_batch/check', arg, 'user', 'api', 'rpc');
};

/**
 * Move a file or folder to a different location in the user's Dropbox. If the
 * source path is a folder all its contents will be moved.
 * @function Dropbox#filesMoveV2
 * @arg {FilesRelocationArg} arg - The request parameters.
 * @returns {Promise.<FilesRelocationResult, Error.<FilesRelocationError>>}
 */
routes.filesMoveV2 = function (arg) {
  return this.request('files/move_v2', arg, 'user', 'api', 'rpc');
};

/**
 * Permanently delete the file or folder at a given path (see
 * https://www.dropbox.com/en/help/40). Note: This endpoint is only available
 * for Dropbox Business apps.
 * @function Dropbox#filesPermanentlyDelete
 * @arg {FilesDeleteArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilesDeleteError>>}
 */
routes.filesPermanentlyDelete = function (arg) {
  return this.request('files/permanently_delete', arg, 'user', 'api', 'rpc');
};

/**
 * @function Dropbox#filesPropertiesAdd
 * @deprecated
 * @arg {FilePropertiesAddPropertiesArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilePropertiesAddPropertiesError>>}
 */
routes.filesPropertiesAdd = function (arg) {
  return this.request('files/properties/add', arg, 'user', 'api', 'rpc');
};

/**
 * @function Dropbox#filesPropertiesOverwrite
 * @deprecated
 * @arg {FilePropertiesOverwritePropertyGroupArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilePropertiesInvalidPropertyGroupError>>}
 */
routes.filesPropertiesOverwrite = function (arg) {
  return this.request('files/properties/overwrite', arg, 'user', 'api', 'rpc');
};

/**
 * @function Dropbox#filesPropertiesRemove
 * @deprecated
 * @arg {FilePropertiesRemovePropertiesArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilePropertiesRemovePropertiesError>>}
 */
routes.filesPropertiesRemove = function (arg) {
  return this.request('files/properties/remove', arg, 'user', 'api', 'rpc');
};

/**
 * @function Dropbox#filesPropertiesTemplateGet
 * @deprecated
 * @arg {FilePropertiesGetTemplateArg} arg - The request parameters.
 * @returns {Promise.<FilePropertiesGetTemplateResult, Error.<FilePropertiesTemplateError>>}
 */
routes.filesPropertiesTemplateGet = function (arg) {
  return this.request('files/properties/template/get', arg, 'user', 'api', 'rpc');
};

/**
 * @function Dropbox#filesPropertiesTemplateList
 * @deprecated
 * @arg {void} arg - The request parameters.
 * @returns {Promise.<FilePropertiesListTemplateResult, Error.<FilePropertiesTemplateError>>}
 */
routes.filesPropertiesTemplateList = function (arg) {
  return this.request('files/properties/template/list', arg, 'user', 'api', 'rpc');
};

/**
 * @function Dropbox#filesPropertiesUpdate
 * @deprecated
 * @arg {FilePropertiesUpdatePropertiesArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilePropertiesUpdatePropertiesError>>}
 */
routes.filesPropertiesUpdate = function (arg) {
  return this.request('files/properties/update', arg, 'user', 'api', 'rpc');
};

/**
 * Restore a file to a specific revision.
 * @function Dropbox#filesRestore
 * @arg {FilesRestoreArg} arg - The request parameters.
 * @returns {Promise.<FilesFileMetadata, Error.<FilesRestoreError>>}
 */
routes.filesRestore = function (arg) {
  return this.request('files/restore', arg, 'user', 'api', 'rpc');
};

/**
 * Save a specified URL into a file in user's Dropbox. If the given path already
 * exists, the file will be renamed to avoid the conflict (e.g. myfile (1).txt).
 * @function Dropbox#filesSaveUrl
 * @arg {FilesSaveUrlArg} arg - The request parameters.
 * @returns {Promise.<FilesSaveUrlResult, Error.<FilesSaveUrlError>>}
 */
routes.filesSaveUrl = function (arg) {
  return this.request('files/save_url', arg, 'user', 'api', 'rpc');
};

/**
 * Check the status of a save_url job.
 * @function Dropbox#filesSaveUrlCheckJobStatus
 * @arg {AsyncPollArg} arg - The request parameters.
 * @returns {Promise.<FilesSaveUrlJobStatus, Error.<AsyncPollError>>}
 */
routes.filesSaveUrlCheckJobStatus = function (arg) {
  return this.request('files/save_url/check_job_status', arg, 'user', 'api', 'rpc');
};

/**
 * Searches for files and folders. Note: Recent changes may not immediately be
 * reflected in search results due to a short delay in indexing.
 * @function Dropbox#filesSearch
 * @arg {FilesSearchArg} arg - The request parameters.
 * @returns {Promise.<FilesSearchResult, Error.<FilesSearchError>>}
 */
routes.filesSearch = function (arg) {
  return this.request('files/search', arg, 'user', 'api', 'rpc');
};

/**
 * Create a new file with the contents provided in the request. Do not use this
 * to upload a file larger than 150 MB. Instead, create an upload session with
 * upload_session/start.
 * @function Dropbox#filesUpload
 * @arg {FilesCommitInfo} arg - The request parameters.
 * @returns {Promise.<FilesFileMetadata, Error.<FilesUploadError>>}
 */
routes.filesUpload = function (arg) {
  return this.request('files/upload', arg, 'user', 'content', 'upload');
};

/**
 * Append more data to an upload session. A single request should not upload
 * more than 150 MB.
 * @function Dropbox#filesUploadSessionAppend
 * @deprecated
 * @arg {FilesUploadSessionCursor} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilesUploadSessionLookupError>>}
 */
routes.filesUploadSessionAppend = function (arg) {
  return this.request('files/upload_session/append', arg, 'user', 'content', 'upload');
};

/**
 * Append more data to an upload session. When the parameter close is set, this
 * call will close the session. A single request should not upload more than 150
 * MB.
 * @function Dropbox#filesUploadSessionAppendV2
 * @arg {FilesUploadSessionAppendArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<FilesUploadSessionLookupError>>}
 */
routes.filesUploadSessionAppendV2 = function (arg) {
  return this.request('files/upload_session/append_v2', arg, 'user', 'content', 'upload');
};

/**
 * Finish an upload session and save the uploaded data to the given file path. A
 * single request should not upload more than 150 MB.
 * @function Dropbox#filesUploadSessionFinish
 * @arg {FilesUploadSessionFinishArg} arg - The request parameters.
 * @returns {Promise.<FilesFileMetadata, Error.<FilesUploadSessionFinishError>>}
 */
routes.filesUploadSessionFinish = function (arg) {
  return this.request('files/upload_session/finish', arg, 'user', 'content', 'upload');
};

/**
 * This route helps you commit many files at once into a user's Dropbox. Use
 * upload_session/start and upload_session/append_v2 to upload file contents. We
 * recommend uploading many files in parallel to increase throughput. Once the
 * file contents have been uploaded, rather than calling upload_session/finish,
 * use this route to finish all your upload sessions in a single request.
 * UploadSessionStartArg.close or UploadSessionAppendArg.close needs to be true
 * for the last upload_session/start or upload_session/append_v2 call. This
 * route will return a job_id immediately and do the async commit job in
 * background. Use upload_session/finish_batch/check to check the job status.
 * For the same account, this route should be executed serially. That means you
 * should not start the next job before current job finishes. We allow up to
 * 1000 entries in a single request.
 * @function Dropbox#filesUploadSessionFinishBatch
 * @arg {FilesUploadSessionFinishBatchArg} arg - The request parameters.
 * @returns {Promise.<FilesUploadSessionFinishBatchLaunch, Error.<void>>}
 */
routes.filesUploadSessionFinishBatch = function (arg) {
  return this.request('files/upload_session/finish_batch', arg, 'user', 'api', 'rpc');
};

/**
 * Returns the status of an asynchronous job for upload_session/finish_batch. If
 * success, it returns list of result for each entry.
 * @function Dropbox#filesUploadSessionFinishBatchCheck
 * @arg {AsyncPollArg} arg - The request parameters.
 * @returns {Promise.<FilesUploadSessionFinishBatchJobStatus, Error.<AsyncPollError>>}
 */
routes.filesUploadSessionFinishBatchCheck = function (arg) {
  return this.request('files/upload_session/finish_batch/check', arg, 'user', 'api', 'rpc');
};

/**
 * Upload sessions allow you to upload a single file in one or more requests,
 * for example where the size of the file is greater than 150 MB.  This call
 * starts a new upload session with the given data. You can then use
 * upload_session/append_v2 to add more data and upload_session/finish to save
 * all the data to a file in Dropbox. A single request should not upload more
 * than 150 MB. An upload session can be used for a maximum of 48 hours.
 * Attempting to use an UploadSessionStartResult.session_id with
 * upload_session/append_v2 or upload_session/finish more than 48 hours after
 * its creation will return a UploadSessionLookupError.not_found.
 * @function Dropbox#filesUploadSessionStart
 * @arg {FilesUploadSessionStartArg} arg - The request parameters.
 * @returns {Promise.<FilesUploadSessionStartResult, Error.<void>>}
 */
routes.filesUploadSessionStart = function (arg) {
  return this.request('files/upload_session/start', arg, 'user', 'content', 'upload');
};

/**
 * Marks the given Paper doc as archived. Note: This action can be performed or
 * undone by anyone with edit permissions to the doc.
 * @function Dropbox#paperDocsArchive
 * @arg {PaperRefPaperDoc} arg - The request parameters.
 * @returns {Promise.<void, Error.<PaperDocLookupError>>}
 */
routes.paperDocsArchive = function (arg) {
  return this.request('paper/docs/archive', arg, 'user', 'api', 'rpc');
};

/**
 * Creates a new Paper doc with the provided content.
 * @function Dropbox#paperDocsCreate
 * @arg {PaperPaperDocCreateArgs} arg - The request parameters.
 * @returns {Promise.<PaperPaperDocCreateUpdateResult, Error.<PaperPaperDocCreateError>>}
 */
routes.paperDocsCreate = function (arg) {
  return this.request('paper/docs/create', arg, 'user', 'api', 'upload');
};

/**
 * Exports and downloads Paper doc either as HTML or markdown.
 * @function Dropbox#paperDocsDownload
 * @arg {PaperPaperDocExport} arg - The request parameters.
 * @returns {Promise.<PaperPaperDocExportResult, Error.<PaperDocLookupError>>}
 */
routes.paperDocsDownload = function (arg) {
  return this.request('paper/docs/download', arg, 'user', 'api', 'download');
};

/**
 * Lists the users who are explicitly invited to the Paper folder in which the
 * Paper doc is contained. For private folders all users (including owner)
 * shared on the folder are listed and for team folders all non-team users
 * shared on the folder are returned.
 * @function Dropbox#paperDocsFolderUsersList
 * @arg {PaperListUsersOnFolderArgs} arg - The request parameters.
 * @returns {Promise.<PaperListUsersOnFolderResponse, Error.<PaperDocLookupError>>}
 */
routes.paperDocsFolderUsersList = function (arg) {
  return this.request('paper/docs/folder_users/list', arg, 'user', 'api', 'rpc');
};

/**
 * Once a cursor has been retrieved from docs/folder_users/list, use this to
 * paginate through all users on the Paper folder.
 * @function Dropbox#paperDocsFolderUsersListContinue
 * @arg {PaperListUsersOnFolderContinueArgs} arg - The request parameters.
 * @returns {Promise.<PaperListUsersOnFolderResponse, Error.<PaperListUsersCursorError>>}
 */
routes.paperDocsFolderUsersListContinue = function (arg) {
  return this.request('paper/docs/folder_users/list/continue', arg, 'user', 'api', 'rpc');
};

/**
 * Retrieves folder information for the given Paper doc. This includes:   -
 * folder sharing policy; permissions for subfolders are set by the top-level
 * folder.   - full 'filepath', i.e. the list of folders (both folderId and
 * folderName) from the root folder to the folder directly containing the Paper
 * doc.  Note: If the Paper doc is not in any folder (aka unfiled) the response
 * will be empty.
 * @function Dropbox#paperDocsGetFolderInfo
 * @arg {PaperRefPaperDoc} arg - The request parameters.
 * @returns {Promise.<PaperFoldersContainingPaperDoc, Error.<PaperDocLookupError>>}
 */
routes.paperDocsGetFolderInfo = function (arg) {
  return this.request('paper/docs/get_folder_info', arg, 'user', 'api', 'rpc');
};

/**
 * Return the list of all Paper docs according to the argument specifications.
 * To iterate over through the full pagination, pass the cursor to
 * docs/list/continue.
 * @function Dropbox#paperDocsList
 * @arg {PaperListPaperDocsArgs} arg - The request parameters.
 * @returns {Promise.<PaperListPaperDocsResponse, Error.<void>>}
 */
routes.paperDocsList = function (arg) {
  return this.request('paper/docs/list', arg, 'user', 'api', 'rpc');
};

/**
 * Once a cursor has been retrieved from docs/list, use this to paginate through
 * all Paper doc.
 * @function Dropbox#paperDocsListContinue
 * @arg {PaperListPaperDocsContinueArgs} arg - The request parameters.
 * @returns {Promise.<PaperListPaperDocsResponse, Error.<PaperListDocsCursorError>>}
 */
routes.paperDocsListContinue = function (arg) {
  return this.request('paper/docs/list/continue', arg, 'user', 'api', 'rpc');
};

/**
 * Permanently deletes the given Paper doc. This operation is final as the doc
 * cannot be recovered.  Note: This action can be performed only by the doc
 * owner.
 * @function Dropbox#paperDocsPermanentlyDelete
 * @arg {PaperRefPaperDoc} arg - The request parameters.
 * @returns {Promise.<void, Error.<PaperDocLookupError>>}
 */
routes.paperDocsPermanentlyDelete = function (arg) {
  return this.request('paper/docs/permanently_delete', arg, 'user', 'api', 'rpc');
};

/**
 * Gets the default sharing policy for the given Paper doc.
 * @function Dropbox#paperDocsSharingPolicyGet
 * @arg {PaperRefPaperDoc} arg - The request parameters.
 * @returns {Promise.<PaperSharingPolicy, Error.<PaperDocLookupError>>}
 */
routes.paperDocsSharingPolicyGet = function (arg) {
  return this.request('paper/docs/sharing_policy/get', arg, 'user', 'api', 'rpc');
};

/**
 * Sets the default sharing policy for the given Paper doc. The default
 * 'team_sharing_policy' can be changed only by teams, omit this field for
 * personal accounts.  Note: 'public_sharing_policy' cannot be set to the value
 * 'disabled' because this setting can be changed only via the team admin
 * console.
 * @function Dropbox#paperDocsSharingPolicySet
 * @arg {PaperPaperDocSharingPolicy} arg - The request parameters.
 * @returns {Promise.<void, Error.<PaperDocLookupError>>}
 */
routes.paperDocsSharingPolicySet = function (arg) {
  return this.request('paper/docs/sharing_policy/set', arg, 'user', 'api', 'rpc');
};

/**
 * Updates an existing Paper doc with the provided content.
 * @function Dropbox#paperDocsUpdate
 * @arg {PaperPaperDocUpdateArgs} arg - The request parameters.
 * @returns {Promise.<PaperPaperDocCreateUpdateResult, Error.<PaperPaperDocUpdateError>>}
 */
routes.paperDocsUpdate = function (arg) {
  return this.request('paper/docs/update', arg, 'user', 'api', 'upload');
};

/**
 * Allows an owner or editor to add users to a Paper doc or change their
 * permissions using their email address or Dropbox account ID.  Note: The Doc
 * owner's permissions cannot be changed.
 * @function Dropbox#paperDocsUsersAdd
 * @arg {PaperAddPaperDocUser} arg - The request parameters.
 * @returns {Promise.<Array.<PaperAddPaperDocUserMemberResult>, Error.<PaperDocLookupError>>}
 */
routes.paperDocsUsersAdd = function (arg) {
  return this.request('paper/docs/users/add', arg, 'user', 'api', 'rpc');
};

/**
 * Lists all users who visited the Paper doc or users with explicit access. This
 * call excludes users who have been removed. The list is sorted by the date of
 * the visit or the share date. The list will include both users, the explicitly
 * shared ones as well as those who came in using the Paper url link.
 * @function Dropbox#paperDocsUsersList
 * @arg {PaperListUsersOnPaperDocArgs} arg - The request parameters.
 * @returns {Promise.<PaperListUsersOnPaperDocResponse, Error.<PaperDocLookupError>>}
 */
routes.paperDocsUsersList = function (arg) {
  return this.request('paper/docs/users/list', arg, 'user', 'api', 'rpc');
};

/**
 * Once a cursor has been retrieved from docs/users/list, use this to paginate
 * through all users on the Paper doc.
 * @function Dropbox#paperDocsUsersListContinue
 * @arg {PaperListUsersOnPaperDocContinueArgs} arg - The request parameters.
 * @returns {Promise.<PaperListUsersOnPaperDocResponse, Error.<PaperListUsersCursorError>>}
 */
routes.paperDocsUsersListContinue = function (arg) {
  return this.request('paper/docs/users/list/continue', arg, 'user', 'api', 'rpc');
};

/**
 * Allows an owner or editor to remove users from a Paper doc using their email
 * address or Dropbox account ID.  Note: Doc owner cannot be removed.
 * @function Dropbox#paperDocsUsersRemove
 * @arg {PaperRemovePaperDocUser} arg - The request parameters.
 * @returns {Promise.<void, Error.<PaperDocLookupError>>}
 */
routes.paperDocsUsersRemove = function (arg) {
  return this.request('paper/docs/users/remove', arg, 'user', 'api', 'rpc');
};

/**
 * Adds specified members to a file.
 * @function Dropbox#sharingAddFileMember
 * @arg {SharingAddFileMemberArgs} arg - The request parameters.
 * @returns {Promise.<Array.<SharingFileMemberActionResult>, Error.<SharingAddFileMemberError>>}
 */
routes.sharingAddFileMember = function (arg) {
  return this.request('sharing/add_file_member', arg, 'user', 'api', 'rpc');
};

/**
 * Allows an owner or editor (if the ACL update policy allows) of a shared
 * folder to add another member. For the new member to get access to all the
 * functionality for this folder, you will need to call mount_folder on their
 * behalf. Apps must have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingAddFolderMember
 * @arg {SharingAddFolderMemberArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<SharingAddFolderMemberError>>}
 */
routes.sharingAddFolderMember = function (arg) {
  return this.request('sharing/add_folder_member', arg, 'user', 'api', 'rpc');
};

/**
 * Identical to update_file_member but with less information returned.
 * @function Dropbox#sharingChangeFileMemberAccess
 * @deprecated
 * @arg {SharingChangeFileMemberAccessArgs} arg - The request parameters.
 * @returns {Promise.<SharingFileMemberActionResult, Error.<SharingFileMemberActionError>>}
 */
routes.sharingChangeFileMemberAccess = function (arg) {
  return this.request('sharing/change_file_member_access', arg, 'user', 'api', 'rpc');
};

/**
 * Returns the status of an asynchronous job. Apps must have full Dropbox access
 * to use this endpoint.
 * @function Dropbox#sharingCheckJobStatus
 * @arg {AsyncPollArg} arg - The request parameters.
 * @returns {Promise.<SharingJobStatus, Error.<AsyncPollError>>}
 */
routes.sharingCheckJobStatus = function (arg) {
  return this.request('sharing/check_job_status', arg, 'user', 'api', 'rpc');
};

/**
 * Returns the status of an asynchronous job for sharing a folder. Apps must
 * have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingCheckRemoveMemberJobStatus
 * @arg {AsyncPollArg} arg - The request parameters.
 * @returns {Promise.<SharingRemoveMemberJobStatus, Error.<AsyncPollError>>}
 */
routes.sharingCheckRemoveMemberJobStatus = function (arg) {
  return this.request('sharing/check_remove_member_job_status', arg, 'user', 'api', 'rpc');
};

/**
 * Returns the status of an asynchronous job for sharing a folder. Apps must
 * have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingCheckShareJobStatus
 * @arg {AsyncPollArg} arg - The request parameters.
 * @returns {Promise.<SharingShareFolderJobStatus, Error.<AsyncPollError>>}
 */
routes.sharingCheckShareJobStatus = function (arg) {
  return this.request('sharing/check_share_job_status', arg, 'user', 'api', 'rpc');
};

/**
 * Create a shared link. If a shared link already exists for the given path,
 * that link is returned. Note that in the returned PathLinkMetadata, the
 * PathLinkMetadata.url field is the shortened URL if
 * CreateSharedLinkArg.short_url argument is set to true. Previously, it was
 * technically possible to break a shared link by moving or renaming the
 * corresponding file or folder. In the future, this will no longer be the case,
 * so your app shouldn't rely on this behavior. Instead, if your app needs to
 * revoke a shared link, use revoke_shared_link.
 * @function Dropbox#sharingCreateSharedLink
 * @deprecated
 * @arg {SharingCreateSharedLinkArg} arg - The request parameters.
 * @returns {Promise.<SharingPathLinkMetadata, Error.<SharingCreateSharedLinkError>>}
 */
routes.sharingCreateSharedLink = function (arg) {
  return this.request('sharing/create_shared_link', arg, 'user', 'api', 'rpc');
};

/**
 * Create a shared link with custom settings. If no settings are given then the
 * default visibility is RequestedVisibility.public (The resolved visibility,
 * though, may depend on other aspects such as team and shared folder settings).
 * @function Dropbox#sharingCreateSharedLinkWithSettings
 * @arg {SharingCreateSharedLinkWithSettingsArg} arg - The request parameters.
 * @returns {Promise.<(SharingFileLinkMetadata|SharingFolderLinkMetadata|SharingSharedLinkMetadata), Error.<SharingCreateSharedLinkWithSettingsError>>}
 */
routes.sharingCreateSharedLinkWithSettings = function (arg) {
  return this.request('sharing/create_shared_link_with_settings', arg, 'user', 'api', 'rpc');
};

/**
 * Returns shared file metadata.
 * @function Dropbox#sharingGetFileMetadata
 * @arg {SharingGetFileMetadataArg} arg - The request parameters.
 * @returns {Promise.<SharingSharedFileMetadata, Error.<SharingGetFileMetadataError>>}
 */
routes.sharingGetFileMetadata = function (arg) {
  return this.request('sharing/get_file_metadata', arg, 'user', 'api', 'rpc');
};

/**
 * Returns shared file metadata.
 * @function Dropbox#sharingGetFileMetadataBatch
 * @arg {SharingGetFileMetadataBatchArg} arg - The request parameters.
 * @returns {Promise.<Array.<SharingGetFileMetadataBatchResult>, Error.<SharingSharingUserError>>}
 */
routes.sharingGetFileMetadataBatch = function (arg) {
  return this.request('sharing/get_file_metadata/batch', arg, 'user', 'api', 'rpc');
};

/**
 * Returns shared folder metadata by its folder ID. Apps must have full Dropbox
 * access to use this endpoint.
 * @function Dropbox#sharingGetFolderMetadata
 * @arg {SharingGetMetadataArgs} arg - The request parameters.
 * @returns {Promise.<SharingSharedFolderMetadata, Error.<SharingSharedFolderAccessError>>}
 */
routes.sharingGetFolderMetadata = function (arg) {
  return this.request('sharing/get_folder_metadata', arg, 'user', 'api', 'rpc');
};

/**
 * Download the shared link's file from a user's Dropbox.
 * @function Dropbox#sharingGetSharedLinkFile
 * @arg {Object} arg - The request parameters.
 * @returns {Promise.<(SharingFileLinkMetadata|SharingFolderLinkMetadata|SharingSharedLinkMetadata), Error.<SharingGetSharedLinkFileError>>}
 */
routes.sharingGetSharedLinkFile = function (arg) {
  return this.request('sharing/get_shared_link_file', arg, 'user', 'content', 'download');
};

/**
 * Get the shared link's metadata.
 * @function Dropbox#sharingGetSharedLinkMetadata
 * @arg {SharingGetSharedLinkMetadataArg} arg - The request parameters.
 * @returns {Promise.<(SharingFileLinkMetadata|SharingFolderLinkMetadata|SharingSharedLinkMetadata), Error.<SharingSharedLinkError>>}
 */
routes.sharingGetSharedLinkMetadata = function (arg) {
  return this.request('sharing/get_shared_link_metadata', arg, 'user', 'api', 'rpc');
};

/**
 * Returns a list of LinkMetadata objects for this user, including collection
 * links. If no path is given, returns a list of all shared links for the
 * current user, including collection links, up to a maximum of 1000 links. If a
 * non-empty path is given, returns a list of all shared links that allow access
 * to the given path.  Collection links are never returned in this case. Note
 * that the url field in the response is never the shortened URL.
 * @function Dropbox#sharingGetSharedLinks
 * @deprecated
 * @arg {SharingGetSharedLinksArg} arg - The request parameters.
 * @returns {Promise.<SharingGetSharedLinksResult, Error.<SharingGetSharedLinksError>>}
 */
routes.sharingGetSharedLinks = function (arg) {
  return this.request('sharing/get_shared_links', arg, 'user', 'api', 'rpc');
};

/**
 * Use to obtain the members who have been invited to a file, both inherited and
 * uninherited members.
 * @function Dropbox#sharingListFileMembers
 * @arg {SharingListFileMembersArg} arg - The request parameters.
 * @returns {Promise.<SharingSharedFileMembers, Error.<SharingListFileMembersError>>}
 */
routes.sharingListFileMembers = function (arg) {
  return this.request('sharing/list_file_members', arg, 'user', 'api', 'rpc');
};

/**
 * Get members of multiple files at once. The arguments to this route are more
 * limited, and the limit on query result size per file is more strict. To
 * customize the results more, use the individual file endpoint. Inherited users
 * and groups are not included in the result, and permissions are not returned
 * for this endpoint.
 * @function Dropbox#sharingListFileMembersBatch
 * @arg {SharingListFileMembersBatchArg} arg - The request parameters.
 * @returns {Promise.<Array.<SharingListFileMembersBatchResult>, Error.<SharingSharingUserError>>}
 */
routes.sharingListFileMembersBatch = function (arg) {
  return this.request('sharing/list_file_members/batch', arg, 'user', 'api', 'rpc');
};

/**
 * Once a cursor has been retrieved from list_file_members or
 * list_file_members/batch, use this to paginate through all shared file
 * members.
 * @function Dropbox#sharingListFileMembersContinue
 * @arg {SharingListFileMembersContinueArg} arg - The request parameters.
 * @returns {Promise.<SharingSharedFileMembers, Error.<SharingListFileMembersContinueError>>}
 */
routes.sharingListFileMembersContinue = function (arg) {
  return this.request('sharing/list_file_members/continue', arg, 'user', 'api', 'rpc');
};

/**
 * Returns shared folder membership by its folder ID. Apps must have full
 * Dropbox access to use this endpoint.
 * @function Dropbox#sharingListFolderMembers
 * @arg {SharingListFolderMembersArgs} arg - The request parameters.
 * @returns {Promise.<SharingSharedFolderMembers, Error.<SharingSharedFolderAccessError>>}
 */
routes.sharingListFolderMembers = function (arg) {
  return this.request('sharing/list_folder_members', arg, 'user', 'api', 'rpc');
};

/**
 * Once a cursor has been retrieved from list_folder_members, use this to
 * paginate through all shared folder members. Apps must have full Dropbox
 * access to use this endpoint.
 * @function Dropbox#sharingListFolderMembersContinue
 * @arg {SharingListFolderMembersContinueArg} arg - The request parameters.
 * @returns {Promise.<SharingSharedFolderMembers, Error.<SharingListFolderMembersContinueError>>}
 */
routes.sharingListFolderMembersContinue = function (arg) {
  return this.request('sharing/list_folder_members/continue', arg, 'user', 'api', 'rpc');
};

/**
 * Return the list of all shared folders the current user has access to. Apps
 * must have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingListFolders
 * @arg {SharingListFoldersArgs} arg - The request parameters.
 * @returns {Promise.<SharingListFoldersResult, Error.<void>>}
 */
routes.sharingListFolders = function (arg) {
  return this.request('sharing/list_folders', arg, 'user', 'api', 'rpc');
};

/**
 * Once a cursor has been retrieved from list_folders, use this to paginate
 * through all shared folders. The cursor must come from a previous call to
 * list_folders or list_folders/continue. Apps must have full Dropbox access to
 * use this endpoint.
 * @function Dropbox#sharingListFoldersContinue
 * @arg {SharingListFoldersContinueArg} arg - The request parameters.
 * @returns {Promise.<SharingListFoldersResult, Error.<SharingListFoldersContinueError>>}
 */
routes.sharingListFoldersContinue = function (arg) {
  return this.request('sharing/list_folders/continue', arg, 'user', 'api', 'rpc');
};

/**
 * Return the list of all shared folders the current user can mount or unmount.
 * Apps must have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingListMountableFolders
 * @arg {SharingListFoldersArgs} arg - The request parameters.
 * @returns {Promise.<SharingListFoldersResult, Error.<void>>}
 */
routes.sharingListMountableFolders = function (arg) {
  return this.request('sharing/list_mountable_folders', arg, 'user', 'api', 'rpc');
};

/**
 * Once a cursor has been retrieved from list_mountable_folders, use this to
 * paginate through all mountable shared folders. The cursor must come from a
 * previous call to list_mountable_folders or list_mountable_folders/continue.
 * Apps must have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingListMountableFoldersContinue
 * @arg {SharingListFoldersContinueArg} arg - The request parameters.
 * @returns {Promise.<SharingListFoldersResult, Error.<SharingListFoldersContinueError>>}
 */
routes.sharingListMountableFoldersContinue = function (arg) {
  return this.request('sharing/list_mountable_folders/continue', arg, 'user', 'api', 'rpc');
};

/**
 * Returns a list of all files shared with current user.  Does not include files
 * the user has received via shared folders, and does  not include unclaimed
 * invitations.
 * @function Dropbox#sharingListReceivedFiles
 * @arg {SharingListFilesArg} arg - The request parameters.
 * @returns {Promise.<SharingListFilesResult, Error.<SharingSharingUserError>>}
 */
routes.sharingListReceivedFiles = function (arg) {
  return this.request('sharing/list_received_files', arg, 'user', 'api', 'rpc');
};

/**
 * Get more results with a cursor from list_received_files.
 * @function Dropbox#sharingListReceivedFilesContinue
 * @arg {SharingListFilesContinueArg} arg - The request parameters.
 * @returns {Promise.<SharingListFilesResult, Error.<SharingListFilesContinueError>>}
 */
routes.sharingListReceivedFilesContinue = function (arg) {
  return this.request('sharing/list_received_files/continue', arg, 'user', 'api', 'rpc');
};

/**
 * List shared links of this user. If no path is given, returns a list of all
 * shared links for the current user. If a non-empty path is given, returns a
 * list of all shared links that allow access to the given path - direct links
 * to the given path and links to parent folders of the given path. Links to
 * parent folders can be suppressed by setting direct_only to true.
 * @function Dropbox#sharingListSharedLinks
 * @arg {SharingListSharedLinksArg} arg - The request parameters.
 * @returns {Promise.<SharingListSharedLinksResult, Error.<SharingListSharedLinksError>>}
 */
routes.sharingListSharedLinks = function (arg) {
  return this.request('sharing/list_shared_links', arg, 'user', 'api', 'rpc');
};

/**
 * Modify the shared link's settings. If the requested visibility conflict with
 * the shared links policy of the team or the shared folder (in case the linked
 * file is part of a shared folder) then the LinkPermissions.resolved_visibility
 * of the returned SharedLinkMetadata will reflect the actual visibility of the
 * shared link and the LinkPermissions.requested_visibility will reflect the
 * requested visibility.
 * @function Dropbox#sharingModifySharedLinkSettings
 * @arg {SharingModifySharedLinkSettingsArgs} arg - The request parameters.
 * @returns {Promise.<(SharingFileLinkMetadata|SharingFolderLinkMetadata|SharingSharedLinkMetadata), Error.<SharingModifySharedLinkSettingsError>>}
 */
routes.sharingModifySharedLinkSettings = function (arg) {
  return this.request('sharing/modify_shared_link_settings', arg, 'user', 'api', 'rpc');
};

/**
 * The current user mounts the designated folder. Mount a shared folder for a
 * user after they have been added as a member. Once mounted, the shared folder
 * will appear in their Dropbox. Apps must have full Dropbox access to use this
 * endpoint.
 * @function Dropbox#sharingMountFolder
 * @arg {SharingMountFolderArg} arg - The request parameters.
 * @returns {Promise.<SharingSharedFolderMetadata, Error.<SharingMountFolderError>>}
 */
routes.sharingMountFolder = function (arg) {
  return this.request('sharing/mount_folder', arg, 'user', 'api', 'rpc');
};

/**
 * The current user relinquishes their membership in the designated file. Note
 * that the current user may still have inherited access to this file through
 * the parent folder. Apps must have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingRelinquishFileMembership
 * @arg {SharingRelinquishFileMembershipArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<SharingRelinquishFileMembershipError>>}
 */
routes.sharingRelinquishFileMembership = function (arg) {
  return this.request('sharing/relinquish_file_membership', arg, 'user', 'api', 'rpc');
};

/**
 * The current user relinquishes their membership in the designated shared
 * folder and will no longer have access to the folder.  A folder owner cannot
 * relinquish membership in their own folder. This will run synchronously if
 * leave_a_copy is false, and asynchronously if leave_a_copy is true. Apps must
 * have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingRelinquishFolderMembership
 * @arg {SharingRelinquishFolderMembershipArg} arg - The request parameters.
 * @returns {Promise.<AsyncLaunchEmptyResult, Error.<SharingRelinquishFolderMembershipError>>}
 */
routes.sharingRelinquishFolderMembership = function (arg) {
  return this.request('sharing/relinquish_folder_membership', arg, 'user', 'api', 'rpc');
};

/**
 * Identical to remove_file_member_2 but with less information returned.
 * @function Dropbox#sharingRemoveFileMember
 * @deprecated
 * @arg {SharingRemoveFileMemberArg} arg - The request parameters.
 * @returns {Promise.<SharingFileMemberActionIndividualResult, Error.<SharingRemoveFileMemberError>>}
 */
routes.sharingRemoveFileMember = function (arg) {
  return this.request('sharing/remove_file_member', arg, 'user', 'api', 'rpc');
};

/**
 * Removes a specified member from the file.
 * @function Dropbox#sharingRemoveFileMember2
 * @arg {SharingRemoveFileMemberArg} arg - The request parameters.
 * @returns {Promise.<SharingFileMemberRemoveActionResult, Error.<SharingRemoveFileMemberError>>}
 */
routes.sharingRemoveFileMember2 = function (arg) {
  return this.request('sharing/remove_file_member_2', arg, 'user', 'api', 'rpc');
};

/**
 * Allows an owner or editor (if the ACL update policy allows) of a shared
 * folder to remove another member. Apps must have full Dropbox access to use
 * this endpoint.
 * @function Dropbox#sharingRemoveFolderMember
 * @arg {SharingRemoveFolderMemberArg} arg - The request parameters.
 * @returns {Promise.<AsyncLaunchResultBase, Error.<SharingRemoveFolderMemberError>>}
 */
routes.sharingRemoveFolderMember = function (arg) {
  return this.request('sharing/remove_folder_member', arg, 'user', 'api', 'rpc');
};

/**
 * Revoke a shared link. Note that even after revoking a shared link to a file,
 * the file may be accessible if there are shared links leading to any of the
 * file parent folders. To list all shared links that enable access to a
 * specific file, you can use the list_shared_links with the file as the
 * ListSharedLinksArg.path argument.
 * @function Dropbox#sharingRevokeSharedLink
 * @arg {SharingRevokeSharedLinkArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<SharingRevokeSharedLinkError>>}
 */
routes.sharingRevokeSharedLink = function (arg) {
  return this.request('sharing/revoke_shared_link', arg, 'user', 'api', 'rpc');
};

/**
 * Share a folder with collaborators. Most sharing will be completed
 * synchronously. Large folders will be completed asynchronously. To make
 * testing the async case repeatable, set `ShareFolderArg.force_async`. If a
 * ShareFolderLaunch.async_job_id is returned, you'll need to call
 * check_share_job_status until the action completes to get the metadata for the
 * folder. Apps must have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingShareFolder
 * @arg {SharingShareFolderArg} arg - The request parameters.
 * @returns {Promise.<SharingShareFolderLaunch, Error.<SharingShareFolderError>>}
 */
routes.sharingShareFolder = function (arg) {
  return this.request('sharing/share_folder', arg, 'user', 'api', 'rpc');
};

/**
 * Transfer ownership of a shared folder to a member of the shared folder. User
 * must have AccessLevel.owner access to the shared folder to perform a
 * transfer. Apps must have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingTransferFolder
 * @arg {SharingTransferFolderArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<SharingTransferFolderError>>}
 */
routes.sharingTransferFolder = function (arg) {
  return this.request('sharing/transfer_folder', arg, 'user', 'api', 'rpc');
};

/**
 * The current user unmounts the designated folder. They can re-mount the folder
 * at a later time using mount_folder. Apps must have full Dropbox access to use
 * this endpoint.
 * @function Dropbox#sharingUnmountFolder
 * @arg {SharingUnmountFolderArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<SharingUnmountFolderError>>}
 */
routes.sharingUnmountFolder = function (arg) {
  return this.request('sharing/unmount_folder', arg, 'user', 'api', 'rpc');
};

/**
 * Remove all members from this file. Does not remove inherited members.
 * @function Dropbox#sharingUnshareFile
 * @arg {SharingUnshareFileArg} arg - The request parameters.
 * @returns {Promise.<void, Error.<SharingUnshareFileError>>}
 */
routes.sharingUnshareFile = function (arg) {
  return this.request('sharing/unshare_file', arg, 'user', 'api', 'rpc');
};

/**
 * Allows a shared folder owner to unshare the folder. You'll need to call
 * check_job_status to determine if the action has completed successfully. Apps
 * must have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingUnshareFolder
 * @arg {SharingUnshareFolderArg} arg - The request parameters.
 * @returns {Promise.<AsyncLaunchEmptyResult, Error.<SharingUnshareFolderError>>}
 */
routes.sharingUnshareFolder = function (arg) {
  return this.request('sharing/unshare_folder', arg, 'user', 'api', 'rpc');
};

/**
 * Changes a member's access on a shared file.
 * @function Dropbox#sharingUpdateFileMember
 * @arg {SharingUpdateFileMemberArgs} arg - The request parameters.
 * @returns {Promise.<SharingMemberAccessLevelResult, Error.<SharingFileMemberActionError>>}
 */
routes.sharingUpdateFileMember = function (arg) {
  return this.request('sharing/update_file_member', arg, 'user', 'api', 'rpc');
};

/**
 * Allows an owner or editor of a shared folder to update another member's
 * permissions. Apps must have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingUpdateFolderMember
 * @arg {SharingUpdateFolderMemberArg} arg - The request parameters.
 * @returns {Promise.<SharingMemberAccessLevelResult, Error.<SharingUpdateFolderMemberError>>}
 */
routes.sharingUpdateFolderMember = function (arg) {
  return this.request('sharing/update_folder_member', arg, 'user', 'api', 'rpc');
};

/**
 * Update the sharing policies for a shared folder. User must have
 * AccessLevel.owner access to the shared folder to update its policies. Apps
 * must have full Dropbox access to use this endpoint.
 * @function Dropbox#sharingUpdateFolderPolicy
 * @arg {SharingUpdateFolderPolicyArg} arg - The request parameters.
 * @returns {Promise.<SharingSharedFolderMetadata, Error.<SharingUpdateFolderPolicyError>>}
 */
routes.sharingUpdateFolderPolicy = function (arg) {
  return this.request('sharing/update_folder_policy', arg, 'user', 'api', 'rpc');
};

/**
 * Retrieves team events. Permission : Team Auditing.
 * @function Dropbox#teamLogGetEvents
 * @arg {TeamLogGetTeamEventsArg} arg - The request parameters.
 * @returns {Promise.<TeamLogGetTeamEventsResult, Error.<TeamLogGetTeamEventsError>>}
 */
routes.teamLogGetEvents = function (arg) {
  return this.request('team_log/get_events', arg, 'team', 'api', 'rpc');
};

/**
 * Once a cursor has been retrieved from get_events, use this to paginate
 * through all events. Permission : Team Auditing.
 * @function Dropbox#teamLogGetEventsContinue
 * @arg {TeamLogGetTeamEventsContinueArg} arg - The request parameters.
 * @returns {Promise.<TeamLogGetTeamEventsResult, Error.<TeamLogGetTeamEventsContinueError>>}
 */
routes.teamLogGetEventsContinue = function (arg) {
  return this.request('team_log/get_events/continue', arg, 'team', 'api', 'rpc');
};

/**
 * Get information about a user's account.
 * @function Dropbox#usersGetAccount
 * @arg {UsersGetAccountArg} arg - The request parameters.
 * @returns {Promise.<UsersBasicAccount, Error.<UsersGetAccountError>>}
 */
routes.usersGetAccount = function (arg) {
  return this.request('users/get_account', arg, 'user', 'api', 'rpc');
};

/**
 * Get information about multiple user accounts.  At most 300 accounts may be
 * queried per request.
 * @function Dropbox#usersGetAccountBatch
 * @arg {UsersGetAccountBatchArg} arg - The request parameters.
 * @returns {Promise.<Object, Error.<UsersGetAccountBatchError>>}
 */
routes.usersGetAccountBatch = function (arg) {
  return this.request('users/get_account_batch', arg, 'user', 'api', 'rpc');
};

/**
 * Get information about the current user's account.
 * @function Dropbox#usersGetCurrentAccount
 * @arg {void} arg - The request parameters.
 * @returns {Promise.<UsersFullAccount, Error.<void>>}
 */
routes.usersGetCurrentAccount = function (arg) {
  return this.request('users/get_current_account', arg, 'user', 'api', 'rpc');
};

/**
 * Get the space usage information for the current user's account.
 * @function Dropbox#usersGetSpaceUsage
 * @arg {void} arg - The request parameters.
 * @returns {Promise.<UsersSpaceUsage, Error.<void>>}
 */
routes.usersGetSpaceUsage = function (arg) {
  return this.request('users/get_space_usage', arg, 'user', 'api', 'rpc');
};

module.exports = routes;

},{}],10:[function(require,module,exports) {
var DropboxBase = require('./dropbox-base');
var routes = require('./routes');
var Dropbox;

/**
 * @class Dropbox
 * @extends DropboxBase
 * @classdesc The Dropbox SDK class that provides methods to read, write and
 * create files or folders in a user's Dropbox.
 * @arg {Object} options
 * @arg {String} [options.accessToken] - An access token for making authenticated
 * requests.
 * @arg {String} [options.clientId] - The client id for your app. Used to create
 * authentication URL.
 * @arg {String} [options.selectUser] - Select user is only used by DropboxTeam.
 * It specifies which user the team access token should be acting as.
 */
Dropbox = function (options) {
  DropboxBase.call(this, options);
};

Dropbox.prototype = Object.create(DropboxBase.prototype);

Dropbox.prototype.constructor = Dropbox;

// Add the user endpoint methods to the prototype
Dropbox.prototype = Object.assign(Dropbox.prototype, routes);

Dropbox.prototype.filesGetSharedLinkFile = function (arg) {
  return this.request('sharing/get_shared_link_file', arg, 'api', 'download');
};

module.exports = Dropbox;

},{"./dropbox-base":11,"./routes":12}],9:[function(require,module,exports) {
var Dropbox = require('./dropbox');

module.exports = Dropbox;

},{"./dropbox":10}],4:[function(require,module,exports) {
/**
 *        simple state management http://vuetips.com/simple-state-management-vue-stash
 * 
 */


// for each product do display in DOM, use Component or template



'use strict'

//const Dexie = require('./vendor/Dexie.2.0.1.js'),
//      Vue = require('./vendor/Vue.2.5.13.js')

//import {addLocationToDB2} from './copy.js';

//const token = 'qAZQ0ocdGioAAAAAAAACs8r7cWwxjlWLJx6b-qwlQOGEURMf-srx2X1wS_RnHari'

var Dropbox = require('dropbox');
//let dbx //= new Dropbox({ accessToken: token });


/*dbx.filesListFolder({path: ''})
  .then(function(response) {
     console.log('DBDBDBDBDBD')
     console.log(response);
     //getfileThumb(response.entries[0])
     response.entries.forEach(entry=>{
          getPicURL(entry)
          .then(url=>{
               let img = new Image()
               img.onload = function(){
                    this.width=144
                    this.height=256
               }
                    
               img.src = url
               let body = document.querySelector('body')
               body.appendChild(img)
          })
     })
     //  convert url to file?  https://stackoverflow.com/questions/28042535/converting-image-object-to-file-object-javascript
  })
  .catch(function(error) {
    console.log(error);
  });
*/
const getfileThumb = function(fileEntry){
          
          const id = fileEntry.id

          //let obj = { "path": id , format: "jpeg", size: "w128h128" }
          let obj = {"path": fileEntry.path_display }
          obj = JSON.stringify( obj) 
          console.log(obj)

          const xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function(){
               if (this.readyState == 4 && this.status == 200) {

                    console.log('SUKCES', this.response, this.responseText)
                    
                    let img = document.querySelector('#preview')
                    img.src = this.responseText
                    //const URL = window.URL || window.webkitURL
                    //img.src = URL.createObjectURL(this.response) 

               } else

               console.log('header', this.getAllResponseHeaders())
          }
          //xhr.open('POST','https://content.dropboxapi.com/2/files/get_thumbnail',true)
          xhr.open('POST','https://api.dropboxapi.com/2/files/get_temporary_link', true)
          xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
          xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With");
          //xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');

          xhr.setRequestHeader("Authorization", "Bearer qAZQ0ocdGioAAAAAAAACt4axxwChUOZ5U2XLXB1hvSzxXai4btwbq7O3LjzMst5c")
          //xhr.setRequestHeader("Dropbox-API-Arg", obj)
          //xhr.responseType = 'blob';
          //xhr.send()
          xhr.setRequestHeader('Content_Type','application/json')
          
          xhr.send(obj)
}


/*let getDropToken = function(){
     const xhr = new XMLHttpRequest()
     xhr.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) {

                         console.log('SUKCES', this.response, this.responseText)
                         
                         

                    } else console.log('header',this.status, this.getAllResponseHeaders())
     }
          //let url = 'https://www.dropbox.com/oauth2/authorize?' + 'response_type=token&' + 'client_id=hqdb69ima3zv29t&' + 'redirect_uri=http://localhost:1234/'
     let url = 'https://api.dropboxapi.com/oauth2/token'
     xhr.open('POST',url, true)
     //xhr.send(   )

}*/

const checkDrBxToken = function(){

     if (window.location.hash){
          // #access_token=qAZQ0ocdGioAAAAAAAACvzPeVzvTqmMsfEDCwQap8UvEMVAu8F0Zqatd1IypdhAt
          // &token_type=bearer  // &uid=300342838  // &account_id=dbid%3AAAC5NUHLEil2GAOA3Si3wQmQ2pBC6qKCsEo

          let str = window.location.hash.substr(1)
          let arr = decodeURI(str).split('&')
          //console.log(str,'arr',arr)
          const accessToken = arr[0].replace('access_token=','')

          window.dbx = new Dropbox({accessToken})

          dbx.filesListFolder({path: ''})
          .then(function(response) {
               console.log('DBDBDBDBDBD')
               console.log(response);

          })
          //window.DropToken
     } else console.log('####   no DropBox token   ####')
}


const initalCountryData = [{
     name: 'all countries' , 
     cities: [
               {
                name: 'all cities', 
                shops:[{
                         name: 'all shops',
                         products: [{"name":"časopis"},{"name":"denní tisk"},{"name":"česká igelitka"}]
                }]
               }
     ]
}]



window.otherUsers = []


window.deviceUserData = new Dexie('deviceUserData')

window.deviceUserData.version(1).stores({  userData: 'userName, countries'  })
window.deviceUserData.open()
     .then(data=>{
               //console.log('open own DB, data:', data)
     })
     .catch(function(error) {
               console.error('Uh oh : ' + error);
     });


const users_followed = new Dexie('users_followed')
      users_followed.version(1).stores({ userData: 'email, userName, countries'})
      users_followed.open()
      .catch(error => {
               console.error('Uh oh : error opening Users_followed db' + error);
      });
     
     //const user1data = require('./testUserData1.json'), user2data = require('./testUserData2.json')
     //users_followed.userData.put(user1data)
     //users_followed.userData.put(user2data)


const picturesDB = new Dexie('product_img')
      picturesDB.version(1).stores({item: 'fileName, userName, data'})  // filename contains email
      picturesDB.open()
      .catch(er=>console.error('couldnt open DB',er))
      
const serverURL = 'https://shopp.glitch.me/'



const app = new Vue({
     el: '#app',
     data: {
          screen:'main',
          showSignUp: false,
          showLogin: false,
          seeSignUp: false,
          loginemail: null,
          loginpass: null,

          searchText: null,
          searchResults: null,
          followedUsers: [],

          showSettings: false,
          userName: undefined,
          console: undefined,
          locationInputShown: false,
          locationSet: null,
          newLocation: null,

          currentCountry: null,
          currentCity:  null,
          currentShop:  null,
          countries: [],
          cities: [],
          shops: [],
          currentDisplayedProducts: [],

          newProductForm: false,
          newProductPreview: false,
          newProductPreviewLastModified: null,
          newProductType: null,
          newProductName: null,
          newProductDescription: null,
          newProductDescriptionLong: null,
          newProductPrice: null,

          modifyingProduct: false
     },
     methods:{
          switchScreen:function(screen){
               this.screen = screen

               if (screen =='main'){
                    this.locationInputShown = false
                    this.locationSet = null
                    this.newLocation = null
               }
          },
          showUserSettings:function(show){
               this.showSettings = show;
               if (show) this.screen = 'settings'
               else this.screen = 'main'
          },
          login:function(){
               let email = this.loginemail,
                   password = this.loginpass

               console.log('longin', email, password)

               const tosend = {email, password}, self = this,

               xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function() {

                    if (this.readyState == 4 && this.status == 200) {      console.log('received',typeof this.responseText, this.responseText)

                         let LSitems = ['deviceUserEmail', 'deviceUser', 
                                        'followedUsers', 'countries',
                                        'cities', 'shops']
                         LSitems.forEach(item=> window.localStorage.removeItem(item) )

                         let loginResponse
                              
                         if (typeof this.responseText==='string') loginResponse = JSON.parse(this.responseText)

                         window.localStorage.setItem('deviceUserEmail', email)
                         updateDeviceUser(loginResponse.userName)
                              
                         if (loginResponse.followedUsers) // this doesnt store their country data
                                   loginResponse.followedUsers.forEach(user=>addUserToDeviceLS(user))

                         self.userName = loginResponse.userName

                         self.informUser(`You hip'n'roll! Now logged iN`) // rock'n'hop
                         self.screen = 'main'
                         
                         return self.startApp() //self.reloadView()

                    } else if (this.readyState == 4 && this.status == 400){

                         self.informUser(`something went wrong, try again later`)
                    }
               }
               xhr.open("POST", serverURL + "API/login", true)
               xhr.send(JSON.stringify( tosend))

          },
          signUp: function($event){
               $event.preventDefault()
               let self = this
                    let email = document.querySelector('input[name="reg-useremail"').value
                    let userName = document.querySelector('input[name="reg-username"').value
                    let password  = document.querySelector('input[name="reg-userpassword"').value

               if (userName==0) return alert(`sorry, '${userName}' can't be accepted as username`) // 0 is reserved for unregistered user in IDB

               const tosend = {email, userName, password}
               

               if (!email || !userName || ! password) return console.error('email or name or pass missing')

               let xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function() {
                    
                    if (this.readyState == 4 && this.status == 200) {  //this.responseText;
                              //console.log(this.responseText,this.status)

                              self.informUser(`You rock'n'b! Account created, check your email, spam etc`)
                              window.localStorage.setItem('deviceUserEmail', email)

                              updateDeviceUser(userName)
                              
                              self.userName = getDeviceUser()
                              //.then(name=>self.userName = name)
                              self.screen = 'main'

                              return self.startApp()  // self.reloadView()

                    } else if (this.readyState == 4 && this.status ==400)

                              self.informUser(`Email address '${email}' is already used..`)
                    else {}

                  };

               xhr.open("POST", serverURL + "API/signup", true)
               //xhr.setRequestHeader('Access-Control-Allow-Origin', true)  //Access-Control-Allow-Origin
               xhr.send(JSON.stringify( tosend))
          },
          logout: function($ev){
               console.log('>> logouted <<')
               
               let items = ['deviceUserEmail', 'deviceUser', 
               'followedUsers', 'countries',
               'cities', 'shops']

               items.forEach(item=>{
                    console.log('item to remove', item)
                    return window.localStorage.removeItem(item) })
               
               //this.userName = undefined
               console.log('now will reload app')
               return this.startApp() // this.reloadView()//
          },
          requestDropbox:function(){
               console.log('dropbox requested')
               
               const xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) {

                         console.log('SUKCES', this.response, this.responseText)
                         
                         

                    } else console.log('header',this.status, this.getAllResponseHeaders())
               }
               let url = 'https://www.dropbox.com/oauth2/authorize?' + 
                         'response_type=token&' +
                         'client_id=hqdb69ima3zv29t&' +
                         'redirect_uri=http://localhost:1234/'
               //xhr.open('GET',url, true)
               //xhr.send()
               //const w = window.open(url)
               window.location.href = url

          },
          requestUsers:function(){
               let string = this.searchText
               const self = this
               console.log('search for:', string)

               const xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) { 

                         console.log('recevide', this.responseText, typeof this.responseText)
                         const users = JSON.parse(this.responseText)
                         console.log(users)
                         self.searchResults = users
                    }
               }
               xhr.open('GET', serverURL + 'API/search?string=' + string + "&useremail=" + window.localStorage.getItem('deviceUserEmail'), true)
               xhr.send( string)

          },
          informUser: function(msg){
               this.console = msg

               setTimeout(()=>{
                    this.console = undefined
               },5000)
          },
          followUser:function(email,userName){
               console.log('follow', email,userName)
               const self = this

               const xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function(){

                    if (this.readyState == 4 && this.status == 200) { 
                         console.log('follow sekces')
                         
                         addUserToDeviceLS({userName, email})    // store new followdee in local storage

                         fetchCountriesOfUser({userName, email})
                         .then(setOtherUserIDBData)              // hard-replaces whole document with new data
                         .then(self.reloadView)                    // here it copies data(countries etc) to device users

                    } else if (this.readyState == 4 && this.status == 400) { 
                         console.error('TRY AGAIN LATER')
                         this.informUser('TRY AGAIN LATER')
                         // finish this part
                    }
               }
               xhr.open('POST', serverURL + 'API/followuser', true)
               xhr.send(JSON.stringify({  email, 
                                          userName,
                                          addTo: window.localStorage.getItem('deviceUserEmail')
                                       })
               )

          },
          isFollowed:function(email){
                    let users = JSON.parse(  window.localStorage.getItem('followedUsers')  )
                    //console.log('search for',email, 'LS followed users', users)

                    if (!users || users.some(user=>user.email== email)===false) return false
                    else return true
          },
          unfollowUser:function(email){

               // delete local storage country data of that user only if he isnt followed by any other deviceUser in IDB
          },
          openLocationInput: function(set,ev){
               this.locationInputShown = true
               //console.log('event', set, ev)
               this.locationSet = `${set}`

               if (this.locationSet=='city' && this.currentCountry == 'all countries') {
                    alert('choose country first')
                    return this.locationInputShown = false
               }
          },
          addNewLocation: function(){
               console.log(`new ${this.locationSet} is ${this.newLocation}`)
               if (!this.newLocation) return alert('no name?');

               const addLocation = addNewLocationToDB.bind(this)
               return addLocation(this.locationSet, this.newLocation.toString() )
               //return addNewLocationToDB(this.locationSet, this.newLocation)
          },
          updateLocationSelect:function(index, event,requestedShopName){
               //console.log('slct', event.srcElement.selectedIndex)
               //console.log('event','>',requestedShopName,'<')//'\n', event.srcElement.getAttribute('data-saveas')  )

               if (event && event.srcElement.selectedIndex<0) return;      // protection against DOM load events ?

               const self = this
               const selects = ['countries', 'cities', 'shops','products'],
                     currents= ['currentCountry','currentCity','currentShop']
               let name
               if (event) {
                    name = event.srcElement.selectedOptions[0].text
                    setLastSelection(event.srcElement.getAttribute('data-saveas'), name)

               } else name = requestedShopName
               
               //return console.log('name', name, 'event', event)
               
               getSubsetItems(this,index,name)
                    .then(userOwnProducts =>{
                         // save last locations to local storage rather here?
                         console.log('----- user own products:', userOwnProducts.length, userOwnProducts)

                         userOwnProducts = userOwnProducts.map(prod=>{prod.owner = this.userName || 0; return prod})
                         // get products from each user in IDB: for current city, shop etc
                         getOtherUsersIDBData(this.followedUsers)
                         .then(users=>{
                              console.log('users to add products from', users)

                              let finals = []
                              if (userOwnProducts.length>0) 
                                   finals = [...userOwnProducts]

                              console.log('finals1', finals.length)


                              if (users){
                                   let otherProds = users.map(user=>{

                                        const countryI = user.countries.findIndex(cntry => cntry.name === self.currentCountry)

                                        if (countryI > -1){
                                             
                                             const cityI = user.countries[countryI].cities.findIndex(city=>city.name === self.currentCity )
                                             //console.log('cityI', cityI)
                                             const shop = user.countries[countryI].cities[cityI].shops.find(shop=>shop.name===self.currentShop)
                                             //console.log('shop', shop)
                                             if (shop && shop.products) return shop.products
                                        }
                                   }).filter(prods=>prods!==undefined)

                                   if (otherProds.length>0) finals = finals.concat(...otherProds)
                              }
                              
                              return new Promise((resolve, reject)=>{
                                   // display products on screen
                                   resolve (this.currentDisplayedProducts = finals ) //[...finals]

                                   // check out vue cheatsheet (v-bind) to see how to attach classes
                              })
                               
                         })
                         .then(finals=>{
                              console.log('finals2', finals.length)

                              let prodsWImages = finals
                                                  .filter(prod=>!!prod.imgName)
                                                  .map(prod=>prod.imgName)

                              /*let imgNames = document.querySelectorAll('div.product p.prodImgData')
                                   let onlyNames = nodeListToArray(imgNames)*/
                                   //console.log(imgNames, 'onlyNames', onlyNames)


                              //
                              return getImagesData(prodsWImages)
                              
                         })
                         // give images their data
                         .then(urls=>{
                              let els = document.querySelectorAll('div.product img'),
                              images = nodeListToArray(els)

                              /** from docs
                               * <!-- bind an attribute -->
                                 <img v-bind:src="imageSrc">
                               */
                              
                              //console.log('??urls??', urls)
                              images.map((image,i)=>image.src = urls[i])
                         })
                    })
               function getSubsetItems(self, outerIndex, name){
                    
                    if (outerIndex>4) return console.error('outerIndex>4  !!!',outerIndex) // this doesnt seem to ever happen

                    //console.log('getting items of', name)
                    //console.log('continue -- outerIndex, name',outerIndex, name)
                    return new Promise((resolve, rej)=>{
                         // 0 1 2
                         const currentX = currents[outerIndex]  // 'currentCountry' 'currentCity' 'currentShop'
                         const index = outerIndex,
                               superSet = selects[index-1], // 'countries' 'cities' 'shops'
                               set      = selects[index],   // 'countries' 'cities' 'shops'
                               subSet   = selects[index+1]  // 'countries' 'cities' 'shops'
                               
                         //console.log('self[currentX]', currentX, self[currentX])
                         //console.log('set', set)

                         //const name = event.srcElement.selectedOptions[0].text
                         if (set == 'products'){
                              //console.log('products', subSet, a.name, a[subSet], a.products)
                              //console.log('PRODUCTS!!!  ', a.products)
                              //resolve( getSubsetItems(self, outerIndex + 1, 'products') )
                              return alert('oops')
                         }

                         let a = self[set].find(el=> el.name===name )
                         
                         

                         self[currentX] = name
                         console.log('current',currentX, name)
                         //console.log('    save ?', set, name)
                         setLastSelection(set, name)

                         self[subSet] = a[subSet]
                         //console.log('subSet', subSet)
                         
                         //console.log('---',currents[outerIndex+1])
                         if (currents[outerIndex+1]=== undefined) {
                              //console.log('products?', a.name, a[subSet])
                              resolve(a[subSet]) 
                              //return
                         }
                         else {
                              let string = currents[outerIndex+1].toString()
                              self[string]= a[subSet][0].name    // 'currentCountry' 'currentCity' 'currentShop'
                              
                              //console.log('[subSet]', self[subSet][0])  // name of default item to set
                              
                              resolve(
                                   getSubsetItems(self, outerIndex + 1, a[subSet][0].name)          
                              )
                         }
                    })
               }
          },
          openNewProductForm:function(open){
               this.newProductForm = open
          },
          newProductSubmit: function($event){
               $event.preventDefault()
               
               if (!this.newProductPreview) return this.informUser(`picture of product is required`)
               //const form = document.querySelector('form[name="newProductForm"')
               const rating = document.querySelector('input[name="newRating"]:checked').value

               const fileName =`${window.localStorage.getItem('deviceUserEmail')
                               }_D${getFormattedDate(this.newProductPreviewLastModified)}`.toString()

               console.log('submit', fileName)
               console.log(this.newProductType, this.newProductName, this.newProductDescription, this.newProductPrice, rating)
               const fieldnames=['descr','descrLong','price'],
                     otherFields = [this.newProductDescription, this.newProductDescriptionLong, this.newProductPrice]

               const productToAdd = {
                    imgName: fileName,
                    type: this.newProductType,
                    name: this.newProductName,
                    rating
               }
               let voluntaryFields = otherFields.map(field=>{ 
                                             if (!!field && field.toString().trim()!=='') return field
                                             else return null 
               })
               
               voluntaryFields.forEach((field,i)=>{
                                   if (field) productToAdd[fieldnames[i]] = field.toString().trim()
               })
               console.log('product to add\n', productToAdd)

               // save image
               saveImageToIDB(fileName)
               .then(x=>{
                    console.log('result 2', x)
                    if (x) return x
               })
               .then(y=>{
                    addProduct('product', productToAdd)
                    this.newProductForm = false
                    this.newProductPreview = false

               }).catch(er=>alert('huge arror storing new product'))
               
               const addProduct = addNewLocationToDB.bind(this)

               
          },
          imageAdded:function(ev){

                    const reader = new FileReader(),
                         self = this,
                         file = ev.target.files[0]
                    
                    this.newProductPreviewLastModified = file.lastModified  // when storing pic to IDB, its part of filename
                    console.log(file)

                    reader.onload = function(fileObj){
                         let img = new Image()

                         //let data = fileObj.target.result
                         
                         img.onload = function(y){

                              if (this.width>this.height) return alert(`take image with vertical orientation please`)

                              let fract = 10
                              let wid = 300     //parseInt(  this.width/fract),
                                  //,hei = 300  //parseInt(  this.height/fract)
                              

                              const canvas = document.querySelector('canvas'),
                                   ctx = canvas.getContext('2d'),
                                   start = Math.floor( (this.height-this.width)/2 )
                              canvas.width = wid
                              canvas.height = wid


                                             //  sX  sY     sW          sH                       
                              ctx.drawImage(this,0,  start, this.width, this.width,  0,0, wid, wid)

                              console.log(' canvas len', canvas.toDataURL().length/1024)
                              console.log('preview len',img.src.toString().length/1024)

                              self.newProductPreview = true

                              window.canvasData = canvas.toDataURL() // canvas data for new image to save to IDB

                              //let w = window.open()
                              //w.document.write(`<img src="${canvas.toDataURL()}" >`)
                         }
                         img.src = fileObj.target.result
                         
                    }
                    
                    reader.readAsDataURL(ev.target.files[0])
                    //this.newProductForm = false
          },
          openProductForm:function(prod){
               console.log('modify',prod)
               if (!prod.owner) return alert(`You can only modify your own products`)

               // let currCountry = this.currentCountry, etc...
               //   get curr Country, City & Shop so if user would change them w form open,
               //   take it as indication he wants to place product 
               //   to new current country city shop

               this.modifyingProduct = true // to show correct submit button

               if (prod.type) this.newProductType = prod.type
               if (prod.name) this.newProductName = prod.name
               if (prod.descr) this.newProductDescription = prod.descr
               if (prod.descrLong) this.newProductDescriptionLong =prod.descrLong
               if (prod.price) this.newProductPrice = parseFloat( prod.price )
               
               if (prod.rating) document.querySelectorAll(`input[type="radio"][value="${prod.rating}"]`)[0].setAttribute('checked', true)
               

               if (prod.imgName) 
               
               getImagesData([prod.imgName])
               .then(data=>{
                    
                    const self = this,
                          img = new Image(),
                          canv = document.querySelector('canvas'),
                          ctx = canv.getContext('2d')

                    img.onload = function(){
                         ctx.drawImage(this,0,0,300,300)

                         self.newProductPreview = true
                    }
                    img.src = data


               })
               this.newProductForm =true

          },
          applyProductChanges:function(ev){
               ev.preventDefault()
               console.log('prod change')
          },
          deleteProduct:function(ev){
               ev.preventDefault()
               console.log('delete')
          },
          reloadView:function(){
                    console.log('RELOADING VIEW')

                    let ownCountries,
                        somethingChanged = false

                    getOwnDBData(this.userName)
                    .then( ownData =>{

                         if (!this.userName || !this.followedUsers) return initializeLocationSelects(this, ownData)

                         ownCountries = ownData

                         return getOtherUsersIDBData(this.followedUsers)
                    })
                    .then(othersData=>{

                         let own = [...ownCountries],
                             Users = othersData.map(user=>user.countries)

                         return copyUserData(Users, own)

                         function copyUserData(users, owndata){
                              //console.log('EQUAL', ownCountries == owndata)
                              
                              return new Promise((resolve, reject)=>{
                                   const sets = ['countries','cities','shops','products']
                                   let index = 0
                                   users.forEach(other_countries => {

                                             // remove products from each country
                                             const others_cleaned = other_countries.map( country => removeProducts(country,0))     

                                             copyEntries(index, owndata, others_cleaned)

                                             .then(newCountries=> resolve(newCountries) )  
                                   })

                                   function removeProducts(entry,index){
                                        //if (index>3) return;

                                        if (entry.hasOwnProperty('products')){
                                             //console.log('in SHOP', entry.name)
                                             return {name: entry.name, products: []} //entry.products = []

                                        } else if (entry.name){
                                             //console.log('|||| not shop', index, entry.name, sets[index])
                                             let name = entry.name
                                             let prop = sets[index+1]  // cities shops
                                             let y 
                                             entry[prop] = entry[prop].map(entry => {
                                                            //console.log('-- going into',entry.name, sets[index+1])
                                                            return removeProducts(entry, index+1)
                                                       })
                                             //console.log('filtered ',prop,'of',entry.name, entry[prop])
                                             return entry
                                        } 
                                   }
                                   function copyEntries(outerIndex, ownEntries, otherEntries){
                                        
                                        function emptyspace(ind){
                                                  let spaces = "", len = ind*5
                                                  for (let i=0; i<len; i++){
                                                       spaces = spaces.concat(" ")
                                                  }
                                                  return spaces
                                        }
                                        let index = outerIndex +1
                                        let set = sets[outerIndex], subset = sets[index]
                                        //console.log(emptyspace(outerIndex),'index', index, set, subset)
                                        // if its shops now

                                        return new Promise((resolve,rej)=>{
                                             otherEntries.forEach(other_entry=>{
                                                  
                                                  //console.log( emptyspace(outerIndex),`checking others '${other_entry.name}'`)

                                                  if (ownEntries.some(ownEntry=> ownEntry.name == other_entry.name)=== false ) {
                                                       // not on device -> add it there
                                                       //console.log(emptyspace(outerIndex),set, 'NOT THERE -> ADDING ',other_entry.name )
                                                       //console.log(emptyspace(outerIndex),'- doing -', other_entry.name) 
                                                       //let locations = removeProducts( other_entry, index)
                                                       //console.log('without products',set, locations, subset)
                                                       //other_entry[subset] = location
                                                       ownEntries.push(other_entry)
                                                       somethingChanged = true
                                                       //console.log(other_entry.name,'updated?',other_entry)
                                                       //console.log( other_entry.name, 'updated?',locations )

                                                  // if this entry is already there
                                                  } else{
                                                       ownEntries.forEach( own_entry=>{
                                                            //console.log(emptyspace(outerIndex),'checking >>>',subset, 'of',own_entry.name, own_entry)
                                                            //console.log(emptyspace(outerIndex),set, 'is there checking >>>',own_entry.name, own_entry)
                                                            // take others subentries and add them to Own
                                                            if (own_entry.name === other_entry.name){
                                                                 //console.log(emptyspace(outerIndex),`duplicates ${own_entry.name} = ${other_entry.name}`)
                                                                 //console.log(emptyspace(outerIndex),index, 'subset',subset,'<<')
                                                                 if (index<3)//subset!==undefined) // if subset is undefined, can it even reach this deep? i.e. - if the condition neccessary
                                                                 copyEntries(index, own_entry[subset], other_entry[subset] )

                                                                 else if (subset===undefined) {
                                                                      
                                                                      //console.log(emptyspace(outerIndex),'??',own_entry)
                                                                      //let smt = removeProducts(own_entry,index)
                                                                      //console.log(emptyspace(outerIndex),'done ------- with', set)
                                                                 }
                                                            } //it gets added above
                                                       })
                                                  }
                                             })
                                             resolve(ownEntries)
                                        })
                                   }
                              })
                         }
                    })
                    .then(final=>{
                         console.log('somethingChanged? ',somethingChanged)
                         //if (somethingChanged) 
                         console.log('location data to save', final) //  , final===own

                         // save each country without prods to device user IDB
                         if (somethingChanged) {
                              updateDeviceUserCountries(this.userName, final)   // store everything to deviceUser IDB
                              .then(initializeLocationSelects(this, final))      // update screen w new data available

                         } else return initializeLocationSelects(this, final)
                    })
          },
          startApp:function(){
               //this.screen = 'main'

               this.userName = getDeviceUser()
               //if (this.userName===null) this.userName = 'null'  // because of IDB so user can be found, it doesnt store null as value
               //console.log('userName', this.userName)
               
               if (this.userName) this.followedUsers = getLSfollowedUsers()
               else this.followedUsers = null
               console.log('followedUsers', this.followedUsers)
               
               let ownCountries
               let somethingChanged = false

               getOwnDBData(this.userName)

               // try to get other's MDB data to update IDB
               .then( ownData =>{  

                    if (!this.userName || !this.followedUsers) return initializeLocationSelects(this, ownData)

                    ownCountries = ownData

                    
                    if (navigator.onLine){
                         const fetchedData = this.followedUsers.map(fetchCountriesOfUser) // get new data for each user
                         //console.log('nav online - fetched', fetchedData)

                         Promise.all(fetchedData)
                         .then(userData=>{   // store new user data
                              console.log('nav online - fetched', fetchedData)
                              const saved = userData.map(user=>setOtherUserIDBData(user))
                              
                              return Promise.all(saved)
                         })
                         
                         .then(saved=>{      // reload view where new locations get copied to users countries

                              console.log('saved? other users data', saved)
                              //return 
                              this.reloadView()//getOtherUsersIDBData(this.followedUsers)

                         })
                         .catch(er=>console.error('error in online branch',er))
                         

                         
                    } else {

                         console.log('|||  not online')
                    
                         return getOtherUsersIDBData(this.followedUsers)  
                    }
               }).then(users=>{
                         
                    if (users){
                         console.log('my own', ownCountries)
                         
                         /*if (!users){   // this cant happen now
                              console.log('NO FOLLOWED USERS')
                              return initializeLocationSelects(this, ownCountries)
                         }*/

                         let 
                             own = [...ownCountries],
                             Users = users.map(user=>user.countries)


                         // copies all others' locations to save them in IDB of device
                         copyUserData(Users, own)
                         .then(final=>{
                                   console.log('somethingChanged? ',somethingChanged)
                                   if (somethingChanged) console.log('location data to save', final===own, final)

                                   // save each country without prods to device user IDB
                                   if (somethingChanged) {
                                        updateDeviceUserCountries(this.userName, final)   // store everything to deviceUser IDB
                                        .then(initializeLocationSelects(this, final))      // update screen w new data available

                                   } else return initializeLocationSelects(this, final)
                                   //final.forEach( country => deviceUserData.countries.put(country) )
                         })


                         function copyUserData(users, owndata){
                              //console.log('EQUAL', ownCountries == owndata)
                              
                              return new Promise((resolve, reject)=>{
                                   const sets = ['countries','cities','shops','products']
                                   let index = 0
                                   users.forEach(other_countries => {

                                             // remove products from each country
                                             const others_cleaned = other_countries.map( country => removeProducts(country,0))     

                                             copyEntries(index, owndata, others_cleaned)

                                             .then(newCountries=> resolve(newCountries) )  
                                   })

                                   function removeProducts(entry,index){
                                        //if (index>3) return;

                                        if (entry.hasOwnProperty('products')){
                                             //console.log('in SHOP', entry.name)
                                             return {name: entry.name, products: []} //entry.products = []

                                        } else if (entry.name){
                                             //console.log('|||| not shop', index, entry.name, sets[index])
                                             let name = entry.name
                                             let prop = sets[index+1]  // cities shops
                                             let y 
                                             entry[prop] = entry[prop].map(entry => {
                                                            //console.log('-- going into',entry.name, sets[index+1])
                                                            return removeProducts(entry, index+1)
                                                           })
                                             //console.log('filtered ',prop,'of',entry.name, entry[prop])
                                             return entry
                                        } 
                                   }
                                   function copyEntries(outerIndex, ownEntries, otherEntries){
                                        
                                        function emptyspace(ind){
                                                  let spaces = "", len = ind*5
                                                  for (let i=0; i<len; i++){
                                                       spaces = spaces.concat(" ")
                                                  }
                                                  return spaces
                                        }
                                        let index = outerIndex +1
                                        let set = sets[outerIndex], subset = sets[index]
                                        //console.log(emptyspace(outerIndex),'index', index, set, subset)
                                        // if its shops now

                                        return new Promise((resolve,rej)=>{
                                             otherEntries.forEach(other_entry=>{
                                                  
                                                  //console.log( emptyspace(outerIndex),`checking others '${other_entry.name}'`)

                                                  if (ownEntries.some(ownEntry=> ownEntry.name == other_entry.name)=== false ) {
                                                       // not on device -> add it there
                                                       //console.log(emptyspace(outerIndex),set, 'NOT THERE -> ADDING ',other_entry.name )
                                                        //console.log(emptyspace(outerIndex),'- doing -', other_entry.name) 
                                                        //let locations = removeProducts( other_entry, index)
                                                        //console.log('without products',set, locations, subset)
                                                        //other_entry[subset] = location
                                                       ownEntries.push(other_entry)
                                                       somethingChanged = true
                                                        //console.log(other_entry.name,'updated?',other_entry)
                                                        //console.log( other_entry.name, 'updated?',locations )

                                                  // if this entry is already there
                                                  } else{
                                                       ownEntries.forEach( own_entry=>{
                                                            //console.log(emptyspace(outerIndex),'checking >>>',subset, 'of',own_entry.name, own_entry)
                                                            //console.log(emptyspace(outerIndex),set, 'is there checking >>>',own_entry.name, own_entry)
                                                            // take others subentries and add them to Own
                                                            if (own_entry.name === other_entry.name){
                                                                 //console.log(emptyspace(outerIndex),`duplicates ${own_entry.name} = ${other_entry.name}`)
                                                                 //console.log(emptyspace(outerIndex),index, 'subset',subset,'<<')
                                                                 if (index<3)//subset!==undefined) // if subset is undefined, can it even reach this deep? i.e. - if the condition neccessary
                                                                 copyEntries(index, own_entry[subset], other_entry[subset] )

                                                                 else if (subset===undefined) {
                                                                      
                                                                      //console.log(emptyspace(outerIndex),'??',own_entry)
                                                                      //let smt = removeProducts(own_entry,index)
                                                                      //console.log(emptyspace(outerIndex),'done ------- with', set)
                                                                 }
                                                            } //it gets added above
                                                       })
                                                  }
                                             })
                                             resolve(ownEntries)
                                        })
                                   }
                              })
                         }
                    }
               })
               //})
               .catch( er => {
                    
                    if (er===null){  //console.log('- - - will initialize Country data')
                         
                         storeInitialDBData(this.userName)
                         .then( data =>{
                              console.log('- - - stored?', data)
                              initializeLocationSelects(this, initalCountryData)
                              //this.startApp()
                         })

                    } else 
                         console.error('!!!!!  there was real error\n error getting init data',er)
               })
          
     
          }
     },
     mounted: function(){
          window.initializeLocationSelects = initializeLocationSelects.bind(this)  // its used on few occasions w different contexts
          
          checkDrBxToken()

          //window.addNewLocationToDB = addNewLocationToDB.bind(this)
          //console.log( window.addNewLocationToDB == addNewLocationToDB, addNewLocationToDB)

          this.startApp()
     },
     created:function(){
          //console.log('CREATED')
     }
})

function getImagesData(names){

     //console.log('getting img data', names)

     const promises = names.map(name=>
          new Promise((resolve, reject)=>
               
               picturesDB.item.get({fileName:name})

               .then(result=>{ resolve(result.data) })
               .catch(er=>{ resolve(null) })

          )
     )
     return Promise.all(promises)
}


function addNewLocationToDB(set, toAdd){
     console.log('add', set)
     //return console.log('this', this)
     //   under what country to add it
     //   should i update whole country document?
     
     let somethingChanged = '333' //false
     const copyData = new Function('users', 'owndata', copyUserData_text)
     const self = this
     
     let toSave

     if (set =='country'){
                    console.log(`this happens 1`)
                    let index = this.countries.findIndex(country=>country.name == toAdd)

                    if (index>-1) { return alert(`'${toAdd}' is already in your database`) }

                    const newCountry = 
                              [{   name: toAdd, 
                                   cities: [{
                                        name: 'all cities', 
                                        shops:[{
                                             name: 'all shops',
                                             products: []
                                        }]
                                   }]
                              }]
                    
                    toSave = [newCountry]
                    

     } else if (set =='city') { console.log(`this happens 1`)

               let countryData = this.countries.find(cntry=> cntry.name == this.currentCountry)
               
               // check if this city is already there
               let index = countryData.cities.findIndex(city=>city.name == toAdd)

               if (index>-1){ return alert(`'${toAdd}' is already in your database`) }
               

               countryData.cities.push({
                                   name: toAdd, 
                                   shops:[{
                                        name: 'all shops',
                                        products: []
                                   }]
               })
               console.log( '   adding city',"\n",countryData)
               console.log( '   original',"\n",this.countries)

               toSave = [[countryData]]

     } else if (set =='shop') {  console.log(`this happens 1`)

          let countryData = this.countries.find(cntry=> cntry.name ===this.currentCountry)
          
          let cityData = countryData.cities.find(city=> city.name === this.currentCity)
          console.log( '   adding shop ', toAdd, 'to', cityData.name)

          // check its not there already
          if (cityData.shops.findIndex(shop=>shop.name===toAdd) > -1)
                    return alert(`'${toAdd}' is already in your database`)
          

          cityData.shops.push(
                                   {
                                     name: toAdd,
                                     products: []
                                   }
                              )

          console.log('   new entry now', this.currentCountry, countryData)
          
          toSave = [[countryData]]
          
     } else if (set=='product'){
          let countryData = this.countries.find(cntry=> cntry.name=== this.currentCountry)
          let cityData = countryData.cities.find(city=> city.name === this.currentCity)
          let shopData = cityData.shops.find(shop=> shop.name=== this.currentShop)

          shopData.products.push(toAdd)
          console.log('shopData', shopData)
          console.log('countryData', countryData)
          toSave = [[countryData]]
     }
     

     copyData( toSave, [...this.countries] )

     .then(final=>{
               console.log('location data to save', final===this.countries, final)

               return updateDeviceUserCountries(this.userName, final)
                         
     }).then(result=>{
               console.log('result', result)
               return initializeLocationSelects(this, result)
     })
     .catch(er=>{alert('add Loc to DB er' + er)})


     return this.switchScreen('main')
}


function fetchCountriesOfUser(user){

     return new Promise((resolve, reject)=>{
          console.log(`geeting data of ${user.email}`)

          const xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function(){
               if (this.readyState == 4 && this.status == 200) {     // console.log(this.status,'received',typeof this.responseText)

                         const result = JSON.parse(this.responseText)
                         result.userName = user.userName

                         console.log('   got user data from server',result.email, result)
                         resolve(result)

               } else if (this.readyState == 4 && this.status!=200) reject()
          }
          xhr.open('POST',serverURL + 'API/getCountriesOfUser',true)
          xhr.send(user.email)
     })
}

function setOtherUserIDBData(allData){
     console.log('allData to IDB >', allData)
     return new Promise((resolve, reject)=>{

          users_followed.userData.put(allData)
          .then(result=>{
               //console.log(result)  // this returns primary key i.e. email
               resolve()
          }).catch(er=>{
               console.error(er)
               reject()
          })
     })
}


function setLastSelection(set, value){
     //console.log('>> saving', set, value)
     window.localStorage.setItem(set, value.toString() )
}
function getLastSelection(set){
     
     let val = window.localStorage.getItem(set)
     //console.log('requested', set, val)
     return val
}



function getLSfollowedUsers(){
     let users = window.localStorage.getItem('followedUsers')
     users = JSON.parse(users)
     return users
}
function addUserToDeviceLS(newUser){

     let users = window.localStorage.getItem('followedUsers')
     users = JSON.parse(users)

     if (users===null) users = [newUser]
     else if (users.some(user=>user.email==newUser.email)===false) users.push(newUser) // add new user only if he isnt there yet

     console.log('LS users now', users)

     return window.localStorage.setItem('followedUsers', JSON.stringify(users))
}


function updateDeviceUser(name = 0){
     //if ( window.localStorage.getItem('deviceUser') === null){
          name = name.toString().trim()

          const initialData = {
               userName: name, 
               createdDate: getFormattedDate(null)
          } 
          window.localStorage.setItem('deviceUser', JSON.stringify(initialData)) 
     //}
     console.log('created user', window.localStorage.getItem('deviceUser') )
}

function getDeviceUser(){

          let data = JSON.parse(window.localStorage.getItem('deviceUser'))
          if (data) return data.userName
          else return undefined
}

function getOwnDBData(user = 0){
     console.log(`getting data of ${user}`)

     return new Promise((resolve, reject)=>{

          //console.log('test1',deviceUserData.userData.userName)

          /*if (deviceUserData.userData===undefined) {
               console.log('!! 1st condition')
               return reject(null)
          }*/

          deviceUserData.userData.get({userName:user})//.toArray()   // https://dexie.org/docs/Table/Table.get()
          .then(data => {
               if (data==undefined) {
                    console.log('no data, probably initializing app?')
                    return reject(null)
               } 

               const res = data.countries
               
               if (Array.isArray(res)) resolve(res)

               else if (res.hasOwnProperty('name')){
                    console.log('got only initial data')
                    resolve([res])
               }
          })
          .catch(er => {
               console.log('||||||||||  er',er)
               reject(er) 
          })
     })
}

function storeInitialDBData(userName = 0){
     console.log(`storing data for ${userName}`)
     return new Promise((resolve, reject)=>{
          //console.log(window.deviceUserData.userData)
          
          deviceUserData.userData.put({userName, countries: initalCountryData})

          .then(all=>{
                    console.log('stored initial data:', all,"<<")
                    resolve(all)
          })                         
          .catch(er=>{
               console.error(er);
               reject(er)
          })
     })
}

function getOtherUsersIDBData(localUsers){
     //console.log('    localUsers', localUsers)

     return new Promise((resolve,rej)=>{
          if (!localUsers || localUsers.length==0) return resolve(null)

          users_followed.userData.toArray()
          .then(users =>{ 
               
               users = users.filter(user=> localUsers.find(lUser=>lUser.email==user.email)!==undefined )
               //console.log('|||     filtered users',users)

               if (users.length==0) resolve(null)     // when can this happen?
               else resolve(users)

          })
          .catch(er=>console.error('error opening following', er))
     })
}


function initializeLocationSelects(self, countries){
     console.log('initializing countries\n')

     self.countries = countries
     self.currentCountry = getLastSelection('countries') || 'all countries'
     //console.log(self.currentCountry, self.countries)
     //self.updateLocationSelect('countries','cities',undefined, self.currentCountry.toString() )

     // city
     let lastCntry = countries.find(cn=>cn.name=== self.currentCountry)
     self.cities = lastCntry.cities
     //console.log('self.cities',self.cities)

     
     self.currentCity = getLastSelection('cities') || 'all cities' 
     //console.log('currentCity', self.currentCity)
     let lastCity = self.cities.find(city => city.name ==  self.currentCity)

     // shop
     //let lastCity = self.cities.find(city => city.name === self.currentCity )
     self.shops = lastCity.shops
     self.currentShop =  getLastSelection('shops')  || 'all shops'
     //console.log(self.currentShop)

     let gz = self.updateLocationSelect(2, null,self.currentShop)

     console.log('promise?', gz)
     /*gz.then(x=>{  //it doesnt return promise
          console.log('after updated loaction', x)
     })*/
     //console.log('this happens last')
     // this is probably not needed anymore
     self.currentDisplayedProducts = self.shops.find(shop=>shop.name === self.currentShop).products
     //console.log('curr prods',self.currentDisplayedProducts)
}



function copyUserData(users, owndata){
     console.log('EQUAL', users, owndata)
     //console.log('copying', somethingChanged)//users, owndata)
     
     return new Promise((resolve, reject)=>{
          const sets = ['countries','cities','shops','products']
          let index = 0
          users.forEach(other_countries => {

                    // remove products from each country
                    const others_cleaned = other_countries.map( country => removeProducts(country,0))     

                    copyEntries(index, owndata, others_cleaned)

                    .then(newCountries=> resolve(newCountries) )  
          })

          function removeProducts(entry,index){
               //if (index>3) return;

               if (entry.hasOwnProperty('products')){
                    //console.log('in SHOP', entry.name)
                    return {name: entry.name, products: []} //entry.products = []

               } else if (entry.name){
                    //console.log('|||| not shop', index, entry.name, sets[index])
                    let name = entry.name
                    let prop = sets[index+1]  // cities shops
                    let y 
                    entry[prop] = entry[prop].map(entry => {
                                   //console.log('-- going into',entry.name, sets[index+1])
                                   return removeProducts(entry, index+1)
                                  })
                    //console.log('filtered ',prop,'of',entry.name, entry[prop])
                    return entry
               } 
          }
          function copyEntries(outerIndex, ownEntries, otherEntries){
               
               function emptyspace(ind){
                         let spaces = "", len = ind*5
                         for (let i=0; i<len; i++){
                              spaces = spaces.concat(" ")
                         }
                         return spaces
               }
               let index = outerIndex +1
               let set = sets[outerIndex], subset = sets[index]
               //console.log(emptyspace(outerIndex),'index', index, set, subset)
               // if its shops now

               return new Promise((resolve,rej)=>{
                    otherEntries.forEach(other_entry=>{
                         
                         //console.log( emptyspace(outerIndex),`checking others '${other_entry.name}'`)

                         if (ownEntries.some(ownEntry=> ownEntry.name == other_entry.name)=== false ) {
                              // not on device -> add it there
                              //console.log(emptyspace(outerIndex),set, 'NOT THERE -> ADDING ',other_entry.name )
                               //console.log(emptyspace(outerIndex),'- doing -', other_entry.name) 
                               //let locations = removeProducts( other_entry, index)
                               //console.log('without products',set, locations, subset)
                               //other_entry[subset] = location
                              ownEntries.push(other_entry)
                              somethingChanged = true
                               //console.log(other_entry.name,'updated?',other_entry)
                               //console.log( other_entry.name, 'updated?',locations )

                         // if this entry is already there
                         } else{
                              ownEntries.forEach( own_entry=>{
                                   //console.log(emptyspace(outerIndex),'checking >>>',subset, 'of',own_entry.name, own_entry)
                                   //console.log(emptyspace(outerIndex),set, 'is there checking >>>',own_entry.name, own_entry)
                                   // take others subentries and add them to Own
                                   if (own_entry.name === other_entry.name){
                                        //console.log(emptyspace(outerIndex),`duplicates ${own_entry.name} = ${other_entry.name}`)
                                        //console.log(emptyspace(outerIndex),index, 'subset',subset,'<<')
                                        if (index<3)//subset!==undefined) // if subset is undefined, can it even reach this deep? i.e. - if the condition neccessary
                                        copyEntries(index, own_entry[subset], other_entry[subset] )

                                        else if (subset===undefined) {
                                             
                                             //console.log(emptyspace(outerIndex),'??',own_entry)
                                             //let smt = removeProducts(own_entry,index)
                                             //console.log(emptyspace(outerIndex),'done ------- with', set)
                                        }
                                   } //it gets added above
                              })
                         }
                    })
                    resolve(ownEntries)
               })
          }
     })
}


function updateDeviceUserCountries(userName=0, countries){
     //console.log(`save to user: ${userName} ${countries}`)
     let obj = {userName, countries }
     //console.log(obj)
     return new Promise((resolve, reject)=>{

          deviceUserData.userData.put({ userName, countries })
          .then(result=>{
               console.log(result)
               resolve(countries)

          }).catch(er=>{})
     })
}
const copyUserData_text = `
     console.log('newdata, owndata', users, owndata)
     //console.log('copying', somethingChanged)//users, owndata)

     return new Promise((resolve, reject)=>{
          const sets = ['countries','cities','shops','products']
          let index = 0
          users.forEach(other_countries => {
                    console.log(other_countries)
                    // remove products from each country  
                    // not if its used to store new location
                    //const others_cleaned = other_countries//.map( country => removeProducts(country,0))     

                    copyEntries(index, owndata, other_countries)//others_cleaned)

                    .then(newCountries=> resolve(newCountries) )  
          })

          function removeProducts(entry,index){
               //if (index>3) return;

               if (entry.hasOwnProperty('products')){
                    //console.log('in SHOP', entry.name)
                    return {name: entry.name, products: []} //entry.products = []

               } else if (entry.name){
                    //console.log('|||| not shop', index, entry.name, sets[index])
                    let name = entry.name
                    let prop = sets[index+1]  // cities shops
                    let y 
                    entry[prop] = entry[prop].map(entry => {
                                   //console.log('-- going into',entry.name, sets[index+1])
                                   return removeProducts(entry, index+1)
                              })
                    //console.log('filtered ',prop,'of',entry.name, entry[prop])
                    return entry
               } 
          }
          function copyEntries(outerIndex, ownEntries, otherEntries){
               
               function emptyspace(ind){
                         let spaces = "", len = ind*5
                         for (let i=0; i<len; i++){
                              spaces = spaces.concat(" ")
                         }
                         return spaces
               }
               let index = outerIndex +1
               let set = sets[outerIndex], subset = sets[index]
               //console.log(emptyspace(outerIndex),'index', index, set, subset)
               // if its shops now

               return new Promise((resolve,rej)=>{
                    otherEntries.forEach(other_entry=>{
                         
                         if (ownEntries.some(ownEntry=> ownEntry.name == other_entry.name)=== false ) {
                              // not on device -> add it there
                              console.log(emptyspace(outerIndex),set, 'NOT THERE -> ADDING ',other_entry.name )
                              //console.log(emptyspace(outerIndex),'- doing -', other_entry.name) 
                              //let locations = removeProducts( other_entry, index)
                              //console.log('without products',set, locations, subset)
                              //other_entry[subset] = location
                              ownEntries.push(other_entry)
                              //console.log(somethingChanged)
                              //if (somethingChanged!=undefined) somethingChanged = true
                              //console.log(other_entry.name,'updated?',other_entry)
                              //console.log( other_entry.name, 'updated?',locations )

                         // if this entry is already there
                         } else{
                              ownEntries.forEach( own_entry=>{
                                   //console.log(emptyspace(outerIndex),'checking >>>',subset, 'of',own_entry.name, own_entry)
                                   //console.log(emptyspace(outerIndex),set, 'is there checking >>>',own_entry.name, own_entry)
                                   // take others subentries and add them to Own
                                   if (own_entry.name === other_entry.name){
                                        //console.log(emptyspace(outerIndex),index, 'subset',subset,'<<')
                                        if (index<3)//subset!==undefined) // if subset is undefined, can it even reach this deep? i.e. - if the condition neccessary
                                        copyEntries(index, own_entry[subset], other_entry[subset] )

                                        else if (subset===undefined) {
                                             
                                             //console.log(emptyspace(outerIndex),'??',own_entry)
                                             //let smt = removeProducts(own_entry,index)
                                             //console.log(emptyspace(outerIndex),'done ------- with', set)
                                        }
                                   } //it gets added above
                              })
                         }
                    })
                    resolve(ownEntries)
               })
          }
     })`
//

function getFormattedDate(date){
     //console.log('typeof Date',typeof date, date)
 
     if (typeof date == 'number') date = new Date(date)
     else if (!date) date = new Date()
 
     let year = date.getFullYear(),
         month = date.getMonth()+1,
         day = date.getDate(),
         hours = date.getHours(),
         minutes = date.getMinutes(),
         secs = date.getSeconds()

     const obj = {
          year, month, day, hours, minutes, secs
     }

     for (let num in obj){
          if (obj[num]<10) obj[num] =  String('0' + obj[num] ) 
     }

     return `${obj.year}-${obj.month}-${obj.day}_T${obj.hours}-${obj.minutes}-${obj.secs}`
}
function saveImageToIDB(fileName){
     console.log(getDeviceUser(), fileName)

     return new Promise((resolve, reject)=>{
          if (!fileName || !window.canvasData) reject(null)
          let user = getDeviceUser()
                  //{data: fileName, userName,                  data
          picturesDB.item.put({ 'fileName': fileName, 'userName': user, 'data': window.canvasData })
          .then(result=>{
               console.log('result',result)
               resolve(result)
          })
          .catch(er=>{console.error(er)})
     })
}

function nodeListToArray(list){
     let result = []
     for (let item of list) result.push(item)
     
     return result
}



const getPicURL = function(entry){

     return new Promise((resolve, reject)=>{

          let obj = {"path": entry.path_display }
          obj = JSON.stringify( entry) 
          const xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function(){

               if (this.readyState == 4 && this.status == 200) {

                         console.log('SUKCES', this.status)//this.response, this.responseText)
                         resolve(this.responseText)

               } else console.log(this.status)
          }
          xhr.open('POST', serverURL + '/API/getPicURL', true)
          xhr.send(obj)
     })
}







/*let somelet = 44
const funText = 'console.log("hi " + somelet)'
function fun(){

     let somelet = 33
     let f2 = new Function(funText) 
     let f3 = function(){
          let somelet = 33
          let f4 = new Function(funText) 
          return f4()
     }
     console.log(f3)
     //hi = function(){ console.log('oh ' + somelet)} 
     return f3()    //hi()
}*/
//fun()





/* templating attempt
//import App from './templ1.Vue'
//const tem1 = require('./templ1.Vue')
//console.log(tem1)

let templ1 = new Vue({
     el: '#templ1',
     data: {
          msg: 'hoho'
     }
     //render: h => h(App)
})

let productTemplate = Vue.component('product',{
     data:{
          pname: 'jezisek'
     },
     props:{
          pname: 'jezisek'
     },
     created:function(){
          this.pname = 'babuska'
     },
     mounted:function(){
          this.pname = 'babuska'
     },
     render:function(createElement){
          return createElement(
               'p',
               `omg product ${this.pname} `
               //this.$slots.default
          )
     }
})*/
},{"dropbox":9}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://localhost:52702/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,4])