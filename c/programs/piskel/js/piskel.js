
// TODO(grosbouddha): put under pskl namespace.
var Constants = {
  DEFAULT : {
    HEIGHT : 128,//96,
    WIDTH : 96,//128,
    FPS : 12
  },

  MODEL_VERSION : 2,

  MAX_HEIGHT : 1024,
  MAX_WIDTH : 1024,

  MAX_CURRENT_COLORS_DISPLAYED : 100,

  MINIMUM_ZOOM : 1,

  PREVIEW_FILM_SIZE : 86,
  ANIMATED_PREVIEW_WIDTH : 200,

  DEFAULT_PEN_COLOR : '#000000',
  TRANSPARENT_COLOR : 'rgba(0, 0, 0, 0)',

  CURRENT_COLORS_PALETTE_ID : '__current-colors',

  /*
   * Fake semi-transparent color used to highlight transparent
   * strokes and rectangles:
   */
  SELECTION_TRANSPARENT_COLOR: 'rgba(255, 255, 255, 0.6)',

  /*
   * When a tool is hovering the drawing canvas, we highlight the eventual
   * pixel target with this color:
   */
  TOOL_TARGET_HIGHLIGHT_COLOR: 'rgba(100, 100, 100, 0.5)',


  ZOOMED_OUT_BACKGROUND_COLOR : '#808080', //'#A0A0A0',

  LEFT_BUTTON : 0,
  MIDDLE_BUTTON : 1,
  RIGHT_BUTTON : 2,
  MOUSEMOVE_THROTTLING : 10,

  ABSTRACT_FUNCTION : function () {throw 'abstract method should be implemented';},
  EMPTY_FUNCTION : function () {},

  // TESTS
  DRAWING_TEST_FOLDER : 'drawing',

  // SERVICE URLS
  APPENGINE_SAVE_URL : 'save',
  IMAGE_SERVICE_UPLOAD_URL : 'http://piskel-imgstore-b.appspot.com/__/upload',
  IMAGE_SERVICE_GET_URL : 'http://piskel-imgstore-b.appspot.com/img/'
};;// TODO(grosbouddha): put under pskl namespace.
var Events = {

  TOOL_SELECTED : "TOOL_SELECTED",
  SELECT_TOOL : "SELECT_TOOL",

  TOOL_RELEASED : "TOOL_RELEASED",
  TOOL_PRESSED : "TOOL_PRESSED",
  SELECT_PRIMARY_COLOR: "SELECT_PRIMARY_COLOR",
  SELECT_SECONDARY_COLOR: "SELECT_SECONDARY_COLOR",
  PRIMARY_COLOR_SELECTED : 'PRIMARY_COLOR_SELECTED',
  SECONDARY_COLOR_SELECTED : 'SECONDARY_COLOR_SELECTED',

  CURSOR_MOVED : 'CURSOR_MOVED',
  DRAG_START : 'DRAG_START',
  DRAG_END : 'DRAG_END',

  DIALOG_DISPLAY : 'DIALOG_DISPLAY',
  DIALOG_HIDE : 'DIALOG_HIDE',

  PALETTE_LIST_UPDATED : 'PALETTE_LIST_UPDATED',

  /**
   * Fired each time a user setting change.
   * The payload will be:
   *   1st argument: Name of the settings
   *   2nd argument: New value
   */
  USER_SETTINGS_CHANGED: "USER_SETTINGS_CHANGED",

  CLOSE_SETTINGS_DRAWER : "CLOSE_SETTINGS_DRAWER",

  /**
   * The framesheet was reseted and is now probably drastically different.
   * Number of frames, content of frames, color used for the palette may have changed.
   */
  PISKEL_RESET: "PISKEL_RESET",
  PISKEL_SAVE_STATE: "PISKEL_SAVE_STATE",

  PISKEL_SAVED: "PISKEL_SAVED",

  FRAME_SIZE_CHANGED : "FRAME_SIZE_CHANGED",

  SELECTION_CREATED: "SELECTION_CREATED",
  SELECTION_MOVE_REQUEST: "SELECTION_MOVE_REQUEST",
  SELECTION_DISMISSED: "SELECTION_DISMISSED",

  SHOW_NOTIFICATION: "SHOW_NOTIFICATION",
  HIDE_NOTIFICATION: "HIDE_NOTIFICATION",

  SHOW_PROGRESS: "SHOW_PROGRESS",
  UPDATE_PROGRESS: "UPDATE_PROGRESS",
  HIDE_PROGRESS: "HIDE_PROGRESS",

  ZOOM_CHANGED : "ZOOM_CHANGED",

  CURRENT_COLORS_UPDATED : "CURRENT_COLORS_UPDATED",

  MOUSE_EVENT : "MOUSE_EVENT",

  // Tests
  TEST_RECORD_END : "TEST_RECORD_END",
  TEST_CASE_END : "TEST_CASE_END",
  TEST_SUITE_END : "TEST_SUITE_END"
};;jQuery.namespace = function() {
  var a=arguments, o=null, i, j, d;
  for (i=0; i<a.length; i=i+1) {
    d=a[i].split(".");
    o=window;
    for (j=0; j<d.length; j=j+1) {
      o[d[j]]=o[d[j]] || {};
      o=o[d[j]];
    }
  }
  return o;
};

/**
 * Need a polyfill for PhantomJS
 */
/*if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var bindArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          var args = bindArgs.concat(Array.prototype.slice.call(arguments));
          return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, args);
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}*/

/**
 * @provide pskl.utils
 *
 * @require Constants
 */
(function() { // namespace: pskl.utils

  var ns = $.namespace("pskl.utils");

  /**
   * Convert a rgb(Number, Number, Number) color to hexadecimal representation
   * @param  {Number} r red value, between 0 and 255
   * @param  {Number} g green value, between 0 and 255
   * @param  {Number} b blue value, between 0 and 255
   * @return {String} hex representation of the color '#ABCDEF'
   */
  ns.rgbToHex = function (r, g, b) {
    return "#" + pskl.utils.componentToHex(r) + pskl.utils.componentToHex(g) + pskl.utils.componentToHex(b);
  };

  /**
   * Convert a color component (as a Number between 0 and 255) to its string hexa representation
   * @param  {Number} c component value, between 0 and 255
   * @return {String} eg. '0A'
   */
  ns.componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  ns.normalize = function (value, def) {
    if (typeof value === 'undefined' || value === null) {
      return def;
    } else {
      return value;
    }
  };

  ns.inherit = function(extendedObject, inheritFrom) {
    extendedObject.prototype = Object.create(inheritFrom.prototype);
    extendedObject.prototype.constructor = extendedObject;
    extendedObject.prototype.superclass = inheritFrom.prototype;
  };

  ns.wrap = function (wrapper, wrappedObject) {
    for (var prop in wrappedObject) {
      if (typeof wrappedObject[prop] === 'function' && typeof wrapper[prop] === 'undefined') {
        wrapper[prop] = wrappedObject[prop].bind(wrappedObject);
      }
    }
  };

  ns.hashCode = function(str) {
    var hash = 0;
    if (str.length !== 0) {
      for (var i = 0, l = str.length; i < l; i++) {
        var chr = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
    }
    return hash;
  };

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };
  ns.escapeHtml= function (string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  };

  var reEntityMap = {};
  ns.unescapeHtml= function (string) {
    Object.keys(entityMap).forEach(function(key) {
      reEntityMap[key] = reEntityMap[key] || new RegExp(entityMap[key], "g");
      string = string.replace(reEntityMap[key], key);
    });
    return string;
  };

})();

;(function () {
  var ns = $.namespace('pskl.utils');
  var ua = navigator.userAgent;

  ns.UserAgent = {
    isIE : /MSIE/i.test( ua ),
    isIE11 : /trident/i.test( ua ),
    isChrome : /Chrome/i.test( ua ),
    isFirefox : /Firefox/i.test( ua ),
    isMac : /Mac/.test( ua )
  };

  ns.UserAgent.version = (function () {
    if (pskl.utils.UserAgent.isIE) {
      return parseInt(/MSIE\s?(\d+)/i.exec( ua )[1], 10);
    } else if (pskl.utils.UserAgent.isChrome) {
      return parseInt(/Chrome\/(\d+)/i.exec( ua )[1], 10);
    } else if (pskl.utils.UserAgent.isFirefox) {
      return parseInt(/Firefox\/(\d+)/i.exec( ua )[1], 10);
    }
  })();
})();;(function () {
  var ns = $.namespace('pskl.utils');

  ns.Array = {
    find : function (array, filterFn) {
      var match = null;
      array = Array.isArray(array) ? array : [];
      var filtered = array.filter(filterFn);
      if (filtered.length) {
        match = filtered[0];
      }
      return match;
    }
  };

})();;(function () {
  var ns = $.namespace('pskl.utils');

  var base64_ranks;
  if (Uint8Array) {
    base64_ranks = new Uint8Array([
      62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1,
      -1, -1,  0, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
      10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
      -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
      36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
    ]);
  }

  ns.Base64 = {
    toText : function (base64) {
      return window.atob(base64.replace(/data\:.*?\;base64\,/,''));
    },

    decode : function(base64) {
      var outptr = 0;
      var last = [0, 0];
      var state = 0;
      var save = 0;

      var undef;
      var len = base64.length, i = 0;
      var buffer = new Uint8Array(len / 4 * 3 | 0);
      while (len--) {
        var code = base64.charCodeAt(i++);
        var rank = base64_ranks[code-43];
        if (rank !== 255 && rank !== undef) {
          last[1] = last[0];
          last[0] = code;
          save = (save << 6) | rank;
          state++;
          if (state === 4) {
            buffer[outptr++] = save >>> 16;
            if (last[1] !== 61 /* padding character */) {
              buffer[outptr++] = save >>> 8;
            }
            if (last[0] !== 61 /* padding character */) {
              buffer[outptr++] = save;
            }
            state = 0;
          }
        }
      }
      // 2/3 chance there's going to be some null bytes at the end, but that
      // doesn't really matter with most image formats.
      // If it somehow matters for you, truncate the buffer up outptr.
      return buffer.buffer;
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');



  var BASE64_REGEX = /\s*;\s*base64\s*(?:;|$)/i;

  ns.BlobUtils = {
    dataToBlob : function(dataURI, type, callback) {
      var header_end = dataURI.indexOf(","),
          data = dataURI.substring(header_end + 1),
          isBase64 = BASE64_REGEX.test(dataURI.substring(0, header_end)),
          blob;

      if (Blob.fake) {
        // no reason to decode a data: URI that's just going to become a data URI again
        blob = new Blob();
        blob.encoding = isBase64 ? "base64" : "URI";
        blob.data = data;
        blob.size = data.length;
      } else if (Uint8Array) {
        var blobData = isBase64 ? pskl.utils.Base64.decode(data) : decodeURIComponent(data);
        blob = new Blob([blobData], {type: type});
      }
      callback(blob);
    },

    canvasToBlob : function(canvas, callback, type /*, ...args*/) {
      type = type || "image/png";

      if (canvas.mozGetAsFile) {
        callback(canvas.mozGetAsFile("canvas", type));
      } else {
        var args = Array.prototype.slice.call(arguments, 2);
        var dataURI = canvas.toDataURL.apply(canvas, args);
        pskl.utils.BlobUtils.dataToBlob(dataURI, type, callback);
      }
    },

    stringToBlob : function (string, callback, type) {
      type = type || "text/plain";
      pskl.utils.BlobUtils.dataToBlob('data:'+type+',' + string, type, callback);
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');

  ns.CanvasUtils = {
    createCanvas : function (width, height, classList) {
      var canvas = document.createElement('canvas');
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);

      if (typeof classList == 'string') {
        classList = [classList];
      }
      if (Array.isArray(classList)) {
        for (var i = 0 ; i < classList.length ; i++) {
          canvas.classList.add(classList[i]);
        }
      }

      return canvas;
    },

    createFromImageData : function (imageData) {
      var canvas = pskl.utils.CanvasUtils.createCanvas(imageData.width, imageData.height);
      var context = canvas.getContext('2d');
      context.putImageData(imageData, 0, 0);
      return canvas;
    },

    createFromImage : function (image) {
      var canvas = pskl.utils.CanvasUtils.createCanvas(image.width, image.height);
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      return canvas;
    },

    /**
     * By default, all scaling operations on a Canvas 2D Context are performed using antialiasing.
     * Resizing a 32x32 image to 320x320 will lead to a blurry output.
     * On Chrome, FF and IE>=11, this can be disabled by setting a property on the Canvas 2D Context.
     * In this case the browser will use a nearest-neighbor scaling.
     * @param  {Canvas} canvas
     */
    disableImageSmoothing : function (canvas) {
      var context = canvas.getContext('2d');
      context.imageSmoothingEnabled = false;
      context.mozImageSmoothingEnabled = false;
      context.oImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;
      context.msImageSmoothingEnabled = false;
    },

    clear : function (canvas) {
      if (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      }
    },

    clone : function (canvas) {
      var clone = pskl.utils.CanvasUtils.createCanvas(canvas.width, canvas.height);

      //apply the old canvas to the new one
      clone.getContext('2d').drawImage(canvas, 0, 0);

      //return the new canvas
      return clone;
    },

    getImageDataFromCanvas : function (canvas) {
      var sourceContext = canvas.getContext('2d');
      return sourceContext.getImageData(0, 0, canvas.width, canvas.height).data;
    },

    getBase64FromCanvas : function (canvas, format) {
      format = format || 'png';
      var data = canvas.toDataURL('image/' + format);
      return data.substr(data.indexOf(',')+1);
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');

  var pad = function (num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return "" + num;
    }
  };

  ns.DateUtils = {
    format : function (date, format) {
      date = new Date(date);
      return pskl.utils.Template.replace(format, {
        Y : date.getFullYear(),
        M : pad(date.getMonth() + 1),
        D : pad(date.getDate()),
        H : pad(date.getHours()),
        m : pad(date.getMinutes()),
        s : pad(date.getSeconds())
      });
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');

  ns.Dom = {
    /**
     * Check if a given HTML element is nested inside another
     * @param  {HTMLElement}  node  Element to test
     * @param  {HTMLElement}  parent Potential Ancestor for node
     * @param  {Boolean}      excludeParent set to true if the parent should be excluded from potential matches
     * @return {Boolean}      true if parent was found amongst the parentNode chain of node
     */
    isParent : function (node, parent, excludeParent) {
      if (node && parent) {

        if (excludeParent) {
          node = node.parentNode;
        }

        while (node) {
          if (node === parent) {
            return true;
          }
          node = node.parentNode;
        }
      }
      return false;
    },

    getParentWithData : function (node, data) {
      while (node) {
        if (node.dataset && typeof node.dataset[data] !== 'undefined') {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');

  ns.Math = {
    minmax : function (val, min, max) {
      return Math.max(Math.min(val, max), min);
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');

  var stopPropagation = function (e) {
    e.stopPropagation();
  };

  ns.FileUtils = {
    readFile : function (file, callback) {
      var reader = new FileReader();
      reader.onload = function(event){
        callback(event.target.result);
      };
      reader.readAsDataURL(file);
    },

    readImageFile : function (file, callback) {
      ns.FileUtils.readFile(file, function (content) {
        var image = new Image();
        image.onload = callback.bind(null, image);
        image.src = content;
      });
    },

    downloadAsFile : function (content, filename) {
      var saveAs = window.saveAs || (navigator.msSaveBlob && navigator.msSaveBlob.bind(navigator));
      if (saveAs) {
        saveAs(content, filename);
      } else {
        var downloadLink = document.createElement('a');
        content = window.URL.createObjectURL(content);
        downloadLink.setAttribute('href', content);
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.addEventListener('click', stopPropagation);
        downloadLink.click();
        downloadLink.removeEventListener('click', stopPropagation);
        document.body.removeChild(downloadLink);
      }
    }
  };
})();
;(function () {
  var ns = $.namespace('pskl.utils');

  ns.FrameTransform = {
    VERTICAL : 'vertical',
    HORIZONTAL : 'HORIZONTAL',
    flip : function (frame, axis) {
      var clone = frame.clone();
      var w = frame.getWidth();
      var h = frame.getHeight();

      clone.forEachPixel(function (color, x, y) {
        if (axis === ns.FrameTransform.VERTICAL) {
          x = w-x-1;
        } else if (axis === ns.FrameTransform.HORIZONTAL) {
          y = h-y-1;
        }
        frame.pixels[x][y] = color;
      });
      frame.version++;
      return frame;
    },

    CLOCKWISE : 'clockwise',
    COUNTERCLOCKWISE : 'counterclockwise',
    rotate : function (frame, direction) {
      var clone = frame.clone();
      var w = frame.getWidth();
      var h = frame.getHeight();

      var max =  Math.max(w, h);
      var xDelta = Math.ceil((max - w)/2);
      var yDelta = Math.ceil((max - h)/2);

      frame.forEachPixel(function (color, x, y) {
        var _x = x, _y = y;

        // Convert to square coords
        x = x + xDelta;
        y = y + yDelta;

        // Perform the rotation
        var tmpX = x, tmpY = y;
        if (direction === ns.FrameTransform.CLOCKWISE) {
          x = tmpY;
          y = max - 1 - tmpX;
        } else if (direction === ns.FrameTransform.COUNTERCLOCKWISE) {
          y = tmpX;
          x = max - 1 - tmpY;
        }

        // Convert the coordinates back to the rectangular grid
        x = x - xDelta;
        y = y - yDelta;
        if (clone.containsPixel(x, y)) {
          frame.pixels[_x][_y] = clone.getPixel(x, y);
        } else {
          frame.pixels[_x][_y] = Constants.TRANSPARENT_COLOR;
        }
      });
      frame.version++;
      return frame;
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');
  var colorCache = {};
  ns.FrameUtils = {
    /**
     * Render a Frame object as an image.
     * Can optionally scale it (zoom)
     * @param  {Frame} frame
     * @param  {Number} zoom
     * @return {Image}
     */
    toImage : function (frame, zoom) {
      zoom = zoom || 1;
      var canvasRenderer = new pskl.rendering.CanvasRenderer(frame, zoom);
      canvasRenderer.drawTransparentAs(Constants.TRANSPARENT_COLOR);
      return canvasRenderer.render();
    },

    merge : function (frames) {
      var merged = null;
      if (frames.length) {
        merged = frames[0].clone();
        var w = merged.getWidth(), h = merged.getHeight();
        for (var i = 1 ; i < frames.length ; i++) {
          pskl.utils.FrameUtils.mergeFrames_(merged, frames[i]);
        }
      }
      return merged;
    },

    mergeFrames_ : function (frameA, frameB) {
      frameB.forEachPixel(function (color, col, row) {
        if (color != Constants.TRANSPARENT_COLOR) {
          frameA.setPixel(col, row, color);
        }
      });
    },

    resize : function (frame, targetWidth, targetHeight, smoothing) {
      var image = pskl.utils.FrameUtils.toImage(frame);
      var resizedImage = pskl.utils.ImageResizer.resize(image, targetWidth, targetHeight, smoothing);
      return pskl.utils.FrameUtils.createFromImage(resizedImage);
    },

    /*
     * Create a pskl.model.Frame from an Image object.
     * Transparent pixels will either be converted to completely opaque or completely transparent pixels.
     * @param  {Image} image source image
     * @return {pskl.model.Frame} corresponding frame
     */
    createFromImage : function (image) {
      var w = image.width,
        h = image.height;
      var canvas = pskl.utils.CanvasUtils.createCanvas(w, h);
      var context = canvas.getContext('2d');

      context.drawImage(image, 0,0,w,h,0,0,w,h);
      var imgData = context.getImageData(0,0,w,h).data;
      return pskl.utils.FrameUtils.createFromImageData_(imgData, w, h);
    },

    createFromImageData_ : function (imageData, width, height) {
      // Draw the zoomed-up pixels to a different canvas context
      var grid = [];
      for (var x = 0 ; x < width ; x++){
        grid[x] = [];
        for (var y = 0 ; y < height ; y++){
          // Find the starting index in the one-dimensional image data
          var i = (y * width + x)*4;
          var r = imageData[i  ];
          var g = imageData[i+1];
          var b = imageData[i+2];
          var a = imageData[i+3];
          if (a < 125) {
            grid[x][y] = Constants.TRANSPARENT_COLOR;
          } else {
            grid[x][y] = pskl.utils.rgbToHex(r,g,b);
          }
        }
      }
      return pskl.model.Frame.fromPixelGrid(grid);
    },

    /**
     * Alpha compositing using porter duff algorithm :
     * http://en.wikipedia.org/wiki/Alpha_compositing
     * http://keithp.com/~keithp/porterduff/p253-porter.pdf
     * @param  {String} strColor1 color over
     * @param  {String} strColor2 color under
     * @return {String} the composite color
     */
    mergePixels__ : function (strColor1, strColor2, globalOpacity1) {
      var col1 = pskl.utils.FrameUtils.toRgba__(strColor1);
      var col2 = pskl.utils.FrameUtils.toRgba__(strColor2);
      if (typeof globalOpacity1 == 'number') {
        col1 = JSON.parse(JSON.stringify(col1));
        col1.a = globalOpacity1 * col1.a;
      }
      var a = col1.a + col2.a * (1 - col1.a);

      var r = ((col1.r * col1.a + col2.r * col2.a * (1 - col1.a)) / a)|0;
      var g = ((col1.g * col1.a + col2.g * col2.a * (1 - col1.a)) / a)|0;
      var b = ((col1.b * col1.a + col2.b * col2.a * (1 - col1.a)) / a)|0;

      return 'rgba('+r+','+g+','+b+','+a+')';
    },

    /**
     * Convert a color defined as a string (hex, rgba, rgb, 'TRANSPARENT') to an Object with r,g,b,a properties.
     * r, g and b are integers between 0 and 255, a is a float between 0 and 1
     * @param  {String} c color as a string
     * @return {Object} {r:Number,g:Number,b:Number,a:Number}
     */
    toRgba__ : function (c) {
      if (colorCache[c]) {
        return colorCache[c];
      }
      var color, matches;
      if (c === 'TRANSPARENT') {
        color = {
          r : 0,
          g : 0,
          b : 0,
          a : 0
        };
      } else if (c.indexOf('rgba(') != -1) {
        matches = /rgba\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(1|0\.\d+)\s*\)/.exec(c);
        color = {
          r : parseInt(matches[1],10),
          g : parseInt(matches[2],10),
          b : parseInt(matches[3],10),
          a : parseFloat(matches[4])
        };
      } else if (c.indexOf('rgb(') != -1) {
        matches = /rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(c);
        color = {
          r : parseInt(matches[1],10),
          g : parseInt(matches[2],10),
          b : parseInt(matches[3],10),
          a : 1
        };
      } else {
        matches = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
        color = {
          r : parseInt(matches[1], 16),
          g : parseInt(matches[2], 16),
          b : parseInt(matches[3], 16),
          a : 1
        };
      }
      colorCache[c] = color;
      return color;
    }
  };
})();
;(function () {
  var ns = $.namespace('pskl.utils');

  ns.LayerUtils = {
    /**
     * Create a pskl.model.Layer from an Image object.
     * Transparent pixels will either be converted to completely opaque or completely transparent pixels.
     * @param  {Image} image source image
     * @return {pskl.model.Frame} corresponding frame
     */
    createLayerFromSpritesheet : function (image, frameCount) {
      var width = image.width,
        height = image.height,
        frameWidth = width / frameCount;

      var canvas = pskl.utils.CanvasUtils.createCanvas(frameWidth, height);
      var context = canvas.getContext('2d');

      // Draw the zoomed-up pixels to a different canvas context
      var frames = [];
      for (var i = 0 ; i < frameCount ; i++) {
        context.clearRect(0, 0 , frameWidth, height);
        context.drawImage(image, frameWidth * i, 0, frameWidth, height, 0, 0, frameWidth, height);
        var frame = pskl.utils.FrameUtils.createFromImage(canvas);
        frames.push(frame);
      }
      return frames;
    },

    mergeLayers : function (layerA, layerB) {
      var framesA = layerA.getFrames();
      var framesB = layerB.getFrames();
      var mergedFrames = [];
      framesA.forEach(function (frame, index) {
        var otherFrame = framesB[index];
        mergedFrames.push(pskl.utils.FrameUtils.merge([otherFrame, frame]));
      });
      var mergedLayer = pskl.model.Layer.fromFrames(layerA.getName(), mergedFrames);
      return mergedLayer;
    }
  };

})();;(function () {
  var ns = $.namespace('pskl.utils');

  ns.ImageResizer = {
    resize : function (image, targetWidth, targetHeight, smoothingEnabled) {
      var canvas = pskl.utils.CanvasUtils.createCanvas(targetWidth, targetHeight);
      var context = canvas.getContext('2d');
      context.save();

      if (!smoothingEnabled) {
        pskl.utils.CanvasUtils.disableImageSmoothing(canvas);
      }

      context.translate(canvas.width / 2, canvas.height / 2);
      context.scale(targetWidth / image.width, targetHeight / image.height);
      context.drawImage(image, -image.width / 2, -image.height / 2);
      context.restore();

      return canvas;
    },

    /**
     * Manual implementation of resize using a nearest neighbour algorithm
     * It is slower than relying on the native 'disabledImageSmoothing' available on CanvasRenderingContext2d.
     * But it can be useful if :
     * - IE < 11 (doesn't support msDisableImageSmoothing)
     * - need to display a gap between pixel
     *
     * @param  {Canvas2d} source original image to be resized, as a 2d canvas
     * @param  {Number} zoom   ratio between desired dim / source dim
     * @param  {Number} margin gap to be displayed between pixels
     * @param  {String} color or the margin (will be transparent if not provided)
     * @return {Canvas2d} the resized canvas
     */
    resizeNearestNeighbour : function (source, zoom, margin, marginColor) {
      margin = margin || 0;
      var canvas = pskl.utils.CanvasUtils.createCanvas(zoom*source.width, zoom*source.height);
      var context = canvas.getContext('2d');

      var imgData = pskl.utils.CanvasUtils.getImageDataFromCanvas(source);

      var yRanges = {},
        xOffset = 0,
        yOffset = 0,
        xRange,
        yRange;
      // Draw the zoomed-up pixels to a different canvas context
      for (var x = 0; x < source.width; x++) {
        // Calculate X Range
        xRange = Math.floor((x + 1) * zoom) - xOffset;

        for (var y = 0; y < source.height; y++) {
          // Calculate Y Range
          if (!yRanges[y + ""]) {
            // Cache Y Range
            yRanges[y + ""] = Math.floor((y + 1) * zoom) - yOffset;
          }
          yRange = yRanges[y + ""];

          var i = (y * source.width + x) * 4;
          var r = imgData[i];
          var g = imgData[i + 1];
          var b = imgData[i + 2];
          var a = imgData[i + 3];

          context.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
          context.fillRect(xOffset, yOffset, xRange-margin, yRange-margin);

          if (margin && marginColor) {
            context.fillStyle = marginColor;
            context.fillRect(xOffset + xRange - margin, yOffset, margin, yRange);
            context.fillRect(xOffset, yOffset + yRange - margin, xRange, margin);
          }

          yOffset += yRange;
        }
        yOffset = 0;
        xOffset += xRange;
      }
      return canvas;
    }
  };
})();;(function () {
  var ns = $.namespace("pskl");

  ns.PixelUtils = {

    getRectanglePixels : function (x0, y0, x1, y1) {
      var rectangle = this.getOrderedRectangleCoordinates(x0, y0, x1, y1);
      var pixels = [];

      for(var x = rectangle.x0; x <= rectangle.x1; x++) {
        for(var y = rectangle.y0; y <= rectangle.y1; y++) {
          pixels.push({"col": x, "row": y});
        }
      }

      return pixels;
    },

    getBoundRectanglePixels : function (x0, y0, x1, y1) {
      var rectangle = this.getOrderedRectangleCoordinates(x0, y0, x1, y1);
      var pixels = [];
      // Creating horizontal sides of the rectangle:
      for(var x = rectangle.x0; x <= rectangle.x1; x++) {
        pixels.push({"col": x, "row": rectangle.y0});
        pixels.push({"col": x, "row": rectangle.y1});
      }

      // Creating vertical sides of the rectangle:
      for(var y = rectangle.y0; y <= rectangle.y1; y++) {
        pixels.push({"col": rectangle.x0, "row": y});
        pixels.push({"col": rectangle.x1, "row": y});
      }

      return pixels;
    },

    /**
     * Return an object of ordered rectangle coordinate.
     * In returned object {x0, y0} => top left corner - {x1, y1} => bottom right corner
     * @private
     */
    getOrderedRectangleCoordinates : function (x0, y0, x1, y1) {
      return {
        x0 : Math.min(x0, x1),
        y0 : Math.min(y0, y1),
        x1 : Math.max(x0, x1),
        y1 : Math.max(y0, y1)
      };
    },

    /**
     * Return the list of pixels that would have been filled by a paintbucket tool applied
     * on pixel at coordinate (x,y).
     * This function is not altering the Frame object argument.
     *
     * @param frame pskl.model.Frame The frame target in which we want to paintbucket
     * @param col number Column coordinate in the frame
     * @param row number Row coordinate in the frame
     *
     * @return an array of the pixel coordinates paint with the replacement color
     */
    getSimilarConnectedPixelsFromFrame: function(frame, col, row) {
      // To get the list of connected (eg the same color) pixels, we will use the paintbucket algorithm
      // in a fake cloned frame. The returned pixels by the paintbucket algo are the painted pixels
      // and are as well connected.
      var fakeFrame = frame.clone(); // We just want to
      var fakeFillColor = "sdfsdfsdf"; // A fake color that will never match a real color.
      var paintedPixels = this.paintSimilarConnectedPixelsFromFrame(fakeFrame, col, row, fakeFillColor);

      return paintedPixels;
    },

    /**
     * Apply the paintbucket tool in a frame at the (col, row) initial position
     * with the replacement color.
     *
     * @param frame pskl.model.Frame The frame target in which we want to paintbucket
     * @param col number Column coordinate in the frame
     * @param row number Row coordinate in the frame
     * @param replacementColor string Hexadecimal color used to fill the area
     *
     * @return an array of the pixel coordinates paint with the replacement color
     */
    paintSimilarConnectedPixelsFromFrame: function(frame, col, row, replacementColor) {
      /**
       *  Queue linear Flood-fill (node, target-color, replacement-color):
       *   1. Set Q to the empty queue.
       *   2. If the color of node is not equal to target-color, return.
       *   3. Add node to Q.
       *   4. For each element n of Q:
       *   5.     If the color of n is equal to target-color:
       *   6.         Set w and e equal to n.
       *   7.         Move w to the west until the color of the node to the west of w no longer matches target-color.
       *   8.         Move e to the east until the color of the node to the east of e no longer matches target-color.
       *   9.         Set the color of nodes between w and e to replacement-color.
       *  10.         For each node n between w and e:
       *  11.             If the color of the node to the north of n is target-color, add that node to Q.
       *  12.             If the color of the node to the south of n is target-color, add that node to Q.
       *  13. Continue looping until Q is exhausted.
       *  14. Return.
       */
      var paintedPixels = [];
      var queue = [];
      var dy = [-1, 0, 1, 0];
      var dx = [0, 1, 0, -1];
      var targetColor;
      try {
        targetColor = frame.getPixel(col, row);
      } catch(e) {
        // Frame out of bound exception.
      }

      if(targetColor == replacementColor) {
        return;
      }


      queue.push({"col": col, "row": row});
      var loopCount = 0;
      var cellCount = frame.getWidth() * frame.getHeight();
      while(queue.length > 0) {
        loopCount ++;

        var currentItem = queue.pop();
        frame.setPixel(currentItem.col, currentItem.row, replacementColor);
        paintedPixels.push({"col": currentItem.col, "row": currentItem.row });

        for (var i = 0; i < 4; i++) {
          var nextCol = currentItem.col + dx[i];
          var nextRow = currentItem.row + dy[i];
          try {
            if (frame.containsPixel(nextCol, nextRow)  && frame.getPixel(nextCol, nextRow) == targetColor) {
              queue.push({"col": nextCol, "row": nextRow });
            }
          } catch(e) {
            // Frame out of bound exception.
          }
        }

        // Security loop breaker:
        if(loopCount > 10 * cellCount) {
          console.log("loop breaker called");
          break;
        }
      }
      return paintedPixels;
    },

    /**
     * Calculate and return the maximal zoom level to display a picture in a given container.
     *
     * @param container jQueryObject Container where the picture should be displayed
     * @param number pictureHeight height in pixels of the picture to display
     * @param number pictureWidth width in pixels of the picture to display
     * @return number maximal zoom
     */
    calculateZoomForContainer : function (container, pictureHeight, pictureWidth) {
      return this.calculateZoom(container.height(), container.width(), pictureHeight, pictureWidth);
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');

  ns.PiskelFileUtils = {
    /**
     * Load a piskel from a piskel file.
     * After deserialization is successful, the provided success callback will be called.
     * Success callback is expected to handle 3 arguments : (piskel:Piskel, descriptor:PiskelDescriptor, fps:Number)
     * @param  {File} file the .piskel file to load
     * @param  {Function} onSuccess Called if the deserialization of the piskel is successful
     * @param  {Function} onError NOT USED YET
     */
    loadFromFile : function (file, onSuccess, onError) {
      pskl.utils.FileUtils.readFile(file, function (content) {
        var rawPiskel = pskl.utils.Base64.toText(content);
        var serializedPiskel = JSON.parse(rawPiskel);
        var fps = serializedPiskel.piskel.fps;
        var descriptor = new pskl.model.piskel.Descriptor(serializedPiskel.piskel.name, serializedPiskel.piskel.description, true);
        pskl.utils.serialization.Deserializer.deserialize(serializedPiskel, function (piskel) {
          onSuccess(piskel, descriptor, fps);
        });
      });
    }
  };
})();;(function () {
  var ns = $.namespace("pskl.utils");
  var templates = {};

  ns.Template = {
    get : function (templateId) {
      if (!templates[templateId]) {
        var template = document.getElementById(templateId);
        if (template) {
          templates[templateId] = template.innerHTML;
        } else {
          console.error("Could not find template for id :", templateId);
        }
      }
      return templates[templateId];
    },

    createFromHTML : function (html) {
      var dummyEl = document.createElement("div");
      dummyEl.innerHTML = html;
      return dummyEl.children[0];
    },

    getAndReplace : function (templateId, dict) {
      var result = "";
      var tpl = pskl.utils.Template.get(templateId);
      if (tpl) {
        result = pskl.utils.Template.replace(tpl, dict);
      }
      return result;
    },

    replace : function (template, dict) {
      for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
          var value = dict[key];

          // special boolean keys keys key:default
          // if the value is a boolean, use default as value
          if (key.indexOf(':') !== -1) {
            if (value === true) {
              value = key.split(':')[1];
            } else if (value === false) {
              value = '';
            }
          }
          template = template.replace(new RegExp('\\{\\{'+key+'\\}\\}', 'g'), value);
        }
      }
      return template;
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');

  ns.TooltipFormatter = {};


  ns.TooltipFormatter.formatForTool = function(shortcut, descriptors, helpText) {
    var tpl = pskl.utils.Template.get('drawingTool-tooltipContainer-template');
    return pskl.utils.Template.replace(tpl, {
      helptext : helpText,
      shortcut : shortcut,
      descriptors : this.formatToolDescriptors_(descriptors)
    });
  };


  ns.TooltipFormatter.formatToolDescriptors_ = function(descriptors) {
    descriptors = descriptors || [];
    return descriptors.reduce(function (p, descriptor) {
      return p += this.formatToolDescriptor_(descriptor);
    }.bind(this), '');
  };

  ns.TooltipFormatter.formatToolDescriptor_ = function(descriptor) {
    var tpl;
    if (descriptor.key) {
      tpl = pskl.utils.Template.get('drawingTool-tooltipDescriptor-template');
      descriptor.key = descriptor.key.toUpperCase();
      if (pskl.utils.UserAgent.isMac) {
        descriptor.key = descriptor.key.replace('CTRL', 'CMD');
      }
    } else {
      tpl = pskl.utils.Template.get('drawingTool-simpleTooltipDescriptor-template');
    }
    return pskl.utils.Template.replace(tpl, descriptor);
  };
})();;(function () {
  var ns = $.namespace("pskl");

  ns.UserSettings = {
    GRID_WIDTH : 'GRID_WIDTH',
    CANVAS_BACKGROUND : 'CANVAS_BACKGROUND',
    SELECTED_PALETTE : 'SELECTED_PALETTE',
    TILED_PREVIEW : 'TILED_PREVIEW',
    ONION_SKIN : 'ONION_SKIN',
    LAYER_PREVIEW : 'LAYER_PREVIEW',

    KEY_TO_DEFAULT_VALUE_MAP_ : {
      'GRID_WIDTH' : 0,
      'CANVAS_BACKGROUND' : 'lowcont-dark-canvas-background',
      'SELECTED_PALETTE' : Constants.CURRENT_COLORS_PALETTE_ID,
      'TILED_PREVIEW' : false,
      'ONION_SKIN' : false,
      'LAYER_PREVIEW' : true
    },

    /**
     * @private
     */
    cache_ : {},

    /**
     * Static method to access a user defined settings value ot its default
     * value if not defined yet.
     */
    get : function (key) {
      this.checkKeyValidity_(key);
      if (!(key in this.cache_)) {
        var storedValue = this.readFromLocalStorage_(key);
        if (typeof storedValue !== 'undefined' && storedValue !== null) {
          this.cache_[key] = storedValue;
        } else {
          this.cache_[key] = this.readFromDefaults_(key);
        }
      }
      return this.cache_[key];
    },

    set : function (key, value) {
      this.checkKeyValidity_(key);
      this.cache_[key] = value;
      this.writeToLocalStorage_(key, value);

      $.publish(Events.USER_SETTINGS_CHANGED, [key, value]);
    },

    /**
     * @private
     */
    readFromLocalStorage_ : function(key) {
      var value = window.localStorage['etc/Piskel/'+key];
      if (typeof value != "undefined") {
        value = JSON.parse(value);
      }
      return value;
    },

    /**
     * @private
     */
    writeToLocalStorage_ : function(key, value) {
      // TODO(grosbouddha): Catch storage exception here.
      window.localStorage['etc/Piskel/'+key] = JSON.stringify(value);
    },

    /**
     * @private
     */
    readFromDefaults_ : function (key) {
      return this.KEY_TO_DEFAULT_VALUE_MAP_[key];
    },

    /**
     * @private
     */
    checkKeyValidity_ : function(key) {
      if(!(key in this.KEY_TO_DEFAULT_VALUE_MAP_)) {
        // TODO(grosbouddha): Define error catching strategy and throw exception from here.
        console.log("UserSettings key <"+ key +"> not find in supported keys.");
      }
    }
  };
})();;(function(){
  var ns = $.namespace('pskl.utils');

  var s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  };

  ns.Uuid = {
    generate : function () {
      return 'ss-s-s-s-sss'.replace(/s/g, function () {
        return s4();
      });
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');

  var workers = {};

  ns.WorkerUtils = {
    createWorker : function (worker, workerId) {
      if (!workers[workerId]) {
        var typedArray = [(worker+"").replace(/function \(\)\s?\{/,"").replace(/\}[^}]*$/, "")];
        var blob = new Blob(typedArray, {type: "application/javascript"}); // pass a useful mime type here
        workers[workerId] = window.URL.createObjectURL(blob);
      }

      return new Worker(workers[workerId]);
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');
  ns.Xhr = {
    get : function (url, success, error) {
      var xhr = ns.Xhr.xhr_(url, 'GET', success, error);
      xhr.send();
    },

    post : function (url, data, success, error) {
      var xhr = ns.Xhr.xhr_(url, 'POST', success, error);
      var formData = new FormData();

      if (typeof data == 'object') {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            formData.append(key, data[key]);
          }
        }
      }

      xhr.send(formData);
    },

    xhr_ : function (url, method, success, error) {
      success = success || function (){};
      error = error || function (){};

      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);

      xhr.onload = function(e) {
        if (this.status == 200) {
          success(this);
        } else {
          this.onerror(this, e);
        }
      };

      xhr.onerror = function(e) {
        error(e, this);
      };

      return xhr;
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils');

  ns.Serializer = {
    serializePiskel : function (piskel, expanded) {
      var serializedLayers = piskel.getLayers().map(function (l) {
        return pskl.utils.Serializer.serializeLayer(l, expanded);
      });
      return JSON.stringify({
        modelVersion : Constants.MODEL_VERSION,
        piskel : {
          name : piskel.getDescriptor().name,
          description : piskel.getDescriptor().description,
          fps : pskl.app.piskelController.getFPS(),
          height : piskel.getHeight(),
          width : piskel.getWidth(),
          layers : serializedLayers,
          expanded : expanded
        }
      });
    },

    serializeLayer : function (layer, expanded) {
      var frames = layer.getFrames();
      var renderer = new pskl.rendering.FramesheetRenderer(frames);
      var layerToSerialize = {
        name : layer.getName(),
        frameCount : frames.length
      };
      if (expanded) {
        layerToSerialize.grids = frames.map(function (f) {return f.pixels;});
        return layerToSerialize;
      } else {
        layerToSerialize.base64PNG = renderer.renderAsCanvas().toDataURL();
        return JSON.stringify(layerToSerialize);
      }
    }
  };
})();
;(function () {
  var ns = $.namespace('pskl.utils.serialization');

  ns.Deserializer = function (data, callback) {
    this.layersToLoad_ = 0;
    this.data_ = data;
    this.callback_ = callback;
    this.piskel_ = null;
  };

  ns.Deserializer.deserialize = function (data, callback) {
    var deserializer;
    if (data.modelVersion == Constants.MODEL_VERSION) {
      deserializer = new ns.Deserializer(data, callback);
    } else if (data.modelVersion == 1) {
      deserializer = new ns.backward.Deserializer_v1(data, callback);
    } else {
      deserializer = new ns.backward.Deserializer_v0(data, callback);
    }
    deserializer.deserialize();
  };

  ns.Deserializer.prototype.deserialize = function (name) {
    var data = this.data_;
    var piskelData = data.piskel;
    name = name || 'Deserialized piskel';

    var descriptor = new pskl.model.piskel.Descriptor(name, '');
    this.piskel_ = new pskl.model.Piskel(piskelData.width, piskelData.height, descriptor);

    this.layersToLoad_ = piskelData.layers.length;
    if (piskelData.expanded) {
      piskelData.layers.forEach(this.loadExpandedLayer.bind(this));
    } else {
      piskelData.layers.forEach(this.deserializeLayer.bind(this));
    }
  };

  ns.Deserializer.prototype.deserializeLayer = function (layerString) {
    var layerData = JSON.parse(layerString);
    var layer = new pskl.model.Layer(layerData.name);

    // 1 - create an image to load the base64PNG representing the layer
    var base64PNG = layerData.base64PNG;
    var image = new Image();

    // 2 - attach the onload callback that will be triggered asynchronously
    image.onload = function () {
      // 5 - extract the frames from the loaded image
      var frames = pskl.utils.LayerUtils.createLayerFromSpritesheet(image, layerData.frameCount);
      // 6 - add each image to the layer
      this.addFramesToLayer(frames, layer);
    }.bind(this);

    // 3 - set the source of the image
    image.src = base64PNG;

    // 4 - return a pointer to the new layer instance
    return layer;
  };

  ns.Deserializer.prototype.loadExpandedLayer = function (layerData) {
    var layer = new pskl.model.Layer(layerData.name);
    var frames = layerData.grids.map(function (grid) {
      return pskl.model.Frame.fromPixelGrid(grid);
    });
    this.addFramesToLayer(frames, layer);

    // 4 - return a pointer to the new layer instance
    return layer;
  };

  ns.Deserializer.prototype.addFramesToLayer = function (frames, layer) {
    frames.forEach(layer.addFrame.bind(layer));

    this.piskel_.addLayer(layer);
    this.onLayerLoaded_();
  };

  ns.Deserializer.prototype.onLayerLoaded_ = function () {
    this.layersToLoad_ = this.layersToLoad_ - 1;
    if (this.layersToLoad_ === 0) {
      this.callback_(this.piskel_);
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.utils.serialization.backward');

  ns.Deserializer_v0 = function (data, callback) {
    this.data_ = data;
    this.callback_ = callback;
  };

  ns.Deserializer_v0.prototype.deserialize = function () {
    var pixelGrids = this.data_;
    var frames = pixelGrids.map(function (grid) {
      return pskl.model.Frame.fromPixelGrid(grid);
    });
    var descriptor = new pskl.model.piskel.Descriptor('Deserialized piskel', '');
    var layer = pskl.model.Layer.fromFrames('Layer 1', frames);

    this.callback_(pskl.model.Piskel.fromLayers([layer], descriptor));
  };
})();;(function () {
  var ns = $.namespace('pskl.utils.serialization.backward');

  ns.Deserializer_v1 = function (data, callback) {
    this.callback_ = callback;
    this.data_ = data;
  };

  ns.Deserializer_v1.prototype.deserialize = function () {
    var piskelData = this.data_.piskel;
    var descriptor = new pskl.model.piskel.Descriptor('Deserialized piskel', '');
    var piskel = new pskl.model.Piskel(piskelData.width, piskelData.height, descriptor);

    piskelData.layers.forEach(function (serializedLayer) {
      var layer = this.deserializeLayer(serializedLayer);
      piskel.addLayer(layer);
    }.bind(this));

    this.callback_(piskel);
  };

  ns.Deserializer_v1.prototype.deserializeLayer = function (layerString) {
    var layerData = JSON.parse(layerString);
    var layer = new pskl.model.Layer(layerData.name);
    layerData.frames.forEach(function (serializedFrame) {
      var frame = this.deserializeFrame(serializedFrame);
      layer.addFrame(frame);
    }.bind(this));

    return layer;
  };

  ns.Deserializer_v1.prototype.deserializeFrame = function (frameString) {
    var framePixelGrid = JSON.parse(frameString);
    return pskl.model.Frame.fromPixelGrid(framePixelGrid);
  };
})();;(function () {
	var worker = function () {
		(function(b){function a(b,d){if({}.hasOwnProperty.call(a.cache,b))return a.cache[b];var e=a.resolve(b);if(!e)throw new Error('Failed to resolve module '+b);var c={id:b,require:a,filename:b,exports:{},loaded:!1,parent:d,children:[]};d&&d.children.push(c);var f=b.slice(0,b.lastIndexOf('/')+1);return a.cache[b]=c.exports,e.call(c.exports,c,c.exports,f,b),c.loaded=!0,a.cache[b]=c.exports}a.modules={},a.cache={},a.resolve=function(b){return{}.hasOwnProperty.call(a.modules,b)?a.modules[b]:void 0},a.define=function(b,c){a.modules[b]=c},a.define('/gif.worker.coffee',function(d,e,f,g){var b,c;b=a('/GIFEncoder.js',d),c=function(a){var c,e,d,f;return c=new b(a.width,a.height),a.index===0?c.writeHeader():c.firstFrame=!1,c.setTransparent(a.transparent),c.setRepeat(a.repeat),c.setDelay(a.delay),c.setQuality(a.quality),c.setPreserveColors(a.preserveColors),c.addFrame(a.data),a.last&&c.finish(),d=c.stream(),a.data=d.pages,a.cursor=d.cursor,a.pageSize=d.constructor.pageSize,a.canTransfer?(f=function(c){for(var b=0,d=a.data.length;b<d;++b)e=a.data[b],c.push(e.buffer);return c}.call(this,[]),self.postMessage(a,f)):self.postMessage(a)},self.onmessage=function(a){return c(a.data)}}),a.define('/GIFEncoder.js',function(e,k,i,j){function c(){this.page=-1,this.pages=[],this.newPage()}function b(a,b){this.width=~~a,this.height=~~b,this.transparent=null,this.transIndex=0,this.repeat=-1,this.delay=0,this.image=null,this.pixels=null,this.indexedPixels=null,this.colorDepth=null,this.colorTab=null,this.usedEntry=new Array,this.palSize=7,this.dispose=-1,this.firstFrame=!0,this.sample=10,this.preserveColors=!1,this.out=new c}var f=a('/TypedNeuQuant.js',e),g=a('/SimpleQuant.js',e),h=a('/LZWEncoder.js',e);c.pageSize=4096,c.charMap={};for(var d=0;d<256;d++)c.charMap[d]=String.fromCharCode(d);c.prototype.newPage=function(){this.pages[++this.page]=new Uint8Array(c.pageSize),this.cursor=0},c.prototype.getData=function(){var d='';for(var a=0;a<this.pages.length;a++)for(var b=0;b<c.pageSize;b++)d+=c.charMap[this.pages[a][b]];return d},c.prototype.writeByte=function(a){this.cursor>=c.pageSize&&this.newPage(),this.pages[this.page][this.cursor++]=a},c.prototype.writeUTFBytes=function(b){for(var c=b.length,a=0;a<c;a++)this.writeByte(b.charCodeAt(a))},c.prototype.writeBytes=function(b,d,e){for(var c=e||b.length,a=d||0;a<c;a++)this.writeByte(b[a])},b.prototype.setDelay=function(a){this.delay=Math.round(a/10)},b.prototype.setFrameRate=function(a){this.delay=Math.round(100/a)},b.prototype.setDispose=function(a){a>=0&&(this.dispose=a)},b.prototype.setRepeat=function(a){this.repeat=a},b.prototype.setTransparent=function(a){this.transparent=a},b.prototype.addFrame=function(a){this.image=a,this.getImagePixels(),this.analyzePixels(),this.firstFrame&&(this.writeLSD(),this.writePalette(),this.repeat>=0&&this.writeNetscapeExt()),this.writeGraphicCtrlExt(),this.writeImageDesc(),this.firstFrame||this.writePalette(),this.writePixels(),this.firstFrame=!1},b.prototype.finish=function(){this.out.writeByte(59)},b.prototype.setQuality=function(a){a<1&&(a=1),this.sample=a},b.prototype.setPreserveColors=function(a){this.preserveColors=a},b.prototype.writeHeader=function(){this.out.writeUTFBytes('GIF89a')},b.prototype.analyzePixels=function(){var h=this.pixels.length,d=h/3;this.indexedPixels=new Uint8Array(d);var a;this.preserveColors?a=new g(this.pixels,this.sample):a=new f(this.pixels,this.sample),a.buildColormap(),this.colorTab=a.getColormap();var b=0;for(var c=0;c<d;c++){var e=a.lookupRGB(this.pixels[b++]&255,this.pixels[b++]&255,this.pixels[b++]&255);this.usedEntry[e]=!0,this.indexedPixels[c]=e}this.pixels=null,this.colorDepth=8,this.palSize=7,this.transparent!==null&&(this.transIndex=this.findClosest(this.transparent))},b.prototype.findClosest=function(e){if(this.colorTab===null)return-1;var k=(e&16711680)>>16,l=(e&65280)>>8,m=e&255,c=0,d=16777216,j=this.colorTab.length;for(var a=0;a<j;){var f=k-(this.colorTab[a++]&255),g=l-(this.colorTab[a++]&255),h=m-(this.colorTab[a]&255),i=f*f+g*g+h*h,b=parseInt(a/3);this.usedEntry[b]&&i<d&&(d=i,c=b),a++}return c},b.prototype.getImagePixels=function(){var a=this.width,g=this.height;this.pixels=new Uint8Array(a*g*3);var b=this.image,c=0;for(var d=0;d<g;d++)for(var e=0;e<a;e++){var f=d*a*4+e*4;this.pixels[c++]=b[f],this.pixels[c++]=b[f+1],this.pixels[c++]=b[f+2]}},b.prototype.writeGraphicCtrlExt=function(){this.out.writeByte(33),this.out.writeByte(249),this.out.writeByte(4);var b,a;this.transparent===null?(b=0,a=0):(b=1,a=2),this.dispose>=0&&(a=dispose&7),a<<=2,this.out.writeByte(0|a|0|b),this.writeShort(this.delay),this.out.writeByte(this.transIndex),this.out.writeByte(0)},b.prototype.writeImageDesc=function(){this.out.writeByte(44),this.writeShort(0),this.writeShort(0),this.writeShort(this.width),this.writeShort(this.height),this.firstFrame?this.out.writeByte(0):this.out.writeByte(128|this.palSize)},b.prototype.writeLSD=function(){this.writeShort(this.width),this.writeShort(this.height),this.out.writeByte(240|this.palSize),this.out.writeByte(0),this.out.writeByte(0)},b.prototype.writeNetscapeExt=function(){this.out.writeByte(33),this.out.writeByte(255),this.out.writeByte(11),this.out.writeUTFBytes('NETSCAPE2.0'),this.out.writeByte(3),this.out.writeByte(1),this.writeShort(this.repeat),this.out.writeByte(0)},b.prototype.writePalette=function(){this.out.writeBytes(this.colorTab);var b=768-this.colorTab.length;for(var a=0;a<b;a++)this.out.writeByte(0)},b.prototype.writeShort=function(a){this.out.writeByte(a&255),this.out.writeByte(a>>8&255)},b.prototype.writePixels=function(){var a=new h(this.width,this.height,this.indexedPixels,this.colorDepth);a.encode(this.out)},b.prototype.stream=function(){return this.out},e.exports=b}),a.define('/LZWEncoder.js',function(e,g,h,i){function f(y,D,C,B){function w(a,b){r[f++]=a,f>=254&&t(b)}function x(b){u(a),k=i+2,j=!0,l(i,b)}function u(b){for(var a=0;a<b;++a)h[a]=-1}function A(z,r){var g,t,d,e,y,w,s;for(q=z,j=!1,n_bits=q,m=p(n_bits),i=1<<z-1,o=i+1,k=i+2,f=0,e=v(),s=0,g=a;g<65536;g*=2)++s;s=8-s,w=a,u(w),l(i,r);a:while((t=v())!=c){if(g=(t<<b)+e,d=t<<s^e,h[d]===g){e=n[d];continue}if(h[d]>=0){y=w-d,d===0&&(y=1);do if((d-=y)<0&&(d+=w),h[d]===g){e=n[d];continue a}while(h[d]>=0)}l(e,r),e=t,k<1<<b?(n[d]=k++,h[d]=g):x(r)}l(e,r),l(o,r)}function z(a){a.writeByte(s),remaining=y*D,curPixel=0,A(s+1,a),a.writeByte(0)}function t(a){f>0&&(a.writeByte(f),a.writeBytes(r,0,f),f=0)}function p(a){return(1<<a)-1}function v(){if(remaining===0)return c;--remaining;var a=C[curPixel++];return a&255}function l(a,c){g&=d[e],e>0?g|=a<<e:g=a,e+=n_bits;while(e>=8)w(g&255,c),g>>=8,e-=8;if((k>m||j)&&(j?(m=p(n_bits=q),j=!1):(++n_bits,n_bits==b?m=1<<b:m=p(n_bits))),a==o){while(e>0)w(g&255,c),g>>=8,e-=8;t(c)}}var s=Math.max(2,B),r=new Uint8Array(256),h=new Int32Array(a),n=new Int32Array(a),g,e=0,f,k=0,m,j=!1,q,i,o;this.encode=z}var c=-1,b=12,a=5003,d=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];e.exports=f}),a.define('/SimpleQuant.js',function(b,d,e,f){function a(a,b,c){return[a,b,c].join('.')}function c(b){this.pixels=b,this.palette=[],this.paletteIndex={},this.getColormap=function(){return this.palette},this.buildColormap=function(){var h=this.pixels.length/3,b=0;for(var c=0;c<h;c++){var d=this.pixels[b++],e=this.pixels[b++],f=this.pixels[b++],g=a(d,e,f);this.paletteIndex[g]||(this.palette.push(d),this.palette.push(e),this.palette.push(f),this.paletteIndex[g]=this.palette.length/3-1)}},this.lookupRGB=function(b,c,d){return this.paletteIndex[a(b,c,d)]}}b.exports=c}),a.define('/TypedNeuQuant.js',function(A,F,E,D){function C(A,B){function I(){o=[],q=new Int32Array(256),t=new Int32Array(a),y=new Int32Array(a),z=new Int32Array(a>>3);var c,d;for(c=0;c<a;c++)d=(c<<b+8)/a,o[c]=new Float64Array([d,d,d,0]),y[c]=e/a,t[c]=0}function J(){for(var c=0;c<a;c++)o[c][0]>>=b,o[c][1]>>=b,o[c][2]>>=b,o[c][3]=c}function K(b,a,c,e,f){o[a][0]-=b*(o[a][0]-c)/d,o[a][1]-=b*(o[a][1]-e)/d,o[a][2]-=b*(o[a][2]-f)/d}function L(j,e,n,l,k){var h=Math.abs(e-j),i=Math.min(e+j,a),g=e+1,f=e-1,m=1,b,d;while(g<i||f>h)d=z[m++],g<i&&(b=o[g++],b[0]-=d*(b[0]-n)/c,b[1]-=d*(b[1]-l)/c,b[2]-=d*(b[2]-k)/c),f>h&&(b=o[f--],b[0]-=d*(b[0]-n)/c,b[1]-=d*(b[1]-l)/c,b[2]-=d*(b[2]-k)/c)}function C(p,s,q){var h=2147483647,k=h,d=-1,m=d,c,j,e,n,l;for(c=0;c<a;c++)j=o[c],e=Math.abs(j[0]-p)+Math.abs(j[1]-s)+Math.abs(j[2]-q),e<h&&(h=e,d=c),n=e-(t[c]>>i-b),n<k&&(k=n,m=c),l=y[c]>>g,y[c]-=l,t[c]+=l<<f;return y[d]+=x,t[d]-=r,m}function D(){var d,b,e,c,h,g,f=0,i=0;for(d=0;d<a;d++){for(e=o[d],h=d,g=e[1],b=d+1;b<a;b++)c=o[b],c[1]<g&&(h=b,g=c[1]);if(c=o[h],d!=h&&(b=c[0],c[0]=e[0],e[0]=b,b=c[1],c[1]=e[1],e[1]=b,b=c[2],c[2]=e[2],e[2]=b,b=c[3],c[3]=e[3],e[3]=b),g!=f){for(q[f]=i+d>>1,b=f+1;b<g;b++)q[b]=d;f=g,i=d}}for(q[f]=i+n>>1,b=f+1;b<256;b++)q[b]=n}function E(j,i,k){var b,d,c,e=1e3,h=-1,f=q[i],g=f-1;while(f<a||g>=0)f<a&&(d=o[f],c=d[1]-i,c>=e?f=a:(f++,c<0&&(c=-c),b=d[0]-j,b<0&&(b=-b),c+=b,c<e&&(b=d[2]-k,b<0&&(b=-b),c+=b,c<e&&(e=c,h=d[3])))),g>=0&&(d=o[g],c=i-d[1],c>=e?g=-1:(g--,c<0&&(c=-c),b=d[0]-j,b<0&&(b=-b),c+=b,c<e&&(b=d[2]-k,b<0&&(b=-b),c+=b,c<e&&(e=c,h=d[3]))));return h}function F(){var c,f=A.length,D=30+(B-1)/3,y=f/(3*B),q=~~(y/w),n=d,o=u,a=o>>h;for(a<=1&&(a=0),c=0;c<a;c++)z[c]=n*((a*a-c*c)*m/(a*a));var i;f<s?(B=1,i=3):f%l!==0?i=3*l:f%k!==0?i=3*k:f%p!==0?i=3*p:i=3*j;var r,t,x,e,g=0;c=0;while(c<y)if(r=(A[g]&255)<<b,t=(A[g+1]&255)<<b,x=(A[g+2]&255)<<b,e=C(r,t,x),K(n,e,r,t,x),a!==0&&L(a,e,r,t,x),g+=i,g>=f&&(g-=f),c++,q===0&&(q=1),c%q===0)for(n-=n/D,o-=o/v,a=o>>h,a<=1&&(a=0),e=0;e<a;e++)z[e]=n*((a*a-e*e)*m/(a*a))}function G(){I(),F(),J(),D()}function H(){var b=[],g=[];for(var c=0;c<a;c++)g[o[c][3]]=c;var d=0;for(var e=0;e<a;e++){var f=g[e];b[d++]=o[f][0],b[d++]=o[f][1],b[d++]=o[f][2]}return b}var o,q,t,y,z;this.buildColormap=G,this.getColormap=H,this.lookupRGB=E}var w=100,a=256,n=a-1,b=4,i=16,e=1<<i,f=10,B=1<<f,g=10,x=e>>g,r=e<<f-g,z=a>>3,h=6,t=1<<h,u=z*t,v=30,o=10,d=1<<o,q=8,m=1<<q,y=o+q,c=1<<y,l=499,k=491,p=487,j=503,s=3*j;A.exports=C}),a('/gif.worker.coffee')}.call(this,this))
	};
	try {
		var url;
		if (pskl.utils.UserAgent.isIE11) {
			url = 'js/lib/gif/gif.ie.worker.js';
			if (window.pskl && window.pskl.appEngineToken_) {
				url = '../' + url;
			}
		} else {
			var typedArray = [(worker+"").replace(/function \(\)\s?\{/,"").replace(/\}[^}]*$/, "")];
			var blob = new Blob(typedArray, {type: "application/javascript"}); // pass a useful mime type here
			url = URL.createObjectURL(blob);
		}
		window.GifWorkerURL = url;
	} catch (e) {
		console.error("Could not create worker", e.message);
	}
})();
;(function(c){function a(b,d){if({}.hasOwnProperty.call(a.cache,b))return a.cache[b];var e=a.resolve(b);if(!e)throw new Error('Failed to resolve module '+b);var c={id:b,require:a,filename:b,exports:{},loaded:!1,parent:d,children:[]};d&&d.children.push(c);var f=b.slice(0,b.lastIndexOf('/')+1);return a.cache[b]=c.exports,e.call(c.exports,c,c.exports,f,b),c.loaded=!0,a.cache[b]=c.exports}a.modules={},a.cache={},a.resolve=function(b){return{}.hasOwnProperty.call(a.modules,b)?a.modules[b]:void 0},a.define=function(b,c){a.modules[b]=c};var b=function(a){return a='/',{title:'browser',version:'v0.8.19',browser:!0,env:{},argv:[],nextTick:c.setImmediate||function(a){setTimeout(a,0)},cwd:function(){return a},chdir:function(b){a=b}}}();a.define('/gif.coffee',function(d,m,l,k){function g(a,b){return{}.hasOwnProperty.call(a,b)}function j(d,b){for(var a=0,c=b.length;a<c;++a)if(a in b&&b[a]===d)return!0;return!1}function i(a,b){function d(){this.constructor=a}for(var c in b)g(b,c)&&(a[c]=b[c]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a}var h,c,f,b,e;f=a('events',d).EventEmitter,h=a('/browser.coffee',d),e=function(d){function a(d){var a,b;this.running=!1,this.options={},this.frames=[],this.freeWorkers=[],this.activeWorkers=[],this.setOptions(d);for(a in c)b=c[a],null!=this.options[a]?this.options[a]:this.options[a]=b}return i(a,d),c={workerScript:window.GifWorkerURL,workers:2,repeat:0,background:'#fff',quality:10,width:null,height:null,transparent:null,preserveColors:!1},b={delay:500,copy:!1},a.prototype.setOption=function(a,b){return this.options[a]=b,null!=this._canvas&&(a==='width'||a==='height')?this._canvas[a]=b:void 0},a.prototype.setOptions=function(b){var a,c;return function(d){for(a in b){if(!g(b,a))continue;c=b[a],d.push(this.setOption(a,c))}return d}.call(this,[])},a.prototype.addFrame=function(a,d){var c,e;null==d&&(d={}),c={},c.transparent=this.options.transparent;for(e in b)c[e]=d[e]||b[e];if(null!=this.options.width||this.setOption('width',a.width),null!=this.options.height||this.setOption('height',a.height),'undefined'!==typeof ImageData&&null!=ImageData&&a instanceof ImageData)c.data=a.data;else if('undefined'!==typeof CanvasRenderingContext2D&&null!=CanvasRenderingContext2D&&a instanceof CanvasRenderingContext2D||'undefined'!==typeof WebGLRenderingContext&&null!=WebGLRenderingContext&&a instanceof WebGLRenderingContext)d.copy?c.data=this.getContextData(a):c.context=a;else if(null!=a.childNodes)d.copy?c.data=this.getImageData(a):c.image=a;else throw new Error('Invalid image');return this.frames.push(c)},a.prototype.render=function(){var d,a;if(this.running)throw new Error('Already running');if(!(null!=this.options.width&&null!=this.options.height))throw new Error('Width and height must be set prior to rendering');this.running=!0,this.nextFrame=0,this.finishedFrames=0,this.imageParts=function(c){for(var b=function(){var b;b=[];for(var a=0;0<=this.frames.length?a<this.frames.length:a>this.frames.length;0<=this.frames.length?++a:--a)b.push(a);return b}.apply(this,arguments),a=0,e=b.length;a<e;++a)d=b[a],c.push(null);return c}.call(this,[]),a=this.spawnWorkers();for(var c=function(){var c;c=[];for(var b=0;0<=a?b<a:b>a;0<=a?++b:--b)c.push(b);return c}.apply(this,arguments),b=0,e=c.length;b<e;++b)d=c[b],this.renderNextFrame();return this.emit('start'),this.emit('progress',0)},a.prototype.abort=function(){var a;while(!0){if(a=this.activeWorkers.shift(),!(null!=a))break;console.log('killing active worker'),a.terminate()}return this.running=!1,this.emit('abort')},a.prototype.spawnWorkers=function(){var a;return a=Math.min(this.options.workers,this.frames.length),function(){var c;c=[];for(var b=this.freeWorkers.length;this.freeWorkers.length<=a?b<a:b>a;this.freeWorkers.length<=a?++b:--b)c.push(b);return c}.apply(this,arguments).forEach(function(a){return function(c){var b;return console.log('spawning worker '+c),b=new Worker(a.options.workerScript),b.onmessage=function(a){return function(c){return a.activeWorkers.splice(a.activeWorkers.indexOf(b),1),a.freeWorkers.push(b),a.frameFinished(c.data)}}(a),a.freeWorkers.push(b)}}(this)),a},a.prototype.frameFinished=function(a){return console.log('frame '+a.index+' finished - '+this.activeWorkers.length+' active'),this.finishedFrames++,this.emit('progress',this.finishedFrames/this.frames.length),this.imageParts[a.index]=a,j(null,this.imageParts)?this.renderNextFrame():this.finishRendering()},a.prototype.finishRendering=function(){var e,a,k,m,b,d,h;b=0;for(var f=0,j=this.imageParts.length;f<j;++f)a=this.imageParts[f],b+=(a.data.length-1)*a.pageSize+a.cursor;b+=a.pageSize-a.cursor,console.log('rendering finished - filesize '+Math.round(b/1e3)+'kb'),e=new Uint8Array(b),d=0;for(var g=0,l=this.imageParts.length;g<l;++g){a=this.imageParts[g];for(var c=0,i=a.data.length;c<i;++c)h=a.data[c],k=c,e.set(h,d),k===a.data.length-1?d+=a.cursor:d+=a.pageSize}return m=new Blob([e],{type:'image/gif'}),this.emit('finished',m,e)},a.prototype.renderNextFrame=function(){var c,a,b;if(this.freeWorkers.length===0)throw new Error('No free workers');return this.nextFrame>=this.frames.length?void 0:(c=this.frames[this.nextFrame++],b=this.freeWorkers.shift(),a=this.getTask(c),console.log('starting frame '+(a.index+1)+' of '+this.frames.length),this.activeWorkers.push(b),b.postMessage(a))},a.prototype.getContextData=function(a){return a.getImageData(0,0,this.options.width,this.options.height).data},a.prototype.getImageData=function(b){var a;return null!=this._canvas||(this._canvas=document.createElement('canvas'),this._canvas.width=this.options.width,this._canvas.height=this.options.height),a=this._canvas.getContext('2d'),a.setFill=this.options.background,a.fillRect(0,0,this.options.width,this.options.height),a.drawImage(b,0,0),this.getContextData(a)},a.prototype.getTask=function(a){var c,b;if(c=this.frames.indexOf(a),b={index:c,last:c===this.frames.length-1,delay:a.delay,transparent:a.transparent,width:this.options.width,height:this.options.height,quality:this.options.quality,preserveColors:this.options.preserveColors,repeat:this.options.repeat,canTransfer:h.name==='chrome'},null!=a.data)b.data=a.data;else if(null!=a.context)b.data=this.getContextData(a.context);else if(null!=a.image)b.data=this.getImageData(a.image);else throw new Error('Invalid frame');return b},a}(f),d.exports=e}),a.define('/browser.coffee',function(f,g,h,i){var a,d,e,c,b;c=navigator.userAgent.toLowerCase(),e=navigator.platform.toLowerCase(),b=c.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/)||[null,'unknown',0],d=b[1]==='ie'&&document.documentMode,a={name:b[1]==='version'?b[3]:b[1],version:d||parseFloat(b[1]==='opera'&&b[4]?b[4]:b[2]),platform:{name:c.match(/ip(?:ad|od|hone)/)?'ios':(c.match(/(?:webos|android)/)||e.match(/mac|win|linux/)||['other'])[0]}},a[a.name]=!0,a[a.name+parseInt(a.version,10)]=!0,a.platform[a.platform.name]=!0,f.exports=a}),a.define('events',function(f,e,g,h){b.EventEmitter||(b.EventEmitter=function(){});var a=e.EventEmitter=b.EventEmitter,c=typeof Array.isArray==='function'?Array.isArray:function(a){return Object.prototype.toString.call(a)==='[object Array]'},d=10;a.prototype.setMaxListeners=function(a){this._events||(this._events={}),this._events.maxListeners=a},a.prototype.emit=function(f){if(f==='error'&&(!(this._events&&this._events.error)||c(this._events.error)&&!this._events.error.length))throw arguments[1]instanceof Error?arguments[1]:new Error("Uncaught, unspecified 'error' event.");if(!this._events)return!1;var a=this._events[f];if(!a)return!1;if(!(typeof a=='function'))if(c(a)){var b=Array.prototype.slice.call(arguments,1),e=a.slice();for(var d=0,g=e.length;d<g;d++)e[d].apply(this,b);return!0}else return!1;switch(arguments.length){case 1:a.call(this);break;case 2:a.call(this,arguments[1]);break;case 3:a.call(this,arguments[1],arguments[2]);break;default:var b=Array.prototype.slice.call(arguments,1);a.apply(this,b)}return!0},a.prototype.addListener=function(a,b){if('function'!==typeof b)throw new Error('addListener only takes instances of Function');if(this._events||(this._events={}),this.emit('newListener',a,b),!this._events[a])this._events[a]=b;else if(c(this._events[a])){if(!this._events[a].warned){var e;this._events.maxListeners!==undefined?e=this._events.maxListeners:e=d,e&&e>0&&this._events[a].length>e&&(this._events[a].warned=!0,console.error('(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.',this._events[a].length),console.trace())}this._events[a].push(b)}else this._events[a]=[this._events[a],b];return this},a.prototype.on=a.prototype.addListener,a.prototype.once=function(b,c){var a=this;return a.on(b,function d(){a.removeListener(b,d),c.apply(this,arguments)}),this},a.prototype.removeListener=function(a,d){if('function'!==typeof d)throw new Error('removeListener only takes instances of Function');if(!(this._events&&this._events[a]))return this;var b=this._events[a];if(c(b)){var e=b.indexOf(d);if(e<0)return this;b.splice(e,1),b.length==0&&delete this._events[a]}else this._events[a]===d&&delete this._events[a];return this},a.prototype.removeAllListeners=function(a){return a&&this._events&&this._events[a]&&(this._events[a]=null),this},a.prototype.listeners=function(a){return this._events||(this._events={}),this._events[a]||(this._events[a]=[]),c(this._events[a])||(this._events[a]=[this._events[a]]),this._events[a]}}),c.GIF=a('/gif.coffee')}.call(this,this))
// gif.js 0.1.6 - https://github.com/jnordberg/gif.js
;( function( window ) { 'use strict';

// Stream
/**
 * @constructor
 */
// Make compiler happy.
var Stream = function (data) {
  this.data = data;
  this.len = this.data.length;
  this.pos = 0;
};

Stream.prototype.readByte = function () {
  if (this.pos >= this.data.length) {
    throw new Error('Attempted to read past end of stream.');
  }
  return this.data.charCodeAt(this.pos++) & 0xFF;
};

Stream.prototype.readBytes = function (n) {
  var bytes = [];
  for (var i = 0; i < n; i++) {
    bytes.push(this.readByte());
  }
  return bytes;
};

Stream.prototype.read = function (n) {
  var s = '';
  for (var i = 0; i < n; i++) {
    s += String.fromCharCode(this.readByte());
  }
  return s;
};

Stream.prototype.readUnsigned = function () { // Little-endian.
  var a = this.readBytes(2);
  return (a[1] << 8) + a[0];
};

var SuperGIF = window.SuperGIF = window.SuperGIF || {};
SuperGIF.Stream = Stream;

})( window );

/*
  SuperGif

  Example usage:

    <img src="example1_preview.gif" data-animated-src="example1.gif" />

    <script type="text/javascript">
      $$('img').each(function (img_tag) {
        if (/.*\.gif/.test(img_tag.src)) {
          var rub = new SuperGif({ gif: img_tag } );
          rub.load();
        }
      });
    </script>

  Image tag attributes:

    data-animated-src - If this url is specified, it's loaded into the player instead of src.
              This allows a preview frame to be shown until animated gif data is streamed into the canvas

  Constructor options args

    gif         Required. The DOM element of an img tag.

  Instance methods

    // loading
    load( callback )  Loads the gif into a canvas element and then calls callback if one is passed

    For additional customization (viewport inside iframe) these params may be passed:
    c_w, c_h - width and height of canvas
    vp_t, vp_l, vp_ w, vp_h - top, left, width and height of the viewport

    A bonus: few articles to understand what is going on
      http://enthusiasms.org/post/16976438906
      http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp
      http://humpy77.deviantart.com/journal/Frame-Delay-Times-for-Animated-GIFs-214150546

*/

( function( window ) { 'use strict';

// Generic functions
var bitsToNum = function (ba) {
  return ba.reduce(function (s, n) {
    return s * 2 + n;
  }, 0);
};

var byteToBitArr = function (bite) {
  var a = [];
  for (var i = 7; i >= 0; i--) {
    a.push( !! (bite & (1 << i)));
  }
  return a;
};

// Stream
/**
 * @constructor
 */
// Make compiler happy.
var Stream = function (data) {
  this.data = data;
  this.len = this.data.length;
  this.pos = 0;

  this.readByte = function () {
    if (this.pos >= this.data.length) {
      throw new Error('Attempted to read past end of stream.');
    }
    return data.charCodeAt(this.pos++) & 0xFF;
  };

  this.readBytes = function (n) {
    var bytes = [];
    for (var i = 0; i < n; i++) {
      bytes.push(this.readByte());
    }
    return bytes;
  };

  this.read = function (n) {
    var s = '';
    for (var i = 0; i < n; i++) {
      s += String.fromCharCode(this.readByte());
    }
    return s;
  };

  this.readUnsigned = function () { // Little-endian.
    var a = this.readBytes(2);
    return (a[1] << 8) + a[0];
  };
};

var lzwDecode = function (minCodeSize, data) {
  // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
  var pos = 0; // Maybe this streaming thing should be merged with the Stream?
  var readCode = function (size) {
    var code = 0;
    for (var i = 0; i < size; i++) {
      if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
        code |= 1 << i;
      }
      pos++;
    }
    return code;
  };

  var output = [];

  var clearCode = 1 << minCodeSize;
  var eoiCode = clearCode + 1;

  var codeSize = minCodeSize + 1;

  var dict = [];

  var clear = function () {
    dict = [];
    codeSize = minCodeSize + 1;
    for (var i = 0; i < clearCode; i++) {
      dict[i] = [i];
    }
    dict[clearCode] = [];
    dict[eoiCode] = null;

  };

  var code;
  var last;

  while (true) {
    last = code;
    code = readCode(codeSize);

    if (code === clearCode) {
      clear();
      continue;
    }
    if (code === eoiCode) break;

    if (code < dict.length) {
      if (last !== clearCode) {
        dict.push(dict[last].concat(dict[code][0]));
      }
    }
    else {
      if (code !== dict.length) throw new Error('Invalid LZW code.');
      dict.push(dict[last].concat(dict[last][0]));
    }
    output.push.apply(output, dict[code]);

    if (dict.length === (1 << codeSize) && codeSize < 12) {
      // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
      codeSize++;
    }
  }

  // I don't know if this is technically an error, but some GIFs do it.
  //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');
  return output;
};


// The actual parsing; returns an object with properties.
var parseGIF = function (st, handler) {
  handler || (handler = {});

  // LZW (GIF-specific)
  var parseCT = function (entries) { // Each entry is 3 bytes, for RGB.
    var ct = [];
    for (var i = 0; i < entries; i++) {
      ct.push(st.readBytes(3));
    }
    return ct;
  };

  var readSubBlocks = function () {
    var size, data;
    data = '';
    do {
      size = st.readByte();
      data += st.read(size);
    } while (size !== 0);
    return data;
  };

  var parseHeader = function () {
    var hdr = {};
    hdr.sig = st.read(3);
    hdr.ver = st.read(3);
    if (hdr.sig !== 'GIF') {
      handler.onError(); // XXX: This should probably be handled more nicely.
      throw new Error('Not a GIF file.');
    }
    hdr.width = st.readUnsigned();
    hdr.height = st.readUnsigned();

    var bits = byteToBitArr(st.readByte());
    hdr.gctFlag = bits.shift();
    hdr.colorRes = bitsToNum(bits.splice(0, 3));
    hdr.sorted = bits.shift();
    hdr.gctSize = bitsToNum(bits.splice(0, 3));

    hdr.bgColor = st.readByte();
    hdr.pixelAspectRatio = st.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
    if (hdr.gctFlag) {
      hdr.gct = parseCT(1 << (hdr.gctSize + 1));
    }
    handler.hdr && handler.hdr(hdr);
  };

  var parseExt = function (block) {
    var parseGCExt = function (block) {
      var blockSize = st.readByte(); // Always 4
      var bits = byteToBitArr(st.readByte());
      block.reserved = bits.splice(0, 3); // Reserved; should be 000.
      block.disposalMethod = bitsToNum(bits.splice(0, 3));
      block.userInput = bits.shift();
      block.transparencyGiven = bits.shift();

      block.delayTime = st.readUnsigned();

      block.transparencyIndex = st.readByte();

      block.terminator = st.readByte();

      handler.gce && handler.gce(block);
    };

    var parseComExt = function (block) {
      block.comment = readSubBlocks();
      handler.com && handler.com(block);
    };

    var parsePTExt = function (block) {
      // No one *ever* uses this. If you use it, deal with parsing it yourself.
      var blockSize = st.readByte(); // Always 12
      block.ptHeader = st.readBytes(12);
      block.ptData = readSubBlocks();
      handler.pte && handler.pte(block);
    };

    var parseAppExt = function (block) {
      var parseNetscapeExt = function (block) {
        var blockSize = st.readByte(); // Always 3
        block.unknown = st.readByte(); // ??? Always 1? What is this?
        block.iterations = st.readUnsigned();
        block.terminator = st.readByte();
        handler.app && handler.app.NETSCAPE && handler.app.NETSCAPE(block);
      };

      var parseUnknownAppExt = function (block) {
        block.appData = readSubBlocks();
        // FIXME: This won't work if a handler wants to match on any identifier.
        handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
      };

      var blockSize = st.readByte(); // Always 11
      block.identifier = st.read(8);
      block.authCode = st.read(3);
      switch (block.identifier) {
      case 'NETSCAPE':
        parseNetscapeExt(block);
        break;
      default:
        parseUnknownAppExt(block);
        break;
      }
    };

    var parseUnknownExt = function (block) {
      block.data = readSubBlocks();
      handler.unknown && handler.unknown(block);
    };

    block.label = st.readByte();
    switch (block.label) {
    case 0xF9:
      block.extType = 'gce';
      parseGCExt(block);
      break;
    case 0xFE:
      block.extType = 'com';
      parseComExt(block);
      break;
    case 0x01:
      block.extType = 'pte';
      parsePTExt(block);
      break;
    case 0xFF:
      block.extType = 'app';
      parseAppExt(block);
      break;
    default:
      block.extType = 'unknown';
      parseUnknownExt(block);
      break;
    }
  };

  var parseImg = function (img) {
    var deinterlace = function (pixels, width) {
      // Of course this defeats the purpose of interlacing. And it's *probably*
      // the least efficient way it's ever been implemented. But nevertheless...
      var newPixels = new Array(pixels.length);
      var rows = pixels.length / width;
      var cpRow = function (toRow, fromRow) {
        var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
        newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
      };

      // See appendix E.
      var offsets = [0, 4, 2, 1];
      var steps = [8, 8, 4, 2];

      var fromRow = 0;
      for (var pass = 0; pass < 4; pass++) {
        for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
          cpRow(toRow, fromRow)
          fromRow++;
        }
      }

      return newPixels;
    };

    img.leftPos = st.readUnsigned();
    img.topPos = st.readUnsigned();
    img.width = st.readUnsigned();
    img.height = st.readUnsigned();

    var bits = byteToBitArr(st.readByte());
    img.lctFlag = bits.shift();
    img.interlaced = bits.shift();
    img.sorted = bits.shift();
    img.reserved = bits.splice(0, 2);
    img.lctSize = bitsToNum(bits.splice(0, 3));

    if (img.lctFlag) {
      img.lct = parseCT(1 << (img.lctSize + 1));
    }

    img.lzwMinCodeSize = st.readByte();

    var lzwData = readSubBlocks();

    img.pixels = lzwDecode(img.lzwMinCodeSize, lzwData);

    if (img.interlaced) { // Move
      img.pixels = deinterlace(img.pixels, img.width);
    }

    handler.img && handler.img(img);
  };

  var parseBlock = function () {
    var block = {};
    block.sentinel = st.readByte();

    switch (String.fromCharCode(block.sentinel)) { // For ease of matching
    case '!':
      block.type = 'ext';
      parseExt(block);
      break;
    case ',':
      block.type = 'img';
      parseImg(block);
      break;
    case ';':
      block.type = 'eof';
      handler.eof && handler.eof(block);
      break;
    default:
      return handler.onError(new Error('Unknown block: 0x' + block.sentinel.toString(16))); // TODO: Pad this with a 0.
    }

    if (block.type !== 'eof') {
      setTimeout(parseBlock, 0);
    }
  };

  var parse = function () {
    parseHeader();
    setTimeout(parseBlock, 0);
  };

  parse();
};


var SuperGif = function ( opts ) {
  var options = {
    //viewport position
    vp_l: 0,
    vp_t: 0,
    vp_w: null,
    vp_h: null,
    //canvas sizes
    c_w: null,
    c_h: null
  };
  for (var i in opts ) { options[i] = opts[i] }
  if (options.vp_w && options.vp_h) options.is_vp = true;

  var stream;
  var hdr;

  var loadError = null;
  var loading = false;

  var transparency = null;
  var delay = null;
  var disposalMethod = null;
  var disposalRestoreFromIdx = 0;
  var lastDisposalMethod = null;
  var frame = null;
  var lastImg = null;

  var frames = [];

  var gif = options.gif;

  var clear = function () {
    transparency = null;
    delay = null;
    lastDisposalMethod = disposalMethod;
    disposalMethod = null;
    frame = null;
  };

  // XXX: There's probably a better way to handle catching exceptions when
  // callbacks are involved.
  var doParse = function () {
    try {
      parseGIF(stream, handler);
    }
    catch (err) {
      doLoadError('parse');
    }
  };

  var setSizes = function(w, h) {
    tmpCanvas.width = w;
    tmpCanvas.height = h;
    tmpCanvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
  }

  var doLoadError = function (originOfError) {


    loadError = originOfError;
    hdr = {
      width: gif.width,
      height: gif.height
    }; // Fake header.
    frames = [];
  };

  var doHdr = function (_hdr) {
    hdr = _hdr;
    setSizes(hdr.width, hdr.height)
  };

  var doGCE = function (gce) {
    pushFrame();
    clear();
    transparency = gce.transparencyGiven ? gce.transparencyIndex : null;
    delay = gce.delayTime;
    disposalMethod = gce.disposalMethod;
    // We don't have much to do with the rest of GCE.
  };

  var pushFrame = function () {
    if (!frame) return;
    frames.push({
      data: frame.getImageData(0, 0, hdr.width, hdr.height),
      delay: delay
    });
  };

  // flag for drawing initial frame
  var isInitFrameDrawn = false;

  var doImg = function (img) {
    if (!frame) frame = tmpCanvas.getContext('2d');

    var currIdx = frames.length;

    //ct = color table, gct = global color table
    var ct = img.lctFlag ? img.lct : hdr.gct; // TODO: What if neither exists?

    /*
    Disposal method indicates the way in which the graphic is to
    be treated after being displayed.

    Values :    0 - No disposal specified. The decoder is
            not required to take any action.
          1 - Do not dispose. The graphic is to be left
            in place.
          2 - Restore to background color. The area used by the
            graphic must be restored to the background color.
          3 - Restore to previous. The decoder is required to
            restore the area overwritten by the graphic with
            what was there prior to rendering the graphic.

            Importantly, "previous" means the frame state
            after the last disposal of method 0, 1, or 2.
    */
    if (currIdx > 0) {
      if (lastDisposalMethod === 3) {
        // Restore to previous
        frame.putImageData(frames[disposalRestoreFromIdx].data, 0, 0);
      } else {
        disposalRestoreFromIdx = currIdx - 1;
      }

      if (lastDisposalMethod === 2) {
        // Restore to background color
        // Browser implementations historically restore to transparent; we do the same.
        // http://www.wizards-toolkit.org/discourse-server/viewtopic.php?f=1&t=21172#p86079
        frame.clearRect(lastImg.leftPos, lastImg.topPos, lastImg.width, lastImg.height);
      }
    }
    // else, Undefined/Do not dispose.
    // frame contains final pixel data from the last frame; do nothing

    //Get existing pixels for img region after applying disposal method
    var imgData = frame.getImageData(img.leftPos, img.topPos, img.width, img.height);
    //apply color table colors
    var cdd = imgData.data;
    img.pixels.forEach(function (pixel, i) {
      // imgData.data === [R,G,B,A,R,G,B,A,...]
      if (pixel !== transparency) {
        cdd[i * 4 + 0] = ct[pixel][0];
        cdd[i * 4 + 1] = ct[pixel][1];
        cdd[i * 4 + 2] = ct[pixel][2];
        cdd[i * 4 + 3] = 255; // Opaque.
      }
    });

    frame.putImageData(imgData, img.leftPos, img.topPos);

    lastImg = img;
  };

  var doNothing = function () {};
  /**
   * @param{boolean=} draw Whether to draw progress bar or not; this is not idempotent because of translucency.
   *                       Note that this means that the text will be unsynchronized with the progress bar on non-frames;
   *                       but those are typically so small (GCE etc.) that it doesn't really matter. TODO: Do this properly.
   */
  var handler = {
    hdr: doHdr,
    gce: doGCE,
    // I guess that's all for now.
    // app: {
    //  // TODO: Is there much point in actually supporting iterations?
    //  NETSCAPE: withProgress(doNothing)
    // },
    img: doImg,
    eof: function (block) {
      pushFrame();
      loading = false;
      if (load_callback) {
        load_callback();
      }
    },

    onError : function (error) {
      if (error_callback) {
        error_callback();
      }
    }
  };

  var load_callback = false;
  var step_callback = false;
  var error_callback = false;
  var tmpCanvas = document.createElement('canvas');

  return {

    load: function (callback) {

      load_callback = callback.success;
      step_callback = callback.step;
      error_callback = callback.error;

      loading = true;

      if (gif.src.indexOf('data:') !== -1) {
        var data = gif.src.substring(gif.src.indexOf(',')+1);
        stream = new Stream(window.atob(data));
        doParse();
      } else {
        var h = new XMLHttpRequest();
        h.overrideMimeType('text/plain; charset=x-user-defined');
        h.onload = function(e) {
          stream = new Stream(h.responseText);
          setTimeout(doParse, 0);
        };
        h.onerror = function() { doLoadError('xhr'); };
        h.open('GET', gif.getAttribute('data-animated-src') || gif.src, true);
        h.send();
      }
    },

    getFrames : function () {
      return frames;
    }
  };
};


window.SuperGif = SuperGif;

})( window );;/*!

JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library zlib.js released under the following license :
zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License
*/
!function(a){"object"==typeof exports?module.exports=a():"function"==typeof define&&define.amd?define(a):"undefined"!=typeof window?window.JSZip=a():"undefined"!=typeof global?global.JSZip=a():"undefined"!=typeof self&&(self.JSZip=a())}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,f,g,h,i,j="",k=0;k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),e=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|e>>6,i=63&e,isNaN(c)?h=i=64:isNaN(e)&&(i=64),j=j+d.charAt(f)+d.charAt(g)+d.charAt(h)+d.charAt(i);return j},c.decode=function(a){var b,c,e,f,g,h,i,j="",k=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=d.indexOf(a.charAt(k++)),g=d.indexOf(a.charAt(k++)),h=d.indexOf(a.charAt(k++)),i=d.indexOf(a.charAt(k++)),b=f<<2|g>>4,c=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(b),64!=h&&(j+=String.fromCharCode(c)),64!=i&&(j+=String.fromCharCode(e));return j}},{}],2:[function(a,b){"use strict";function c(){this.compressedSize=0,this.uncompressedSize=0,this.crc32=0,this.compressionMethod=null,this.compressedContent=null}c.prototype={getContent:function(){return null},getCompressedContent:function(){return null}},b.exports=c},{}],3:[function(a,b,c){"use strict";c.STORE={magic:"\x00\x00",compress:function(a){return a},uncompress:function(a){return a},compressInputType:null,uncompressInputType:null},c.DEFLATE=a("./flate")},{"./flate":6}],4:[function(a,b){"use strict";function c(){this.data=null,this.length=0,this.index=0}var d=a("./utils");c.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<a||0>a)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return d.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1)}},b.exports=c},{"./utils":14}],5:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.date=null,c.compression=null},{}],6:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,e=a("zlibjs/bin/rawdeflate.min").Zlib,f=a("zlibjs/bin/rawinflate.min").Zlib;c.uncompressInputType=d?"uint8array":"array",c.compressInputType=d?"uint8array":"array",c.magic="\b\x00",c.compress=function(a){var b=new e.RawDeflate(a);return b.compress()},c.uncompress=function(a){var b=new f.RawInflate(a);return b.decompress()}},{"zlibjs/bin/rawdeflate.min":19,"zlibjs/bin/rawinflate.min":20}],7:[function(a,b){"use strict";function c(a,b){return this instanceof c?(this.files={},this.root="",a&&this.load(a,b),void(this.clone=function(){var a=new c;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a})):new c(a,b)}c.prototype=a("./object"),c.prototype.load=a("./load"),c.support=a("./support"),c.defaults=a("./defaults"),c.utils=a("./utils"),c.base64=a("./base64"),c.compressions=a("./compressions"),b.exports=c},{"./base64":1,"./compressions":3,"./defaults":5,"./load":8,"./object":9,"./support":12,"./utils":14}],8:[function(a,b){"use strict";var c=a("./base64"),d=a("./zipEntries");b.exports=function(a,b){var e,f,g,h;for(b=b||{},b.base64&&(a=c.decode(a)),f=new d(a,b),e=f.files,g=0;g<e.length;g++)h=e[g],this.file(h.fileName,h.decompressed,{binary:!0,optimizedBinaryString:!0,date:h.date,dir:h.dir});return this}},{"./base64":1,"./zipEntries":15}],9:[function(a,b){"use strict";var c,d,e=a("./support"),f=a("./utils"),g=a("./signature"),h=a("./defaults"),i=a("./base64"),j=a("./compressions"),k=a("./compressedObject"),l=a("./nodeBuffer");e.uint8array&&"function"==typeof TextEncoder&&"function"==typeof TextDecoder&&(c=new TextEncoder("utf-8"),d=new TextDecoder("utf-8"));var m=function(a){if(a._data instanceof k&&(a._data=a._data.getContent(),a.options.binary=!0,a.options.base64=!1,"uint8array"===f.getTypeOf(a._data))){var b=a._data;a._data=new Uint8Array(b.length),0!==b.length&&a._data.set(b,0)}return a._data},n=function(a){var b=m(a),d=f.getTypeOf(b);if("string"===d){if(!a.options.binary){if(c)return c.encode(b);if(e.nodebuffer)return l(b,"utf-8")}return a.asBinary()}return b},o=function(a){var b=m(this);return null===b||"undefined"==typeof b?"":(this.options.base64&&(b=i.decode(b)),b=a&&this.options.binary?A.utf8decode(b):f.transformTo("string",b),a||this.options.binary||(b=A.utf8encode(b)),b)},p=function(a,b,c){this.name=a,this._data=b,this.options=c};p.prototype={asText:function(){return o.call(this,!0)},asBinary:function(){return o.call(this,!1)},asNodeBuffer:function(){var a=n(this);return f.transformTo("nodebuffer",a)},asUint8Array:function(){var a=n(this);return f.transformTo("uint8array",a)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var q=function(a,b){var c,d="";for(c=0;b>c;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},r=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},s=function(a){return a=a||{},a.base64!==!0||null!==a.binary&&void 0!==a.binary||(a.binary=!0),a=r(a,h),a.date=a.date||new Date,null!==a.compression&&(a.compression=a.compression.toUpperCase()),a},t=function(a,b,c){var d=u(a),e=f.getTypeOf(b);if(d&&v.call(this,d),c=s(c),c.dir||null===b||"undefined"==typeof b)c.base64=!1,c.binary=!1,b=null;else if("string"===e)c.binary&&!c.base64&&c.optimizedBinaryString!==!0&&(b=f.string2binary(b));else{if(c.base64=!1,c.binary=!0,!(e||b instanceof k))throw new Error("The data of '"+a+"' is in an unsupported format !");"arraybuffer"===e&&(b=f.transformTo("uint8array",b))}var g=new p(a,b,c);return this.files[a]=g,g},u=function(a){"/"==a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},v=function(a){return"/"!=a.slice(-1)&&(a+="/"),this.files[a]||t.call(this,a,null,{dir:!0}),this.files[a]},w=function(a,b){var c,d=new k;return a._data instanceof k?(d.uncompressedSize=a._data.uncompressedSize,d.crc32=a._data.crc32,0===d.uncompressedSize||a.options.dir?(b=j.STORE,d.compressedContent="",d.crc32=0):a._data.compressionMethod===b.magic?d.compressedContent=a._data.getCompressedContent():(c=a._data.getContent(),d.compressedContent=b.compress(f.transformTo(b.compressInputType,c)))):(c=n(a),(!c||0===c.length||a.options.dir)&&(b=j.STORE,c=""),d.uncompressedSize=c.length,d.crc32=this.crc32(c),d.compressedContent=b.compress(f.transformTo(b.compressInputType,c))),d.compressedSize=d.compressedContent.length,d.compressionMethod=b.magic,d},x=function(a,b,c,d){var e,f,h=(c.compressedContent,this.utf8encode(b.name)),i=h!==b.name,j=b.options,k="",l="";e=j.date.getHours(),e<<=6,e|=j.date.getMinutes(),e<<=5,e|=j.date.getSeconds()/2,f=j.date.getFullYear()-1980,f<<=4,f|=j.date.getMonth()+1,f<<=5,f|=j.date.getDate(),i&&(l=q(1,1)+q(this.crc32(h),4)+h,k+="up"+q(l.length,2)+l);var m="";m+="\n\x00",m+=i?"\x00\b":"\x00\x00",m+=c.compressionMethod,m+=q(e,2),m+=q(f,2),m+=q(c.crc32,4),m+=q(c.compressedSize,4),m+=q(c.uncompressedSize,4),m+=q(h.length,2),m+=q(k.length,2);var n=g.LOCAL_FILE_HEADER+m+h+k,o=g.CENTRAL_FILE_HEADER+"\x00"+m+"\x00\x00\x00\x00\x00\x00"+(b.options.dir===!0?"\x00\x00\x00":"\x00\x00\x00\x00")+q(d,4)+h+k;return{fileRecord:n,dirRecord:o,compressedObject:c}},y=function(){this.data=[]};y.prototype={append:function(a){a=f.transformTo("string",a),this.data.push(a)},finalize:function(){return this.data.join("")}};var z=function(a){this.data=new Uint8Array(a),this.index=0};z.prototype={append:function(a){0!==a.length&&(a=f.transformTo("uint8array",a),this.data.set(a,this.index),this.index+=a.length)},finalize:function(){return this.data}};var A={load:function(){throw new Error("Load method is not defined. Is the file jszip-load.js included ?")},filter:function(a){var b,c,d,e,f=[];for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],e=new p(d.name,d._data,r(d.options)),c=b.slice(this.root.length,b.length),b.slice(0,this.root.length)===this.root&&a(c,e)&&f.push(e));return f},file:function(a,b,c){if(1===arguments.length){if(f.isRegExp(a)){var d=a;return this.filter(function(a,b){return!b.options.dir&&d.test(a)})}return this.filter(function(b,c){return!c.options.dir&&b===a})[0]||null}return a=this.root+a,t.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(f.isRegExp(a))return this.filter(function(b,c){return c.options.dir&&a.test(b)});var b=this.root+a,c=v.call(this,b),d=this.clone();return d.root=c.name,d},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!=a.slice(-1)&&(a+="/"),b=this.files[a]),b)if(b.options.dir)for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];else delete this.files[a];return this},generate:function(a){a=r(a||{},{base64:!0,compression:"STORE",type:"base64"}),f.checkSupport(a.type);var b,c,d=[],e=0,h=0;for(var k in this.files)if(this.files.hasOwnProperty(k)){var l=this.files[k],m=l.options.compression||a.compression.toUpperCase(),n=j[m];if(!n)throw new Error(m+" is not a valid compression method !");var o=w.call(this,l,n),p=x.call(this,k,l,o,e);e+=p.fileRecord.length+o.compressedSize,h+=p.dirRecord.length,d.push(p)}var s="";s=g.CENTRAL_DIRECTORY_END+"\x00\x00\x00\x00"+q(d.length,2)+q(d.length,2)+q(h,4)+q(e,4)+"\x00\x00";var t=a.type.toLowerCase();for(b="uint8array"===t||"arraybuffer"===t||"blob"===t||"nodebuffer"===t?new z(e+h+s.length):new y(e+h+s.length),c=0;c<d.length;c++)b.append(d[c].fileRecord),b.append(d[c].compressedObject.compressedContent);for(c=0;c<d.length;c++)b.append(d[c].dirRecord);b.append(s);var u=b.finalize();switch(a.type.toLowerCase()){case"uint8array":case"arraybuffer":case"nodebuffer":return f.transformTo(a.type.toLowerCase(),u);case"blob":return f.arrayBuffer2Blob(f.transformTo("arraybuffer",u));case"base64":return a.base64?i.encode(u):u;default:return u}},crc32:function(a,b){if("undefined"==typeof a||!a.length)return 0;var c="string"!==f.getTypeOf(a),d=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];"undefined"==typeof b&&(b=0);var e=0,g=0,h=0;b=-1^b;for(var i=0,j=a.length;j>i;i++)h=c?a[i]:a.charCodeAt(i),g=255&(b^h),e=d[g],b=b>>>8^e;return-1^b},utf8encode:function(a){if(c){var b=c.encode(a);return f.transformTo("string",b)}if(e.nodebuffer)return f.transformTo("string",l(a,"utf-8"));for(var d=[],g=0,h=0;h<a.length;h++){var i=a.charCodeAt(h);128>i?d[g++]=String.fromCharCode(i):i>127&&2048>i?(d[g++]=String.fromCharCode(i>>6|192),d[g++]=String.fromCharCode(63&i|128)):(d[g++]=String.fromCharCode(i>>12|224),d[g++]=String.fromCharCode(i>>6&63|128),d[g++]=String.fromCharCode(63&i|128))}return d.join("")},utf8decode:function(a){var b=[],c=0,g=f.getTypeOf(a),h="string"!==g,i=0,j=0,k=0,l=0;if(d)return d.decode(f.transformTo("uint8array",a));if(e.nodebuffer)return f.transformTo("nodebuffer",a).toString("utf-8");for(;i<a.length;)j=h?a[i]:a.charCodeAt(i),128>j?(b[c++]=String.fromCharCode(j),i++):j>191&&224>j?(k=h?a[i+1]:a.charCodeAt(i+1),b[c++]=String.fromCharCode((31&j)<<6|63&k),i+=2):(k=h?a[i+1]:a.charCodeAt(i+1),l=h?a[i+2]:a.charCodeAt(i+2),b[c++]=String.fromCharCode((15&j)<<12|(63&k)<<6|63&l),i+=3);return b.join("")}};b.exports=A},{"./base64":1,"./compressedObject":2,"./compressions":3,"./defaults":5,"./nodeBuffer":17,"./signature":10,"./support":12,"./utils":14}],10:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],11:[function(a,b){"use strict";function c(a,b){this.data=a,b||(this.data=e.string2binary(this.data)),this.length=this.data.length,this.index=0}var d=a("./dataReader"),e=a("./utils");c.prototype=new d,c.prototype.byteAt=function(a){return this.data.charCodeAt(a)},c.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":4,"./utils":14}],12:[function(a,b,c){var d=a("__browserify_process");if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer=!d.browser,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var e=new ArrayBuffer(0);try{c.blob=0===new Blob([e],{type:"application/zip"}).size}catch(f){try{var g=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,h=new g;h.append(e),c.blob=0===h.getBlob("application/zip").size}catch(f){c.blob=!1}}}},{__browserify_process:18}],13:[function(a,b){"use strict";function c(a){a&&(this.data=a,this.length=this.data.length,this.index=0)}var d=a("./dataReader");c.prototype=new d,c.prototype.byteAt=function(a){return this.data[a]},c.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f;return-1},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.subarray(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":4}],14:[function(a,b,c){"use strict";function d(a){return a}function e(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function f(a){var b=65536,d=[],e=a.length,f=c.getTypeOf(a),g=0,h=!0;try{switch(f){case"uint8array":String.fromCharCode.apply(null,new Uint8Array(0));break;case"nodebuffer":String.fromCharCode.apply(null,j(0))}}catch(i){h=!1}if(!h){for(var k="",l=0;l<a.length;l++)k+=String.fromCharCode(a[l]);return k}for(;e>g&&b>1;)try{d.push("array"===f||"nodebuffer"===f?String.fromCharCode.apply(null,a.slice(g,Math.min(g+b,e))):String.fromCharCode.apply(null,a.subarray(g,Math.min(g+b,e)))),g+=b}catch(i){b=Math.floor(b/2)}return d.join("")}function g(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];return b}var h=a("./support"),i=a("./compressions"),j=a("./nodeBuffer");c.string2binary=function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(255&a.charCodeAt(c));return b},c.string2Uint8Array=function(a){return c.transformTo("uint8array",a)},c.uint8Array2String=function(a){return c.transformTo("string",a)},c.string2Blob=function(a){var b=c.transformTo("arraybuffer",a);return c.arrayBuffer2Blob(b)},c.arrayBuffer2Blob=function(a){c.checkSupport("blob");try{return new Blob([a],{type:"application/zip"})}catch(b){try{var d=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,e=new d;return e.append(a),e.getBlob("application/zip")}catch(b){throw new Error("Bug : can't construct the Blob.")}}};var k={};k.string={string:d,array:function(a){return e(a,new Array(a.length))},arraybuffer:function(a){return k.string.uint8array(a).buffer},uint8array:function(a){return e(a,new Uint8Array(a.length))},nodebuffer:function(a){return e(a,j(a.length))}},k.array={string:f,array:d,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(a)}},k.arraybuffer={string:function(a){return f(new Uint8Array(a))},array:function(a){return g(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:d,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(new Uint8Array(a))}},k.uint8array={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:d,nodebuffer:function(a){return j(a)}},k.nodebuffer={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return k.nodebuffer.uint8array(a).buffer},uint8array:function(a){return g(a,new Uint8Array(a.length))},nodebuffer:d},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=k[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":h.nodebuffer&&j.test(a)?"nodebuffer":h.uint8array&&a instanceof Uint8Array?"uint8array":h.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=h[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this browser")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(16>b?"0":"")+b.toString(16).toUpperCase();return d},c.findCompression=function(a){for(var b in i)if(i.hasOwnProperty(b)&&i[b].magic===a)return i[b];return null},c.isRegExp=function(a){return"[object RegExp]"===Object.prototype.toString.call(a)}},{"./compressions":3,"./nodeBuffer":17,"./support":12}],15:[function(a,b){"use strict";function c(a,b){this.files=[],this.loadOptions=b,a&&this.load(a)}var d=a("./stringReader"),e=a("./nodeBufferReader"),f=a("./uint8ArrayReader"),g=a("./utils"),h=a("./signature"),i=a("./zipEntry"),j=a("./support");c.prototype={checkSignature:function(a){var b=this.reader.readString(4);if(b!==a)throw new Error("Corrupted zip or bug : unexpected signature ("+g.pretty(b)+", expected "+g.pretty(a)+")")},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2),this.zipComment=this.reader.readString(this.zipCommentLength)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.versionMadeBy=this.reader.readString(2),this.versionNeeded=this.reader.readInt(2),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;d>e;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readString(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(h.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readString(4)===h.CENTRAL_FILE_HEADER;)a=new i({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(h.CENTRAL_DIRECTORY_END);if(-1===a)throw new Error("Corrupted zip : can't find end of central directory");if(this.reader.setIndex(a),this.checkSignature(h.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===g.MAX_VALUE_16BITS||this.diskWithCentralDirStart===g.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===g.MAX_VALUE_16BITS||this.centralDirRecords===g.MAX_VALUE_16BITS||this.centralDirSize===g.MAX_VALUE_32BITS||this.centralDirOffset===g.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),-1===a)throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");this.reader.setIndex(a),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}},prepareReader:function(a){var b=g.getTypeOf(a);this.reader="string"!==b||j.uint8array?"nodebuffer"===b?new e(a):new f(g.transformTo("uint8array",a)):new d(a,this.loadOptions.optimizedBinaryString)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=c},{"./nodeBufferReader":17,"./signature":10,"./stringReader":11,"./support":12,"./uint8ArrayReader":13,"./utils":14,"./zipEntry":16}],16:[function(a,b){"use strict";function c(a,b){this.options=a,this.loadOptions=b}var d=a("./stringReader"),e=a("./utils"),f=a("./compressedObject"),g=a("./object");c.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},prepareCompressedContent:function(a,b,c){return function(){var d=a.index;a.setIndex(b);var e=a.readData(c);return a.setIndex(d),e}},prepareContent:function(a,b,c,d,f){return function(){var a=e.transformTo(d.uncompressInputType,this.getCompressedContent()),b=d.uncompress(a);if(b.length!==f)throw new Error("Bug : uncompressed data size mismatch");return b}},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readString(this.fileNameLength),a.skip(c),-1==this.compressedSize||-1==this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if(b=e.findCompression(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+e.pretty(this.compressionMethod)+" unknown (inner file : "+this.fileName+")");if(this.decompressed=new f,this.decompressed.compressedSize=this.compressedSize,this.decompressed.uncompressedSize=this.uncompressedSize,this.decompressed.crc32=this.crc32,this.decompressed.compressionMethod=this.compressionMethod,this.decompressed.getCompressedContent=this.prepareCompressedContent(a,a.index,this.compressedSize,b),this.decompressed.getContent=this.prepareContent(a,a.index,this.compressedSize,b,this.uncompressedSize),this.loadOptions.checkCRC32&&(this.decompressed=e.transformTo("string",this.decompressed.getContent()),g.crc32(this.decompressed)!==this.crc32))throw new Error("Corrupted zip : CRC32 mismatch")},readCentralPart:function(a){if(this.versionMadeBy=a.readString(2),this.versionNeeded=a.readInt(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4),this.fileNameLength=a.readInt(2),this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");this.fileName=a.readString(this.fileNameLength),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readString(this.fileCommentLength),this.dir=16&this.externalFileAttributes?!0:!1},parseZIP64ExtraField:function(){if(this.extraFields[1]){var a=new d(this.extraFields[1].value);this.uncompressedSize===e.MAX_VALUE_32BITS&&(this.uncompressedSize=a.readInt(8)),this.compressedSize===e.MAX_VALUE_32BITS&&(this.compressedSize=a.readInt(8)),this.localHeaderOffset===e.MAX_VALUE_32BITS&&(this.localHeaderOffset=a.readInt(8)),this.diskNumberStart===e.MAX_VALUE_32BITS&&(this.diskNumberStart=a.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index;for(this.extraFields=this.extraFields||{};a.index<e+this.extraFieldsLength;)b=a.readInt(2),c=a.readInt(2),d=a.readString(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){if(this.useUTF8())this.fileName=g.utf8decode(this.fileName),this.fileComment=g.utf8decode(this.fileComment);else{var a=this.findExtraFieldUnicodePath();null!==a&&(this.fileName=a)}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileName)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null}},b.exports=c},{"./compressedObject":2,"./object":9,"./stringReader":11,"./utils":14}],17:[function(){},{}],18:[function(a,b){var c=b.exports={};c.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),c.title="browser",c.browser=!0,c.env={},c.argv=[],c.binding=function(){throw new Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(){throw new Error("process.chdir is not supported")}},{}],19:[function(){/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */
(function(){"use strict";function a(a,b){var c=a.split("."),d=n;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||b===l?d=d[e]?d[e]:d[e]={}:d[e]=b}function b(a,b){if(this.index="number"==typeof b?b:0,this.d=0,this.buffer=a instanceof(o?Uint8Array:Array)?a:new(o?Uint8Array:Array)(32768),2*this.buffer.length<=this.index)throw Error("invalid index");this.buffer.length<=this.index&&c(this)}function c(a){var b,c=a.buffer,d=c.length,e=new(o?Uint8Array:Array)(d<<1);if(o)e.set(c);else for(b=0;d>b;++b)e[b]=c[b];return a.buffer=e}function d(a){this.buffer=new(o?Uint16Array:Array)(2*a),this.length=0}function e(a,b){this.e=w,this.f=0,this.input=o&&a instanceof Array?new Uint8Array(a):a,this.c=0,b&&(b.lazy&&(this.f=b.lazy),"number"==typeof b.compressionType&&(this.e=b.compressionType),b.outputBuffer&&(this.b=o&&b.outputBuffer instanceof Array?new Uint8Array(b.outputBuffer):b.outputBuffer),"number"==typeof b.outputIndex&&(this.c=b.outputIndex)),this.b||(this.b=new(o?Uint8Array:Array)(32768))}function f(a,b){this.length=a,this.g=b}function g(a,b){function c(a,b){var c,d=a.g,e=[],f=0;c=z[a.length],e[f++]=65535&c,e[f++]=c>>16&255,e[f++]=c>>24;var g;switch(m){case 1===d:g=[0,d-1,0];break;case 2===d:g=[1,d-2,0];break;case 3===d:g=[2,d-3,0];break;case 4===d:g=[3,d-4,0];break;case 6>=d:g=[4,d-5,1];break;case 8>=d:g=[5,d-7,1];break;case 12>=d:g=[6,d-9,2];break;case 16>=d:g=[7,d-13,2];break;case 24>=d:g=[8,d-17,3];break;case 32>=d:g=[9,d-25,3];break;case 48>=d:g=[10,d-33,4];break;case 64>=d:g=[11,d-49,4];break;case 96>=d:g=[12,d-65,5];break;case 128>=d:g=[13,d-97,5];break;case 192>=d:g=[14,d-129,6];break;case 256>=d:g=[15,d-193,6];break;case 384>=d:g=[16,d-257,7];break;case 512>=d:g=[17,d-385,7];break;case 768>=d:g=[18,d-513,8];break;case 1024>=d:g=[19,d-769,8];break;case 1536>=d:g=[20,d-1025,9];break;case 2048>=d:g=[21,d-1537,9];break;case 3072>=d:g=[22,d-2049,10];break;case 4096>=d:g=[23,d-3073,10];break;case 6144>=d:g=[24,d-4097,11];break;case 8192>=d:g=[25,d-6145,11];break;case 12288>=d:g=[26,d-8193,12];break;case 16384>=d:g=[27,d-12289,12];break;case 24576>=d:g=[28,d-16385,13];break;case 32768>=d:g=[29,d-24577,13];break;default:throw"invalid distance"}c=g,e[f++]=c[0],e[f++]=c[1],e[f++]=c[2];var h,i;for(h=0,i=e.length;i>h;++h)r[s++]=e[h];u[e[0]]++,v[e[3]]++,t=a.length+b-1,n=null}var d,e,f,g,i,j,k,n,p,q={},r=o?new Uint16Array(2*b.length):[],s=0,t=0,u=new(o?Uint32Array:Array)(286),v=new(o?Uint32Array:Array)(30),w=a.f;if(!o){for(f=0;285>=f;)u[f++]=0;for(f=0;29>=f;)v[f++]=0}for(u[256]=1,d=0,e=b.length;e>d;++d){for(f=i=0,g=3;g>f&&d+f!==e;++f)i=i<<8|b[d+f];if(q[i]===l&&(q[i]=[]),j=q[i],!(0<t--)){for(;0<j.length&&32768<d-j[0];)j.shift();if(d+3>=e){for(n&&c(n,-1),f=0,g=e-d;g>f;++f)p=b[d+f],r[s++]=p,++u[p];break}0<j.length?(k=h(b,d,j),n?n.length<k.length?(p=b[d-1],r[s++]=p,++u[p],c(k,0)):c(n,-1):k.length<w?n=k:c(k,0)):n?c(n,-1):(p=b[d],r[s++]=p,++u[p])}j.push(d)}return r[s++]=256,u[256]++,a.j=u,a.i=v,o?r.subarray(0,s):r}function h(a,b,c){var d,e,g,h,i,j,k=0,l=a.length;h=0,j=c.length;a:for(;j>h;h++){if(d=c[j-h-1],g=3,k>3){for(i=k;i>3;i--)if(a[d+i-1]!==a[b+i-1])continue a;g=k}for(;258>g&&l>b+g&&a[d+g]===a[b+g];)++g;if(g>k&&(e=d,k=g),258===g)break}return new f(k,b-e)}function i(a,b){var c,e,f,g,h,i=a.length,k=new d(572),l=new(o?Uint8Array:Array)(i);if(!o)for(g=0;i>g;g++)l[g]=0;for(g=0;i>g;++g)0<a[g]&&k.push(g,a[g]);if(c=Array(k.length/2),e=new(o?Uint32Array:Array)(k.length/2),1===c.length)return l[k.pop().index]=1,l;for(g=0,h=k.length/2;h>g;++g)c[g]=k.pop(),e[g]=c[g].value;for(f=j(e,e.length,b),g=0,h=c.length;h>g;++g)l[c[g].index]=f[g];return l}function j(a,b,c){function d(a){var c=n[a][p[a]];c===b?(d(a+1),d(a+1)):--l[c],++p[a]}var e,f,g,h,i,j=new(o?Uint16Array:Array)(c),k=new(o?Uint8Array:Array)(c),l=new(o?Uint8Array:Array)(b),m=Array(c),n=Array(c),p=Array(c),q=(1<<c)-b,r=1<<c-1;for(j[c-1]=b,f=0;c>f;++f)r>q?k[f]=0:(k[f]=1,q-=r),q<<=1,j[c-2-f]=(j[c-1-f]/2|0)+b;for(j[0]=k[0],m[0]=Array(j[0]),n[0]=Array(j[0]),f=1;c>f;++f)j[f]>2*j[f-1]+k[f]&&(j[f]=2*j[f-1]+k[f]),m[f]=Array(j[f]),n[f]=Array(j[f]);for(e=0;b>e;++e)l[e]=c;for(g=0;g<j[c-1];++g)m[c-1][g]=a[g],n[c-1][g]=g;for(e=0;c>e;++e)p[e]=0;for(1===k[c-1]&&(--l[0],++p[c-1]),f=c-2;f>=0;--f){for(h=e=0,i=p[f+1],g=0;g<j[f];g++)h=m[f+1][i]+m[f+1][i+1],h>a[e]?(m[f][g]=h,n[f][g]=b,i+=2):(m[f][g]=a[e],n[f][g]=e,++e);p[f]=0,1===k[f]&&d(f)}return l}function k(a){var b,c,d,e,f=new(o?Uint16Array:Array)(a.length),g=[],h=[],i=0;for(b=0,c=a.length;c>b;b++)g[a[b]]=(0|g[a[b]])+1;for(b=1,c=16;c>=b;b++)h[b]=i,i+=0|g[b],i<<=1;for(b=0,c=a.length;c>b;b++)for(i=h[a[b]],h[a[b]]+=1,d=f[b]=0,e=a[b];e>d;d++)f[b]=f[b]<<1|1&i,i>>>=1;return f}var l=void 0,m=!0,n=this,o="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView;b.prototype.a=function(a,b,d){var e,f=this.buffer,g=this.index,h=this.d,i=f[g];if(d&&b>1&&(a=b>8?(u[255&a]<<24|u[a>>>8&255]<<16|u[a>>>16&255]<<8|u[a>>>24&255])>>32-b:u[a]>>8-b),8>b+h)i=i<<b|a,h+=b;else for(e=0;b>e;++e)i=i<<1|a>>b-e-1&1,8===++h&&(h=0,f[g++]=u[i],i=0,g===f.length&&(f=c(this)));f[g]=i,this.buffer=f,this.d=h,this.index=g},b.prototype.finish=function(){var a,b=this.buffer,c=this.index;return 0<this.d&&(b[c]<<=8-this.d,b[c]=u[b[c]],c++),o?a=b.subarray(0,c):(b.length=c,a=b),a};var p,q=new(o?Uint8Array:Array)(256);for(p=0;256>p;++p){for(var r=p,s=r,t=7,r=r>>>1;r;r>>>=1)s<<=1,s|=1&r,--t;q[p]=(s<<t&255)>>>0}var u=q;d.prototype.getParent=function(a){return 2*((a-2)/4|0)},d.prototype.push=function(a,b){var c,d,e,f=this.buffer;for(c=this.length,f[this.length++]=b,f[this.length++]=a;c>0&&(d=this.getParent(c),f[c]>f[d]);)e=f[c],f[c]=f[d],f[d]=e,e=f[c+1],f[c+1]=f[d+1],f[d+1]=e,c=d;return this.length},d.prototype.pop=function(){var a,b,c,d,e,f=this.buffer;for(b=f[0],a=f[1],this.length-=2,f[0]=f[this.length],f[1]=f[this.length+1],e=0;(d=2*e+2,!(d>=this.length))&&(d+2<this.length&&f[d+2]>f[d]&&(d+=2),f[d]>f[e]);)c=f[e],f[e]=f[d],f[d]=c,c=f[e+1],f[e+1]=f[d+1],f[d+1]=c,e=d;return{index:a,value:b,length:this.length}};var v,w=2,x=[];for(v=0;288>v;v++)switch(m){case 143>=v:x.push([v+48,8]);break;case 255>=v:x.push([v-144+400,9]);break;case 279>=v:x.push([v-256+0,7]);break;case 287>=v:x.push([v-280+192,8]);break;default:throw"invalid literal: "+v}e.prototype.h=function(){var a,c,d,e,f=this.input;switch(this.e){case 0:for(d=0,e=f.length;e>d;){c=o?f.subarray(d,d+65535):f.slice(d,d+65535),d+=c.length;var h=c,j=d===e,n=l,p=l,q=l,r=l,s=l,t=this.b,u=this.c;if(o){for(t=new Uint8Array(this.b.buffer);t.length<=u+h.length+5;)t=new Uint8Array(t.length<<1);t.set(this.b)}if(n=j?1:0,t[u++]=0|n,p=h.length,q=~p+65536&65535,t[u++]=255&p,t[u++]=p>>>8&255,t[u++]=255&q,t[u++]=q>>>8&255,o)t.set(h,u),u+=h.length,t=t.subarray(0,u);else{for(r=0,s=h.length;s>r;++r)t[u++]=h[r];t.length=u}this.c=u,this.b=t}break;case 1:var v=new b(o?new Uint8Array(this.b.buffer):this.b,this.c);v.a(1,1,m),v.a(1,2,m);var y,z,A,B=g(this,f);for(y=0,z=B.length;z>y;y++)if(A=B[y],b.prototype.a.apply(v,x[A]),A>256)v.a(B[++y],B[++y],m),v.a(B[++y],5),v.a(B[++y],B[++y],m);else if(256===A)break;this.b=v.finish(),this.c=this.b.length;break;case w:var C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R=new b(o?new Uint8Array(this.b.buffer):this.b,this.c),S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],T=Array(19);for(C=w,R.a(1,1,m),R.a(C,2,m),D=g(this,f),H=i(this.j,15),I=k(H),J=i(this.i,7),K=k(J),E=286;E>257&&0===H[E-1];E--);for(F=30;F>1&&0===J[F-1];F--);var U,V,W,X,Y,Z,$=E,_=F,ab=new(o?Uint32Array:Array)($+_),bb=new(o?Uint32Array:Array)(316),cb=new(o?Uint8Array:Array)(19);for(U=V=0;$>U;U++)ab[V++]=H[U];for(U=0;_>U;U++)ab[V++]=J[U];if(!o)for(U=0,X=cb.length;X>U;++U)cb[U]=0;for(U=Y=0,X=ab.length;X>U;U+=V){for(V=1;X>U+V&&ab[U+V]===ab[U];++V);if(W=V,0===ab[U])if(3>W)for(;0<W--;)bb[Y++]=0,cb[0]++;else for(;W>0;)Z=138>W?W:138,Z>W-3&&W>Z&&(Z=W-3),10>=Z?(bb[Y++]=17,bb[Y++]=Z-3,cb[17]++):(bb[Y++]=18,bb[Y++]=Z-11,cb[18]++),W-=Z;else if(bb[Y++]=ab[U],cb[ab[U]]++,W--,3>W)for(;0<W--;)bb[Y++]=ab[U],cb[ab[U]]++;else for(;W>0;)Z=6>W?W:6,Z>W-3&&W>Z&&(Z=W-3),bb[Y++]=16,bb[Y++]=Z-3,cb[16]++,W-=Z}for(a=o?bb.subarray(0,Y):bb.slice(0,Y),L=i(cb,7),P=0;19>P;P++)T[P]=L[S[P]];for(G=19;G>4&&0===T[G-1];G--);for(M=k(L),R.a(E-257,5,m),R.a(F-1,5,m),R.a(G-4,4,m),P=0;G>P;P++)R.a(T[P],3,m);for(P=0,Q=a.length;Q>P;P++)if(N=a[P],R.a(M[N],L[N],m),N>=16){switch(P++,N){case 16:O=2;break;case 17:O=3;break;case 18:O=7;break;default:throw"invalid code: "+N}R.a(a[P],O,m)}var db,eb,fb,gb,hb,ib,jb,kb,lb=[I,H],mb=[K,J];for(hb=lb[0],ib=lb[1],jb=mb[0],kb=mb[1],db=0,eb=D.length;eb>db;++db)if(fb=D[db],R.a(hb[fb],ib[fb],m),fb>256)R.a(D[++db],D[++db],m),gb=D[++db],R.a(jb[gb],kb[gb],m),R.a(D[++db],D[++db],m);else if(256===fb)break;this.b=R.finish(),this.c=this.b.length;break;default:throw"invalid compression type"}return this.b};var y=function(){function a(a){switch(m){case 3===a:return[257,a-3,0];case 4===a:return[258,a-4,0];case 5===a:return[259,a-5,0];case 6===a:return[260,a-6,0];case 7===a:return[261,a-7,0];case 8===a:return[262,a-8,0];case 9===a:return[263,a-9,0];case 10===a:return[264,a-10,0];case 12>=a:return[265,a-11,1];case 14>=a:return[266,a-13,1];case 16>=a:return[267,a-15,1];case 18>=a:return[268,a-17,1];case 22>=a:return[269,a-19,2];case 26>=a:return[270,a-23,2];case 30>=a:return[271,a-27,2];case 34>=a:return[272,a-31,2];case 42>=a:return[273,a-35,3];case 50>=a:return[274,a-43,3];case 58>=a:return[275,a-51,3];case 66>=a:return[276,a-59,3];case 82>=a:return[277,a-67,4];case 98>=a:return[278,a-83,4];case 114>=a:return[279,a-99,4];case 130>=a:return[280,a-115,4];case 162>=a:return[281,a-131,5];case 194>=a:return[282,a-163,5];case 226>=a:return[283,a-195,5];case 257>=a:return[284,a-227,5];case 258===a:return[285,a-258,0];default:throw"invalid length: "+a}}var b,c,d=[];for(b=3;258>=b;b++)c=a(b),d[b]=c[2]<<24|c[1]<<16|c[0];return d}(),z=o?new Uint32Array(y):y;a("Zlib.RawDeflate",e),a("Zlib.RawDeflate.prototype.compress",e.prototype.h);var A,B,C,D,E={NONE:0,FIXED:1,DYNAMIC:w};if(Object.keys)A=Object.keys(E);else for(B in A=[],C=0,E)A[C++]=B;for(C=0,D=A.length;D>C;++C)B=A[C],a("Zlib.RawDeflate.CompressionType."+B,E[B])}).call(this)},{}],20:[function(){/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */
(function(){"use strict";function a(a,b){var c=a.split("."),d=g;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d=d[e]?d[e]:d[e]={}:d[e]=b}function b(a){var b,c,d,e,f,g,i,j,k,l,m=a.length,n=0,o=Number.POSITIVE_INFINITY;for(j=0;m>j;++j)a[j]>n&&(n=a[j]),a[j]<o&&(o=a[j]);for(b=1<<n,c=new(h?Uint32Array:Array)(b),d=1,e=0,f=2;n>=d;){for(j=0;m>j;++j)if(a[j]===d){for(g=0,i=e,k=0;d>k;++k)g=g<<1|1&i,i>>=1;for(l=d<<16|j,k=g;b>k;k+=f)c[k]=l;++e}++d,e<<=1,f<<=1}return[c,n,o]}function c(a,b){switch(this.g=[],this.h=32768,this.c=this.f=this.d=this.k=0,this.input=h?new Uint8Array(a):a,this.l=!1,this.i=j,this.q=!1,(b||!(b={}))&&(b.index&&(this.d=b.index),b.bufferSize&&(this.h=b.bufferSize),b.bufferType&&(this.i=b.bufferType),b.resize&&(this.q=b.resize)),this.i){case i:this.a=32768,this.b=new(h?Uint8Array:Array)(32768+this.h+258);break;case j:this.a=0,this.b=new(h?Uint8Array:Array)(this.h),this.e=this.v,this.m=this.s,this.j=this.t;break;default:throw Error("invalid inflate mode")}}function d(a,b){for(var c,d=a.f,e=a.c,f=a.input,g=a.d,h=f.length;b>e;){if(g>=h)throw Error("input buffer is broken");d|=f[g++]<<e,e+=8}return c=d&(1<<b)-1,a.f=d>>>b,a.c=e-b,a.d=g,c}function e(a,b){for(var c,d,e=a.f,f=a.c,g=a.input,h=a.d,i=g.length,j=b[0],k=b[1];k>f&&!(h>=i);)e|=g[h++]<<f,f+=8;return c=j[e&(1<<k)-1],d=c>>>16,a.f=e>>d,a.c=f-d,a.d=h,65535&c}function f(a){function c(a,b,c){var f,g,h,i=this.p;for(h=0;a>h;)switch(f=e(this,b)){case 16:for(g=3+d(this,2);g--;)c[h++]=i;break;case 17:for(g=3+d(this,3);g--;)c[h++]=0;i=0;break;case 18:for(g=11+d(this,7);g--;)c[h++]=0;i=0;break;default:i=c[h++]=f}return this.p=i,c}var f,g,i,j,k=d(a,5)+257,l=d(a,5)+1,m=d(a,4)+4,o=new(h?Uint8Array:Array)(n.length);for(j=0;m>j;++j)o[n[j]]=d(a,3);if(!h)for(j=m,m=o.length;m>j;++j)o[n[j]]=0;f=b(o),g=new(h?Uint8Array:Array)(k),i=new(h?Uint8Array:Array)(l),a.p=0,a.j(b(c.call(a,k,f,g)),b(c.call(a,l,f,i)))}var g=this,h="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView,i=0,j=1;c.prototype.u=function(){for(;!this.l;){var a=d(this,3);switch(1&a&&(this.l=!0),a>>>=1){case 0:var b=this.input,c=this.d,e=this.b,g=this.a,k=b.length,l=void 0,m=void 0,n=e.length,o=void 0;if(this.c=this.f=0,c+1>=k)throw Error("invalid uncompressed block header: LEN");if(l=b[c++]|b[c++]<<8,c+1>=k)throw Error("invalid uncompressed block header: NLEN");if(m=b[c++]|b[c++]<<8,l===~m)throw Error("invalid uncompressed block header: length verify");if(c+l>b.length)throw Error("input buffer is broken");switch(this.i){case i:for(;g+l>e.length;){if(o=n-g,l-=o,h)e.set(b.subarray(c,c+o),g),g+=o,c+=o;else for(;o--;)e[g++]=b[c++];this.a=g,e=this.e(),g=this.a}break;case j:for(;g+l>e.length;)e=this.e({o:2});break;default:throw Error("invalid inflate mode")}if(h)e.set(b.subarray(c,c+l),g),g+=l,c+=l;else for(;l--;)e[g++]=b[c++];this.d=c,this.a=g,this.b=e;break;case 1:this.j(z,B);break;case 2:f(this);break;default:throw Error("unknown BTYPE: "+a)}}return this.m()};var k,l,m=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],n=h?new Uint16Array(m):m,o=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],p=h?new Uint16Array(o):o,q=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],r=h?new Uint8Array(q):q,s=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t=h?new Uint16Array(s):s,u=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],v=h?new Uint8Array(u):u,w=new(h?Uint8Array:Array)(288);for(k=0,l=w.length;l>k;++k)w[k]=143>=k?8:255>=k?9:279>=k?7:8;var x,y,z=b(w),A=new(h?Uint8Array:Array)(30);for(x=0,y=A.length;y>x;++x)A[x]=5;var B=b(A);c.prototype.j=function(a,b){var c=this.b,f=this.a;this.n=a;for(var g,h,i,j,k=c.length-258;256!==(g=e(this,a));)if(256>g)f>=k&&(this.a=f,c=this.e(),f=this.a),c[f++]=g;else for(h=g-257,j=p[h],0<r[h]&&(j+=d(this,r[h])),g=e(this,b),i=t[g],0<v[g]&&(i+=d(this,v[g])),f>=k&&(this.a=f,c=this.e(),f=this.a);j--;)c[f]=c[f++-i];for(;8<=this.c;)this.c-=8,this.d--;this.a=f},c.prototype.t=function(a,b){var c=this.b,f=this.a;this.n=a;for(var g,h,i,j,k=c.length;256!==(g=e(this,a));)if(256>g)f>=k&&(c=this.e(),k=c.length),c[f++]=g;else for(h=g-257,j=p[h],0<r[h]&&(j+=d(this,r[h])),g=e(this,b),i=t[g],0<v[g]&&(i+=d(this,v[g])),f+j>k&&(c=this.e(),k=c.length);j--;)c[f]=c[f++-i];for(;8<=this.c;)this.c-=8,this.d--;this.a=f},c.prototype.e=function(){var a,b,c=new(h?Uint8Array:Array)(this.a-32768),d=this.a-32768,e=this.b;if(h)c.set(e.subarray(32768,c.length));else for(a=0,b=c.length;b>a;++a)c[a]=e[a+32768];if(this.g.push(c),this.k+=c.length,h)e.set(e.subarray(d,d+32768));else for(a=0;32768>a;++a)e[a]=e[d+a];return this.a=32768,e},c.prototype.v=function(a){var b,c,d,e,f=this.input.length/this.d+1|0,g=this.input,i=this.b;return a&&("number"==typeof a.o&&(f=a.o),"number"==typeof a.r&&(f+=a.r)),2>f?(c=(g.length-this.d)/this.n[2],e=258*(c/2)|0,d=e<i.length?i.length+e:i.length<<1):d=i.length*f,h?(b=new Uint8Array(d),b.set(i)):b=i,this.b=b},c.prototype.m=function(){var a,b,c,d,e,f=0,g=this.b,i=this.g,j=new(h?Uint8Array:Array)(this.k+(this.a-32768));if(0===i.length)return h?this.b.subarray(32768,this.a):this.b.slice(32768,this.a);for(b=0,c=i.length;c>b;++b)for(a=i[b],d=0,e=a.length;e>d;++d)j[f++]=a[d];for(b=32768,c=this.a;c>b;++b)j[f++]=g[b];return this.g=[],this.buffer=j},c.prototype.s=function(){var a,b=this.a;return h?this.q?(a=new Uint8Array(b),a.set(this.b.subarray(0,b))):a=this.b.subarray(0,b):(this.b.length>b&&(this.b.length=b),a=this.b),this.buffer=a},a("Zlib.RawInflate",c),a("Zlib.RawInflate.prototype.decompress",c.prototype.u);var C,D,E,F,G={ADAPTIVE:j,BLOCK:i};if(Object.keys)C=Object.keys(G);else for(D in C=[],E=0,G)C[E++]=D;for(E=0,F=C.length;F>E;++E)D=C[E],a("Zlib.RawInflate.BufferType."+D,G[D])}).call(this)},{}]},{},[7])(7)});;// Spectrum Colorpicker v1.1.2
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

(function (window, $, undefined) {
    var defaultOpts = {

        // Callbacks
        beforeShow: noop,
        move: noop,
        change: noop,
        show: noop,
        hide: noop,

        // Options
        color: false,
        flat: false,
        showInput: false,
        showButtons: true,
        clickoutFiresChange: false,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        preferredFormat: false,
        className: "",
        showAlpha: false,
        theme: "sp-light",
        palette: ['fff', '000'],
        selectionPalette: [],
        disabled: false
    },
    spectrums = [],
    IE = !!/msie/i.exec( window.navigator.userAgent ),
    rgbaSupport = (function() {
        function contains( str, substr ) {
            return !!~('' + str).indexOf(substr);
        }

        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:rgba(0,0,0,.5)';
        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
    })(),
    replaceInput = [
        "<div class='sp-replacer'>",
            "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
            "<div class='sp-dd'>&#9660;</div>",
        "</div>"
    ].join(''),
    markup = (function () {

        // IE does not support gradients with multiple stops, so we need to simulate
        //  that for the rainbow slider with 8 divs that each have a single gradient
        var gradientFix = "";
        if (IE) {
            for (var i = 1; i <= 6; i++) {
                gradientFix += "<div class='sp-" + i + "'></div>";
            }
        }

        return [
            "<div class='sp-container sp-hidden'>",
                "<div class='sp-palette-container'>",
                    "<div class='sp-palette sp-thumb sp-cf'></div>",
                "</div>",
                "<div class='sp-picker-container'>",
                    "<div class='sp-top sp-cf'>",
                        "<div class='sp-fill'></div>",
                        "<div class='sp-top-inner'>",
                            "<div class='sp-color'>",
                                "<div class='sp-sat'>",
                                    "<div class='sp-val'>",
                                        "<div class='sp-dragger'></div>",
                                    "</div>",
                                "</div>",
                            "</div>",
                            "<div class='sp-hue'>",
                                "<div class='sp-slider'></div>",
                                gradientFix,
                            "</div>",
                        "</div>",
                        "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
                    "</div>",
                    "<div class='sp-input-container sp-cf'>",
                        "<input class='sp-input' type='text' spellcheck='false'  />",
                    "</div>",
                    "<div class='sp-initial sp-thumb sp-cf'></div>",
                    "<div class='sp-button-container sp-cf'>",
                        "<a class='sp-cancel' href='#'></a>",
                        "<button class='sp-choose'></button>",
                    "</div>",
                "</div>",
            "</div>"
        ].join("");
    })();

    function paletteTemplate (p, color, className) {
        var html = [];
        for (var i = 0; i < p.length; i++) {
            var tiny = tinycolor(p[i]);
            var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
            c += (tinycolor.equals(color, p[i])) ? " sp-thumb-active" : "";

            var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
            html.push('<span title="' + tiny.toRgbString() + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
        }
        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
    }

    function hideAll() {
        for (var i = 0; i < spectrums.length; i++) {
            if (spectrums[i]) {
                spectrums[i].hide();
            }
        }
    }

    function instanceOptions(o, callbackContext) {
        var opts = $.extend({}, defaultOpts, o);
        opts.callbacks = {
            'move': bind(opts.move, callbackContext),
            'change': bind(opts.change, callbackContext),
            'show': bind(opts.show, callbackContext),
            'hide': bind(opts.hide, callbackContext),
            'beforeShow': bind(opts.beforeShow, callbackContext)
        };

        return opts;
    }

    function spectrum(element, o) {

        var opts = instanceOptions(o, element),
            flat = opts.flat,
            showSelectionPalette = opts.showSelectionPalette,
            localStorageKey = opts.localStorageKey,
            theme = opts.theme,
            callbacks = opts.callbacks,
            resize = throttle(reflow, 10),
            visible = false,
            dragWidth = 0,
            dragHeight = 0,
            dragHelperHeight = 0,
            slideHeight = 0,
            slideWidth = 0,
            alphaWidth = 0,
            alphaSlideHelperWidth = 0,
            slideHelperHeight = 0,
            currentHue = 0,
            currentSaturation = 0,
            currentValue = 0,
            currentAlpha = 1,
            palette = opts.palette.slice(0),
            paletteArray = $.isArray(palette[0]) ? palette : [palette],
            selectionPalette = opts.selectionPalette.slice(0),
            maxSelectionSize = opts.maxSelectionSize,
            draggingClass = "sp-dragging",
            shiftMovementDirection = null;

        var doc = element.ownerDocument,
            body = doc.body,
            boundElement = $(element),
            disabled = false,
            container = $(markup, doc).addClass(theme),
            dragger = container.find(".sp-color"),
            dragHelper = container.find(".sp-dragger"),
            slider = container.find(".sp-hue"),
            slideHelper = container.find(".sp-slider"),
            alphaSliderInner = container.find(".sp-alpha-inner"),
            alphaSlider = container.find(".sp-alpha"),
            alphaSlideHelper = container.find(".sp-alpha-handle"),
            textInput = container.find(".sp-input"),
            paletteContainer = container.find(".sp-palette"),
            initialColorContainer = container.find(".sp-initial"),
            cancelButton = container.find(".sp-cancel"),
            chooseButton = container.find(".sp-choose"),
            isInput = boundElement.is("input"),
            shouldReplace = isInput && !flat,
            replacer = (shouldReplace) ? $(replaceInput).addClass(theme).addClass(opts.className) : $([]),
            offsetElement = (shouldReplace) ? replacer : boundElement,
            previewElement = replacer.find(".sp-preview-inner"),
            initialColor = opts.color || (isInput && boundElement.val()),
            colorOnShow = false,
            preferredFormat = opts.preferredFormat,
            currentPreferredFormat = preferredFormat,
            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange;


        function applyOptions() {

            if (opts.showPaletteOnly) {
                opts.showPalette = true;
            }

            container.toggleClass("sp-flat", flat);
            container.toggleClass("sp-input-disabled", !opts.showInput);
            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
            container.toggleClass("sp-buttons-disabled", !opts.showButtons);
            container.toggleClass("sp-palette-disabled", !opts.showPalette);
            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
            container.toggleClass("sp-initial-disabled", !opts.showInitial);
            container.addClass(opts.className);

            reflow();
        }

        function initialize() {

            if (IE) {
                container.find("*:not(input)").attr("unselectable", "on");
            }

            applyOptions();

            if (shouldReplace) {
                boundElement.after(replacer).hide();
            }

            if (flat) {
                boundElement.after(container).hide();
            }
            else {

                var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
                if (appendTo.length !== 1) {
                    appendTo = $("body");
                }

                appendTo.append(container);
            }

            if (localStorageKey && window.localStorage) {

                // Migrate old palettes over to new format.  May want to remove this eventually.
                try {
                    var oldPalette = window.localStorage[localStorageKey].split(",#");
                    if (oldPalette.length > 1) {
                        delete window.localStorage[localStorageKey];
                        $.each(oldPalette, function(i, c) {
                             addColorToSelectionPalette(c);
                        });
                    }
                }
                catch(e) { }

                try {
                    selectionPalette = window.localStorage[localStorageKey].split(";");
                }
                catch (e) { }
            }

            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
                if (!disabled) {
                    toggle();
                }

                e.stopPropagation();

                if (!$(e.target).is("input")) {
                    e.preventDefault();
                }
            });

            if(boundElement.is(":disabled") || (opts.disabled === true)) {
                disable();
            }

            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
            container.click(stopPropagation);

            // Handle user typed input
            textInput.change(setFromTextInput);
            textInput.bind("paste", function () {
                setTimeout(setFromTextInput, 1);
            });
            textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });

            cancelButton.text(opts.cancelText);
            cancelButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                hide("cancel");
            });

            chooseButton.text(opts.chooseText);
            chooseButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (isValid()) {
                    updateOriginalInput(true);
                    hide();
                }
            });

            draggable(alphaSlider, function (dragX, dragY, e) {
                currentAlpha = (dragX / alphaWidth);
                if (e.shiftKey) {
                    currentAlpha = Math.round(currentAlpha * 10) / 10;
                }

                move();
            });

            draggable(slider, function (dragX, dragY) {
                currentHue = parseFloat(dragY / slideHeight);
                move();
            }, dragStart, dragStop);

            draggable(dragger, function (dragX, dragY, e) {

                // shift+drag should snap the movement to either the x or y axis.
                if (!e.shiftKey) {
                    shiftMovementDirection = null;
                }
                else if (!shiftMovementDirection) {
                    var oldDragX = currentSaturation * dragWidth;
                    var oldDragY = dragHeight - (currentValue * dragHeight);
                    var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);

                    shiftMovementDirection = furtherFromX ? "x" : "y";
                }

                var setSaturation = !shiftMovementDirection || shiftMovementDirection === "x";
                var setValue = !shiftMovementDirection || shiftMovementDirection === "y";

                if (setSaturation) {
                    currentSaturation = parseFloat(dragX / dragWidth);
                }
                if (setValue) {
                    currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                }

                move();

            }, dragStart, dragStop);

            if (!!initialColor) {
                set(initialColor);

                // In case color was black - update the preview UI and set the format
                // since the set function will not run (default color is black).
                updateUI();
                currentPreferredFormat = preferredFormat || tinycolor(initialColor).format;

                addColorToSelectionPalette(initialColor);
            }
            else {
                updateUI();
            }

            if (flat) {
                show();
            }

            function palletElementClick(e) {
                if (e.data && e.data.ignore) {
                    set($(this).data("color"));
                    move();
                }
                else {
                    set($(this).data("color"));
                    updateOriginalInput(true);
                    move();
                    hide();
                }

                return false;
            }

            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            paletteContainer.delegate(".sp-thumb-el", paletteEvent, palletElementClick);
            initialColorContainer.delegate(".sp-thumb-el:nth-child(1)", paletteEvent, { ignore: true }, palletElementClick);
        }

        function addColorToSelectionPalette(color) {
            if (showSelectionPalette) {
                var colorRgb = tinycolor(color).toRgbString();
                if ($.inArray(colorRgb, selectionPalette) === -1) {
                    selectionPalette.push(colorRgb);
                    while(selectionPalette.length > maxSelectionSize) {
                        selectionPalette.shift();
                    }
                }

                if (localStorageKey && window.localStorage) {
                    try {
                        window.localStorage[localStorageKey] = selectionPalette.join(";");
                    }
                    catch(e) { }
                }
            }
        }

        function getUniqueSelectionPalette() {
            var unique = [];
            var p = selectionPalette;
            var paletteLookup = {};
            var rgb;

            if (opts.showPalette) {

                for (var i = 0; i < paletteArray.length; i++) {
                    for (var j = 0; j < paletteArray[i].length; j++) {
                        rgb = tinycolor(paletteArray[i][j]).toRgbString();
                        paletteLookup[rgb] = true;
                    }
                }

                for (i = 0; i < p.length; i++) {
                    rgb = tinycolor(p[i]).toRgbString();

                    if (!paletteLookup.hasOwnProperty(rgb)) {
                        unique.push(p[i]);
                        paletteLookup[rgb] = true;
                    }
                }
            }

            return unique.reverse().slice(0, opts.maxSelectionSize);
        }

        function drawPalette() {

            var currentColor = get();

            var html = $.map(paletteArray, function (palette, i) {
                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i);
            });

            if (selectionPalette) {
                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection"));
            }

            paletteContainer.html(html.join(""));
        }

        function drawInitial() {
            if (opts.showInitial) {
                var initial = colorOnShow;
                var current = get();
                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial"));
            }
        }

        function dragStart() {
            if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
                reflow();
            }
            container.addClass(draggingClass);
            shiftMovementDirection = null;
        }

        function dragStop() {
            container.removeClass(draggingClass);
        }

        function setFromTextInput() {
            var tiny = tinycolor(textInput.val());
            if (tiny.ok) {
                set(tiny);
            }
            else {
                textInput.addClass("sp-validation-error");
            }
        }

        function toggle() {
            if (visible) {
                hide();
            }
            else {
                show();
            }
        }

        function show() {
            var event = $.Event('beforeShow.spectrum');

            if (visible) {
                reflow();
                return;
            }

            colorOnShow = get();
            boundElement.trigger(event, [ colorOnShow ]);

            if (callbacks.beforeShow(colorOnShow) === false || event.isDefaultPrevented()) {
                return;
            }

            // if color has changed
            set(colorOnShow);

            hideAll();
            visible = true;

            $(doc).bind("mousedown.spectrum", onMousedown);

            if (!flat) {
                 // Piskel-specific : change the color as soon as the user does a mouseup
                $(doc).bind("mouseup.spectrum", updateColor);
            }

            $(window).bind("resize.spectrum", resize);
            replacer.addClass("sp-active");
            container.removeClass("sp-hidden");

            if (opts.showPalette) {
                drawPalette();
            }
            reflow();
            updateUI();

            drawInitial();
            callbacks.show(colorOnShow);
            boundElement.trigger('show.spectrum', [ colorOnShow ]);
        }

        function onMousedown (e) {
            var target = $(e.target);
            var parents = target.parents();
            var isClickOutsideWidget = !parents.is(container) && !target.is(container);

            if (isClickOutsideWidget) {
                hide(e);
            }
        }

        // Piskel-specific (code extracted to method)
        function updateColor(e) {
            var colorHasChanged = !tinycolor.equals(get(), colorOnShow);

            if (colorHasChanged) {
                if (clickoutFiresChange && e !== "cancel") {
                    updateOriginalInput(true);
                }
                else {
                    revert();
                }
            }
        }

        function hide(e) {

            // Return on right click
            if (e && e.type == "click" && e.button == 2) { return; }

            // Return if hiding is unnecessary
            if (!visible || flat) { return; }
            visible = false;

            $(doc).unbind("mousedown.spectrum", onMousedown);

            // Piskel-specific
            $(doc).unbind("mouseup.spectrum", updateColor);

            $(window).unbind("resize.spectrum", resize);

            replacer.removeClass("sp-active");
            container.addClass("sp-hidden");

            updateColor(e);

            // Piskel-specific
            addColorToSelectionPalette(get());

            callbacks.hide(get());
            boundElement.trigger('hide.spectrum', [ get() ]);
        }

        function revert() {
            set(colorOnShow, true);
        }

        function set(color, ignoreFormatChange) {
            if (tinycolor.equals(color, get())) {
                return;
            }

            var newColor = tinycolor(color);
            var newHsv = newColor.toHsv();

            currentHue = (newHsv.h % 360) / 360;
            currentSaturation = newHsv.s;
            currentValue = newHsv.v;
            currentAlpha = newHsv.a;

            updateUI();

            if (newColor.ok && !ignoreFormatChange) {
                currentPreferredFormat = preferredFormat || newColor.format;
            }
        }

        function get(opts) {
            opts = opts || { };
            return tinycolor.fromRatio({
                h: currentHue,
                s: currentSaturation,
                v: currentValue,
                a: Math.round(currentAlpha * 100) / 100
            }, { format: opts.format || currentPreferredFormat });
        }

        function isValid() {
            return !textInput.hasClass("sp-validation-error");
        }

        function move() {
            updateUI();

            callbacks.move(get());
            boundElement.trigger('move.spectrum', [ get() ]);
        }

        function updateUI() {

            textInput.removeClass("sp-validation-error");

            updateHelperLocations();

            // Update dragger background color (gradients take care of saturation and value).
            var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
            dragger.css("background-color", flatColor.toHexString());

            // Get a format that alpha will be included in (hex and names ignore alpha)
            var format = currentPreferredFormat;
            if (currentAlpha < 1) {
                if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
                    format = "rgb";
                }
            }

            var realColor = get({ format: format }),
                realHex = realColor.toHexString(),
                realRgb = realColor.toRgbString();

            // Update the replaced elements background color (with actual selected color)
            if (rgbaSupport || realColor.alpha === 1) {
                previewElement.css("background-color", realRgb);
            }
            else {
                previewElement.css("background-color", "transparent");
                previewElement.css("filter", realColor.toFilter());
            }

            if (opts.showAlpha) {
                var rgb = realColor.toRgb();
                rgb.a = 0;
                var realAlpha = tinycolor(rgb).toRgbString();
                var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                if (IE) {
                    alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                }
                else {
                    alphaSliderInner.css("background", "-webkit-" + gradient);
                    alphaSliderInner.css("background", "-moz-" + gradient);
                    alphaSliderInner.css("background", "-ms-" + gradient);
                    alphaSliderInner.css("background", gradient);
                }
            }

            // Update the text entry input as it changes happen
            if (opts.showInput) {
                textInput.val(realColor.toString(format));
            }

            if (opts.showPalette) {
                drawPalette();
            }

            drawInitial();
        }

        function updateHelperLocations() {
            var s = currentSaturation;
            var v = currentValue;

            // Where to show the little circle in that displays your current selected color
            var dragX = s * dragWidth;
            var dragY = (dragHeight) - (v * dragHeight);
            dragX = Math.max(
                -dragHelperHeight/2,
                Math.min(dragWidth - dragHelperHeight/2, dragX - dragHelperHeight/2)
            );
            dragY = Math.max(
                -dragHelperHeight/2,
                Math.min(dragHeight - dragHelperHeight/2, dragY - dragHelperHeight/2)
            );
            dragHelper.css({
                "top": dragY,
                "left": dragX
            });

            var alphaX = currentAlpha * alphaWidth;
            alphaSlideHelper.css({
                "left": alphaX - (alphaSlideHelperWidth / 2)
            });

            // Where to show the bar that displays your current selected hue
            var slideY = (currentHue) * slideHeight;
            slideHelper.css({
                "top": slideY - (slideHelperHeight/2)
            });
        }

        function updateOriginalInput(fireCallback) {
            var color = get();

            if (isInput) {
                boundElement.val(color.toString(currentPreferredFormat));
            }

            var hasChanged = !tinycolor.equals(color, colorOnShow);
            colorOnShow = color;

            // Update the selection palette with the current color

            // Piskel-specific : commented-out, palette update is done on hide
            // addColorToSelectionPalette(color);

            if (fireCallback && hasChanged) {
                callbacks.change(color);
                boundElement.trigger('change', [ color ]);
            }
        }

        function reflow() {
            dragWidth = dragger.width();
            dragHeight = dragger.height();
            dragHelperHeight = dragHelper.height() + 4;
            slideWidth = slider.width();
            slideHeight = slider.height();
            slideHelperHeight = slideHelper.height() + 4;
            alphaWidth = alphaSlider.width();
            alphaSlideHelperWidth = alphaSlideHelper.width();

            if (!flat) {
                container.css("position", "absolute");
                container.offset(getOffset(container, offsetElement));
            }

            updateHelperLocations();
        }

        function destroy() {
            boundElement.show();
            offsetElement.unbind("click.spectrum touchstart.spectrum");
            container.remove();
            replacer.remove();
            spectrums[spect.id] = null;
        }

        function option(optionName, optionValue) {
            if (optionName === undefined) {
                return $.extend({}, opts);
            }
            if (optionValue === undefined) {
                return opts[optionName];
            }

            opts[optionName] = optionValue;
            applyOptions();
        }

        function enable() {
            disabled = false;
            boundElement.attr("disabled", false);
            offsetElement.removeClass("sp-disabled");
        }

        function disable() {
            hide();
            disabled = true;
            boundElement.attr("disabled", true);
            offsetElement.addClass("sp-disabled");
        }

        initialize();

        var spect = {
            show: show,
            hide: hide,
            toggle: toggle,
            reflow: reflow,
            option: option,
            enable: enable,
            disable: disable,
            set: function (c) {
                set(c);
                updateOriginalInput();
            },
            get: get,
            destroy: destroy,
            container: container
        };

        spect.id = spectrums.push(spect) - 1;

        return spect;
    }

    /**
    * checkOffset - get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function getOffset(picker, input) {
        var extraY = 0;
        var dpWidth = picker.outerWidth();
        var dpHeight = picker.outerHeight();
        var inputHeight = input.outerHeight();
        var doc = picker[0].ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
        var offset = input.offset();
        offset.top += inputHeight;

        if (Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth))) {
            offset.left -= Math.abs(offset.left + dpWidth - viewWidth);
            picker.attr('data-x-position','right');
        } else {
            offset.left -= 0;
            picker.attr('data-x-position','left');
        }

        if (Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight))) {
            offset.top -= Math.abs(dpHeight + inputHeight - extraY);
            picker.attr('data-y-position','top');
        } else {
            offset.top -= extraY;
            picker.attr('data-y-position','bottom');
        }

        return offset;
    }

    /**
    * noop - do nothing
    */
    function noop() {

    }

    /**
    * stopPropagation - makes the code only doing this a little easier to read in line
    */
    function stopPropagation(e) {
        e.stopPropagation();
    }

    /**
    * Create a function bound to a given object
    * Thanks to underscore.js
    */
    function bind(func, obj) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
    * Lightweight drag helper.  Handles containment within the element, so that
    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
    */
    function draggable(element, onmove, onstart, onstop) {
        onmove = onmove || function () { };
        onstart = onstart || function () { };
        onstop = onstop || function () { };
        var doc = element.ownerDocument || document;
        var dragging = false;
        var offset = {};
        var maxHeight = 0;
        var maxWidth = 0;
        var hasTouch = ('ontouchstart' in window);

        var duringDragEvents = {};
        duringDragEvents["selectstart"] = prevent;
        duringDragEvents["dragstart"] = prevent;
        duringDragEvents["touchmove mousemove"] = move;
        duringDragEvents["touchend mouseup"] = stop;

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {
                // Mouseup happened outside of window
                if (IE && document.documentMode < 9 && !e.button) {
                    return stop();
                }

                var touches = e.originalEvent.touches;
                var pageX = touches ? touches[0].pageX : e.pageX;
                var pageY = touches ? touches[0].pageY : e.pageY;

                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                if (hasTouch) {
                    // Stop scrolling in iOS
                    prevent(e);
                }

                onmove.apply(element, [dragX, dragY, e]);
            }
        }
        function start(e) {
            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);
            var touches = e.originalEvent.touches;

            if (!rightclick && !dragging) {
                if (onstart.apply(element, arguments) !== false) {
                    dragging = true;
                    maxHeight = $(element).height();
                    maxWidth = $(element).width();
                    offset = $(element).offset();

                    $(doc).bind(duringDragEvents);
                    $(doc.body).addClass("sp-dragging");

                    if (!hasTouch) {
                        move(e);
                    }

                    prevent(e);
                }
            }
        }
        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("sp-dragging");
                onstop.apply(element, arguments);
            }
            dragging = false;
        }

        $(element).bind("touchstart mousedown", start);
    }

    function throttle(func, wait, debounce) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var throttler = function () {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    }


    function log(){/* jshint -W021 */if(window.console){if(Function.prototype.bind)log=Function.prototype.bind.call(console.log,console);else log=function(){Function.prototype.apply.call(console.log,console,arguments);};log.apply(this,arguments);}}

    /**
    * Define a jQuery plugin
    */
    var dataID = "spectrum.id";
    $.fn.spectrum = function (opts, extra) {

        if (typeof opts == "string") {

            var returnValue = this;
            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function () {
                var spect = spectrums[$(this).data(dataID)];
                if (spect) {

                    var method = spect[opts];
                    if (!method) {
                        throw new Error( "Spectrum: no such method: '" + opts + "'" );
                    }

                    if (opts == "get") {
                        returnValue = spect.get();
                    }
                    else if (opts == "container") {
                        returnValue = spect.container;
                    }
                    else if (opts == "option") {
                        returnValue = spect.option.apply(spect, args);
                    }
                    else if (opts == "destroy") {
                        spect.destroy();
                        $(this).removeData(dataID);
                    }
                    else {
                        method.apply(spect, args);
                    }
                }
            });

            return returnValue;
        }

        // Initializing a new instance of spectrum
        return this.spectrum("destroy").each(function () {
            var spect = spectrum(this, opts);
            $(this).data(dataID, spect.id);
        });
    };

    $.fn.spectrum.load = true;
    $.fn.spectrum.loadOpts = {};
    $.fn.spectrum.draggable = draggable;
    $.fn.spectrum.defaults = defaultOpts;

    $.spectrum = { };
    $.spectrum.localization = { };
    $.spectrum.palettes = { };

    $.fn.spectrum.processNativeColorInputs = function () {
        var colorInput = $("<input type='color' value='!' />")[0];
        var supportsColor = colorInput.type === "color" && colorInput.value != "!";

        if (!supportsColor) {
            $("input[type=color]").spectrum({
                preferredFormat: "hex6"
            });
        }
    };

    // TinyColor v0.9.16
    // https://github.com/bgrins/TinyColor
    // 2013-08-10, Brian Grinstead, MIT License

    (function() {

    var trimLeft = /^[\s,#]+/,
        trimRight = /\s+$/,
        tinyCounter = 0,
        math = Math,
        mathRound = math.round,
        mathMin = math.min,
        mathMax = math.max,
        mathRandom = math.random;

    function tinycolor (color, opts) {

        color = (color) ? color : '';
        opts = opts || { };

        // If input is already a tinycolor, return itself
        if (typeof color == "object" && color.hasOwnProperty("_tc_id")) {
           return color;
        }

        var rgb = inputToRGB(color);
        var r = rgb.r,
            g = rgb.g,
            b = rgb.b,
            a = rgb.a,
            roundA = mathRound(100*a) / 100,
            format = opts.format || rgb.format;

        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (r < 1) { r = mathRound(r); }
        if (g < 1) { g = mathRound(g); }
        if (b < 1) { b = mathRound(b); }

        return {
            ok: rgb.ok,
            format: format,
            _tc_id: tinyCounter++,
            alpha: a,
            getAlpha: function() {
                return a;
            },
            setAlpha: function(value) {
                a = boundAlpha(value);
                roundA = mathRound(100*a) / 100;
            },
            toHsv: function() {
                var hsv = rgbToHsv(r, g, b);
                return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: a };
            },
            toHsvString: function() {
                var hsv = rgbToHsv(r, g, b);
                var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
                return (a == 1) ?
                  "hsv("  + h + ", " + s + "%, " + v + "%)" :
                  "hsva(" + h + ", " + s + "%, " + v + "%, "+ roundA + ")";
            },
            toHsl: function() {
                var hsl = rgbToHsl(r, g, b);
                return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: a };
            },
            toHslString: function() {
                var hsl = rgbToHsl(r, g, b);
                var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
                return (a == 1) ?
                  "hsl("  + h + ", " + s + "%, " + l + "%)" :
                  "hsla(" + h + ", " + s + "%, " + l + "%, "+ roundA + ")";
            },
            toHex: function(allow3Char) {
                return rgbToHex(r, g, b, allow3Char);
            },
            toHexString: function(allow3Char) {
                return '#' + rgbToHex(r, g, b, allow3Char);
            },
            toRgb: function() {
                return { r: mathRound(r), g: mathRound(g), b: mathRound(b), a: a };
            },
            toRgbString: function() {
                return (a == 1) ?
                  "rgb("  + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ")" :
                  "rgba(" + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ", " + roundA + ")";
            },
            toPercentageRgb: function() {
                return { r: mathRound(bound01(r, 255) * 100) + "%", g: mathRound(bound01(g, 255) * 100) + "%", b: mathRound(bound01(b, 255) * 100) + "%", a: a };
            },
            toPercentageRgbString: function() {
                return (a == 1) ?
                  "rgb("  + mathRound(bound01(r, 255) * 100) + "%, " + mathRound(bound01(g, 255) * 100) + "%, " + mathRound(bound01(b, 255) * 100) + "%)" :
                  "rgba(" + mathRound(bound01(r, 255) * 100) + "%, " + mathRound(bound01(g, 255) * 100) + "%, " + mathRound(bound01(b, 255) * 100) + "%, " + roundA + ")";
            },
            toName: function() {
                if (a === 0) {
                    return "transparent";
                }

                return hexNames[rgbToHex(r, g, b, true)] || false;
            },
            toFilter: function(secondColor) {
                var hex = rgbToHex(r, g, b);
                var secondHex = hex;
                var alphaHex = Math.round(parseFloat(a) * 255).toString(16);
                var secondAlphaHex = alphaHex;
                var gradientType = opts && opts.gradientType ? "GradientType = 1, " : "";

                if (secondColor) {
                    var s = tinycolor(secondColor);
                    secondHex = s.toHex();
                    secondAlphaHex = Math.round(parseFloat(s.alpha) * 255).toString(16);
                }

                return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr=#" + pad2(alphaHex) + hex + ",endColorstr=#" + pad2(secondAlphaHex) + secondHex + ")";
            },
            toString: function(format) {
                var formatSet = !!format;
                format = format || this.format;

                var formattedString = false;
                var hasAlphaAndFormatNotSet = !formatSet && a < 1 && a > 0;
                var formatWithAlpha = hasAlphaAndFormatNotSet && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");

                if (format === "rgb") {
                    formattedString = this.toRgbString();
                }
                if (format === "prgb") {
                    formattedString = this.toPercentageRgbString();
                }
                if (format === "hex" || format === "hex6") {
                    formattedString = this.toHexString();
                }
                if (format === "hex3") {
                    formattedString = this.toHexString(true);
                }
                if (format === "name") {
                    formattedString = this.toName();
                }
                if (format === "hsl") {
                    formattedString = this.toHslString();
                }
                if (format === "hsv") {
                    formattedString = this.toHsvString();
                }

                if (formatWithAlpha) {
                    return this.toRgbString();
                }

                return formattedString || this.toHexString();
            }
        };
    }

    // If input is an object, force 1 into "1.0" to handle ratios properly
    // String input requires "1.0" as input, so 1 will be treated as 1
    tinycolor.fromRatio = function(color, opts) {
        if (typeof color == "object") {
            var newColor = {};
            for (var i in color) {
                if (color.hasOwnProperty(i)) {
                    if (i === "a") {
                        newColor[i] = color[i];
                    }
                    else {
                        newColor[i] = convertToPercentage(color[i]);
                    }
                }
            }
            color = newColor;
        }

        return tinycolor(color, opts);
    };

    // Given a string or object, convert that input to RGB
    // Possible string inputs:
    //
    //     "red"
    //     "#f00" or "f00"
    //     "#ff0000" or "ff0000"
    //     "rgb 255 0 0" or "rgb (255, 0, 0)"
    //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
    //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
    //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
    //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
    //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
    //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
    //
    function inputToRGB(color) {

        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var ok = false;
        var format = false;

        if (typeof color == "string") {
            color = stringInputToObject(color);
        }

        if (typeof color == "object") {
            if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
                rgb = rgbToRgb(color.r, color.g, color.b);
                ok = true;
                format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
                color.s = convertToPercentage(color.s);
                color.v = convertToPercentage(color.v);
                rgb = hsvToRgb(color.h, color.s, color.v);
                ok = true;
                format = "hsv";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
                color.s = convertToPercentage(color.s);
                color.l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, color.s, color.l);
                ok = true;
                format = "hsl";
            }

            if (color.hasOwnProperty("a")) {
                a = color.a;
            }
        }

        a = boundAlpha(a);

        return {
            ok: ok,
            format: color.format || format,
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
        };
    }


    // Conversion Functions
    // --------------------

    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

    // `rgbToRgb`
    // Handle bounds / percentage checking to conform to CSS color spec
    // <http://www.w3.org/TR/css3-color/>
    // *Assumes:* r, g, b in [0, 255] or [0, 1]
    // *Returns:* { r, g, b } in [0, 255]
    function rgbToRgb(r, g, b){
        return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255
        };
    }

    // `rgbToHsl`
    // Converts an RGB color value to HSL.
    // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
    // *Returns:* { h, s, l } in [0,1]
    function rgbToHsl(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min) {
            h = s = 0; // achromatic
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h: h, s: s, l: l };
    }

    // `hslToRgb`
    // Converts an HSL color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hslToRgb(h, s, l) {
        var r, g, b;

        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);

        function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        if(s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHsv`
    // Converts an RGB color value to HSV
    // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
    // *Returns:* { h, s, v } in [0,1]
    function rgbToHsv(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max === 0 ? 0 : d / max;

        if(max == min) {
            h = 0; // achromatic
        }
        else {
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v };
    }

    // `hsvToRgb`
    // Converts an HSV color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
     function hsvToRgb(h, s, v) {

        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);

        var i = math.floor(h),
            f = h - i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s),
            mod = i % 6,
            r = [v, q, p, p, t, v][mod],
            g = [t, v, v, q, p, p][mod],
            b = [p, p, t, v, v, q][mod];

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHex`
    // Converts an RGB color to hex
    // Assumes r, g, and b are contained in the set [0, 255]
    // Returns a 3 or 6 character hex
    function rgbToHex(r, g, b, allow3Char) {

        var hex = [
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];

        // Return a 3 character hex if possible
        if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }

        return hex.join("");
    }

    // `equals`
    // Can be called with any tinycolor input
    tinycolor.equals = function (color1, color2) {
        if (!color1 || !color2) { return false; }
        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
    };
    tinycolor.random = function() {
        return tinycolor.fromRatio({
            r: mathRandom(),
            g: mathRandom(),
            b: mathRandom()
        });
    };


    // Modification Functions
    // ----------------------
    // Thanks to less.js for some of the basics here
    // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

    tinycolor.desaturate = function (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    };
    tinycolor.saturate = function (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    };
    tinycolor.greyscale = function(color) {
        return tinycolor.desaturate(color, 100);
    };
    tinycolor.lighten = function(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    };
    tinycolor.darken = function (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    };
    tinycolor.complement = function(color) {
        var hsl = tinycolor(color).toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return tinycolor(hsl);
    };


    // Combination Functions
    // ---------------------
    // Thanks to jQuery xColor for some of the ideas behind these
    // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

    tinycolor.triad = function(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
        ];
    };
    tinycolor.tetrad = function(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
        ];
    };
    tinycolor.splitcomplement = function(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
            tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
        ];
    };
    tinycolor.analogous = function(color, results, slices) {
        results = results || 6;
        slices = slices || 30;

        var hsl = tinycolor(color).toHsl();
        var part = 360 / slices;
        var ret = [tinycolor(color)];

        for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(tinycolor(hsl));
        }
        return ret;
    };
    tinycolor.monochromatic = function(color, results) {
        results = results || 6;
        var hsv = tinycolor(color).toHsv();
        var h = hsv.h, s = hsv.s, v = hsv.v;
        var ret = [];
        var modification = 1 / results;

        while (results--) {
            ret.push(tinycolor({ h: h, s: s, v: v}));
            v = (v + modification) % 1;
        }

        return ret;
    };


    // Readability Functions
    // ---------------------
    // <http://www.w3.org/TR/AERT#color-contrast>

    // `readability`
    // Analyze the 2 colors and returns an object with the following properties:
    //    `brightness`: difference in brightness between the two colors
    //    `color`: difference in color/hue between the two colors
    tinycolor.readability = function(color1, color2) {
        var a = tinycolor(color1).toRgb();
        var b = tinycolor(color2).toRgb();
        var brightnessA = (a.r * 299 + a.g * 587 + a.b * 114) / 1000;
        var brightnessB = (b.r * 299 + b.g * 587 + b.b * 114) / 1000;
        var colorDiff = (
            Math.max(a.r, b.r) - Math.min(a.r, b.r) +
            Math.max(a.g, b.g) - Math.min(a.g, b.g) +
            Math.max(a.b, b.b) - Math.min(a.b, b.b)
        );

        return {
            brightness: Math.abs(brightnessA - brightnessB),
            color: colorDiff
        };
    };

    // `readable`
    // http://www.w3.org/TR/AERT#color-contrast
    // Ensure that foreground and background color combinations provide sufficient contrast.
    // *Example*
    //    tinycolor.readable("#000", "#111") => false
    tinycolor.readable = function(color1, color2) {
        var readability = tinycolor.readability(color1, color2);
        return readability.brightness > 125 && readability.color > 500;
    };

    // `mostReadable`
    // Given a base color and a list of possible foreground or background
    // colors for that base, returns the most readable color.
    // *Example*
    //    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
    tinycolor.mostReadable = function(baseColor, colorList) {
        var bestColor = null;
        var bestScore = 0;
        var bestIsReadable = false;
        for (var i=0; i < colorList.length; i++) {

            // We normalize both around the "acceptable" breaking point,
            // but rank brightness constrast higher than hue.

            var readability = tinycolor.readability(baseColor, colorList[i]);
            var readable = readability.brightness > 125 && readability.color > 500;
            var score = 3 * (readability.brightness / 125) + (readability.color / 500);

            if ((readable && ! bestIsReadable) ||
                (readable && bestIsReadable && score > bestScore) ||
                ((! readable) && (! bestIsReadable) && score > bestScore)) {
                bestIsReadable = readable;
                bestScore = score;
                bestColor = tinycolor(colorList[i]);
            }
        }
        return bestColor;
    };


    // Big List of Colors
    // ------------------
    // <http://www.w3.org/TR/css3-color/#svg-color>
    var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    };

    // Make it easy to access colors via `hexNames[hex]`
    var hexNames = tinycolor.hexNames = flip(names);


    // Utilities
    // ---------

    // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
    function flip(o) {
        var flipped = { };
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                flipped[o[i]] = i;
            }
        }
        return flipped;
    }

    // Return a valid alpha value [0,1] with all invalid values being set to 1
    function boundAlpha(a) {
        a = parseFloat(a);

        if (isNaN(a) || a < 0 || a > 1) {
            a = 1;
        }

        return a;
    }

    // Take input from [0, n] and return it as [0, 1]
    function bound01(n, max) {
        if (isOnePointZero(n)) { n = "100%"; }

        var processPercent = isPercentage(n);
        n = mathMin(max, mathMax(0, parseFloat(n)));

        // Automatically convert percentage into number
        if (processPercent) {
            n = parseInt(n * max, 10) / 100;
        }

        // Handle floating point rounding errors
        if ((math.abs(n - max) < 0.000001)) {
            return 1;
        }

        // Convert into [0, 1] range if it isn't already
        return (n % max) / parseFloat(max);
    }

    // Force a number between 0 and 1
    function clamp01(val) {
        return mathMin(1, mathMax(0, val));
    }

    // Parse an integer into hex
    function parseHex(val) {
        return parseInt(val, 16);
    }

    // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
    // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
    function isOnePointZero(n) {
        return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
    }

    // Check to see if string passed in is a percentage
    function isPercentage(n) {
        return typeof n === "string" && n.indexOf('%') != -1;
    }

    // Force a hex value to have 2 characters
    function pad2(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }

    // Replace a decimal with it's percentage value
    function convertToPercentage(n) {
        if (n <= 1) {
            n = (n * 100) + "%";
        }

        return n;
    }

    var matchers = (function() {

        // <http://www.w3.org/TR/css3-values/#integers>
        var CSS_INTEGER = "[-\\+]?\\d+%?";

        // <http://www.w3.org/TR/css3-values/#number-value>
        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

        // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

        // Actual matching.
        // Parentheses and commas are optional, but not required.
        // Whitespace can take the place of commas or opening paren
        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

        return {
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    })();

    // `stringInputToObject`
    // Permissive string parsing.  Take in a number of formats, and output an object
    // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
    function stringInputToObject(color) {

        color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
        var named = false;
        if (names[color]) {
            color = names[color];
            named = true;
        }
        else if (color == 'transparent') {
            return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        }

        // Try to match string input using regular expressions.
        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
        // Just return an object and let the conversion functions handle that.
        // This way the result will be the same whether the tinycolor is initialized with string or object.
        var match;
        if ((match = matchers.rgb.exec(color))) {
            return { r: match[1], g: match[2], b: match[3] };
        }
        if ((match = matchers.rgba.exec(color))) {
            return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        if ((match = matchers.hsl.exec(color))) {
            return { h: match[1], s: match[2], l: match[3] };
        }
        if ((match = matchers.hsla.exec(color))) {
            return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        if ((match = matchers.hsv.exec(color))) {
            return { h: match[1], s: match[2], v: match[3] };
        }
        if ((match = matchers.hex6.exec(color))) {
            return {
                r: parseHex(match[1]),
                g: parseHex(match[2]),
                b: parseHex(match[3]),
                format: named ? "name" : "hex"
            };
        }
        if ((match = matchers.hex3.exec(color))) {
            return {
                r: parseHex(match[1] + '' + match[1]),
                g: parseHex(match[2] + '' + match[2]),
                b: parseHex(match[3] + '' + match[3]),
                format: named ? "name" : "hex"
            };
        }

        return false;
    }

    // Expose tinycolor to window, does not need to run in non-browser context.
    window.tinycolor = tinycolor;

    })();
    var tinycolor = window.tinycolor;

    $(function () {
        if ($.fn.spectrum.load) {
            $.fn.spectrum.processNativeColorInputs();
        }
    });

})(window, jQuery);
;(function () {
  var ns = $.namespace("pskl.rendering");

  ns.DrawingLoop = function () {
    this.requestAnimationFrame = this.getRequestAnimationFrameShim_();
    this.isRunning = false;
    this.previousTime = 0;
    this.callbacks = [];
  };

  ns.DrawingLoop.prototype.addCallback = function (callback, scope, args) {
    var callbackObj = {
      fn : callback,
      scope : scope,
      args : args
    };
    this.callbacks.push(callbackObj);
    return callbackObj;
  };

  ns.DrawingLoop.prototype.removeCallback = function (callbackObj) {
    var index = this.callbacks.indexOf(callbackObj);
    if (index != -1) {
      this.callbacks.splice(index, 1);
    }
  };

  ns.DrawingLoop.prototype.start = function () {
    this.isRunning = true;
    this.loop_();
  };

  ns.DrawingLoop.prototype.loop_ = function () {
    var currentTime = Date.now();
    var delta = currentTime - this.previousTime;
    this.executeCallbacks_(delta);
    this.previousTime = currentTime;
    this.requestAnimationFrame.call(window, this.loop_.bind(this));
  };

  ns.DrawingLoop.prototype.executeCallbacks_ = function (deltaTime) {
    for (var i = 0 ; i < this.callbacks.length ; i++) {
      var cb = this.callbacks[i];
      cb.fn.call(cb.scope, deltaTime, cb.args);
    }
  };

  ns.DrawingLoop.prototype.stop = function () {
    this.isRunning = false;
  };

  ns.DrawingLoop.prototype.getRequestAnimationFrameShim_ = function () {
    var requestAnimationFrame = window.requestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.msRequestAnimationFrame ||
                  function (callback) { window.setTimeout(callback, 1000/60); };

    return requestAnimationFrame;
  };
})();;(function () {
  var ns = $.namespace("pskl.model");
  var __idCounter = 0;
  ns.Frame = function (width, height) {
    if (width && height) {
      this.width = width;
      this.height = height;
      this.id = __idCounter++;
      this.version = 0;
      this.pixels = ns.Frame.createEmptyPixelGrid_(width, height);
      this.stateIndex = 0;
    } else {
      throw 'Bad arguments in pskl.model.Frame constructor : ' + width + ', ' + height;
    }
  };

  ns.Frame.fromPixelGrid = function (pixels) {
    if (pixels.length && pixels[0].length) {
      var w = pixels.length, h = pixels[0].length;
      var frame = new pskl.model.Frame(w, h);
      frame.setPixels(pixels);
      return frame;
    } else {
      throw 'Bad arguments in pskl.model.Frame.fromPixelGrid : ' + pixels;
    }
  };

  ns.Frame.createEmptyPixelGrid_ = function (width, height) {
    var pixels = []; //new Array(width);
    for (var columnIndex=0; columnIndex < width; columnIndex++) {
      var columnArray = [];
      for(var heightIndex = 0; heightIndex < height; heightIndex++) {
        columnArray.push(Constants.TRANSPARENT_COLOR);
      }
      pixels[columnIndex] = columnArray;
    }
    return pixels;
  };

  ns.Frame.createEmptyFromFrame = function (frame) {
    return new ns.Frame(frame.getWidth(), frame.getHeight());
  };

  ns.Frame.prototype.clone = function () {
    var clone = new ns.Frame(this.width, this.height);
    clone.setPixels(this.getPixels());
    return clone;
  };

  /**
   * Returns a copy of the pixels used by the frame
   */
  ns.Frame.prototype.getPixels = function () {
    return this.clonePixels_(this.pixels);
  };

  /**
   * Copies the passed pixels into the frame.
   */
  ns.Frame.prototype.setPixels = function (pixels) {
    this.pixels = this.clonePixels_(pixels);
    this.version++;
  };

  ns.Frame.prototype.clear = function () {
    var pixels = ns.Frame.createEmptyPixelGrid_(this.getWidth(), this.getHeight());
    this.setPixels(pixels);
  };

  /**
   * Clone a set of pixels. Should be static utility method
   * @private
   */
  ns.Frame.prototype.clonePixels_ = function (pixels) {
    var clonedPixels = [];
    for (var col = 0 ; col < pixels.length ; col++) {
      clonedPixels[col] = pixels[col].slice(0 , pixels[col].length);
    }
    return clonedPixels;
  };

  ns.Frame.prototype.getHash = function () {
    return [this.id, this.version].join('-');
  };

  ns.Frame.prototype.setPixel = function (x, y, color) {
    if (this.containsPixel(x, y)) {
      var p = this.pixels[x][y];
      if (p !== color) {
        this.pixels[x][y] = color;
        this.version++;
      }
    }
  };

  ns.Frame.prototype.getPixel = function (x, y) {
    if (this.containsPixel(x, y)) {
      return this.pixels[x][y];
    } else {
      return null;
    }
  };

  ns.Frame.prototype.forEachPixel = function (callback) {
    var width = this.getWidth();
    var height = this.getHeight();
    for (var x = 0 ; x < width ; x++) {
      for (var y = 0 ; y < height ; y++) {
        callback(this.pixels[x][y], x, y, this);
      }
    }
  };

  ns.Frame.prototype.getWidth = function () {
    return this.width;
  };

  ns.Frame.prototype.getHeight = function () {
    return this.height;
  };

  ns.Frame.prototype.containsPixel = function (col, row) {
    return col >= 0 && row >= 0 && col < this.width && row < this.height;
  };

  ns.Frame.prototype.isSameSize = function (otherFrame) {
    return this.getHeight() == otherFrame.getHeight() && this.getWidth() == otherFrame.getWidth();
  };
})();;(function () {
  var ns = $.namespace('pskl.model');

  ns.Layer = function (name) {
    if (!name) {
      throw 'Invalid arguments in Layer constructor : \'name\' is mandatory';
    } else {
      this.name = name;
      this.frames = [];
    }
  };

  /**
   * Create a Layer instance from an already existing set a Frames
   * @static
   * @param  {String} name layer's name
   * @param  {Array<pskl.model.Frame>} frames should all have the same dimensions
   * @return {pskl.model.Layer}
   */
  ns.Layer.fromFrames = function (name, frames) {
    var layer = new ns.Layer(name);
    frames.forEach(layer.addFrame.bind(layer));
    return layer;
  };

  ns.Layer.prototype.getName = function () {
    return this.name;
  };

  ns.Layer.prototype.setName = function (name) {
    this.name = name;
  };

  ns.Layer.prototype.getFrames = function () {
    return this.frames;
  };

  ns.Layer.prototype.getFrameAt = function (index) {
    return this.frames[index];
  };

  ns.Layer.prototype.addFrame = function (frame) {
    this.frames.push(frame);
  };

  ns.Layer.prototype.addFrameAt = function (frame, index) {
    this.frames.splice(index, 0, frame);
  };

  ns.Layer.prototype.removeFrame = function (frame) {
    var index = this.frames.indexOf(frame);
    this.removeFrameAt(index);
  };

  ns.Layer.prototype.removeFrameAt = function (index) {
    if (this.frames[index]) {
      this.frames.splice(index, 1);
    } else {
      throw 'Invalid index in removeFrameAt : ' + index + ' (size : ' + this.size() + ')';
    }
  };

  ns.Layer.prototype.moveFrame = function (fromIndex, toIndex) {
    var frame = this.frames.splice(fromIndex, 1)[0];
    this.frames.splice(toIndex, 0, frame);
  };

  ns.Layer.prototype.swapFramesAt = function (fromIndex, toIndex) {
    var fromFrame = this.frames[fromIndex];
    var toFrame = this.frames[toIndex];
    if (fromFrame && toFrame) {
      this.frames[toIndex] = fromFrame;
      this.frames[fromIndex] = toFrame;
    } else {
      console.log('frames', this.frames);
      console.log('fromIndex', fromIndex, 'toIndex', toIndex);
      throw 'Frame not found in moveFrameAt';
    }
  };

  ns.Layer.prototype.duplicateFrame = function (frame) {
    var index = this.frames.indexOf(frame);
    this.duplicateFrameAt(index);
  };

  ns.Layer.prototype.duplicateFrameAt = function (index) {
    var frame = this.frames[index];
    if (frame) {
      var clone = frame.clone();
      this.addFrameAt(clone, index);
    } else {
      throw 'Frame not found in duplicateFrameAt';
    }
  };

  ns.Layer.prototype.size = function () {
    return this.frames.length;
  };

  ns.Layer.prototype.getHash = function () {
    return this.frames.map(function (frame) {
      return frame.getHash();
    }).join('-');
  };
})();;(function () {
  var ns = $.namespace('pskl.model.piskel');

  ns.Descriptor = function (name, description, isPublic) {
    this.name = name;
    this.description = description;
    this.isPublic = isPublic;
  };
})();;(function () {
  var ns = $.namespace('pskl.model.frame');


  var DEFAULT_CLEAR_INTERVAL = 10 * 60 *1000;

  var DEFAULT_FRAME_PROCESSOR = function (frame) {
    return pskl.utils.FrameUtils.toImage(frame);
  };

  var DEFAULT_OUTPUT_CLONER = function (o) {return o;};

  var DEFAULT_NAMESPACE = '__cache_default__';

  ns.CachedFrameProcessor = function (cacheResetInterval) {
    this.cache_ = {};
    this.cacheResetInterval = cacheResetInterval || DEFAULT_CLEAR_INTERVAL;
    this.frameProcessor = DEFAULT_FRAME_PROCESSOR;
    this.outputCloner = DEFAULT_OUTPUT_CLONER;

    window.setInterval(this.clear.bind(this), this.cacheResetInterval);
  };

  ns.CachedFrameProcessor.prototype.clear = function () {
    this.cache_ = {};
  };

  /**
   * Set the processor function that will be called when there is a cache miss
   * Function with 1 argument : pskl.model.Frame
   * @param {Function} frameProcessor
   */
  ns.CachedFrameProcessor.prototype.setFrameProcessor = function (frameProcessor) {
    this.frameProcessor = frameProcessor;
  };

  /**
   * Set the cloner that will be called when there is a miss on the 1st level cache
   * but a hit on the 2nd level cache.
   * Function with 2 arguments : cached value, frame
   * @param {Function} outputCloner
   */
  ns.CachedFrameProcessor.prototype.setOutputCloner = function (outputCloner) {
    this.outputCloner = outputCloner;
  };

  /**
   * Retrieve the processed frame from the cache, in the (optional) namespace
   * If the first level cache is empty, attempt to clone it from 2nd level cache. If second level cache is empty process the frame.
   * @param  {pskl.model.Frame} frame
   * @param  {String} namespace
   * @return {Object} the processed frame
   */
  ns.CachedFrameProcessor.prototype.get = function (frame, namespace) {
    var processedFrame = null;
    namespace = namespace || DEFAULT_NAMESPACE;

    if (!this.cache_[namespace]) {
      this.cache_[namespace] = {};
    }

    var cache = this.cache_[namespace];

    var cacheKey = frame.getHash();
    if (cache[cacheKey]) {
      processedFrame = cache[cacheKey];
    } else {
      var frameAsString = pskl.utils.hashCode(JSON.stringify(frame.getPixels()));
      if (cache[frameAsString]) {
        processedFrame = this.outputCloner(cache[frameAsString], frame);
      } else {
        processedFrame = this.frameProcessor(frame);
        cache[frameAsString] = processedFrame;
      }
      cache[cacheKey] = processedFrame;
    }
    return processedFrame;
  };
})();;(function () {
  var ns = $.namespace('pskl.model');

  ns.Palette = function (id, name, colors) {
    this.id = id;
    this.name = name;
    this.colors = colors;
  };

  ns.Palette.fromObject = function (paletteObj) {
    var colors = paletteObj.colors.slice(0 , paletteObj.colors.length);
    return new ns.Palette(paletteObj.id, paletteObj.name, colors);
  };

  ns.Palette.prototype.getColors = function () {
    return this.colors;
  };

  ns.Palette.prototype.setColors = function (colors) {
    this.colors = colors;
  };

  ns.Palette.prototype.get = function (index) {
    return this.colors[index];
  };

  ns.Palette.prototype.set = function (index, color) {
    this.colors[index] = color;
  };

  ns.Palette.prototype.add = function (color) {
    this.colors.push(color);
  };

  ns.Palette.prototype.size = function () {
    return this.colors.length;
  };

  ns.Palette.prototype.removeAt = function (index) {
    this.colors.splice(index, 1);
  };

  ns.Palette.prototype.move = function (oldIndex, newIndex) {
    this.colors.splice(newIndex, 0, this.colors.splice(oldIndex, 1)[0]);
  };
})();;(function () {
  var ns = $.namespace('pskl.model');

  /**
   * @constructor
   * @param {Number} width
   * @param {Number} height
   * @param {String} name
   * @param {String} description
   */
  ns.Piskel = function (width, height, descriptor) {
    if (width && height && descriptor) {
      /** @type {Array} */
      this.layers = [];

      /** @type {Number} */
      this.width = width;

      /** @type {Number} */
      this.height = height;

      this.descriptor = descriptor;
    } else {
      throw 'Missing arguments in Piskel constructor : ' + Array.prototype.join.call(arguments, ",");
    }
  };

  /**
   * Create a piskel instance from an existing set of (non empty) layers
   * Layers should all be synchronized : same number of frames, same dimensions
   * @param  {Array<pskl.model.Layer>} layers
   * @return {pskl.model.Piskel}
   */
  ns.Piskel.fromLayers = function (layers, descriptor) {
    var piskel = null;
    if (layers.length > 0 && layers[0].size() > 0) {
      var sampleFrame = layers[0].getFrameAt(0);
      piskel = new pskl.model.Piskel(sampleFrame.getWidth(), sampleFrame.getHeight(), descriptor);
      layers.forEach(piskel.addLayer.bind(piskel));
    } else {
      throw 'Piskel.fromLayers expects array of non empty pskl.model.Layer as first argument';
    }
    return piskel;
  };

  ns.Piskel.prototype.getLayers = function () {
    return this.layers;
  };

  ns.Piskel.prototype.getHeight = function () {
    return this.height;
  };

  ns.Piskel.prototype.getWidth = function () {
    return this.width;
  };

  ns.Piskel.prototype.getLayers = function () {
    return this.layers;
  };

  ns.Piskel.prototype.getLayerAt = function (index) {
    return this.layers[index];
  };

  ns.Piskel.prototype.getLayersByName = function (name) {
    return this.layers.filter(function (l) {
      return l.getName() == name;
    });
  };

  ns.Piskel.prototype.addLayer = function (layer) {
    this.layers.push(layer);
  };

  ns.Piskel.prototype.addLayerAt = function (layer, index) {
    this.layers.splice(index, 0, layer);
  };

  ns.Piskel.prototype.moveLayerUp = function (layer) {
    var index = this.layers.indexOf(layer);
    if (index > -1 && index < this.layers.length-1) {
      this.layers[index] = this.layers[index+1];
      this.layers[index+1] = layer;
    }
  };

  ns.Piskel.prototype.moveLayerDown = function (layer) {
    var index = this.layers.indexOf(layer);
    if (index > 0) {
      this.layers[index] = this.layers[index-1];
      this.layers[index-1] = layer;
    }
  };

  ns.Piskel.prototype.removeLayer = function (layer) {
    var index = this.layers.indexOf(layer);
    if (index != -1) {
      this.layers.splice(index, 1);
    }
  };

  ns.Piskel.prototype.removeLayerAt = function (index) {
    this.layers.splice(index, 1);
  };

  ns.Piskel.prototype.getDescriptor = function () {
    return this.descriptor;
  };

  ns.Piskel.prototype.setDescriptor = function (descriptor) {
    this.descriptor = descriptor;
    var appEngineEditorHeader = $('.piskel-name').html(this.descriptor.name);
  };

  ns.Piskel.prototype.getHash = function () {
    return this.layers.map(function (layer) {
      return layer.getHash();
    }).join('-');
  };

})();;(function () {
  var ns = $.namespace("pskl.selection");

  var SELECTION_REPLAY = {
    PASTE : 'REPLAY_PASTE',
    ERASE : 'REPLAY_ERASE'
  };

  ns.SelectionManager = function (piskelController) {

    this.piskelController = piskelController;

    this.currentSelection = null;
  };

  ns.SelectionManager.prototype.init = function () {
    $.subscribe(Events.SELECTION_CREATED, $.proxy(this.onSelectionCreated_, this));
    $.subscribe(Events.SELECTION_DISMISSED, $.proxy(this.onSelectionDismissed_, this));
    $.subscribe(Events.SELECTION_MOVE_REQUEST, $.proxy(this.onSelectionMoved_, this));

    pskl.app.shortcutService.addShortcut('ctrl+V', this.paste.bind(this));
    pskl.app.shortcutService.addShortcut('ctrl+X', this.cut.bind(this));
    pskl.app.shortcutService.addShortcut('ctrl+C', this.copy.bind(this));
    pskl.app.shortcutService.addShortcut('del', this.erase.bind(this));
    pskl.app.shortcutService.addShortcut('back', this.onBackPressed_.bind(this));

    $.subscribe(Events.TOOL_SELECTED, $.proxy(this.onToolSelected_, this));
  };

  /**
   * @private
   */
  ns.SelectionManager.prototype.cleanSelection_ = function() {
    if(this.currentSelection) {
      this.currentSelection.reset();
      this.currentSelection = null;
    }
  };

  /**
   * @private
   */
  ns.SelectionManager.prototype.onToolSelected_ = function(evt, tool) {
    var isSelectionTool = tool instanceof pskl.tools.drawing.BaseSelect;
    if(!isSelectionTool) {
      this.cleanSelection_();
    }
  };

  /**
   * @private
   */
  ns.SelectionManager.prototype.onSelectionDismissed_ = function(evt) {
    this.cleanSelection_();
  };

  ns.SelectionManager.prototype.onBackPressed_ = function(evt) {
    if (this.currentSelection) {
      this.erase();
    } else {
      return true; // bubble
    }
  };

  ns.SelectionManager.prototype.erase = function () {
    var pixels = this.currentSelection.pixels;
    var currentFrame = this.piskelController.getCurrentFrame();
    for(var i=0, l=pixels.length; i<l; i++) {
      currentFrame.setPixel(pixels[i].col, pixels[i].row, Constants.TRANSPARENT_COLOR);
    }

    $.publish(Events.PISKEL_SAVE_STATE, {
      type : pskl.service.HistoryService.REPLAY,
      scope : this,
      replay : {
        type : SELECTION_REPLAY.ERASE,
        pixels : JSON.parse(JSON.stringify(pixels.slice(0)))
      }
    });
  };

  ns.SelectionManager.prototype.cut = function() {
    if(this.currentSelection) {
      // Put cut target into the selection:
      this.currentSelection.fillSelectionFromFrame(this.piskelController.getCurrentFrame());
      this.erase();
    }
    else {
      throw "Bad state for CUT callback in SelectionManager";
    }
  };

  ns.SelectionManager.prototype.paste = function() {
    if(this.currentSelection && this.currentSelection.hasPastedContent) {
      var pixels = this.currentSelection.pixels;
      var opaquePixels = pixels.filter(function (p) {
        return p.color !== Constants.TRANSPARENT_COLOR;
      });
      this.pastePixels(opaquePixels);
    }
  };

  ns.SelectionManager.prototype.pastePixels = function(pixels) {
    var currentFrame = this.piskelController.getCurrentFrame();

    pixels.forEach(function (pixel) {
      currentFrame.setPixel(pixel.col,pixel.row,pixel.color);
    });

    $.publish(Events.PISKEL_SAVE_STATE, {
      type : pskl.service.HistoryService.REPLAY,
      scope : this,
      replay : {
        type : SELECTION_REPLAY.PASTE,
        pixels : JSON.parse(JSON.stringify(pixels.slice(0)))
      }
    });
  };

  ns.SelectionManager.prototype.replay = function (frame, replayData) {
    var pixels = replayData.pixels;
    pixels.forEach(function (pixel) {
      var color = replayData.type === SELECTION_REPLAY.PASTE ? pixel.color : Constants.TRANSPARENT_COLOR;
      frame.setPixel(pixel.col, pixel.row, color);
    });
  };

  ns.SelectionManager.prototype.copy = function() {
    if(this.currentSelection && this.piskelController.getCurrentFrame()) {
      this.currentSelection.fillSelectionFromFrame(this.piskelController.getCurrentFrame());
    } else {
      throw "Bad state for CUT callback in SelectionManager";
    }
  };

  /**
   * @private
   */
  ns.SelectionManager.prototype.onSelectionCreated_ = function(evt, selection) {
    if(selection) {
      this.currentSelection = selection;
    } else {
      throw "No selection set in SelectionManager";
    }
  };

  /**
   * @private
   */
  ns.SelectionManager.prototype.onSelectionMoved_ = function(evt, colDiff, rowDiff) {
    if(this.currentSelection) {
      this.currentSelection.move(colDiff, rowDiff);
    }
    else {
      throw "Bad state: No currentSelection set when trying to move it in SelectionManager";
    }
  };
})();
;(function () {
  var ns = $.namespace("pskl.selection");

  ns.BaseSelection = function () {
    this.reset();
  };

  ns.BaseSelection.prototype.reset = function () {
    this.pixels = [];
    this.hasPastedContent = false;
  };

  ns.BaseSelection.prototype.move = function (colDiff, rowDiff) {
    var movedPixel, movedPixels = [];

    for(var i=0, l=this.pixels.length; i<l; i++) {
      movedPixel = this.pixels[i];
      movedPixel.col += colDiff;
      movedPixel.row += rowDiff;
      movedPixels.push(movedPixel);
    }
    this.pixels = movedPixels;
  };

  ns.BaseSelection.prototype.fillSelectionFromFrame = function (targetFrame) {
    this.pixels.forEach(function (pixel) {
      pixel.color = targetFrame.getPixel(pixel.col, pixel.row);
    });
    this.hasPastedContent = true;
  };
})();;(function () {
  var ns = $.namespace("pskl.selection");

  ns.RectangularSelection = function (x0, y0, x1, y1) {
    this.pixels = pskl.PixelUtils.getRectanglePixels(x0, y0, x1, y1);
  };

  pskl.utils.inherit(ns.RectangularSelection, ns.BaseSelection);
})();;(function () {
  var ns = $.namespace("pskl.selection");

  ns.ShapeSelection = function (pixels) {
    this.pixels = pixels;
  };

  pskl.utils.inherit(ns.ShapeSelection, ns.BaseSelection);
})();;(function () {
  var ns = $.namespace('pskl.rendering');

  ns.AbstractRenderer = function () {};

  ns.AbstractRenderer.prototype.clear = Constants.ABSTRACT_FUNCTION;
  ns.AbstractRenderer.prototype.render = Constants.ABSTRACT_FUNCTION;

  ns.AbstractRenderer.prototype.getCoordinates = Constants.ABSTRACT_FUNCTION;

  ns.AbstractRenderer.prototype.setGridWidth = Constants.ABSTRACT_FUNCTION;
  ns.AbstractRenderer.prototype.getGridWidth =  Constants.ABSTRACT_FUNCTION;

  ns.AbstractRenderer.prototype.setZoom = Constants.ABSTRACT_FUNCTION;
  ns.AbstractRenderer.prototype.getZoom = Constants.ABSTRACT_FUNCTION;

  ns.AbstractRenderer.prototype.setOffset = Constants.ABSTRACT_FUNCTION;
  ns.AbstractRenderer.prototype.getOffset = Constants.ABSTRACT_FUNCTION;

  ns.AbstractRenderer.prototype.setDisplaySize = Constants.ABSTRACT_FUNCTION;
  ns.AbstractRenderer.prototype.getDisplaySize = Constants.ABSTRACT_FUNCTION;
})();;(function () {
  var ns = $.namespace('pskl.rendering');

  ns.CompositeRenderer = function () {
    this.renderers = [];
  };

  pskl.utils.inherit(pskl.rendering.CompositeRenderer, pskl.rendering.AbstractRenderer);

  ns.CompositeRenderer.prototype.add = function (renderer) {
    this.renderers.push(renderer);
    return this;
  };

  ns.CompositeRenderer.prototype.clear = function () {
    this.renderers.forEach(function (renderer) {
      renderer.clear();
    });
  };

  ns.CompositeRenderer.prototype.setZoom = function (zoom) {
    this.renderers.forEach(function (renderer) {
      renderer.setZoom(zoom);
    });
  };

  ns.CompositeRenderer.prototype.getZoom = function () {
    return this.getSampleRenderer_().getZoom();
  };

  ns.CompositeRenderer.prototype.setDisplaySize = function (w, h) {
    this.renderers.forEach(function (renderer) {
      renderer.setDisplaySize(w, h);
    });
  };

  ns.CompositeRenderer.prototype.getDisplaySize = function () {
    return this.getSampleRenderer_().getDisplaySize();
  };

  ns.CompositeRenderer.prototype.setOffset = function (x, y) {
    this.renderers.forEach(function (renderer) {
      renderer.setOffset(x, y);
    });
  };

  ns.CompositeRenderer.prototype.getOffset = function () {
    return this.getSampleRenderer_().getOffset();
  };


  ns.CompositeRenderer.prototype.setGridWidth = function (b) {
    this.renderers.forEach(function (renderer) {
      renderer.setGridWidth(b);
    });
  };

  ns.CompositeRenderer.prototype.getGridWidth = function () {
    return this.getSampleRenderer_().getGridWidth();
  };

  ns.CompositeRenderer.prototype.getSampleRenderer_ = function () {
    if (this.renderers.length > 0) {
      return this.renderers[0];
    } else {
      throw 'Renderer manager is empty';
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.rendering.layer');

  ns.LayersRenderer = function (container, renderingOptions, piskelController) {
    pskl.rendering.CompositeRenderer.call(this);

    this.piskelController = piskelController;

    // Do not use CachedFrameRenderers here, since the caching will be performed in the render method of LayersRenderer
    this.belowRenderer = new pskl.rendering.frame.FrameRenderer(container, renderingOptions, ["layers-canvas", "layers-below-canvas"]);
    this.aboveRenderer = new pskl.rendering.frame.FrameRenderer(container, renderingOptions, ["layers-canvas", "layers-above-canvas"]);

    this.add(this.belowRenderer);
    this.add(this.aboveRenderer);

    this.serializedRendering = '';

    $.subscribe(Events.PISKEL_RESET, this.flush.bind(this));
  };

  pskl.utils.inherit(pskl.rendering.layer.LayersRenderer, pskl.rendering.CompositeRenderer);

  ns.LayersRenderer.prototype.render = function () {
    var offset = this.getOffset();
    var size = this.getDisplaySize();
    var layers = this.piskelController.getLayers();
    var currentFrameIndex = this.piskelController.getCurrentFrameIndex();
    var currentLayerIndex = this.piskelController.getCurrentLayerIndex();

    var downLayers = layers.slice(0, currentLayerIndex);
    var upLayers = layers.slice(currentLayerIndex + 1, layers.length);


    var serializedRendering = [
      this.getZoom(),
      this.getGridWidth(),
      offset.x,
      offset.y,
      size.width,
      size.height,
      this.getHashForLayersAt_(currentFrameIndex, downLayers),
      this.getHashForLayersAt_(currentFrameIndex, upLayers),
      layers.length
    ].join("-");


    if (this.serializedRendering != serializedRendering) {
      this.serializedRendering = serializedRendering;

      this.clear();

      if (downLayers.length > 0) {
        var downFrame = this.getFrameForLayersAt_(currentFrameIndex, downLayers);
        this.belowRenderer.render(downFrame);
      }

      if (upLayers.length > 0) {
        var upFrame = this.getFrameForLayersAt_(currentFrameIndex, upLayers);
        this.aboveRenderer.render(upFrame);
      }
    }
  };

  /**
   * See @pskl.rendering.frame.CachedFrameRenderer
   * Same issue : FrameRenderer setDisplaySize destroys the canvas
   * @param {Number} width
   * @param {Number} height
   */
  ns.LayersRenderer.prototype.setDisplaySize = function (width, height) {
    var size = this.getDisplaySize();
    if (size.width !== width || size.height !== height) {
      this.superclass.setDisplaySize.call(this, width, height);
    }
  };

  ns.LayersRenderer.prototype.getFrameForLayersAt_ = function (frameIndex, layers) {
    var frames = layers.map(function (l) {
      return l.getFrameAt(frameIndex);
    });
    return pskl.utils.FrameUtils.merge(frames);
  };

  ns.LayersRenderer.prototype.getHashForLayersAt_ = function (frameIndex, layers) {
    var hash = layers.map(function (l) {
      return l.getFrameAt(frameIndex).getHash();
    });
    return hash.join('-');
  };

  ns.LayersRenderer.prototype.flush = function () {
    this.serializedRendering = '';
  };
})();
;(function () {
  var ns = $.namespace("pskl.rendering.frame");

  /**
   * FrameRenderer will display a given frame inside a canvas element.
   * @param {HtmlElement} container HtmlElement to use as parentNode of the Frame
   * @param {Object} renderingOptions
   * @param {Array} classList array of strings to use for css classList
   */
  ns.FrameRenderer = function (container, renderingOptions, classList) {
    this.defaultRenderingOptions = {
      'supportGridRendering' : false,
      'zoom' : 1
    };

    renderingOptions = $.extend(true, {}, this.defaultRenderingOptions, renderingOptions);

    if(container === undefined) {
      throw 'Bad FrameRenderer initialization. <container> undefined.';
    }

    if(isNaN(renderingOptions.zoom)) {
      throw 'Bad FrameRenderer initialization. <zoom> not well defined.';
    }

    this.container = container;

    this.zoom = renderingOptions.zoom;

    this.offset = {
      x : 0,
      y : 0
    };

    this.margin = {
      x : 0,
      y : 0
    };

    this.supportGridRendering = renderingOptions.supportGridRendering;

    this.classList = classList || [];
    this.classList.push('canvas');

    /**
     * Off dom canvas, will be used to draw the frame at 1:1 ratio
     * @type {HTMLElement}
     */
    this.canvas = null;

    /**
     * Displayed canvas, scaled-up from the offdom canvas
     * @type {HTMLElement}
     */
    this.displayCanvas = null;
    this.setDisplaySize(renderingOptions.width, renderingOptions.height);

    this.setGridWidth(pskl.UserSettings.get(pskl.UserSettings.GRID_WIDTH));

    $.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
  };

  pskl.utils.inherit(pskl.rendering.frame.FrameRenderer, pskl.rendering.AbstractRenderer);

  ns.FrameRenderer.prototype.render = function (frame) {
    if (frame) {
      this.clear();
      this.renderFrame_(frame);
    }
  };

  ns.FrameRenderer.prototype.clear = function () {
    pskl.utils.CanvasUtils.clear(this.canvas);
    pskl.utils.CanvasUtils.clear(this.displayCanvas);
  };

  ns.FrameRenderer.prototype.setZoom = function (zoom) {
    if (zoom < 1) {
      zoom=1;
      // back up center coordinates
      var centerX = this.offset.x + (this.displayWidth/(this.zoom));
      var centerY = this.offset.y + (this.displayHeight/(this.zoom));

      this.zoom = zoom;
      // recenter
      this.setOffset(
        centerX - (this.displayWidth/(this.zoom)),
        centerY - (this.displayHeight/(this.zoom))
      );
    } else
    if (zoom > Constants.MINIMUM_ZOOM) {
      // back up center coordinates
      var centerX = this.offset.x + (this.displayWidth/(2*this.zoom));
      var centerY = this.offset.y + (this.displayHeight/(2*this.zoom));

      this.zoom = zoom;

      // spaghetti
      /////////////////////////////////////////////////////////////////////////////
      window.psklPos = this;
      /*window.psklPos = {
        info:this,
        offset: this.offset,
        zoom: this.zoom
      };*/
      //window.psklPos.offset.x = this.offset.x;
      //window.psklPos.offset.y = this.offset.y;
      /////////////////////////////////////////////////////////////////////////////

      // recenter
      this.setOffset(
        centerX - (this.displayWidth/(2*this.zoom)),
        centerY - (this.displayHeight/(2*this.zoom))
      );
    }
  };

  ns.FrameRenderer.prototype.getZoom = function () {
    return this.zoom;
  };

  ns.FrameRenderer.prototype.setDisplaySize = function (width, height) {
    this.displayWidth = width;
    this.displayHeight = height;
    if (this.displayCanvas) {
      $(this.displayCanvas).remove();
      this.displayCanvas = null;
    }
    this.createDisplayCanvas_();
  };

  ns.FrameRenderer.prototype.getDisplaySize = function () {
    return {
      height : this.displayHeight,
      width : this.displayWidth
    };
  };

  ns.FrameRenderer.prototype.getOffset = function () {
    return {
      x : this.offset.x,
      y : this.offset.y
    };
  };

  ns.FrameRenderer.prototype.setOffset = function (x, y) {
    var width = pskl.app.piskelController.getWidth();
    var height = pskl.app.piskelController.getHeight();
    var maxX = width - (this.displayWidth/this.zoom);
    x = pskl.utils.Math.minmax(x, 0, maxX);
    var maxY = height - (this.displayHeight/this.zoom);
    y = pskl.utils.Math.minmax(y, 0, maxY);

    this.offset.x = x;
    this.offset.y = y;
  };

  ns.FrameRenderer.prototype.setGridWidth = function (value) {
    this.gridWidth_ = value;
  };

  ns.FrameRenderer.prototype.getGridWidth = function () {
    if (this.supportGridRendering) {
      return this.gridWidth_;
    } else {
      return 0;
    }
  };

  ns.FrameRenderer.prototype.updateMargins_ = function (frame) {
    var deltaX = this.displayWidth - (this.zoom * frame.getWidth());
    this.margin.x = Math.max(0, deltaX) / 2;

    var deltaY = this.displayHeight - (this.zoom * frame.getHeight());
    this.margin.y = Math.max(0, deltaY) / 2;
  };

  ns.FrameRenderer.prototype.createDisplayCanvas_ = function () {
    var height = this.displayHeight;
    var width = this.displayWidth;

    this.displayCanvas = pskl.utils.CanvasUtils.createCanvas(width, height, this.classList);
    pskl.utils.CanvasUtils.disableImageSmoothing(this.displayCanvas);
    this.container.append(this.displayCanvas);
  };

  ns.FrameRenderer.prototype.onUserSettingsChange_ = function (evt, settingName, settingValue) {
    if (settingName == pskl.UserSettings.GRID_WIDTH) {
      this.setGridWidth(settingValue);
    }
  };

  /**
   * Transform a screen pixel-based coordinate (relative to the top-left corner of the rendered
   * frame) into a sprite coordinate in column and row.
   * @public
   */
  ns.FrameRenderer.prototype.getCoordinates = function(x, y) {
    var containerOffset = this.container.offset();
    //console.log(containerOffset);
    x = x - containerOffset.left;
    y = y - containerOffset.top;

    // apply margins
    x = x - this.margin.x;
    y = y - this.margin.y;

    var cellSize = this.zoom;
    // apply frame offset
    x = x + this.offset.x * cellSize;
    y = y + this.offset.y * cellSize;

    return {
      x : Math.floor(x / cellSize),
      y : Math.floor(y / cellSize)
    };
  };

  ns.FrameRenderer.prototype.reverseCoordinates = function(x, y) {
    var cellSize = this.zoom;

    x = x * cellSize;
    y = y * cellSize;

    x = x - this.offset.x * cellSize;
    y = y - this.offset.y * cellSize;

    x = x + this.margin.x;
    y = y + this.margin.y;

    var containerOffset = this.container.offset();
    x = x + containerOffset.left;
    y = y + containerOffset.top;

    return {
      x : x + (cellSize/2),
      y : y + (cellSize/2)
    };
  };

  /**
   * @private
   */
  ns.FrameRenderer.prototype.renderFrame_ = function (frame) {
    if (!this.canvas || frame.getWidth() != this.canvas.width || frame.getHeight() != this.canvas.height) {
      this.canvas = pskl.utils.CanvasUtils.createCanvas(frame.getWidth(), frame.getHeight());
    }

    var context = this.canvas.getContext('2d');
    for(var x = 0, width = frame.getWidth(); x < width; x++) {
      for(var y = 0, height = frame.getHeight(); y < height; y++) {
        var color = frame.getPixel(x, y);
        var w = 1;
        while (color === frame.getPixel(x, y+w)) {
          w++;
        }
        this.renderLine_(color, x, y, w, context);
        y = y + w - 1;
      }
    }

    this.updateMargins_(frame);

    var displayContext = this.displayCanvas.getContext('2d');
    displayContext.save();

    if (this.canvas.width*this.zoom < this.displayCanvas.width || this.canvas.height*this.zoom < this.displayCanvas.height) {
      displayContext.fillStyle = Constants.ZOOMED_OUT_BACKGROUND_COLOR;
      displayContext.fillRect(0,0,this.displayCanvas.width, this.displayCanvas.height);
    }

    displayContext.translate(
      Math.floor(this.margin.x-this.offset.x*this.zoom),
      Math.floor(this.margin.y-this.offset.y*this.zoom)
    );

    displayContext.clearRect(0, 0, Math.floor(this.canvas.width*this.zoom), Math.floor(this.canvas.height*this.zoom));

    var isIE10 = pskl.utils.UserAgent.isIE && pskl.utils.UserAgent.version === 10;

    var gridWidth = this.getGridWidth();
    var isGridEnabled = gridWidth > 0;
    if (isGridEnabled || isIE10) {
      var scaled = pskl.utils.ImageResizer.resizeNearestNeighbour(this.canvas, this.zoom, gridWidth);
      displayContext.drawImage(scaled, 0, 0);
    } else {
      displayContext.scale(this.zoom, this.zoom);
      displayContext.drawImage(this.canvas, 0, 0);
    }
    displayContext.restore();
  };

  ns.FrameRenderer.prototype.renderPixel_ = function (color, x, y, context) {
    if(color != Constants.TRANSPARENT_COLOR) {
      context.fillStyle = color;
      context.fillRect(x, y, 1, 1);
    }
  };

  ns.FrameRenderer.prototype.renderLine_ = function (color, x, y, width, context) {
    if(color != Constants.TRANSPARENT_COLOR) {
      context.fillStyle = color;
      context.fillRect(x, y, 1, width);
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.rendering');

  ns.OnionSkinRenderer = function (renderer, piskelController) {
    pskl.rendering.CompositeRenderer.call(this);

    this.piskelController = piskelController;
    this.renderer = renderer;
    this.add(this.renderer);

    this.hash = '';
  };

  ns.OnionSkinRenderer.createInContainer = function (container, renderingOptions, piskelController) {
    // Do not use CachedFrameRenderers here, caching is performed in the render method
    var renderer = new pskl.rendering.frame.FrameRenderer(container, renderingOptions, ['onion-skin-canvas']);
    return new ns.OnionSkinRenderer(renderer, piskelController);
  };

  pskl.utils.inherit(pskl.rendering.OnionSkinRenderer, pskl.rendering.CompositeRenderer);

  ns.OnionSkinRenderer.prototype.render = function () {
    var frames = this.getOnionFrames_();
    var hash = this.computeHash_(frames);
    if (this.hash != hash) {
      this.hash = hash;
      this.clear();
      if (frames.length > 0) {
        var mergedFrame = pskl.utils.FrameUtils.merge(frames);
        this.renderer.render(mergedFrame);
      }
    }
  };

  ns.OnionSkinRenderer.prototype.getOnionFrames_ = function () {
    var frames = [];

    var currentFrameIndex = this.piskelController.getCurrentFrameIndex();
    var layer = this.piskelController.getCurrentLayer();

    var previousIndex = currentFrameIndex - 1;
    var previousFrame = layer.getFrameAt(previousIndex);
    if (previousFrame) {
      frames.push(previousFrame);
    }

    var nextIndex = currentFrameIndex + 1;
    var nextFrame = layer.getFrameAt(nextIndex);
    if (nextFrame) {
      frames.push(nextFrame);
    }

    return frames;
  };

  ns.OnionSkinRenderer.prototype.computeHash_ = function (frames) {
    var offset = this.getOffset();
    var size = this.getDisplaySize();
    var layers = this.piskelController.getLayers();
    return [
      this.getZoom(),
      this.getGridWidth(),
      offset.x,
      offset.y,
      size.width,
      size.height,
      frames.map(function (f) {
        return f.getHash();
      }).join('-'),
      layers.length
    ].join('-');
  };

  /**
   * See @pskl.rendering.frame.CachedFrameRenderer
   * Same issue : FrameRenderer setDisplaySize destroys the canvas
   * @param {Number} width
   * @param {Number} height
   */
  ns.OnionSkinRenderer.prototype.setDisplaySize = function (width, height) {
    var size = this.getDisplaySize();
    if (size.width !== width || size.height !== height) {
      this.superclass.setDisplaySize.call(this, width, height);
    }
  };

  ns.OnionSkinRenderer.prototype.flush = function () {
    this.hash = '';
  };
})();;(function () {
  var ns = $.namespace('pskl.rendering.frame');

  ns.TiledFrameRenderer = function (container, zoom) {
    this.container = container;
    this.setZoom(zoom);

    this.displayContainer = document.createElement('div');
    this.displayContainer.classList.add('tiled-frame-container');
    container.get(0).appendChild(this.displayContainer);

    this.cachedFrameProcessor = new pskl.model.frame.CachedFrameProcessor();
    this.cachedFrameProcessor.setFrameProcessor(this.frameToDataUrl_.bind(this));
  };

  ns.TiledFrameRenderer.prototype.frameToDataUrl_ = function (frame) {
    var canvas = new pskl.utils.FrameUtils.toImage(frame, this.zoom);
    return canvas.toDataURL('image/png');
  };

  ns.TiledFrameRenderer.prototype.render = function (frame) {
    var imageSrc = this.cachedFrameProcessor.get(frame, this.zoom);
    this.displayContainer.style.backgroundImage = 'url(' + imageSrc + ')';
  };

  ns.TiledFrameRenderer.prototype.show = function () {
    if (this.displayContainer) {
      this.displayContainer.style.display = 'block';
    }
  };

  ns.TiledFrameRenderer.prototype.setZoom = function (zoom) {
    this.zoom = zoom;
  };

  ns.TiledFrameRenderer.prototype.getZoom = function () {
    return this.zoom;
  };
})();;(function () {
  var ns = $.namespace('pskl.rendering.frame');

  /**
   * FrameRenderer implementation that prevents unnecessary redraws.
   * @param {HtmlElement} container HtmlElement to use as parentNode of the Frame
   * @param {Object} renderingOptions
   * @param {Array} classList array of strings to use for css classes
   */
  ns.CachedFrameRenderer = function (container, renderingOptions, classList) {
    pskl.rendering.frame.FrameRenderer.call(this, container, renderingOptions, classList);
    this.serializedFrame = '';
  };

  pskl.utils.inherit(pskl.rendering.frame.CachedFrameRenderer, pskl.rendering.frame.FrameRenderer);

  /**
   * Only call display size if provided values are different from current values.
   * FrameRenderer:setDisplaySize destroys the underlying canvas
   * If the canvas is destroyed, a rendering is mandatory.
   * (Alternatively we could find a way to force the rendering of the CachedFrameRenderer from the outside)
   * @param {Number} width
   * @param {Number} height
   */
  ns.CachedFrameRenderer.prototype.setDisplaySize = function (width, height) {
    if (this.displayWidth !== width || this.displayHeight !== height) {
      this.superclass.setDisplaySize.call(this, width, height);
    }
  };

  ns.CachedFrameRenderer.prototype.render = function (frame) {
    var offset = this.getOffset();
    var size = this.getDisplaySize();
    var serializedFrame = [
      this.getZoom(),
      this.getGridWidth(),
      offset.x, offset.y,
      size.width, size.height,
      frame.getHash()
    ].join('-');
    if (this.serializedFrame != serializedFrame) {
      // console.log('rendering')
      this.serializedFrame = serializedFrame;
      this.superclass.render.call(this, frame);
    }
  };
})();
;(function () {

  var ns = $.namespace("pskl.rendering");
  ns.CanvasRenderer = function (frame, zoom) {
    this.frame = frame;
    this.zoom = zoom;
    this.transparentColor_ = 'white';
  };

  /**
   * Decide which color should be used to represent transparent pixels
   * Default : white
   * @param  {String} color the color to use either as '#ABCDEF' or 'red' or 'rgb(x,y,z)' or 'rgba(x,y,z,a)'
   */
  ns.CanvasRenderer.prototype.drawTransparentAs = function (color) {
    this.transparentColor_ = color;
  };

  ns.CanvasRenderer.prototype.render = function  () {
    var canvas = this.createCanvas_();
    var context = canvas.getContext('2d');

    for(var x = 0, width = this.frame.getWidth(); x < width; x++) {
      for(var y = 0, height = this.frame.getHeight(); y < height; y++) {
        var color = this.frame.getPixel(x, y);
        var w = 1;
        while (color === this.frame.getPixel(x, y+w)) {
          w++;
        }
        this.renderLine_(color, x, y, w, context);
        y = y + w - 1;
      }
    }

    var scaledCanvas = this.createCanvas_(this.zoom);
    var scaledContext = scaledCanvas.getContext('2d');
    pskl.utils.CanvasUtils.disableImageSmoothing(scaledCanvas);
    scaledContext.scale(this.zoom, this.zoom);
    scaledContext.drawImage(canvas, 0, 0);

    return scaledCanvas;
  };

  ns.CanvasRenderer.prototype.renderPixel_ = function (color, x, y, context) {
    if(color == Constants.TRANSPARENT_COLOR) {
      color = this.transparentColor_;
    }
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  };

  ns.CanvasRenderer.prototype.renderLine_ = function (color, x, y, width, context) {
    if(color == Constants.TRANSPARENT_COLOR) {
      color = this.transparentColor_;
    }
    context.fillStyle = color;
    context.fillRect(x, y, 1, width);
  };

  ns.CanvasRenderer.prototype.createCanvas_ = function (zoom) {
    zoom = zoom || 1;
    var width = this.frame.getWidth() * zoom;
    var height = this.frame.getHeight() * zoom;
    return pskl.utils.CanvasUtils.createCanvas(width, height);
  };
})();;(function () {
  var ns = $.namespace('pskl.rendering');

  /**
   * Render an array of frames
   * @param {Array.<pskl.model.Frame>} frames
   */
  ns.FramesheetRenderer = function (frames) {
    if (frames.length > 0) {
      this.frames = frames;
    } else {
      throw 'FramesheetRenderer : Invalid argument : frames is empty';
    }
  };

  ns.FramesheetRenderer.prototype.renderAsCanvas = function () {
    var canvas = this.createCanvas_();
    for (var i = 0 ; i < this.frames.length ; i++) {
      var frame = this.frames[i];
      this.drawFrameInCanvas_(frame, canvas, i * frame.getWidth(), 0);
    }
    return canvas;
  };

  ns.FramesheetRenderer.prototype.drawFrameInCanvas_ = function (frame, canvas, offsetWidth, offsetHeight) {
    var context = canvas.getContext('2d');
    frame.forEachPixel(function (color, x, y) {
      if(color != Constants.TRANSPARENT_COLOR) {
        context.fillStyle = color;
        context.fillRect(x + offsetWidth, y + offsetHeight, 1, 1);
      }
    });
  };

  ns.FramesheetRenderer.prototype.createCanvas_ = function () {
    var sampleFrame = this.frames[0];
    var count = this.frames.length;
    var width = count * sampleFrame.getWidth();
    var height = sampleFrame.getHeight();
    return pskl.utils.CanvasUtils.createCanvas(width, height);
  };

})();;(function () {

  var ns = $.namespace("pskl.rendering");

  ns.PiskelRenderer = function (piskelController) {
    var frames = [];
    for (var i = 0 ; i < piskelController.getFrameCount() ; i++) {
      frames.push(piskelController.getFrameAt(i));
    }
    ns.FramesheetRenderer.call(this, frames);
  };

  pskl.utils.inherit(ns.PiskelRenderer, ns.FramesheetRenderer);
})();;(function () {
  var ns = $.namespace('pskl.controller.piskel');

  ns.PiskelController = function (piskel) {
    if (piskel) {
      this.setPiskel(piskel);
    } else {
      throw 'A piskel instance is mandatory for instanciating PiskelController';
    }
  };

  /**
   * Set the current piskel. Will reset the selected frame and layer unless specified
   * @param {Object} piskel
   * @param {Boolean} preserveState if true, keep the selected frame and layer
   */
  ns.PiskelController.prototype.setPiskel = function (piskel, preserveState) {
    this.piskel = piskel;
    if (!preserveState) {
      this.currentLayerIndex = 0;
      this.currentFrameIndex = 0;
    }

    this.layerIdCounter = 1;
  };

  ns.PiskelController.prototype.init = function () {
  };

  ns.PiskelController.prototype.getHeight = function () {
    return this.piskel.getHeight();
  };

  ns.PiskelController.prototype.getWidth = function () {
    return this.piskel.getWidth();
  };

  /**
   * TODO : this should be removed
   * FPS should be stored in the Piskel model and not in the
   * animationController
   * Then piskelController should be able to return this information
   * @return {Number} Frames per second for the current animation
   */
  ns.PiskelController.prototype.getFPS = function () {
    return pskl.app.animationController.getFPS();
  };

  ns.PiskelController.prototype.getLayers = function () {
    return this.piskel.getLayers();
  };

  ns.PiskelController.prototype.getCurrentLayer = function () {
    return this.getLayerAt(this.currentLayerIndex);
  };

  ns.PiskelController.prototype.getLayerAt = function (index) {
    return this.piskel.getLayerAt(index);
  };

  ns.PiskelController.prototype.hasLayerAt = function (index) {
    return !!this.getLayerAt(index);
  };

  // FIXME ?? No added value compared to getLayerAt ??
  // Except normalizing to null if undefined ?? ==> To merge
  ns.PiskelController.prototype.getLayerByIndex = function (index) {
    var layers = this.getLayers();
    if (layers[index]) {
      return layers[index];
    } else {
      return null;
    }
  };

  ns.PiskelController.prototype.getCurrentFrame = function () {
    var layer = this.getCurrentLayer();
    return layer.getFrameAt(this.currentFrameIndex);
  };


  ns.PiskelController.prototype.getCurrentLayerIndex = function () {
    return this.currentLayerIndex;
  };

  ns.PiskelController.prototype.getCurrentFrameIndex = function () {
    return this.currentFrameIndex;
  };

  ns.PiskelController.prototype.getPiskel = function () {
    return this.piskel;
  };

  ns.PiskelController.prototype.getFrameAt = function (index) {
    var hash = [];
    var frames = this.getLayers().map(function (l) {
      var frame = l.getFrameAt(index);
      hash.push(frame.getHash());
      return frame;
    });
    var mergedFrame = pskl.utils.FrameUtils.merge(frames);
    mergedFrame.id = hash.join('-');
    mergedFrame.version = 0;
    return mergedFrame;
  };

  ns.PiskelController.prototype.hasFrameAt = function (index) {
    return !!this.getCurrentLayer().getFrameAt(index);
  };

  ns.PiskelController.prototype.addFrame = function () {
    this.addFrameAt(this.getFrameCount());
  };

  ns.PiskelController.prototype.addFrameAtCurrentIndex = function () {
    this.addFrameAt(this.currentFrameIndex + 1);
  };

  ns.PiskelController.prototype.addFrameAt = function (index) {
    this.getLayers().forEach(function (l) {
      l.addFrameAt(this.createEmptyFrame_(), index);
    }.bind(this));

    this.setCurrentFrameIndex(index);
  };

  ns.PiskelController.prototype.createEmptyFrame_ = function () {
    var w = this.piskel.getWidth(), h = this.piskel.getHeight();
    return new pskl.model.Frame(w, h);
  };

  ns.PiskelController.prototype.removeFrameAt = function (index) {
    this.getLayers().forEach(function (l) {
      l.removeFrameAt(index);
    });
    // Current frame index is impacted if the removed frame was before the current frame
    if (this.currentFrameIndex >= index && this.currentFrameIndex > 0) {
      this.setCurrentFrameIndex(this.currentFrameIndex - 1);
    }
  };

  ns.PiskelController.prototype.duplicateCurrentFrame = function () {
    this.duplicateFrameAt(this.currentFrameIndex);
  };

  ns.PiskelController.prototype.duplicateFrameAt = function (index) {
    this.getLayers().forEach(function (l) {
      l.duplicateFrameAt(index);
    });
    this.setCurrentFrameIndex(index+1);
  };

  ns.PiskelController.prototype.moveFrame = function (fromIndex, toIndex) {
    this.getLayers().forEach(function (l) {
      l.moveFrame(fromIndex, toIndex);
    });
  };

  ns.PiskelController.prototype.getFrameCount = function () {
    var layer = this.piskel.getLayerAt(0);
    return layer.size();
  };

  ns.PiskelController.prototype.setCurrentFrameIndex = function (index) {
    if (this.hasFrameAt(index)) {
      this.currentFrameIndex = index;
    } else {
      window.console.error('Could not set current frame index to ' + index);
    }
  };

  ns.PiskelController.prototype.selectNextFrame = function () {
    var nextIndex = this.currentFrameIndex + 1;
    if (nextIndex < this.getFrameCount()) {
      this.setCurrentFrameIndex(nextIndex);
    }
  };

  ns.PiskelController.prototype.selectPreviousFrame = function () {
    var nextIndex = this.currentFrameIndex - 1;
    if (nextIndex >= 0) {
      this.setCurrentFrameIndex(nextIndex);
    }
  };

  ns.PiskelController.prototype.setCurrentLayerIndex = function (index) {
    if (this.hasLayerAt(index)) {
      this.currentLayerIndex = index;
    } else {
      window.console.error('Could not set current layer index to ' + index);
    }
  };

  ns.PiskelController.prototype.selectLayer = function (layer) {
    var index = this.getLayers().indexOf(layer);
    if (index != -1) {
      this.setCurrentLayerIndex(index);
    }
  };

  ns.PiskelController.prototype.renameLayerAt = function (index, name) {
    var layer = this.getLayerByIndex(index);
    if (layer) {
      layer.setName(name);
    }
  };

  ns.PiskelController.prototype.mergeDownLayerAt = function (index) {
    var layer = this.getLayerByIndex(index);
    var downLayer = this.getLayerByIndex(index-1);
    if (layer && downLayer) {
      var mergedLayer = pskl.utils.LayerUtils.mergeLayers(layer, downLayer);
      this.removeLayerAt(index);
      this.piskel.addLayerAt(mergedLayer, index);
      this.removeLayerAt(index-1);
      this.selectLayer(mergedLayer);
    }
  };

  ns.PiskelController.prototype.generateLayerName_ = function () {
    var name = "Layer " + this.layerIdCounter;
    while (this.hasLayerForName_(name)) {
      this.layerIdCounter++;
      name = "Layer " + this.layerIdCounter;
    }
    return name;
  };

  ns.PiskelController.prototype.createLayer = function (name) {
    if (!name) {
      name = this.generateLayerName_();
    }
    if (!this.hasLayerForName_(name)) {
      var layer = new pskl.model.Layer(name);
      for (var i = 0 ; i < this.getFrameCount() ; i++) {
        layer.addFrame(this.createEmptyFrame_());
      }
      this.piskel.addLayer(layer);
      this.setCurrentLayerIndex(this.piskel.getLayers().length - 1);

    } else {
      throw 'Layer name should be unique';
    }
  };

  ns.PiskelController.prototype.hasLayerForName_ = function (name) {
    return this.piskel.getLayersByName(name).length > 0;
  };

  ns.PiskelController.prototype.moveLayerUp = function () {
    var layer = this.getCurrentLayer();
    this.piskel.moveLayerUp(layer);
    this.selectLayer(layer);
  };

  ns.PiskelController.prototype.moveLayerDown = function () {
    var layer = this.getCurrentLayer();
    this.piskel.moveLayerDown(layer);
    this.selectLayer(layer);
  };

  ns.PiskelController.prototype.removeLayerAt = function (index) {
    if (this.getLayers().length > 1) {
      var layer = this.getLayerAt(index);
      if (layer) {
        this.piskel.removeLayer(layer);
        this.setCurrentLayerIndex(0);
      }
    }
  };

  ns.PiskelController.prototype.serialize = function (expanded) {
    return pskl.utils.Serializer.serializePiskel(this.piskel, expanded);
  };
})();;(function () {
  var ns = $.namespace('pskl.controller.piskel');

  ns.PublicPiskelController = function (piskelController) {
    this.piskelController = piskelController;
    pskl.utils.wrap(this, this.piskelController);
  };

  ns.PublicPiskelController.prototype.init = function () {
    pskl.app.shortcutService.addShortcut('up', this.selectPreviousFrame.bind(this));
    pskl.app.shortcutService.addShortcut('down', this.selectNextFrame.bind(this));
    pskl.app.shortcutService.addShortcut('n', this.addFrameAtCurrentIndex.bind(this));
    pskl.app.shortcutService.addShortcut('shift+n', this.duplicateCurrentFrame.bind(this));
  };

  ns.PublicPiskelController.prototype.setPiskel = function (piskel, preserveState) {
    this.piskelController.setPiskel(piskel, preserveState);

    $.publish(Events.FRAME_SIZE_CHANGED);
    $.publish(Events.PISKEL_RESET);
    $.publish(Events.PISKEL_SAVE_STATE, {
      type : pskl.service.HistoryService.SNAPSHOT
    });
  };

  ns.PublicPiskelController.prototype.addFrame = function () {
    this.addFrameAt(this.getFrameCount());
  };

  ns.PublicPiskelController.prototype.addFrameAtCurrentIndex = function () {
    this.addFrameAt(this.getCurrentFrameIndex());
  };

  ns.PublicPiskelController.prototype.addFrameAt = function (index) {
    this.raiseSaveStateEvent_(this.piskelController.addFrameAt, [index]);
    this.piskelController.addFrameAt(index);
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.removeFrameAt = function (index) {
    this.raiseSaveStateEvent_(this.piskelController.removeFrameAt, [index]);
    this.piskelController.removeFrameAt(index);
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.duplicateCurrentFrame = function () {
    this.duplicateFrameAt(this.getCurrentFrameIndex());
  };

  ns.PublicPiskelController.prototype.replay = function (frame, replayData) {
    replayData.fn.apply(this.piskelController, replayData.args);
  };

  ns.PublicPiskelController.prototype.duplicateFrameAt = function (index) {
    this.raiseSaveStateEvent_(this.piskelController.duplicateFrameAt, [index]);
    this.piskelController.duplicateFrameAt(index);
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.moveFrame = function (fromIndex, toIndex) {
    this.raiseSaveStateEvent_(this.piskelController.moveFrame, [fromIndex, toIndex]);
    this.piskelController.moveFrame(fromIndex, toIndex);
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.setCurrentFrameIndex = function (index) {
    this.piskelController.setCurrentFrameIndex(index);
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.selectNextFrame = function () {
    this.piskelController.selectNextFrame();
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.selectPreviousFrame = function () {
    this.piskelController.selectPreviousFrame();
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.setCurrentLayerIndex = function (index) {
    this.piskelController.setCurrentLayerIndex(index);
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.selectLayer = function (layer) {
    this.piskelController.selectLayer(layer);
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.renameLayerAt = function (index, name) {
    this.raiseSaveStateEvent_(this.piskelController.renameLayerAt, [index, name]);
    this.piskelController.renameLayerAt(index, name);
  };

  ns.PublicPiskelController.prototype.createLayer = function (name) {
    this.raiseSaveStateEvent_(this.piskelController.createLayer, [name]);
    this.piskelController.createLayer(name);
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.mergeDownLayerAt = function (index) {
    this.raiseSaveStateEvent_(this.piskelController.mergeDownLayerAt, [index]);
    this.piskelController.mergeDownLayerAt(index);
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.moveLayerUp = function () {
    this.raiseSaveStateEvent_(this.piskelController.moveLayerUp, []);
    this.piskelController.moveLayerUp();
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.moveLayerDown = function () {
    this.raiseSaveStateEvent_(this.piskelController.moveLayerDown, []);
    this.piskelController.moveLayerDown();
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.removeCurrentLayer = function () {
    var currentLayerIndex = this.getCurrentLayerIndex();
    this.raiseSaveStateEvent_(this.piskelController.removeLayerAt, [currentLayerIndex]);
    this.piskelController.removeLayerAt(currentLayerIndex);
    $.publish(Events.PISKEL_RESET);
  };

  ns.PublicPiskelController.prototype.getCurrentLayerIndex = function () {
    return this.piskelController.getCurrentLayerIndex();
  };

  ns.PublicPiskelController.prototype.getCurrentFrameIndex = function () {
    return this.piskelController.currentFrameIndex;
  };

  ns.PublicPiskelController.prototype.getPiskel = function () {
    return this.piskelController.piskel;
  };

  ns.PublicPiskelController.prototype.raiseSaveStateEvent_ = function (fn, args) {
    $.publish(Events.PISKEL_SAVE_STATE, {
      type : pskl.service.HistoryService.REPLAY_NO_SNAPSHOT,
      scope : this,
      replay : {
        fn : fn,
        args : args
      }
    });
  };

})();;(function () {
  var ns = $.namespace('pskl.controller');

  ns.CursorCoordinatesController = function (piskelController) {
    this.piskelController = piskelController;
    this.origin = null;
    this.coordinates = {x:-1,y:-1};

  };

  ns.CursorCoordinatesController.prototype.init = function () {
    this.coordinatesContainer = document.querySelector('.cursor-coordinates');

    $.subscribe(Events.CURSOR_MOVED, this.onCursorMoved_.bind(this));
    $.subscribe(Events.DRAG_START, this.onDragStart_.bind(this));
    $.subscribe(Events.DRAG_END, this.onDragEnd_.bind(this));
    $.subscribe(Events.FRAME_SIZE_CHANGED, this.redraw.bind(this));

    this.redraw();
  };

  ns.CursorCoordinatesController.prototype.redraw = function () {
    var html = '';
    if (this.origin) {
      html += this.origin.x + ':' + this.origin.y + ' to ';
    }

    var x = this.coordinates.x;
    var y = this.coordinates.y;
    //console.log(this.origin, this.coordinates);
    var currentFrame = this.piskelController.getCurrentFrame();
    if (currentFrame.containsPixel(x, y)) {
      html += x + ':' + y;
      if (this.origin) {
        var dX = Math.abs(x-this.origin.x) + 1;
        var dY = Math.abs(y-this.origin.y) + 1;
        html += ' (' + dX + 'x' + dY +')';
      }
      _drawCursor(x,y);
    } else {
      _hideCursor();
    }

    this.coordinatesContainer.innerHTML = this.getFrameSizeHTML_() + html;
  };

  ns.CursorCoordinatesController.prototype.getFrameSizeHTML_ = function () {
    var w = this.piskelController.getWidth();
    var h = this.piskelController.getHeight();
    return '['+w+'x'+h+'] ';
  };

  ns.CursorCoordinatesController.prototype.onCursorMoved_ = function (event, x, y) {
    this.coordinates = {x:x, y:y};
    this.redraw();
  };

  ns.CursorCoordinatesController.prototype.onDragStart_ = function (event, x, y) {
    this.origin = {x:x, y:y};
    this.redraw();
  };

  ns.CursorCoordinatesController.prototype.onDragEnd_ = function (event, x, y) {
    this.origin = null;
    this.redraw();
  };

})();;(function () {

  var ns = $.namespace("pskl.controller");

  ns.DrawingController = function (piskelController, paletteController, container) {
    /**
     * @public
     */
    this.piskelController = piskelController;

    this.paletteController = paletteController;

    this.dragHandler = new ns.drawing.DragHandler(this);

    /**
     * @public
     */
    this.overlayFrame = pskl.model.Frame.createEmptyFromFrame(piskelController.getCurrentFrame());

    /**
     * @private
     */
    this.container = container;

    var renderingOptions = {
      "zoom": this.calculateZoom_(),
      "supportGridRendering" : true,
      "height" : this.getContainerHeight_(),
      "width" : this.getContainerWidth_(),
      "xOffset" : 0,
      "yOffset" : 0
    };

    this.overlayRenderer = new pskl.rendering.frame.CachedFrameRenderer(this.container, renderingOptions, ["canvas-overlay"]);
    this.renderer = new pskl.rendering.frame.CachedFrameRenderer(this.container, renderingOptions, ["drawing-canvas"]);
    this.onionSkinRenderer = pskl.rendering.OnionSkinRenderer.createInContainer(this.container, renderingOptions, piskelController);
    this.layersRenderer = new pskl.rendering.layer.LayersRenderer(this.container, renderingOptions, piskelController);

    this.compositeRenderer = new pskl.rendering.CompositeRenderer();
    this.compositeRenderer
      .add(this.overlayRenderer)
      .add(this.renderer)
      .add(this.layersRenderer)
      .add(this.onionSkinRenderer);

    // State of drawing controller:
    this.isClicked = false;
    this.previousMousemoveTime = 0;
    this.currentToolBehavior = null;

    // State of clicked button (need to be stateful here, see comment in getCurrentColor_)
    this.currentMouseButton_ = Constants.LEFT_BUTTON;
  };

  ns.DrawingController.prototype.init = function () {
    this.initMouseBehavior();

    $.subscribe(Events.TOOL_SELECTED, $.proxy(function(evt, toolBehavior) {
      this.currentToolBehavior = toolBehavior;
      this.overlayFrame.clear();
    }, this));

    $(window).resize($.proxy(this.startResizeTimer_, this));

    $.subscribe(Events.USER_SETTINGS_CHANGED, $.proxy(this.onUserSettingsChange_, this));
    $.subscribe(Events.FRAME_SIZE_CHANGED, $.proxy(this.onFrameSizeChanged_, this));

    pskl.app.shortcutService.addShortcut('0', this.resetZoom_.bind(this));
    pskl.app.shortcutService.addShortcut('+', this.increaseZoom_.bind(this, 1));
    pskl.app.shortcutService.addShortcut('-', this.decreaseZoom_.bind(this, 1));

    window.setTimeout(function () {
      this.afterWindowResize_();
      this.resetZoom_();
    }.bind(this), 100);
  };

  ns.DrawingController.prototype.initMouseBehavior = function() {
    var body = $('body');
    this.container.mousedown($.proxy(this.onMousedown_, this));

    if (pskl.utils.UserAgent.isChrome || pskl.utils.UserAgent.isIE11) {
      this.container.on('mousewheel', $.proxy(this.onMousewheel_, this));
    } else {
      this.container.on('wheel', $.proxy(this.onMousewheel_, this));
    }

    window.addEventListener('mouseup', this.onMouseup_.bind(this));
    window.addEventListener('mousemove', this.onMousemove_.bind(this));
    window.addEventListener('keyup', this.onKeyup_.bind(this));

    // Deactivate right click:
    body.contextmenu(this.onCanvasContextMenu_);

  };

  ns.DrawingController.prototype.startResizeTimer_ = function () {
    if (this.resizeTimer) {
      window.clearInterval(this.resizeTimer);
    }
    this.resizeTimer = window.setTimeout($.proxy(this.afterWindowResize_, this), 200);
  };

  ns.DrawingController.prototype.afterWindowResize_ = function () {
    var initialWidth = this.compositeRenderer.getDisplaySize().width;

    this.compositeRenderer.setDisplaySize(this.getContainerWidth_(), this.getContainerHeight_());
    var ratio = this.compositeRenderer.getDisplaySize().width / initialWidth;
    var newZoom = ratio * this.compositeRenderer.getZoom();
    this.compositeRenderer.setZoom(newZoom);

    $.publish(Events.ZOOM_CHANGED);
  };

  /**
   * @private
   */
  ns.DrawingController.prototype.onUserSettingsChange_ = function (evt, settingsName, settingsValue) {
    if(settingsName == pskl.UserSettings.SHOW_GRID) {
      console.warn('DrawingController:onUserSettingsChange_ not implemented !');
    } else if (settingsName == pskl.UserSettings.ONION_SKIN || settingsName == pskl.UserSettings.LAYER_PREVIEW) {
      this.onionSkinRenderer.clear();
      this.onionSkinRenderer.flush();
      this.layersRenderer.clear();
      this.layersRenderer.flush();
      this.render();
    }
  };

  ns.DrawingController.prototype.onFrameSizeChanged_ = function () {
    this.compositeRenderer.setDisplaySize(this.getContainerWidth_(), this.getContainerHeight_());
    this.compositeRenderer.setZoom(this.calculateZoom_());
    this.compositeRenderer.setOffset(0, 0);
    $.publish(Events.ZOOM_CHANGED);
  };

  /**
   * @private
   */
  ns.DrawingController.prototype.onMousedown_ = function (event) {
    $.publish(Events.MOUSE_EVENT, [event, this]);
    var frame = this.piskelController.getCurrentFrame();
    var coords = this.getSpriteCoordinates(event.clientX, event.clientY);

    this.isClicked = true;
    this.setCurrentButton(event);

    if (event.button === Constants.MIDDLE_BUTTON) {
      this.dragHandler.startDrag(event.clientX, event.clientY);
    } else {
      this.currentToolBehavior.hideHighlightedPixel(this.overlayFrame);
      $.publish(Events.TOOL_PRESSED);
      this.currentToolBehavior.applyToolAt(
        coords.x,
        coords.y,
        this.getCurrentColor_(),
        frame,
        this.overlayFrame,
        event
      );
    }
  };

  /**
   * @private
   */
  ns.DrawingController.prototype.onMousemove_ = function (event) {
    this._clientX = event.clientX;
    this._clientY = event.clientY;

    var currentTime = new Date().getTime();
    // Throttling of the mousemove event:

    if ((currentTime - this.previousMousemoveTime) > Constants.MOUSEMOVE_THROTTLING ) {
      this.moveTool_(this._clientX, this._clientY, event);
      this.previousMousemoveTime = currentTime;
    }
  };

  /**
   * @private
   */
  ns.DrawingController.prototype.onKeyup_ = function (event) {
    this.moveTool_(this._clientX, this._clientY, event);
  };

  ns.DrawingController.prototype.moveTool_ = function (x, y, event) {
    var coords = this.getSpriteCoordinates(x, y);
    var currentFrame = this.piskelController.getCurrentFrame();

    if (this.isClicked) {
      if(this.currentMouseButton_ == Constants.MIDDLE_BUTTON) {
        this.dragHandler.updateDrag(x, y);
      } else {
        $.publish(Events.MOUSE_EVENT, [event, this]);
        // Warning : do not call setCurrentButton here
        // mousemove do not have the correct mouse button information on all browsers
        this.currentToolBehavior.moveToolAt(
          coords.x | 0,
          coords.y | 0,
          this.getCurrentColor_(),
          currentFrame,
          this.overlayFrame,
          event
        );
      }
    } else {
      this.currentToolBehavior.moveUnactiveToolAt(
        coords.x,
        coords.y,
        this.getCurrentColor_(),
        currentFrame,
        this.overlayFrame,
        event
      );
    }
    $.publish(Events.CURSOR_MOVED, [coords.x, coords.y]);
  };

  ns.DrawingController.prototype.onMousewheel_ = function (jQueryEvent) {
    var event = jQueryEvent.originalEvent;
    // Ratio between wheelDeltaY (mousewheel event) and deltaY (wheel event) is -40
    var delta;
    if (pskl.utils.UserAgent.isChrome) {
      delta = event.wheelDeltaY;
    } else if (pskl.utils.UserAgent.isIE11) {
      delta = event.wheelDelta;
    } else if (pskl.utils.UserAgent.isFirefox) {
      delta = -40 * event.deltaY;
    }
    var modifier = Math.abs(delta/120);
    if (delta > 0) {
      this.increaseZoom_(modifier);
    } else if (delta < 0) {
      this.decreaseZoom_(modifier);
    }
  };

  ns.DrawingController.prototype.increaseZoom_ = function (zoomMultiplier) {
    var step = (zoomMultiplier || 1) * this.getZoomStep_();
    this.setZoom_(this.renderer.getZoom() + step);
  };

  ns.DrawingController.prototype.decreaseZoom_ = function (zoomMultiplier) {
    var step = (zoomMultiplier || 1) * this.getZoomStep_();
    this.setZoom_(this.renderer.getZoom() - step);
  };

  /**
   * @private
   */
  ns.DrawingController.prototype.onMouseup_ = function (event) {
    var frame = this.piskelController.getCurrentFrame();
    var coords = this.getSpriteCoordinates(event.clientX, event.clientY);
    if(this.isClicked) {
      $.publish(Events.MOUSE_EVENT, [event, this]);
      // A mouse button was clicked on the drawing canvas before this mouseup event,
      // the user was probably drawing on the canvas.
      // Note: The mousemove movement (and the mouseup) may end up outside
      // of the drawing canvas.

      this.isClicked = false;
      this.setCurrentButton(event);

      if (event.button === Constants.MIDDLE_BUTTON) {
        if (this.dragHandler.isDragging()) {
          this.dragHandler.stopDrag();
        } else if (frame.containsPixel(coords.x, coords.y)) {
          $.publish(Events.SELECT_PRIMARY_COLOR, [frame.getPixel(coords.x, coords.y)]);
        }
      } else {
        this.currentToolBehavior.releaseToolAt(
          coords.x,
          coords.y,
          this.getCurrentColor_(),
          this.piskelController.getCurrentFrame(),
          this.overlayFrame,
          event
        );

        $.publish(Events.TOOL_RELEASED);
      }
    }
  };

  /**
   * Translate absolute x,y screen coordinates into sprite coordinates
   * @param  {Number} screenX
   * @param  {Number} screenY
   * @return {Object} {x:Number, y:Number}
   */
  ns.DrawingController.prototype.getSpriteCoordinates = function(screenX, screenY) {
    return this.renderer.getCoordinates(screenX, screenY);
  };

  ns.DrawingController.prototype.getScreenCoordinates = function(spriteX, spriteY) {
    return this.renderer.reverseCoordinates(spriteX, spriteY);
  };

  ns.DrawingController.prototype.setCurrentButton = function (event) {
    this.currentMouseButton_ = event.button;
  };

  /**
   * @private
   */
  ns.DrawingController.prototype.getCurrentColor_ = function () {
    // WARNING : Do not rely on the current event to get the current color!
    // It might seem like a good idea, and works perfectly fine on Chrome
    // Sadly Firefox and IE found clever, for some reason, to set event.button to 0
    // on a mouse move event
    // This always matches a LEFT mouse button which is __really__ not helpful

    if(this.currentMouseButton_ == Constants.RIGHT_BUTTON) {
      return this.paletteController.getSecondaryColor();
    } else if(this.currentMouseButton_ == Constants.LEFT_BUTTON) {
      return this.paletteController.getPrimaryColor();
    } else {
      return Constants.DEFAULT_PEN_COLOR;
    }
  };

  /**
   * @private
   */
  ns.DrawingController.prototype.onCanvasContextMenu_ = function (event) {
    if ($(event.target).closest('#drawing-canvas-container').length) {
      // Deactivate right click on drawing canvas only.
      event.preventDefault();
      event.stopPropagation();
      event.cancelBubble = true;
      return false;
    }
  };

  ns.DrawingController.prototype.render = function () {
    var currentFrame = this.piskelController.getCurrentFrame();
    if (!currentFrame.isSameSize(this.overlayFrame)) {
      this.overlayFrame = pskl.model.Frame.createEmptyFromFrame(currentFrame);
    }

    if (pskl.UserSettings.get(pskl.UserSettings.ONION_SKIN)) {
      this.onionSkinRenderer.render();
    }

    if (pskl.UserSettings.get(pskl.UserSettings.LAYER_PREVIEW)) {
      this.layersRenderer.render();
    }

    this.renderer.render(currentFrame);
    this.overlayRenderer.render(this.overlayFrame);
  };

  /**
   * @private
   */
  ns.DrawingController.prototype.calculateZoom_ = function() {
    var frameHeight = this.piskelController.getCurrentFrame().getHeight(),
        frameWidth = this.piskelController.getCurrentFrame().getWidth();

    return Math.min(this.getAvailableWidth_()/frameWidth, this.getAvailableHeight_()/frameHeight);
  };

  ns.DrawingController.prototype.getAvailableHeight_ = function () {
    return $('#section_drawing').height();
  };

  ns.DrawingController.prototype.getAvailableWidth_ = function () {
    return $('#section_drawing').width();
  };

  ns.DrawingController.prototype.getContainerHeight_ = function () {
    return this.getAvailableHeight_();
  };

  ns.DrawingController.prototype.getContainerWidth_ = function () {
    return this.getAvailableWidth_();
  };

  /**
   * @private
   */

  ns.DrawingController.prototype.getRenderer = function () {
    return this.compositeRenderer;
  };

  ns.DrawingController.prototype.getOffset = function () {
    return this.compositeRenderer.getOffset();
  };

  ns.DrawingController.prototype.setOffset = function (x, y) {
    this.compositeRenderer.setOffset(x, y);
    $.publish(Events.ZOOM_CHANGED);
  };

  ns.DrawingController.prototype.resetZoom_ = function () {
    this.setZoom_(this.calculateZoom_());
  };

  ns.DrawingController.prototype.getZoomStep_ = function () {
    return this.calculateZoom_() / 10;
  };

  ns.DrawingController.prototype.setZoom_ = function (zoom) {
    this.compositeRenderer.setZoom(zoom);
    $.publish(Events.ZOOM_CHANGED);
  };

})();;(function () {
  var ns = $.namespace('pskl.controller.drawing');

  /**
   * Multiplier applied between the mouse movement and viewport movement
   * @type {Number}
   */
  var MULTIPLIER = 2;

  /**
   * Dedicated handler to drag the drawing canvas using the mouse
   * Will store the initial coordinates as well as the status of the drag
   * @param {DrawingController} drawingController
   */
  ns.DragHandler = function (drawingController) {
    this.drawingController = drawingController;

    this.isDragging_ = false;
    this.updateOrigin_(-1, -1);
  };

  /**
   * Initialize a drag session.
   * @param {Number} x : x coordinate of the mouse event that initiated the drag
   * @param {Number} y : y coordinate of the mouse event that initiated the drag
   */
  ns.DragHandler.prototype.startDrag = function (x, y) {
    var coords = this.drawingController.getSpriteCoordinates(x, y);
    this.updateOrigin_(coords.x, coords.y);
  };

  /**
   * Update the drag status
   * @param {Number} x : x coordinate of the mouse event that triggered the update
   * @param {Number} y : y coordinate of the mouse event that triggered the update
   */
  ns.DragHandler.prototype.updateDrag = function (x, y) {
    var currentOffset = this.drawingController.getOffset();
    var offset = this.calculateOffset_(x, y);
    if (currentOffset.y !== offset.y || currentOffset.x !== offset.x) {
      this.isDragging_ = true;
      this.drawingController.setOffset(offset.x, offset.y);

      // retrieve the updated coordinates after moving the sprite
      // and store them as the new drag origin
      var coords = this.drawingController.getSpriteCoordinates(x, y);
      this.updateOrigin_(coords.x, coords.y);
    }
  };

  /**
   * Stop the drag session
   */
  ns.DragHandler.prototype.stopDrag = function () {
    this.isDragging_ = false;
    this.origin = null;
  };

  /**
   * Will return true if the drag handler effectively MOVED the offset
   * during the current drag session
   */
  ns.DragHandler.prototype.isDragging = function () {
    return this.isDragging_;
  };

  ns.DragHandler.prototype.calculateOffset_ = function (x, y) {
    var coords = this.drawingController.getSpriteCoordinates(x, y);
    var currentOffset = this.drawingController.getOffset();

    var offset = {
      x : currentOffset.x - MULTIPLIER * (coords.x - this.origin.x),
      y : currentOffset.y - MULTIPLIER * (coords.y - this.origin.y)
    };

    return offset;
  };

  ns.DragHandler.prototype.updateOrigin_ = function (x, y) {
    this.origin = this.origin || {};
    this.origin.x = x;
    this.origin.y = y;
  };
})();;(function () {
  var ns = $.namespace("pskl.controller");

  var ACTION = {
    SELECT : 'select',
    CLONE : 'clone',
    DELETE : 'delete',
    NEW_FRAME : 'newframe'
  };

  ns.PreviewFilmController = function (piskelController, container) {

    this.piskelController = piskelController;
    this.container = container;
    this.refreshZoom_();

    this.redrawFlag = true;

    this.cachedFrameProcessor = new pskl.model.frame.CachedFrameProcessor();
    this.cachedFrameProcessor.setFrameProcessor(this.frameToPreviewCanvas_.bind(this));
    this.cachedFrameProcessor.setOutputCloner(this.clonePreviewCanvas_.bind(this));
  };

  ns.PreviewFilmController.prototype.init = function() {
    $.subscribe(Events.TOOL_RELEASED, this.flagForRedraw_.bind(this));
    $.subscribe(Events.PISKEL_RESET, this.flagForRedraw_.bind(this));
    $.subscribe(Events.USER_SETTINGS_CHANGED, this.flagForRedraw_.bind(this));

    $.subscribe(Events.PISKEL_RESET, this.refreshZoom_.bind(this));

    //$('#preview-list-scroller').scroll(this.updateScrollerOverflows.bind(this));
    this.container.get(0).addEventListener('click', this.onContainerClick_.bind(this));
    //this.updateScrollerOverflows();
  };

  ns.PreviewFilmController.prototype.flagForRedraw_ = function () {
    this.redrawFlag = true;
  };

  ns.PreviewFilmController.prototype.refreshZoom_ = function () {
    this.zoom = this.calculateZoom_();
  };

  ns.PreviewFilmController.prototype.render = function () {
    if (this.redrawFlag) {
      this.createPreviews_();
      this.redrawFlag = false;
    }
  };

  ns.PreviewFilmController.prototype.updateScrollerOverflows = function () {
    /*var scroller = $('#preview-list-scroller');
    var scrollerHeight = scroller.height();
    var scrollTop = scroller.scrollTop();
    var scrollerContentHeight = $('#preview-list').height();
    var treshold = $('.top-overflow').height();
    var overflowTop = false,
      overflowBottom = false;
    if (scrollerHeight < scrollerContentHeight) {
      if (scrollTop > treshold) {
        overflowTop = true;
      }
      var scrollBottom = (scrollerContentHeight - scrollTop) - scrollerHeight;
      if (scrollBottom > treshold) {
        overflowBottom = true;
      }
    }
    var wrapper = $('#preview-list-wrapper');
    wrapper.toggleClass('top-overflow-visible', overflowTop);
    wrapper.toggleClass('bottom-overflow-visible', overflowBottom);*/
  };

  ns.PreviewFilmController.prototype.onContainerClick_ = function (event) {
    var target = pskl.utils.Dom.getParentWithData(event.target, 'tileAction');
    if (!target) {
      return;
    }
    var action = target.dataset.tileAction;
    var index = parseInt(target.dataset.tileNumber, 10);

    if (action === ACTION.CLONE) {
      this.piskelController.duplicateFrameAt(index);
      //this.updateScrollerOverflows();
    } else if (action === ACTION.DELETE) {
      this.piskelController.removeFrameAt(index);
      //this.updateScrollerOverflows();
    } else if (action === ACTION.SELECT) {
      this.piskelController.setCurrentFrameIndex(index);
    } else if (action === ACTION.NEW_FRAME) {
      this.piskelController.addFrame();
      //this.updateScrollerOverflows();
    }
  };

  ns.PreviewFilmController.prototype.createPreviews_ = function () {

    this.container.html("");
    // Manually remove tooltips since mouseout events were shortcut by the DOM refresh:
    $(".tooltip").remove();

    var frameCount = this.piskelController.getFrameCount();

    for (var i = 0, l = frameCount; i < l ; i++) {
      this.container.append(this.createPreviewTile_(i));
    }
    // Append 'new empty frame' button
    var newFrameButton = document.createElement("div");
    newFrameButton.id = "add-frame-action";
    newFrameButton.className = "add-frame-action";
    newFrameButton.setAttribute('data-tile-action', ACTION.NEW_FRAME);
    newFrameButton.innerHTML = "<p class='label'>Add new frame</p>";
    this.container.append(newFrameButton);

    var needDragndropBehavior = (frameCount > 1);
    if(needDragndropBehavior) {
      this.initDragndropBehavior_();
    }
    //this.updateScrollerOverflows();
  };


  /**
   * @private
   */
  ns.PreviewFilmController.prototype.initDragndropBehavior_ = function () {

    $("#preview-list").sortable({
      placeholder: "preview-tile-drop-proxy",
      update: $.proxy(this.onUpdate_, this),
      items: ".preview-tile"
    });
    $("#preview-list").disableSelection();
  };

  /**
   * @private
   */
  ns.PreviewFilmController.prototype.onUpdate_ = function( event, ui ) {
    var originFrameId = parseInt(ui.item.data("tile-number"), 10);
    var targetInsertionId = $('.preview-tile').index(ui.item);

    this.piskelController.moveFrame(originFrameId, targetInsertionId);
    this.piskelController.setCurrentFrameIndex(targetInsertionId);
  };


  /**
   * @private
   * TODO(vincz): clean this giant rendering function & remove listeners.
   */
  ns.PreviewFilmController.prototype.createPreviewTile_ = function(tileNumber) {
    var currentFrame = this.piskelController.getCurrentLayer().getFrameAt(tileNumber);

    var previewTileRoot = document.createElement("div");
    previewTileRoot.setAttribute("data-tile-number", tileNumber);
    previewTileRoot.setAttribute('data-tile-action', ACTION.SELECT);
    previewTileRoot.classList.add("preview-tile");
    if (this.piskelController.getCurrentFrame() == currentFrame) {
      previewTileRoot.classList.add("selected");
    }

    var canvasContainer = document.createElement("div");
    canvasContainer.classList.add("canvas-container", pskl.UserSettings.get(pskl.UserSettings.CANVAS_BACKGROUND));

    var height = this.zoom * this.piskelController.getCurrentFrame().getHeight();
    var horizontalMargin = (Constants.PREVIEW_FILM_SIZE - height) / 2;
    canvasContainer.style.marginTop = horizontalMargin + 'px';

    var width = this.zoom * this.piskelController.getCurrentFrame().getWidth();
    var verticalMargin = (Constants.PREVIEW_FILM_SIZE - width) / 2;
    canvasContainer.style.marginLeft = verticalMargin + 'px';
    canvasContainer.style.marginRight = verticalMargin + 'px';


    var canvasBackground = document.createElement("div");
    canvasBackground.className = "canvas-background";
    canvasContainer.appendChild(canvasBackground);

    var cloneFrameButton = document.createElement("button");
    cloneFrameButton.setAttribute('rel', 'tooltip');
    cloneFrameButton.setAttribute('data-placement', 'right');
    cloneFrameButton.setAttribute('data-tile-number', tileNumber);
    cloneFrameButton.setAttribute('data-tile-action', ACTION.CLONE);
    cloneFrameButton.setAttribute('title', 'Duplicate this frame');
    cloneFrameButton.className = "tile-overlay duplicate-frame-action";
    previewTileRoot.appendChild(cloneFrameButton);


    canvasContainer.appendChild(this.getCanvasForFrame(currentFrame));
    previewTileRoot.appendChild(canvasContainer);

    if(tileNumber > 0 || this.piskelController.getFrameCount() > 1) {
      // Add 'remove frame' button.
      var deleteButton = document.createElement("button");
      deleteButton.setAttribute('rel', 'tooltip');
      deleteButton.setAttribute('data-placement', 'right');
      deleteButton.setAttribute('title', 'Delete this frame');
      deleteButton.setAttribute('data-tile-number', tileNumber);
      deleteButton.setAttribute('data-tile-action', ACTION.DELETE);
      deleteButton.className = "tile-overlay delete-frame-action";
      previewTileRoot.appendChild(deleteButton);

      // Add 'dragndrop handle'.
      var dndHandle = document.createElement("div");
      dndHandle.className = "tile-overlay dnd-action";
      previewTileRoot.appendChild(dndHandle);
    }
    var tileCount = document.createElement("div");
    tileCount.className = "tile-overlay tile-count";
    tileCount.innerHTML = tileNumber + 1;
    previewTileRoot.appendChild(tileCount);

    return previewTileRoot;
  };

  ns.PreviewFilmController.prototype.getCanvasForFrame = function (frame) {
    var canvas = this.cachedFrameProcessor.get(frame, this.zoom);
    return canvas;
  };

  ns.PreviewFilmController.prototype.frameToPreviewCanvas_ = function (frame) {
    var canvasRenderer = new pskl.rendering.CanvasRenderer(frame, this.zoom);
    canvasRenderer.drawTransparentAs(Constants.TRANSPARENT_COLOR);
    var canvas = canvasRenderer.render();
    canvas.classList.add('tile-view', 'canvas');
    return canvas;
  };

  ns.PreviewFilmController.prototype.clonePreviewCanvas_ = function (canvas) {
    var clone = pskl.utils.CanvasUtils.clone(canvas);
    clone.classList.add('tile-view', 'canvas');
    return clone;
  };

  /**
   * Calculate the preview zoom depending on the piskel size
   */
  ns.PreviewFilmController.prototype.calculateZoom_ = function () {
    var frame = this.piskelController.getCurrentFrame();
    var frameSize = Math.max(frame.getHeight(), frame.getWidth());

    return Constants.PREVIEW_FILM_SIZE/frameSize;
  };
})();;(function () {
  var ns = $.namespace('pskl.controller');

  ns.LayersListController = function (piskelController) {
    this.piskelController = piskelController;
  };

  ns.LayersListController.prototype.init = function () {
    this.layerItemTemplate_ = pskl.utils.Template.get('layer-item-template');
    this.rootEl = document.querySelector('.layers-list-container');
    this.layersListEl = document.querySelector('.layers-list');
    this.toggleLayerPreviewEl = document.querySelector('.layers-toggle-preview');

    this.rootEl.addEventListener('click', this.onClick_.bind(this));
    this.toggleLayerPreviewEl.addEventListener('click', this.toggleLayerPreview_.bind(this));

    $.subscribe(Events.PISKEL_RESET, this.renderLayerList_.bind(this));

    pskl.app.shortcutService.addShortcut('alt+L', this.toggleLayerPreview_.bind(this));

    this.renderLayerList_();
    this.updateToggleLayerPreview_();

    $.subscribe(Events.USER_SETTINGS_CHANGED, $.proxy(this.onUserSettingsChange_, this));
  };

  ns.LayersListController.prototype.renderLayerList_ = function () {
    this.layersListEl.innerHTML = '';
    var layers = this.piskelController.getLayers();
    layers.forEach(this.addLayerItem.bind(this));
    this.updateButtonStatus_();
  };

  ns.LayersListController.prototype.updateButtonStatus_ = function () {
    var layers = this.piskelController.getLayers();
    var currentLayer = this.piskelController.getCurrentLayer();
    var index = this.piskelController.getCurrentLayerIndex();

    var isLast = index === 0;
    var isOnly = layers.length === 1;
    var isFirst = index === layers.length - 1;

    this.toggleButtonDisabledState_('up', isFirst);
    this.toggleButtonDisabledState_('down', isLast);
    this.toggleButtonDisabledState_('merge', isLast);
    this.toggleButtonDisabledState_('delete', isOnly);
  };

  ns.LayersListController.prototype.toggleButtonDisabledState_ = function (buttonAction, isDisabled) {
    var button = document.querySelector('.layers-button[data-action="'+buttonAction+'"]');
    if (isDisabled) {
      button.setAttribute('disabled', 'disabled');
    } else {
      button.removeAttribute('disabled');
    }
  };

  ns.LayersListController.prototype.updateToggleLayerPreview_ = function () {
    var enabledClassname = 'layers-toggle-preview-enabled';
    if (pskl.UserSettings.get(pskl.UserSettings.LAYER_PREVIEW)) {
      this.toggleLayerPreviewEl.classList.add(enabledClassname);
    } else {
      this.toggleLayerPreviewEl.classList.remove(enabledClassname);
    }
  };

  ns.LayersListController.prototype.onUserSettingsChange_ = function (evt, name, value) {
    if (name == pskl.UserSettings.LAYER_PREVIEW) {
      this.updateToggleLayerPreview_();
    }
  };

  ns.LayersListController.prototype.addLayerItem = function (layer, index) {
    var isSelected = this.piskelController.getCurrentLayer() === layer;
    var layerItemHtml = pskl.utils.Template.replace(this.layerItemTemplate_, {
      'layername' : layer.getName(),
      'layerindex' : index,
      'isselected:current-layer-item' : isSelected
    });
    var layerItem = pskl.utils.Template.createFromHTML(layerItemHtml);
    this.layersListEl.insertBefore(layerItem, this.layersListEl.firstChild);
  };

  ns.LayersListController.prototype.onClick_ = function (evt) {
    var el = evt.target || evt.srcElement;
    var index;
    if (el.classList.contains('button')) {
      this.onButtonClick_(el);
    } else if (el.classList.contains('layer-item')) {
      index = el.dataset.layerIndex;
      this.piskelController.setCurrentLayerIndex(parseInt(index, 10));
    }
  };

  ns.LayersListController.prototype.renameCurrentLayer_ = function () {
    var layer = this.piskelController.getCurrentLayer();
    var name = window.prompt("Please enter the layer name", layer.getName());
    if (name) {
      var index = this.piskelController.getCurrentLayerIndex();
      this.piskelController.renameLayerAt(index, name);
      this.renderLayerList_();
    }
  };

  ns.LayersListController.prototype.mergeDownCurrentLayer_ = function () {
    var index = this.piskelController.getCurrentLayerIndex();
    this.piskelController.mergeDownLayerAt(index);
    this.renderLayerList_();
  };

  ns.LayersListController.prototype.onButtonClick_ = function (button) {
    var action = button.getAttribute('data-action');
    if (action == 'up') {
      this.piskelController.moveLayerUp();
    } else if (action == 'down') {
      this.piskelController.moveLayerDown();
    } else if (action == 'add') {
      this.piskelController.createLayer();
    } else if (action == 'delete') {
      this.piskelController.removeCurrentLayer();
    } else if (action == 'merge') {
      this.mergeDownCurrentLayer_();
    } else if (action == 'edit') {
      this.renameCurrentLayer_();
    }
  };

  ns.LayersListController.prototype.toggleLayerPreview_ = function () {
    var currentValue = pskl.UserSettings.get(pskl.UserSettings.LAYER_PREVIEW);
    pskl.UserSettings.set(pskl.UserSettings.LAYER_PREVIEW, !currentValue);
  };
})();;(function () {
  var ns = $.namespace('pskl.controller');

  // Preview is a square of PREVIEW_SIZE x PREVIEW_SIZE
  var PREVIEW_SIZE = 200;

  ns.AnimatedPreviewController = function (piskelController, container) {
    this.piskelController = piskelController;
    this.container = container;

    this.elapsedTime = 0;
    this.currentIndex = 0;

    this.renderFlag = true;

    this.fpsRangeInput = $('#preview-fps');
    this.fpsCounterDisplay = $('#display-fps');

    this.setFPS(Constants.DEFAULT.FPS);

    var frame = this.piskelController.getCurrentFrame();

    this.renderer = new pskl.rendering.frame.TiledFrameRenderer(this.container);
  };

  ns.AnimatedPreviewController.prototype.init = function () {
    // the oninput event won't work on IE10 unfortunately, but at least will provide a
    // consistent behavior across all other browsers that support the input type range
    // see https://bugzilla.mozilla.org/show_bug.cgi?id=853670
    this.fpsRangeInput.on('input change', this.onFPSSliderChange.bind(this));

    this.toggleOnionSkinEl = document.querySelector('.preview-toggle-onion-skin');
    this.toggleOnionSkinEl.addEventListener('click', this.toggleOnionSkin_.bind(this));

    pskl.app.shortcutService.addShortcut('alt+O', this.toggleOnionSkin_.bind(this));

    $.subscribe(Events.FRAME_SIZE_CHANGED, this.onFrameSizeChange_.bind(this));
    $.subscribe(Events.USER_SETTINGS_CHANGED, $.proxy(this.onUserSettingsChange_, this));

    $.subscribe(Events.TOOL_RELEASED, this.setRenderFlag_.bind(this, true));
    $.subscribe(Events.TOOL_PRESSED, this.setRenderFlag_.bind(this, false));

    this.updateZoom_();
    this.updateOnionSkinPreview_();
    this.updateContainerDimensions_();
  };

  ns.AnimatedPreviewController.prototype.onUserSettingsChange_ = function (evt, name, value) {
    if (name == pskl.UserSettings.ONION_SKIN) {
      this.updateOnionSkinPreview_();
    } else {
      this.updateZoom_();
      this.updateContainerDimensions_();
    }
  };

  ns.AnimatedPreviewController.prototype.updateOnionSkinPreview_ = function () {
    var enabledClassname = 'pressed';
    if (pskl.UserSettings.get(pskl.UserSettings.ONION_SKIN)) {
      this.toggleOnionSkinEl.classList.add(enabledClassname);
    } else {
      this.toggleOnionSkinEl.classList.remove(enabledClassname);
    }
  };

  ns.AnimatedPreviewController.prototype.updateZoom_ = function () {
    var isTiled = pskl.UserSettings.get(pskl.UserSettings.TILED_PREVIEW);
    var zoom = isTiled ? 1 : this.calculateZoom_();
    this.renderer.setZoom(zoom);
  };

  ns.AnimatedPreviewController.prototype.getZoom = function () {
    return this.calculateZoom_();
  };

  ns.AnimatedPreviewController.prototype.getCoordinates = function(x, y) {
    var containerOffset = this.container.offset();
    x = x - containerOffset.left;
    y = y - containerOffset.top;
    var zoom = this.getZoom();
    return {
      x : Math.floor(x / zoom),
      y : Math.floor(y / zoom)
    };
  };

  ns.AnimatedPreviewController.prototype.onFPSSliderChange = function (evt) {
    this.setFPS(parseInt(this.fpsRangeInput[0].value, 10));

  };

  ns.AnimatedPreviewController.prototype.setFPS = function (fps) {
    if (typeof fps === 'number') {
      this.fps = fps;
      this.fpsRangeInput.val(this.fps);
      this.fpsRangeInput.blur();
      //this.fpsCounterDisplay.html(this.fps + ' FPS');
    }
  };

  ns.AnimatedPreviewController.prototype.getFPS = function () {
    return this.fps;
  };

  ns.AnimatedPreviewController.prototype.render = function (delta) {
    if (this.renderFlag) {
      this.elapsedTime += delta;
      if (this.fps === 0) {
        this._renderSelectedFrame();
      } else {
        this._renderCurrentAnimationFrame();
      }
    }
  };

  ns.AnimatedPreviewController.prototype._renderSelectedFrame = function (delta) {
    // the selected frame is the currentFrame from the PiskelController perspective
    var selectedFrameIndex = this.piskelController.getCurrentFrameIndex();
    var selectedFrame = this.piskelController.getFrameAt(selectedFrameIndex);
    this.renderer.render(selectedFrame);
  };

  ns.AnimatedPreviewController.prototype._renderCurrentAnimationFrame = function (delta) {
    var index = Math.floor(this.elapsedTime / (1000/this.fps));
    if (index != this.currentIndex) {
      this.currentIndex = index;
      if (!this.piskelController.hasFrameAt(this.currentIndex)) {
        this.currentIndex = 0;
        this.elapsedTime = 0;
      }
      var frame = this.piskelController.getFrameAt(this.currentIndex);
      this.renderer.render(frame);
    }
  };

  /**
   * Calculate the preview zoom depending on the framesheet size
   */
  ns.AnimatedPreviewController.prototype.calculateZoom_ = function () {
    var frame = this.piskelController.getCurrentFrame();
    var hZoom = PREVIEW_SIZE / frame.getHeight(),
        wZoom = PREVIEW_SIZE / frame.getWidth();

    return Math.min(hZoom, wZoom);
  };

  ns.AnimatedPreviewController.prototype.onFrameSizeChange_ = function () {
    this.updateZoom_();
    this.updateContainerDimensions_();
  };

  ns.AnimatedPreviewController.prototype.updateContainerDimensions_ = function () {
    var containerEl = this.container.get(0);
    var isTiled = pskl.UserSettings.get(pskl.UserSettings.TILED_PREVIEW);
    var height, width;

    if (isTiled) {
      height = PREVIEW_SIZE;
      width = PREVIEW_SIZE;
    } else {
      var zoom = this.getZoom();
      var frame = this.piskelController.getCurrentFrame();
      height = frame.getHeight() * zoom;
      width = frame.getWidth() * zoom;
    }

    containerEl.style.height = height + 'px';
    containerEl.style.width = width + 'px';

    //var horizontalMargin = (PREVIEW_SIZE - height) / 2;
    //containerEl.style.marginTop = horizontalMargin + 'px';
    //containerEl.style.marginBottom = horizontalMargin + 'px';

    var verticalMargin = (PREVIEW_SIZE - width) / 2;
    containerEl.style.marginLeft = verticalMargin - 5 + 'px';
    containerEl.style.marginRight = verticalMargin + 'px';
  };

  ns.AnimatedPreviewController.prototype.setRenderFlag_ = function (bool) {
    this.renderFlag = bool;
  };

  ns.AnimatedPreviewController.prototype.toggleOnionSkin_ = function () {
    var currentValue = pskl.UserSettings.get(pskl.UserSettings.ONION_SKIN);
    pskl.UserSettings.set(pskl.UserSettings.ONION_SKIN, !currentValue);
  };
})();;(function () {
  var ns = $.namespace('pskl.controller');

  ns.MinimapController = function (piskelController, animationController, drawingController, container) {
    this.piskelController = piskelController;
    this.animationController = animationController;
    this.drawingController = drawingController;
    this.container = container;

    this.isClicked = false;
    this.isVisible = false;
  };

  ns.MinimapController.prototype.init = function () {
    // Create minimap DOM elements
    this.minimapEl = document.createElement('DIV');
    this.minimapEl.className = 'minimap-crop-frame';
    this.minimapEl.style.display = 'none';
    $(this.container).append(this.minimapEl);

    // Init mouse events
    $(this.container).mousedown(this.onMinimapMousedown_.bind(this));
    $('body').mousemove(this.onMinimapMousemove_.bind(this));
    $('body').mouseup(this.onMinimapMouseup_.bind(this));

    $.subscribe(Events.ZOOM_CHANGED, $.proxy(this.renderMinimap_, this));
  };

  ns.MinimapController.prototype.renderMinimap_ = function () {
    var verticalRatio = this.getVerticalRatio_();
    var horizontalRatio = this.getHorizontalRatio_();
    if (verticalRatio > 1 || horizontalRatio > 1) {
      this.displayMinimap_();
    } else {
      this.hideMinimap_();
    }
  };

  ns.MinimapController.prototype.displayMinimap_ = function () {
    var minimapSize = this.getMinimapSize_();
    var previewSize = this.getPreviewSize_();

    var containerHeight = this.container.height();
    var containerWidth = this.container.width();

    // offset(x, y) in frame pixels
    var offset = this.drawingController.getRenderer().getOffset();

    // the preview is centered in a square container
    // if the sprite is not a square, a margin is needed on the appropriate coordinate
    // before adding the offset coming from the drawing area
    var leftMargin = (containerWidth - Math.max(minimapSize.width, previewSize.width))/2;
    var leftOffset = offset.x * this.animationController.getZoom();
    var left = leftMargin + leftOffset;

    var topMargin = (containerHeight - Math.max(minimapSize.height, previewSize.height))/2;
    var topOffset = offset.y * this.animationController.getZoom();
    var top = topMargin + topOffset;

    this.minimapEl.style.display = 'block';
    this.minimapEl.style.width = Math.min(minimapSize.width, containerWidth) + 'px';
    this.minimapEl.style.height = Math.min(minimapSize.height, containerHeight) + 'px';
    this.minimapEl.style.left = Math.max(0, left) + 5 +  'px';
    this.minimapEl.style.top = Math.max(0, top) +  'px';

    this.isVisible = true;
  };

  ns.MinimapController.prototype.getMinimapSize_ = function () {
    // Calculate the ratio to translate drawing area sizes to animated preview sizes
    var drawingAreaZoom = this.drawingController.getRenderer().getZoom();
    var animatedPreviewZoom = this.animationController.getZoom();
    var ratio = drawingAreaZoom / animatedPreviewZoom;

    var displaySize = this.drawingController.getRenderer().getDisplaySize();
    var minimapWidth  = displaySize.width / ratio;
    var minimapHeight = displaySize.height / ratio;

    return {
      width : minimapWidth,
      height: minimapHeight
    };
  };

  ns.MinimapController.prototype.getPreviewSize_ = function () {
    var frame = this.piskelController.getCurrentFrame();
    var previewWidth = frame.getWidth() * this.animationController.getZoom();
    var previewHeight = frame.getHeight() * this.animationController.getZoom();

    return {
      width : previewWidth,
      height: previewHeight
    };
  };

  ns.MinimapController.prototype.hideMinimap_ = function () {
    this.minimapEl.style.display = 'none';
    this.isVisible = false;
  };

  ns.MinimapController.prototype.onMinimapMousemove_ = function (evt) {
    if (this.isVisible && this.isClicked) {
      var coords = this.getCoordinatesCenteredAround_(evt.clientX, evt.clientY);
      this.drawingController.setOffset(coords.x, coords.y);
    }
  };

  ns.MinimapController.prototype.onMinimapMousedown_ = function (evt) {
    this.isClicked = true;
  };

  ns.MinimapController.prototype.onMinimapMouseup_ = function (evt) {
    this.isClicked = false;
  };

  ns.MinimapController.prototype.getCoordinatesCenteredAround_ = function (x, y) {
    var frameCoords = this.animationController.getCoordinates(x, y);

    var frameWidth = this.piskelController.getCurrentFrame().getWidth();
    var frameHeight = this.piskelController.getCurrentFrame().getHeight();

    var width = frameWidth / this.getHorizontalRatio_();
    var height = frameHeight / this.getVerticalRatio_();

    return {
      x : frameCoords.x - (width/2),
      y : frameCoords.y - (height/2)
    };
  };

  ns.MinimapController.prototype.getVerticalRatio_ = function () {
    var drawingAreaZoom = this.drawingController.getRenderer().getZoom();
    var frame = this.piskelController.getCurrentFrame();
    var frameTotalHeight = frame.getHeight() * drawingAreaZoom;
    var frameDisplayHeight = this.drawingController.getRenderer().getDisplaySize().height;

    return frameTotalHeight / frameDisplayHeight;
  };

  ns.MinimapController.prototype.getHorizontalRatio_ = function () {
    var drawingAreaZoom = this.drawingController.getRenderer().getZoom();
    var frame = this.piskelController.getCurrentFrame();
    var frameTotalWidth = frame.getWidth() * drawingAreaZoom;
    var frameDisplayWidth = this.drawingController.getRenderer().getDisplaySize().width;

    return frameTotalWidth / frameDisplayWidth;
  };
})();;(function () {
  var ns = $.namespace("pskl.controller");

  ns.ToolController = function () {
    var toDescriptor = function (id, shortcut, instance) {
      return {id:id, shortcut:shortcut, instance:instance};
    };

    this.tools = [
      toDescriptor('simplePen', 'P', new pskl.tools.drawing.SimplePen())
     ,toDescriptor('verticalMirrorPen', 'V', new pskl.tools.drawing.VerticalMirrorPen())
     ,toDescriptor('colorPicker', 'O', new pskl.tools.drawing.ColorPicker())
     ,toDescriptor('stroke', 'L', new pskl.tools.drawing.Stroke())
     ,toDescriptor('paintBucket', 'B', new pskl.tools.drawing.PaintBucket())
     ,toDescriptor('colorSwap', 'A', new pskl.tools.drawing.ColorSwap())
     ,toDescriptor('eraser', 'E', new pskl.tools.drawing.Eraser())
     ,toDescriptor('lighten', 'U', new pskl.tools.drawing.Lighten())
     ,toDescriptor('rectangle', 'R', new pskl.tools.drawing.Rectangle())
     ,toDescriptor('circle', 'C', new pskl.tools.drawing.Circle())
     ,toDescriptor('rectangleSelect', 'S', new pskl.tools.drawing.RectangleSelect())
     ,toDescriptor('shapeSelect', 'Z', new pskl.tools.drawing.ShapeSelect())
     ,toDescriptor('move', 'M', new pskl.tools.drawing.Move())
     ,toDescriptor('clone', '', new pskl.tools.transform.Clone())
     ,toDescriptor('flip', '', new pskl.tools.transform.Flip())
     ,toDescriptor('rotate', '', new pskl.tools.transform.Rotate())
    ];

    this.toolIconRenderer = new pskl.tools.IconMarkupRenderer();
  };

  /**
   * @public
   */
  ns.ToolController.prototype.init = function() {
    this.createToolsDom_();
    this.addKeyboardShortcuts_();

    // Initialize tool:
    // Set SimplePen as default selected tool:
    this.selectTool_(this.tools[0]);
    // Activate listener on tool panel:
    $("#tool-section").mousedown($.proxy(this.onToolIconClicked_, this));

    $.subscribe(Events.SELECT_TOOL, this.onSelectToolEvent_.bind(this));
  };

  /**
   * @private
   */
  ns.ToolController.prototype.activateToolOnStage_ = function(tool) {
    var stage = $("body");
    var previousSelectedToolClass = stage.data("selected-tool-class");
    if(previousSelectedToolClass) {
      stage.removeClass(previousSelectedToolClass);
      stage.removeClass(pskl.tools.drawing.Move.TOOL_ID);
    }
    stage.addClass(tool.instance.toolId);
    stage.data("selected-tool-class", tool.instance.toolId);
  };

  ns.ToolController.prototype.onSelectToolEvent_ = function(event, toolId) {
    var tool = this.getToolById_(toolId);
    if (tool) {
      this.selectTool_(tool);
    }
  };

  /**
   * @private
   */
  ns.ToolController.prototype.selectTool_ = function(tool) {
    this.currentSelectedTool = tool;
    this.activateToolOnStage_(this.currentSelectedTool);

    var selectedToolElement = $('#tool-section .tool-icon.selected');
    var toolElement = $('[data-tool-id=' + tool.instance.toolId + ']');

    selectedToolElement.removeClass('selected');
    toolElement.addClass('selected');

    $.publish(Events.TOOL_SELECTED, [tool.instance]);
  };

  /**
   * @private
   */
  ns.ToolController.prototype.onToolIconClicked_ = function(evt) {


    var toolId = evt.target.dataset.toolId;
    console.log(toolId);
    if (toolId == 'tool-flip' || toolId == 'tool-rotate' || toolId == 'tool-clone') {
      this.tools.forEach(function (tool) {
        if (tool.instance.toolId === toolId) {
          tool.instance.apply(evt);
        }
      }.bind(this));
    } else {
      var target = $(evt.target);
      var clickedTool = target.closest(".tool-icon");
      if(clickedTool.length) {
        var toolId = clickedTool.data().toolId;
        var tool = this.getToolById_(toolId);
        if (tool) {
          this.selectTool_(tool);
        }
      }
    }

  };

  ns.ToolController.prototype.onKeyboardShortcut_ = function(charkey) {
    for (var i = 0 ; i < this.tools.length ; i++) {
      var tool = this.tools[i];
      if (tool.shortcut.toLowerCase() === charkey.toLowerCase()) {
        this.selectTool_(tool);
      }
    }
  };

  ns.ToolController.prototype.getToolById_ = function (toolId) {
    return pskl.utils.Array.find(this.tools, function (tool) {
      return tool.instance.toolId == toolId;
    });
  };

  /**
   * @private
   */
  ns.ToolController.prototype.createToolsDom_ = function() {
    var html = '';
    for(var i = 0 ; i < this.tools.length ; i++) {
      var tool = this.tools[i];
      html += this.toolIconRenderer.render(tool.instance, tool.shortcut);
    }
    $('#tools-container').html(html);
  };

  ns.ToolController.prototype.addKeyboardShortcuts_ = function () {
    for(var i = 0 ; i < this.tools.length ; i++) {
      pskl.app.shortcutService.addShortcut(this.tools[i].shortcut, this.onKeyboardShortcut_.bind(this));
    }
  };
})();;(function () {
  var ns = $.namespace("pskl.controller");

  ns.PaletteController = function () {
    this.primaryColor =  Constants.DEFAULT_PEN_COLOR;
    this.secondaryColor =  Constants.TRANSPARENT_COLOR;
  };

  /**
   * @public
   */
  ns.PaletteController.prototype.init = function() {
    $.subscribe(Events.SELECT_PRIMARY_COLOR, this.onColorSelected_.bind(this, {isPrimary:true}));
    $.subscribe(Events.SELECT_SECONDARY_COLOR, this.onColorSelected_.bind(this, {isPrimary:false}));

    pskl.app.shortcutService.addShortcut('X', this.swapColors.bind(this));
    pskl.app.shortcutService.addShortcut('D', this.resetColors.bind(this));

    var spectrumCfg = {
      showPalette: true,
      showButtons: false,
      showInput: true,
      palette: [
        ['rgba(0,0,0,0)']
      ],
      clickoutFiresChange : true,

      beforeShow : function(tinycolor) {
        tinycolor.setAlpha(1);
      }
    };

    // Initialize colorpickers:
    var colorPicker = $('#color-picker');
    colorPicker.spectrum($.extend({color: Constants.DEFAULT_PEN_COLOR}, spectrumCfg));
    colorPicker.change({isPrimary : true}, $.proxy(this.onPickerChange_, this));
    this.setTitleOnPicker_(Constants.DEFAULT_PEN_COLOR, colorPicker);

    var secondaryColorPicker = $('#secondary-color-picker');
    secondaryColorPicker.spectrum($.extend({color: Constants.TRANSPARENT_COLOR}, spectrumCfg));
    secondaryColorPicker.change({isPrimary : false}, $.proxy(this.onPickerChange_, this));
    this.setTitleOnPicker_(Constants.TRANSPARENT_COLOR, secondaryColorPicker);

    var swapColorsIcon = $('.swap-colors-icon');
    swapColorsIcon.click(this.swapColors.bind(this));
  };

  /**
   * @private
   */
  ns.PaletteController.prototype.onPickerChange_ = function(evt, isPrimary) {
    var inputPicker = $(evt.target);
    if(evt.data.isPrimary) {
      this.setPrimaryColor(inputPicker.val());
    } else {
      this.setSecondaryColor(inputPicker.val());
    }
  };

  /**
   * @private
   */
  ns.PaletteController.prototype.onColorSelected_ = function(args, evt, color) {
    var inputPicker = $(evt.target);
    if(args.isPrimary) {
      this.setPrimaryColor(color);
    } else {
      this.setSecondaryColor(color);
    }
  };

  ns.PaletteController.prototype.setPrimaryColor = function (color) {
    this.primaryColor = color;
    this.updateColorPicker_(color, $('#color-picker'));
    $.publish(Events.PRIMARY_COLOR_SELECTED, [color]);
  };

  ns.PaletteController.prototype.setSecondaryColor = function (color) {
    this.secondaryColor = color;
    this.updateColorPicker_(color, $('#secondary-color-picker'));
    $.publish(Events.SECONDARY_COLOR_SELECTED, [color]);
  };

  ns.PaletteController.prototype.getPrimaryColor = function () {
    return this.primaryColor;
  };

  ns.PaletteController.prototype.getSecondaryColor = function () {
    return this.secondaryColor;
  };

  ns.PaletteController.prototype.swapColors = function () {
    var primaryColor = this.getPrimaryColor();
    this.setPrimaryColor(this.getSecondaryColor());
    this.setSecondaryColor(primaryColor);
  };

  ns.PaletteController.prototype.resetColors = function () {
    this.setPrimaryColor(Constants.DEFAULT_PEN_COLOR);
    this.setSecondaryColor(Constants.TRANSPARENT_COLOR);
  };

  /**
   * @private
   */
  ns.PaletteController.prototype.updateColorPicker_ = function (color, colorPicker) {
    if (color == Constants.TRANSPARENT_COLOR) {
      // We can set the current palette color to transparent.
      // You can then combine this transparent color with an advanced
      // tool for customized deletions.
      // Eg: bucket + transparent: Delete a colored area
      //     Stroke + transparent: hollow out the equivalent of a stroke

      // The colorpicker can't be set to a transparent state.
      // We set its background to white and insert the
      // string "TRANSPARENT" to mimic this state:
      colorPicker.spectrum("set", Constants.TRANSPARENT_COLOR);
      colorPicker.val(Constants.TRANSPARENT_COLOR);
    } else {
      colorPicker.spectrum("set", color);
    }
    this.setTitleOnPicker_(color, colorPicker);
  };

  ns.PaletteController.prototype.setTitleOnPicker_ = function (title, colorPicker) {
    var spectrumInputSelector = '.sp-replacer';
    colorPicker.next(spectrumInputSelector).attr('title', title);
  };
})();



;(function () {
  var ns = $.namespace('pskl.controller');

  var PRIMARY_COLOR_CLASSNAME = 'palettes-list-primary-color';
  var SECONDARY_COLOR_CLASSNAME = 'palettes-list-secondary-color';

  var HAS_SCROLL_CLASSNAME = 'palettes-list-has-scrollbar';
  // well ... I know that if there are more than 20 colors, a scrollbar will be displayed
  // It's linked to the max-height: 160px; defined in toolbox-palette-list.css !
  // I apologize to my future self for this one.
  var NO_SCROLL_MAX_COLORS = 20;


  ns.PalettesListController = function (paletteController, usedColorService) {
    this.usedColorService = usedColorService;
    this.paletteService = pskl.app.paletteService;
    this.paletteController = paletteController;
  };

  ns.PalettesListController.prototype.init = function () {
    this.paletteColorTemplate_ = pskl.utils.Template.get('palette-color-template');

    this.colorListContainer_ = document.querySelector('.palettes-list-colors');
    this.colorPaletteSelect_ = document.querySelector('.palettes-list-select');

    var createPaletteButton_ = document.querySelector('.create-palette-button');
    var editPaletteButton_ = document.querySelector('.edit-palette-button');

    this.colorPaletteSelect_.addEventListener('change', this.onPaletteSelected_.bind(this));
    this.colorListContainer_.addEventListener('mouseup', this.onColorContainerMouseup.bind(this));
    this.colorListContainer_.addEventListener('contextmenu', this.onColorContainerContextMenu.bind(this));

    createPaletteButton_.addEventListener('click', this.onCreatePaletteClick_.bind(this));
    editPaletteButton_.addEventListener('click', this.onEditPaletteClick_.bind(this));

    $.subscribe(Events.PALETTE_LIST_UPDATED, this.onPaletteListUpdated.bind(this));
    $.subscribe(Events.CURRENT_COLORS_UPDATED, this.fillColorListContainer.bind(this));
    $.subscribe(Events.PRIMARY_COLOR_SELECTED, this.highlightSelectedColors.bind(this));
    $.subscribe(Events.SECONDARY_COLOR_SELECTED, this.highlightSelectedColors.bind(this));
    $.subscribe(Events.USER_SETTINGS_CHANGED, $.proxy(this.onUserSettingsChange_, this));


    pskl.app.shortcutService.addShortcuts(['>', 'shift+>'], this.selectNextColor_.bind(this));
    pskl.app.shortcutService.addShortcut('<', this.selectPreviousColor_.bind(this));

    this.fillPaletteList();
    this.updateFromUserSettings();
    this.fillColorListContainer();
  };

  ns.PalettesListController.prototype.fillPaletteList = function () {
    var palettes = this.paletteService.getPalettes();

    var html = palettes.map(function (palette) {
      return pskl.utils.Template.replace('<option value="{{id}}">{{name}}</option>', palette);
    }).join('');
    this.colorPaletteSelect_.innerHTML = html;
  };

  ns.PalettesListController.prototype.fillColorListContainer = function () {

    var colors = this.getSelectedPaletteColors_();

    if (colors.length > 0) {
      var html = colors.map(function (color, index) {
        return pskl.utils.Template.replace(this.paletteColorTemplate_, {color : color, index : index});
      }.bind(this)).join('');
      this.colorListContainer_.innerHTML = html;

      this.highlightSelectedColors();

      var hasScrollbar = colors.length > NO_SCROLL_MAX_COLORS;
      if (hasScrollbar && !pskl.utils.UserAgent.isChrome) {
        this.colorListContainer_.classList.add(HAS_SCROLL_CLASSNAME);
      } else {
        this.colorListContainer_.classList.remove(HAS_SCROLL_CLASSNAME);
      }
    } else {
      this.colorListContainer_.innerHTML = pskl.utils.Template.get('palettes-list-no-colors-partial');
    }
  };

  ns.PalettesListController.prototype.selectPalette = function (paletteId) {
    pskl.UserSettings.set(pskl.UserSettings.SELECTED_PALETTE, paletteId);
  };

  ns.PalettesListController.prototype.getSelectedPaletteColors_ = function () {
    var colors = [];
    var palette = this.getSelectedPalette_();
    if (palette) {
      colors = palette.getColors();
    }

    if (colors.length > Constants.MAX_CURRENT_COLORS_DISPLAYED) {
      colors = colors.slice(0, Constants.MAX_CURRENT_COLORS_DISPLAYED);
    }

    return colors;
  };

  ns.PalettesListController.prototype.getSelectedPalette_ = function () {
    var paletteId = pskl.UserSettings.get(pskl.UserSettings.SELECTED_PALETTE);
    return this.paletteService.getPaletteById(paletteId);
  };

  ns.PalettesListController.prototype.selectNextColor_ = function () {
    this.selectColor_(this.getCurrentColorIndex_() + 1);
  };

  ns.PalettesListController.prototype.selectPreviousColor_ = function () {
    this.selectColor_(this.getCurrentColorIndex_() - 1);
  };

  ns.PalettesListController.prototype.getCurrentColorIndex_ = function () {
    var currentIndex = 0;
    var selectedColor = document.querySelector('.' + PRIMARY_COLOR_CLASSNAME);
    if (selectedColor) {
      currentIndex = parseInt(selectedColor.dataset.colorIndex, 10);
    }
    return currentIndex;
  };

  ns.PalettesListController.prototype.selectColor_ = function (index) {
    var colors = this.getSelectedPaletteColors_();
    var color = colors[index];
    if (color) {
      $.publish(Events.SELECT_PRIMARY_COLOR, [color]);
    }
  };

  ns.PalettesListController.prototype.onUserSettingsChange_ = function (evt, name, value) {
    if (name == pskl.UserSettings.SELECTED_PALETTE) {
      this.updateFromUserSettings();
    }
  };

  ns.PalettesListController.prototype.updateFromUserSettings = function () {
    var paletteId = pskl.UserSettings.get(pskl.UserSettings.SELECTED_PALETTE);
    this.fillColorListContainer();
    this.colorPaletteSelect_.value = paletteId;
  };

  ns.PalettesListController.prototype.onPaletteSelected_ = function (evt) {
    var paletteId = this.colorPaletteSelect_.value;
    this.selectPalette(paletteId);
    this.colorPaletteSelect_.blur();
  };

  ns.PalettesListController.prototype.onCreatePaletteClick_ = function (evt) {
    $.publish(Events.DIALOG_DISPLAY, 'create-palette');
  };

  ns.PalettesListController.prototype.onEditPaletteClick_ = function (evt) {
    var paletteId = this.colorPaletteSelect_.value;
    $.publish(Events.DIALOG_DISPLAY, {
      dialogId : 'create-palette',
      initArgs : paletteId
    });
  };

  ns.PalettesListController.prototype.onColorContainerContextMenu = function (event) {
    event.preventDefault();
  };

  ns.PalettesListController.prototype.onColorContainerMouseup = function (event) {
    var target = event.target;
    var color = target.dataset.color;

    if (color) {
      if (event.button == Constants.LEFT_BUTTON) {
        $.publish(Events.SELECT_PRIMARY_COLOR, [color]);
      } else if (event.button == Constants.RIGHT_BUTTON) {
        $.publish(Events.SELECT_SECONDARY_COLOR, [color]);
      }
    }
  };

  ns.PalettesListController.prototype.highlightSelectedColors = function () {
    this.removeClass_(PRIMARY_COLOR_CLASSNAME);
    this.removeClass_(SECONDARY_COLOR_CLASSNAME);

    var colorContainer = this.getColorContainer_(this.paletteController.getSecondaryColor());
    if (colorContainer) {
      colorContainer.classList.remove(PRIMARY_COLOR_CLASSNAME);
      colorContainer.classList.add(SECONDARY_COLOR_CLASSNAME);
    }

    colorContainer = this.getColorContainer_(this.paletteController.getPrimaryColor());
    if (colorContainer) {
      colorContainer.classList.remove(SECONDARY_COLOR_CLASSNAME);
      colorContainer.classList.add(PRIMARY_COLOR_CLASSNAME);
    }
  };

  ns.PalettesListController.prototype.getColorContainer_ = function (color) {
    return this.colorListContainer_.querySelector('.palettes-list-color[data-color="'+color+'"]');
  };

  ns.PalettesListController.prototype.removeClass_ = function (cssClass) {
    var element = document.querySelector('.' + cssClass);
    if (element) {
      element.classList.remove(cssClass);
    }
  };

  ns.PalettesListController.prototype.onPaletteListUpdated = function () {
    this.fillPaletteList();
    this.updateFromUserSettings();
  };
})();;(function () {
  var ns = $.namespace('pskl.controller');

  ns.ProgressBarController = function () {
    this.template = pskl.utils.Template.get('progress-bar-template');
    this.progressBar = null;
    this.progressBarStatus = null;

    this.showProgressTimer_ = 0;
  };

  ns.ProgressBarController.prototype.init = function () {
    $.subscribe(Events.SHOW_PROGRESS, $.proxy(this.showProgress_, this));
    $.subscribe(Events.UPDATE_PROGRESS, $.proxy(this.updateProgress_, this));
    $.subscribe(Events.HIDE_PROGRESS, $.proxy(this.hideProgress_, this));
  };

  ns.ProgressBarController.prototype.showProgress_ = function (event, progressInfo) {
    this.removeProgressBar_();
    this.showProgressTimer_ = window.setTimeout(this.onTimerExpired_.bind(this, progressInfo), 300);
  };

  ns.ProgressBarController.prototype.onTimerExpired_ = function (progressInfo) {
    var progressBarHtml = pskl.utils.Template.replace(this.template, {
      name : progressInfo.name,
      status : 0
    });

    var progressBarEl = pskl.utils.Template.createFromHTML(progressBarHtml);
    document.body.appendChild(progressBarEl);

    this.progressBar = document.querySelector('.progress-bar');
    this.progressBarStatus = document.querySelector('.progress-bar-status');
  };

  ns.ProgressBarController.prototype.updateProgress_ = function (event, progressInfo) {
    if (this.progressBar && this.progressBarStatus) {
      var progress = progressInfo.progress;
      var width = this.progressBar.offsetWidth;
      var progressWidth = width - ((progress * width) / 100);
      this.progressBar.style.backgroundPosition = (-progressWidth) + 'px 0';
      this.progressBarStatus.innerHTML = progress + '%';
    }
  };

  ns.ProgressBarController.prototype.hideProgress_ = function (event, progressInfo) {
    if (this.showProgressTimer_) {
      window.clearTimeout(this.showProgressTimer_);
    }
    this.removeProgressBar_();
  };

  ns.ProgressBarController.prototype.removeProgressBar_ = function () {
    var progressBarContainer = document.querySelector('.progress-bar-container');
    if (progressBarContainer) {
      progressBarContainer.parentNode.removeChild(progressBarContainer);
      this.progressBar = null;
      this.progressBarStatus = null;
    }
  };
})();;(function () {
  var ns = $.namespace("pskl.controller");

  ns.NotificationController = function () {};

  /**
   * @public
   */
  ns.NotificationController.prototype.init = function() {
    $.subscribe(Events.SHOW_NOTIFICATION, $.proxy(this.displayMessage_, this));
    $.subscribe(Events.HIDE_NOTIFICATION, $.proxy(this.removeMessage_, this));
  };

  /**
   * @private
   */
  ns.NotificationController.prototype.displayMessage_ = function (evt, messageInfo) {
    this.removeMessage_();

    var message = document.createElement('div');
    message.id = "user-message";
    message.className = "user-message";
    message.innerHTML = messageInfo.content;
    message.innerHTML = message.innerHTML + "<div title='Close message' class='close'>x</div>";
    document.body.appendChild(message);

    message.querySelector('.close').addEventListener('click', this.removeMessage_.bind(this));
    if (messageInfo.behavior) {
      messageInfo.behavior(message);
    }

    if (messageInfo.hideDelay) {
      window.setTimeout(this.removeMessage_.bind(this), messageInfo.hideDelay);
    }
  };

  /**
   * @private
   */
  ns.NotificationController.prototype.removeMessage_ = function (evt) {
    var message = $("#user-message");
    if (message.length) {
      message.remove();
    }
  };
})();


/*;(function () {
  var ns = $.namespace('pskl.controller');

  ns.TransformationsController = function () {

    var toDescriptor = function (id, shortcut, instance) {
      return {id:id, shortcut:shortcut, instance:instance};
    };

    this.tools = [
      toDescriptor('flip', '', new pskl.tools.transform.Flip()),
      toDescriptor('rotate', '', new pskl.tools.transform.Rotate()),
      toDescriptor('clone', '', new pskl.tools.transform.Clone())
    ];

    this.toolIconRenderer = new pskl.tools.IconMarkupRenderer();
  };

  ns.TransformationsController.prototype.init = function () {
    var container = document.querySelector('.transformations-container');
    this.toolsContainer = container.querySelector('.tools-wrapper');
    container.addEventListener('click', this.onTransformationClick.bind(this));
    this.createToolsDom_();
  };


  ns.TransformationsController.prototype.onTransformationClick = function (evt) {
    var toolId = evt.target.dataset.toolId;
    this.tools.forEach(function (tool) {
      if (tool.instance.toolId === toolId) {
        tool.instance.apply(evt);
      }
    }.bind(this));
  };

  ns.TransformationsController.prototype.createToolsDom_ = function() {
    var html = this.tools.reduce(function (p, tool) {
      return p + this.toolIconRenderer.render(tool.instance, tool.shortcut, 'left');
    }.bind(this), '');
    this.toolsContainer.innerHTML = html;
  };
})();*/

;(function () {
  var ns = $.namespace('pskl.controller');

  ns.CanvasBackgroundController = function () {
    this.body = document.body;
  };

  ns.CanvasBackgroundController.prototype.init = function () {
    $.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
    this.updateBackgroundClass_(pskl.UserSettings.get(pskl.UserSettings.CANVAS_BACKGROUND));
  };


  ns.CanvasBackgroundController.prototype.onUserSettingsChange_ = function (evt, settingName, settingValue) {
    if (settingName == pskl.UserSettings.CANVAS_BACKGROUND) {
      this.updateBackgroundClass_(settingValue);
    }
  };

  ns.CanvasBackgroundController.prototype.updateBackgroundClass_ = function (newClass) {
    var currentClass = this.body.dataset.currentBackgroundClass;
    if (currentClass) {
      this.body.classList.remove(currentClass);
    }
    this.body.classList.add(newClass);
    this.body.dataset.currentBackgroundClass = newClass;
  };
})();;(function () {
  var ns = $.namespace("pskl.controller.settings");

  ns.ApplicationSettingsController = function () {};

  /**
   * @public
   */
  ns.ApplicationSettingsController.prototype.init = function() {
    // Highlight selected background picker:
    var backgroundClass = pskl.UserSettings.get(pskl.UserSettings.CANVAS_BACKGROUND);
    $('#background-picker-wrapper')
      .find('.background-picker[data-background-class=' + backgroundClass + ']')
      .addClass('selected');

    // Grid display and size
    var gridWidth = pskl.UserSettings.get(pskl.UserSettings.GRID_WIDTH);
    $('#grid-width').val(gridWidth);
    $('#grid-width').change(this.onGridWidthChange.bind(this));

    // Handle canvas background changes:
    $('#background-picker-wrapper').click(this.onBackgroundClick.bind(this));
  };

  ns.ApplicationSettingsController.prototype.onGridWidthChange = function (evt) {
    var width = $('#grid-width').val();
    pskl.UserSettings.set(pskl.UserSettings.GRID_WIDTH, parseInt(width, 10));
  };

  ns.ApplicationSettingsController.prototype.onBackgroundClick = function (evt) {
    var target = $(evt.target).closest('.background-picker');
    if (target.length) {
      var backgroundClass = target.data('background-class');
      pskl.UserSettings.set(pskl.UserSettings.CANVAS_BACKGROUND, backgroundClass);

      $('.background-picker').removeClass('selected');
      target.addClass('selected');
    }
  };

})();;(function () {
  var ns = $.namespace('pskl.controller.settings');

  ns.ResizeController = function (piskelController) {
    this.piskelController = piskelController;
  };

  ns.ResizeController.prototype.init = function () {
    this.resizeWidth = $('[name=resize-width]');
    this.resizeHeight = $('[name=resize-height]');

    this.resizeWidth.val(this.piskelController.getWidth());
    this.resizeHeight.val(this.piskelController.getHeight());

    this.cancelButton = $('.resize-cancel-button');
    this.cancelButton.click(this.onCancelButtonClicked_.bind(this));

    this.resizeForm = $("[name=resize-form]");
    this.resizeForm.submit(this.onResizeFormSubmit_.bind(this));

    this.resizeContentCheckbox = $(".resize-content-checkbox");
  };

  ns.ResizeController.prototype.onResizeFormSubmit_ = function (evt) {
    evt.originalEvent.preventDefault();

    var width = parseInt(this.resizeWidth.val(), 10);
    var height = parseInt(this.resizeHeight.val(), 10);

    var resizeContentEnabled = this.isResizeContentEnabled_();
    var resizedLayers = this.piskelController.getLayers().map(this.resizeLayer_.bind(this));

    var piskel = pskl.model.Piskel.fromLayers(resizedLayers, this.piskelController.getPiskel().getDescriptor());

    pskl.app.piskelController.setPiskel(piskel, true);
    $.publish(Events.CLOSE_SETTINGS_DRAWER);
  };

  ns.ResizeController.prototype.resizeLayer_ = function (layer) {
    var resizedFrames = layer.getFrames().map(this.resizeFrame_.bind(this));
    return pskl.model.Layer.fromFrames(layer.getName(), resizedFrames);
  };

  ns.ResizeController.prototype.resizeFrame_ = function (frame) {
    var width = parseInt(this.resizeWidth.val(), 10);
    var height = parseInt(this.resizeHeight.val(), 10);

    var resizedFrame;
    if (this.isResizeContentEnabled_()) {
      resizedFrame = pskl.utils.FrameUtils.resize(frame, width, height, false);
    } else {
      resizedFrame = new pskl.model.Frame(width, height);
      frame.forEachPixel(function (color, x, y) {
        if (x < resizedFrame.getWidth() && y < resizedFrame.getHeight()) {
          resizedFrame.setPixel(x, y, color);
        }
      });
    }

    return resizedFrame;
  };

  ns.ResizeController.prototype.isResizeContentEnabled_ = function () {
    return !!this.resizeContentCheckbox.prop('checked');
  };

  ns.ResizeController.prototype.onCancelButtonClicked_ = function (evt) {
    $.publish(Events.CLOSE_SETTINGS_DRAWER);
  };
})();;(function () {
  var ns = $.namespace("pskl.controller.settings");

  ns.ImageExportController = function (piskelController) {
    this.piskelController = piskelController;
    this.pngExportController = new ns.PngExportController(piskelController);
    this.gifExportController = new ns.GifExportController(piskelController);
  };

  ns.ImageExportController.prototype.init = function () {
    this.pngExportController.init();
    this.gifExportController.init();
  };
})();;(function () {
  var ns = $.namespace("pskl.controller.settings");

  var URL_MAX_LENGTH = 30;
  var MAX_GIF_COLORS = 256;
  var MAX_EXPORT_ZOOM = 20;
  var DEFAULT_EXPORT_ZOOM = 10;

  ns.GifExportController = function (piskelController) {
    this.piskelController = piskelController;
  };

  /**
   * List of Resolutions applicable for Gif export
   * @static
   * @type {Array} array of Objects {zoom:{Number}, default:{Boolean}}
   */
  ns.GifExportController.RESOLUTIONS = [];
  for (var i = 1 ; i <= MAX_EXPORT_ZOOM ; i++) {
    ns.GifExportController.RESOLUTIONS.push({
      zoom : i
    });
  }

  ns.GifExportController.prototype.init = function () {
    this.optionTemplate_ = pskl.utils.Template.get("gif-export-option-template");

    this.uploadStatusContainerEl = document.querySelector(".gif-upload-status");

    this.previewContainerEl = document.querySelector(".gif-export-preview");
    this.selectResolutionEl = document.querySelector(".gif-export-select-resolution");

    this.uploadButton = $(".gif-upload-button");
    this.uploadButton.click(this.onUploadButtonClick_.bind(this));

    this.downloadButton = $(".gif-download-button");
    this.downloadButton.click(this.onDownloadButtonClick_.bind(this));

    this.createOptionElements_();
  };

  ns.GifExportController.prototype.onUploadButtonClick_ = function (evt) {
    evt.originalEvent.preventDefault();
    var zoom = this.getSelectedZoom_(),
        fps = this.piskelController.getFPS();

    this.renderAsImageDataAnimatedGIF(zoom, fps, this.uploadImageData_.bind(this));
  };

  ns.GifExportController.prototype.onDownloadButtonClick_ = function (evt) {
    var zoom = this.getSelectedZoom_(),
        fps = this.piskelController.getFPS();

    this.renderAsImageDataAnimatedGIF(zoom, fps, this.downloadImageData_.bind(this));
  };

  ns.GifExportController.prototype.downloadImageData_ = function (imageData) {
    var fileName = this.piskelController.getPiskel().getDescriptor().name + '.gif';
    pskl.utils.BlobUtils.dataToBlob(imageData, "image/gif", function(blob) {
      pskl.utils.FileUtils.downloadAsFile(blob, fileName);
    });
  };

  ns.GifExportController.prototype.uploadImageData_ = function (imageData) {
    this.updatePreview_(imageData);
    this.previewContainerEl.classList.add("preview-upload-ongoing");

    console.log(imageData.length);

    pskl.app.imageUploadService.upload(imageData, this.onImageUploadCompleted_.bind(this), this.onImageUploadFailed_.bind(this));
  };

  ns.GifExportController.prototype.onImageUploadCompleted_ = function (imageUrl) {
    this.updatePreview_(imageUrl);
    this.updateStatus_(imageUrl);
    this.previewContainerEl.classList.remove("preview-upload-ongoing");
  };

  ns.GifExportController.prototype.onImageUploadFailed_ = function (event, xhr) {
    if (xhr.status === 500) {
      $.publish(Events.SHOW_NOTIFICATION, [{
        "content": "Upload failed : " + xhr.responseText,
        "hideDelay" : 5000
      }]);
    }
  };

  ns.GifExportController.prototype.updatePreview_ = function (src) {
    this.previewContainerEl.innerHTML = "<div><img style='max-width:32px;' src='"+src+"'/></div>";
  };

  ns.GifExportController.prototype.getSelectedZoom_ = function () {
    return this.selectResolutionEl.value;
  };

  ns.GifExportController.prototype.createOptionElements_ = function () {
    var resolutions = ns.GifExportController.RESOLUTIONS;
    for (var i = 0 ; i < resolutions.length ; i++) {
      var option = this.createOptionForResolution_(resolutions[i]);
      this.selectResolutionEl.appendChild(option);
    }
  };

  ns.GifExportController.prototype.createOptionForResolution_ = function (resolution) {
    var zoom = resolution.zoom;
    var label = zoom*this.piskelController.getWidth() + "x" + zoom*this.piskelController.getHeight();
    var value = zoom;

    var isSelected = zoom === DEFAULT_EXPORT_ZOOM;
    var selected = isSelected ? 'selected' : '';
    var optionHTML = pskl.utils.Template.replace(this.optionTemplate_, {value : value, label : label, selected : selected});
    var optionEl = pskl.utils.Template.createFromHTML(optionHTML);

    return optionEl;
  };

  ns.GifExportController.prototype.renderAsImageDataAnimatedGIF = function(zoom, fps, cb) {
    var colorCount = pskl.app.currentColorsService.getCurrentColors().length;
    var preserveColors = colorCount < MAX_GIF_COLORS;
    var gif = new window.GIF({
      workers: 5,
      quality: 1,
      width: this.piskelController.getWidth() * zoom,
      height: this.piskelController.getHeight() * zoom,
      preserveColors : preserveColors
    });

    for (var i = 0; i < this.piskelController.getFrameCount(); i++) {
      var frame = this.piskelController.getFrameAt(i);
      var canvasRenderer = new pskl.rendering.CanvasRenderer(frame, zoom);
      var canvas = canvasRenderer.render();
      gif.addFrame(canvas.getContext('2d'), {
        delay: 1000 / fps
      });
    }

    $.publish(Events.SHOW_PROGRESS, [{"name": 'Building animated GIF ...'}]);
    gif.on('progress', function(percentage) {
      $.publish(Events.UPDATE_PROGRESS, [{"progress": (percentage*100).toFixed(1)}]);
    }.bind(this));

    gif.on('finished', function(blob) {
      $.publish(Events.HIDE_PROGRESS);
      pskl.utils.FileUtils.readFile(blob, cb);
    }.bind(this));

    gif.render();
  };

  // FIXME : HORRIBLE COPY/PASTA

  ns.GifExportController.prototype.updateStatus_ = function (imageUrl, error) {
    if (imageUrl) {
      var linkTpl = "<a class='image-link' href='{{link}}' target='_blank'>{{shortLink}}</a>";
      var linkHtml = pskl.utils.Template.replace(linkTpl, {
        link : imageUrl,
        shortLink : this.shorten_(imageUrl, URL_MAX_LENGTH, '...')
      });
      this.uploadStatusContainerEl.innerHTML = 'Your image is now available at : ' + linkHtml;
    } else {
      // FIXME : Should display error message instead
    }
  };

  ns.GifExportController.prototype.shorten_ = function (url, maxLength, suffix) {
    if (url.length > maxLength) {
      var index = Math.round((maxLength-suffix.length) / 2);
      var part1 = url.substring(0, index);
      var part2 = url.substring(url.length - index, url.length);
      url = part1 + suffix + part2;
    }
    return url;
  };
})();;(function () {
  var ns = $.namespace("pskl.controller.settings");

  var URL_MAX_LENGTH = 60;

  ns.PngExportController = function (piskelController) {
    this.piskelController = piskelController;
  };

  ns.PngExportController.prototype.init = function () {
    this.previewContainerEl = document.querySelector(".png-export-preview");
    this.pngFilePrefixInput = document.getElementById('zip-prefix-name');
    this.pngFilePrefixInput.value = 'sprite_';

    document.querySelector(".png-download-button").addEventListener('click', this.onPngDownloadButtonClick_.bind(this));

    document.querySelector(".zip-generate-button").addEventListener('click', this.onZipButtonClick_.bind(this));

    this.updatePreview_(this.getFramesheetAsCanvas().toDataURL("image/png"));
  };

  ns.PngExportController.prototype.onPngDownloadButtonClick_ = function (evt) {
    var fileName = this.getPiskelName_() + '.png';
    pskl.utils.BlobUtils.canvasToBlob(this.getFramesheetAsCanvas(), function(blob) {
      pskl.utils.FileUtils.downloadAsFile(blob, fileName);
    });
  };

  ns.PngExportController.prototype.onZipButtonClick_ = function () {
    var zip = new window.JSZip();

    for (var i = 0; i < this.piskelController.getFrameCount(); i++) {
      var frame = this.piskelController.getFrameAt(i);
      var canvas = this.getFrameAsCanvas_(frame);
      var basename = this.pngFilePrefixInput.value;
      var filename =  basename + (i+1) + ".png";
      zip.file(filename, pskl.utils.CanvasUtils.getBase64FromCanvas(canvas) + '\n', {base64: true});
    }

    var fileName = this.getPiskelName_() + '.zip';

    var blob = zip.generate({type:"blob"});
    pskl.utils.FileUtils.downloadAsFile(blob, fileName);
  };

  ns.PngExportController.prototype.getFrameAsCanvas_ = function (frame) {
    var canvasRenderer = new pskl.rendering.CanvasRenderer(frame, 1);
    canvasRenderer.drawTransparentAs(Constants.TRANSPARENT_COLOR);
    return canvasRenderer.render();
  };

  ns.PngExportController.prototype.getPiskelName_ = function () {
    return this.piskelController.getPiskel().getDescriptor().name;
  };

  ns.PngExportController.prototype.getFramesheetAsCanvas = function () {
    var renderer = new pskl.rendering.PiskelRenderer(this.piskelController);
    return renderer.renderAsCanvas();
  };

  ns.PngExportController.prototype.onImageUploadCompleted_ = function (imageUrl) {
    this.updatePreview_(imageUrl);
    this.updateStatus_(imageUrl);
    this.previewContainerEl.classList.remove("preview-upload-ongoing");
  };

  ns.PngExportController.prototype.updateStatus_ = function (imageUrl, error) {
    if (imageUrl) {
      var linkTpl = "<a class='image-link' href='{{link}}' target='_blank'>{{shortLink}}</a>";
      var linkHtml = pskl.utils.Template.replace(linkTpl, {
        link : imageUrl,
        shortLink : this.shorten_(imageUrl, URL_MAX_LENGTH, '...')
      });
      this.uploadStatusContainerEl.innerHTML = 'Your image is now available at : ' + linkHtml;
    } else {
      // FIXME : Should display error message instead
    }
  };

  ns.PngExportController.prototype.updatePreview_ = function (src) {
    this.previewContainerEl.innerHTML = "<img class='light-picker-background' style='max-width:240px;' src='"+src+"'/>";
  };

  ns.PngExportController.prototype.shorten_ = function (url, maxLength, suffix) {
    if (url.length > maxLength) {
      url = url.substring(0, maxLength);
      url += suffix;
    }
    return url;
  };
})();
;(function () {
  var ns = $.namespace('pskl.controller.settings');

  ns.SaveController = function (piskelController) {
    this.piskelController = piskelController;
  };

  /**
   * @public
   */
  ns.SaveController.prototype.init = function () {

    // Only available in app-engine mode ...
    this.piskelName = document.querySelector('.piskel-name');

    this.saveOnlineStatus = $('#save-online-status');

    this.saveFileStatus = $('#save-file-status');
    this.timestamp = new Date();

    var descriptor = this.piskelController.getPiskel().getDescriptor();
    this.descriptionInput = $('#save-description');
    this.descriptionInput.val(descriptor.description);

    this.isPublicCheckbox = $('input[name=save-public-checkbox]');
    this.isPublicCheckbox.prop('checked', descriptor.isPublic);

    this.saveFileButton = $('#save-file-button');
    this.saveFileButton.click(this.saveFile_.bind(this));

    this.saveLocalButton = $('#save-browser-button');
    this.saveLocalButton.click(this.saveLocal_.bind(this));

    this.saveOnlineButton = $('#save-online-button');
    this.saveOnlineButton.click(this.saveOnline_.bind(this));

    this.saveForm = $('form[name=save-form]');
    this.saveForm.submit(this.onSaveFormSubmit_.bind(this));

    this.nameInput =  $('#save-name');
    this.nameInput.val(descriptor.name);
    this.nameInput.keyup(this.updateLocalStatusFilename_.bind(this));

    if (!pskl.app.isLoggedIn()) {
      this.saveOnlineButton.hide();
      $('.save-public-section').hide();
      this.saveOnlineStatus.html(pskl.utils.Template.get('save-please-login-partial'));
    } else {
      this.saveOnlineStatus.html(pskl.utils.Template.get('save-online-status-partial'));
    }

    this.updateLocalStatusFilename_();
  };

  ns.SaveController.prototype.updateLocalStatusFilename_ = function () {
    this.saveFileStatus.html(pskl.utils.Template.getAndReplace('save-file-status-template', {
      name : this.getLocalFilename_()
    }));
  };

  ns.SaveController.prototype.getLocalFilename_ = function () {
    var piskelName = this.getName();
    var timestamp = pskl.utils.DateUtils.format(this.timestamp, "{{Y}}{{M}}{{D}}-{{H}}{{m}}{{s}}");
    return piskelName + "-" + timestamp + ".piskel";
  };

  ns.SaveController.prototype.onSaveFormSubmit_ = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    if (pskl.app.isLoggedIn()) {
      this.saveOnline_();
    } else {
      this.saveLocal_();
    }

  };

  ns.SaveController.prototype.saveOnline_ = function () {
    var name = this.getName();

    if (!name) {
      name = window.prompt('Please specify a name', 'New piskel');
    }

    if (name) {
      var description = this.getDescription();
      var isPublic = !!this.isPublicCheckbox.prop('checked');

      var descriptor = new pskl.model.piskel.Descriptor(name, description, isPublic);
      this.piskelController.getPiskel().setDescriptor(descriptor);

      this.beforeSaving_();

      this.saveOnlineButton.attr('disabled', true);
      this.saveOnlineStatus.html('Saving ...');

      pskl.app.storageService.store({
        success : this.onSaveSuccess_.bind(this),
        error : this.onSaveError_.bind(this),
        after : this.afterOnlineSaving_.bind(this)
      });
    }
  };

  ns.SaveController.prototype.saveLocal_ = function () {
    var localStorageService = pskl.app.localStorageService;
    var isOk = true;
    var name = this.getName();
    var description = this.getDescription();
    if (localStorageService.getPiskel(name)) {
      isOk = window.confirm('There is already a piskel saved as ' + name + '. Override ?');
    }

    if (isOk) {
      this.beforeSaving_();
      localStorageService.save(name, description, pskl.app.piskelController.serialize());
      window.setTimeout(function () {
        this.onSaveSuccess_();
        this.afterSaving_();
      }.bind(this), 500);
    }
  };

  ns.SaveController.prototype.saveFile_ = function () {
    this.beforeSaving_();
    pskl.utils.BlobUtils.stringToBlob(pskl.app.piskelController.serialize(), function(blob) {
      pskl.utils.FileUtils.downloadAsFile(blob, this.getLocalFilename_());
      this.onSaveSuccess_();
      this.afterSaving_();
    }.bind(this), "application/piskel+json");
  };

  ns.SaveController.prototype.getName = function () {
    return this.nameInput.val();
  };

  ns.SaveController.prototype.getDescription = function () {
    return this.descriptionInput.val();
  };

  ns.SaveController.prototype.beforeSaving_ = function () {
    this.updatePiskelDescriptor_();

    if (this.piskelName) {
      this.piskelName.classList.add('piskel-name-saving');
    }
  };

  ns.SaveController.prototype.updatePiskelDescriptor_ = function () {
    var name = this.getName();
    var description = this.getDescription();
    var isPublic = !!this.isPublicCheckbox.prop('checked');

    var descriptor = new pskl.model.piskel.Descriptor(name, description, isPublic);
    this.piskelController.getPiskel().setDescriptor(descriptor);
  };

  ns.SaveController.prototype.onSaveSuccess_ = function () {
    $.publish(Events.CLOSE_SETTINGS_DRAWER);
    $.publish(Events.SHOW_NOTIFICATION, [{"content": "Successfully saved !"}]);
    $.publish(Events.PISKEL_SAVED);
  };

  ns.SaveController.prototype.onSaveError_ = function (status) {
    $.publish(Events.SHOW_NOTIFICATION, [{"content": "Saving failed ("+status+")"}]);
  };

  ns.SaveController.prototype.afterOnlineSaving_ = function () {
    this.saveOnlineButton.attr('disabled', false);
    this.saveOnlineStatus.html('');
    this.afterSaving_();
  };

  ns.SaveController.prototype.afterSaving_ = function () {
    if (this.piskelName) {
      this.piskelName.classList.remove('piskel-name-saving');
    }

    window.setTimeout($.publish.bind($, Events.HIDE_NOTIFICATION), 5000);
  };
})();;(function () {
  var ns = $.namespace('pskl.controller.settings');

  ns.ImportController = function (piskelController) {
    this.piskelController = piskelController;
    this.importedImage_ = null;
  };

  ns.ImportController.prototype.init = function () {
    this.browseLocalButton = document.querySelector('.browse-local-button');
    this.browseLocalButton.addEventListener('click', this.onBrowseLocalClick_.bind(this));

    this.hiddenFileInput = $('[name=file-upload-input]');
    this.hiddenFileInput.change(this.onFileUploadChange_.bind(this));

    this.fileInputButton = $('.file-input-button');
    this.fileInputButton.click(this.onFileInputClick_.bind(this));

    this.hiddenOpenPiskelInput = $('[name=open-piskel-input]');
    this.hiddenOpenPiskelInput.change(this.onOpenPiskelChange_.bind(this));

    this.openPiskelInputButton = $('.open-piskel-button');
    this.openPiskelInputButton.click(this.onOpenPiskelClick_.bind(this));

    this.prevSessionContainer = $('.previous-session');
    this.previousSessionTemplate_ = pskl.utils.Template.get("previous-session-info-template");
    this.fillRestoreSession_();
  };

  ns.ImportController.prototype.closeDrawer_ = function () {
    $.publish(Events.CLOSE_SETTINGS_DRAWER);
  };
  ns.ImportController.prototype.onFileUploadChange_ = function (evt) {
    this.importPictureFromFile_();
  };

  ns.ImportController.prototype.onFileInputClick_ = function (evt) {
    this.hiddenFileInput.click();
  };

  ns.ImportController.prototype.onOpenPiskelChange_ = function (evt) {
    var files = this.hiddenOpenPiskelInput.get(0).files;
    if (files.length == 1) {
      this.openPiskelFile_(files[0]);
    }
  };

  ns.ImportController.prototype.onOpenPiskelClick_ = function (evt) {
    this.hiddenOpenPiskelInput.click();
  };

  ns.ImportController.prototype.onBrowseLocalClick_ = function (evt) {
    $.publish(Events.DIALOG_DISPLAY, 'browse-local');
    this.closeDrawer_();
  };

  ns.ImportController.prototype.openPiskelFile_ = function (file) {
    if (this.isPiskel_(file)){
      pskl.utils.PiskelFileUtils.loadFromFile(file, function (piskel, descriptor, fps) {
        piskel.setDescriptor(descriptor);
        pskl.app.piskelController.setPiskel(piskel);
        pskl.app.animationController.setFPS(fps);
      });
      this.closeDrawer_();
    }
  };

  ns.ImportController.prototype.importPictureFromFile_ = function () {
    var files = this.hiddenFileInput.get(0).files;
    if (files.length == 1) {
      var file = files[0];
      if (this.isImage_(file)) {
        $.publish(Events.DIALOG_DISPLAY, {
          dialogId : 'import-image',
          initArgs : file
        });
        this.closeDrawer_();
      } else {
        this.closeDrawer_();
        throw 'File is not an image : ' + file.type;
      }
    }
  };

  ns.ImportController.prototype.isImage_ = function (file) {
    return file.type.indexOf('image') === 0;
  };

  ns.ImportController.prototype.isPiskel_ = function (file) {
    return (/\.piskel$/).test(file.name);
  };

  ns.ImportController.prototype.fillRestoreSession_ = function () {
    var previousInfo = pskl.app.backupService.getPreviousPiskelInfo();
    if (previousInfo) {
      var info = {
        name : previousInfo.name,
        date : pskl.utils.DateUtils.format(previousInfo.date, "{{H}}:{{m}} - {{Y}}/{{M}}/{{D}}")
      };

      this.prevSessionContainer.html(pskl.utils.Template.replace(this.previousSessionTemplate_, info));
      $(".restore-session-button").click(this.onRestorePreviousSessionClick_.bind(this));
    } else {
      this.prevSessionContainer.html("No piskel backup was found on this browser.");
    }
  };

  ns.ImportController.prototype.onRestorePreviousSessionClick_ = function () {
    if (window.confirm('This will erase your current workspace. Continue ?')) {
      pskl.app.backupService.load();
      $.publish(Events.CLOSE_SETTINGS_DRAWER);
    }
  };

})();;(function () {
  var ns = $.namespace('pskl.controller.settings');

  var settings = {
    'user' : {
      template : 'templates/settings/application.html',
      controller : ns.ApplicationSettingsController
    },
    'resize' : {
      template : 'templates/settings/resize.html',
      controller : ns.ResizeController
    },
    'export' : {
      template : 'templates/settings/export.html',
      controller : ns.ImageExportController
    },
    'import' : {
      template : 'templates/settings/import.html',
      controller : ns.ImportController
    },
    'localstorage' : {
      template : 'templates/settings/localstorage.html',
      controller : ns.LocalStorageController
    },
    'save' : {
      template : 'templates/settings/save.html',
      controller : ns.SaveController
    }
  };

  var SEL_SETTING_CLS = 'has-expanded-drawer';
  var EXP_DRAWER_CLS = 'expanded';

  ns.SettingsController = function (piskelController) {
    this.piskelController = piskelController;
    this.drawerContainer = document.getElementById('drawer-container');
    this.settingsContainer = $('[data-pskl-controller=settings]');
    this.isExpanded = false;
    this.currentSetting = null;
  };

  /**
   * @public
   */
  ns.SettingsController.prototype.init = function() {
    $('[data-setting]').click(this.onSettingIconClick.bind(this));
    $('body').click(this.onBodyClick.bind(this));
    $.subscribe(Events.CLOSE_SETTINGS_DRAWER, this.closeDrawer.bind(this));
  };

  ns.SettingsController.prototype.onSettingIconClick = function (evt) {
    var el = evt.originalEvent.currentTarget;
    var setting = el.getAttribute('data-setting');
    if (this.currentSetting != setting) {
      this.loadSetting(setting);
    } else {
      this.closeDrawer();
    }
    evt.originalEvent.stopPropagation();
    evt.originalEvent.preventDefault();
  };

  ns.SettingsController.prototype.onBodyClick = function (evt) {
    var target = evt.target;

    var isInDrawerContainer = pskl.utils.Dom.isParent(target, this.drawerContainer);
    var isInSettingsIcon = target.getAttribute('data-setting');
    var isInSettingsContainer = isInDrawerContainer || isInSettingsIcon;

    if (this.isExpanded && !isInSettingsContainer) {
      this.closeDrawer();
    }
  };

  ns.SettingsController.prototype.loadSetting = function (setting) {
    this.drawerContainer.innerHTML = pskl.utils.Template.get(settings[setting].template);
    (new settings[setting].controller(this.piskelController)).init();

    this.settingsContainer.addClass(EXP_DRAWER_CLS);

    $('.' + SEL_SETTING_CLS).removeClass(SEL_SETTING_CLS);
    $('[data-setting='+setting+']').addClass(SEL_SETTING_CLS);

    this.isExpanded = true;
    this.currentSetting = setting;
  };

  ns.SettingsController.prototype.closeDrawer = function () {
    this.settingsContainer.removeClass(EXP_DRAWER_CLS);
    $('.' + SEL_SETTING_CLS).removeClass(SEL_SETTING_CLS);

    this.isExpanded = false;
    this.currentSetting = null;

    document.activeElement.blur();
  };

})();;(function () {
  var ns = $.namespace('pskl.controller.dialogs');

  ns.AbstractDialogController = function () {};


  ns.AbstractDialogController.prototype.init = function () {
    this.closeButton = document.querySelector('.dialog-close');
    this.closeButton.addEventListener('click', this.closeDialog.bind(this));
  };

  ns.AbstractDialogController.prototype.destroy = function () {};

  ns.AbstractDialogController.prototype.closeDialog = function () {
    this.destroy();
    $.publish(Events.DIALOG_HIDE);
  };

  ns.AbstractDialogController.prototype.setTitle = function (title) {
    var dialogTitle = document.querySelector('.dialog-title');
    if (dialogTitle) {
      dialogTitle.innerText = title;
    }
  };

})();;(function () {
  var ns = $.namespace('pskl.controller.dialogs');

  ns.CreatePaletteController = function (piskelController) {
    this.paletteService = pskl.app.paletteService;
    this.paletteImportService = pskl.app.paletteImportService;
  };

  pskl.utils.inherit(ns.CreatePaletteController, ns.AbstractDialogController);

  ns.CreatePaletteController.prototype.init = function (paletteId) {
    this.superclass.init.call(this);

    this.hiddenFileInput = document.querySelector('.create-palette-import-input');
    this.nameInput = document.querySelector('input[name="palette-name"]');

    var buttonsContainer = document.querySelector('.create-palette-actions');
    var deleteButton = document.querySelector('.create-palette-delete');
    var downloadButton = document.querySelector('.create-palette-download-button');
    var importFileButton = document.querySelector('.create-palette-import-button');

    this.nameInput.addEventListener('input', this.onNameInputChange_.bind(this));
    this.hiddenFileInput.addEventListener('change', this.onFileInputChange_.bind(this));

    buttonsContainer.addEventListener('click', this.onButtonClick_.bind(this));
    downloadButton.addEventListener('click', this.onDownloadButtonClick_.bind(this));
    importFileButton.addEventListener('click', this.onImportFileButtonClick_.bind(this));

    var colorsListContainer = document.querySelector('.colors-container');
    this.colorsListWidget = new pskl.widgets.ColorsList(colorsListContainer);

    var palette;
    var isCurrentColorsPalette = paletteId == Constants.CURRENT_COLORS_PALETTE_ID;
    if (paletteId && !isCurrentColorsPalette) {
      importFileButton.style.display = 'none';
      this.setTitle('Edit Palette');

      var paletteObject = this.paletteService.getPaletteById(paletteId);
      palette = pskl.model.Palette.fromObject(paletteObject);
    } else {
      downloadButton.style.display = 'none';
      deleteButton.style.display = 'none';
      this.setTitle('Create Palette');

      var uuid = pskl.utils.Uuid.generate();
      if (isCurrentColorsPalette) {
        palette = new pskl.model.Palette(uuid, 'Current colors clone', this.getCurrentColors_());
      } else {
        palette = new pskl.model.Palette(uuid, 'New palette', []);
      }
    }

    this.setPalette_(palette);
  };

  ns.CreatePaletteController.prototype.getCurrentColors_ = function () {
    var palette = this.paletteService.getPaletteById(Constants.CURRENT_COLORS_PALETTE_ID);
    return palette.getColors();
  };

  ns.CreatePaletteController.prototype.setPalette_ = function (palette) {
    this.palette = palette;
    this.nameInput.value = pskl.utils.unescapeHtml(palette.name);
    this.colorsListWidget.setColors(palette.getColors());
  };

  ns.CreatePaletteController.prototype.destroy = function () {
    this.colorsListWidget.destroy();
    this.nameInput = null;
  };

  ns.CreatePaletteController.prototype.onButtonClick_ = function (evt) {
    var target = evt.target;
    if (target.dataset.action === 'submit') {
      this.saveAndSelectPalette_();
    } else if (target.dataset.action === 'cancel') {
      this.closeDialog();
    } else if (target.dataset.action === 'delete') {
      this.deletePalette_();
    }
  };

  ns.CreatePaletteController.prototype.saveAndSelectPalette_ = function () {
    this.palette.setColors(this.colorsListWidget.getColors());
    this.paletteService.savePalette(this.palette);
    pskl.UserSettings.set(pskl.UserSettings.SELECTED_PALETTE, this.palette.id);
    this.closeDialog();
  };

  ns.CreatePaletteController.prototype.deletePalette_ = function () {
    if (window.confirm('Are you sure you want to delete palette ' + this.palette.name)) {
      this.paletteService.deletePaletteById(this.palette.id);
      pskl.UserSettings.set(pskl.UserSettings.SELECTED_PALETTE, Constants.CURRENT_COLORS_PALETTE_ID);
      this.closeDialog();
    }
  };

  ns.CreatePaletteController.prototype.onDownloadButtonClick_ = function () {
    var paletteWriter = new pskl.service.palette.PaletteGplWriter(this.palette);
    var paletteAsString = paletteWriter.write();

    pskl.utils.BlobUtils.stringToBlob(paletteAsString, function(blob) {
      pskl.utils.FileUtils.downloadAsFile(blob, this.palette.name + '.gpl');
    }.bind(this), "application/json");
  };

  ns.CreatePaletteController.prototype.onImportFileButtonClick_ = function () {
    this.hiddenFileInput.click();
  };

  ns.CreatePaletteController.prototype.onFileInputChange_ = function (evt) {
    var files = this.hiddenFileInput.files;
    if (files.length == 1) {
      this.paletteImportService.read(files[0], this.setPalette_.bind(this), this.displayErrorMessage_.bind(this));
    }
  };

  ns.CreatePaletteController.prototype.displayErrorMessage_ = function (message) {
    message = "Could not import palette : " + message;
    $.publish(Events.SHOW_NOTIFICATION, [{"content": message}]);
    window.setTimeout($.publish.bind($, Events.HIDE_NOTIFICATION), 2000);
  };

  ns.CreatePaletteController.prototype.onNameInputChange_ = function (evt) {
    this.palette.name = pskl.utils.escapeHtml(this.nameInput.value);
  };
})();

/*;(function () {
  var ns = $.namespace('pskl.controller.dialogs');
  var PREVIEW_HEIGHT  = 60;

  ns.ImportImageController = function (piskelController) {
    this.importedImage_ = null;
    this.file_ = null;
  };

  pskl.utils.inherit(ns.ImportImageController, ns.AbstractDialogController);

  ns.ImportImageController.prototype.init = function (file) {
    this.superclass.init.call(this);

    this.file_ = file;

    this.importPreview = $('.import-section-preview');

    this.fileNameContainer = $('.import-image-file-name');

    this.resizeWidth = $('[name=resize-width]');
    this.resizeHeight = $('[name=resize-height]');
    this.smoothResize =  $('[name=smooth-resize-checkbox]');

    this.resizeWidth.keyup(this.onResizeInputKeyUp_.bind(this, 'width'));
    this.resizeHeight.keyup(this.onResizeInputKeyUp_.bind(this, 'height'));

    this.importImageForm = $('[name=import-image-form]');
    this.importImageForm.submit(this.onImportFormSubmit_.bind(this));

    pskl.utils.FileUtils.readImageFile(this.file_, this.onImageLoaded_.bind(this));
  };

  ns.ImportImageController.prototype.onImportFormSubmit_ = function (evt) {
    evt.originalEvent.preventDefault();
    this.importImageToPiskel_();
  };

  ns.ImportImageController.prototype.onResizeInputKeyUp_ = function (from, evt) {
    if (this.importedImage_) {
      this.synchronizeResizeFields_(evt.target.value, from);
    }
  };

  ns.ImportImageController.prototype.synchronizeResizeFields_ = function (value, from) {
    value = parseInt(value, 10);
    if (isNaN(value)) {
      value = 0;
    }
    var height = this.importedImage_.height, width = this.importedImage_.width;
    if (from === 'width') {
      this.resizeHeight.val(Math.round(value * height / width));
    } else {
      this.resizeWidth.val(Math.round(value * width / height));
    }
  };

  ns.ImportImageController.prototype.onImageLoaded_ = function (image) {
    this.importedImage_ = image;

    var w = this.importedImage_.width,
        h = this.importedImage_.height;

    // FIXME : We remove the onload callback here because JsGif will insert
    // the image again and we want to avoid retriggering the image onload
    this.importedImage_.onload = function () {};

    var fileName = this.extractFileNameFromPath_(this.file_.name);
    this.fileNameContainer.html(fileName);

    this.resizeWidth.val(w);
    this.resizeHeight.val(h);
    this.importPreview.width('auto');
    this.importPreview.html('');
    this.importPreview.append(this.createImagePreview_());

  };

  ns.ImportImageController.prototype.createImagePreview_ = function () {
    var image = document.createElement('IMG');
    image.src = this.importedImage_.src;
    image.setAttribute('height', PREVIEW_HEIGHT);
    return image;
  };

  ns.ImportImageController.prototype.extractFileNameFromPath_ = function (path) {
    var parts = [];
    if (path.indexOf('/') !== -1) {
      parts = path.split('/');
    } else if (path.indexOf('\\') !== -1) {
      parts = path.split('\\');
    } else {
      parts = [path];
    }
    return parts[parts.length-1];
  };

  ns.ImportImageController.prototype.importImageToPiskel_ = function () {
    var image = this.importedImage_;
    if (image) {
      //if (window.confirm('You are about to create a new Piskel, unsaved changes will be lost.')) {
        var gifLoader = new window.SuperGif({
          gif : image
        });

        gifLoader.load({
          success : function(){
            var images = gifLoader.getFrames().map(function (frame) {
              return pskl.utils.CanvasUtils.createFromImageData(frame.data);
            });
            this.createPiskelFromImages_(images);
            this.closeDialog();
          }.bind(this),
          error : function () {
            this.createPiskelFromImages_([image]);
            this.closeDialog();
          }.bind(this)
        });

      //}
    }
  };

  ns.ImportImageController.prototype.createFramesFromImages_ = function (images) {
    var w = this.resizeWidth.val();
    var h = this.resizeHeight.val();
    var smoothing = !!this.smoothResize.prop('checked');

    var frames = images.map(function (image) {
      var resizedImage = pskl.utils.ImageResizer.resize(image, w, h, smoothing);
      return pskl.utils.FrameUtils.createFromImage(resizedImage);
    });
  };

  ns.ImportImageController.prototype.createPiskelFromImages_ = function (images) {
    var frames = this.createFramesFromImages_(images);
    var layer = pskl.model.Layer.fromFrames('Layer 1', frames);
    var descriptor = new pskl.model.piskel.Descriptor('Imported piskel', '');
    var piskel = pskl.model.Piskel.fromLayers([layer], descriptor);

    pskl.app.piskelController.setPiskel(piskel);
    pskl.app.animationController.setFPS(Constants.DEFAULT.FPS);
  };
})();*/

;(function () {
  var ns = $.namespace('pskl.controller.dialogs');

  ns.BrowseLocalController = function (piskelController) {
  };

  pskl.utils.inherit(ns.BrowseLocalController, ns.AbstractDialogController);

  ns.BrowseLocalController.prototype.init = function () {
    this.superclass.init.call(this);

    this.localStorageItemTemplate_ = pskl.utils.Template.get("local-storage-item-template");

    this.service_ = pskl.app.localStorageService;
    this.piskelList = $('.local-piskel-list');
    this.prevSessionContainer = $('.previous-session');

    this.fillLocalPiskelsList_();

    this.piskelList.click(this.onPiskelsListClick_.bind(this));
  };

  ns.BrowseLocalController.prototype.onPiskelsListClick_ = function (evt) {
    var action = evt.target.getAttribute('data-action');
    var name = evt.target.getAttribute('data-name');
    if (action === 'load') {
      if (window.confirm('This will erase your current piskel. Continue ?')) {
        this.service_.load(name);
        this.closeDialog();
      }
    } else if (action === 'delete') {
      if (window.confirm('This will permanently DELETE this piskel from your computer. Continue ?')) {
        this.service_.remove(name);
        this.fillLocalPiskelsList_();
      }
    }
  };

  ns.BrowseLocalController.prototype.fillLocalPiskelsList_ = function () {
    var html = "";
    var keys = this.service_.getKeys();

    keys.sort(function (k1, k2) {
      if (k1.date < k2.date) {return 1;}
      if (k1.date > k2.date) {return -1;}
      return 0;
    });

    keys.forEach((function (key) {
      var date = pskl.utils.DateUtils.format(key.date, "{{Y}}/{{M}}/{{D}} {{H}}:{{m}}");
      html += pskl.utils.Template.replace(this.localStorageItemTemplate_, {name : key.name, date : date});
    }).bind(this));

    var tableBody_ = this.piskelList.get(0).tBodies[0];
    tableBody_.innerHTML = html;
  };
})();;(function () {
  var ns = $.namespace('pskl.controller.dialogs');

  var dialogs = {
    'create-palette' : {
      template : 'templates/dialogs/create-palette.html',
      controller : ns.CreatePaletteController
    },
    'browse-local' : {
      template : 'templates/dialogs/browse-local.html',
      controller : ns.BrowseLocalController
    },
    'import-image' : {
      template : 'templates/dialogs/import-image.html',
      controller : ns.ImportImageController
    }
  };

  ns.DialogsController = function (piskelController) {
    this.piskelController = piskelController;
    this.currentDialog_ = null;
  };

  ns.DialogsController.prototype.init = function () {
    this.dialogContainer_ = document.getElementById('dialog-container');
    this.dialogWrapper_ = document.getElementById('dialog-container-wrapper');
    $.subscribe(Events.DIALOG_DISPLAY, this.onDialogDisplayEvent_.bind(this));
    $.subscribe(Events.DIALOG_HIDE, this.onDialogHideEvent_.bind(this));

    pskl.app.shortcutService.addShortcut('alt+P', this.onDialogDisplayEvent_.bind(this, null, 'create-palette'));

    this.dialogWrapper_.classList.add('animated');
  };

  ns.DialogsController.prototype.onDialogDisplayEvent_ = function (evt, args) {
    var dialogId, initArgs;
    if (typeof args === 'string') {
      dialogId = args;
    } else {
      dialogId = args.dialogId;
      initArgs = args.initArgs;
    }
    if (!this.isDisplayed()) {
      var config = dialogs[dialogId];
      if (config) {
        this.dialogContainer_.classList.add(dialogId);
        this.dialogContainer_.innerHTML = pskl.utils.Template.get(config.template);

        var controller = new config.controller(this.piskelController);
        controller.init(initArgs);

        this.showDialogWrapper_();
        this.currentDialog_ = {
          id : dialogId,
          controller : controller
        };
      } else {
        console.error('Could not find dialog configuration for dialogId : ' + dialogId);
      }
    }
  };

  ns.DialogsController.prototype.onDialogHideEvent_ = function () {
    this.hideDialog();
  };

  ns.DialogsController.prototype.showDialogWrapper_ = function () {
    pskl.app.shortcutService.addShortcut('ESC', this.hideDialog.bind(this));
    this.dialogWrapper_.classList.add('show');
  };

  ns.DialogsController.prototype.hideDialog = function () {
    var currentDialog = this.currentDialog_;
    if (currentDialog) {
      currentDialog.controller.destroy();
      var dialogId = this.currentDialog_.id;
      window.setTimeout(function () {
        this.dialogContainer_.classList.remove(dialogId);
      }.bind(this), 800);
    }

    this.hideDialogWrapper_();
    this.currentDialog_ = null;
  };

  ns.DialogsController.prototype.hideDialogWrapper_ = function () {
    pskl.app.shortcutService.removeShortcut('ESC');
    this.dialogWrapper_.classList.remove('show');
  };

  ns.DialogsController.prototype.isDisplayed = function () {
    return this.currentDialog_ !== null;
  };

})();;(function () {
  var ns = $.namespace('pskl.widgets');

  var DEFAULT_COLOR = '#000000';

  ns.ColorsList = function (container) {
    this.selectedIndex = -1;
    this.palette = new pskl.model.Palette('tmp', 'tmp', []);
    this.container = container;

    this.colorsList = this.container.querySelector('.colors-list');
    this.colorPreviewEl = this.container.querySelector('.color-preview');

    $(container).sortable({
      placeholder: 'colors-list-drop-proxy',
      update: this.onColorDrop_.bind(this),
      items: '.create-palette-color'
    });

    this.colorsList.addEventListener('click', this.onColorContainerClick_.bind(this));

    var colorPickerContainer = container.querySelector('.color-picker-container');
    this.hslRgbColorPicker = new pskl.widgets.HslRgbColorPicker(colorPickerContainer, this.onColorUpdated_.bind(this));
    this.hslRgbColorPicker.init();
  };

  ns.ColorsList.prototype.setColors = function (colors) {
    if (colors.length === 0) {
      colors.push(DEFAULT_COLOR);
    }

    this.palette.setColors(colors);

    this.selectColor_(0);
    this.refresh_();
  };

  ns.ColorsList.prototype.getColors = function () {
    return this.palette.getColors();
  };

  ns.ColorsList.prototype.destroy = function () {
    this.hslRgbColorPicker.destroy();
    this.container = null;
    this.colorsList = null;
    this.colorPreviewEl = null;
  };

  /**
   * Lightweight refresh only changing the color of one element of the palette color list
   */
  ns.ColorsList.prototype.refreshColorElement_ = function (index) {
    var color = this.palette.get(this.selectedIndex);
    var element = document.querySelector('[data-palette-index="'+index+'"]');
    if (element) {
      element.style.background = color;
      element.classList.toggle('light-color', this.isLight_(color));
    }
  };

  ns.ColorsList.prototype.onColorContainerClick_ = function (evt) {
    var target = evt.target;
    if (target.classList.contains('create-palette-color')) {
      this.onPaletteColorClick_(evt, target);
    } else if (target.classList.contains('create-palette-new-color')) {
      this.onNewColorClick_(evt, target);
    } else if (target.classList.contains('create-palette-remove-color')) {
      this.onRemoveColorClick_(evt, target);
    }
    this.refresh_();
  };

  ns.ColorsList.prototype.onColorUpdated_ = function (color) {
    var rgbColor = color.toRgbString();
    this.colorPreviewEl.style.background = rgbColor;
    if (this.palette) {
      this.palette.set(this.selectedIndex, rgbColor);
      this.refreshColorElement_(this.selectedIndex);
    }
  };

  ns.ColorsList.prototype.onPaletteColorClick_ = function (evt, target) {
    var index = parseInt(target.dataset.paletteIndex,10);
    this.selectColor_(index);
  };

  ns.ColorsList.prototype.onRemoveColorClick_ = function (evt, target) {
    var colorElement = target.parentNode;
    var index = parseInt(colorElement.dataset.paletteIndex,10);
    this.removeColor_(index);
  };

  ns.ColorsList.prototype.onNewColorClick_ = function (evt, target) {
    var newColor = this.palette.get(this.selectedIndex) || '#000000';
    this.palette.add(newColor);
    this.selectColor_(this.palette.size()-1);
  };

  ns.ColorsList.prototype.refresh_ = function () {
    var html = "";
    var tpl = pskl.utils.Template.get('create-palette-color-template');
    var colors = this.palette.getColors();

    colors.forEach(function (color, index) {
      var isSelected = (index === this.selectedIndex);

      html += pskl.utils.Template.replace(tpl, {
        'color':color, index:index,
        ':selected':isSelected,
        ':light-color':this.isLight_(color)
      });
    }.bind(this));

    html += '<li class="create-palette-new-color">+</li>';

    this.colorsList.innerHTML = html;
  };

  ns.ColorsList.prototype.selectColor_ = function (index) {
    this.selectedIndex = index;
    this.hslRgbColorPicker.setColor(this.palette.get(index));
  };

  ns.ColorsList.prototype.removeColor_ = function (index) {
    this.palette.removeAt(index);
    this.refresh_();
  };

  ns.ColorsList.prototype.isLight_ = function (color) {
    var rgb = window.tinycolor(color).toRgb();
    return rgb.r+rgb.b+rgb.g > 128*3;
  };

  ns.ColorsList.prototype.onColorDrop_ = function (evt, drop) {
    var colorElement = drop.item.get(0);

    var oldIndex = parseInt(colorElement.dataset.paletteIndex, 10);
    var newIndex = $('.create-palette-color').index(drop.item);
    this.palette.move(oldIndex, newIndex);

    this.selectedIndex = newIndex;

    this.refresh_();
  };
})();;(function () {
  var ns = $.namespace('pskl.widgets');

  ns.HslRgbColorPicker = function (container, colorUpdatedCallback) {
    this.container = container;
    this.colorUpdatedCallback = colorUpdatedCallback;
    this.lastInputTimestamp_ = 0;
  };

  ns.HslRgbColorPicker.prototype.init = function () {
    var isChromeOrFirefox = pskl.utils.UserAgent.isChrome || pskl.utils.UserAgent.isFirefox;
    var changeEvent = isChromeOrFirefox ? 'input' : 'change';
    this.container.addEventListener(changeEvent, this.onPickerChange_.bind(this));
    this.container.addEventListener('keydown', this.onKeydown_.bind(this));

    this.spectrumEl = this.container.querySelector('.color-picker-spectrum');

    $(this.spectrumEl).spectrum({
        flat: true,
        showInput: true,
        showButtons: false,
        move : this.setColor.bind(this),
        change : this.setColor.bind(this),
        preferredFormat: 'hex'
    });

    this.setColor("#000000");
  };

  ns.HslRgbColorPicker.prototype.destroy = function () {
    this.container = null;
    this.spectrumEl = null;
  };

  ns.HslRgbColorPicker.prototype.onPickerChange_ = function (evt) {
    var target = evt.target;

    var model = target.dataset.model;
    var dimension = target.dataset.dimension;

    var value = parseInt(target.value, 10);
    if (dimension === 'v' || dimension === 's') {
      value = value/100;
    }

    var color;
    if (model === 'rgb') {
      color = this.tinyColor.toRgb();
    } else if (model === 'hsv') {
      color = this.hsvColor;
    }

    if (isNaN(value)) {
      value = color[dimension];
    } else {
      color[dimension] = value;
    }

    this.setColor(color);
  };

  ns.HslRgbColorPicker.prototype.onKeydown_ = function (evt) {
    var target = evt.target;

    if (target.getAttribute('type').toLowerCase() === 'text') {
      var value = parseInt(target.value, 10);
      var dimension = target.dataset.dimension;

      var key = pskl.service.keyboard.KeycodeTranslator.toChar(evt.keyCode);
      if (key === 'up') {
        value = value + 1;
      } else if (key === 'down') {
        value = value - 1;
      }

      value = this.normalizeDimension_(value, dimension);

      target.value = value;
      this.onPickerChange_(evt);
    }
  };

  ns.HslRgbColorPicker.prototype.setColor = function (inputColor) {
    if (!this.unplugged) {
      this.unplugged = true;

      this.hsvColor = this.toHsvColor_(inputColor);
      this.tinyColor = this.toTinyColor_(inputColor);

      this.updateInputs();
      $(".color-picker-spectrum").spectrum("set", this.tinyColor);

      this.colorUpdatedCallback(this.tinyColor);

      this.unplugged = false;
    }
  };

  ns.HslRgbColorPicker.prototype.updateInputs = function () {
    var inputs = this.container.querySelectorAll('input');
    var rgb = this.tinyColor.toRgb();


    for (var i = 0 ; i < inputs.length ; i++) {
      var input = inputs[i];
      var dimension = input.dataset.dimension;
      var model = input.dataset.model;

      if (model === 'rgb') {
        input.value = rgb[dimension];
      } else if (model === 'hsv') {
        var value = this.hsvColor[dimension];
        if (dimension === 'v' || dimension === 's') {
          value = 100 * value;
        }
        input.value = Math.round(value);
      }

      if (input.getAttribute('type') === 'range') {
        this.updateSliderBackground(input);
      }
    }
  };

  ns.HslRgbColorPicker.prototype.updateSliderBackground = function (slider) {
    var dimension = slider.dataset.dimension;
    var model = slider.dataset.model;

    var start, end;
    var isHueSlider = dimension === 'h';
    if (!isHueSlider) {
      var colors = this.getSliderBackgroundColors_(model, dimension);
      slider.style.backgroundImage = "linear-gradient(to right, " + colors.start + " 0, " + colors.end + " 100%)";
    }
  };

  ns.HslRgbColorPicker.prototype.getSliderBackgroundColors_ = function (model, dimension) {
    var start, end;
    if (model === 'hsv') {
      start = JSON.parse(JSON.stringify(this.hsvColor));
      start[dimension] = 0;

      end = JSON.parse(JSON.stringify(this.hsvColor));
      end[dimension] = 1;
    } else {
      start = this.tinyColor.toRgb();
      start[dimension] = 0;

      end = this.tinyColor.toRgb();
      end[dimension] = 255;
    }

    return {
      start : window.tinycolor(start).toRgbString(),
      end : window.tinycolor(end).toRgbString()
    };
  };

  ns.HslRgbColorPicker.prototype.toTinyColor_ = function (color) {
    if (typeof color == "object" && color.hasOwnProperty("_tc_id")) {
      return color;
    } else {
      return window.tinycolor(JSON.parse(JSON.stringify(color)));
    }
  };

  ns.HslRgbColorPicker.prototype.toHsvColor_ = function (color) {
    var isHsvColor = ['h','s','v'].every(color.hasOwnProperty.bind(color));
    if (isHsvColor) {
      return {
        h : Math.max(0, Math.min(359, color.h)),
        s : Math.max(0, Math.min(1, color.s)),
        v : Math.max(0, Math.min(1, color.v))
      };
    } else {
      return this.toTinyColor_(color).toHsv();
    }
  };

  ns.HslRgbColorPicker.prototype.normalizeDimension_ = function (value, dimension) {
    var ranges = {
      'h' : [0, 359],
      's' : [0, 100],
      'v' : [0, 100],
      'r' : [0, 255],
      'g' : [0, 255],
      'b' : [0, 255]
    };
    var range = ranges[dimension];
    return Math.max(range[0], Math.min(range[1], value));
  } ;


})();;(function () {
  var ns = $.namespace("pskl.service");

  ns.LocalStorageService = function (piskelController) {

    if(piskelController === undefined) {
      throw "Bad LocalStorageService initialization: <undefined piskelController>";
    }
    this.piskelController = piskelController;
  };

  ns.LocalStorageService.prototype.init = function() {};

  ns.LocalStorageService.prototype.save = function(name, description, piskel) {
    this.removeFromKeys_(name);
    this.addToKeys_(name, description, Date.now());
    window.localStorage.setItem('etc/Piskel/piskel.' + name, piskel);
  };

  ns.LocalStorageService.prototype.load = function(name) {
    var piskelString = this.getPiskel(name);
    var key = this.getKey_(name);
    var serializedPiskel = JSON.parse(piskelString);
    // FIXME : should be moved to deserializer
    // Deserializer should call callback with descriptor + fps information
    var fps = serializedPiskel.piskel.fps;
    var description = serializedPiskel.piskel.description;

    pskl.utils.serialization.Deserializer.deserialize(serializedPiskel, function (piskel) {
      piskel.setDescriptor(new pskl.model.piskel.Descriptor(name, description, true));
      pskl.app.piskelController.setPiskel(piskel);
      pskl.app.animationController.setFPS(fps);
    });
  };

  ns.LocalStorageService.prototype.remove = function(name) {
    this.removeFromKeys_(name);
    window.localStorage.removeItem('etc/Piskel/piskel.' + name);
  };

  ns.LocalStorageService.prototype.saveKeys_ = function(keys) {
    window.localStorage.setItem('etc/Piskel/piskel.keys', JSON.stringify(keys));
  };

  ns.LocalStorageService.prototype.removeFromKeys_ = function(name) {
    var keys = this.getKeys();
    var otherKeys = keys.filter(function (key) {
      return key.name !== name;
    });

    this.saveKeys_(otherKeys);
  };

  ns.LocalStorageService.prototype.getKey_ = function(name) {
    var matches = this.getKeys().filter(function (key) {
      return key.name === name;
    });
    if (matches.length > 0) {
      return matches[0];
    } else {
      return null;
    }
  };

  ns.LocalStorageService.prototype.addToKeys_ = function(name, description, date) {
    var keys = this.getKeys();
    keys.push({
      name : name,
      description : description,
      date : date
    });
    this.saveKeys_(keys);
  };

  ns.LocalStorageService.prototype.getPiskel = function(name) {
    return window.localStorage.getItem('etc/Piskel/piskel.' + name);
  };

  ns.LocalStorageService.prototype.getKeys = function(name) {
    var keysString = window.localStorage.getItem('etc/Piskel/piskel.keys');
    return JSON.parse(keysString) || [];
  };

})();;(function () {
  var ns = $.namespace('pskl.service');

  ns.GithubStorageService = function (piskelController) {
    this.piskelController = piskelController;
  };

  ns.GithubStorageService.prototype.init = function () {};

  ns.GithubStorageService.prototype.store = function (callbacks) {
    throw "Github save is no longer available. Use local save instead";
  };
})();;(function () {
  var ns = $.namespace('pskl.service');

  ns.AppEngineStorageService = function (piskelController) {
    this.piskelController = piskelController;
  };

  ns.AppEngineStorageService.prototype.init = function () {};

  ns.AppEngineStorageService.prototype.store = function (callbacks) {
    var piskel = this.piskelController.getPiskel();
    var descriptor = piskel.getDescriptor();

    var data = {
      framesheet : this.piskelController.serialize(),
      fps : this.piskelController.getFPS(),
      name : descriptor.name,
      description : descriptor.description,
      frames : this.piskelController.getFrameCount(),
      first_frame_as_png : pskl.app.getFirstFrameAsPng(),
      framesheet_as_png : pskl.app.getFramesheetAsPng()
    };

    if (descriptor.isPublic) {
      data['public'] = true;
    }

    var success = function () {
      callbacks.success();
      callbacks.after();
    };

    var error = function (response) {
      callbacks.error(response.status);
      callbacks.after();
    };

    pskl.utils.Xhr.post(Constants.APPENGINE_SAVE_URL, data, success, error);
  };
})();;(function () {
  var ns = $.namespace('pskl.service');

  // 1 minute = 1000 * 60
  var BACKUP_INTERVAL = 1000 * 60;

  ns.BackupService = function (piskelController) {
    this.piskelController = piskelController;
    this.lastHash = null;
  };

  ns.BackupService.prototype.init = function () {
    var previousPiskel = window.localStorage.getItem('etc/Piskel/bkp.next.piskel');
    var previousInfo = window.localStorage.getItem('etc/Piskel/bkp.next.info');
    if (previousPiskel && previousInfo) {
      this.savePiskel_('prev', previousPiskel, previousInfo);
    }

    window.setInterval(this.backup.bind(this), BACKUP_INTERVAL);
  };

  ns.BackupService.prototype.backup = function () {
    var piskel = this.piskelController.getPiskel();
    var descriptor = piskel.getDescriptor();
    var hash = piskel.getHash();
    var info = {
      name : descriptor.name,
      description : descriptor.info,
      fps : this.piskelController.getFPS(),
      date : Date.now(),
      hash : hash
    };

    // Do not save an unchanged piskel
    if (hash !== this.lastHash) {
      this.lastHash = hash;
      this.savePiskel_('next', this.piskelController.serialize(), JSON.stringify(info));
    }
  };

  ns.BackupService.prototype.getPreviousPiskelInfo = function () {
    var previousInfo = window.localStorage.getItem('etc/Piskel/bkp.prev.info');
    if (previousInfo) {
      return JSON.parse(previousInfo);
    }
  };

  ns.BackupService.prototype.load = function() {

    var previousPiskel = window.localStorage.getItem('etc/Piskel/bkp.prev.piskel');
    var previousInfo = window.localStorage.getItem('etc/Piskel/bkp.prev.info');

    previousPiskel = JSON.parse(previousPiskel);
    previousInfo = JSON.parse(previousInfo);

    pskl.utils.serialization.Deserializer.deserialize(previousPiskel, function (piskel) {
      piskel.setDescriptor(new pskl.model.piskel.Descriptor(previousInfo.name, previousInfo.description, true));
      pskl.app.piskelController.setPiskel(piskel);
      pskl.app.animationController.setFPS(previousInfo.fps);
    });
  };

  ns.BackupService.prototype.savePiskel_ = function (type, piskel, info) {
    try {
      window.localStorage.setItem('etc/Piskel/bkp.' + type +'.piskel', piskel);
      window.localStorage.setItem('etc/Piskel/bkp.' + type +'.info', info);
    } catch (e) {
      console.error('Could not save piskel backup in localStorage.', e);
    }
  };
})();




;(function () {
  var ns = $.namespace('pskl.service');

  ns.BeforeUnloadService = function (piskelController) {
    this.piskelController = piskelController;
  };


  ns.BeforeUnloadService.prototype.init = function () {
    //window.addEventListener("beforeunload", this.onBeforeUnload.bind(this));
  };

  ns.BeforeUnloadService.prototype.onBeforeUnload = function (evt) {
    pskl.app.backupService.backup();
    if (pskl.app.savedStatusService.isDirty()) {
      var confirmationMessage = "Your Piskel seems to have unsaved changes";

      (evt || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    }
  };

})();;(function () {
  var ns = $.namespace('pskl.service');

  ns.HistoryService = function (piskelController, shortcutService, deserializer) {
    this.piskelController = piskelController || pskl.app.piskelController;
    this.shortcutService = shortcutService || pskl.app.shortcutService;
    this.deserializer = deserializer || pskl.utils.serialization.Deserializer;

    this.stateQueue = [];
    this.currentIndex = -1;

    this.lastLoadState = -1;

    this.saveNextAsSnapshot = false;
  };

  ns.HistoryService.SNAPSHOT = 'SNAPSHOT';
  ns.HistoryService.REPLAY = 'REPLAY';
  ns.HistoryService.SNAPSHOT_PERIOD = 50;
  ns.HistoryService.LOAD_STATE_INTERVAL = 50;
  /**
   * This event alters the state (frames, layers) of the piskel. The event is triggered before the execution of associated command.
   * Don't store snapshots for such events.
   */
  ns.HistoryService.REPLAY_NO_SNAPSHOT = 'REPLAY_NO_SNAPSHOT';

  ns.HistoryService.prototype.init = function () {
    $.subscribe(Events.PISKEL_SAVE_STATE, this.onSaveStateEvent.bind(this));

    this.shortcutService.addShortcut('ctrl+Z', this.undo.bind(this));
    this.shortcutService.addShortcut('ctrl+Y', this.redo.bind(this));

    this.saveState({
      type : ns.HistoryService.SNAPSHOT
    });
  };

  ns.HistoryService.prototype.onSaveStateEvent = function (evt, stateInfo) {
    this.saveState(stateInfo);
  };

  ns.HistoryService.prototype.saveState = function (stateInfo) {
    this.stateQueue = this.stateQueue.slice(0, this.currentIndex + 1);
    this.currentIndex = this.currentIndex + 1;

    var state = {
      action : stateInfo,
      frameIndex : this.piskelController.currentFrameIndex,
      layerIndex : this.piskelController.currentLayerIndex
    };

    var isSnapshot = stateInfo.type === ns.HistoryService.SNAPSHOT;
    var isNoSnapshot = stateInfo.type === ns.HistoryService.REPLAY_NO_SNAPSHOT;
    var isAtAutoSnapshotInterval = this.currentIndex % ns.HistoryService.SNAPSHOT_PERIOD === 0 || this.saveNextAsSnapshot;
    if (isNoSnapshot && isAtAutoSnapshotInterval) {
      this.saveNextAsSnapshot = true;
    } else if (isSnapshot || isAtAutoSnapshotInterval) {
      state.piskel = this.piskelController.serialize(true);
      this.saveNextAsSnapshot = false;
    }

    this.stateQueue.push(state);
  };

  ns.HistoryService.prototype.undo = function () {
    this.loadState(this.currentIndex - 1);
  };

  ns.HistoryService.prototype.redo = function () {
    this.loadState(this.currentIndex + 1);
  };

  ns.HistoryService.prototype.isLoadStateAllowed_ = function (index) {
    var timeOk = (Date.now() - this.lastLoadState) > ns.HistoryService.LOAD_STATE_INTERVAL;
    var indexInRange = index >= 0 && index < this.stateQueue.length;
    return timeOk && indexInRange;
  };

  ns.HistoryService.prototype.getPreviousSnapshotIndex_ = function (index) {
    while (this.stateQueue[index] && !this.stateQueue[index].piskel) {
      index = index - 1;
    }
    return index;
  };

  ns.HistoryService.prototype.loadState = function (index) {
    try {
      if (this.isLoadStateAllowed_(index)) {
        this.lastLoadState = Date.now();

        var snapshotIndex = this.getPreviousSnapshotIndex_(index);
        if (snapshotIndex < 0) {
          throw 'Could not find previous SNAPSHOT saved in history stateQueue';
        }
        var serializedPiskel = this.getSnapshotFromState_(snapshotIndex);
        var onPiskelLoadedCb = this.onPiskelLoaded_.bind(this, index, snapshotIndex);
        this.deserializer.deserialize(serializedPiskel, onPiskelLoadedCb);
      }
    } catch (e) {
      window.console.error("[CRITICAL ERROR] : Unable to load a history state.");
      if (typeof e === "string") {
        window.console.error(e);
      } else {
        window.console.error(e.message);
        window.console.error(e.stack);
      }
      this.stateQueue = [];
      this.currentIndex = -1;
    }
  };

  ns.HistoryService.prototype.getSnapshotFromState_ = function (stateIndex) {
    var state = this.stateQueue[stateIndex];
    var piskelSnapshot = state.piskel;

    // If the snapshot is stringified, parse it and backup the result for faster access next time
    // FIXME : Memory consumption might go crazy if we keep unpacking big piskels indefinitely
    // ==> should ensure I remove some of them :)
    if (typeof piskelSnapshot === "string") {
      piskelSnapshot = JSON.parse(piskelSnapshot);
      state.piskel = piskelSnapshot;
    }

    return piskelSnapshot;
  };

  ns.HistoryService.prototype.onPiskelLoaded_ = function (index, snapshotIndex, piskel) {
    var originalSize = this.getPiskelSize_();
    piskel.setDescriptor(this.piskelController.piskel.getDescriptor());
    this.piskelController.setPiskel(piskel);

    for (var i = snapshotIndex + 1 ; i <= index ; i++) {
      var state = this.stateQueue[i];
      this.setupState(state);
      this.replayState(state);
    }

    // Should only do this when going backwards
    var lastState = this.stateQueue[index+1];
    if (lastState) {
      this.setupState(lastState);
    }

    this.currentIndex = index;
    $.publish(Events.PISKEL_RESET);
    if (originalSize !== this.getPiskelSize_()) {
      $.publish(Events.FRAME_SIZE_CHANGED);
    }
  };

  ns.HistoryService.prototype.getPiskelSize_ = function () {
    return this.piskelController.getWidth() + 'x' + this.piskelController.getHeight();
  };

  ns.HistoryService.prototype.setupState = function (state) {
    this.piskelController.setCurrentFrameIndex(state.frameIndex);
    this.piskelController.setCurrentLayerIndex(state.layerIndex);
  };

  ns.HistoryService.prototype.replayState = function (state) {
    var action = state.action;
    var type = action.type;
    var layer = this.piskelController.getLayerAt(state.layerIndex);
    var frame = layer.getFrameAt(state.frameIndex);
    action.scope.replay(frame, action.replay);
  };

})();;(function () {
  var ns = $.namespace('pskl.service.color');

  var LOW_SAT = 0.1;
  var LOW_LUM = 0.1;
  var HI_LUM = 0.9;


  var HUE_STEP = 36;
  var HUE_BAGS = 10;
  var HUE_BOUNDS = [];
  for (var i = 0 ; i < HUE_BAGS ; i++) {
    HUE_BOUNDS.push(i * HUE_STEP);
  }

  ns.ColorSorter = function () {
    this.colorsHslMap_ = {};
  };

  ns.ColorSorter.prototype.sort = function (colors) {
    this.colorsHslMap_ = {};

    colors.forEach(function (color) {
      this.colorsHslMap_[color] = window.tinycolor(color).toHsl();
    }.bind(this));

    // sort by most frequent color
    var darkColors = colors.filter(function (c) {
      var hsl = this.colorsHslMap_[c];
      return hsl.l <= LOW_LUM;
    }.bind(this));

    var brightColors = colors.filter(function (c) {
      var hsl = this.colorsHslMap_[c];
      return hsl.l >= HI_LUM;
    }.bind(this));

    var desaturatedColors = colors.filter(function (c) {
      return brightColors.indexOf(c) === -1 && darkColors.indexOf(c) === -1;
    }).filter(function (c) {
      var hsl = this.colorsHslMap_[c];
      return hsl.s <= LOW_SAT;
    }.bind(this));

    darkColors = this.sortOnHslProperty_(darkColors, 'l');
    brightColors = this.sortOnHslProperty_(brightColors, 'l');
    desaturatedColors = this.sortOnHslProperty_(desaturatedColors, 'h');

    var sortedColors = darkColors.concat(brightColors, desaturatedColors);

    var regularColors = colors.filter(function (c) {
      return sortedColors.indexOf(c) === -1;
    });

    var regularColorsBags = HUE_BOUNDS.map(function (hue) {
      var bagColors = regularColors.filter(function (color) {
        var hsl = this.colorsHslMap_[color];
        return (hsl.h >= hue && hsl.h < hue + HUE_STEP);
      }.bind(this));

      return this.sortRegularColors_(bagColors);
    }.bind(this));

    return Array.prototype.concat.apply(sortedColors, regularColorsBags);
  };

  ns.ColorSorter.prototype.sortRegularColors_ = function (colors) {
    var sortedColors = colors.sort(function (c1, c2) {
      var hsl1 = this.colorsHslMap_[c1];
      var hsl2 = this.colorsHslMap_[c2];
      var hDiff = Math.abs(hsl1.h - hsl2.h);
      var sDiff = Math.abs(hsl1.s - hsl2.s);
      var lDiff = Math.abs(hsl1.l - hsl2.l);
      if (hDiff < 10) {
        if (sDiff > lDiff) {
          return this.compareValues_(hsl1.s, hsl2.s);
        } else {
          return this.compareValues_(hsl1.l, hsl2.l);
        }
      } else {
        return this.compareValues_(hsl1.h, hsl2.h);
      }
    }.bind(this));

    return sortedColors;
  };

  ns.ColorSorter.prototype.sortOnHslProperty_ = function (colors, property) {
    return colors.sort(function (c1, c2) {
      var hsl1 = this.colorsHslMap_[c1];
      var hsl2 = this.colorsHslMap_[c2];
      return this.compareValues_(hsl1[property], hsl2[property]);
    }.bind(this));
  };

  ns.ColorSorter.prototype.compareValues_ = function (v1, v2) {
    if (v1 > v2) {
      return 1;
    } else if (v1 < v2) {
      return -1;
    }
    return 0;
  };

})();;(function () {
  var ns = $.namespace('pskl.service.palette');

  ns.CurrentColorsPalette = function () {
    this.name = 'Current colors';
    this.id = Constants.CURRENT_COLORS_PALETTE_ID;
  };

  ns.CurrentColorsPalette.prototype.getColors = function () {
    return pskl.app.currentColorsService.getCurrentColors();
  };
})();;(function () {
  var ns = $.namespace('pskl.service.palette');

  ns.PaletteService = function () {
    this.dynamicPalettes = [];
    this.localStorageService = window.localStorage;
  };

  ns.PaletteService.prototype.getPalettes = function () {
    var palettesString = this.localStorageService.getItem('etc/Piskel/piskel.palettes');
    var palettes = JSON.parse(palettesString) || [];
    palettes = palettes.map(function (palette) {
      return pskl.model.Palette.fromObject(palette);
    });

    return this.dynamicPalettes.concat(palettes);
  };

  ns.PaletteService.prototype.getPaletteById = function (paletteId) {
    var palettes = this.getPalettes();
    return this.findPaletteInArray_(paletteId, palettes);
  };

  ns.PaletteService.prototype.savePalette = function (palette) {
    var palettes = this.getPalettes();
    var existingPalette = this.findPaletteInArray_(palette.id, palettes);
    if (existingPalette) {
      var currentIndex = palettes.indexOf(existingPalette);
      palettes.splice(currentIndex, 1, palette);
    } else {
      palettes.push(palette);
    }

    this.savePalettes_(palettes);

    $.publish(Events.SHOW_NOTIFICATION, [{"content": "Palette " + palette.name + " successfully saved !"}]);
    window.setTimeout($.publish.bind($, Events.HIDE_NOTIFICATION), 2000);
  };

  ns.PaletteService.prototype.addDynamicPalette = function (palette) {
    this.dynamicPalettes.push(palette);
  };

  ns.PaletteService.prototype.deletePaletteById = function (id) {
    var palettes = this.getPalettes();
    var filteredPalettes = palettes.filter(function (palette) {
      return palette.id !== id;
    });

    this.savePalettes_(filteredPalettes);
  };

  ns.PaletteService.prototype.savePalettes_ = function (palettes) {
    palettes = palettes.filter(function (palette) {
      return this.dynamicPalettes.indexOf(palette) === -1;
    }.bind(this));
    this.localStorageService.setItem('etc/Piskel/piskel.palettes', JSON.stringify(palettes));
    $.publish(Events.PALETTE_LIST_UPDATED);
  };

  ns.PaletteService.prototype.findPaletteInArray_ = function (paletteId, palettes) {
    var match = null;

    palettes.forEach(function (palette) {
      if (palette.id === paletteId) {
        match = palette;
      }
    });

    return match;
  };
})();;(function () {
  var ns = $.namespace('pskl.service.palette');

  ns.PaletteGplWriter = function (palette) {
    this.palette = palette;
  };

  ns.PaletteGplWriter.prototype.write = function () {
    var lines = [];
    lines.push('GIMP Palette');
    lines.push('Name: ' + this.palette.name);
    lines.push('Columns: 0');
    lines.push('#');
    this.palette.getColors().forEach(function (color) {
      lines.push(this.writeColorLine(color));
    }.bind(this));
    lines.push('\r\n');

    return lines.join('\r\n');
  };

  ns.PaletteGplWriter.prototype.writeColorLine = function (color) {
    var tinycolor = window.tinycolor(color);
    var rgb = tinycolor.toRgb();
    var strBuffer = [];
    strBuffer.push(this.padString(rgb.r, 3));
    strBuffer.push(this.padString(rgb.g, 3));
    strBuffer.push(this.padString(rgb.b, 3));
    strBuffer.push('Untitled');

    return strBuffer.join(' ');
  };

  ns.PaletteGplWriter.prototype.padString = function (str, size) {
    str = str.toString();
    var pad = (new Array(1+size-str.length)).join(' ');
    return pad + str;
  };

})();
;(function () {
  var ns = $.namespace('pskl.service.palette.reader');

  ns.AbstractPaletteFileReader = function (file, onSuccess, onError, colorLineRegexp) {
    this.file = file;
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.colorLineRegexp = colorLineRegexp;
  };

  ns.AbstractPaletteFileReader.prototype.extractColorFromLine = Constants.ABSTRACT_FUNCTION;

  ns.AbstractPaletteFileReader.prototype.read = function () {
    pskl.utils.FileUtils.readFile(this.file, this.onFileLoaded_.bind(this));
  };

  ns.AbstractPaletteFileReader.prototype.onFileLoaded_ = function (content) {
    var text = pskl.utils.Base64.toText(content);
    var lines = text.match(/[^\r\n]+/g);

    var colorLines = lines.filter(function (l) {
      return this.colorLineRegexp.test(l);
    }.bind(this));

    var colors = colorLines.map(this.extractColorFromLine.bind(this));

    if (colors.length) {
      var uuid = pskl.utils.Uuid.generate();
      var palette = new pskl.model.Palette(uuid, this.file.name, colors);
      this.onSuccess(palette);
    } else {
      this.onError();
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.service.palette.reader');

  var RE_COLOR_LINE = /^(\s*\d{1,3})(\s*\d{1,3})(\s*\d{1,3})/;
  var RE_EXTRACT_NAME = /^name\s*\:\s*(.*)$/i;

  ns.PaletteGplReader = function (file, onSuccess, onError) {
    this.superclass.constructor.call(this, file, onSuccess, onError, RE_COLOR_LINE);
  };

  pskl.utils.inherit(ns.PaletteGplReader, ns.AbstractPaletteFileReader);

  ns.PaletteGplReader.prototype.extractColorFromLine = function (line) {
    var matches = line.match(RE_COLOR_LINE);
    var color = window.tinycolor({
      r : parseInt(matches[1], 10),
      g : parseInt(matches[2], 10),
      b : parseInt(matches[3], 10)
    });

    return color.toRgbString();
  };
})();;(function () {
  var ns = $.namespace('pskl.service.palette.reader');

  ns.PaletteImageReader = function (file, onSuccess, onError) {
    this.file = file;
    this.onSuccess = onSuccess;
    this.onError = onError;

    this.colorSorter_ = new pskl.service.color.ColorSorter();
  };

  ns.PaletteImageReader.prototype.read = function () {
    pskl.utils.FileUtils.readImageFile(this.file, this.onImageLoaded_.bind(this));
  };

  ns.PaletteImageReader.prototype.onImageLoaded_ = function (image) {
    var imageProcessor = new pskl.worker.ImageProcessor(image,
      this.onWorkerSuccess_.bind(this),
      this.onWorkerStep_.bind(this),
      this.onWorkerError_.bind(this));

    $.publish(Events.SHOW_PROGRESS, [{"name": 'Processing image colors ...'}]);

    imageProcessor.process();
  };

  ns.PaletteImageReader.prototype.onWorkerSuccess_ = function (event) {
    var data = event.data;
    var colorsMap = data.colorsMap;

    var colors = Object.keys(colorsMap);

    if (colors.length > 256) {
      this.onError('Too many colors : ' + colors.length);
    } else {
      var uuid = pskl.utils.Uuid.generate();
      var sortedColors = this.colorSorter_.sort(colors);
      var palette = new pskl.model.Palette(uuid, this.file.name + ' palette', sortedColors);

      this.onSuccess(palette);
    }
    $.publish(Events.HIDE_PROGRESS);
  };

  ns.PaletteImageReader.prototype.onWorkerStep_ = function (event) {
    var progress = event.data.progress;
    $.publish(Events.UPDATE_PROGRESS, [{"progress": progress}]);
  };

  ns.PaletteImageReader.prototype.onWorkerError_ = function (event) {
    $.publish(Events.HIDE_PROGRESS);
    this.onError('Unable to process the image : ' + event.data.message);
  };
})();;(function () {
  var ns = $.namespace('pskl.service.palette.reader');

  var RE_COLOR_LINE = /^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})/;

  ns.PalettePalReader = function (file, onSuccess, onError) {
    this.superclass.constructor.call(this, file, onSuccess, onError, RE_COLOR_LINE);
  };

  pskl.utils.inherit(ns.PalettePalReader, ns.AbstractPaletteFileReader);

  ns.PalettePalReader.prototype.extractColorFromLine = function (line) {
    var matches = line.match(RE_COLOR_LINE);
    var color = 'rgb(' + matches[1] + ',' + matches[2] + ',' + matches[3] + ')';
    return color;
  };
})();;(function () {
  var ns = $.namespace('pskl.service.palette.reader');

  var RE_COLOR_LINE = /^[A-F0-9]{2}([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})/;

  ns.PaletteTxtReader = function (file, onSuccess, onError) {
    this.superclass.constructor.call(this, file, onSuccess, onError, RE_COLOR_LINE);
  };

  pskl.utils.inherit(ns.PaletteTxtReader, ns.AbstractPaletteFileReader);

  ns.PaletteTxtReader.prototype.extractColorFromLine = function (line) {
    var matches = line.match(RE_COLOR_LINE);
    var color = "#" + matches[1] + matches[2] + matches[3];
    return color;
  };
})();;(function () {
  var ns = $.namespace('pskl.service.palette');

  var fileReaders = {
    'gpl' : ns.reader.PaletteGplReader,
    'pal' : ns.reader.PalettePalReader,
    'txt' : ns.reader.PaletteTxtReader,
    'img' : ns.reader.PaletteImageReader
  };

  ns.PaletteImportService = function () {};

  ns.PaletteImportService.prototype.read = function (file, onSuccess, onError) {
    var reader = this.getReader_(file, onSuccess, onError);
    if (reader) {
      reader.read();
    } else {
      throw 'Could not find reader for file : ' + file.name;
    }
  };

  ns.PaletteImportService.prototype.isImage_ = function (file) {
    return file.type.indexOf('image') === 0;
  };

  ns.PaletteImportService.prototype.getReader_ = function (file, onSuccess, onError) {
    var readerClass = this.getReaderClass_(file);
    if (readerClass) {
      return new readerClass(file, onSuccess, onError);
    } else {
      return null;
    }
  };

  ns.PaletteImportService.prototype.getReaderClass_ = function (file) {
    var readerClass;
    if (this.isImage_(file)) {
      readerClass = fileReaders.img;
    } else {
      var extension = this.getExtension_(file);
      readerClass = fileReaders[extension];
    }
    return readerClass;
  };

  ns.PaletteImportService.prototype.getExtension_ = function (file) {
    var parts = file.name.split('.');
    var extension = parts[parts.length-1];
    return extension.toLowerCase();
  };
})();;(function () {
  var ns = $.namespace('pskl.service');

  ns.SavedStatusService = function (piskelController) {
    this.piskelController = piskelController;
  };

  ns.SavedStatusService.prototype.init = function () {
    $.subscribe(Events.TOOL_RELEASED, this.onToolReleased.bind(this));
    $.subscribe(Events.PISKEL_RESET, this.onPiskelReset.bind(this));

    $.subscribe(Events.PISKEL_SAVED, this.onPiskelSaved.bind(this));
  };

  ns.SavedStatusService.prototype.onPiskelReset = function () {
    var piskel = this.piskelController.getPiskel();
    // A first PISKEL_RESET is triggered during the load of a new Piskel, it should be ignored
    // putting a firstResetDone flag as a nasty workaround for this
    if (piskel.firstResetDone_) {
      this.updateDirtyStatus(true);
    } else {
      piskel.firstResetDone_ = true;
    }
  };

  ns.SavedStatusService.prototype.onToolReleased = function () {
    this.updateDirtyStatus(true);
  };

  ns.SavedStatusService.prototype.onPiskelSaved = function () {
    this.updateDirtyStatus(false);
  };

  ns.SavedStatusService.prototype.updateDirtyStatus = function (status) {
    var piskel = this.piskelController.getPiskel();
    if (piskel.isDirty_ !== status) {
      // Redraw piskel name only if dirty status actually changed
      piskel.isDirty_ = status;
      this.updatePiskelName();
    }
  };

  ns.SavedStatusService.prototype.updatePiskelName = function () {
    var piskel = this.piskelController.getPiskel();
    var name = piskel.getDescriptor().name;
    if (piskel.isDirty_) {
      $('.piskel-name').html(name + ' *');
    } else {
      $('.piskel-name').html(name);
    }
  };

  ns.SavedStatusService.prototype.isDirty = function (evt) {
    var piskel = this.piskelController.getPiskel();
    return piskel.isDirty_;
  };
})();;(function () {
  var ns = $.namespace('pskl.service.keyboard');

  ns.ShortcutService = function () {
    this.shortcuts_ = {};
  };

  /**
   * @public
   */
  ns.ShortcutService.prototype.init = function() {
    $(document.body).keydown($.proxy(this.onKeyUp_, this));
  };

  /**
   * Add a keyboard shortcut
   * @param {String}   rawKey   (case insensitive) key can be a meta (optional) + [a-z0-9] or
   *                            a special key (check list of supported keys in KeycodeTranslator)
   *                            eg. 'ctrl+A', 'del'
   * @param {Function} callback should return true to let the original event perform its default action
   */
  ns.ShortcutService.prototype.addShortcut = function (rawKey, callback) {
    var parsedKey = this.parseKey_(rawKey.toLowerCase());

    var key = parsedKey.key,
      meta = parsedKey.meta;

    this.shortcuts_[key] = this.shortcuts_[key] || {};

    if (this.shortcuts_[key][meta]) {
      var keyStr = (meta !== 'normal' ? meta + ' + ' : '') + key;
      console.error('[ShortcutService] >>> Shortcut [' + keyStr + '] already registered');
    } else {
      this.shortcuts_[key][meta] = callback;
    }
  };

  ns.ShortcutService.prototype.addShortcuts = function (keys, callback) {
    keys.forEach(function (key) {
      this.addShortcut(key, callback);
    }.bind(this));
  };

  ns.ShortcutService.prototype.removeShortcut = function (rawKey) {
    var parsedKey = this.parseKey_(rawKey.toLowerCase());

    var key = parsedKey.key,
      meta = parsedKey.meta;

    this.shortcuts_[key] = this.shortcuts_[key] || {};

    this.shortcuts_[key][meta] = null;
  };

  ns.ShortcutService.prototype.parseKey_ = function (key) {
    var meta = this.getMetaKey_({
      alt : key.indexOf('alt+') != -1,
      shift : key.indexOf('shift+') != -1,
      ctrl : key.indexOf('ctrl+') != -1
    });

    var parts = key.split(/\+(?!$)/);
    key = parts[parts.length-1];
    return {meta : meta, key : key};
  };

  ns.ShortcutService.prototype.getMetaKey_ = function (meta) {
    var keyBuffer = [];
    ['alt', 'ctrl', 'shift'].forEach(function (metaKey) {
      if (meta[metaKey]) {
        keyBuffer.push(metaKey);
      }
    });

    if (keyBuffer.length > 0) {
      return keyBuffer.join('+');
    } else {
      return 'normal';
    }
  };
  /**
   * @private
   */
  ns.ShortcutService.prototype.onKeyUp_ = function(evt) {
    if (!this.isInInput_(evt)) {
      // jquery names FTW ...
      var keycode = evt.which;
      var targetTagName = evt.target.nodeName.toUpperCase();
      var charkey = pskl.service.keyboard.KeycodeTranslator.toChar(keycode);

      var keyShortcuts = this.shortcuts_[charkey];
      if(keyShortcuts) {
        var meta = this.getMetaKey_({
          alt : this.isAltKeyPressed_(evt),
          shift : this.isShiftKeyPressed_(evt),
          ctrl : this.isCtrlKeyPressed_(evt)
        });
        var cb = keyShortcuts[meta];

        if(cb) {
          var bubble = cb(charkey);
          if (bubble !== true) {
            evt.preventDefault();
          }
        }
      }
    }
  };

  ns.ShortcutService.prototype.isInInput_ = function (evt) {
    var targetTagName = evt.target.nodeName.toUpperCase();
    return targetTagName === 'INPUT' || targetTagName === 'TEXTAREA';
  };

  ns.ShortcutService.prototype.isCtrlKeyPressed_ = function (evt) {
    return pskl.utils.UserAgent.isMac ? evt.metaKey : evt.ctrlKey;
  };

  ns.ShortcutService.prototype.isShiftKeyPressed_ = function (evt) {
    return evt.shiftKey;
  };

  ns.ShortcutService.prototype.isAltKeyPressed_ = function (evt) {
    return evt.altKey;
  };
})();;(function () {
  var specialKeys = {
    191 : "?",
    8 : "back",
    27 : "esc",
    38 : "up",
    40 : "down",
    46 : "del",
    189 : "-",
    187 : "+",
    188 : "<",
    190 : ">"
  };

  var ns = $.namespace('pskl.service.keyboard');

  ns.KeycodeTranslator= {
    toChar : function (keycode) {
      if (keycode >= 48 && keycode <= 57) {
        // key is 0-9
        return (keycode - 48) + "";
      } else if (keycode >= 65 && keycode <= 90) {
        // key is a-z, use base 36 to get the string representation
        return (keycode - 65 + 10).toString(36);
      } else {
        return specialKeys[keycode];
      }
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.service.keyboard');

  ns.CheatsheetService = function () {
    this.isDisplayed_ = false;
  };

  ns.CheatsheetService.prototype.init = function () {
    this.cheatsheetEl_ = document.getElementById('cheatsheet-wrapper');
    if (!this.cheatsheetEl_) {
      throw 'cheatsheetEl_ DOM element could not be retrieved';
    }
    this.initMarkup_();
    pskl.app.shortcutService.addShortcuts(['?', 'shift+?'], this.toggleCheatsheet_.bind(this));

    var link = $('.cheatsheet-link');
    link.click(this.toggleCheatsheet_.bind(this));


    $.subscribe(Events.TOGGLE_HELP, this.toggleCheatsheet_.bind(this));
    $.subscribe(Events.ESCAPE, this.onEscape_.bind(this));
  };

  ns.CheatsheetService.prototype.toggleCheatsheet_ = function () {
    if (this.isDisplayed_) {
      this.hideCheatsheet_();
    } else {
      this.showCheatsheet_();
    }
  };

  ns.CheatsheetService.prototype.onEscape_ = function () {
    if (this.isDisplayed_) {
      this.hideCheatsheet_();
    }
  };

  ns.CheatsheetService.prototype.showCheatsheet_ = function () {
    pskl.app.shortcutService.addShortcut('ESC', this.hideCheatsheet_.bind(this));
    this.cheatsheetEl_.style.display = 'block';
    this.isDisplayed_ = true;
  };


  ns.CheatsheetService.prototype.hideCheatsheet_ = function () {
    pskl.app.shortcutService.removeShortcut('ESC');
    this.cheatsheetEl_.style.display = 'none';
    this.isDisplayed_ = false;
  };

  ns.CheatsheetService.prototype.initMarkup_ = function () {
    this.initMarkupForTools_();
    this.initMarkupForMisc_();
    this.initMarkupForSelection_();
  };

  ns.CheatsheetService.prototype.toDescriptor_ = function (shortcut, description, icon) {
    if (pskl.utils.UserAgent.isMac) {
      shortcut = shortcut.replace('ctrl', 'cmd');
    }
    return {
      'shortcut' : shortcut,
      'description' : description,
      'icon' : icon
    };
  };

  ns.CheatsheetService.prototype.getDomFromDescriptor_ = function (descriptor) {
    var shortcutTemplate = pskl.utils.Template.get('cheatsheet-shortcut-template');
    var markup = pskl.utils.Template.replace(shortcutTemplate, {
      shortcutIcon : descriptor.icon,
      shortcutDescription : descriptor.description,
      shortcutKey : descriptor.shortcut
    });

    return pskl.utils.Template.createFromHTML(markup);
  };

  ns.CheatsheetService.prototype.initMarkupAbstract_ = function (descriptors, containerSelector) {
    var container = $(containerSelector, this.cheatsheetEl_).get(0);
    for (var i = 0 ; i < descriptors.length ; i++) {
      var descriptor = descriptors[i];
      var shortcutEl = this.getDomFromDescriptor_(descriptor);
      container.appendChild(shortcutEl);
    }
  };

  ns.CheatsheetService.prototype.initMarkupForTools_ = function () {
    var descriptors = pskl.app.toolController.tools.map(function (tool) {
      return this.toDescriptor_(tool.shortcut, tool.instance.getHelpText(), 'tool-icon ' + tool.instance.toolId);
    }.bind(this));

    this.initMarkupAbstract_(descriptors, '.cheatsheet-tool-shortcuts');
  };

  ns.CheatsheetService.prototype.initMarkupForMisc_ = function () {
    var descriptors = [
      this.toDescriptor_('0', 'Reset zoom level'),
      this.toDescriptor_('+/-', 'Zoom in/Zoom out'),
      this.toDescriptor_('X', 'Swap primary/secondary colors'),
      this.toDescriptor_('D', 'Reset default colors'),
      this.toDescriptor_('ctrl + Z', 'Undo'),
      this.toDescriptor_('ctrl + Y', 'Redo'),
      this.toDescriptor_('&#65514;', 'Select previous frame'), /* ASCII for up-arrow */
      this.toDescriptor_('&#65516;', 'Select next frame'), /* ASCII for down-arrow */
      this.toDescriptor_('N', 'Create new frame'),
      this.toDescriptor_('shift + N', 'Duplicate selected frame'),
      this.toDescriptor_('shift + ?', 'Open/Close this popup'),
      this.toDescriptor_('alt + P', 'Create a Palette'),
      this.toDescriptor_('&lt;/&gt;', 'Select previous/next palette color'),
      this.toDescriptor_('alt + O', 'Toggle Onion Skin'),
      this.toDescriptor_('alt + L', 'Toggle Layer Preview')
    ];

    this.initMarkupAbstract_(descriptors, '.cheatsheet-misc-shortcuts');
  };

  ns.CheatsheetService.prototype.initMarkupForSelection_ = function () {
    var descriptors = [
      this.toDescriptor_('ctrl + X', 'Cut selection'),
      this.toDescriptor_('ctrl + C', 'Copy selection'),
      this.toDescriptor_('ctrl + V', 'Paste selection'),
      this.toDescriptor_('del', 'Delete selection')
    ];

    this.initMarkupAbstract_(descriptors, '.cheatsheet-selection-shortcuts');
  };

})();
;(function () {
  var ns = $.namespace("pskl.service");
  ns.ImageUploadService = function () {};
  ns.ImageUploadService.prototype.init = function () {};

  /**
   * Upload a base64 image data to distant service. If successful, will call provided callback with the image URL as first argument;
   * @param {String} imageData base64 image data (such as the return value of canvas.toDataUrl())
   * @param {Function} success success callback. 1st argument will be the uploaded image URL
   * @param {Function} error error callback
   */
  ns.ImageUploadService.prototype.upload = function (imageData, success, error) {
    var data = {
      data : imageData
    };

    var wrappedSuccess = function (response) {
      success(Constants.IMAGE_SERVICE_GET_URL + response.responseText);
    };

    pskl.utils.Xhr.post(Constants.IMAGE_SERVICE_UPLOAD_URL, data, wrappedSuccess, error);
  };
})();
;(function () {
  var ns = $.namespace('pskl.service');

  ns.CurrentColorsService = function (piskelController) {
    this.piskelController = piskelController;
    this.currentColors = [];
    this.cachedFrameProcessor = new pskl.model.frame.CachedFrameProcessor();
    this.cachedFrameProcessor.setFrameProcessor(this.getFrameColors_.bind(this));

    this.colorSorter = new pskl.service.color.ColorSorter();
    this.paletteService = pskl.app.paletteService;
  };

  ns.CurrentColorsService.prototype.init = function () {
    $.subscribe(Events.PISKEL_RESET, this.onPiskelUpdated_.bind(this));
    $.subscribe(Events.TOOL_RELEASED, this.onPiskelUpdated_.bind(this));
    $.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
  };

  ns.CurrentColorsService.prototype.getCurrentColors = function () {
    return this.currentColors;
  };

  ns.CurrentColorsService.prototype.setCurrentColors = function (colors) {
    if (colors.join('') !== this.currentColors.join('')) {
      this.currentColors = colors;
      $.publish(Events.CURRENT_COLORS_UPDATED);
    }
  };

  ns.CurrentColorsService.prototype.onUserSettingsChange_ = function (evt, name, value) {
    if (name == pskl.UserSettings.SELECTED_PALETTE) {
      if (this.isCurrentColorsPaletteSelected_()) {
        this.updateCurrentColors_();
      }
    }
  };

  ns.CurrentColorsService.prototype.onPiskelUpdated_ = function (evt) {
    if (this.isCurrentColorsPaletteSelected_()) {
      this.updateCurrentColors_();
    }
  };

  ns.CurrentColorsService.prototype.isCurrentColorsPaletteSelected_ = function () {
    var paletteId = pskl.UserSettings.get(pskl.UserSettings.SELECTED_PALETTE);
    var palette = this.paletteService.getPaletteById(paletteId);

    return palette.id === Constants.CURRENT_COLORS_PALETTE_ID;
  };

  ns.CurrentColorsService.prototype.updateCurrentColors_ = function () {
    var layers = this.piskelController.getLayers();
    var frames = layers.map(function (l) {return l.getFrames();}).reduce(function (p, n) {return p.concat(n);});
    var colors = {};

    frames.forEach(function (f) {
      var frameColors = this.cachedFrameProcessor.get(f);
      Object.keys(frameColors).slice(0, Constants.MAX_CURRENT_COLORS_DISPLAYED).forEach(function (color) {
        colors[color] = true;
      });
    }.bind(this));

    // Remove transparent color from used colors
    //delete colors[Constants.TRANSPARENT_COLOR];

    // limit the array to the max colors to display
    var colorsArray = Object.keys(colors).slice(0, Constants.MAX_CURRENT_COLORS_DISPLAYED);
    var currentColors = this.colorSorter.sort(colorsArray);

    this.setCurrentColors(currentColors);
  };

  ns.CurrentColorsService.prototype.getFrameColors_ = function (frame) {
    var frameColors = {};
    frame.forEachPixel(function (color, x, y) {
      var hexColor = this.toHexString_(color);
      frameColors[hexColor] = true;
    }.bind(this));
    return frameColors;
  };

  ns.CurrentColorsService.prototype.toHexString_ = function (color) {
    if (color === Constants.TRANSPARENT_COLOR) {
      return color;
    } else {
      color = color.replace(/\s/g, '');
      var hexRe = (/^#([a-f0-9]{3}){1,2}$/i);
      var rgbRe = (/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i);
      if (hexRe.test(color)) {
        return color.toUpperCase();
      } else if (rgbRe.test(color)) {
        var exec = rgbRe.exec(color);
        return pskl.utils.rgbToHex(exec[1] * 1, exec[2] * 1, exec[3] * 1);
      } else {
        console.error('Could not convert color to hex : ', color);
      }
    }
  };
})();;(function () {
  var ns = $.namespace('pskl.service');

  ns.FileDropperService = function (piskelController, drawingAreaContainer) {
    this.piskelController = piskelController;
    this.drawingAreaContainer = drawingAreaContainer;
    this.dropPosition_ = null;
  };

  ns.FileDropperService.prototype.init = function () {
    document.body.addEventListener('drop', this.onFileDrop.bind(this), false);
    document.body.addEventListener('dragover', this.onFileDragOver.bind(this), false);
  };

  ns.FileDropperService.prototype.onFileDragOver = function (event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  ns.FileDropperService.prototype.onFileDrop = function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.dropPosition_ = {
      x : event.clientX,
      y : event.clientY
    };

    var files = event.dataTransfer.files;
    for (var i = 0; i < files.length ; i++) {
      var file = files[i];
      var isImage = file.type.indexOf('image') === 0;
      var isPiskel = /\.piskel$/i.test(file.name);
      var isPalette = /\.(gpl|txt|pal)$/i.test(file.name);
      if (isImage) {
        this.readImageFile_(file);
      } else if (isPiskel) {
        pskl.utils.PiskelFileUtils.loadFromFile(file, this.onPiskelFileLoaded_);
      } else if (isPalette) {
        pskl.app.paletteImportService.read(file, this.onPaletteLoaded_.bind(this));
      }
    }
  };

  ns.FileDropperService.prototype.readImageFile_ = function (imageFile) {
    pskl.utils.FileUtils.readFile(imageFile, this.processImageSource_.bind(this));
  };

  ns.FileDropperService.prototype.onPaletteLoaded_ = function (palette) {
    pskl.app.paletteService.savePalette(palette);
    pskl.UserSettings.set(pskl.UserSettings.SELECTED_PALETTE, palette.id);
  };

  ns.FileDropperService.prototype.onPiskelFileLoaded_ = function (piskel, descriptor, fps) {
    if (window.confirm('This will replace your current animation')) {
      piskel.setDescriptor(descriptor);
      pskl.app.piskelController.setPiskel(piskel);
      pskl.app.animationController.setFPS(fps);
    }
  };

  ns.FileDropperService.prototype.processImageSource_ = function (imageSource) {
    this.importedImage_ = new Image();
    this.importedImage_.onload = this.onImageLoaded_.bind(this);
    this.importedImage_.src = imageSource;
  };

  ns.FileDropperService.prototype.onImageLoaded_ = function () {
    var droppedFrame = pskl.utils.FrameUtils.createFromImage(this.importedImage_);
    var currentFrame = this.piskelController.getCurrentFrame();

    var dropCoordinates = this.adjustDropPosition_(this.dropPosition_, droppedFrame);

    currentFrame.forEachPixel(function (color, x, y) {
      var fColor = droppedFrame.getPixel(x-dropCoordinates.x, y-dropCoordinates.y);
      if (fColor && fColor != Constants.TRANSPARENT_COLOR) {
        currentFrame.setPixel(x, y, fColor);
      }
    });

    $.publish(Events.PISKEL_RESET);
    $.publish(Events.PISKEL_SAVE_STATE, {
      type : pskl.service.HistoryService.SNAPSHOT
    });
  };

  ns.FileDropperService.prototype.adjustDropPosition_ = function (position, droppedFrame) {
    var framePosition = pskl.app.drawingController.getSpriteCoordinates(position.x, position.y);

    var xCoord = framePosition.x - Math.floor(droppedFrame.width/2);
    var yCoord = framePosition.y - Math.floor(droppedFrame.height/2);

    xCoord = Math.max(0, xCoord);
    yCoord = Math.max(0, yCoord);

    var currentFrame = this.piskelController.getCurrentFrame();
    if (droppedFrame.width <= currentFrame.width) {
      xCoord = Math.min(xCoord, currentFrame.width - droppedFrame.width);
    }

    if (droppedFrame.height <= currentFrame.height) {
      yCoord = Math.min(yCoord, currentFrame.height - droppedFrame.height);
    }

    return {
      x : xCoord,
      y : yCoord
    };
  };

})();;(function () {
  var ns = $.namespace('pskl.tools');

  ns.Tool = function () {
    this.toolId = "tool";
    this.helpText = "Abstract tool";
    this.tooltipDescriptors = [];
  };

  ns.Tool.prototype.getHelpText = function() {
    return this.helpText;
  };

  ns.Tool.prototype.getId = function() {
    return this.toolId;
  };
})();;(function () {
  var ns = $.namespace('pskl.tools');

  ns.IconMarkupRenderer = function () {};

  ns.IconMarkupRenderer.prototype.render = function (tool, shortcut, tooltipPosition) {
    tooltipPosition = tooltipPosition || 'right';
    shortcut = shortcut ?  '(' + shortcut + ')' : '';
    var tpl = pskl.utils.Template.get('drawingTool-item-template');
    return pskl.utils.Template.replace(tpl, {
      cssclass : ['tool-icon', tool.toolId].join(' '),
      toolid : tool.toolId,
      title : this.getTooltipText(tool, shortcut),
      tooltipposition : tooltipPosition
    });
  };

  ns.IconMarkupRenderer.prototype.getTooltipText = function(tool, shortcut) {
    var descriptors = tool.tooltipDescriptors;
    var tpl = pskl.utils.Template.get('drawingTool-tooltipContainer-template');
    return pskl.utils.Template.replace(tpl, {
      helptext : tool.getHelpText(),
      shortcut : shortcut,
      descriptors : this.formatToolDescriptors_(descriptors)
    });
  };


  ns.IconMarkupRenderer.prototype.formatToolDescriptors_ = function(descriptors) {
    descriptors = descriptors || [];
    return descriptors.reduce(function (p, descriptor) {
      return p += this.formatToolDescriptor_(descriptor);
    }.bind(this), '');
  };

  ns.IconMarkupRenderer.prototype.formatToolDescriptor_ = function(descriptor) {
    var tpl;
    if (descriptor.key) {
      tpl = pskl.utils.Template.get('drawingTool-tooltipDescriptor-template');
      descriptor.key = descriptor.key.toUpperCase();
      if (pskl.utils.UserAgent.isMac) {
        descriptor.key = descriptor.key.replace('CTRL', 'CMD');
      }
    } else {
      tpl = pskl.utils.Template.get('drawingTool-simpleTooltipDescriptor-template');
    }
    return pskl.utils.Template.replace(tpl, descriptor);
  };
})();;/**
 * @provide pskl.tools.drawing.BaseTool
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");


  ns.BaseTool = function() {
    pskl.tool.Tool.call(this);
    this.toolId = "tool-base";
  };

  pskl.utils.inherit(ns.BaseTool, pskl.tools.Tool);

  ns.BaseTool.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {};

  ns.BaseTool.prototype.moveToolAt = function(col, row, color, frame, overlay, event) {};

  ns.BaseTool.prototype.replay = Constants.ABSTRACT_FUNCTION;

  ns.BaseTool.prototype.moveUnactiveToolAt = function(col, row, color, frame, overlay, event) {

    if (overlay.containsPixel(col, row)) {
      if (!isNaN(this.highlightedPixelCol) &&
        !isNaN(this.highlightedPixelRow) &&
        (this.highlightedPixelRow != row ||
          this.highlightedPixelCol != col)) {

        // Clean the previously highlighted pixel:
        overlay.clear();
      }

      // Show the current pixel targeted by the tool:
      //overlay.setPixel(col, row, Constants.TOOL_TARGET_HIGHLIGHT_COLOR);

      this.highlightedPixelCol = col;
      this.highlightedPixelRow = row;
    } else {
      this.hideHighlightedPixel(overlay);
    }
  };

  ns.BaseTool.prototype.hideHighlightedPixel = function(overlay) {
    if (this.highlightedPixelRow !== null && this.highlightedPixelCol !== null) {
      try {
        overlay.setPixel(this.highlightedPixelCol, this.highlightedPixelRow, Constants.TRANSPARENT_COLOR);
      } catch (e) {
        window.console.warn('ns.BaseTool.prototype.hideHighlightedPixel failed');
      }
      this.highlightedPixelRow = null;
      this.highlightedPixelCol = null;
    }
  };

  ns.BaseTool.prototype.raiseSaveStateEvent = function (replayData) {
    $.publish(Events.PISKEL_SAVE_STATE, {
      type : pskl.service.HistoryService.REPLAY,
      scope : this,
      replay : replayData
    });
  };

  ns.BaseTool.prototype.releaseToolAt = function(col, row, color, frame, overlay, event) {};

  /**
   * Bresenham line algorithm: Get an array of pixels from
   * start and end coordinates.
   *
   * http://en.wikipedia.org/wiki/Bresenham's_line_algorithm
   * http://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
   *
   * @private
   */
  ns.BaseTool.prototype.getLinePixels_ = function(x0, x1, y0, y1) {
    x1 = pskl.utils.normalize(x1, 0);
    y1 = pskl.utils.normalize(y1, 0);

    var pixels = [];
    var dx = Math.abs(x1-x0);
    var dy = Math.abs(y1-y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx-dy;
    while(true){

      // Do what you need to for this
      pixels.push({"col": x0, "row": y0});

      if ((x0==x1) && (y0==y1)) {
        break;
      }

      var e2 = 2*err;
      if (e2>-dy){
        err -= dy;
        x0  += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0  += sy;
      }
    }
    return pixels;
  };
})();
;(function () {
  var ns = $.namespace('pskl.tools.drawing');
  /**
   * Abstract shape tool class, parent to all shape tools (rectangle, circle).
   * Shape tools should override only the draw_ method
   */
  ns.ShapeTool = function() {
    // Shapes's first point coordinates (set in applyToolAt)
    this.startCol = null;
    this.startRow = null;

    this.tooltipDescriptors = [
      {key : 'shift', description : 'Keep 1 to 1 ratio'}
    ];
  };

  pskl.utils.inherit(ns.ShapeTool, ns.BaseTool);

  /**
   * @override
   */
  ns.ShapeTool.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
    $.publish(Events.DRAG_START, [col, row]);
    this.startCol = col;
    this.startRow = row;

    // Drawing the first point of the rectangle in the fake overlay canvas:
    overlay.setPixel(col, row, color);
  };

  ns.ShapeTool.prototype.moveToolAt = function(col, row, color, frame, overlay, event) {
    var coords = this.getCoordinates_(col, row, event);
    $.publish(Events.CURSOR_MOVED, [coords.col, coords.row]);

    overlay.clear();
    if(color == Constants.TRANSPARENT_COLOR) {
      color = Constants.SELECTION_TRANSPARENT_COLOR;
    }

    // draw in overlay
    this.draw_(coords.col, coords.row, color, overlay);
  };

  /**
   * @override
   */
  ns.ShapeTool.prototype.releaseToolAt = function(col, row, color, frame, overlay, event) {
    overlay.clear();
    var coords = this.getCoordinates_(col, row, event);
    this.draw_(coords.col, coords.row, color, frame);

    $.publish(Events.DRAG_END, [coords.col, coords.row]);
    this.raiseSaveStateEvent({
      col : coords.col,
      row : coords.row,
      startCol : this.startCol,
      startRow : this.startRow,
      color : color
    });
  };

  /**
   * @override
   */
  ns.ShapeTool.prototype.replay = function(frame, replayData) {
    this.startCol = replayData.startCol;
    this.startRow = replayData.startRow;
    this.draw_(replayData.col, replayData.row, replayData.color, frame);
  };

  /**
   * Transform the current coordinates based on the original event
   * @param {Number} col current col/x coordinate in the frame
   * @param {Number} row current row/y coordinate in the frame
   * @param {Event} event current event (can be mousemove, mouseup ...)
   * @return {Object} {row : Number, col : Number}
   */
  ns.ShapeTool.prototype.getCoordinates_ = function(col, row, event) {
    if (event.shiftKey) {
      return this.getScaledCoordinates_(col, row);
    } else {
      return {col : col, row : row};
    }
  };

  /**
   * Transform the coordinates to preserve a square 1:1 ratio from the origin of the shape
   * @param {Number} col current col/x coordinate in the frame
   * @param {Number} row current row/y coordinate in the frame
   * @return {Object} {row : Number, col : Number}
   */
  ns.ShapeTool.prototype.getScaledCoordinates_ = function(col, row) {
    var dX = this.startCol - col;
    var absX = Math.abs(dX);

    var dY = this.startRow - row;
    var absY = Math.abs(dY);

    var delta = Math.min(absX, absY);
    row = this.startRow - ((dY/absY)*delta);
    col = this.startCol - ((dX/absX)*delta);

    return {
      col : col,
      row : row
    };
  };

  ns.ShapeTool.prototype.draw_ = Constants.ABSTRACT_FUNCTION;

})();;/**
 * @provide pskl.tools.drawing.SimplePen
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.SimplePen = function() {
    this.toolId = "tool-pen";
    this.helpText = "Pen tool";

    this.previousCol = null;
    this.previousRow = null;

    this.pixels = [];
  };

  pskl.utils.inherit(ns.SimplePen, ns.BaseTool);

  /**
   * @override
   */
  ns.SimplePen.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
    this.previousCol = col;
    this.previousRow = row;

    overlay.setPixel(col, row, color);

    if (color === Constants.TRANSPARENT_COLOR) {
      frame.setPixel(col, row, color);
    }
    this.pixels.push({
      col : col,
      row : row,
      color : color
    });
  };

  /**
   * @override
   */
  ns.SimplePen.prototype.moveToolAt = function(col, row, color, frame, overlay, event) {
    if((Math.abs(col - this.previousCol) > 1) || (Math.abs(row - this.previousRow) > 1)) {
      // The pen movement is too fast for the mousemove frequency, there is a gap between the
      // current point and the previously drawn one.
      // We fill the gap by calculating missing dots (simple linear interpolation) and draw them.
      var interpolatedPixels = this.getLinePixels_(col, this.previousCol, row, this.previousRow);
      for(var i=0, l=interpolatedPixels.length; i<l; i++) {
        var coords = interpolatedPixels[i];
        this.applyToolAt(coords.col, coords.row, color, frame, overlay, event);
      }
    }
    else {
      this.applyToolAt(col, row, color, frame, overlay, event);
    }

    this.previousCol = col;
    this.previousRow = row;
  };


  ns.SimplePen.prototype.releaseToolAt = function(col, row, color, frame, overlay, event) {
    // apply on real frame
    this.setPixelsToFrame_(frame, this.pixels);

    // save state
    this.raiseSaveStateEvent({
      pixels : this.pixels.slice(0),
      color : color
    });

    // reset
    this.resetUsedPixels_();
  };

  ns.SimplePen.prototype.replay = function (frame, replayData) {
    this.setPixelsToFrame_(frame, replayData.pixels, replayData.color);
  };

  ns.SimplePen.prototype.setPixelsToFrame_ = function (frame, pixels, color) {
    pixels.forEach(function (pixel) {
      frame.setPixel(pixel.col, pixel.row, pixel.color);
    });
  };

  ns.SimplePen.prototype.resetUsedPixels_ = function() {
    this.pixels = [];
  };
})();
;/**
 * @provide pskl.tools.drawing.Eraser
 *
 * @require Constants
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");
  var DEFAULT_STEP = 3;

  ns.Lighten = function() {
    this.superclass.constructor.call(this);
    this.toolId = "tool-lighten";

    this.helpText = "Lighten";

    this.tooltipDescriptors = [
      {key : 'ctrl', description : 'Darken'},
      {key : 'shift', description : 'Apply only once per pixel'}
    ];

    this.usedPixels_ = {
      darken : {},
      lighten : {}
    };
  };

  pskl.utils.inherit(ns.Lighten, ns.SimplePen);

  /**
   * @Override
   */
  ns.Lighten.prototype.resetUsedPixels_ = function() {
    this.usedPixels_ = {
      darken : {},
      lighten : {}
    };
    this.superclass.resetUsedPixels_.call(this);
  };

  /**
   * @Override
   */
  ns.Lighten.prototype.applyToolAt = function(col, row, color, frame, overlay, event, mouseButton) {
    var overlayColor = overlay.getPixel(col, row);
    var frameColor = frame.getPixel(col, row);
    var pixelColor = overlayColor === Constants.TRANSPARENT_COLOR ? frameColor : overlayColor;

    var isDarken = pskl.utils.UserAgent.isMac ?  event.metaKey : event.ctrlKey;
    var isSinglePass = event.shiftKey;

    var isTransparent = pixelColor === Constants.TRANSPARENT_COLOR;
    var usedPixels = isDarken ? this.usedPixels_.darken : this.usedPixels_.lighten;
    var key = col+'-'+row;

    var doNotModify = isTransparent || (isSinglePass && usedPixels[key]);
    if (doNotModify) {
      color = window.tinycolor(pixelColor);
    } else {
      var step = isSinglePass ? DEFAULT_STEP * 2 : DEFAULT_STEP;
      if (isDarken) {
        color = window.tinycolor.darken(pixelColor, step);
      } else {
        color = window.tinycolor.lighten(pixelColor, step);
      }
    }
    if (color) {
      usedPixels[key] = true;
      this.superclass.applyToolAt.call(this, col, row, color.toRgbString(), frame, overlay, event);
    }

  };
})();;(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.VerticalMirrorPen = function() {
    this.superclass.constructor.call(this);

    this.toolId = "tool-vertical-mirror-pen";
    this.helpText = "Vertical Mirror pen";

    this.tooltipDescriptors = [
      {key : 'ctrl', description : 'Use horizontal axis'},
      {key : 'shift', description : 'Use horizontal and vertical axis'}
    ];
  };

  pskl.utils.inherit(ns.VerticalMirrorPen, ns.SimplePen);

  ns.VerticalMirrorPen.prototype.backupPreviousPositions_ = function () {
    this.backupPreviousCol = this.previousCol;
    this.backupPreviousRow = this.previousRow;
  };

  ns.VerticalMirrorPen.prototype.restorePreviousPositions_ = function () {
    this.previousCol = this.backupPreviousCol;
    this.previousRow = this.backupPreviousRow;
  };

  /**
   * @override
   */
  ns.VerticalMirrorPen.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
    this.superclass.applyToolAt.call(this, col, row, color, frame, overlay);
    this.backupPreviousPositions_();

    var mirroredCol = this.getSymmetricCol_(col, frame);
    var mirroredRow = this.getSymmetricRow_(row, frame);

    var hasCtrlKey = pskl.utils.UserAgent.isMac ?  event.metaKey : event.ctrlKey;
    if (!hasCtrlKey) {
      this.superclass.applyToolAt.call(this, mirroredCol, row, color, frame, overlay);
    }

    if (event.shiftKey || hasCtrlKey) {
      this.superclass.applyToolAt.call(this, col, mirroredRow, color, frame, overlay);
    }

    if (event.shiftKey) {
      this.superclass.applyToolAt.call(this, mirroredCol, mirroredRow, color, frame, overlay);
    }


    this.restorePreviousPositions_();
  };

  ns.VerticalMirrorPen.prototype.getSymmetricCol_ = function(col, frame) {
    return frame.getWidth() - col - 1;
  };

  ns.VerticalMirrorPen.prototype.getSymmetricRow_ = function(row, frame) {
    return frame.getHeight() - row - 1;
  };
})();
;/**
 * @provide pskl.tools.drawing.Eraser
 *
 * @require Constants
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.Eraser = function() {
    this.superclass.constructor.call(this);
    this.toolId = "tool-eraser";
    this.helpText = "Eraser tool";
  };

  pskl.utils.inherit(ns.Eraser, ns.SimplePen);

  /**
   * @override
   */
  ns.Eraser.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
    this.superclass.applyToolAt.call(this, col, row, Constants.TRANSPARENT_COLOR, frame, overlay, event);
  };
  /**
   * @override
   */
  ns.Eraser.prototype.releaseToolAt = function(col, row, color, frame, overlay, event) {
    this.superclass.releaseToolAt.call(this, col, row, Constants.TRANSPARENT_COLOR, frame, overlay, event);
  };
})();;/**
 * @provide pskl.tools.drawing.Stroke
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.Stroke = function() {
    this.toolId = "tool-stroke";
    this.helpText = "Stroke tool";

    // Stroke's first point coordinates (set in applyToolAt)
    this.startCol = null;
    this.startRow = null;
  };

  pskl.utils.inherit(ns.Stroke, ns.BaseTool);

  /**
   * @override
   */
  ns.Stroke.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
    this.startCol = col;
    this.startRow = row;

    // When drawing a stroke we don't change the model instantly, since the
    // user can move his cursor to change the stroke direction and length
    // dynamically. Instead we draw the (preview) stroke in a fake canvas that
    // overlay the drawing canvas.
    // We wait for the releaseToolAt callback to impact both the
    // frame model and canvas rendering.

    // The fake canvas where we will draw the preview of the stroke:
    // Drawing the first point of the stroke in the fake overlay canvas:
    overlay.setPixel(col, row, color);
  };

  ns.Stroke.prototype.moveToolAt = function(col, row, color, frame, overlay, event) {
    overlay.clear();

    // When the user moussemove (before releasing), we dynamically compute the
    // pixel to draw the line and draw this line in the overlay canvas:
    var strokePoints = this.getLinePixels_(this.startCol, col, this.startRow, row);

    // Drawing current stroke:
    for(var i = 0; i< strokePoints.length; i++) {

      if(color == Constants.TRANSPARENT_COLOR) {
        // When mousemoving the stroke tool, we draw in the canvas overlay above the drawing canvas.
        // If the stroke color is transparent, we won't be
        // able to see it during the movement.
        // We set it to a semi-opaque white during the tool mousemove allowing to see colors below the stroke.
        // When the stroke tool will be released, It will draw a transparent stroke,
        // eg deleting the equivalent of a stroke.
        color = Constants.SELECTION_TRANSPARENT_COLOR;
      }
      overlay.setPixel(strokePoints[i].col, strokePoints[i].row, color);
    }
  };

  /**
   * @override
   */
  ns.Stroke.prototype.releaseToolAt = function(col, row, color, frame, overlay, event) {
    // The user released the tool to draw a line. We will compute the pixel coordinate, impact
    // the model and draw them in the drawing canvas (not the fake overlay anymore)
    var strokePoints = this.getLinePixels_(this.startCol, col, this.startRow, row);
    for(var i = 0; i< strokePoints.length; i++) {
      // Change model:
      frame.setPixel(strokePoints[i].col, strokePoints[i].row, color);
    }
    // For now, we are done with the stroke tool and don't need an overlay anymore:
    overlay.clear();

    this.raiseSaveStateEvent({
      pixels : strokePoints,
      color : color
    });
  };

  ns.Stroke.prototype.replay = function(frame, replayData) {
    replayData.pixels.forEach(function (pixel) {
      frame.setPixel(pixel.col, pixel.row, replayData.color);
    });
  };
})();
;/**
 * @provide pskl.tools.drawing.PaintBucket
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.PaintBucket = function() {
    this.toolId = "tool-paint-bucket";
    this.helpText = "Paint bucket tool";
  };

  pskl.utils.inherit(ns.PaintBucket, ns.BaseTool);

  /**
   * @override
   */
  ns.PaintBucket.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
    pskl.PixelUtils.paintSimilarConnectedPixelsFromFrame(frame, col, row, color);

    this.raiseSaveStateEvent({
      col : col,
      row : row,
      color : color
    });
  };

  ns.PaintBucket.prototype.replay = function (frame, replayData) {
    pskl.PixelUtils.paintSimilarConnectedPixelsFromFrame(frame, replayData.col, replayData.row, replayData.color);
  };
})();
;/**
 * @provide pskl.tools.drawing.Rectangle
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.Rectangle = function() {
    ns.ShapeTool.call(this);

    this.toolId = "tool-rectangle";

    this.helpText = "Rectangle tool";
  };

  pskl.utils.inherit(ns.Rectangle, ns.ShapeTool);

  ns.Rectangle.prototype.draw_ = function (col, row, color, targetFrame) {
    var strokePoints = pskl.PixelUtils.getBoundRectanglePixels(this.startCol, this.startRow, col, row);
    for(var i = 0; i< strokePoints.length; i++) {
      // Change model:
      targetFrame.setPixel(strokePoints[i].col, strokePoints[i].row, color);
    }
  };
})();
;/**
 * @provide pskl.tools.drawing.Circle
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.Circle = function() {
    ns.ShapeTool.call(this);

    this.toolId = "tool-circle";

    this.helpText = "Circle tool";
  };

  pskl.utils.inherit(ns.Circle, ns.ShapeTool);

  ns.Circle.prototype.draw_ = function (col, row, color, targetFrame) {
    var circlePoints = this.getCirclePixels_(this.startCol, this.startRow, col, row);
    for(var i = 0; i< circlePoints.length; i++) {
      // Change model:
      targetFrame.setPixel(circlePoints[i].col, circlePoints[i].row, color);
    }
  };

  ns.Circle.prototype.getCirclePixels_ = function (x0, y0, x1, y1) {
    var coords = pskl.PixelUtils.getOrderedRectangleCoordinates(x0, y0, x1, y1);
    var xC = (coords.x0 + coords.x1)/2;
    var yC = (coords.y0 + coords.y1)/2;

    var rX = coords.x1 - xC;
    var rY = coords.y1 - yC;

    var pixels = [];
    var x, y, angle;
    for (x = coords.x0 ; x < coords.x1 ; x++) {
      angle = Math.acos((x - xC)/rX);
      y = Math.round(rY * Math.sin(angle) + yC);
      pixels.push({"col": x, "row": y});
      pixels.push({"col": 2*xC - x, "row": 2*yC - y});
    }

    for (y = coords.y0 ; y < coords.y1 ; y++) {
      angle = Math.asin((y - yC)/rY);
      x = Math.round(rX * Math.cos(angle) + xC);
      pixels.push({"col": x, "row": y});
      pixels.push({"col": 2*xC - x, "row": 2*yC - y});
    }
    return pixels;
  };
})();
;/**
 * @provide pskl.tools.drawing.Move
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.Move = function() {
    this.toolId = ns.Move.TOOL_ID;
    this.helpText = "Move tool";

    // Stroke's first point coordinates (set in applyToolAt)
    this.startCol = null;
    this.startRow = null;
  };

  ns.Move.TOOL_ID = "tool-move";

  pskl.utils.inherit(ns.Move, ns.BaseTool);

  /**
   * @override
   */
  ns.Move.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
    this.startCol = col;
    this.startRow = row;
    this.frameClone = frame.clone();
  };

  ns.Move.prototype.moveToolAt = function(col, row, color, frame, overlay, event) {
    var colDiff = col - this.startCol, rowDiff = row - this.startRow;
    this.shiftFrame(colDiff, rowDiff, frame, this.frameClone, event);
  };

  ns.Move.prototype.shiftFrame = function (colDiff, rowDiff, frame, reference, event) {
    var color;
    var w = frame.getWidth();
    var h = frame.getHeight();
    for (var col = 0 ; col < w ; col++) {
      for (var row = 0 ; row < h ; row++) {
        var x = col - colDiff;
        var y = row - rowDiff;
        if (event.shiftKey) {
          x = (x + w) % w;
          y = (y + h) % h;
        }
        if (reference.containsPixel(x, y)) {
          color = reference.getPixel(x, y);
        } else {
          color = Constants.TRANSPARENT_COLOR;
        }
        frame.setPixel(col, row, color);
      }
    }
  };

  /**
   * @override
   */
  ns.Move.prototype.releaseToolAt = function(col, row, color, frame, overlay, event) {
    this.moveToolAt(col, row, color, frame, overlay, event);

    this.raiseSaveStateEvent({
      colDiff : col - this.startCol,
      rowDiff : row - this.startRow,
      shiftKey : event.shiftKey
    });
  };

  ns.Move.prototype.replay = function(frame, replayData) {
    var event = {
      shiftKey : replayData.shiftKey
    };
    this.shiftFrame(replayData.colDiff, replayData.rowDiff, frame, frame.clone(), event);
  };
})();
;/**
 * @provide pskl.tools.drawing.BaseSelect
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.BaseSelect = function() {
    this.secondaryToolId = pskl.tools.drawing.Move.TOOL_ID;
    this.BodyRoot = $('body');

    // Select's first point coordinates (set in applyToolAt)
    this.startCol = null;
    this.startRow = null;

    this.selection = null;

    this.tooltipDescriptors = [
      {description : "Drag the selection to move it. You may switch to other layers and frames."},
      {key : 'ctrl+c', description : 'Copy the selected area'},
      {key : 'ctrl+v', description : 'Paste the copied area'}
    ];
  };

  pskl.utils.inherit(ns.BaseSelect, ns.BaseTool);

  /**
   * @override
   */
  ns.BaseSelect.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
    this.startCol = col;
    this.startRow = row;

    this.lastCol = col;
    this.lastRow = row;

    // The select tool can be in two different state.
    // If the inital click of the tool is not on a selection, we go in "select"
    // mode to create a selection.
    // If the initial click is on a previous selection, we go in "moveSelection"
    // mode to allow to move the selection by drag'n dropping it.
    if(this.isInSelection(col, row)) {
      this.mode = "moveSelection";
      this.onSelectionDragStart_(col, row, color, frame, overlay);
    }
    else {
      this.mode = "select";
      this.onSelectStart_(col, row, color, frame, overlay);
    }
  };

  /**
   * @override
   */
  ns.BaseSelect.prototype.moveToolAt = function(col, row, color, frame, overlay, event) {
    if(this.mode == "select") {
      this.onSelect_(col, row, color, frame, overlay);
    } else if(this.mode == "moveSelection") {
      this.onSelectionDrag_(col, row, color, frame, overlay);
    }
  };

  /**
   * @override
   */
  ns.BaseSelect.prototype.releaseToolAt = function(col, row, color, frame, overlay, event) {
    if(this.mode == "select") {
      this.onSelectEnd_(col, row, color, frame, overlay);
    } else if(this.mode == "moveSelection") {

      this.onSelectionDragEnd_(col, row, color, frame, overlay);
    }
  };

  /**
   * If we mouseover the selection draw inside the overlay frame, show the 'move' cursor
   * instead of the 'select' one. It indicates that we can move the selection by dragndroping it.
   * @override
   */
  ns.BaseSelect.prototype.moveUnactiveToolAt = function(col, row, color, frame, overlay, event) {
    if (overlay.containsPixel(col, row)) {
      if(this.isInSelection(col, row)) {
        // We're hovering the selection, show the move tool:
        this.BodyRoot.addClass(this.secondaryToolId);
        this.BodyRoot.removeClass(this.toolId);
      } else {
        // We're not hovering the selection, show create selection tool:
        this.BodyRoot.addClass(this.toolId);
        this.BodyRoot.removeClass(this.secondaryToolId);
      }
    }
  };

  ns.BaseSelect.prototype.isInSelection = function (col, row) {
    return this.selection && this.selection.pixels.some(function (pixel) {
      return pixel.col === col && pixel.row === row;
    });
  };

  ns.BaseSelect.prototype.hideHighlightedPixel = function() {
    // there is no highlighted pixel for selection tools, do nothing
  };

  /**
   * For each pixel in the selection draw it in white transparent on the tool overlay
   * @protected
   */
  ns.BaseSelect.prototype.drawSelectionOnOverlay_ = function (overlay) {
    var pixels = this.selection.pixels;
    for(var i=0, l=pixels.length; i<l; i++) {
      var pixel = pixels[i];
      var hasColor = pixel.color && pixel.color !== Constants.TRANSPARENT_COLOR ;
      var color = hasColor ? this.getTransparentVariant(pixel.color) : Constants.SELECTION_TRANSPARENT_COLOR;

      overlay.setPixel(pixels[i].col, pixels[i].row, color);
    }
  };

  ns.BaseSelect.prototype.getTransparentVariant = function (colorStr) {
    var color = window.tinycolor(colorStr);
    color = window.tinycolor.lighten(color, 10);
    color.setAlpha(0.5);
    return color.toRgbString();
  };

  // The list of callbacks to implement by specialized tools to implement the selection creation behavior.
  /** @protected */
  ns.BaseSelect.prototype.onSelectStart_ = function (col, row, color, frame, overlay) {};
  /** @protected */
  ns.BaseSelect.prototype.onSelect_ = function (col, row, color, frame, overlay) {};
  /** @protected */
  ns.BaseSelect.prototype.onSelectEnd_ = function (col, row, color, frame, overlay) {};


  // The list of callbacks that define the drag'n drop behavior of the selection.
  /** @private */
  ns.BaseSelect.prototype.onSelectionDragStart_ = function (col, row, color, frame, overlay) {
  };

  /** @private */
  ns.BaseSelect.prototype.onSelectionDrag_ = function (col, row, color, frame, overlay) {
    var deltaCol = col - this.lastCol;
    var deltaRow = row - this.lastRow;

    var colDiff = col - this.startCol, rowDiff = row - this.startRow;

    this.selection.move(deltaCol, deltaRow);

    overlay.clear();
    this.drawSelectionOnOverlay_(overlay);

    this.lastCol = col;
    this.lastRow = row;
  };

  /** @private */
  ns.BaseSelect.prototype.onSelectionDragEnd_ = function (col, row, color, frame, overlay) {
    this.onSelectionDrag_(col, row, color, frame, overlay);
  };
})();
;/**
 * @provide pskl.tools.drawing.RectangleSelect
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.RectangleSelect = function() {
    this.toolId = "tool-rectangle-select";

    this.helpText = "Rectangle selection";

    ns.BaseSelect.call(this);
    this.hasSelection = false;
  };

  pskl.utils.inherit(ns.RectangleSelect, ns.BaseSelect);


  /**
   * @override
   */
  ns.RectangleSelect.prototype.onSelectStart_ = function (col, row, color, frame, overlay) {
    if (this.hasSelection) {
      this.hasSelection = false;
      overlay.clear();
      $.publish(Events.SELECTION_DISMISSED);
    } else {
      this.hasSelection = true;
      $.publish(Events.DRAG_START, [col, row]);
      // Drawing the first point of the rectangle in the fake overlay canvas:
      overlay.setPixel(col, row, color);
    }
  };

  /**
   * When creating the rectangle selection, we clear the current overlayFrame and
   * redraw the current rectangle based on the orgin coordinate and
   * the current mouse coordiinate in sprite.
   * @override
   */
  ns.RectangleSelect.prototype.onSelect_ = function (col, row, color, frame, overlay) {
    if (this.hasSelection) {
      overlay.clear();
      this.selection = new pskl.selection.RectangularSelection(
        this.startCol, this.startRow, col, row);
      $.publish(Events.SELECTION_CREATED, [this.selection]);
      this.drawSelectionOnOverlay_(overlay);
    }
  };

  ns.RectangleSelect.prototype.onSelectEnd_ = function (col, row, color, frame, overlay) {
    if (this.hasSelection) {
      this.onSelect_(col, row, color, frame, overlay);
      $.publish(Events.DRAG_END, [col, row]);
    }
  };

})();
;/**
 * @provide pskl.tools.drawing.ShapeSelect
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.ShapeSelect = function() {
    this.toolId = "tool-shape-select";

    this.helpText = "Shape selection";

    ns.BaseSelect.call(this);
  };

  pskl.utils.inherit(ns.ShapeSelect, ns.BaseSelect);

  /**
   * For the shape select tool, you just need to click one time to create a selection.
   * So we jsut need to implement onSelectStart_ (no need for onSelect_ & onSelectEnd_)
   * @override
   */
  ns.ShapeSelect.prototype.onSelectStart_ = function (col, row, color, frame, overlay) {
    // Clean previous selection:
    $.publish(Events.SELECTION_DISMISSED);
    overlay.clear();

    // From the pixel cliked, get shape using an algorithm similar to the paintbucket one:
    var pixels = pskl.PixelUtils.getSimilarConnectedPixelsFromFrame(frame, col, row);
    this.selection = new pskl.selection.ShapeSelection(pixels);

    $.publish(Events.SELECTION_CREATED, [this.selection]);
    this.drawSelectionOnOverlay_(overlay);
  };

})();
;/**
 * @provide pskl.tools.drawing.ColorPicker
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.ColorPicker = function() {
    this.toolId = "tool-colorpicker";
    this.helpText = "Color picker";
  };

  pskl.utils.inherit(ns.ColorPicker, ns.BaseTool);


  /**
   * @override
   */
  ns.ColorPicker.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
    if (frame.containsPixel(col, row)) {
      var sampledColor = frame.getPixel(col, row);
      if (event.button == Constants.LEFT_BUTTON) {
        $.publish(Events.SELECT_PRIMARY_COLOR, [sampledColor]);
      } else if (event.button == Constants.RIGHT_BUTTON) {
        $.publish(Events.SELECT_SECONDARY_COLOR, [sampledColor]);
      }
    }
  };
})();
;/**
 * @provide pskl.tools.drawing.ColorSwap
 *
 */
(function() {
  var ns = $.namespace("pskl.tools.drawing");

  ns.ColorSwap = function() {
    this.toolId = "tool-colorswap";

    this.helpText = "Paint all pixels of the same color";

    this.tooltipDescriptors = [
      {key : 'ctrl', description : 'Apply to all layers'},
      {key : 'shift', description : 'Apply to all frames'}
    ];
  };

  pskl.utils.inherit(ns.ColorSwap, ns.BaseTool);

  /**
   * @override
   */
  ns.ColorSwap.prototype.applyToolAt = function(col, row, color, frame, overlay, event) {
    if (frame.containsPixel(col, row)) {
      var sampledColor = frame.getPixel(col, row);

      var allLayers = pskl.utils.UserAgent.isMac ?  event.metaKey : event.ctrlKey;
      var allFrames = event.shiftKey;

      this.swapColors(sampledColor, color, allLayers, allFrames);

      $.publish(Events.PISKEL_SAVE_STATE, {
        type : pskl.service.HistoryService.SNAPSHOT
      });
    }
  };

  ns.ColorSwap.prototype.swapColors = function(oldColor, newColor, allLayers, allFrames) {
    var swapPixelColor = function (pixelColor,x,y,frame) {
      if (pixelColor == oldColor) {
        frame.pixels[x][y] = newColor;
      }
    };
    var currentLayer = pskl.app.piskelController.getCurrentLayer();
    var currentFrameIndex = pskl.app.piskelController.getCurrentFrameIndex();
    pskl.app.piskelController.getPiskel().getLayers().forEach(function (l) {
      if (allLayers || l === currentLayer) {
        l.getFrames().forEach(function (f, frameIndex) {
          if (allFrames || frameIndex === currentFrameIndex) {
            f.forEachPixel(swapPixelColor);
            f.version++;
          }
        });
      }
    });
  };
})();
;(function () {
  var ns = $.namespace('pskl.tools.transform');

  ns.Transform = function () {
    this.toolId = "tool-transform";
    this.helpText = "Transform tool";
    this.tooltipDescriptors = [];
  };

  pskl.utils.inherit(ns.Transform, pskl.tools.Tool);

  ns.Transform.prototype.apply = function (evt) {
    var allFrames = evt.shiftKey;
    var allLayers = evt.ctrlKey;
    this.applyTool_(evt.altKey, allFrames, allLayers);
  };

  ns.Transform.prototype.applyTool_ = function (altKey, allFrames, allLayers) {
    var currentFrameIndex = pskl.app.piskelController.getCurrentFrameIndex();
    var layers = allLayers ? pskl.app.piskelController.getLayers(): [pskl.app.piskelController.getCurrentLayer()];
    layers.forEach(function (layer) {
      var frames = allFrames ? layer.getFrames(): [layer.getFrameAt(currentFrameIndex)];
      frames.forEach(function (frame) {
        this.applyToolOnFrame_(frame, altKey);
      }.bind(this));
    }.bind(this));
    $.publish(Events.PISKEL_RESET);
    $.publish(Events.PISKEL_SAVE_STATE, {
      type : pskl.service.HistoryService.SNAPSHOT
    });
  };

})();;(function () {
  var ns = $.namespace('pskl.tools.transform');

   ns.Clone = function () {
    this.toolId = "tool-clone";
    this.helpText = "Clone current layer to all frames";
    this.tooltipDescriptors = [];
   };

  pskl.utils.inherit(ns.Clone, ns.Transform);

   ns.Clone.prototype.apply = function (evt) {
    var ref = pskl.app.piskelController.getCurrentFrame();
    var layer = pskl.app.piskelController.getCurrentLayer();
    layer.getFrames().forEach(function (frame) {
      if (frame !==  ref) {
        frame.setPixels(ref.getPixels());
      }
    });
    $.publish(Events.PISKEL_RESET);
    $.publish(Events.PISKEL_SAVE_STATE, {
      type : pskl.service.HistoryService.SNAPSHOT
    });
   };
})();;(function () {
  var ns = $.namespace('pskl.tools.transform');

  ns.Flip = function () {
    this.toolId = "tool-flip";
    this.helpText = "Flip vertically";
    this.tooltipDescriptors = [
      {key : 'alt', description : 'Flip horizontally'},
      {key : 'ctrl', description : 'Apply to all layers'},
      {key : 'shift', description : 'Apply to all frames'}
    ];
  };

  pskl.utils.inherit(ns.Flip, ns.Transform);

  ns.Flip.prototype.applyToolOnFrame_ = function (frame, altKey) {
    var axis;

    if (altKey) {
      axis = pskl.utils.FrameTransform.HORIZONTAL;
    } else {
      axis = pskl.utils.FrameTransform.VERTICAL;
    }

    pskl.utils.FrameTransform.flip(frame, axis);
  };

})();;(function () {
  var ns = $.namespace('pskl.tools.transform');

  ns.Rotate = function () {
    this.toolId = "tool-rotate";
    this.helpText = "Counter-clockwise rotation";
    this.tooltipDescriptors = [
      {key : 'alt', description : 'Clockwise rotation'},
      {key : 'ctrl', description : 'Apply to all layers'},
      {key : 'shift', description : 'Apply to all frames'}];
  };

  pskl.utils.inherit(ns.Rotate, ns.Transform);

  ns.Rotate.prototype.applyToolOnFrame_ = function (frame, altKey) {
    var direction;

    if (altKey) {
      direction = pskl.utils.FrameTransform.CLOCKWISE;
    } else {
      direction = pskl.utils.FrameTransform.COUNTERCLOCKWISE;
    }

    pskl.utils.FrameTransform.rotate(frame, direction);
  };

})();;(function () {
  var ns = $.namespace('pskl.worker');

  var imageProcessorWorker = function () {
    var currentStep, currentProgress, currentTotal;

    var initStepCounter_ = function (total) {
      currentStep = 0;
      currentProgress = 0;
      currentTotal = total;
    };

    var postStep_ = function () {
      currentStep = currentStep + 1;
      var progress = ((currentStep / currentTotal) *100).toFixed(1);
      if (progress != currentProgress) {
        currentProgress = progress;
        this.postMessage({
          type : 'STEP',
          progress : currentProgress,
          currentStep : currentStep,
          total : currentTotal
        });
      }
    };

    var rgbToHex = function (r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };

    var componentToHex = function (c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    };

    var imageDataToGrid = function (imageData, width, height, transparent) {
      // Draw the zoomed-up pixels to a different canvas context
      var grid = [];
      for (var x = 0 ; x < width ; x++){
        grid[x] = [];
        postStep_();
        for (var y = 0 ; y < height ; y++){
          // Find the starting index in the one-dimensional image data
          var i = (y * width + x)*4;
          var r = imageData[i  ];
          var g = imageData[i+1];
          var b = imageData[i+2];
          var a = imageData[i+3];
          if (a < 125) {
            grid[x][y] = transparent;
          } else {
            grid[x][y] = rgbToHex(r,g,b);
          }
        }
      }
      return grid;
    };

    var getColorsMapFromImageData = function (imageData, width, height) {
      var grid = imageDataToGrid(imageData, width, height, 'transparent');

      var colorsMap = {};
      for (var i = 0 ; i < grid.length ; i++) {
        postStep_();
        for (var j = 0 ; j < grid[i].length ; j++) {
          var color = grid[i][j];
          if (color != 'transparent') {
            colorsMap[color] = true;
          }
        }
      }
      return colorsMap;
    };

    this.onmessage = function(event) {
      try {
        var data = event.data;

        initStepCounter_(data.width * 2);

        var colorsMap = getColorsMapFromImageData(data.imageData, data.width, data.height);

        this.postMessage({
          type : 'SUCCESS',
          colorsMap : colorsMap
        });
      } catch(e) {
        this.postMessage({
          type : 'ERROR',
          message : e.message
        });
      }
    };
  };

  ns.ImageProcessor = function (image, onSuccess, onStep, onError) {
    this.image = image;

    this.onStep = onStep;
    this.onSuccess = onSuccess;
    this.onError = onError;

    // var worker = pskl.utils.WorkerUtils.addPartialWorker(imageProcessorWorker, 'step-counter');
    this.worker = pskl.utils.WorkerUtils.createWorker(imageProcessorWorker, 'image-colors-processor');
    this.worker.onmessage = this.onWorkerMessage.bind(this);
  };

  ns.ImageProcessor.prototype.process = function () {
    var canvas = pskl.utils.CanvasUtils.createFromImage(this.image);
    var imageData = pskl.utils.CanvasUtils.getImageDataFromCanvas(canvas);
    this.worker.postMessage({
      imageData : imageData,
      width : this.image.width,
      height : this.image.height
    });
  };

  ns.ImageProcessor.prototype.createNamespace = function (name) {
    var createNamespace = (function () {
      var parts = name.split('.');
      if (parts.length > 0) {
        var node = this;
        for (var i = 0 ; i < parts.length ; i++) {
          if (!node[parts[i]]) {
            node[parts[i]] = {};
          }
          node = node[parts[i]];
        }
      }
    });
    var script = createNamespace + "";
    script = script.replace(/function \(\) \{/,"").replace(/\}[^}]*$/, "");
    script = "var name = '" + name + "';" + script;

    this.runScript(script);
  };

  ns.ImageProcessor.prototype.onWorkerMessage = function (event) {
    if (event.data.type === 'STEP') {
      this.onStep(event);
    } else if (event.data.type === 'SUCCESS') {
      this.onSuccess(event);
      this.worker.terminate();
    } else if (event.data.type === 'ERROR') {
      this.onError(event);
      this.worker.terminate();
    }
  };

  ns.ImageProcessor.prototype.importAll__ = function (classToImport, classpath) {
    this.createNamespace(classpath);
    for (var key in classToImport) {
      if (classToImport.hasOwnProperty(key)) {
        this.addMethod(classToImport[key], classpath + '.' + key);
      }
    }
  };

  ns.ImageProcessor.prototype.addMethod__ = function (method, name) {
    this.runScript(name  + "=" + method);
  };

  ns.ImageProcessor.prototype.runScript__ = function (script) {
    this.worker.postMessage({
      type : 'RUN_SCRIPT',
      script : this.getScriptAsUrl(script)
    });
  };

  ns.ImageProcessor.prototype.getScriptAsUrl__ = function (script) {
    var blob = new Blob([script], {type: "application/javascript"}); // pass a useful mime type here
    return window.URL.createObjectURL(blob);
  };
})();



;/**
 * @require Constants
 * @require Events
 */
(function () {
  var ns = $.namespace("pskl");
  /**
   * Main application controller
   */
  ns.app = {

    init : function () {
      /**
       * When started from APP Engine, appEngineToken_ (Boolean) should be set on window.pskl
       */
      this.isAppEngineVersion = !!pskl.appEngineToken_;

      this.shortcutService = new pskl.service.keyboard.ShortcutService();
      this.shortcutService.init();

      var size = {
        height : Constants.DEFAULT.HEIGHT,
        width : Constants.DEFAULT.WIDTH
      };

      var descriptor = new pskl.model.piskel.Descriptor('New Piskel', '');
      var piskel = new pskl.model.Piskel(size.width, size.height, descriptor);

      var layer = new pskl.model.Layer("Layer 1");
      var frame = new pskl.model.Frame(size.width, size.height);

      layer.addFrame(frame);
      piskel.addLayer(layer);

      this.corePiskelController = new pskl.controller.piskel.PiskelController(piskel);
      this.corePiskelController.init();

      this.piskelController = new pskl.controller.piskel.PublicPiskelController(this.corePiskelController);
      this.piskelController.init();

      this.paletteImportService = new pskl.service.palette.PaletteImportService();
      this.paletteService = new pskl.service.palette.PaletteService();
      this.paletteService.addDynamicPalette(new pskl.service.palette.CurrentColorsPalette());

      this.paletteController = new pskl.controller.PaletteController();
      this.paletteController.init();

      this.currentColorsService = new pskl.service.CurrentColorsService(this.piskelController);
      this.currentColorsService.init();

      this.palettesListController = new pskl.controller.PalettesListController(this.paletteController, this.currentColorsService);
      this.palettesListController.init();

      this.cursorCoordinatesController = new pskl.controller.CursorCoordinatesController(this.piskelController);
      this.cursorCoordinatesController.init();

      this.drawingController = new pskl.controller.DrawingController(this.piskelController, this.paletteController, $('#drawing-canvas-container'));
      this.drawingController.init();

      this.animationController = new pskl.controller.AnimatedPreviewController(this.piskelController, $('#animated-preview-canvas-container'));
      this.animationController.init();

      this.minimapController = new pskl.controller.MinimapController(this.piskelController, this.animationController, this.drawingController, $('.minimap-container'));
      this.minimapController.init();

      this.previewFilmController = new pskl.controller.PreviewFilmController(this.piskelController, $('#preview-list'));
      this.previewFilmController.init();

      this.layersListController = new pskl.controller.LayersListController(this.piskelController);
      this.layersListController.init();

      this.settingsController = new pskl.controller.settings.SettingsController(this.piskelController);
      this.settingsController.init();

      this.dialogsController = new pskl.controller.dialogs.DialogsController(this.piskelController);
      this.dialogsController.init();

      this.toolController = new pskl.controller.ToolController();
      this.toolController.init();

      this.selectionManager = new pskl.selection.SelectionManager(this.piskelController);
      this.selectionManager.init();

      this.historyService = new pskl.service.HistoryService(this.corePiskelController);
      this.historyService.init();

      this.notificationController = new pskl.controller.NotificationController();
      this.notificationController.init();

/*      this.transformationsController = new pskl.controller.TransformationsController();
      this.transformationsController.init();*/

      this.progressBarController = new pskl.controller.ProgressBarController();
      this.progressBarController.init();

      this.canvasBackgroundController = new pskl.controller.CanvasBackgroundController();
      this.canvasBackgroundController.init();

      this.localStorageService = new pskl.service.LocalStorageService(this.piskelController);
      this.localStorageService.init();

      this.imageUploadService = new pskl.service.ImageUploadService();
      this.imageUploadService.init();

      this.cheatsheetService = new pskl.service.keyboard.CheatsheetService();
      this.cheatsheetService.init();

      this.savedStatusService = new pskl.service.SavedStatusService(this.piskelController);
      this.savedStatusService.init();

      this.backupService = new pskl.service.BackupService(this.piskelController);
      this.backupService.init();

      this.beforeUnloadService = new pskl.service.BeforeUnloadService(this.piskelController);
      this.beforeUnloadService.init();

      this.fileDropperService = new pskl.service.FileDropperService(this.piskelController, $('#drawing-canvas-container').get(0));
      this.fileDropperService.init();

      if (this.isAppEngineVersion) {
        this.storageService = new pskl.service.AppEngineStorageService(this.piskelController);
      } else {
        this.storageService = new pskl.service.GithubStorageService(this.piskelController);
      }
      this.storageService.init();

      var drawingLoop = new pskl.rendering.DrawingLoop();
      drawingLoop.addCallback(this.render, this);
      drawingLoop.start();

      this.initTooltips_();

      var piskelData = this.getPiskelInitData_();
      if (piskelData && piskelData.piskel) {
        this.loadPiskel_(piskelData.piskel, piskelData.descriptor, piskelData.fps);
      }

      if (pskl.devtools) {
        pskl.devtools.init();
      }
    },

    loadPiskel_ : function (serializedPiskel, descriptor, fps) {
      pskl.utils.serialization.Deserializer.deserialize(serializedPiskel, function (piskel) {
        piskel.setDescriptor(descriptor);
        pskl.app.piskelController.setPiskel(piskel);
        pskl.app.animationController.setFPS(fps);
      });
    },

    getPiskelInitData_ : function () {
      return pskl.appEnginePiskelData_;
    },

    isLoggedIn : function () {
      var piskelData = this.getPiskelInitData_();
      return piskelData && piskelData.isLoggedIn;
    },

    initTooltips_ : function () {
      $('body').tooltip({
        selector: '[rel=tooltip]'
      });
    },

    render : function (delta) {
      this.drawingController.render(delta);
      this.animationController.render(delta);
      this.previewFilmController.render(delta);
    },

    getFirstFrameAsPng : function () {
      var firstFrame = this.piskelController.getFrameAt(0);
      var canvasRenderer = new pskl.rendering.CanvasRenderer(firstFrame, 1);
      canvasRenderer.drawTransparentAs('rgba(0,0,0,0)');
      var firstFrameCanvas = canvasRenderer.render();
      return firstFrameCanvas.toDataURL("image/png");
    },

    getFramesheetAsPng : function () {
      var renderer = new pskl.rendering.PiskelRenderer(this.piskelController);
      var framesheetCanvas = renderer.renderAsCanvas();
      return framesheetCanvas.toDataURL("image/png");
    },

    getFramesheetAsBlob : function (cb, type) {
      var renderer = new pskl.rendering.PiskelRenderer(this.piskelController);
      var framesheetCanvas = renderer.renderAsCanvas();
      pskl.utils.BlobUtils.canvasToBlob(framesheetCanvas, cb, type);
    }
  };
})();

;(function () {
  var flipFrame = function (frame, horizontal, vertical) {
    var clone = frame.clone();
    var w = frame.getWidth();
    var h = frame.getHeight();
    clone.forEachPixel(function (color, x, y) {
      if (horizontal) {
        x = w-x-1;
      }
      if (vertical) {
        y = h-y-1;
      }
      frame.pixels[x][y] = color;
    });
    frame.version++;
  };

  window.flip = function (horizontal, vertical) {
    var currentFrameIndex = pskl.app.piskelController.getCurrentFrameIndex();
    var layers = pskl.app.piskelController.getLayers();
    layers.forEach(function (layer) {
      flipFrame(layer.getFrameAt(currentFrameIndex), horizontal, vertical);
    });
    $.publish(Events.PISKEL_RESET);
    $.publish(Events.PISKEL_SAVE_STATE, {
      type : pskl.service.HistoryService.SNAPSHOT
    });
  };

  window.copyToAll = function () {
    var ref = pskl.app.piskelController.getCurrentFrame();
    var layer = pskl.app.piskelController.getCurrentLayer();
    layer.getFrames().forEach(function (frame) {
      if (frame !==  ref) {
        frame.setPixels(ref.getPixels());
      }
    });
    $.publish(Events.PISKEL_RESET);
    $.publish(Events.PISKEL_SAVE_STATE, {
      type : pskl.service.HistoryService.SNAPSHOT
    });
  };
})();