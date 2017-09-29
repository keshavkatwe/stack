'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = {
  /**
   *
   * @param Object Array or List
   * @param Callback for list
   */
  forEach: function forEach(obj, callback) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object') {
      for (var key in obj) {
        callback(obj[key], key);
      }
    }
  },
  filter: function filter(obj, callback) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object') {
      var resultObj = this.isArray(obj) ? [] : {};
      for (var key in obj) {
        if (callback(obj[key], key)) {
          if (this.isArray(obj)) {
            resultObj.push(obj[key]);
          } else {
            resultObj[key] = obj[key];
          }
        }
      }
      return resultObj;
    }
  },
  map: function map(obj, callback) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object') {
      var resultObj = this.isArray(obj) ? [] : {};
      for (var key in obj) {

        if (this.isArray(obj)) {
          resultObj.push(callback(obj[key], key));
        } else {
          resultObj[key] = callback(obj[key], key);
        }
      }
      return resultObj;
    }
  },
  isArray: function isArray(obj) {
    return Array.isArray(obj);
  }
};
module.exports = exports['default'];