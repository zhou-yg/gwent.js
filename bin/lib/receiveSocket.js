'use strict';

/**
* Created by zyg on 17/3/4.
*/
var types = require('./types');

module.exports = function (socket) {
  return function (store) {
    return function (next) {

      socket.on(types.SOCKET_ROUTE, function (action) {
        console.log('接收:', action);

        next(action);
      });

      return function (action) {

        next(action);
      };
    };
  };
};