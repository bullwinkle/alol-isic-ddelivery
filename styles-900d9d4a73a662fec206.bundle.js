webpackJsonp([2],{

/***/ 1090:
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(1091);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 1091:
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ 1101:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(581);


/***/ }),

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(189).Buffer))

/***/ }),

/***/ 188:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),

/***/ 189:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(188)
var ieee754 = __webpack_require__(343)
var isArray = __webpack_require__(344)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(23)))

/***/ }),

/***/ 343:
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 344:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ 581:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(628);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1090)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js?{\"sourceMap\":false,\"importLoaders\":1}!../node_modules/postcss-loader/index.js!../node_modules/sass-loader/lib/loader.js!./styles.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js?{\"sourceMap\":false,\"importLoaders\":1}!../node_modules/postcss-loader/index.js!../node_modules/sass-loader/lib/loader.js!./styles.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 628:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(15)(false);
// imports


// module
exports.push([module.i, "/**\n * Foundation for Sites by ZURB\n * Version 6.3.1\n * foundation.zurb.com\n * Licensed under MIT Open Source\n */\n.row {\n  max-width: 61.25rem;\n  margin-right: auto;\n  margin-left: auto;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-flow: row wrap;\n      flex-flow: row wrap; }\n  .row .row {\n    margin-right: -0.46875rem;\n    margin-left: -0.46875rem; }\n    @media print, screen and (min-width: 40em) {\n      .row .row {\n        margin-right: -0.625rem;\n        margin-left: -0.625rem; } }\n    @media print, screen and (min-width: 64em) {\n      .row .row {\n        margin-right: -0.625rem;\n        margin-left: -0.625rem; } }\n    .row .row.collapse {\n      margin-right: 0;\n      margin-left: 0; }\n  .row.expanded {\n    max-width: none; }\n  .row:not(.expanded) .row {\n    max-width: none; }\n  .row.collapse > .column, .row.collapse > .columns {\n    padding-right: 0;\n    padding-left: 0; }\n  .row.is-collapse-child,\n  .row.collapse > .column > .row,\n  .row.collapse > .columns > .row {\n    margin-right: 0;\n    margin-left: 0; }\n\n.column, .columns {\n  -ms-flex: 1 1 0px;\n      flex: 1 1 0px;\n  padding-right: 0.46875rem;\n  padding-left: 0.46875rem;\n  min-width: initial; }\n  @media print, screen and (min-width: 40em) {\n    .column, .columns {\n      padding-right: 0.625rem;\n      padding-left: 0.625rem; } }\n\n.column.row.row, .row.row.columns {\n  float: none;\n  display: block; }\n\n.row .column.row.row, .row .row.row.columns {\n  margin-right: 0;\n  margin-left: 0;\n  padding-right: 0;\n  padding-left: 0; }\n\n.flex-container {\n  display: -ms-flexbox;\n  display: flex; }\n\n.flex-child-auto {\n  -ms-flex: 1 1 auto;\n      flex: 1 1 auto; }\n\n.flex-child-grow {\n  -ms-flex: 1 0 auto;\n      flex: 1 0 auto; }\n\n.flex-child-shrink {\n  -ms-flex: 0 1 auto;\n      flex: 0 1 auto; }\n\n.flex-dir-row {\n  -ms-flex-direction: row;\n      flex-direction: row; }\n\n.flex-dir-row-reverse {\n  -ms-flex-direction: row-reverse;\n      flex-direction: row-reverse; }\n\n.flex-dir-column {\n  -ms-flex-direction: column;\n      flex-direction: column; }\n\n.flex-dir-column-reverse {\n  -ms-flex-direction: column-reverse;\n      flex-direction: column-reverse; }\n\n.small-1 {\n  -ms-flex: 0 0 8.33333%;\n      flex: 0 0 8.33333%;\n  max-width: 8.33333%; }\n\n.small-offset-0 {\n  margin-left: 0%; }\n\n.small-2 {\n  -ms-flex: 0 0 16.66667%;\n      flex: 0 0 16.66667%;\n  max-width: 16.66667%; }\n\n.small-offset-1 {\n  margin-left: 8.33333%; }\n\n.small-3 {\n  -ms-flex: 0 0 25%;\n      flex: 0 0 25%;\n  max-width: 25%; }\n\n.small-offset-2 {\n  margin-left: 16.66667%; }\n\n.small-4 {\n  -ms-flex: 0 0 33.33333%;\n      flex: 0 0 33.33333%;\n  max-width: 33.33333%; }\n\n.small-offset-3 {\n  margin-left: 25%; }\n\n.small-5 {\n  -ms-flex: 0 0 41.66667%;\n      flex: 0 0 41.66667%;\n  max-width: 41.66667%; }\n\n.small-offset-4 {\n  margin-left: 33.33333%; }\n\n.small-6 {\n  -ms-flex: 0 0 50%;\n      flex: 0 0 50%;\n  max-width: 50%; }\n\n.small-offset-5 {\n  margin-left: 41.66667%; }\n\n.small-7 {\n  -ms-flex: 0 0 58.33333%;\n      flex: 0 0 58.33333%;\n  max-width: 58.33333%; }\n\n.small-offset-6 {\n  margin-left: 50%; }\n\n.small-8 {\n  -ms-flex: 0 0 66.66667%;\n      flex: 0 0 66.66667%;\n  max-width: 66.66667%; }\n\n.small-offset-7 {\n  margin-left: 58.33333%; }\n\n.small-9 {\n  -ms-flex: 0 0 75%;\n      flex: 0 0 75%;\n  max-width: 75%; }\n\n.small-offset-8 {\n  margin-left: 66.66667%; }\n\n.small-10 {\n  -ms-flex: 0 0 83.33333%;\n      flex: 0 0 83.33333%;\n  max-width: 83.33333%; }\n\n.small-offset-9 {\n  margin-left: 75%; }\n\n.small-11 {\n  -ms-flex: 0 0 91.66667%;\n      flex: 0 0 91.66667%;\n  max-width: 91.66667%; }\n\n.small-offset-10 {\n  margin-left: 83.33333%; }\n\n.small-12 {\n  -ms-flex: 0 0 100%;\n      flex: 0 0 100%;\n  max-width: 100%; }\n\n.small-offset-11 {\n  margin-left: 91.66667%; }\n\n.small-order-1 {\n  -ms-flex-order: 1;\n      order: 1; }\n\n.small-order-2 {\n  -ms-flex-order: 2;\n      order: 2; }\n\n.small-order-3 {\n  -ms-flex-order: 3;\n      order: 3; }\n\n.small-order-4 {\n  -ms-flex-order: 4;\n      order: 4; }\n\n.small-order-5 {\n  -ms-flex-order: 5;\n      order: 5; }\n\n.small-order-6 {\n  -ms-flex-order: 6;\n      order: 6; }\n\n.small-up-1 {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n  .small-up-1 > .column, .small-up-1 > .columns {\n    -ms-flex: 0 0 100%;\n        flex: 0 0 100%;\n    max-width: 100%; }\n\n.small-up-2 {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n  .small-up-2 > .column, .small-up-2 > .columns {\n    -ms-flex: 0 0 50%;\n        flex: 0 0 50%;\n    max-width: 50%; }\n\n.small-up-3 {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n  .small-up-3 > .column, .small-up-3 > .columns {\n    -ms-flex: 0 0 33.33333%;\n        flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n\n.small-up-4 {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n  .small-up-4 > .column, .small-up-4 > .columns {\n    -ms-flex: 0 0 25%;\n        flex: 0 0 25%;\n    max-width: 25%; }\n\n.small-up-5 {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n  .small-up-5 > .column, .small-up-5 > .columns {\n    -ms-flex: 0 0 20%;\n        flex: 0 0 20%;\n    max-width: 20%; }\n\n.small-up-6 {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n  .small-up-6 > .column, .small-up-6 > .columns {\n    -ms-flex: 0 0 16.66667%;\n        flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n\n.small-up-7 {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n  .small-up-7 > .column, .small-up-7 > .columns {\n    -ms-flex: 0 0 14.28571%;\n        flex: 0 0 14.28571%;\n    max-width: 14.28571%; }\n\n.small-up-8 {\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap; }\n  .small-up-8 > .column, .small-up-8 > .columns {\n    -ms-flex: 0 0 12.5%;\n        flex: 0 0 12.5%;\n    max-width: 12.5%; }\n\n.small-collapse > .column, .small-collapse > .columns {\n  padding-right: 0;\n  padding-left: 0; }\n\n.small-uncollapse > .column, .small-uncollapse > .columns {\n  padding-right: 0.46875rem;\n  padding-left: 0.46875rem; }\n\n@media print, screen and (min-width: 40em) {\n  .medium-1 {\n    -ms-flex: 0 0 8.33333%;\n        flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .medium-offset-0 {\n    margin-left: 0%; }\n  .medium-2 {\n    -ms-flex: 0 0 16.66667%;\n        flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .medium-offset-1 {\n    margin-left: 8.33333%; }\n  .medium-3 {\n    -ms-flex: 0 0 25%;\n        flex: 0 0 25%;\n    max-width: 25%; }\n  .medium-offset-2 {\n    margin-left: 16.66667%; }\n  .medium-4 {\n    -ms-flex: 0 0 33.33333%;\n        flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .medium-offset-3 {\n    margin-left: 25%; }\n  .medium-5 {\n    -ms-flex: 0 0 41.66667%;\n        flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .medium-offset-4 {\n    margin-left: 33.33333%; }\n  .medium-6 {\n    -ms-flex: 0 0 50%;\n        flex: 0 0 50%;\n    max-width: 50%; }\n  .medium-offset-5 {\n    margin-left: 41.66667%; }\n  .medium-7 {\n    -ms-flex: 0 0 58.33333%;\n        flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .medium-offset-6 {\n    margin-left: 50%; }\n  .medium-8 {\n    -ms-flex: 0 0 66.66667%;\n        flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .medium-offset-7 {\n    margin-left: 58.33333%; }\n  .medium-9 {\n    -ms-flex: 0 0 75%;\n        flex: 0 0 75%;\n    max-width: 75%; }\n  .medium-offset-8 {\n    margin-left: 66.66667%; }\n  .medium-10 {\n    -ms-flex: 0 0 83.33333%;\n        flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .medium-offset-9 {\n    margin-left: 75%; }\n  .medium-11 {\n    -ms-flex: 0 0 91.66667%;\n        flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .medium-offset-10 {\n    margin-left: 83.33333%; }\n  .medium-12 {\n    -ms-flex: 0 0 100%;\n        flex: 0 0 100%;\n    max-width: 100%; }\n  .medium-offset-11 {\n    margin-left: 91.66667%; }\n  .medium-order-1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .medium-order-2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .medium-order-3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .medium-order-4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .medium-order-5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .medium-order-6 {\n    -ms-flex-order: 6;\n        order: 6; }\n  .medium-up-1 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .medium-up-1 > .column, .medium-up-1 > .columns {\n      -ms-flex: 0 0 100%;\n          flex: 0 0 100%;\n      max-width: 100%; }\n  .medium-up-2 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .medium-up-2 > .column, .medium-up-2 > .columns {\n      -ms-flex: 0 0 50%;\n          flex: 0 0 50%;\n      max-width: 50%; }\n  .medium-up-3 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .medium-up-3 > .column, .medium-up-3 > .columns {\n      -ms-flex: 0 0 33.33333%;\n          flex: 0 0 33.33333%;\n      max-width: 33.33333%; }\n  .medium-up-4 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .medium-up-4 > .column, .medium-up-4 > .columns {\n      -ms-flex: 0 0 25%;\n          flex: 0 0 25%;\n      max-width: 25%; }\n  .medium-up-5 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .medium-up-5 > .column, .medium-up-5 > .columns {\n      -ms-flex: 0 0 20%;\n          flex: 0 0 20%;\n      max-width: 20%; }\n  .medium-up-6 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .medium-up-6 > .column, .medium-up-6 > .columns {\n      -ms-flex: 0 0 16.66667%;\n          flex: 0 0 16.66667%;\n      max-width: 16.66667%; }\n  .medium-up-7 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .medium-up-7 > .column, .medium-up-7 > .columns {\n      -ms-flex: 0 0 14.28571%;\n          flex: 0 0 14.28571%;\n      max-width: 14.28571%; }\n  .medium-up-8 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .medium-up-8 > .column, .medium-up-8 > .columns {\n      -ms-flex: 0 0 12.5%;\n          flex: 0 0 12.5%;\n      max-width: 12.5%; } }\n\n@media print, screen and (min-width: 40em) and (min-width: 40em) {\n  .medium-expand {\n    -ms-flex: 1 1 0px;\n        flex: 1 1 0px; } }\n\n@media print, screen and (min-width: 40em) {\n  .medium-flex-dir-row {\n    -ms-flex-direction: row;\n        flex-direction: row; }\n  .medium-flex-dir-row-reverse {\n    -ms-flex-direction: row-reverse;\n        flex-direction: row-reverse; }\n  .medium-flex-dir-column {\n    -ms-flex-direction: column;\n        flex-direction: column; }\n  .medium-flex-dir-column-reverse {\n    -ms-flex-direction: column-reverse;\n        flex-direction: column-reverse; }\n  .medium-flex-child-auto {\n    -ms-flex: 1 1 auto;\n        flex: 1 1 auto; }\n  .medium-flex-child-grow {\n    -ms-flex: 1 0 auto;\n        flex: 1 0 auto; }\n  .medium-flex-child-shrink {\n    -ms-flex: 0 1 auto;\n        flex: 0 1 auto; } }\n\n.row.medium-unstack > .column, .row.medium-unstack > .columns {\n  -ms-flex: 0 0 100%;\n      flex: 0 0 100%; }\n  @media print, screen and (min-width: 40em) {\n    .row.medium-unstack > .column, .row.medium-unstack > .columns {\n      -ms-flex: 1 1 0px;\n          flex: 1 1 0px; } }\n\n@media print, screen and (min-width: 40em) {\n  .medium-collapse > .column, .medium-collapse > .columns {\n    padding-right: 0;\n    padding-left: 0; }\n  .medium-uncollapse > .column, .medium-uncollapse > .columns {\n    padding-right: 0.625rem;\n    padding-left: 0.625rem; } }\n\n@media print, screen and (min-width: 64em) {\n  .large-1 {\n    -ms-flex: 0 0 8.33333%;\n        flex: 0 0 8.33333%;\n    max-width: 8.33333%; }\n  .large-offset-0 {\n    margin-left: 0%; }\n  .large-2 {\n    -ms-flex: 0 0 16.66667%;\n        flex: 0 0 16.66667%;\n    max-width: 16.66667%; }\n  .large-offset-1 {\n    margin-left: 8.33333%; }\n  .large-3 {\n    -ms-flex: 0 0 25%;\n        flex: 0 0 25%;\n    max-width: 25%; }\n  .large-offset-2 {\n    margin-left: 16.66667%; }\n  .large-4 {\n    -ms-flex: 0 0 33.33333%;\n        flex: 0 0 33.33333%;\n    max-width: 33.33333%; }\n  .large-offset-3 {\n    margin-left: 25%; }\n  .large-5 {\n    -ms-flex: 0 0 41.66667%;\n        flex: 0 0 41.66667%;\n    max-width: 41.66667%; }\n  .large-offset-4 {\n    margin-left: 33.33333%; }\n  .large-6 {\n    -ms-flex: 0 0 50%;\n        flex: 0 0 50%;\n    max-width: 50%; }\n  .large-offset-5 {\n    margin-left: 41.66667%; }\n  .large-7 {\n    -ms-flex: 0 0 58.33333%;\n        flex: 0 0 58.33333%;\n    max-width: 58.33333%; }\n  .large-offset-6 {\n    margin-left: 50%; }\n  .large-8 {\n    -ms-flex: 0 0 66.66667%;\n        flex: 0 0 66.66667%;\n    max-width: 66.66667%; }\n  .large-offset-7 {\n    margin-left: 58.33333%; }\n  .large-9 {\n    -ms-flex: 0 0 75%;\n        flex: 0 0 75%;\n    max-width: 75%; }\n  .large-offset-8 {\n    margin-left: 66.66667%; }\n  .large-10 {\n    -ms-flex: 0 0 83.33333%;\n        flex: 0 0 83.33333%;\n    max-width: 83.33333%; }\n  .large-offset-9 {\n    margin-left: 75%; }\n  .large-11 {\n    -ms-flex: 0 0 91.66667%;\n        flex: 0 0 91.66667%;\n    max-width: 91.66667%; }\n  .large-offset-10 {\n    margin-left: 83.33333%; }\n  .large-12 {\n    -ms-flex: 0 0 100%;\n        flex: 0 0 100%;\n    max-width: 100%; }\n  .large-offset-11 {\n    margin-left: 91.66667%; }\n  .large-order-1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .large-order-2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .large-order-3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .large-order-4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .large-order-5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .large-order-6 {\n    -ms-flex-order: 6;\n        order: 6; }\n  .large-up-1 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .large-up-1 > .column, .large-up-1 > .columns {\n      -ms-flex: 0 0 100%;\n          flex: 0 0 100%;\n      max-width: 100%; }\n  .large-up-2 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .large-up-2 > .column, .large-up-2 > .columns {\n      -ms-flex: 0 0 50%;\n          flex: 0 0 50%;\n      max-width: 50%; }\n  .large-up-3 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .large-up-3 > .column, .large-up-3 > .columns {\n      -ms-flex: 0 0 33.33333%;\n          flex: 0 0 33.33333%;\n      max-width: 33.33333%; }\n  .large-up-4 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .large-up-4 > .column, .large-up-4 > .columns {\n      -ms-flex: 0 0 25%;\n          flex: 0 0 25%;\n      max-width: 25%; }\n  .large-up-5 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .large-up-5 > .column, .large-up-5 > .columns {\n      -ms-flex: 0 0 20%;\n          flex: 0 0 20%;\n      max-width: 20%; }\n  .large-up-6 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .large-up-6 > .column, .large-up-6 > .columns {\n      -ms-flex: 0 0 16.66667%;\n          flex: 0 0 16.66667%;\n      max-width: 16.66667%; }\n  .large-up-7 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .large-up-7 > .column, .large-up-7 > .columns {\n      -ms-flex: 0 0 14.28571%;\n          flex: 0 0 14.28571%;\n      max-width: 14.28571%; }\n  .large-up-8 {\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n    .large-up-8 > .column, .large-up-8 > .columns {\n      -ms-flex: 0 0 12.5%;\n          flex: 0 0 12.5%;\n      max-width: 12.5%; } }\n\n@media print, screen and (min-width: 64em) and (min-width: 64em) {\n  .large-expand {\n    -ms-flex: 1 1 0px;\n        flex: 1 1 0px; } }\n\n@media print, screen and (min-width: 64em) {\n  .large-flex-dir-row {\n    -ms-flex-direction: row;\n        flex-direction: row; }\n  .large-flex-dir-row-reverse {\n    -ms-flex-direction: row-reverse;\n        flex-direction: row-reverse; }\n  .large-flex-dir-column {\n    -ms-flex-direction: column;\n        flex-direction: column; }\n  .large-flex-dir-column-reverse {\n    -ms-flex-direction: column-reverse;\n        flex-direction: column-reverse; }\n  .large-flex-child-auto {\n    -ms-flex: 1 1 auto;\n        flex: 1 1 auto; }\n  .large-flex-child-grow {\n    -ms-flex: 1 0 auto;\n        flex: 1 0 auto; }\n  .large-flex-child-shrink {\n    -ms-flex: 0 1 auto;\n        flex: 0 1 auto; } }\n\n.row.large-unstack > .column, .row.large-unstack > .columns {\n  -ms-flex: 0 0 100%;\n      flex: 0 0 100%; }\n  @media print, screen and (min-width: 64em) {\n    .row.large-unstack > .column, .row.large-unstack > .columns {\n      -ms-flex: 1 1 0px;\n          flex: 1 1 0px; } }\n\n@media print, screen and (min-width: 64em) {\n  .large-collapse > .column, .large-collapse > .columns {\n    padding-right: 0;\n    padding-left: 0; }\n  .large-uncollapse > .column, .large-uncollapse > .columns {\n    padding-right: 0.625rem;\n    padding-left: 0.625rem; } }\n\n.shrink {\n  -ms-flex: 0 0 auto;\n      flex: 0 0 auto;\n  max-width: 100%; }\n\n.column-block {\n  margin-bottom: 0.9375rem; }\n  .column-block > :last-child {\n    margin-bottom: 0; }\n  @media print, screen and (min-width: 40em) {\n    .column-block {\n      margin-bottom: 1.25rem; }\n      .column-block > :last-child {\n        margin-bottom: 0; } }\n\n.align-right {\n  -ms-flex-pack: end;\n      justify-content: flex-end; }\n\n.align-center {\n  -ms-flex-pack: center;\n      justify-content: center; }\n\n.align-justify {\n  -ms-flex-pack: justify;\n      justify-content: space-between; }\n\n.align-spaced {\n  -ms-flex-pack: distribute;\n      justify-content: space-around; }\n\n.align-top {\n  -ms-flex-align: start;\n      align-items: flex-start; }\n\n.align-self-top {\n  -ms-flex-item-align: start;\n      align-self: flex-start; }\n\n.align-bottom {\n  -ms-flex-align: end;\n      align-items: flex-end; }\n\n.align-self-bottom {\n  -ms-flex-item-align: end;\n      align-self: flex-end; }\n\n.align-middle {\n  -ms-flex-align: center;\n      align-items: center; }\n\n.align-self-middle {\n  -ms-flex-item-align: center;\n      -ms-grid-row-align: center;\n      align-self: center; }\n\n.align-stretch {\n  -ms-flex-align: stretch;\n      align-items: stretch; }\n\n.align-self-stretch {\n  -ms-flex-item-align: stretch;\n      -ms-grid-row-align: stretch;\n      align-self: stretch; }\n\n.small-order-1 {\n  -ms-flex-order: 1;\n      order: 1; }\n\n.small-order-2 {\n  -ms-flex-order: 2;\n      order: 2; }\n\n.small-order-3 {\n  -ms-flex-order: 3;\n      order: 3; }\n\n.small-order-4 {\n  -ms-flex-order: 4;\n      order: 4; }\n\n.small-order-5 {\n  -ms-flex-order: 5;\n      order: 5; }\n\n.small-order-6 {\n  -ms-flex-order: 6;\n      order: 6; }\n\n@media print, screen and (min-width: 40em) {\n  .medium-order-1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .medium-order-2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .medium-order-3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .medium-order-4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .medium-order-5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .medium-order-6 {\n    -ms-flex-order: 6;\n        order: 6; } }\n\n@media print, screen and (min-width: 64em) {\n  .large-order-1 {\n    -ms-flex-order: 1;\n        order: 1; }\n  .large-order-2 {\n    -ms-flex-order: 2;\n        order: 2; }\n  .large-order-3 {\n    -ms-flex-order: 3;\n        order: 3; }\n  .large-order-4 {\n    -ms-flex-order: 4;\n        order: 4; }\n  .large-order-5 {\n    -ms-flex-order: 5;\n        order: 5; }\n  .large-order-6 {\n    -ms-flex-order: 6;\n        order: 6; } }\n\n.hide {\n  display: none !important; }\n\n.invisible {\n  visibility: hidden; }\n\n@media screen and (max-width: 39.9375em) {\n  .hide-for-small-only {\n    display: none !important; } }\n\n@media screen and (max-width: 0em), screen and (min-width: 40em) {\n  .show-for-small-only {\n    display: none !important; } }\n\n@media print, screen and (min-width: 40em) {\n  .hide-for-medium {\n    display: none !important; } }\n\n@media screen and (max-width: 39.9375em) {\n  .show-for-medium {\n    display: none !important; } }\n\n@media screen and (min-width: 40em) and (max-width: 63.9375em) {\n  .hide-for-medium-only {\n    display: none !important; } }\n\n@media screen and (max-width: 39.9375em), screen and (min-width: 64em) {\n  .show-for-medium-only {\n    display: none !important; } }\n\n@media print, screen and (min-width: 64em) {\n  .hide-for-large {\n    display: none !important; } }\n\n@media screen and (max-width: 63.9375em) {\n  .show-for-large {\n    display: none !important; } }\n\n@media screen and (min-width: 64em) and (max-width: 74.9375em) {\n  .hide-for-large-only {\n    display: none !important; } }\n\n@media screen and (max-width: 63.9375em), screen and (min-width: 75em) {\n  .show-for-large-only {\n    display: none !important; } }\n\n.show-for-sr,\n.show-on-focus {\n  position: absolute !important;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0); }\n\n.show-on-focus:active, .show-on-focus:focus {\n  position: static !important;\n  width: auto;\n  height: auto;\n  overflow: visible;\n  clip: auto; }\n\n.show-for-landscape,\n.hide-for-portrait {\n  display: block !important; }\n  @media screen and (orientation: landscape) {\n    .show-for-landscape,\n    .hide-for-portrait {\n      display: block !important; } }\n  @media screen and (orientation: portrait) {\n    .show-for-landscape,\n    .hide-for-portrait {\n      display: none !important; } }\n\n.hide-for-landscape,\n.show-for-portrait {\n  display: none !important; }\n  @media screen and (orientation: landscape) {\n    .hide-for-landscape,\n    .show-for-portrait {\n      display: none !important; } }\n  @media screen and (orientation: portrait) {\n    .hide-for-landscape,\n    .show-for-portrait {\n      display: block !important; } }\n\n/* http://meyerweb.com/eric/tools/css/reset/\n   v2.0 | 20110126\n   License: none (public domain)\n*/\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed,\nfigure, figcaption, footer, header, hgroup,\nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline; }\n\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure,\nfooter, header, hgroup, menu, nav, section {\n  display: block; }\n\nbody {\n  line-height: 1; }\n\nol, ul {\n  list-style: none; }\n\nblockquote, q {\n  quotes: none; }\n\nblockquote:before, blockquote:after,\nq:before, q:after {\n  content: '';\n  content: none; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\nimg {\n  max-width: 100%; }\n\ninput {\n  box-sizing: border-box; }\n\n* {\n  box-sizing: border-box; }\n\n.arrow-up {\n  width: 0;\n  height: 0;\n  border-left: 4px solid transparent;\n  border-right: 4px solid transparent;\n  border-bottom: 6px solid #dedee3; }\n\n.arrow-right {\n  width: 0;\n  height: 0;\n  border-top: 4px solid transparent;\n  border-bottom: 4px solid transparent;\n  border-left: 6px solid #dedee3; }\n\n.arrow-down {\n  width: 0;\n  height: 0;\n  border-left: 4px solid transparent;\n  border-right: 4px solid transparent;\n  border-top: 6px solid #dedee3; }\n\n.arrow-left {\n  width: 0;\n  height: 0;\n  border-top: 4px solid transparent;\n  border-bottom: 4px solid transparent;\n  border-right: 6px solid #dedee3; }\n\ninput:focus, textarea:focus {\n  outline: none; }\n\n.panel {\n  border: 1px solid #dedee3;\n  border-radius: 3px;\n  background-color: white;\n  margin-bottom: 13.33333px; }\n  .panel:not(:first-child) {\n    margin-top: 13.33333px; }\n  .panel-header {\n    padding-top: 10px;\n    padding-right: 10px;\n    padding-bottom: 10px;\n    padding-left: 15px;\n    border-bottom: 1px solid #dedee3;\n    background-color: whitesmoke; }\n  .panel-row {\n    border-bottom: 1px solid #dedee3; }\n  .panel-content {\n    padding: 20px; }\n  .panel input.panel-content {\n    border: none;\n    font-size: 12px;\n    padding: 15px;\n    width: 100%; }\n  .panel-footer {\n    padding: 20px; }\n\n.avatar {\n  display: inline-block;\n  border-radius: 1000px;\n  overflow: hidden;\n  position: relative; }\n  .avatar .img {\n    display: block;\n    width: 100%;\n    padding-top: 100%;\n    background-size: cover;\n    background-position: center; }\n\ninput.search {\n  padding-left: 40px; }\n\n.icon {\n  transition: color .1s ease-in-out,fill .1s ease-in-out, stroke .1s ease-in-out; }\n\n.tabs > * {\n  display: inline-block; }\n\n.menu-dropdown .label {\n  cursor: pointer;\n  padding: 7px 2px; }\n  .menu-dropdown .label, .menu-dropdown .label .icon {\n    fill: #b4b5c0;\n    transition: fill .1s ease-in-out, color .1s ease-in-out; }\n  .menu-dropdown .label:hover, .menu-dropdown .label:hover .icon {\n    fill: #4f7ae8; }\n\ninput.search,\n.input-search > input {\n  padding-left: 40px !important;\n  background-image: url(" + __webpack_require__(673) + ");\n  background-position: 15px 15px;\n  background-repeat: no-repeat; }\n\n.tabs .tab-title {\n  position: relative;\n  bottom: -1px;\n  padding: 10px;\n  font-size: 13px;\n  font-weight: 400;\n  font-style: normal;\n  font-stretch: normal;\n  line-height: 2.25;\n  border-bottom-width: 2px;\n  border-bottom-style: solid;\n  border-bottom-color: transparent;\n  cursor: pointer;\n  color: #202127; }\n  .tabs .tab-title:not(.active) {\n    border-bottom-color: transparent; }\n  .tabs .tab-title.active {\n    border-bottom-color: #4f7ae8; }\n  .tabs .tab-title:not(:last-child) {\n    margin-right: 10px; }\n\n.feed-header-inner {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n  margin-bottom: 0;\n  padding-right: 10px;\n  padding-left: 15px;\n  border-bottom: 1px solid #dedee3;\n  background-color: whitesmoke; }\n\n.feed-header {\n  margin-bottom: 0; }\n\n.feed-header + app-shared-feed-list > .feed-item:first-child {\n  border-top: none;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0; }\n\n.feed-header + .feed-item {\n  border-top: none;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n  margin-top: 0; }\n\n.l-block {\n  display: block; }\n\n.l-inline > *, .l-inline-middle > * {\n  display: inline-block; }\n\n.l-inline-middle > * {\n  vertical-align: middle; }\n\n.l-inline-self {\n  display: inline-block; }\n\n.l-relative {\n  position: relative; }\n\n.l-stack > *:not(:first-child) {\n  margin-top: 20px; }\n\n.l-pool > * {\n  margin-top: 3px;\n  margin-right: 6px;\n  margin-bottom: 3px; }\n\n.l-nowrap {\n  white-space: nowrap; }\n\n.l-centered {\n  margin: 0 auto; }\n\n.l-flex-nowrap {\n  -ms-flex-wrap: nowrap !important;\n      flex-wrap: nowrap !important; }\n\n.l-w-100p {\n  width: 100%; }\n\n.l-h-100p {\n  height: 100%; }\n\n.l-p-default {\n  padding: 20px; }\n\n.l-p-s {\n  padding: 13.33333px; }\n\n.l-p-xs {\n  padding: 10px; }\n\n.s-rounded {\n  border-radius: 1000px;\n  overflow: hidden; }\n\n.s-no-overflow {\n  overflow: hidden; }\n\n.s-overflow-x {\n  overflow-x: auto;\n  overflow-y: hidden;\n  -webkit-overflow-scrolling: touch;\n  max-height: 100%; }\n\n.s-overflow-y {\n  overflow-x: hidden;\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n  max-height: 100%;\n  -webkit-transform: translateZ(0);\n          transform: translateZ(0); }\n\n.s-ellipsis {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden; }\n\n.f-upper {\n  text-transform: uppercase; }\n\n.f-center {\n  text-align: center; }\n\n.f-left {\n  text-align: left; }\n\n.f-right {\n  text-align: right; }\n\nhtml.full-height, html.full-height > body {\n  height: 100%; }\n\nbody {\n  font-family: ClearSans, \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 12px;\n  font-weight: 400;\n  background-color: #ecedf0;\n  color: black;\n  -webkit-transform: translateZ(0);\n          transform: translateZ(0); }\n\nlabel {\n  cursor: pointer; }\n\na,\n.link,\nbutton,\n.button,\ninput[type=\"submit\"] {\n  cursor: pointer;\n  transition: color .1s ease-in-out,background-color .1s ease-in-out, background-color .15s ease-in-out, -webkit-transform .1s ease-in-out;\n  transition: transform .1s ease-in-out, color .1s ease-in-out,background-color .1s ease-in-out, background-color .15s ease-in-out;\n  transition: transform .1s ease-in-out, color .1s ease-in-out,background-color .1s ease-in-out, background-color .15s ease-in-out, -webkit-transform .1s ease-in-out;\n  outline: none;\n  border-style: solid; }\n  a:not(.filled),\n  .link:not(.filled),\n  button:not(.filled),\n  .button:not(.filled),\n  input[type=\"submit\"]:not(.filled) {\n    background-color: transparent;\n    border-color: currentColor; }\n  a:not(.color-primary):not(.color-accent):not(.filled):not(.tab-title),\n  .link:not(.color-primary):not(.color-accent):not(.filled):not(.tab-title),\n  button:not(.color-primary):not(.color-accent):not(.filled):not(.tab-title),\n  .button:not(.color-primary):not(.color-accent):not(.filled):not(.tab-title),\n  input[type=\"submit\"]:not(.color-primary):not(.color-accent):not(.filled):not(.tab-title) {\n    color: #b4b5c0;\n    border-color: #dedee3; }\n  a.filled,\n  .link.filled,\n  button.filled,\n  .button.filled,\n  input[type=\"submit\"].filled {\n    color: white; }\n  a.color-primary:not(.filled),\n  .link.color-primary:not(.filled),\n  button.color-primary:not(.filled),\n  .button.color-primary:not(.filled),\n  input[type=\"submit\"].color-primary:not(.filled) {\n    color: #4f7ae8; }\n    a.color-primary:not(.filled):hover,\n    .link.color-primary:not(.filled):hover,\n    button.color-primary:not(.filled):hover,\n    .button.color-primary:not(.filled):hover,\n    input[type=\"submit\"].color-primary:not(.filled):hover {\n      color: #7899ed; }\n    a.color-primary:not(.filled):active,\n    .link.color-primary:not(.filled):active,\n    button.color-primary:not(.filled):active,\n    .button.color-primary:not(.filled):active,\n    input[type=\"submit\"].color-primary:not(.filled):active {\n      color: #4f7ae8; }\n  a.color-primary.filled,\n  .link.color-primary.filled,\n  button.color-primary.filled,\n  .button.color-primary.filled,\n  input[type=\"submit\"].color-primary.filled {\n    color: white !important;\n    background-color: #3466e5;\n    border-color: #3466e5 !important; }\n    a.color-primary.filled:hover,\n    .link.color-primary.filled:hover,\n    button.color-primary.filled:hover,\n    .button.color-primary.filled:hover,\n    input[type=\"submit\"].color-primary.filled:hover {\n      background-color: #7899ed;\n      border-color: #7899ed; }\n    a.color-primary.filled:active,\n    .link.color-primary.filled:active,\n    button.color-primary.filled:active,\n    .button.color-primary.filled:active,\n    input[type=\"submit\"].color-primary.filled:active {\n      background-color: #4f7ae8;\n      border-color: #4f7ae8; }\n  a.color-accent:not(.filled),\n  .link.color-accent:not(.filled),\n  button.color-accent:not(.filled),\n  .button.color-accent:not(.filled),\n  input[type=\"submit\"].color-accent:not(.filled) {\n    color: #5ace81; }\n    a.color-accent:not(.filled):hover,\n    .link.color-accent:not(.filled):hover,\n    button.color-accent:not(.filled):hover,\n    .button.color-accent:not(.filled):hover,\n    input[type=\"submit\"].color-accent:not(.filled):hover {\n      color: #9de2b4; }\n    a.color-accent:not(.filled):active,\n    .link.color-accent:not(.filled):active,\n    button.color-accent:not(.filled):active,\n    .button.color-accent:not(.filled):active,\n    input[type=\"submit\"].color-accent:not(.filled):active {\n      color: #2f9d54; }\n  a.color-accent.filled,\n  .link.color-accent.filled,\n  button.color-accent.filled,\n  .button.color-accent.filled,\n  input[type=\"submit\"].color-accent.filled {\n    color: white !important;\n    background-color: #5ace81;\n    border-color: #5ace81 !important; }\n    a.color-accent.filled:hover,\n    .link.color-accent.filled:hover,\n    button.color-accent.filled:hover,\n    .button.color-accent.filled:hover,\n    input[type=\"submit\"].color-accent.filled:hover {\n      background-color: #9de2b4;\n      border-color: #9de2b4; }\n    a.color-accent.filled:active,\n    .link.color-accent.filled:active,\n    button.color-accent.filled:active,\n    .button.color-accent.filled:active,\n    input[type=\"submit\"].color-accent.filled:active {\n      background-color: #5ace81;\n      border-color: #5ace81; }\n  a.color-accent-second:not(.filled),\n  .link.color-accent-second:not(.filled),\n  button.color-accent-second:not(.filled),\n  .button.color-accent-second:not(.filled),\n  input[type=\"submit\"].color-accent-second:not(.filled) {\n    color: #7568c0; }\n    a.color-accent-second:not(.filled):hover,\n    .link.color-accent-second:not(.filled):hover,\n    button.color-accent-second:not(.filled):hover,\n    .button.color-accent-second:not(.filled):hover,\n    input[type=\"submit\"].color-accent-second:not(.filled):hover {\n      color: #ada5d9; }\n    a.color-accent-second:not(.filled):active,\n    .link.color-accent-second:not(.filled):active,\n    button.color-accent-second:not(.filled):active,\n    .button.color-accent-second:not(.filled):active,\n    input[type=\"submit\"].color-accent-second:not(.filled):active {\n      color: #493c90; }\n  a.color-accent-second.filled,\n  .link.color-accent-second.filled,\n  button.color-accent-second.filled,\n  .button.color-accent-second.filled,\n  input[type=\"submit\"].color-accent-second.filled {\n    color: white !important;\n    background-color: #7568c0;\n    border-color: #7568c0 !important; }\n    a.color-accent-second.filled:hover,\n    .link.color-accent-second.filled:hover,\n    button.color-accent-second.filled:hover,\n    .button.color-accent-second.filled:hover,\n    input[type=\"submit\"].color-accent-second.filled:hover {\n      background-color: #ada5d9;\n      border-color: #ada5d9; }\n    a.color-accent-second.filled:active,\n    .link.color-accent-second.filled:active,\n    button.color-accent-second.filled:active,\n    .button.color-accent-second.filled:active,\n    input[type=\"submit\"].color-accent-second.filled:active {\n      background-color: #7568c0;\n      border-color: #7568c0; }\n\na, .link {\n  text-decoration: none;\n  border-color: transparent; }\n\nbutton, .button, input[type=\"submit\"] {\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -ms-flex-align: center;\n      align-items: center;\n  border-radius: 3px; }\n  button:not(.icon):not(.text), .button:not(.icon):not(.text), input[type=\"submit\"]:not(.icon):not(.text) {\n    border-radius: 3px;\n    border-width: 1px; }\n  button:not(.with-icon), .button:not(.with-icon), input[type=\"submit\"]:not(.with-icon) {\n    padding: 4px 12px 5px; }\n  button.icon, button.text, .button.icon, .button.text, input[type=\"submit\"].icon, input[type=\"submit\"].text {\n    border: none; }\n  button.with-icon, .button.with-icon, input[type=\"submit\"].with-icon {\n    position: relative;\n    padding: 4px 12px 5px 25px; }\n    button.with-icon .icon-wrapper, .button.with-icon .icon-wrapper, input[type=\"submit\"].with-icon .icon-wrapper {\n      position: absolute;\n      width: 20px;\n      top: 50%;\n      left: 2px;\n      -webkit-transform: translate(0, -50%);\n              transform: translate(0, -50%); }\n      button.with-icon .icon-wrapper svg, .button.with-icon .icon-wrapper svg, input[type=\"submit\"].with-icon .icon-wrapper svg {\n        position: relative;\n        top: 1px; }\n\n.color-primary {\n  color: #4f7ae8; }\n\n.color-accent {\n  color: #5ace81; }\n\n.color-accent-second {\n  color: #7568c0; }\n\n.list-item {\n  border-left-width: 0 !important;\n  border-right-width: 0 !important; }\n", ""]);

// exports


/***/ }),

/***/ 673:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "ic-search.0e08edcb619f02b3ff65.svg";

/***/ })

},[1101]);
//# sourceMappingURL=styles-900d9d4a73a662fec206.bundle.js.map