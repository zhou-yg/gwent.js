'use strict';

/**
 * Created by zyg on 17/3/4.
 */
var types = require('./types');

module.exports = function (socket) {
  return function (store) {
    return function (next) {
      return function (action) {

        try {
          JSON.stringify(action);
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