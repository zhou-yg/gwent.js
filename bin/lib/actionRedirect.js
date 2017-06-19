'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by zyg on 17/3/4.
 */
var types = require('./types');

module.exports = function (socket) {
  return function (store) {
    return function (next) {
      return function (action) {

        try {
          (0, _stringify2.default)(action);
        } catch (e) {
          console.error(e);
        }

        if (action.from === types.BROWSER_TAG) {
          //....send to server
          delete action.from;

          socket.emit(types.SOCKET_ROUTE, action);

          return;
        } else if (action.from === types.SERVER_TAG) {

          delete action.from;

          return;
        }

        return next(action);
      };
    };
  };
};