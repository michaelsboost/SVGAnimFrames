(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Modernizr, async, blobURLSupport, buildDataURL, loadImage, now, ready, ref, ref1, ref2, setupDemo;

require('browsernizr/test/css/rgba');

require('browsernizr/test/css/transforms3d');

Modernizr = require('browsernizr');

require('./vendor/mootools.js');

async = require('async');

ready = require('./vendor/ready.js');

now = ((ref = window.performance) != null ? (ref1 = ref.now) != null ? ref1.bind(window.performance) : void 0 : void 0) || Date.now;

blobURLSupport = ((ref2 = window.URL) != null ? ref2.createObjectURL : void 0) != null;

buildDataURL = (function() {
  var charMap, i, j;
  charMap = {};
  for (i = j = 0; j < 256; i = ++j) {
    charMap[i] = String.fromCharCode(i);
  }
  return function(data) {
    var k, ref3, str;
    str = '';
    for (i = k = 0, ref3 = data.length; 0 <= ref3 ? k < ref3 : k > ref3; i = 0 <= ref3 ? ++k : --k) {
      str += charMap[data[i]];
    }
    return 'data:image/gif;base64,' + btoa(str);
  };
})();

loadImage = function(src, callback) {
  var img;
  img = new Image();
  img.onload = function() {
    return callback(null, img);
  };
  img.onerror = function() {
    return callback(new Error("Could load " + src));
  };
  return img.src = src;
};

setupDemo = function(element) {
  var delay, gif, images, logel, qslider, qvalue, ref3, renderimg, repeat, startTime;
  element.getElements('.hover-buttons li').addEvents({
    mouseenter: function() {
      return element.addClass(this.className);
    },
    mouseleave: function() {
      return element.removeClass(this.className);
    }
  });
  qslider = element.getElement('.quality input');
  qvalue = element.getElement('.quality span');
  renderimg = element.getElement('img.render');
  logel = element.getElement('pre');
  gif = new GIF({
    debug: true,
    quality: 10,
    workers: 2
  });
  startTime = null;
  gif.on('start', function() {
    return startTime = now();
  });
  gif.on('finished', function(blob, data) {
    var delta;
    if (blobURLSupport) {
      renderimg.src = URL.createObjectURL(blob);
    } else {
      renderimg.src = buildDataURL(data);
    }
    delta = now() - startTime;
    return logel.set('text', "Rendered " + images.length + " frame(s) at q" + gif.options.quality + " in " + (delta.toFixed(2)) + "ms");
  });
  gif.on('progress', function(p) {
    return logel.set('text', "Rendering " + images.length + " frame(s) at q" + gif.options.quality + "... " + (Math.round(p * 100)) + "%");
  });
  images = element.getElements('img.original').map(function(img) {
    return img.src;
  });
  async.map(images, loadImage, function(error, images) {
    var image, j, len;
    if (error != null) {
      throw error;
    }
    for (j = 0, len = images.length; j < len; j++) {
      image = images[j];
      gif.addFrame(image, {
        delay: 500,
        copy: true
      });
    }
    return gif.render();
  });
  qslider.addEvent('change', function() {
    var val;
    val = 31 - parseInt(qslider.value);
    qvalue.set('text', val);
    gif.setOption('quality', val);
    gif.abort();
    return gif.render();
  });
  if ((ref3 = element.getElement('.dither select')) != null) {
    ref3.addEvent('change', function() {
      gif.setOption('dither', this.value === 'None' ? false : this.value);
      gif.abort();
      return gif.render();
    });
  }
  delay = element.getElement('.delay');
  if (delay != null) {
    delay.getElement('input').addEvent('change', function() {
      var frame, j, len, ref4, value;
      value = parseInt(this.value);
      delay.getElement('.value').set('text', value + 'ms');
      ref4 = gif.frames;
      for (j = 0, len = ref4.length; j < len; j++) {
        frame = ref4[j];
        frame.delay = value;
      }
      gif.abort();
      return gif.render();
    });
  }
  repeat = element.getElement('.repeat');
  if (repeat != null) {
    return repeat.getElement('input').addEvent('change', function() {
      var txt, value;
      value = parseInt(this.value);
      if (value === 0) {
        value = -1;
      }
      if (value === 21) {
        value = 0;
      }
      switch (value) {
        case 0:
          txt = 'forever';
          break;
        case -1:
          txt = 'none';
          break;
        default:
          txt = value;
      }
      repeat.getElement('.value').set('text', txt);
      gif.setOption('repeat', value);
      gif.abort();
      return gif.render();
    });
  }
};

ready(function() {
  var demo, j, len, ref3, results;
  ref3 = document.body.querySelectorAll('.demo');
  results = [];
  for (j = 0, len = ref3.length; j < len; j++) {
    demo = ref3[j];
    results.push(setupDemo(demo));
  }
  return results;
});


},{"./vendor/mootools.js":2,"./vendor/ready.js":3,"async":4,"browsernizr":5,"browsernizr/test/css/rgba":33,"browsernizr/test/css/transforms3d":34}],2:[function(require,module,exports){
(function(){

this.MooTools = {
  version: '1.4.5',
  build: 'ab8ea8824dc3b24b6666867a2c4ed58ebb762cf0'
};

// typeOf, instanceOf

var typeOf = this.typeOf = function(item){
  if (item == null) return 'null';
  if (item.$family != null) return item.$family();

  if (item.nodeName){
    if (item.nodeType == 1) return 'element';
    if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
  } else if (typeof item.length == 'number'){
    if (item.callee) return 'arguments';
    if ('item' in item) return 'collection';
  }

  return typeof item;
};

var instanceOf = this.instanceOf = function(item, object){
  if (item == null) return false;
  var constructor = item.$constructor || item.constructor;
  while (constructor){
    if (constructor === object) return true;
    constructor = constructor.parent;
  }
  /*<ltIE8>*/
  if (!item.hasOwnProperty) return false;
  /*</ltIE8>*/
  return item instanceof object;
};

// Function overloading

var Function = this.Function;

var enumerables = true;
for (var i in {toString: 1}) enumerables = null;
if (enumerables) enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

Function.prototype.overloadSetter = function(usePlural){
  var self = this;
  return function(a, b){
    if (a == null) return this;
    if (usePlural || typeof a != 'string'){
      for (var k in a) self.call(this, k, a[k]);
      if (enumerables) for (var i = enumerables.length; i--;){
        k = enumerables[i];
        if (a.hasOwnProperty(k)) self.call(this, k, a[k]);
      }
    } else {
      self.call(this, a, b);
    }
    return this;
  };
};

Function.prototype.overloadGetter = function(usePlural){
  var self = this;
  return function(a){
    var args, result;
    if (typeof a != 'string') args = a;
    else if (arguments.length > 1) args = arguments;
    else if (usePlural) args = [a];
    if (args){
      result = {};
      for (var i = 0; i < args.length; i++) result[args[i]] = self.call(this, args[i]);
    } else {
      result = self.call(this, a);
    }
    return result;
  };
};

Function.prototype.extend = function(key, value){
  this[key] = value;
}.overloadSetter();

Function.prototype.implement = function(key, value){
  this.prototype[key] = value;
}.overloadSetter();

// From

var slice = Array.prototype.slice;

Function.from = function(item){
  return (typeOf(item) == 'function') ? item : function(){
    return item;
  };
};

Array.from = function(item){
  if (item == null) return [];
  return (Type.isEnumerable(item) && typeof item != 'string') ? (typeOf(item) == 'array') ? item : slice.call(item) : [item];
};

Number.from = function(item){
  var number = parseFloat(item);
  return isFinite(number) ? number : null;
};

String.from = function(item){
  return item + '';
};

// hide, protect

Function.implement({

  hide: function(){
    this.$hidden = true;
    return this;
  },

  protect: function(){
    this.$protected = true;
    return this;
  }

});

// Type

var Type = this.Type = function(name, object){
  if (name){
    var lower = name.toLowerCase();
    var typeCheck = function(item){
      return (typeOf(item) == lower);
    };

    Type['is' + name] = typeCheck;
    if (object != null){
      object.prototype.$family = (function(){
        return lower;
      }).hide();

    }
  }

  if (object == null) return null;

  object.extend(this);
  object.$constructor = Type;
  object.prototype.$constructor = object;

  return object;
};

var toString = Object.prototype.toString;

Type.isEnumerable = function(item){
  return (item != null && typeof item.length == 'number' && toString.call(item) != '[object Function]' );
};

var hooks = {};

var hooksOf = function(object){
  var type = typeOf(object.prototype);
  return hooks[type] || (hooks[type] = []);
};

var implement = function(name, method){
  if (method && method.$hidden) return;

  var hooks = hooksOf(this);

  for (var i = 0; i < hooks.length; i++){
    var hook = hooks[i];
    if (typeOf(hook) == 'type') implement.call(hook, name, method);
    else hook.call(this, name, method);
  }

  var previous = this.prototype[name];
  if (previous == null || !previous.$protected) this.prototype[name] = method;

  if (this[name] == null && typeOf(method) == 'function') extend.call(this, name, function(item){
    return method.apply(item, slice.call(arguments, 1));
  });
};

var extend = function(name, method){
  if (method && method.$hidden) return;
  var previous = this[name];
  if (previous == null || !previous.$protected) this[name] = method;
};

Type.implement({

  implement: implement.overloadSetter(),

  extend: extend.overloadSetter(),

  alias: function(name, existing){
    implement.call(this, name, this.prototype[existing]);
  }.overloadSetter(),

  mirror: function(hook){
    hooksOf(this).push(hook);
    return this;
  }

});

new Type('Type', Type);

// Default Types

var force = function(name, object, methods){
  var isType = (object != Object),
    prototype = object.prototype;

  if (isType) object = new Type(name, object);

  for (var i = 0, l = methods.length; i < l; i++){
    var key = methods[i],
      generic = object[key],
      proto = prototype[key];

    if (generic) generic.protect();
    if (isType && proto) object.implement(key, proto.protect());
  }

  if (isType){
    var methodsEnumerable = prototype.propertyIsEnumerable(methods[0]);
    object.forEachMethod = function(fn){
      if (!methodsEnumerable) for (var i = 0, l = methods.length; i < l; i++){
        fn.call(prototype, prototype[methods[i]], methods[i]);
      }
      for (var key in prototype) fn.call(prototype, prototype[key], key)
    };
  }

  return force;
};

force('String', String, [
  'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search',
  'slice', 'split', 'substr', 'substring', 'trim', 'toLowerCase', 'toUpperCase'
])('Array', Array, [
  'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
  'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight'
])('Number', Number, [
  'toExponential', 'toFixed', 'toLocaleString', 'toPrecision'
])('Function', Function, [
  'apply', 'call', 'bind'
])('RegExp', RegExp, [
  'exec', 'test'
])('Object', Object, [
  'create', 'defineProperty', 'defineProperties', 'keys',
  'getPrototypeOf', 'getOwnPropertyDescriptor', 'getOwnPropertyNames',
  'preventExtensions', 'isExtensible', 'seal', 'isSealed', 'freeze', 'isFrozen'
])('Date', Date, ['now']);

Object.extend = extend.overloadSetter();

Date.extend('now', function(){
  return +(new Date);
});

new Type('Boolean', Boolean);

// fixes NaN returning as Number

Number.prototype.$family = function(){
  return isFinite(this) ? 'number' : 'null';
}.hide();

// Number.random

Number.extend('random', function(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
});

// forEach, each

var hasOwnProperty = Object.prototype.hasOwnProperty;
Object.extend('forEach', function(object, fn, bind){
  for (var key in object){
    if (hasOwnProperty.call(object, key)) fn.call(bind, object[key], key, object);
  }
});

Object.each = Object.forEach;

Array.implement({

  forEach: function(fn, bind){
    for (var i = 0, l = this.length; i < l; i++){
      if (i in this) fn.call(bind, this[i], i, this);
    }
  },

  each: function(fn, bind){
    Array.forEach(this, fn, bind);
    return this;
  }

});

// Array & Object cloning, Object merging and appending

var cloneOf = function(item){
  switch (typeOf(item)){
    case 'array': return item.clone();
    case 'object': return Object.clone(item);
    default: return item;
  }
};

Array.implement('clone', function(){
  var i = this.length, clone = new Array(i);
  while (i--) clone[i] = cloneOf(this[i]);
  return clone;
});

var mergeOne = function(source, key, current){
  switch (typeOf(current)){
    case 'object':
      if (typeOf(source[key]) == 'object') Object.merge(source[key], current);
      else source[key] = Object.clone(current);
    break;
    case 'array': source[key] = current.clone(); break;
    default: source[key] = current;
  }
  return source;
};

Object.extend({

  merge: function(source, k, v){
    if (typeOf(k) == 'string') return mergeOne(source, k, v);
    for (var i = 1, l = arguments.length; i < l; i++){
      var object = arguments[i];
      for (var key in object) mergeOne(source, key, object[key]);
    }
    return source;
  },

  clone: function(object){
    var clone = {};
    for (var key in object) clone[key] = cloneOf(object[key]);
    return clone;
  },

  append: function(original){
    for (var i = 1, l = arguments.length; i < l; i++){
      var extended = arguments[i] || {};
      for (var key in extended) original[key] = extended[key];
    }
    return original;
  }

});

// Object-less types

['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments'].each(function(name){
  new Type(name);
});

// Unique ID

var UID = Date.now();

String.extend('uniqueID', function(){
  return (UID++).toString(36);
});



})();


/*
---

name: Array

description: Contains Array Prototypes like each, contains, and erase.

license: MIT-style license.

requires: Type

provides: Array

...
*/

Array.implement({

  /*<!ES5>*/
  every: function(fn, bind){
    for (var i = 0, l = this.length >>> 0; i < l; i++){
      if ((i in this) && !fn.call(bind, this[i], i, this)) return false;
    }
    return true;
  },

  filter: function(fn, bind){
    var results = [];
    for (var value, i = 0, l = this.length >>> 0; i < l; i++) if (i in this){
      value = this[i];
      if (fn.call(bind, value, i, this)) results.push(value);
    }
    return results;
  },

  indexOf: function(item, from){
    var length = this.length >>> 0;
    for (var i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++){
      if (this[i] === item) return i;
    }
    return -1;
  },

  map: function(fn, bind){
    var length = this.length >>> 0, results = Array(length);
    for (var i = 0; i < length; i++){
      if (i in this) results[i] = fn.call(bind, this[i], i, this);
    }
    return results;
  },

  some: function(fn, bind){
    for (var i = 0, l = this.length >>> 0; i < l; i++){
      if ((i in this) && fn.call(bind, this[i], i, this)) return true;
    }
    return false;
  },
  /*</!ES5>*/

  clean: function(){
    return this.filter(function(item){
      return item != null;
    });
  },

  invoke: function(methodName){
    var args = Array.slice(arguments, 1);
    return this.map(function(item){
      return item[methodName].apply(item, args);
    });
  },

  associate: function(keys){
    var obj = {}, length = Math.min(this.length, keys.length);
    for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
    return obj;
  },

  link: function(object){
    var result = {};
    for (var i = 0, l = this.length; i < l; i++){
      for (var key in object){
        if (object[key](this[i])){
          result[key] = this[i];
          delete object[key];
          break;
        }
      }
    }
    return result;
  },

  contains: function(item, from){
    return this.indexOf(item, from) != -1;
  },

  append: function(array){
    this.push.apply(this, array);
    return this;
  },

  getLast: function(){
    return (this.length) ? this[this.length - 1] : null;
  },

  getRandom: function(){
    return (this.length) ? this[Number.random(0, this.length - 1)] : null;
  },

  include: function(item){
    if (!this.contains(item)) this.push(item);
    return this;
  },

  combine: function(array){
    for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
    return this;
  },

  erase: function(item){
    for (var i = this.length; i--;){
      if (this[i] === item) this.splice(i, 1);
    }
    return this;
  },

  empty: function(){
    this.length = 0;
    return this;
  },

  flatten: function(){
    var array = [];
    for (var i = 0, l = this.length; i < l; i++){
      var type = typeOf(this[i]);
      if (type == 'null') continue;
      array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || instanceOf(this[i], Array)) ? Array.flatten(this[i]) : this[i]);
    }
    return array;
  },

  pick: function(){
    for (var i = 0, l = this.length; i < l; i++){
      if (this[i] != null) return this[i];
    }
    return null;
  },

  hexToRgb: function(array){
    if (this.length != 3) return null;
    var rgb = this.map(function(value){
      if (value.length == 1) value += value;
      return value.toInt(16);
    });
    return (array) ? rgb : 'rgb(' + rgb + ')';
  },

  rgbToHex: function(array){
    if (this.length < 3) return null;
    if (this.length == 4 && this[3] == 0 && !array) return 'transparent';
    var hex = [];
    for (var i = 0; i < 3; i++){
      var bit = (this[i] - 0).toString(16);
      hex.push((bit.length == 1) ? '0' + bit : bit);
    }
    return (array) ? hex : '#' + hex.join('');
  }

});




/*
---

name: Function

description: Contains Function Prototypes like create, bind, pass, and delay.

license: MIT-style license.

requires: Type

provides: Function

...
*/

Function.extend({

  attempt: function(){
    for (var i = 0, l = arguments.length; i < l; i++){
      try {
        return arguments[i]();
      } catch (e){}
    }
    return null;
  }

});

Function.implement({

  attempt: function(args, bind){
    try {
      return this.apply(bind, Array.from(args));
    } catch (e){}

    return null;
  },

  /*<!ES5-bind>*/
  bind: function(that){
    var self = this,
      args = arguments.length > 1 ? Array.slice(arguments, 1) : null,
      F = function(){};

    var bound = function(){
      var context = that, length = arguments.length;
      if (this instanceof bound){
        F.prototype = self.prototype;
        context = new F;
      }
      var result = (!args && !length)
        ? self.call(context)
        : self.apply(context, args && length ? args.concat(Array.slice(arguments)) : args || arguments);
      return context == that ? result : context;
    };
    return bound;
  },
  /*</!ES5-bind>*/

  pass: function(args, bind){
    var self = this;
    if (args != null) args = Array.from(args);
    return function(){
      return self.apply(bind, args || arguments);
    };
  },

  delay: function(delay, bind, args){
    return setTimeout(this.pass((args == null ? [] : args), bind), delay);
  },

  periodical: function(periodical, bind, args){
    return setInterval(this.pass((args == null ? [] : args), bind), periodical);
  }

});




/*
---

name: Number

description: Contains Number Prototypes like limit, round, times, and ceil.

license: MIT-style license.

requires: Type

provides: Number

...
*/

Number.implement({

  limit: function(min, max){
    return Math.min(max, Math.max(min, this));
  },

  round: function(precision){
    precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);
    return Math.round(this * precision) / precision;
  },

  times: function(fn, bind){
    for (var i = 0; i < this; i++) fn.call(bind, i, this);
  },

  toFloat: function(){
    return parseFloat(this);
  },

  toInt: function(base){
    return parseInt(this, base || 10);
  }

});

Number.alias('each', 'times');

(function(math){
  var methods = {};
  math.each(function(name){
    if (!Number[name]) methods[name] = function(){
      return Math[name].apply(null, [this].concat(Array.from(arguments)));
    };
  });
  Number.implement(methods);
})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);


/*
---

name: String

description: Contains String Prototypes like camelCase, capitalize, test, and toInt.

license: MIT-style license.

requires: Type

provides: String

...
*/

String.implement({

  test: function(regex, params){
    return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
  },

  contains: function(string, separator){
    return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : String(this).indexOf(string) > -1;
  },

  trim: function(){
    return String(this).replace(/^\s+|\s+$/g, '');
  },

  clean: function(){
    return String(this).replace(/\s+/g, ' ').trim();
  },

  camelCase: function(){
    return String(this).replace(/-\D/g, function(match){
      return match.charAt(1).toUpperCase();
    });
  },

  hyphenate: function(){
    return String(this).replace(/[A-Z]/g, function(match){
      return ('-' + match.charAt(0).toLowerCase());
    });
  },

  capitalize: function(){
    return String(this).replace(/\b[a-z]/g, function(match){
      return match.toUpperCase();
    });
  },

  escapeRegExp: function(){
    return String(this).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
  },

  toInt: function(base){
    return parseInt(this, base || 10);
  },

  toFloat: function(){
    return parseFloat(this);
  },

  hexToRgb: function(array){
    var hex = String(this).match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
    return (hex) ? hex.slice(1).hexToRgb(array) : null;
  },

  rgbToHex: function(array){
    var rgb = String(this).match(/\d{1,3}/g);
    return (rgb) ? rgb.rgbToHex(array) : null;
  },

  substitute: function(object, regexp){
    return String(this).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
      if (match.charAt(0) == '\\') return match.slice(1);
      return (object[name] != null) ? object[name] : '';
    });
  }

});


/*
---

name: Browser

description: The Browser Object. Contains Browser initialization, Window and Document, and the Browser Hash.

license: MIT-style license.

requires: [Array, Function, Number, String]

provides: [Browser, Window, Document]

...
*/

(function(){

var document = this.document;
var window = document.window = this;

var ua = navigator.userAgent.toLowerCase(),
  platform = navigator.platform.toLowerCase(),
  UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0],
  mode = UA[1] == 'ie' && document.documentMode;

var Browser = this.Browser = {

  extend: Function.prototype.extend,

  name: (UA[1] == 'version') ? UA[3] : UA[1],

  version: mode || parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),

  Platform: {
    name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
  },

  Features: {
    xpath: !!(document.evaluate),
    air: !!(window.runtime),
    query: !!(document.querySelector),
    json: !!(window.JSON)
  },

  Plugins: {}

};

Browser[Browser.name] = true;
Browser[Browser.name + parseInt(Browser.version, 10)] = true;
Browser.Platform[Browser.Platform.name] = true;

// Request

Browser.Request = (function(){

  var XMLHTTP = function(){
    return new XMLHttpRequest();
  };

  var MSXML2 = function(){
    return new ActiveXObject('MSXML2.XMLHTTP');
  };

  var MSXML = function(){
    return new ActiveXObject('Microsoft.XMLHTTP');
  };

  return Function.attempt(function(){
    XMLHTTP();
    return XMLHTTP;
  }, function(){
    MSXML2();
    return MSXML2;
  }, function(){
    MSXML();
    return MSXML;
  });

})();

Browser.Features.xhr = !!(Browser.Request);

// Flash detection

var version = (Function.attempt(function(){
  return navigator.plugins['Shockwave Flash'].description;
}, function(){
  return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
}) || '0 r0').match(/\d+/g);

Browser.Plugins.Flash = {
  version: Number(version[0] || '0.' + version[1]) || 0,
  build: Number(version[2]) || 0
};

// String scripts

Browser.exec = function(text){
  if (!text) return text;
  if (window.execScript){
    window.execScript(text);
  } else {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.text = text;
    document.head.appendChild(script);
    document.head.removeChild(script);
  }
  return text;
};

String.implement('stripScripts', function(exec){
  var scripts = '';
  var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(all, code){
    scripts += code + '\n';
    return '';
  });
  if (exec === true) Browser.exec(scripts);
  else if (typeOf(exec) == 'function') exec(scripts, text);
  return text;
});

// Window, Document

Browser.extend({
  Document: this.Document,
  Window: this.Window,
  Element: this.Element,
  Event: this.Event
});

this.Window = this.$constructor = new Type('Window', function(){});

this.$family = Function.from('window').hide();

Window.mirror(function(name, method){
  window[name] = method;
});

this.Document = document.$constructor = new Type('Document', function(){});

document.$family = Function.from('document').hide();

Document.mirror(function(name, method){
  document[name] = method;
});

document.html = document.documentElement;
if (!document.head) document.head = document.getElementsByTagName('head')[0];

if (document.execCommand) try {
  document.execCommand("BackgroundImageCache", false, true);
} catch (e){}

/*<ltIE9>*/
if (this.attachEvent && !this.addEventListener){
  var unloadEvent = function(){
    this.detachEvent('onunload', unloadEvent);
    document.head = document.html = document.window = null;
  };
  this.attachEvent('onunload', unloadEvent);
}

// IE fails on collections and <select>.options (refers to <select>)
var arrayFrom = Array.from;
try {
  arrayFrom(document.html.childNodes);
} catch(e){
  Array.from = function(item){
    if (typeof item != 'string' && Type.isEnumerable(item) && typeOf(item) != 'array'){
      var i = item.length, array = new Array(i);
      while (i--) array[i] = item[i];
      return array;
    }
    return arrayFrom(item);
  };

  var prototype = Array.prototype,
    slice = prototype.slice;
  ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice'].each(function(name){
    var method = prototype[name];
    Array[name] = function(item){
      return method.apply(Array.from(item), slice.call(arguments, 1));
    };
  });
}
/*</ltIE9>*/



})();


/*
---

name: Object

description: Object generic methods

license: MIT-style license.

requires: Type

provides: [Object, Hash]

...
*/

(function(){

var hasOwnProperty = Object.prototype.hasOwnProperty;

Object.extend({

  subset: function(object, keys){
    var results = {};
    for (var i = 0, l = keys.length; i < l; i++){
      var k = keys[i];
      if (k in object) results[k] = object[k];
    }
    return results;
  },

  map: function(object, fn, bind){
    var results = {};
    for (var key in object){
      if (hasOwnProperty.call(object, key)) results[key] = fn.call(bind, object[key], key, object);
    }
    return results;
  },

  filter: function(object, fn, bind){
    var results = {};
    for (var key in object){
      var value = object[key];
      if (hasOwnProperty.call(object, key) && fn.call(bind, value, key, object)) results[key] = value;
    }
    return results;
  },

  every: function(object, fn, bind){
    for (var key in object){
      if (hasOwnProperty.call(object, key) && !fn.call(bind, object[key], key)) return false;
    }
    return true;
  },

  some: function(object, fn, bind){
    for (var key in object){
      if (hasOwnProperty.call(object, key) && fn.call(bind, object[key], key)) return true;
    }
    return false;
  },

  keys: function(object){
    var keys = [];
    for (var key in object){
      if (hasOwnProperty.call(object, key)) keys.push(key);
    }
    return keys;
  },

  values: function(object){
    var values = [];
    for (var key in object){
      if (hasOwnProperty.call(object, key)) values.push(object[key]);
    }
    return values;
  },

  getLength: function(object){
    return Object.keys(object).length;
  },

  keyOf: function(object, value){
    for (var key in object){
      if (hasOwnProperty.call(object, key) && object[key] === value) return key;
    }
    return null;
  },

  contains: function(object, value){
    return Object.keyOf(object, value) != null;
  },

  toQueryString: function(object, base){
    var queryString = [];

    Object.each(object, function(value, key){
      if (base) key = base + '[' + key + ']';
      var result;
      switch (typeOf(value)){
        case 'object': result = Object.toQueryString(value, key); break;
        case 'array':
          var qs = {};
          value.each(function(val, i){
            qs[i] = val;
          });
          result = Object.toQueryString(qs, key);
        break;
        default: result = key + '=' + encodeURIComponent(value);
      }
      if (value != null) queryString.push(result);
    });

    return queryString.join('&');
  }

});

})();




/*
---

name: Event

description: Contains the Event Type, to make the event object cross-browser.

license: MIT-style license.

requires: [Window, Document, Array, Function, String, Object]

provides: Event

...
*/

(function() {

var _keys = {};

var DOMEvent = this.DOMEvent = new Type('DOMEvent', function(event, win){
  if (!win) win = window;
  event = event || win.event;
  if (event.$extended) return event;
  this.event = event;
  this.$extended = true;
  this.shift = event.shiftKey;
  this.control = event.ctrlKey;
  this.alt = event.altKey;
  this.meta = event.metaKey;
  var type = this.type = event.type;
  var target = event.target || event.srcElement;
  while (target && target.nodeType == 3) target = target.parentNode;
  this.target = document.id(target);

  if (type.indexOf('key') == 0){
    var code = this.code = (event.which || event.keyCode);
    this.key = _keys[code];
    if (type == 'keydown'){
      if (code > 111 && code < 124) this.key = 'f' + (code - 111);
      else if (code > 95 && code < 106) this.key = code - 96;
    }
    if (this.key == null) this.key = String.fromCharCode(code).toLowerCase();
  } else if (type == 'click' || type == 'dblclick' || type == 'contextmenu' || type == 'DOMMouseScroll' || type.indexOf('mouse') == 0){
    var doc = win.document;
    doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
    this.page = {
      x: (event.pageX != null) ? event.pageX : event.clientX + doc.scrollLeft,
      y: (event.pageY != null) ? event.pageY : event.clientY + doc.scrollTop
    };
    this.client = {
      x: (event.pageX != null) ? event.pageX - win.pageXOffset : event.clientX,
      y: (event.pageY != null) ? event.pageY - win.pageYOffset : event.clientY
    };
    if (type == 'DOMMouseScroll' || type == 'mousewheel')
      this.wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;

    this.rightClick = (event.which == 3 || event.button == 2);
    if (type == 'mouseover' || type == 'mouseout'){
      var related = event.relatedTarget || event[(type == 'mouseover' ? 'from' : 'to') + 'Element'];
      while (related && related.nodeType == 3) related = related.parentNode;
      this.relatedTarget = document.id(related);
    }
  } else if (type.indexOf('touch') == 0 || type.indexOf('gesture') == 0){
    this.rotation = event.rotation;
    this.scale = event.scale;
    this.targetTouches = event.targetTouches;
    this.changedTouches = event.changedTouches;
    var touches = this.touches = event.touches;
    if (touches && touches[0]){
      var touch = touches[0];
      this.page = {x: touch.pageX, y: touch.pageY};
      this.client = {x: touch.clientX, y: touch.clientY};
    }
  }

  if (!this.client) this.client = {};
  if (!this.page) this.page = {};
});

DOMEvent.implement({

  stop: function(){
    return this.preventDefault().stopPropagation();
  },

  stopPropagation: function(){
    if (this.event.stopPropagation) this.event.stopPropagation();
    else this.event.cancelBubble = true;
    return this;
  },

  preventDefault: function(){
    if (this.event.preventDefault) this.event.preventDefault();
    else this.event.returnValue = false;
    return this;
  }

});

DOMEvent.defineKey = function(code, key){
  _keys[code] = key;
  return this;
};

DOMEvent.defineKeys = DOMEvent.defineKey.overloadSetter(true);

DOMEvent.defineKeys({
  '38': 'up', '40': 'down', '37': 'left', '39': 'right',
  '27': 'esc', '32': 'space', '8': 'backspace', '9': 'tab',
  '46': 'delete', '13': 'enter'
});

})();






/*
---
name: Slick.Parser
description: Standalone CSS3 Selector parser
provides: Slick.Parser
...
*/

;(function(){

var parsed,
  separatorIndex,
  combinatorIndex,
  reversed,
  cache = {},
  reverseCache = {},
  reUnescape = /\\/g;

var parse = function(expression, isReversed){
  if (expression == null) return null;
  if (expression.Slick === true) return expression;
  expression = ('' + expression).replace(/^\s+|\s+$/g, '');
  reversed = !!isReversed;
  var currentCache = (reversed) ? reverseCache : cache;
  if (currentCache[expression]) return currentCache[expression];
  parsed = {
    Slick: true,
    expressions: [],
    raw: expression,
    reverse: function(){
      return parse(this.raw, true);
    }
  };
  separatorIndex = -1;
  while (expression != (expression = expression.replace(regexp, parser)));
  parsed.length = parsed.expressions.length;
  return currentCache[parsed.raw] = (reversed) ? reverse(parsed) : parsed;
};

var reverseCombinator = function(combinator){
  if (combinator === '!') return ' ';
  else if (combinator === ' ') return '!';
  else if ((/^!/).test(combinator)) return combinator.replace(/^!/, '');
  else return '!' + combinator;
};

var reverse = function(expression){
  var expressions = expression.expressions;
  for (var i = 0; i < expressions.length; i++){
    var exp = expressions[i];
    var last = {parts: [], tag: '*', combinator: reverseCombinator(exp[0].combinator)};

    for (var j = 0; j < exp.length; j++){
      var cexp = exp[j];
      if (!cexp.reverseCombinator) cexp.reverseCombinator = ' ';
      cexp.combinator = cexp.reverseCombinator;
      delete cexp.reverseCombinator;
    }

    exp.reverse().push(last);
  }
  return expression;
};

var escapeRegExp = function(string){// Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
  return string.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, function(match){
    return '\\' + match;
  });
};

var regexp = new RegExp(
/*
#!/usr/bin/env ruby
puts "\t\t" + DATA.read.gsub(/\(\?x\)|\s+#.*$|\s+|\\$|\\n/,'')
__END__
  "(?x)^(?:\
    \\s* ( , ) \\s*               # Separator          \n\
  | \\s* ( <combinator>+ ) \\s*   # Combinator         \n\
  |      ( \\s+ )                 # CombinatorChildren \n\
  |      ( <unicode>+ | \\* )     # Tag                \n\
  | \\#  ( <unicode>+       )     # ID                 \n\
  | \\.  ( <unicode>+       )     # ClassName          \n\
  |                               # Attribute          \n\
  \\[  \
    \\s* (<unicode1>+)  (?:  \
      \\s* ([*^$!~|]?=)  (?:  \
        \\s* (?:\
          ([\"']?)(.*?)\\9 \
        )\
      )  \
    )?  \\s*  \
  \\](?!\\]) \n\
  |   :+ ( <unicode>+ )(?:\
  \\( (?:\
    (?:([\"'])([^\\12]*)\\12)|((?:\\([^)]+\\)|[^()]*)+)\
  ) \\)\
  )?\
  )"
*/
  "^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|(:+)(<unicode>+)(?:\\((?:(?:([\"'])([^\\13]*)\\13)|((?:\\([^)]+\\)|[^()]*)+))\\))?)"
  .replace(/<combinator>/, '[' + escapeRegExp(">+~`!@$%^&={}\\;</") + ']')
  .replace(/<unicode>/g, '(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
  .replace(/<unicode1>/g, '(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
);

function parser(
  rawMatch,

  separator,
  combinator,
  combinatorChildren,

  tagName,
  id,
  className,

  attributeKey,
  attributeOperator,
  attributeQuote,
  attributeValue,

  pseudoMarker,
  pseudoClass,
  pseudoQuote,
  pseudoClassQuotedValue,
  pseudoClassValue
){
  if (separator || separatorIndex === -1){
    parsed.expressions[++separatorIndex] = [];
    combinatorIndex = -1;
    if (separator) return '';
  }

  if (combinator || combinatorChildren || combinatorIndex === -1){
    combinator = combinator || ' ';
    var currentSeparator = parsed.expressions[separatorIndex];
    if (reversed && currentSeparator[combinatorIndex])
      currentSeparator[combinatorIndex].reverseCombinator = reverseCombinator(combinator);
    currentSeparator[++combinatorIndex] = {combinator: combinator, tag: '*'};
  }

  var currentParsed = parsed.expressions[separatorIndex][combinatorIndex];

  if (tagName){
    currentParsed.tag = tagName.replace(reUnescape, '');

  } else if (id){
    currentParsed.id = id.replace(reUnescape, '');

  } else if (className){
    className = className.replace(reUnescape, '');

    if (!currentParsed.classList) currentParsed.classList = [];
    if (!currentParsed.classes) currentParsed.classes = [];
    currentParsed.classList.push(className);
    currentParsed.classes.push({
      value: className,
      regexp: new RegExp('(^|\\s)' + escapeRegExp(className) + '(\\s|$)')
    });

  } else if (pseudoClass){
    pseudoClassValue = pseudoClassValue || pseudoClassQuotedValue;
    pseudoClassValue = pseudoClassValue ? pseudoClassValue.replace(reUnescape, '') : null;

    if (!currentParsed.pseudos) currentParsed.pseudos = [];
    currentParsed.pseudos.push({
      key: pseudoClass.replace(reUnescape, ''),
      value: pseudoClassValue,
      type: pseudoMarker.length == 1 ? 'class' : 'element'
    });

  } else if (attributeKey){
    attributeKey = attributeKey.replace(reUnescape, '');
    attributeValue = (attributeValue || '').replace(reUnescape, '');

    var test, regexp;

    switch (attributeOperator){
      case '^=' : regexp = new RegExp(       '^'+ escapeRegExp(attributeValue)            ); break;
      case '$=' : regexp = new RegExp(            escapeRegExp(attributeValue) +'$'       ); break;
      case '~=' : regexp = new RegExp( '(^|\\s)'+ escapeRegExp(attributeValue) +'(\\s|$)' ); break;
      case '|=' : regexp = new RegExp(       '^'+ escapeRegExp(attributeValue) +'(-|$)'   ); break;
      case  '=' : test = function(value){
        return attributeValue == value;
      }; break;
      case '*=' : test = function(value){
        return value && value.indexOf(attributeValue) > -1;
      }; break;
      case '!=' : test = function(value){
        return attributeValue != value;
      }; break;
      default   : test = function(value){
        return !!value;
      };
    }

    if (attributeValue == '' && (/^[*$^]=$/).test(attributeOperator)) test = function(){
      return false;
    };

    if (!test) test = function(value){
      return value && regexp.test(value);
    };

    if (!currentParsed.attributes) currentParsed.attributes = [];
    currentParsed.attributes.push({
      key: attributeKey,
      operator: attributeOperator,
      value: attributeValue,
      test: test
    });

  }

  return '';
};

// Slick NS

var Slick = (this.Slick || {});

Slick.parse = function(expression){
  return parse(expression);
};

Slick.escapeRegExp = escapeRegExp;

if (!this.Slick) this.Slick = Slick;

}).apply(window);


/*
---
name: Slick.Finder
description: The new, superfast css selector engine.
provides: Slick.Finder
requires: Slick.Parser
...
*/

;(function(){

var local = {},
  featuresCache = {},
  toString = Object.prototype.toString;

// Feature / Bug detection

local.isNativeCode = function(fn){
  return (/\{\s*\[native code\]\s*\}/).test('' + fn);
};

local.isXML = function(document){
  return (!!document.xmlVersion) || (!!document.xml) || (toString.call(document) == '[object XMLDocument]') ||
  (document.nodeType == 9 && document.documentElement.nodeName != 'HTML');
};

local.setDocument = function(document){

  // convert elements / window arguments to document. if document cannot be extrapolated, the function returns.
  var nodeType = document.nodeType;
  if (nodeType == 9); // document
  else if (nodeType) document = document.ownerDocument; // node
  else if (document.navigator) document = document.document; // window
  else return;

  // check if it's the old document

  if (this.document === document) return;
  this.document = document;

  // check if we have done feature detection on this document before

  var root = document.documentElement,
    rootUid = this.getUIDXML(root),
    features = featuresCache[rootUid],
    feature;

  if (features){
    for (feature in features){
      this[feature] = features[feature];
    }
    return;
  }

  features = featuresCache[rootUid] = {};

  features.root = root;
  features.isXMLDocument = this.isXML(document);

  features.brokenStarGEBTN
  = features.starSelectsClosedQSA
  = features.idGetsName
  = features.brokenMixedCaseQSA
  = features.brokenGEBCN
  = features.brokenCheckedQSA
  = features.brokenEmptyAttributeQSA
  = features.isHTMLDocument
  = features.nativeMatchesSelector
  = false;

  var starSelectsClosed, starSelectsComments,
    brokenSecondClassNameGEBCN, cachedGetElementsByClassName,
    brokenFormAttributeGetter;

  var selected, id = 'slick_uniqueid';
  var testNode = document.createElement('div');

  var testRoot = document.body || document.getElementsByTagName('body')[0] || root;
  testRoot.appendChild(testNode);

  // on non-HTML documents innerHTML and getElementsById doesnt work properly
  try {
    testNode.innerHTML = '<a id="'+id+'"></a>';
    features.isHTMLDocument = !!document.getElementById(id);
  } catch(e){};

  if (features.isHTMLDocument){

    testNode.style.display = 'none';

    // IE returns comment nodes for getElementsByTagName('*') for some documents
    testNode.appendChild(document.createComment(''));
    starSelectsComments = (testNode.getElementsByTagName('*').length > 1);

    // IE returns closed nodes (EG:"</foo>") for getElementsByTagName('*') for some documents
    try {
      testNode.innerHTML = 'foo</foo>';
      selected = testNode.getElementsByTagName('*');
      starSelectsClosed = (selected && !!selected.length && selected[0].nodeName.charAt(0) == '/');
    } catch(e){};

    features.brokenStarGEBTN = starSelectsComments || starSelectsClosed;

    // IE returns elements with the name instead of just id for getElementsById for some documents
    try {
      testNode.innerHTML = '<a name="'+ id +'"></a><b id="'+ id +'"></b>';
      features.idGetsName = document.getElementById(id) === testNode.firstChild;
    } catch(e){};

    if (testNode.getElementsByClassName){

      // Safari 3.2 getElementsByClassName caches results
      try {
        testNode.innerHTML = '<a class="f"></a><a class="b"></a>';
        testNode.getElementsByClassName('b').length;
        testNode.firstChild.className = 'b';
        cachedGetElementsByClassName = (testNode.getElementsByClassName('b').length != 2);
      } catch(e){};

      // Opera 9.6 getElementsByClassName doesnt detects the class if its not the first one
      try {
        testNode.innerHTML = '<a class="a"></a><a class="f b a"></a>';
        brokenSecondClassNameGEBCN = (testNode.getElementsByClassName('a').length != 2);
      } catch(e){};

      features.brokenGEBCN = cachedGetElementsByClassName || brokenSecondClassNameGEBCN;
    }

    if (testNode.querySelectorAll){
      // IE 8 returns closed nodes (EG:"</foo>") for querySelectorAll('*') for some documents
      try {
        testNode.innerHTML = 'foo</foo>';
        selected = testNode.querySelectorAll('*');
        features.starSelectsClosedQSA = (selected && !!selected.length && selected[0].nodeName.charAt(0) == '/');
      } catch(e){};

      // Safari 3.2 querySelectorAll doesnt work with mixedcase on quirksmode
      try {
        testNode.innerHTML = '<a class="MiX"></a>';
        features.brokenMixedCaseQSA = !testNode.querySelectorAll('.MiX').length;
      } catch(e){};

      // Webkit and Opera dont return selected options on querySelectorAll
      try {
        testNode.innerHTML = '<select><option selected="selected">a</option></select>';
        features.brokenCheckedQSA = (testNode.querySelectorAll(':checked').length == 0);
      } catch(e){};

      // IE returns incorrect results for attr[*^$]="" selectors on querySelectorAll
      try {
        testNode.innerHTML = '<a class=""></a>';
        features.brokenEmptyAttributeQSA = (testNode.querySelectorAll('[class*=""]').length != 0);
      } catch(e){};

    }

    // IE6-7, if a form has an input of id x, form.getAttribute(x) returns a reference to the input
    try {
      testNode.innerHTML = '<form action="s"><input id="action"/></form>';
      brokenFormAttributeGetter = (testNode.firstChild.getAttribute('action') != 's');
    } catch(e){};

    // native matchesSelector function

    features.nativeMatchesSelector = root.matchesSelector || /*root.msMatchesSelector ||*/ root.mozMatchesSelector || root.webkitMatchesSelector;
    if (features.nativeMatchesSelector) try {
      // if matchesSelector trows errors on incorrect sintaxes we can use it
      features.nativeMatchesSelector.call(root, ':slick');
      features.nativeMatchesSelector = null;
    } catch(e){};

  }

  try {
    root.slick_expando = 1;
    delete root.slick_expando;
    features.getUID = this.getUIDHTML;
  } catch(e) {
    features.getUID = this.getUIDXML;
  }

  testRoot.removeChild(testNode);
  testNode = selected = testRoot = null;

  // getAttribute

  features.getAttribute = (features.isHTMLDocument && brokenFormAttributeGetter) ? function(node, name){
    var method = this.attributeGetters[name];
    if (method) return method.call(node);
    var attributeNode = node.getAttributeNode(name);
    return (attributeNode) ? attributeNode.nodeValue : null;
  } : function(node, name){
    var method = this.attributeGetters[name];
    return (method) ? method.call(node) : node.getAttribute(name);
  };

  // hasAttribute

  features.hasAttribute = (root && this.isNativeCode(root.hasAttribute)) ? function(node, attribute) {
    return node.hasAttribute(attribute);
  } : function(node, attribute) {
    node = node.getAttributeNode(attribute);
    return !!(node && (node.specified || node.nodeValue));
  };

  // contains
  // FIXME: Add specs: local.contains should be different for xml and html documents?
  var nativeRootContains = root && this.isNativeCode(root.contains),
    nativeDocumentContains = document && this.isNativeCode(document.contains);

  features.contains = (nativeRootContains && nativeDocumentContains) ? function(context, node){
    return context.contains(node);
  } : (nativeRootContains && !nativeDocumentContains) ? function(context, node){
    // IE8 does not have .contains on document.
    return context === node || ((context === document) ? document.documentElement : context).contains(node);
  } : (root && root.compareDocumentPosition) ? function(context, node){
    return context === node || !!(context.compareDocumentPosition(node) & 16);
  } : function(context, node){
    if (node) do {
      if (node === context) return true;
    } while ((node = node.parentNode));
    return false;
  };

  // document order sorting
  // credits to Sizzle (http://sizzlejs.com/)

  features.documentSorter = (root.compareDocumentPosition) ? function(a, b){
    if (!a.compareDocumentPosition || !b.compareDocumentPosition) return 0;
    return a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
  } : ('sourceIndex' in root) ? function(a, b){
    if (!a.sourceIndex || !b.sourceIndex) return 0;
    return a.sourceIndex - b.sourceIndex;
  } : (document.createRange) ? function(a, b){
    if (!a.ownerDocument || !b.ownerDocument) return 0;
    var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
    aRange.setStart(a, 0);
    aRange.setEnd(a, 0);
    bRange.setStart(b, 0);
    bRange.setEnd(b, 0);
    return aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
  } : null ;

  root = null;

  for (feature in features){
    this[feature] = features[feature];
  }
};

// Main Method

var reSimpleSelector = /^([#.]?)((?:[\w-]+|\*))$/,
  reEmptyAttribute = /\[.+[*$^]=(?:""|'')?\]/,
  qsaFailExpCache = {};

local.search = function(context, expression, append, first){

  var found = this.found = (first) ? null : (append || []);

  if (!context) return found;
  else if (context.navigator) context = context.document; // Convert the node from a window to a document
  else if (!context.nodeType) return found;

  // setup

  var parsed, i,
    uniques = this.uniques = {},
    hasOthers = !!(append && append.length),
    contextIsDocument = (context.nodeType == 9);

  if (this.document !== (contextIsDocument ? context : context.ownerDocument)) this.setDocument(context);

  // avoid duplicating items already in the append array
  if (hasOthers) for (i = found.length; i--;) uniques[this.getUID(found[i])] = true;

  // expression checks

  if (typeof expression == 'string'){ // expression is a string

    /*<simple-selectors-override>*/
    var simpleSelector = expression.match(reSimpleSelector);
    simpleSelectors: if (simpleSelector) {

      var symbol = simpleSelector[1],
        name = simpleSelector[2],
        node, nodes;

      if (!symbol){

        if (name == '*' && this.brokenStarGEBTN) break simpleSelectors;
        nodes = context.getElementsByTagName(name);
        if (first) return nodes[0] || null;
        for (i = 0; node = nodes[i++];){
          if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
        }

      } else if (symbol == '#'){

        if (!this.isHTMLDocument || !contextIsDocument) break simpleSelectors;
        node = context.getElementById(name);
        if (!node) return found;
        if (this.idGetsName && node.getAttributeNode('id').nodeValue != name) break simpleSelectors;
        if (first) return node || null;
        if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);

      } else if (symbol == '.'){

        if (!this.isHTMLDocument || ((!context.getElementsByClassName || this.brokenGEBCN) && context.querySelectorAll)) break simpleSelectors;
        if (context.getElementsByClassName && !this.brokenGEBCN){
          nodes = context.getElementsByClassName(name);
          if (first) return nodes[0] || null;
          for (i = 0; node = nodes[i++];){
            if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
          }
        } else {
          var matchClass = new RegExp('(^|\\s)'+ Slick.escapeRegExp(name) +'(\\s|$)');
          nodes = context.getElementsByTagName('*');
          for (i = 0; node = nodes[i++];){
            className = node.className;
            if (!(className && matchClass.test(className))) continue;
            if (first) return node;
            if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
          }
        }

      }

      if (hasOthers) this.sort(found);
      return (first) ? null : found;

    }
    /*</simple-selectors-override>*/

    /*<query-selector-override>*/
    querySelector: if (context.querySelectorAll) {

      if (!this.isHTMLDocument
        || qsaFailExpCache[expression]
        //TODO: only skip when expression is actually mixed case
        || this.brokenMixedCaseQSA
        || (this.brokenCheckedQSA && expression.indexOf(':checked') > -1)
        || (this.brokenEmptyAttributeQSA && reEmptyAttribute.test(expression))
        || (!contextIsDocument //Abort when !contextIsDocument and...
          //  there are multiple expressions in the selector
          //  since we currently only fix non-document rooted QSA for single expression selectors
          && expression.indexOf(',') > -1
        )
        || Slick.disableQSA
      ) break querySelector;

      var _expression = expression, _context = context;
      if (!contextIsDocument){
        // non-document rooted QSA
        // credits to Andrew Dupont
        var currentId = _context.getAttribute('id'), slickid = 'slickid__';
        _context.setAttribute('id', slickid);
        _expression = '#' + slickid + ' ' + _expression;
        context = _context.parentNode;
      }

      try {
        if (first) return context.querySelector(_expression) || null;
        else nodes = context.querySelectorAll(_expression);
      } catch(e) {
        qsaFailExpCache[expression] = 1;
        break querySelector;
      } finally {
        if (!contextIsDocument){
          if (currentId) _context.setAttribute('id', currentId);
          else _context.removeAttribute('id');
          context = _context;
        }
      }

      if (this.starSelectsClosedQSA) for (i = 0; node = nodes[i++];){
        if (node.nodeName > '@' && !(hasOthers && uniques[this.getUID(node)])) found.push(node);
      } else for (i = 0; node = nodes[i++];){
        if (!(hasOthers && uniques[this.getUID(node)])) found.push(node);
      }

      if (hasOthers) this.sort(found);
      return found;

    }
    /*</query-selector-override>*/

    parsed = this.Slick.parse(expression);
    if (!parsed.length) return found;
  } else if (expression == null){ // there is no expression
    return found;
  } else if (expression.Slick){ // expression is a parsed Slick object
    parsed = expression;
  } else if (this.contains(context.documentElement || context, expression)){ // expression is a node
    (found) ? found.push(expression) : found = expression;
    return found;
  } else { // other junk
    return found;
  }

  /*<pseudo-selectors>*//*<nth-pseudo-selectors>*/

  // cache elements for the nth selectors

  this.posNTH = {};
  this.posNTHLast = {};
  this.posNTHType = {};
  this.posNTHTypeLast = {};

  /*</nth-pseudo-selectors>*//*</pseudo-selectors>*/

  // if append is null and there is only a single selector with one expression use pushArray, else use pushUID
  this.push = (!hasOthers && (first || (parsed.length == 1 && parsed.expressions[0].length == 1))) ? this.pushArray : this.pushUID;

  if (found == null) found = [];

  // default engine

  var j, m, n;
  var combinator, tag, id, classList, classes, attributes, pseudos;
  var currentItems, currentExpression, currentBit, lastBit, expressions = parsed.expressions;

  search: for (i = 0; (currentExpression = expressions[i]); i++) for (j = 0; (currentBit = currentExpression[j]); j++){

    combinator = 'combinator:' + currentBit.combinator;
    if (!this[combinator]) continue search;

    tag        = (this.isXMLDocument) ? currentBit.tag : currentBit.tag.toUpperCase();
    id         = currentBit.id;
    classList  = currentBit.classList;
    classes    = currentBit.classes;
    attributes = currentBit.attributes;
    pseudos    = currentBit.pseudos;
    lastBit    = (j === (currentExpression.length - 1));

    this.bitUniques = {};

    if (lastBit){
      this.uniques = uniques;
      this.found = found;
    } else {
      this.uniques = {};
      this.found = [];
    }

    if (j === 0){
      this[combinator](context, tag, id, classes, attributes, pseudos, classList);
      if (first && lastBit && found.length) break search;
    } else {
      if (first && lastBit) for (m = 0, n = currentItems.length; m < n; m++){
        this[combinator](currentItems[m], tag, id, classes, attributes, pseudos, classList);
        if (found.length) break search;
      } else for (m = 0, n = currentItems.length; m < n; m++) this[combinator](currentItems[m], tag, id, classes, attributes, pseudos, classList);
    }

    currentItems = this.found;
  }

  // should sort if there are nodes in append and if you pass multiple expressions.
  if (hasOthers || (parsed.expressions.length > 1)) this.sort(found);

  return (first) ? (found[0] || null) : found;
};

// Utils

local.uidx = 1;
local.uidk = 'slick-uniqueid';

local.getUIDXML = function(node){
  var uid = node.getAttribute(this.uidk);
  if (!uid){
    uid = this.uidx++;
    node.setAttribute(this.uidk, uid);
  }
  return uid;
};

local.getUIDHTML = function(node){
  return node.uniqueNumber || (node.uniqueNumber = this.uidx++);
};

// sort based on the setDocument documentSorter method.

local.sort = function(results){
  if (!this.documentSorter) return results;
  results.sort(this.documentSorter);
  return results;
};

/*<pseudo-selectors>*//*<nth-pseudo-selectors>*/

local.cacheNTH = {};

local.matchNTH = /^([+-]?\d*)?([a-z]+)?([+-]\d+)?$/;

local.parseNTHArgument = function(argument){
  var parsed = argument.match(this.matchNTH);
  if (!parsed) return false;
  var special = parsed[2] || false;
  var a = parsed[1] || 1;
  if (a == '-') a = -1;
  var b = +parsed[3] || 0;
  parsed =
    (special == 'n')  ? {a: a, b: b} :
    (special == 'odd')  ? {a: 2, b: 1} :
    (special == 'even') ? {a: 2, b: 0} : {a: 0, b: a};

  return (this.cacheNTH[argument] = parsed);
};

local.createNTHPseudo = function(child, sibling, positions, ofType){
  return function(node, argument){
    var uid = this.getUID(node);
    if (!this[positions][uid]){
      var parent = node.parentNode;
      if (!parent) return false;
      var el = parent[child], count = 1;
      if (ofType){
        var nodeName = node.nodeName;
        do {
          if (el.nodeName != nodeName) continue;
          this[positions][this.getUID(el)] = count++;
        } while ((el = el[sibling]));
      } else {
        do {
          if (el.nodeType != 1) continue;
          this[positions][this.getUID(el)] = count++;
        } while ((el = el[sibling]));
      }
    }
    argument = argument || 'n';
    var parsed = this.cacheNTH[argument] || this.parseNTHArgument(argument);
    if (!parsed) return false;
    var a = parsed.a, b = parsed.b, pos = this[positions][uid];
    if (a == 0) return b == pos;
    if (a > 0){
      if (pos < b) return false;
    } else {
      if (b < pos) return false;
    }
    return ((pos - b) % a) == 0;
  };
};

/*</nth-pseudo-selectors>*//*</pseudo-selectors>*/

local.pushArray = function(node, tag, id, classes, attributes, pseudos){
  if (this.matchSelector(node, tag, id, classes, attributes, pseudos)) this.found.push(node);
};

local.pushUID = function(node, tag, id, classes, attributes, pseudos){
  var uid = this.getUID(node);
  if (!this.uniques[uid] && this.matchSelector(node, tag, id, classes, attributes, pseudos)){
    this.uniques[uid] = true;
    this.found.push(node);
  }
};

local.matchNode = function(node, selector){
  if (this.isHTMLDocument && this.nativeMatchesSelector){
    try {
      return this.nativeMatchesSelector.call(node, selector.replace(/\[([^=]+)=\s*([^'"\]]+?)\s*\]/g, '[$1="$2"]'));
    } catch(matchError) {}
  }

  var parsed = this.Slick.parse(selector);
  if (!parsed) return true;

  // simple (single) selectors
  var expressions = parsed.expressions, simpleExpCounter = 0, i;
  for (i = 0; (currentExpression = expressions[i]); i++){
    if (currentExpression.length == 1){
      var exp = currentExpression[0];
      if (this.matchSelector(node, (this.isXMLDocument) ? exp.tag : exp.tag.toUpperCase(), exp.id, exp.classes, exp.attributes, exp.pseudos)) return true;
      simpleExpCounter++;
    }
  }

  if (simpleExpCounter == parsed.length) return false;

  var nodes = this.search(this.document, parsed), item;
  for (i = 0; item = nodes[i++];){
    if (item === node) return true;
  }
  return false;
};

local.matchPseudo = function(node, name, argument){
  var pseudoName = 'pseudo:' + name;
  if (this[pseudoName]) return this[pseudoName](node, argument);
  var attribute = this.getAttribute(node, name);
  return (argument) ? argument == attribute : !!attribute;
};

local.matchSelector = function(node, tag, id, classes, attributes, pseudos){
  if (tag){
    var nodeName = (this.isXMLDocument) ? node.nodeName : node.nodeName.toUpperCase();
    if (tag == '*'){
      if (nodeName < '@') return false; // Fix for comment nodes and closed nodes
    } else {
      if (nodeName != tag) return false;
    }
  }

  if (id && node.getAttribute('id') != id) return false;

  var i, part, cls;
  if (classes) for (i = classes.length; i--;){
    cls = this.getAttribute(node, 'class');
    if (!(cls && classes[i].regexp.test(cls))) return false;
  }
  if (attributes) for (i = attributes.length; i--;){
    part = attributes[i];
    if (part.operator ? !part.test(this.getAttribute(node, part.key)) : !this.hasAttribute(node, part.key)) return false;
  }
  if (pseudos) for (i = pseudos.length; i--;){
    part = pseudos[i];
    if (!this.matchPseudo(node, part.key, part.value)) return false;
  }
  return true;
};

var combinators = {

  ' ': function(node, tag, id, classes, attributes, pseudos, classList){ // all child nodes, any level

    var i, item, children;

    if (this.isHTMLDocument){
      getById: if (id){
        item = this.document.getElementById(id);
        if ((!item && node.all) || (this.idGetsName && item && item.getAttributeNode('id').nodeValue != id)){
          // all[id] returns all the elements with that name or id inside node
          // if theres just one it will return the element, else it will be a collection
          children = node.all[id];
          if (!children) return;
          if (!children[0]) children = [children];
          for (i = 0; item = children[i++];){
            var idNode = item.getAttributeNode('id');
            if (idNode && idNode.nodeValue == id){
              this.push(item, tag, null, classes, attributes, pseudos);
              break;
            }
          }
          return;
        }
        if (!item){
          // if the context is in the dom we return, else we will try GEBTN, breaking the getById label
          if (this.contains(this.root, node)) return;
          else break getById;
        } else if (this.document !== node && !this.contains(node, item)) return;
        this.push(item, tag, null, classes, attributes, pseudos);
        return;
      }
      getByClass: if (classes && node.getElementsByClassName && !this.brokenGEBCN){
        children = node.getElementsByClassName(classList.join(' '));
        if (!(children && children.length)) break getByClass;
        for (i = 0; item = children[i++];) this.push(item, tag, id, null, attributes, pseudos);
        return;
      }
    }
    getByTag: {
      children = node.getElementsByTagName(tag);
      if (!(children && children.length)) break getByTag;
      if (!this.brokenStarGEBTN) tag = null;
      for (i = 0; item = children[i++];) this.push(item, tag, id, classes, attributes, pseudos);
    }
  },

  '>': function(node, tag, id, classes, attributes, pseudos){ // direct children
    if ((node = node.firstChild)) do {
      if (node.nodeType == 1) this.push(node, tag, id, classes, attributes, pseudos);
    } while ((node = node.nextSibling));
  },

  '+': function(node, tag, id, classes, attributes, pseudos){ // next sibling
    while ((node = node.nextSibling)) if (node.nodeType == 1){
      this.push(node, tag, id, classes, attributes, pseudos);
      break;
    }
  },

  '^': function(node, tag, id, classes, attributes, pseudos){ // first child
    node = node.firstChild;
    if (node){
      if (node.nodeType == 1) this.push(node, tag, id, classes, attributes, pseudos);
      else this['combinator:+'](node, tag, id, classes, attributes, pseudos);
    }
  },

  '~': function(node, tag, id, classes, attributes, pseudos){ // next siblings
    while ((node = node.nextSibling)){
      if (node.nodeType != 1) continue;
      var uid = this.getUID(node);
      if (this.bitUniques[uid]) break;
      this.bitUniques[uid] = true;
      this.push(node, tag, id, classes, attributes, pseudos);
    }
  },

  '++': function(node, tag, id, classes, attributes, pseudos){ // next sibling and previous sibling
    this['combinator:+'](node, tag, id, classes, attributes, pseudos);
    this['combinator:!+'](node, tag, id, classes, attributes, pseudos);
  },

  '~~': function(node, tag, id, classes, attributes, pseudos){ // next siblings and previous siblings
    this['combinator:~'](node, tag, id, classes, attributes, pseudos);
    this['combinator:!~'](node, tag, id, classes, attributes, pseudos);
  },

  '!': function(node, tag, id, classes, attributes, pseudos){ // all parent nodes up to document
    while ((node = node.parentNode)) if (node !== this.document) this.push(node, tag, id, classes, attributes, pseudos);
  },

  '!>': function(node, tag, id, classes, attributes, pseudos){ // direct parent (one level)
    node = node.parentNode;
    if (node !== this.document) this.push(node, tag, id, classes, attributes, pseudos);
  },

  '!+': function(node, tag, id, classes, attributes, pseudos){ // previous sibling
    while ((node = node.previousSibling)) if (node.nodeType == 1){
      this.push(node, tag, id, classes, attributes, pseudos);
      break;
    }
  },

  '!^': function(node, tag, id, classes, attributes, pseudos){ // last child
    node = node.lastChild;
    if (node){
      if (node.nodeType == 1) this.push(node, tag, id, classes, attributes, pseudos);
      else this['combinator:!+'](node, tag, id, classes, attributes, pseudos);
    }
  },

  '!~': function(node, tag, id, classes, attributes, pseudos){ // previous siblings
    while ((node = node.previousSibling)){
      if (node.nodeType != 1) continue;
      var uid = this.getUID(node);
      if (this.bitUniques[uid]) break;
      this.bitUniques[uid] = true;
      this.push(node, tag, id, classes, attributes, pseudos);
    }
  }

};

for (var c in combinators) local['combinator:' + c] = combinators[c];

var pseudos = {

  /*<pseudo-selectors>*/

  'empty': function(node){
    var child = node.firstChild;
    return !(child && child.nodeType == 1) && !(node.innerText || node.textContent || '').length;
  },

  'not': function(node, expression){
    return !this.matchNode(node, expression);
  },

  'contains': function(node, text){
    return (node.innerText || node.textContent || '').indexOf(text) > -1;
  },

  'first-child': function(node){
    while ((node = node.previousSibling)) if (node.nodeType == 1) return false;
    return true;
  },

  'last-child': function(node){
    while ((node = node.nextSibling)) if (node.nodeType == 1) return false;
    return true;
  },

  'only-child': function(node){
    var prev = node;
    while ((prev = prev.previousSibling)) if (prev.nodeType == 1) return false;
    var next = node;
    while ((next = next.nextSibling)) if (next.nodeType == 1) return false;
    return true;
  },

  /*<nth-pseudo-selectors>*/

  'nth-child': local.createNTHPseudo('firstChild', 'nextSibling', 'posNTH'),

  'nth-last-child': local.createNTHPseudo('lastChild', 'previousSibling', 'posNTHLast'),

  'nth-of-type': local.createNTHPseudo('firstChild', 'nextSibling', 'posNTHType', true),

  'nth-last-of-type': local.createNTHPseudo('lastChild', 'previousSibling', 'posNTHTypeLast', true),

  'index': function(node, index){
    return this['pseudo:nth-child'](node, '' + (index + 1));
  },

  'even': function(node){
    return this['pseudo:nth-child'](node, '2n');
  },

  'odd': function(node){
    return this['pseudo:nth-child'](node, '2n+1');
  },

  /*</nth-pseudo-selectors>*/

  /*<of-type-pseudo-selectors>*/

  'first-of-type': function(node){
    var nodeName = node.nodeName;
    while ((node = node.previousSibling)) if (node.nodeName == nodeName) return false;
    return true;
  },

  'last-of-type': function(node){
    var nodeName = node.nodeName;
    while ((node = node.nextSibling)) if (node.nodeName == nodeName) return false;
    return true;
  },

  'only-of-type': function(node){
    var prev = node, nodeName = node.nodeName;
    while ((prev = prev.previousSibling)) if (prev.nodeName == nodeName) return false;
    var next = node;
    while ((next = next.nextSibling)) if (next.nodeName == nodeName) return false;
    return true;
  },

  /*</of-type-pseudo-selectors>*/

  // custom pseudos

  'enabled': function(node){
    return !node.disabled;
  },

  'disabled': function(node){
    return node.disabled;
  },

  'checked': function(node){
    return node.checked || node.selected;
  },

  'focus': function(node){
    return this.isHTMLDocument && this.document.activeElement === node && (node.href || node.type || this.hasAttribute(node, 'tabindex'));
  },

  'root': function(node){
    return (node === this.root);
  },

  'selected': function(node){
    return node.selected;
  }

  /*</pseudo-selectors>*/
};

for (var p in pseudos) local['pseudo:' + p] = pseudos[p];

// attributes methods

var attributeGetters = local.attributeGetters = {

  'for': function(){
    return ('htmlFor' in this) ? this.htmlFor : this.getAttribute('for');
  },

  'href': function(){
    return ('href' in this) ? this.getAttribute('href', 2) : this.getAttribute('href');
  },

  'style': function(){
    return (this.style) ? this.style.cssText : this.getAttribute('style');
  },

  'tabindex': function(){
    var attributeNode = this.getAttributeNode('tabindex');
    return (attributeNode && attributeNode.specified) ? attributeNode.nodeValue : null;
  },

  'type': function(){
    return this.getAttribute('type');
  },

  'maxlength': function(){
    var attributeNode = this.getAttributeNode('maxLength');
    return (attributeNode && attributeNode.specified) ? attributeNode.nodeValue : null;
  }

};

attributeGetters.MAXLENGTH = attributeGetters.maxLength = attributeGetters.maxlength;

// Slick

var Slick = local.Slick = (this.Slick || {});

Slick.version = '1.1.7';

// Slick finder

Slick.search = function(context, expression, append){
  return local.search(context, expression, append);
};

Slick.find = function(context, expression){
  return local.search(context, expression, null, true);
};

// Slick containment checker

Slick.contains = function(container, node){
  local.setDocument(container);
  return local.contains(container, node);
};

// Slick attribute getter

Slick.getAttribute = function(node, name){
  local.setDocument(node);
  return local.getAttribute(node, name);
};

Slick.hasAttribute = function(node, name){
  local.setDocument(node);
  return local.hasAttribute(node, name);
};

// Slick matcher

Slick.match = function(node, selector){
  if (!(node && selector)) return false;
  if (!selector || selector === node) return true;
  local.setDocument(node);
  return local.matchNode(node, selector);
};

// Slick attribute accessor

Slick.defineAttributeGetter = function(name, fn){
  local.attributeGetters[name] = fn;
  return this;
};

Slick.lookupAttributeGetter = function(name){
  return local.attributeGetters[name];
};

// Slick pseudo accessor

Slick.definePseudo = function(name, fn){
  local['pseudo:' + name] = function(node, argument){
    return fn.call(node, argument);
  };
  return this;
};

Slick.lookupPseudo = function(name){
  var pseudo = local['pseudo:' + name];
  if (pseudo) return function(argument){
    return pseudo.call(this, argument);
  };
  return null;
};

// Slick overrides accessor

Slick.override = function(regexp, fn){
  local.override(regexp, fn);
  return this;
};

Slick.isXML = local.isXML;

Slick.uidOf = function(node){
  return local.getUIDHTML(node);
};

if (!this.Slick) this.Slick = Slick;

}).apply(window);


/*
---

name: Element

description: One of the most important items in MooTools. Contains the dollar function, the dollars function, and an handful of cross-browser, time-saver methods to let you easily work with HTML Elements.

license: MIT-style license.

requires: [Window, Document, Array, String, Function, Object, Number, Slick.Parser, Slick.Finder]

provides: [Element, Elements, $, $$, Iframe, Selectors]

...
*/

var Element = function(tag, props){
  var konstructor = Element.Constructors[tag];
  if (konstructor) return konstructor(props);
  if (typeof tag != 'string') return document.id(tag).set(props);

  if (!props) props = {};

  if (!(/^[\w-]+$/).test(tag)){
    var parsed = Slick.parse(tag).expressions[0][0];
    tag = (parsed.tag == '*') ? 'div' : parsed.tag;
    if (parsed.id && props.id == null) props.id = parsed.id;

    var attributes = parsed.attributes;
    if (attributes) for (var attr, i = 0, l = attributes.length; i < l; i++){
      attr = attributes[i];
      if (props[attr.key] != null) continue;

      if (attr.value != null && attr.operator == '=') props[attr.key] = attr.value;
      else if (!attr.value && !attr.operator) props[attr.key] = true;
    }

    if (parsed.classList && props['class'] == null) props['class'] = parsed.classList.join(' ');
  }

  return document.newElement(tag, props);
};


if (Browser.Element){
  Element.prototype = Browser.Element.prototype;
  // IE8 and IE9 require the wrapping.
  Element.prototype._fireEvent = (function(fireEvent){
    return function(type, event){
      return fireEvent.call(this, type, event);
    };
  })(Element.prototype.fireEvent);
}

new Type('Element', Element).mirror(function(name){
  if (Array.prototype[name]) return;

  var obj = {};
  obj[name] = function(){
    var results = [], args = arguments, elements = true;
    for (var i = 0, l = this.length; i < l; i++){
      var element = this[i], result = results[i] = element[name].apply(element, args);
      elements = (elements && typeOf(result) == 'element');
    }
    return (elements) ? new Elements(results) : results;
  };

  Elements.implement(obj);
});

if (!Browser.Element){
  Element.parent = Object;

  Element.Prototype = {
    '$constructor': Element,
    '$family': Function.from('element').hide()
  };

  Element.mirror(function(name, method){
    Element.Prototype[name] = method;
  });
}

Element.Constructors = {};



var IFrame = new Type('IFrame', function(){
  var params = Array.link(arguments, {
    properties: Type.isObject,
    iframe: function(obj){
      return (obj != null);
    }
  });

  var props = params.properties || {}, iframe;
  if (params.iframe) iframe = document.id(params.iframe);
  var onload = props.onload || function(){};
  delete props.onload;
  props.id = props.name = [props.id, props.name, iframe ? (iframe.id || iframe.name) : 'IFrame_' + String.uniqueID()].pick();
  iframe = new Element(iframe || 'iframe', props);

  var onLoad = function(){
    onload.call(iframe.contentWindow);
  };

  if (window.frames[props.id]) onLoad();
  else iframe.addListener('load', onLoad);
  return iframe;
});

var Elements = this.Elements = function(nodes){
  if (nodes && nodes.length){
    var uniques = {}, node;
    for (var i = 0; node = nodes[i++];){
      var uid = Slick.uidOf(node);
      if (!uniques[uid]){
        uniques[uid] = true;
        this.push(node);
      }
    }
  }
};

Elements.prototype = {length: 0};
Elements.parent = Array;

new Type('Elements', Elements).implement({

  filter: function(filter, bind){
    if (!filter) return this;
    return new Elements(Array.filter(this, (typeOf(filter) == 'string') ? function(item){
      return item.match(filter);
    } : filter, bind));
  }.protect(),

  push: function(){
    var length = this.length;
    for (var i = 0, l = arguments.length; i < l; i++){
      var item = document.id(arguments[i]);
      if (item) this[length++] = item;
    }
    return (this.length = length);
  }.protect(),

  unshift: function(){
    var items = [];
    for (var i = 0, l = arguments.length; i < l; i++){
      var item = document.id(arguments[i]);
      if (item) items.push(item);
    }
    return Array.prototype.unshift.apply(this, items);
  }.protect(),

  concat: function(){
    var newElements = new Elements(this);
    for (var i = 0, l = arguments.length; i < l; i++){
      var item = arguments[i];
      if (Type.isEnumerable(item)) newElements.append(item);
      else newElements.push(item);
    }
    return newElements;
  }.protect(),

  append: function(collection){
    for (var i = 0, l = collection.length; i < l; i++) this.push(collection[i]);
    return this;
  }.protect(),

  empty: function(){
    while (this.length) delete this[--this.length];
    return this;
  }.protect()

});



(function(){

// FF, IE
var splice = Array.prototype.splice, object = {'0': 0, '1': 1, length: 2};

splice.call(object, 1, 1);
if (object[1] == 1) Elements.implement('splice', function(){
  var length = this.length;
  var result = splice.apply(this, arguments);
  while (length >= this.length) delete this[length--];
  return result;
}.protect());

Array.forEachMethod(function(method, name){
  Elements.implement(name, method);
});

Array.mirror(Elements);

/*<ltIE8>*/
var createElementAcceptsHTML;
try {
    createElementAcceptsHTML = (document.createElement('<input name=x>').name == 'x');
} catch (e){}

var escapeQuotes = function(html){
  return ('' + html).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
};
/*</ltIE8>*/

Document.implement({

  newElement: function(tag, props){
    if (props && props.checked != null) props.defaultChecked = props.checked;
    /*<ltIE8>*/// Fix for readonly name and type properties in IE < 8
    if (createElementAcceptsHTML && props){
      tag = '<' + tag;
      if (props.name) tag += ' name="' + escapeQuotes(props.name) + '"';
      if (props.type) tag += ' type="' + escapeQuotes(props.type) + '"';
      tag += '>';
      delete props.name;
      delete props.type;
    }
    /*</ltIE8>*/
    return this.id(this.createElement(tag)).set(props);
  }

});

})();

(function(){

Slick.uidOf(window);
Slick.uidOf(document);

Document.implement({

  newTextNode: function(text){
    return this.createTextNode(text);
  },

  getDocument: function(){
    return this;
  },

  getWindow: function(){
    return this.window;
  },

  id: (function(){

    var types = {

      string: function(id, nocash, doc){
        id = Slick.find(doc, '#' + id.replace(/(\W)/g, '\\$1'));
        return (id) ? types.element(id, nocash) : null;
      },

      element: function(el, nocash){
        Slick.uidOf(el);
        if (!nocash && !el.$family && !(/^(?:object|embed)$/i).test(el.tagName)){
          var fireEvent = el.fireEvent;
          // wrapping needed in IE7, or else crash
          el._fireEvent = function(type, event){
            return fireEvent(type, event);
          };
          Object.append(el, Element.Prototype);
        }
        return el;
      },

      object: function(obj, nocash, doc){
        if (obj.toElement) return types.element(obj.toElement(doc), nocash);
        return null;
      }

    };

    types.textnode = types.whitespace = types.window = types.document = function(zero){
      return zero;
    };

    return function(el, nocash, doc){
      if (el && el.$family && el.uniqueNumber) return el;
      var type = typeOf(el);
      return (types[type]) ? types[type](el, nocash, doc || document) : null;
    };

  })()

});

if (window.$ == null) Window.implement('$', function(el, nc){
  return document.id(el, nc, this.document);
});

Window.implement({

  getDocument: function(){
    return this.document;
  },

  getWindow: function(){
    return this;
  }

});

[Document, Element].invoke('implement', {

  getElements: function(expression){
    return Slick.search(this, expression, new Elements);
  },

  getElement: function(expression){
    return document.id(Slick.find(this, expression));
  }

});

var contains = {contains: function(element){
  return Slick.contains(this, element);
}};

if (!document.contains) Document.implement(contains);
if (!document.createElement('div').contains) Element.implement(contains);



// tree walking

var injectCombinator = function(expression, combinator){
  if (!expression) return combinator;

  expression = Object.clone(Slick.parse(expression));

  var expressions = expression.expressions;
  for (var i = expressions.length; i--;)
    expressions[i][0].combinator = combinator;

  return expression;
};

Object.forEach({
  getNext: '~',
  getPrevious: '!~',
  getParent: '!'
}, function(combinator, method){
  Element.implement(method, function(expression){
    return this.getElement(injectCombinator(expression, combinator));
  });
});

Object.forEach({
  getAllNext: '~',
  getAllPrevious: '!~',
  getSiblings: '~~',
  getChildren: '>',
  getParents: '!'
}, function(combinator, method){
  Element.implement(method, function(expression){
    return this.getElements(injectCombinator(expression, combinator));
  });
});

Element.implement({

  getFirst: function(expression){
    return document.id(Slick.search(this, injectCombinator(expression, '>'))[0]);
  },

  getLast: function(expression){
    return document.id(Slick.search(this, injectCombinator(expression, '>')).getLast());
  },

  getWindow: function(){
    return this.ownerDocument.window;
  },

  getDocument: function(){
    return this.ownerDocument;
  },

  getElementById: function(id){
    return document.id(Slick.find(this, '#' + ('' + id).replace(/(\W)/g, '\\$1')));
  },

  match: function(expression){
    return !expression || Slick.match(this, expression);
  }

});



if (window.$$ == null) Window.implement('$$', function(selector){
  if (arguments.length == 1){
    if (typeof selector == 'string') return Slick.search(this.document, selector, new Elements);
    else if (Type.isEnumerable(selector)) return new Elements(selector);
  }
  return new Elements(arguments);
});

// Inserters

var inserters = {

  before: function(context, element){
    var parent = element.parentNode;
    if (parent) parent.insertBefore(context, element);
  },

  after: function(context, element){
    var parent = element.parentNode;
    if (parent) parent.insertBefore(context, element.nextSibling);
  },

  bottom: function(context, element){
    element.appendChild(context);
  },

  top: function(context, element){
    element.insertBefore(context, element.firstChild);
  }

};

inserters.inside = inserters.bottom;



// getProperty / setProperty

var propertyGetters = {}, propertySetters = {};

// properties

var properties = {};
Array.forEach([
  'type', 'value', 'defaultValue', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan',
  'frameBorder', 'rowSpan', 'tabIndex', 'useMap'
], function(property){
  properties[property.toLowerCase()] = property;
});

properties.html = 'innerHTML';
properties.text = (document.createElement('div').textContent == null) ? 'innerText': 'textContent';

Object.forEach(properties, function(real, key){
  propertySetters[key] = function(node, value){
    node[real] = value;
  };
  propertyGetters[key] = function(node){
    return node[real];
  };
});

// Booleans

var bools = [
  'compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked',
  'disabled', 'readOnly', 'multiple', 'selected', 'noresize',
  'defer', 'defaultChecked', 'autofocus', 'controls', 'autoplay',
  'loop'
];

var booleans = {};
Array.forEach(bools, function(bool){
  var lower = bool.toLowerCase();
  booleans[lower] = bool;
  propertySetters[lower] = function(node, value){
    node[bool] = !!value;
  };
  propertyGetters[lower] = function(node){
    return !!node[bool];
  };
});

// Special cases

Object.append(propertySetters, {

  'class': function(node, value){
    ('className' in node) ? node.className = (value || '') : node.setAttribute('class', value);
  },

  'for': function(node, value){
    ('htmlFor' in node) ? node.htmlFor = value : node.setAttribute('for', value);
  },

  'style': function(node, value){
    (node.style) ? node.style.cssText = value : node.setAttribute('style', value);
  },

  'value': function(node, value){
    node.value = (value != null) ? value : '';
  }

});

propertyGetters['class'] = function(node){
  return ('className' in node) ? node.className || null : node.getAttribute('class');
};

/* <webkit> */
var el = document.createElement('button');
// IE sets type as readonly and throws
try { el.type = 'button'; } catch(e){}
if (el.type != 'button') propertySetters.type = function(node, value){
  node.setAttribute('type', value);
};
el = null;
/* </webkit> */

/*<IE>*/
var input = document.createElement('input');
input.value = 't';
input.type = 'submit';
if (input.value != 't') propertySetters.type = function(node, type){
  var value = node.value;
  node.type = type;
  node.value = value;
};
input = null;
/*</IE>*/

/* getProperty, setProperty */

/* <ltIE9> */
var pollutesGetAttribute = (function(div){
  div.random = 'attribute';
  return (div.getAttribute('random') == 'attribute');
})(document.createElement('div'));

/* <ltIE9> */

Element.implement({

  setProperty: function(name, value){
    var setter = propertySetters[name.toLowerCase()];
    if (setter){
      setter(this, value);
    } else {
      /* <ltIE9> */
      if (pollutesGetAttribute) var attributeWhiteList = this.retrieve('$attributeWhiteList', {});
      /* </ltIE9> */

      if (value == null){
        this.removeAttribute(name);
        /* <ltIE9> */
        if (pollutesGetAttribute) delete attributeWhiteList[name];
        /* </ltIE9> */
      } else {
        this.setAttribute(name, '' + value);
        /* <ltIE9> */
        if (pollutesGetAttribute) attributeWhiteList[name] = true;
        /* </ltIE9> */
      }
    }
    return this;
  },

  setProperties: function(attributes){
    for (var attribute in attributes) this.setProperty(attribute, attributes[attribute]);
    return this;
  },

  getProperty: function(name){
    var getter = propertyGetters[name.toLowerCase()];
    if (getter) return getter(this);
    /* <ltIE9> */
    if (pollutesGetAttribute){
      var attr = this.getAttributeNode(name), attributeWhiteList = this.retrieve('$attributeWhiteList', {});
      if (!attr) return null;
      if (attr.expando && !attributeWhiteList[name]){
        var outer = this.outerHTML;
        // segment by the opening tag and find mention of attribute name
        if (outer.substr(0, outer.search(/\/?['"]?>(?![^<]*<['"])/)).indexOf(name) < 0) return null;
        attributeWhiteList[name] = true;
      }
    }
    /* </ltIE9> */
    var result = Slick.getAttribute(this, name);
    return (!result && !Slick.hasAttribute(this, name)) ? null : result;
  },

  getProperties: function(){
    var args = Array.from(arguments);
    return args.map(this.getProperty, this).associate(args);
  },

  removeProperty: function(name){
    return this.setProperty(name, null);
  },

  removeProperties: function(){
    Array.each(arguments, this.removeProperty, this);
    return this;
  },

  set: function(prop, value){
    var property = Element.Properties[prop];
    (property && property.set) ? property.set.call(this, value) : this.setProperty(prop, value);
  }.overloadSetter(),

  get: function(prop){
    var property = Element.Properties[prop];
    return (property && property.get) ? property.get.apply(this) : this.getProperty(prop);
  }.overloadGetter(),

  erase: function(prop){
    var property = Element.Properties[prop];
    (property && property.erase) ? property.erase.apply(this) : this.removeProperty(prop);
    return this;
  },

  hasClass: function(className){
    return this.className.clean().contains(className, ' ');
  },

  addClass: function(className){
    if (!this.hasClass(className)) this.className = (this.className + ' ' + className).clean();
    return this;
  },

  removeClass: function(className){
    this.className = this.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
    return this;
  },

  toggleClass: function(className, force){
    if (force == null) force = !this.hasClass(className);
    return (force) ? this.addClass(className) : this.removeClass(className);
  },

  adopt: function(){
    var parent = this, fragment, elements = Array.flatten(arguments), length = elements.length;
    if (length > 1) parent = fragment = document.createDocumentFragment();

    for (var i = 0; i < length; i++){
      var element = document.id(elements[i], true);
      if (element) parent.appendChild(element);
    }

    if (fragment) this.appendChild(fragment);

    return this;
  },

  appendText: function(text, where){
    return this.grab(this.getDocument().newTextNode(text), where);
  },

  grab: function(el, where){
    inserters[where || 'bottom'](document.id(el, true), this);
    return this;
  },

  inject: function(el, where){
    inserters[where || 'bottom'](this, document.id(el, true));
    return this;
  },

  replaces: function(el){
    el = document.id(el, true);
    el.parentNode.replaceChild(this, el);
    return this;
  },

  wraps: function(el, where){
    el = document.id(el, true);
    return this.replaces(el).grab(el, where);
  },

  getSelected: function(){
    this.selectedIndex; // Safari 3.2.1
    return new Elements(Array.from(this.options).filter(function(option){
      return option.selected;
    }));
  },

  toQueryString: function(){
    var queryString = [];
    this.getElements('input, select, textarea').each(function(el){
      var type = el.type;
      if (!el.name || el.disabled || type == 'submit' || type == 'reset' || type == 'file' || type == 'image') return;

      var value = (el.get('tag') == 'select') ? el.getSelected().map(function(opt){
        // IE
        return document.id(opt).get('value');
      }) : ((type == 'radio' || type == 'checkbox') && !el.checked) ? null : el.get('value');

      Array.from(value).each(function(val){
        if (typeof val != 'undefined') queryString.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(val));
      });
    });
    return queryString.join('&');
  }

});

var collected = {}, storage = {};

var get = function(uid){
  return (storage[uid] || (storage[uid] = {}));
};

var clean = function(item){
  var uid = item.uniqueNumber;
  if (item.removeEvents) item.removeEvents();
  if (item.clearAttributes) item.clearAttributes();
  if (uid != null){
    delete collected[uid];
    delete storage[uid];
  }
  return item;
};

var formProps = {input: 'checked', option: 'selected', textarea: 'value'};

Element.implement({

  destroy: function(){
    var children = clean(this).getElementsByTagName('*');
    Array.each(children, clean);
    Element.dispose(this);
    return null;
  },

  empty: function(){
    Array.from(this.childNodes).each(Element.dispose);
    return this;
  },

  dispose: function(){
    return (this.parentNode) ? this.parentNode.removeChild(this) : this;
  },

  clone: function(contents, keepid){
    contents = contents !== false;
    var clone = this.cloneNode(contents), ce = [clone], te = [this], i;

    if (contents){
      ce.append(Array.from(clone.getElementsByTagName('*')));
      te.append(Array.from(this.getElementsByTagName('*')));
    }

    for (i = ce.length; i--;){
      var node = ce[i], element = te[i];
      if (!keepid) node.removeAttribute('id');
      /*<ltIE9>*/
      if (node.clearAttributes){
        node.clearAttributes();
        node.mergeAttributes(element);
        node.removeAttribute('uniqueNumber');
        if (node.options){
          var no = node.options, eo = element.options;
          for (var j = no.length; j--;) no[j].selected = eo[j].selected;
        }
      }
      /*</ltIE9>*/
      var prop = formProps[element.tagName.toLowerCase()];
      if (prop && element[prop]) node[prop] = element[prop];
    }

    /*<ltIE9>*/
    if (Browser.ie){
      var co = clone.getElementsByTagName('object'), to = this.getElementsByTagName('object');
      for (i = co.length; i--;) co[i].outerHTML = to[i].outerHTML;
    }
    /*</ltIE9>*/
    return document.id(clone);
  }

});

[Element, Window, Document].invoke('implement', {

  addListener: function(type, fn){
    if (type == 'unload'){
      var old = fn, self = this;
      fn = function(){
        self.removeListener('unload', fn);
        old();
      };
    } else {
      collected[Slick.uidOf(this)] = this;
    }
    if (this.addEventListener) this.addEventListener(type, fn, !!arguments[2]);
    else this.attachEvent('on' + type, fn);
    return this;
  },

  removeListener: function(type, fn){
    if (this.removeEventListener) this.removeEventListener(type, fn, !!arguments[2]);
    else this.detachEvent('on' + type, fn);
    return this;
  },

  retrieve: function(property, dflt){
    var storage = get(Slick.uidOf(this)), prop = storage[property];
    if (dflt != null && prop == null) prop = storage[property] = dflt;
    return prop != null ? prop : null;
  },

  store: function(property, value){
    var storage = get(Slick.uidOf(this));
    storage[property] = value;
    return this;
  },

  eliminate: function(property){
    var storage = get(Slick.uidOf(this));
    delete storage[property];
    return this;
  }

});

/*<ltIE9>*/
if (window.attachEvent && !window.addEventListener) window.addListener('unload', function(){
  Object.each(collected, clean);
  if (window.CollectGarbage) CollectGarbage();
});
/*</ltIE9>*/

Element.Properties = {};



Element.Properties.style = {

  set: function(style){
    this.style.cssText = style;
  },

  get: function(){
    return this.style.cssText;
  },

  erase: function(){
    this.style.cssText = '';
  }

};

Element.Properties.tag = {

  get: function(){
    return this.tagName.toLowerCase();
  }

};

Element.Properties.html = {

  set: function(html){
    if (html == null) html = '';
    else if (typeOf(html) == 'array') html = html.join('');
    this.innerHTML = html;
  },

  erase: function(){
    this.innerHTML = '';
  }

};

/*<ltIE9>*/
// technique by jdbarlett - http://jdbartlett.com/innershiv/
var div = document.createElement('div');
div.innerHTML = '<nav></nav>';
var supportsHTML5Elements = (div.childNodes.length == 1);
if (!supportsHTML5Elements){
  var tags = 'abbr article aside audio canvas datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video'.split(' '),
    fragment = document.createDocumentFragment(), l = tags.length;
  while (l--) fragment.createElement(tags[l]);
}
div = null;
/*</ltIE9>*/

/*<IE>*/
var supportsTableInnerHTML = Function.attempt(function(){
  var table = document.createElement('table');
  table.innerHTML = '<tr><td></td></tr>';
  return true;
});

/*<ltFF4>*/
var tr = document.createElement('tr'), html = '<td></td>';
tr.innerHTML = html;
var supportsTRInnerHTML = (tr.innerHTML == html);
tr = null;
/*</ltFF4>*/

if (!supportsTableInnerHTML || !supportsTRInnerHTML || !supportsHTML5Elements){

  Element.Properties.html.set = (function(set){

    var translations = {
      table: [1, '<table>', '</table>'],
      select: [1, '<select>', '</select>'],
      tbody: [2, '<table><tbody>', '</tbody></table>'],
      tr: [3, '<table><tbody><tr>', '</tr></tbody></table>']
    };

    translations.thead = translations.tfoot = translations.tbody;

    return function(html){
      var wrap = translations[this.get('tag')];
      if (!wrap && !supportsHTML5Elements) wrap = [0, '', ''];
      if (!wrap) return set.call(this, html);

      var level = wrap[0], wrapper = document.createElement('div'), target = wrapper;
      if (!supportsHTML5Elements) fragment.appendChild(wrapper);
      wrapper.innerHTML = [wrap[1], html, wrap[2]].flatten().join('');
      while (level--) target = target.firstChild;
      this.empty().adopt(target.childNodes);
      if (!supportsHTML5Elements) fragment.removeChild(wrapper);
      wrapper = null;
    };

  })(Element.Properties.html.set);
}
/*</IE>*/

/*<ltIE9>*/
var testForm = document.createElement('form');
testForm.innerHTML = '<select><option>s</option></select>';

if (testForm.firstChild.value != 's') Element.Properties.value = {

  set: function(value){
    var tag = this.get('tag');
    if (tag != 'select') return this.setProperty('value', value);
    var options = this.getElements('option');
    for (var i = 0; i < options.length; i++){
      var option = options[i],
        attr = option.getAttributeNode('value'),
        optionValue = (attr && attr.specified) ? option.value : option.get('text');
      if (optionValue == value) return option.selected = true;
    }
  },

  get: function(){
    var option = this, tag = option.get('tag');

    if (tag != 'select' && tag != 'option') return this.getProperty('value');

    if (tag == 'select' && !(option = option.getSelected()[0])) return '';

    var attr = option.getAttributeNode('value');
    return (attr && attr.specified) ? option.value : option.get('text');
  }

};
testForm = null;
/*</ltIE9>*/

/*<IE>*/
if (document.createElement('div').getAttributeNode('id')) Element.Properties.id = {
  set: function(id){
    this.id = this.getAttributeNode('id').value = id;
  },
  get: function(){
    return this.id || null;
  },
  erase: function(){
    this.id = this.getAttributeNode('id').value = '';
  }
};
/*</IE>*/

})();


/*
---

name: Element.Style

description: Contains methods for interacting with the styles of Elements in a fashionable way.

license: MIT-style license.

requires: Element

provides: Element.Style

...
*/

(function(){

var html = document.html;

//<ltIE9>
// Check for oldIE, which does not remove styles when they're set to null
var el = document.createElement('div');
el.style.color = 'red';
el.style.color = null;
var doesNotRemoveStyles = el.style.color == 'red';
el = null;
//</ltIE9>

Element.Properties.styles = {set: function(styles){
  this.setStyles(styles);
}};

var hasOpacity = (html.style.opacity != null),
  hasFilter = (html.style.filter != null),
  reAlpha = /alpha\(opacity=([\d.]+)\)/i;

var setVisibility = function(element, opacity){
  element.store('$opacity', opacity);
  element.style.visibility = opacity > 0 || opacity == null ? 'visible' : 'hidden';
};

var setOpacity = (hasOpacity ? function(element, opacity){
  element.style.opacity = opacity;
} : (hasFilter ? function(element, opacity){
  var style = element.style;
  if (!element.currentStyle || !element.currentStyle.hasLayout) style.zoom = 1;
  if (opacity == null || opacity == 1) opacity = '';
  else opacity = 'alpha(opacity=' + (opacity * 100).limit(0, 100).round() + ')';
  var filter = style.filter || element.getComputedStyle('filter') || '';
  style.filter = reAlpha.test(filter) ? filter.replace(reAlpha, opacity) : filter + opacity;
  if (!style.filter) style.removeAttribute('filter');
} : setVisibility));

var getOpacity = (hasOpacity ? function(element){
  var opacity = element.style.opacity || element.getComputedStyle('opacity');
  return (opacity == '') ? 1 : opacity.toFloat();
} : (hasFilter ? function(element){
  var filter = (element.style.filter || element.getComputedStyle('filter')),
    opacity;
  if (filter) opacity = filter.match(reAlpha);
  return (opacity == null || filter == null) ? 1 : (opacity[1] / 100);
} : function(element){
  var opacity = element.retrieve('$opacity');
  if (opacity == null) opacity = (element.style.visibility == 'hidden' ? 0 : 1);
  return opacity;
}));

var floatName = (html.style.cssFloat == null) ? 'styleFloat' : 'cssFloat';

Element.implement({

  getComputedStyle: function(property){
    if (this.currentStyle) return this.currentStyle[property.camelCase()];
    var defaultView = Element.getDocument(this).defaultView,
      computed = defaultView ? defaultView.getComputedStyle(this, null) : null;
    return (computed) ? computed.getPropertyValue((property == floatName) ? 'float' : property.hyphenate()) : null;
  },

  setStyle: function(property, value){
    if (property == 'opacity'){
      if (value != null) value = parseFloat(value);
      setOpacity(this, value);
      return this;
    }
    property = (property == 'float' ? floatName : property).camelCase();
    if (typeOf(value) != 'string'){
      var map = (Element.Styles[property] || '@').split(' ');
      value = Array.from(value).map(function(val, i){
        if (!map[i]) return '';
        return (typeOf(val) == 'number') ? map[i].replace('@', Math.round(val)) : val;
      }).join(' ');
    } else if (value == String(Number(value))){
      value = Math.round(value);
    }
    this.style[property] = value;
    //<ltIE9>
    if ((value == '' || value == null) && doesNotRemoveStyles && this.style.removeAttribute){
      this.style.removeAttribute(property);
    }
    //</ltIE9>
    return this;
  },

  getStyle: function(property){
    if (property == 'opacity') return getOpacity(this);
    property = (property == 'float' ? floatName : property).camelCase();
    var result = this.style[property];
    if (!result || property == 'zIndex'){
      result = [];
      for (var style in Element.ShortStyles){
        if (property != style) continue;
        for (var s in Element.ShortStyles[style]) result.push(this.getStyle(s));
        return result.join(' ');
      }
      result = this.getComputedStyle(property);
    }
    if (result){
      result = String(result);
      var color = result.match(/rgba?\([\d\s,]+\)/);
      if (color) result = result.replace(color[0], color[0].rgbToHex());
    }
    if (Browser.opera || Browser.ie){
      if ((/^(height|width)$/).test(property) && !(/px$/.test(result))){
        var values = (property == 'width') ? ['left', 'right'] : ['top', 'bottom'], size = 0;
        values.each(function(value){
          size += this.getStyle('border-' + value + '-width').toInt() + this.getStyle('padding-' + value).toInt();
        }, this);
        return this['offset' + property.capitalize()] - size + 'px';
      }
      if (Browser.ie && (/^border(.+)Width|margin|padding/).test(property) && isNaN(parseFloat(result))){
        return '0px';
      }
    }
    return result;
  },

  setStyles: function(styles){
    for (var style in styles) this.setStyle(style, styles[style]);
    return this;
  },

  getStyles: function(){
    var result = {};
    Array.flatten(arguments).each(function(key){
      result[key] = this.getStyle(key);
    }, this);
    return result;
  }

});

Element.Styles = {
  left: '@px', top: '@px', bottom: '@px', right: '@px',
  width: '@px', height: '@px', maxWidth: '@px', maxHeight: '@px', minWidth: '@px', minHeight: '@px',
  backgroundColor: 'rgb(@, @, @)', backgroundPosition: '@px @px', color: 'rgb(@, @, @)',
  fontSize: '@px', letterSpacing: '@px', lineHeight: '@px', clip: 'rect(@px @px @px @px)',
  margin: '@px @px @px @px', padding: '@px @px @px @px', border: '@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)',
  borderWidth: '@px @px @px @px', borderStyle: '@ @ @ @', borderColor: 'rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)',
  zIndex: '@', 'zoom': '@', fontWeight: '@', textIndent: '@px', opacity: '@'
};





Element.ShortStyles = {margin: {}, padding: {}, border: {}, borderWidth: {}, borderStyle: {}, borderColor: {}};

['Top', 'Right', 'Bottom', 'Left'].each(function(direction){
  var Short = Element.ShortStyles;
  var All = Element.Styles;
  ['margin', 'padding'].each(function(style){
    var sd = style + direction;
    Short[style][sd] = All[sd] = '@px';
  });
  var bd = 'border' + direction;
  Short.border[bd] = All[bd] = '@px @ rgb(@, @, @)';
  var bdw = bd + 'Width', bds = bd + 'Style', bdc = bd + 'Color';
  Short[bd] = {};
  Short.borderWidth[bdw] = Short[bd][bdw] = All[bdw] = '@px';
  Short.borderStyle[bds] = Short[bd][bds] = All[bds] = '@';
  Short.borderColor[bdc] = Short[bd][bdc] = All[bdc] = 'rgb(@, @, @)';
});

})();


/*
---

name: Element.Event

description: Contains Element methods for dealing with events. This file also includes mouseenter and mouseleave custom Element Events, if necessary.

license: MIT-style license.

requires: [Element, Event]

provides: Element.Event

...
*/

(function(){

Element.Properties.events = {set: function(events){
  this.addEvents(events);
}};

[Element, Window, Document].invoke('implement', {

  addEvent: function(type, fn){
    var events = this.retrieve('events', {});
    if (!events[type]) events[type] = {keys: [], values: []};
    if (events[type].keys.contains(fn)) return this;
    events[type].keys.push(fn);
    var realType = type,
      custom = Element.Events[type],
      condition = fn,
      self = this;
    if (custom){
      if (custom.onAdd) custom.onAdd.call(this, fn, type);
      if (custom.condition){
        condition = function(event){
          if (custom.condition.call(this, event, type)) return fn.call(this, event);
          return true;
        };
      }
      if (custom.base) realType = Function.from(custom.base).call(this, type);
    }
    var defn = function(){
      return fn.call(self);
    };
    var nativeEvent = Element.NativeEvents[realType];
    if (nativeEvent){
      if (nativeEvent == 2){
        defn = function(event){
          event = new DOMEvent(event, self.getWindow());
          if (condition.call(self, event) === false) event.stop();
        };
      }
      this.addListener(realType, defn, arguments[2]);
    }
    events[type].values.push(defn);
    return this;
  },

  removeEvent: function(type, fn){
    var events = this.retrieve('events');
    if (!events || !events[type]) return this;
    var list = events[type];
    var index = list.keys.indexOf(fn);
    if (index == -1) return this;
    var value = list.values[index];
    delete list.keys[index];
    delete list.values[index];
    var custom = Element.Events[type];
    if (custom){
      if (custom.onRemove) custom.onRemove.call(this, fn, type);
      if (custom.base) type = Function.from(custom.base).call(this, type);
    }
    return (Element.NativeEvents[type]) ? this.removeListener(type, value, arguments[2]) : this;
  },

  addEvents: function(events){
    for (var event in events) this.addEvent(event, events[event]);
    return this;
  },

  removeEvents: function(events){
    var type;
    if (typeOf(events) == 'object'){
      for (type in events) this.removeEvent(type, events[type]);
      return this;
    }
    var attached = this.retrieve('events');
    if (!attached) return this;
    if (!events){
      for (type in attached) this.removeEvents(type);
      this.eliminate('events');
    } else if (attached[events]){
      attached[events].keys.each(function(fn){
        this.removeEvent(events, fn);
      }, this);
      delete attached[events];
    }
    return this;
  },

  fireEvent: function(type, args, delay){
    var events = this.retrieve('events');
    if (!events || !events[type]) return this;
    args = Array.from(args);

    events[type].keys.each(function(fn){
      if (delay) fn.delay(delay, this, args);
      else fn.apply(this, args);
    }, this);
    return this;
  },

  cloneEvents: function(from, type){
    from = document.id(from);
    var events = from.retrieve('events');
    if (!events) return this;
    if (!type){
      for (var eventType in events) this.cloneEvents(from, eventType);
    } else if (events[type]){
      events[type].keys.each(function(fn){
        this.addEvent(type, fn);
      }, this);
    }
    return this;
  }

});

Element.NativeEvents = {
  click: 2, dblclick: 2, mouseup: 2, mousedown: 2, contextmenu: 2, //mouse buttons
  mousewheel: 2, DOMMouseScroll: 2, //mouse wheel
  mouseover: 2, mouseout: 2, mousemove: 2, selectstart: 2, selectend: 2, //mouse movement
  keydown: 2, keypress: 2, keyup: 2, //keyboard
  orientationchange: 2, // mobile
  touchstart: 2, touchmove: 2, touchend: 2, touchcancel: 2, // touch
  gesturestart: 2, gesturechange: 2, gestureend: 2, // gesture
  focus: 2, blur: 2, change: 2, reset: 2, select: 2, submit: 2, paste: 2, input: 2, //form elements
  load: 2, unload: 1, beforeunload: 2, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
  error: 1, abort: 1, scroll: 1 //misc
};

Element.Events = {mousewheel: {
  base: (Browser.firefox) ? 'DOMMouseScroll' : 'mousewheel'
}};

if ('onmouseenter' in document.documentElement){
  Element.NativeEvents.mouseenter = Element.NativeEvents.mouseleave = 2;
} else {
  var check = function(event){
    var related = event.relatedTarget;
    if (related == null) return true;
    if (!related) return false;
    return (related != this && related.prefix != 'xul' && typeOf(this) != 'document' && !this.contains(related));
  };

  Element.Events.mouseenter = {
    base: 'mouseover',
    condition: check
  };

  Element.Events.mouseleave = {
    base: 'mouseout',
    condition: check
  };
}

/*<ltIE9>*/
if (!window.addEventListener){
  Element.NativeEvents.propertychange = 2;
  Element.Events.change = {
    base: function(){
      var type = this.type;
      return (this.get('tag') == 'input' && (type == 'radio' || type == 'checkbox')) ? 'propertychange' : 'change'
    },
    condition: function(event){
      return this.type != 'radio' || (event.event.propertyName == 'checked' && this.checked);
    }
  }
}
/*</ltIE9>*/



})();


/*
---

name: Element.Dimensions

description: Contains methods to work with size, scroll, or positioning of Elements and the window object.

license: MIT-style license.

credits:
  - Element positioning based on the [qooxdoo](http://qooxdoo.org/) code and smart browser fixes, [LGPL License](http://www.gnu.org/licenses/lgpl.html).
  - Viewport dimensions based on [YUI](http://developer.yahoo.com/yui/) code, [BSD License](http://developer.yahoo.com/yui/license.html).

requires: [Element, Element.Style]

provides: [Element.Dimensions]

...
*/

(function(){

var element = document.createElement('div'),
  child = document.createElement('div');
element.style.height = '0';
element.appendChild(child);
var brokenOffsetParent = (child.offsetParent === element);
element = child = null;

var isOffset = function(el){
  return styleString(el, 'position') != 'static' || isBody(el);
};

var isOffsetStatic = function(el){
  return isOffset(el) || (/^(?:table|td|th)$/i).test(el.tagName);
};

Element.implement({

  scrollTo: function(x, y){
    if (isBody(this)){
      this.getWindow().scrollTo(x, y);
    } else {
      this.scrollLeft = x;
      this.scrollTop = y;
    }
    return this;
  },

  getSize: function(){
    if (isBody(this)) return this.getWindow().getSize();
    return {x: this.offsetWidth, y: this.offsetHeight};
  },

  getScrollSize: function(){
    if (isBody(this)) return this.getWindow().getScrollSize();
    return {x: this.scrollWidth, y: this.scrollHeight};
  },

  getScroll: function(){
    if (isBody(this)) return this.getWindow().getScroll();
    return {x: this.scrollLeft, y: this.scrollTop};
  },

  getScrolls: function(){
    var element = this.parentNode, position = {x: 0, y: 0};
    while (element && !isBody(element)){
      position.x += element.scrollLeft;
      position.y += element.scrollTop;
      element = element.parentNode;
    }
    return position;
  },

  getOffsetParent: brokenOffsetParent ? function(){
    var element = this;
    if (isBody(element) || styleString(element, 'position') == 'fixed') return null;

    var isOffsetCheck = (styleString(element, 'position') == 'static') ? isOffsetStatic : isOffset;
    while ((element = element.parentNode)){
      if (isOffsetCheck(element)) return element;
    }
    return null;
  } : function(){
    var element = this;
    if (isBody(element) || styleString(element, 'position') == 'fixed') return null;

    try {
      return element.offsetParent;
    } catch(e) {}
    return null;
  },

  getOffsets: function(){
    if (this.getBoundingClientRect && !Browser.Platform.ios){
      var bound = this.getBoundingClientRect(),
        html = document.id(this.getDocument().documentElement),
        htmlScroll = html.getScroll(),
        elemScrolls = this.getScrolls(),
        isFixed = (styleString(this, 'position') == 'fixed');

      return {
        x: bound.left.toInt() + elemScrolls.x + ((isFixed) ? 0 : htmlScroll.x) - html.clientLeft,
        y: bound.top.toInt()  + elemScrolls.y + ((isFixed) ? 0 : htmlScroll.y) - html.clientTop
      };
    }

    var element = this, position = {x: 0, y: 0};
    if (isBody(this)) return position;

    while (element && !isBody(element)){
      position.x += element.offsetLeft;
      position.y += element.offsetTop;

      if (Browser.firefox){
        if (!borderBox(element)){
          position.x += leftBorder(element);
          position.y += topBorder(element);
        }
        var parent = element.parentNode;
        if (parent && styleString(parent, 'overflow') != 'visible'){
          position.x += leftBorder(parent);
          position.y += topBorder(parent);
        }
      } else if (element != this && Browser.safari){
        position.x += leftBorder(element);
        position.y += topBorder(element);
      }

      element = element.offsetParent;
    }
    if (Browser.firefox && !borderBox(this)){
      position.x -= leftBorder(this);
      position.y -= topBorder(this);
    }
    return position;
  },

  getPosition: function(relative){
    var offset = this.getOffsets(),
      scroll = this.getScrolls();
    var position = {
      x: offset.x - scroll.x,
      y: offset.y - scroll.y
    };

    if (relative && (relative = document.id(relative))){
      var relativePosition = relative.getPosition();
      return {x: position.x - relativePosition.x - leftBorder(relative), y: position.y - relativePosition.y - topBorder(relative)};
    }
    return position;
  },

  getCoordinates: function(element){
    if (isBody(this)) return this.getWindow().getCoordinates();
    var position = this.getPosition(element),
      size = this.getSize();
    var obj = {
      left: position.x,
      top: position.y,
      width: size.x,
      height: size.y
    };
    obj.right = obj.left + obj.width;
    obj.bottom = obj.top + obj.height;
    return obj;
  },

  computePosition: function(obj){
    return {
      left: obj.x - styleNumber(this, 'margin-left'),
      top: obj.y - styleNumber(this, 'margin-top')
    };
  },

  setPosition: function(obj){
    return this.setStyles(this.computePosition(obj));
  }

});


[Document, Window].invoke('implement', {

  getSize: function(){
    var doc = getCompatElement(this);
    return {x: doc.clientWidth, y: doc.clientHeight};
  },

  getScroll: function(){
    var win = this.getWindow(), doc = getCompatElement(this);
    return {x: win.pageXOffset || doc.scrollLeft, y: win.pageYOffset || doc.scrollTop};
  },

  getScrollSize: function(){
    var doc = getCompatElement(this),
      min = this.getSize(),
      body = this.getDocument().body;

    return {x: Math.max(doc.scrollWidth, body.scrollWidth, min.x), y: Math.max(doc.scrollHeight, body.scrollHeight, min.y)};
  },

  getPosition: function(){
    return {x: 0, y: 0};
  },

  getCoordinates: function(){
    var size = this.getSize();
    return {top: 0, left: 0, bottom: size.y, right: size.x, height: size.y, width: size.x};
  }

});

// private methods

var styleString = Element.getComputedStyle;

function styleNumber(element, style){
  return styleString(element, style).toInt() || 0;
}

function borderBox(element){
  return styleString(element, '-moz-box-sizing') == 'border-box';
}

function topBorder(element){
  return styleNumber(element, 'border-top-width');
}

function leftBorder(element){
  return styleNumber(element, 'border-left-width');
}

function isBody(element){
  return (/^(?:body|html)$/i).test(element.tagName);
}

function getCompatElement(element){
  var doc = element.getDocument();
  return (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
}

})();

//aliases
Element.alias({position: 'setPosition'}); //compatability

[Window, Document, Element].invoke('implement', {

  getHeight: function(){
    return this.getSize().y;
  },

  getWidth: function(){
    return this.getSize().x;
  },

  getScrollTop: function(){
    return this.getScroll().y;
  },

  getScrollLeft: function(){
    return this.getScroll().x;
  },

  getScrollHeight: function(){
    return this.getScrollSize().y;
  },

  getScrollWidth: function(){
    return this.getScrollSize().x;
  },

  getTop: function(){
    return this.getPosition().y;
  },

  getLeft: function(){
    return this.getPosition().x;
  }

});

},{}],3:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2012 - License MIT
  */
!function (name, context, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else context[name] = definition()
}('domready', this, function (ready) {

  var fns = [], fn, f = false
    , doc = document
    , testEl = doc.documentElement
    , hack = testEl.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , addEventListener = 'addEventListener'
    , onreadystatechange = 'onreadystatechange'
    , readyState = 'readyState'
    , loaded = /^loade|c/.test(doc[readyState])

  function flush(f) {
    loaded = 1
    while (f = fns.shift()) f()
  }

  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f)
    flush()
  }, f)


  hack && doc.attachEvent(onreadystatechange, fn = function () {
    if (/^c/.test(doc[readyState])) {
      doc.detachEvent(onreadystatechange, fn)
      flush()
    }
  })

  return (ready = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left')
          } catch (e) {
            return setTimeout(function() { ready(fn) }, 50)
          }
          fn()
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn)
    })
})

},{}],4:[function(require,module,exports){
(function (process){
/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _each(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor !== Array) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (test()) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (!test()) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if(data.constructor !== Array) {
              data = [data];
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain) cargo.drain();
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.compose = function (/* functions... */) {
        var fns = Array.prototype.reverse.call(arguments);
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require('_process'))
},{"_process":35}],5:[function(require,module,exports){
var Modernizr = require('./lib/Modernizr'),
    ModernizrProto = require('./lib/ModernizrProto'),
    classes = require('./lib/classes'),
    testRunner = require('./lib/testRunner'),
    setClasses = require('./lib/setClasses');

// Run each test
testRunner();

// Remove the "no-js" class if it exists
setClasses(classes);

delete ModernizrProto.addTest;
delete ModernizrProto.addAsyncTest;

// Run the things that are supposed to run after the tests
for (var i = 0; i < Modernizr._q.length; i++) {
  Modernizr._q[i]();
}

module.exports = Modernizr;

},{"./lib/Modernizr":6,"./lib/ModernizrProto":7,"./lib/classes":8,"./lib/setClasses":25,"./lib/testRunner":30}],6:[function(require,module,exports){
var ModernizrProto = require('./ModernizrProto.js');
  // Fake some of Object.create so we can force non test results to be non "own" properties.
  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;

  // Leak modernizr globally when you `require` it rather than force it here.
  // Overwrite name so constructor name is nicer :D
  Modernizr = new Modernizr();

  module.exports = Modernizr;


},{"./ModernizrProto.js":7}],7:[function(require,module,exports){
var tests = require('./tests.js');
  /**
   *
   * ModernizrProto is the constructor for Modernizr
   *
   * @class
   * @access public
   */

  var ModernizrProto = {
    // The current version, dummy
    _version: '3.3.1 (browsernizr 2.1.0)',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      'classPrefix': '',
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },

    // Queue of tests
    _q: [],

    // Stub these for people who are listening
    on: function(test, cb) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
      // This is in case people listen to synchronous tests. I would leave it out,
      // but the code to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },

    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },

    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };

  module.exports = ModernizrProto;


},{"./tests.js":32}],8:[function(require,module,exports){

  var classes = [];
  module.exports = classes;


},{}],9:[function(require,module,exports){


  /**
   * contains checks to see if a string contains another string
   *
   * @access private
   * @function contains
   * @param {string} str - The string we want to check for substrings
   * @param {string} substr - The substring we want to search the first string for
   * @returns {boolean}
   */

  function contains(str, substr) {
    return !!~('' + str).indexOf(substr);
  }

  module.exports = contains;


},{}],10:[function(require,module,exports){
var isSVG = require('./isSVG.js');
  /**
   * createElement is a convenience wrapper around document.createElement. Since we
   * use createElement all over the place, this allows for (slightly) smaller code
   * as well as abstracting away issues with creating elements in contexts other than
   * HTML documents (e.g. SVG documents).
   *
   * @access private
   * @function createElement
   * @returns {HTMLElement|SVGElement} An HTML or SVG element
   */

  function createElement() {
    if (typeof document.createElement !== 'function') {
      // This is the case in IE7, where the type of createElement is "object".
      // For this reason, we cannot call apply() as Object is not a Function.
      return document.createElement(arguments[0]);
    } else if (isSVG) {
      return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
    } else {
      return document.createElement.apply(document, arguments);
    }
  }

  module.exports = createElement;


},{"./isSVG.js":20}],11:[function(require,module,exports){

  /**
   * cssToDOM takes a kebab-case string and converts it to camelCase
   * e.g. box-sizing -> boxSizing
   *
   * @access private
   * @function cssToDOM
   * @param {string} name - String name of kebab-case prop we want to convert
   * @returns {string} The camelCase version of the supplied name
   */

  function cssToDOM(name) {
    return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
      return m1 + m2.toUpperCase();
    }).replace(/^-/, '');
  }
  module.exports = cssToDOM;


},{}],12:[function(require,module,exports){
var ModernizrProto = require('./ModernizrProto.js');
var omPrefixes = require('./omPrefixes.js');
  var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);
  ModernizrProto._cssomPrefixes = cssomPrefixes;
  module.exports = cssomPrefixes;


},{"./ModernizrProto.js":7,"./omPrefixes.js":24}],13:[function(require,module,exports){

  /**
   * docElement is a convenience wrapper to grab the root element of the document
   *
   * @access private
   * @returns {HTMLElement|SVGElement} The root element of the document
   */

  var docElement = document.documentElement;
  module.exports = docElement;


},{}],14:[function(require,module,exports){
var ModernizrProto = require('./ModernizrProto.js');
var omPrefixes = require('./omPrefixes.js');
  /**
   * List of JavaScript DOM values used for tests
   *
   * @memberof Modernizr
   * @name Modernizr._domPrefixes
   * @optionName Modernizr._domPrefixes
   * @optionProp domPrefixes
   * @access public
   * @example
   *
   * Modernizr._domPrefixes is exactly the same as [_prefixes](#modernizr-_prefixes), but rather
   * than kebab-case properties, all properties are their Capitalized variant
   *
   * ```js
   * Modernizr._domPrefixes === [ "Moz", "O", "ms", "Webkit" ];
   * ```
   */

  var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
  ModernizrProto._domPrefixes = domPrefixes;
  module.exports = domPrefixes;


},{"./ModernizrProto.js":7,"./omPrefixes.js":24}],15:[function(require,module,exports){

  /**
   * domToCSS takes a camelCase string and converts it to kebab-case
   * e.g. boxSizing -> box-sizing
   *
   * @access private
   * @function domToCSS
   * @param {string} name - String name of camelCase prop we want to convert
   * @returns {string} The kebab-case version of the supplied name
   */

  function domToCSS(name) {
    return name.replace(/([A-Z])/g, function(str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  }
  module.exports = domToCSS;


},{}],16:[function(require,module,exports){

  /**
   * fnBind is a super small [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) polyfill.
   *
   * @access private
   * @function fnBind
   * @param {function} fn - a function you want to change `this` reference to
   * @param {object} that - the `this` you want to call the function with
   * @returns {function} The wrapped version of the supplied function
   */

  function fnBind(fn, that) {
    return function() {
      return fn.apply(that, arguments);
    };
  }

  module.exports = fnBind;


},{}],17:[function(require,module,exports){
var createElement = require('./createElement.js');
var isSVG = require('./isSVG.js');
  /**
   * getBody returns the body of a document, or an element that can stand in for
   * the body if a real body does not exist
   *
   * @access private
   * @function getBody
   * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
   * artificially created element that stands in for the body
   */

  function getBody() {
    // After page load injecting a fake body doesn't work so check if body exists
    var body = document.body;

    if (!body) {
      // Can't use the real body create a fake one.
      body = createElement(isSVG ? 'svg' : 'body');
      body.fake = true;
    }

    return body;
  }

  module.exports = getBody;


},{"./createElement.js":10,"./isSVG.js":20}],18:[function(require,module,exports){
var ModernizrProto = require('./ModernizrProto.js');
var docElement = require('./docElement.js');
var createElement = require('./createElement.js');
var getBody = require('./getBody.js');
  /**
   * injectElementWithStyles injects an element with style element and some CSS rules
   *
   * @access private
   * @function injectElementWithStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   */

  function injectElementWithStyles(rule, callback, nodes, testnames) {
    var mod = 'modernizr';
    var style;
    var ret;
    var node;
    var docOverflow;
    var div = createElement('div');
    var body = getBody();

    if (parseInt(nodes, 10)) {
      // In order not to give false positives we create a node for each test
      // This also allows the method to scale for unspecified uses
      while (nodes--) {
        node = createElement('div');
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }

    style = createElement('style');
    style.type = 'text/css';
    style.id = 's' + mod;

    // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
    // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
    (!body.fake ? div : body).appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(document.createTextNode(rule));
    }
    div.id = mod;

    if (body.fake) {
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    ret = callback(div, rule);
    // If this is done after page load we don't want to remove the body so check if body exists
    if (body.fake) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow;
      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      docElement.offsetHeight;
    } else {
      div.parentNode.removeChild(div);
    }

    return !!ret;

  }

  module.exports = injectElementWithStyles;


},{"./ModernizrProto.js":7,"./createElement.js":10,"./docElement.js":13,"./getBody.js":17}],19:[function(require,module,exports){

  /**
   * is returns a boolean if the typeof an obj is exactly type.
   *
   * @access private
   * @function is
   * @param {*} obj - A thing we want to check the type of
   * @param {string} type - A string to compare the typeof against
   * @returns {boolean}
   */

  function is(obj, type) {
    return typeof obj === type;
  }
  module.exports = is;


},{}],20:[function(require,module,exports){
var docElement = require('./docElement.js');
  /**
   * A convenience helper to check if the document we are running in is an SVG document
   *
   * @access private
   * @returns {boolean}
   */

  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  module.exports = isSVG;


},{"./docElement.js":13}],21:[function(require,module,exports){
var Modernizr = require('./Modernizr.js');
var modElem = require('./modElem.js');
  var mStyle = {
    style: modElem.elem.style
  };

  // kill ref for gc, must happen before mod.elem is removed, so we unshift on to
  // the front of the queue.
  Modernizr._q.unshift(function() {
    delete mStyle.style;
  });

  module.exports = mStyle;


},{"./Modernizr.js":6,"./modElem.js":22}],22:[function(require,module,exports){
var Modernizr = require('./Modernizr.js');
var createElement = require('./createElement.js');
  /**
   * Create our "modernizr" element that we do most feature tests on.
   *
   * @access private
   */

  var modElem = {
    elem: createElement('modernizr')
  };

  // Clean up this element
  Modernizr._q.push(function() {
    delete modElem.elem;
  });

  module.exports = modElem;


},{"./Modernizr.js":6,"./createElement.js":10}],23:[function(require,module,exports){
var injectElementWithStyles = require('./injectElementWithStyles.js');
var domToCSS = require('./domToCSS.js');
  /**
   * nativeTestProps allows for us to use native feature detection functionality if available.
   * some prefixed form, or false, in the case of an unsupported rule
   *
   * @access private
   * @function nativeTestProps
   * @param {array} props - An array of property names
   * @param {string} value - A string representing the value we want to check via @supports
   * @returns {boolean|undefined} A boolean when @supports exists, undefined otherwise
   */

  // Accepts a list of property names and a single value
  // Returns `undefined` if native detection not available
  function nativeTestProps(props, value) {
    var i = props.length;
    // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
    if ('CSS' in window && 'supports' in window.CSS) {
      // Try every prefixed variant of the property
      while (i--) {
        if (window.CSS.supports(domToCSS(props[i]), value)) {
          return true;
        }
      }
      return false;
    }
    // Otherwise fall back to at-rule (for Opera 12.x)
    else if ('CSSSupportsRule' in window) {
      // Build a condition string for every prefixed variant
      var conditionText = [];
      while (i--) {
        conditionText.push('(' + domToCSS(props[i]) + ':' + value + ')');
      }
      conditionText = conditionText.join(' or ');
      return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function(node) {
        return getComputedStyle(node, null).position == 'absolute';
      });
    }
    return undefined;
  }
  module.exports = nativeTestProps;


},{"./domToCSS.js":15,"./injectElementWithStyles.js":18}],24:[function(require,module,exports){

  /**
   * If the browsers follow the spec, then they would expose vendor-specific style as:
   *   elem.style.WebkitBorderRadius
   * instead of something like the following, which would be technically incorrect:
   *   elem.style.webkitBorderRadius

   * Webkit ghosts their properties in lowercase but Opera & Moz do not.
   * Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
   *   erik.eae.net/archives/2008/03/10/21.48.10/

   * More here: github.com/Modernizr/Modernizr/issues/issue/21
   *
   * @access private
   * @returns {string} The string representing the vendor-specific style properties
   */

  var omPrefixes = 'Moz O ms Webkit';
  module.exports = omPrefixes;


},{}],25:[function(require,module,exports){
var Modernizr = require('./Modernizr.js');
var docElement = require('./docElement.js');
var isSVG = require('./isSVG.js');
  /**
   * setClasses takes an array of class names and adds them to the root element
   *
   * @access private
   * @function setClasses
   * @param {string[]} classes - Array of class names
   */

  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    }

    // Change `no-js` to `js` (independently of the `enableClasses` option)
    // Handle classPrefix on this too
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      // Add the new classes
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      isSVG ? docElement.className.baseVal = className : docElement.className = className;
    }

  }

  module.exports = setClasses;


},{"./Modernizr.js":6,"./docElement.js":13,"./isSVG.js":20}],26:[function(require,module,exports){
var ModernizrProto = require('./ModernizrProto.js');
var testPropsAll = require('./testPropsAll.js');
  /**
   * testAllProps determines whether a given CSS property is supported in the browser
   *
   * @memberof Modernizr
   * @name Modernizr.testAllProps
   * @optionName Modernizr.testAllProps()
   * @optionProp testAllProps
   * @access public
   * @function testAllProps
   * @param {string} prop - String naming the property to test (either camelCase or kebab-case)
   * @param {string} [value] - String of the value to test
   * @param {boolean} [skipValueTest=false] - Whether to skip testing that the value is supported when using non-native detection
   * @example
   *
   * testAllProps determines whether a given CSS property, in some prefixed form,
   * is supported by the browser.
   *
   * ```js
   * testAllProps('boxSizing')  // true
   * ```
   *
   * It can optionally be given a CSS value in string form to test if a property
   * value is valid
   *
   * ```js
   * testAllProps('display', 'block') // true
   * testAllProps('display', 'penguin') // false
   * ```
   *
   * A boolean can be passed as a third parameter to skip the value check when
   * native detection (@supports) isn't available.
   *
   * ```js
   * testAllProps('shapeOutside', 'content-box', true);
   * ```
   */

  function testAllProps(prop, value, skipValueTest) {
    return testPropsAll(prop, undefined, undefined, value, skipValueTest);
  }
  ModernizrProto.testAllProps = testAllProps;
  module.exports = testAllProps;


},{"./ModernizrProto.js":7,"./testPropsAll.js":29}],27:[function(require,module,exports){
var is = require('./is.js');
var fnBind = require('./fnBind.js');
  /**
   * testDOMProps is a generic DOM property test; if a browser supports
   *   a certain property, it won't return undefined for it.
   *
   * @access private
   * @function testDOMProps
   * @param {array.<string>} props - An array of properties to test for
   * @param {object} obj - An object or Element you want to use to test the parameters again
   * @param {boolean|object} elem - An Element to bind the property lookup again. Use `false` to prevent the check
   */
  function testDOMProps(props, obj, elem) {
    var item;

    for (var i in props) {
      if (props[i] in obj) {

        // return the property name as a string
        if (elem === false) {
          return props[i];
        }

        item = obj[props[i]];

        // let's bind a function
        if (is(item, 'function')) {
          // bind to obj unless overriden
          return fnBind(item, elem || obj);
        }

        // return the unbound function or obj or value
        return item;
      }
    }
    return false;
  }

  module.exports = testDOMProps;


},{"./fnBind.js":16,"./is.js":19}],28:[function(require,module,exports){
var contains = require('./contains.js');
var mStyle = require('./mStyle.js');
var createElement = require('./createElement.js');
var nativeTestProps = require('./nativeTestProps.js');
var is = require('./is.js');
var cssToDOM = require('./cssToDOM.js');
  // testProps is a generic CSS / DOM property test.

  // In testing support for a given CSS property, it's legit to test:
  //    `elem.style[styleName] !== undefined`
  // If the property is supported it will return an empty string,
  // if unsupported it will return undefined.

  // We'll take advantage of this quick test and skip setting a style
  // on our modernizr element, but instead just testing undefined vs
  // empty string.

  // Property names can be provided in either camelCase or kebab-case.

  function testProps(props, prefixed, value, skipValueTest) {
    skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;

    // Try native detect first
    if (!is(value, 'undefined')) {
      var result = nativeTestProps(props, value);
      if (!is(result, 'undefined')) {
        return result;
      }
    }

    // Otherwise do it properly
    var afterInit, i, propsLength, prop, before;

    // If we don't have a style element, that means we're running async or after
    // the core tests, so we'll need to create our own elements to use

    // inside of an SVG element, in certain browsers, the `style` element is only
    // defined for valid tags. Therefore, if `modernizr` does not have one, we
    // fall back to a less used element and hope for the best.
    var elems = ['modernizr', 'tspan'];
    while (!mStyle.style) {
      afterInit = true;
      mStyle.modElem = createElement(elems.shift());
      mStyle.style = mStyle.modElem.style;
    }

    // Delete the objects if we created them.
    function cleanElems() {
      if (afterInit) {
        delete mStyle.style;
        delete mStyle.modElem;
      }
    }

    propsLength = props.length;
    for (i = 0; i < propsLength; i++) {
      prop = props[i];
      before = mStyle.style[prop];

      if (contains(prop, '-')) {
        prop = cssToDOM(prop);
      }

      if (mStyle.style[prop] !== undefined) {

        // If value to test has been passed in, do a set-and-check test.
        // 0 (integer) is a valid property value, so check that `value` isn't
        // undefined, rather than just checking it's truthy.
        if (!skipValueTest && !is(value, 'undefined')) {

          // Needs a try catch block because of old IE. This is slow, but will
          // be avoided in most cases because `skipValueTest` will be used.
          try {
            mStyle.style[prop] = value;
          } catch (e) {}

          // If the property value has changed, we assume the value used is
          // supported. If `value` is empty string, it'll fail here (because
          // it hasn't changed), which matches how browsers have implemented
          // CSS.supports()
          if (mStyle.style[prop] != before) {
            cleanElems();
            return prefixed == 'pfx' ? prop : true;
          }
        }
        // Otherwise just return true, or the property name if this is a
        // `prefixed()` call
        else {
          cleanElems();
          return prefixed == 'pfx' ? prop : true;
        }
      }
    }
    cleanElems();
    return false;
  }

  module.exports = testProps;


},{"./contains.js":9,"./createElement.js":10,"./cssToDOM.js":11,"./is.js":19,"./mStyle.js":21,"./nativeTestProps.js":23}],29:[function(require,module,exports){
var ModernizrProto = require('./ModernizrProto.js');
var cssomPrefixes = require('./cssomPrefixes.js');
var is = require('./is.js');
var testProps = require('./testProps.js');
var domPrefixes = require('./domPrefixes.js');
var testDOMProps = require('./testDOMProps.js');
  /**
   * testPropsAll tests a list of DOM properties we want to check against.
   * We specify literally ALL possible (known and/or likely) properties on
   * the element including the non-vendor prefixed one, for forward-
   * compatibility.
   *
   * @access private
   * @function testPropsAll
   * @param {string} prop - A string of the property to test for
   * @param {string|object} [prefixed] - An object to check the prefixed properties on. Use a string to skip
   * @param {HTMLElement|SVGElement} [elem] - An element used to test the property and value against
   * @param {string} [value] - A string of a css value
   * @param {boolean} [skipValueTest] - An boolean representing if you want to test if value sticks when set
   */
  function testPropsAll(prop, prefixed, elem, value, skipValueTest) {

    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
    props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    // did they call .prefixed('boxSizing') or are we just testing a prop?
    if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
      return testProps(props, prefixed, value, skipValueTest);

      // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
    } else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  }

  // Modernizr.testAllProps() investigates whether a given style property,
  // or any of its vendor-prefixed variants, is recognized
  //
  // Note that the property names must be provided in the camelCase variant.
  // Modernizr.testAllProps('boxSizing')
  ModernizrProto.testAllProps = testPropsAll;

  module.exports = testPropsAll;


},{"./ModernizrProto.js":7,"./cssomPrefixes.js":12,"./domPrefixes.js":14,"./is.js":19,"./testDOMProps.js":27,"./testProps.js":28}],30:[function(require,module,exports){
var tests = require('./tests.js');
var Modernizr = require('./Modernizr.js');
var classes = require('./classes.js');
var is = require('./is.js');
  /**
   * Run through all tests and detect their support in the current UA.
   *
   * @access private
   */

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        // run the test, throw the return value into the Modernizr,
        // then based on that boolean, define an appropriate className
        // and push it into an array of classes we'll join later.
        //
        // If there is no name, it's an 'async' test that is run,
        // but not directly added to the object. That should
        // be done with a post-run addTest call.
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            // Add all the aliases into the names list
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }

        // Run the test, or use the raw value if it's not a function
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


        // Set each of the names on the Modernizr object
        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
          // Support dot properties as sub tests. We don't do checking to make sure
          // that the implied parent tests have been added. You must call them in
          // order (either in the test, or make the parent test a dependency).
          //
          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
          // hashtag famous last words
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            /* jshint -W053 */
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }
  module.exports = testRunner;


},{"./Modernizr.js":6,"./classes.js":8,"./is.js":19,"./tests.js":32}],31:[function(require,module,exports){
var ModernizrProto = require('./ModernizrProto.js');
var injectElementWithStyles = require('./injectElementWithStyles.js');
  /**
   * testStyles injects an element with style element and some CSS rules
   *
   * @memberof Modernizr
   * @name Modernizr.testStyles
   * @optionName Modernizr.testStyles()
   * @optionProp testStyles
   * @access public
   * @function testStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   * @example
   *
   * `Modernizr.testStyles` takes a CSS rule and injects it onto the current page
   * along with (possibly multiple) DOM elements. This lets you check for features
   * that can not be detected by simply checking the [IDL](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Interface_development_guide/IDL_interface_rules).
   *
   * ```js
   * Modernizr.testStyles('#modernizr { width: 9px; color: papayawhip; }', function(elem, rule) {
   *   // elem is the first DOM node in the page (by default #modernizr)
   *   // rule is the first argument you supplied - the CSS rule in string form
   *
   *   addTest('widthworks', elem.style.width === '9px')
   * });
   * ```
   *
   * If your test requires multiple nodes, you can include a third argument
   * indicating how many additional div elements to include on the page. The
   * additional nodes are injected as children of the `elem` that is returned as
   * the first argument to the callback.
   *
   * ```js
   * Modernizr.testStyles('#modernizr {width: 1px}; #modernizr2 {width: 2px}', function(elem) {
   *   document.getElementById('modernizr').style.width === '1px'; // true
   *   document.getElementById('modernizr2').style.width === '2px'; // true
   *   elem.firstChild === document.getElementById('modernizr2'); // true
   * }, 1);
   * ```
   *
   * By default, all of the additional elements have an ID of `modernizr[n]`, where
   * `n` is its index (e.g. the first additional, second overall is `#modernizr2`,
   * the second additional is `#modernizr3`, etc.).
   * If you want to have more meaningful IDs for your function, you can provide
   * them as the fourth argument, as an array of strings
   *
   * ```js
   * Modernizr.testStyles('#foo {width: 10px}; #bar {height: 20px}', function(elem) {
   *   elem.firstChild === document.getElementById('foo'); // true
   *   elem.lastChild === document.getElementById('bar'); // true
   * }, 2, ['foo', 'bar']);
   * ```
   *
   */

  var testStyles = ModernizrProto.testStyles = injectElementWithStyles;
  module.exports = testStyles;


},{"./ModernizrProto.js":7,"./injectElementWithStyles.js":18}],32:[function(require,module,exports){

  var tests = [];
  module.exports = tests;


},{}],33:[function(require,module,exports){
/*!
{
  "name": "CSS rgba",
  "caniuse": "css3-colors",
  "property": "rgba",
  "tags": ["css"],
  "notes": [{
    "name": "CSSTricks Tutorial",
    "href": "https://css-tricks.com/rgba-browser-support/"
  }]
}
!*/
var Modernizr = require('./../../lib/Modernizr.js');
var createElement = require('./../../lib/createElement.js');
  Modernizr.addTest('rgba', function() {
    var style = createElement('a').style;
    style.cssText = 'background-color:rgba(150,255,150,.5)';

    return ('' + style.backgroundColor).indexOf('rgba') > -1;
  });


},{"./../../lib/Modernizr.js":6,"./../../lib/createElement.js":10}],34:[function(require,module,exports){
/*!
{
  "name": "CSS Transforms 3D",
  "property": "csstransforms3d",
  "caniuse": "transforms3d",
  "tags": ["css"],
  "warnings": [
    "Chrome may occassionally fail this test on some systems; more info: https://code.google.com/p/chromium/issues/detail?id=129004"
  ]
}
!*/
var Modernizr = require('./../../lib/Modernizr.js');
var testAllProps = require('./../../lib/testAllProps.js');
var testStyles = require('./../../lib/testStyles.js');
var docElement = require('./../../lib/docElement.js');
  Modernizr.addTest('csstransforms3d', function() {
    var ret = !!testAllProps('perspective', '1px', true);
    var usePrefix = Modernizr._config.usePrefixes;

    // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
    //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
    //   some conditions. As a result, Webkit typically recognizes the syntax but
    //   will sometimes throw a false positive, thus we must do a more thorough check:
    if (ret && (!usePrefix || 'webkitPerspective' in docElement.style)) {
      var mq;
      var defaultStyle = '#modernizr{width:0;height:0}';
      // Use CSS Conditional Rules if available
      if (Modernizr.supports) {
        mq = '@supports (perspective: 1px)';
      } else {
        // Otherwise, Webkit allows this media query to succeed only if the feature is enabled.
        // `@media (transform-3d),(-webkit-transform-3d){ ... }`
        mq = '@media (transform-3d)';
        if (usePrefix) {
          mq += ',(-webkit-transform-3d)';
        }
      }

      mq += '{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}';

      testStyles(defaultStyle + mq, function(elem) {
        ret = elem.offsetWidth === 7 && elem.offsetHeight === 18;
      });
    }

    return ret;
  });


},{"./../../lib/Modernizr.js":6,"./../../lib/docElement.js":13,"./../../lib/testAllProps.js":26,"./../../lib/testStyles.js":31}],35:[function(require,module,exports){
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);
